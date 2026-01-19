import { Globe, AlertTriangle, Play, Square, ShieldCheck, AlertOctagon } from 'lucide-react';

// Recibimos 'stopReason' como prop nueva
export const Visualizer = ({ packets, isUnderAttack, latestThreat, isRunning, onToggle, stopReason }) => {
    return (
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#0f111a]">

            {/* ... (Fondo y Nodo central IGUAL que antes) ... */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="relative w-full h-full max-w-5xl max-h-[600px] flex items-center justify-center">

                <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-500 ${isUnderAttack ? 'border-red-500 bg-red-900/20 shadow-red-500/50 scale-110' : 'border-blue-500 bg-blue-900/20 shadow-blue-500/50'}`}>
                    <Globe className={`w-10 h-10 transition-colors duration-300 ${isUnderAttack ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                    <div className={`absolute inset-0 rounded-full border border-current opacity-20 animate-ping ${isUnderAttack ? 'text-red-500' : 'text-blue-500'}`} />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    {packets.map((pkt) => {
                        const angle = Math.random() * Math.PI * 2;
                        const r = 450; const cx = 500; const cy = 300;
                        const x = Math.cos(angle) * r + cx;
                        const y = Math.sin(angle) * r + cy;
                        return (
                            <line key={pkt.id} x1={x} y1={y} x2="50%" y2="50%" stroke={pkt.is_anomaly ? '#ef4444' : '#3b82f6'} strokeWidth={pkt.is_anomaly ? "3" : "1"} strokeOpacity={pkt.is_anomaly ? "1" : "0.4"} className="animate-packet-in" />
                        );
                    })}
                </svg>

                {/* --- ÁREA DE CONTROLES (Inferior Derecha) --- */}
                <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">

                    {/* MENSAJE DE PARADA (Solo aparece si hay stopReason y NO está corriendo) */}
                    {stopReason && !isRunning && (
                        <div className="bg-orange-900/80 border border-orange-500/50 px-4 py-2 rounded text-orange-400 text-xs font-bold font-mono tracking-wider flex items-center gap-2 animate-in slide-in-from-right fade-in">
                            <AlertOctagon size={14} />
                            {stopReason}
                        </div>
                    )}

                    {/* BOTÓN START/STOP */}
                    <button
                        onClick={onToggle}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 shadow-lg font-bold tracking-wider
              ${isRunning
                                ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                                : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse'
                            }`}
                    >
                        {isRunning ? (
                            <> <Square size={18} fill="currentColor" /> STOP SIMULATION </>
                        ) : (
                            <> <Play size={18} fill="currentColor" /> INITIATE ATTACK </>
                        )}
                    </button>
                </div>

                {/* ALERTA TARGET ISOLATED (Inferior Izquierda) */}
                {isUnderAttack && latestThreat && (
                    <div className="absolute bottom-6 left-6 z-20 bg-black/90 border border-red-600 p-4 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-4 animate-in slide-in-from-bottom duration-500">
                        <div className="bg-red-600 p-3 rounded animate-pulse">
                            <AlertTriangle className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mb-1">Target Isolated</div>
                            <div className="text-white text-xl font-bold font-mono tracking-wide">{latestThreat.src_ip}</div>
                            <div className="text-orange-400 font-bold bg-orange-900/20 px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-2 mt-1 border border-orange-500/30">
                                <ShieldCheck size={12} /> ACTION REQUIRED: MITIGATION PENDING
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};