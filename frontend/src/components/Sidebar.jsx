import { Shield, Activity } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-20 border-r border-slate-800 flex flex-col items-center py-6 bg-slate-900/50 backdrop-blur-sm z-20 h-screen fixed left-0 top-0">

      {/* Logo / Identidad */}
      <div className="bg-red-600 p-2 rounded-lg mb-8 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
        <Shield className="text-white w-6 h-6" />
      </div>

      {/* Línea Decorativa Vertical */}
      <div className="flex-1 w-0.5 bg-slate-800 relative">
        {/* Punto brillante decorativo */}
        <div className="absolute top-1/4 -left-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
      </div>

      {/* Botón de Acción (Simulado) */}
      <button className="mt-8 bg-red-600/20 text-red-500 p-3 rounded-md border border-red-500/50 hover:bg-red-600 hover:text-white transition-all duration-300 group">
        <Activity size={20} className="group-hover:animate-pulse" />
      </button>

    </aside>
  );
};