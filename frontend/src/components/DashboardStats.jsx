import { LineChart, Line, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

export const DashboardStats = ({ chartHistory, currentStats }) => {
    return (
        // CAMBIO 1: h-auto para móvil (crece según contenido), md:h-48 para escritorio.
        // CAMBIO 2: grid-cols-1 para móvil (una columna), md:grid-cols-3 para escritorio.
        <div className="h-auto md:h-48 border-t border-slate-800 bg-slate-900/80 grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800 backdrop-blur-sm z-20">

            {/* 1. TRAFFIC INGRESS */}
            <div className="bg-[#0f111a] p-5 flex flex-col justify-between group hover:bg-[#131620] transition-colors min-h-[180px] md:min-h-0">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Traffic Ingress</div>
                        <div className="text-3xl font-bold text-white font-mono">
                            {currentStats.pps} <span className="text-xs text-slate-500 font-sans font-normal">pkts/sec</span>
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartHistory}>
                            <defs>
                                <linearGradient id="colorPps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="pps"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPps)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. REDIS THROUGHPUT */}
            <div className="bg-[#0f111a] p-5 flex flex-col justify-between group hover:bg-[#131620] transition-colors min-h-[180px] md:min-h-0">
                <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Redis Ops</div>
                    <div className="text-3xl font-bold text-blue-400 font-mono">
                        {currentStats.ops} <span className="text-xs text-slate-500 font-sans font-normal">ops/sec</span>
                    </div>
                </div>

                <div className="h-24 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartHistory}>
                            <Bar
                                dataKey="ops"
                                fill="#60a5fa"
                                radius={[2, 2, 0, 0]}
                                isAnimationActive={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. ACTIVE THREATS */}
            <div className="bg-[#0f111a] p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-[#131620] transition-colors min-h-[180px] md:min-h-0">
                <div className="relative z-10">
                    <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Anomalies Detected</div>
                    <div className="text-3xl font-bold text-red-500 font-mono">
                        +{currentStats.anomalies}
                    </div>
                </div>

                {currentStats.anomalies > 0 && (
                    <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none" />
                )}

                <div className="h-24 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartHistory}>
                            <Line
                                type="step"
                                dataKey="anomalies"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};