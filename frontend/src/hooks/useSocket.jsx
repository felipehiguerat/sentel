import { useState, useEffect, useRef } from 'react';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // NUEVO ESTADO: Para guardar el mensaje de por qué se detuvo
    const [stopReason, setStopReason] = useState(null);

    const [packets, setPackets] = useState([]);
    const [threats, setThreats] = useState([]);
    const [chartHistory, setChartHistory] = useState([]);

    const counters = useRef({ pps: 0, ops: 0, anomalies: 0 });
    const socketRef = useRef(null);

    useEffect(() => {
        const wsUrl = 'ws://localhost:8000/api/v1/ws/traffic';
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => setIsConnected(true);
        socketRef.current.onclose = () => {
            setIsConnected(false);
            setIsRunning(false);
        };

        socketRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // --- CONTROL DE LÍMITE ---
                if (data.type === "CONTROL" && data.code === "LIMIT_REACHED") {
                    setIsRunning(false);
                    // Guardamos el mensaje para mostrarlo en la UI
                    setStopReason("SAFETY PROTOCOL: DEMO LIMIT REACHED (150 EVENTS)");
                    return;
                }

                if (!data.src_ip) return;

                counters.current.pps += 1;
                if (data.is_anomaly) {
                    counters.current.ops += 6;
                    counters.current.anomalies += 1;
                    setThreats(prev => [{ ...data, time: new Date().toLocaleTimeString(), id: Math.random().toString(36).substr(2, 9) }, ...prev.slice(0, 50)]);
                }
                setPackets(prev => [...prev.slice(-25), { ...data, id: Math.random() }]);
            } catch (e) {
                // Ignorar
            }
        };

        return () => socketRef.current?.close();
    }, []);

    const toggleSimulation = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            if (isRunning) {
                socketRef.current.send("STOP");
                setIsRunning(false);
                setStopReason("MANUAL ABORT"); // Mensaje opcional si lo paras tú
            } else {
                socketRef.current.send("START");
                setIsRunning(true);
                setStopReason(null); // ¡Limpiamos el mensaje al reiniciar!
                setPackets([]);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const snapshot = {
                time: new Date().toLocaleTimeString(),
                pps: counters.current.pps,
                ops: counters.current.ops,
                anomalies: counters.current.anomalies
            };
            setChartHistory(prev => [...prev.slice(-30), snapshot]);
            counters.current = { pps: 0, ops: 0, anomalies: 0 };
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const currentStats = chartHistory[chartHistory.length - 1] || { pps: 0, ops: 0, anomalies: 0 };

    // Retornamos stopReason también
    return { isConnected, isRunning, stopReason, toggleSimulation, packets, threats, chartHistory, currentStats };
};