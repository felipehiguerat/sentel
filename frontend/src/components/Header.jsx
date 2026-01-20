import { Server, Lock } from 'lucide-react';

export const Header = ({ isConnected, isUnderAttack }) => {
  return (
    // CAMBIOS CLAVE:
    // 1. ml-0 md:ml-20 -> Elimina el margen izquierdo en móvil, lo mantiene en escritorio.
    // 2. px-4 md:px-8 -> Reduce el padding lateral en móvil.
    // 3. h-auto py-3 md:h-16 md:py-0 -> Altura flexible en móvil por si el texto se envuelve.
    <header className="h-auto md:h-16 py-3 md:py-0 border-b border-slate-800 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-8 bg-slate-900/50 backdrop-blur-md ml-0 md:ml-20 sticky top-0 z-40">

      {/* Lado Izquierdo: Título y Estado */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
        
        {/* Título: Texto más pequeño en móvil (text-sm) */}
        <h1 className="text-sm md:text-xl font-bold tracking-widest text-slate-100 whitespace-nowrap">
          SENTINEL: <span className="text-red-500">LEVEL OMEGA</span>
        </h1>

        <div className="flex items-center gap-2">
            {/* Alerta de Ataque: Texto más compacto en móvil */}
            {isUnderAttack && (
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] md:text-xs border border-red-500 rounded animate-pulse font-bold whitespace-nowrap">
                ⚠ <span className="hidden sm:inline">UNDER </span>ATTACK
            </span>
            )}

            {/* Estado de Conexión: Icono + Texto condicional */}
            <span className={`text-[10px] font-mono border px-2 py-0.5 rounded whitespace-nowrap ${isConnected
                ? 'text-green-500 border-green-500/30 bg-green-500/10'
                : 'text-red-500 border-red-500/30 bg-red-500/10'
            }`}>
            {isConnected ? '● ONLINE' : '○ OFF'}
            </span>
        </div>
      </div>

      {/* Lado Derecho: Decoración Técnica */}
      {/* CAMBIO: hidden md:flex -> Ocultamos esto en el celular porque es decorativo y quita espacio vital */}
      <div className="hidden md:flex gap-6 text-xs text-slate-500 font-mono">
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