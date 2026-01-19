import { useState, useEffect, useRef } from 'react';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [stopReason, setStopReason] = useState(null);

    const [packets, setPackets] = useState([]);
    const [threats, setThreats] = useState([]);
    const [chartHistory, setChartHistory] = useState([]);

    const counters = useRef({ pps: 0, ops: 0, anomalies: 0 });
    const socketRef = useRef(null);

    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
        console.log("[WS] Connecting to:", wsUrl);
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("[WS] OPEN");
            setIsConnected(true);
        };
        ws.onclose = () => {
            console.log("[WS] CLOSE");
            setIsConnected(false);
            setIsRunning(false);
        };
        ws.onerror = (err) => {
            console.error("[WS] ERROR", err);
        };
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // CONTROL FRAMES
                if (data?.type === "CONTROL") {
                    console.log("[WS][CONTROL]", data.code, data.message);
                    if (data.code === "START_ACK") {
                        setIsRunning(true);
                        setStopReason(null);
                    } else if (data.code === "STOP_ACK") {
                        setIsRunning(false);
                    } else if (data.code === "LIMIT_REACHED") {
                        setIsRunning(false);
                        setStopReason("SAFETY PROTOCOL: DEMO LIMIT REACHED");
                    }
                    return;
                }

                // PACKETS
                if (!data?.src_ip) return;

                counters.current.pps += 1;
                if (data.is_anomaly) {
                    counters.current.ops += 6;
                    counters.current.anomalies += 1;
                    setThreats(prev => [
                        { ...data, time: new Date().toLocaleTimeString(), id: Math.random().toString(36).slice(2) },
                        ...prev.slice(0, 50)
                    ]);
                }
                setPackets(prev => [...prev.slice(-25), { ...data, id: Math.random() }]);
            } catch (e) {
                // heartbeats/otros
            }
        };

        return () => ws.close();
    }, []);

    const toggleSimulation = () => {
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (isRunning) {
            ws.send("STOP");
            // el STOP real llega por STOP_ACK
        } else {
            ws.send("START");
            // marcado final llega por START_ACK
        }
    };

    useEffect(() => {
        const id = setInterval(() => {
            const snapshot = {
                time: new Date().toLocaleTimeString(),
                pps: counters.current.pps,
                ops: counters.current.ops,
                anomalies: counters.current.anomalies
            };
            setChartHistory(prev => [...prev.slice(-30), snapshot]);
            counters.current = { pps: 0, ops: 0, anomalies: 0 };
        }, 1000);
        return () => clearInterval(id);
    }, []);

    const currentStats = chartHistory[chartHistory.length - 1] || { pps: 0, ops: 0, anomalies: 0 };

    return { isConnected, isRunning, stopReason, toggleSimulation, packets, threats, chartHistory, currentStats };
};