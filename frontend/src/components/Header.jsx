import { Server, Lock } from 'lucide-react';

export const Header = ({ isConnected, isUnderAttack }) => {
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md ml-20">

      {/* Lado Izquierdo: Título y Estado */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-widest text-slate-100">
          SENTINEL: <span className="text-red-500">LEVEL OMEGA</span>
        </h1>

        {/* Alerta de Ataque Condicional */}
        {isUnderAttack && (
          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs border border-red-500 rounded animate-pulse font-bold">
            ⚠ UNDER ATTACK
          </span>
        )}

        {/* Estado de Conexión */}
        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${isConnected
            ? 'text-green-500 border-green-500/30 bg-green-500/10'
            : 'text-red-500 border-red-500/30 bg-red-500/10'
          }`}>
          {isConnected ? '● SYSTEM ONLINE' : '○ DISCONNECTED'}
        </span>
      </div>

      {/* Lado Derecho: Decoración Técnica */}
      <div className="flex gap-6 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Server size={14} />
          <span>US-EAST-1</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} />
          <span>ENCRYPTED_V2</span>
        </div>
      </div>

    </header>
  );
};