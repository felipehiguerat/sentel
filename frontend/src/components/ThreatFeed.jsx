import { useEffect, useRef } from 'react';

export const ThreatFeed = ({ threats, onSelectThreat }) => {
  const feedRef = useRef(null);

  return (
    // CAMBIOS IMPORTANTES AQUÍ:
    // 1. Quitamos 'hidden'. Ahora es 'flex' siempre.
    // 2. Móvil: 'w-full relative h-96'. Ocupa todo el ancho, se pone en el flujo normal (abajo) y tiene altura limitada.
    // 3. Desktop (md:): 'md:w-96 md:fixed md:h-screen'. Recupera su forma de barra lateral fija.
    <aside className="flex flex-col border-l border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm z-20
      w-full relative h-96 mt-4 md:mt-0
      md:w-96 md:fixed md:right-0 md:top-0 md:h-screen
    ">

      {/* Título del Panel */}
      <div className="flex justify-between items-center mb-6 text-xs font-mono uppercase text-slate-400 border-b border-slate-800 pb-4 mt-2">
        <span>Tactical Threat Feed</span>
        <span className="flex items-center gap-2 text-green-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
        </span>
      </div>

      {/* Lista con Scroll */}
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin"
      >
        {threats.length === 0 && (
          <div className="text-slate-600 text-center mt-20 font-mono text-xs">
            Scanning for signatures...
          </div>
        )}

        {threats.map((t) => (
          <div
            key={t.id}
            className="bg-slate-800/40 border-l-2 border-red-500 p-3 rounded-r text-xs animate-in slide-in-from-right fade-in duration-300 group hover:bg-slate-800 transition-colors"
          >
            <div className="flex justify-between text-red-400 font-bold mb-1">
              <span className="animate-pulse">[CRITICAL]</span>
              <span className="opacity-70 font-mono">{t.time}</span>
            </div>

            <p className="text-slate-300 mb-2 font-mono">
              DoS pattern detected. Threshold exceeded.
            </p>

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700/50">
              <span className="text-slate-400 font-mono bg-black/30 px-1 rounded">
                SRC: {t.src_ip}
              </span>

              <button
                onClick={() => onSelectThreat(t)}
                className="bg-red-500/10 text-red-400 border border-red-500/50 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition-all text-[10px] tracking-wider font-bold cursor-pointer"
              >
                DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};