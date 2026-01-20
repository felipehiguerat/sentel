import { Globe, AlertTriangle, Play, Square, ShieldCheck, AlertOctagon } from 'lucide-react';

export const Visualizer = ({ packets, isUnderAttack, latestThreat, isRunning, onToggle, stopReason }) => {
    return (
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#0f111a] w-full">

            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Contenedor Principal */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* NODO CENTRAL (Globo) */}
                <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-500 ${isUnderAttack ? 'border-red-500 bg-red-900/20 shadow-red-500/50 scale-110' : 'border-blue-500 bg-blue-900/20 shadow-blue-500/50'}`}>
                    <Globe className={`w-10 h-10 transition-colors duration-300 ${isUnderAttack ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                    <div className={`absolute inset-0 rounded-full border border-current opacity-20 animate-ping ${isUnderAttack ? 'text-red-500' : 'text-blue-500'}`} />
                </div>

                {/* 
                   CAMBIO 1: SVG RESPONSIBLE
                   Agregamos viewBox="0 0 1000 600" y preserveAspectRatio.
                   Esto crea un sistema de coordenadas virtual de 1000x600. 
                   Tus cálculos (cx=500, cy=300) ahora siempre serán el CENTRO exacto, 
                   sin importar si es un celular o una pantalla gigante.
                */}
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 1000 600" 
                    preserveAspectRatio="xMidYMid slice"
                >
                    {packets.map((pkt) => {
                        const angle = Math.random() * Math.PI * 2;
                        // Tus coordenadas fijas ahora funcionan perfecto gracias al viewBox
                        const r = 450; const cx = 500; const cy = 300;
                        const x = Math.cos(angle) * r + cx;
                        const y = Math.sin(angle) * r + cy;
                        return (
                            <line key={pkt.id} x1={x} y1={y} x2="500" y2="300" stroke={pkt.is_anomaly ? '#ef4444' : '#3b82f6'} strokeWidth={pkt.is_anomaly ? "3" : "1"} strokeOpacity={pkt.is_anomaly ? "1" : "0.4"} className="animate-packet-in" />
                        );
                    })}
                </svg>

                {/* 
                   CAMBIO 2: POSICIÓN DE CONTROLES (BOTÓN START)
                   Móvil: bottom-4 left-4 right-4 (ancho completo, abajo del todo)
                   Desktop: bottom-6 right-6 w-auto (esquina derecha)
                */}
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-30 flex flex-col items-center md:items-end gap-2">

                    {/* MENSAJE DE PARADA */}
                    {stopReason && !isRunning && (
                        <div className="bg-orange-900/80 border border-orange-500/50 px-4 py-2 rounded text-orange-400 text-xs font-bold font-mono tracking-wider flex items-center gap-2 animate-in slide-in-from-right fade-in w-full md:w-auto justify-center">
                            <AlertOctagon size={14} />
                            {stopReason}
                        </div>
                    )}

                    {/* BOTÓN START/STOP */}
                    <button
                        onClick={onToggle}
                        className={`w-full md:w-auto flex justify-center items-center gap-3 px-6 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 shadow-lg font-bold tracking-wider
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

                {/* 
                   CAMBIO 3: POSICIÓN DE ALERTA (TARGET ISOLATED)
                   Móvil: bottom-20 (encima del botón start)
                   Desktop: bottom-6 left-6 (esquina izquierda)
                */}
                {isUnderAttack && latestThreat && (
                    <div className="absolute bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:w-auto z-20 bg-black/90 border border-red-600 p-4 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-4 animate-in slide-in-from-bottom duration-500">
                        <div className="bg-red-600 p-3 rounded animate-pulse shrink-0">
                            <AlertTriangle className="text-white w-6 h-6" />
                        </div>
                        <div className="min-w-0"> {/* min-w-0 ayuda a truncar texto si es muy largo en móvil */}
                            <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mb-1">Target Isolated</div>
                            <div className="text-white text-lg md:text-xl font-bold font-mono tracking-wide truncate">{latestThreat.src_ip}</div>
                            <div className="text-orange-400 font-bold bg-orange-900/20 px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-2 mt-1 border border-orange-500/30">
                                <ShieldCheck size={12} /> ACTION REQUIRED
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};