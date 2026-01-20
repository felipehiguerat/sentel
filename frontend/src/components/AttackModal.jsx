import { X, ShieldAlert, Terminal, Activity } from 'lucide-react';

export const AttackModal = ({ threat, onClose }) => {
  if (!threat) return null;

  return (
    // CAMBIO: 'p-4' para asegurar margen con el borde de la pantalla en móviles
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-4">

      {/* CAMBIO: 'max-h-[90vh]' y 'overflow-y-auto' para permitir scroll si el contenido es muy alto en horizontal */}
      <div className="bg-slate-900 border border-red-500 w-full max-w-2xl shadow-[0_0_50px_rgba(220,38,38,0.4)] rounded-lg overflow-hidden relative max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Botón Cerrar (Sticky para que siempre se vea al hacer scroll) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 bg-slate-900/50 rounded-full p-1"
        >
          <X size={24} />
        </button>

        {/* Encabezado: Padding reducido en móvil (p-4) vs desktop (md:p-6) */}
        <div className="bg-red-950/30 p-4 md:p-6 border-b border-red-500/30 flex items-center gap-4 shrink-0">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/50 shrink-0">
            <ShieldAlert className="text-red-500 w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-red-500 tracking-widest uppercase">Threat Analysis Report</h2>
            <p className="text-red-400/60 text-xs font-mono break-all">INCIDENT ID: {threat.id || 'UNKNOWN'}</p>
          </div>
        </div>

        {/* Cuerpo del Modal: Padding reducido en móvil */}
        <div className="p-4 md:p-8 space-y-6">

          {/* Grid de Datos Clave: 
              CAMBIO: grid-cols-1 en móvil (apilado) -> md:grid-cols-3 en desktop (lado a lado) 
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 p-4 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Source IP</span>
              {/* break-all evita que una IP larga rompa el diseño */}
              <span className="text-white text-lg md:text-xl font-mono font-bold text-red-400 break-all">{threat.src_ip}</span>
            </div>
            <div className="bg-black/50 p-4 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Target IP</span>
              <span className="text-white text-lg md:text-xl font-mono font-bold break-all">{threat.dst_ip}</span>
            </div>
            <div className="bg-black/50 p-4 rounded border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Severity</span>
              <span className="text-red-500 text-lg md:text-xl font-bold uppercase flex items-center gap-2">
                <Activity size={16} /> Critical
              </span>
            </div>
          </div>

          {/* Sección de Payload (JSON) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
              <Terminal size={14} className="text-green-500" />
              Captured Packet Payload
            </div>

            <div className="bg-black p-4 rounded border border-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-green-500/50 shadow-[0_0_10px_#22c55e] animate-scan" />
              <pre className="text-green-500/90 font-mono text-xs overflow-x-auto custom-scrollbar">
                {JSON.stringify({
                  timestamp: threat.timestamp,
                  packet_size: threat.size_bytes + " bytes",
                  protocol: "TCP/SYN",
                  flags: ["SYN", "ACK", "URG"],
                  ttl: 64,
                  window_alert: "THRESHOLD_EXCEEDED_REDIS_ZSET",
                  mitigation_status: "PENDING_APPROVAL"
                }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Acciones:
              CAMBIO: flex-col en móvil (botones uno bajo otro) -> md:flex-row en desktop 
          */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] text-xs md:text-sm"
            >
              INITIATE FIREWALL BLOCK
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded font-bold transition-colors text-xs md:text-sm"
            >
              IGNORE
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};