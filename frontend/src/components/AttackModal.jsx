import { X, ShieldAlert, Terminal, Activity } from 'lucide-react';

export const AttackModal = ({ threat, onClose }) => {
  // Si no hay amenaza seleccionada, no renderizamos nada
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">

      {/* Contenedor Principal del Modal */}
      <div className="bg-slate-900 border border-red-500 w-full max-w-2xl shadow-[0_0_50px_rgba(220,38,38,0.4)] rounded-lg overflow-hidden relative">

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Encabezado */}
        <div className="bg-red-950/30 p-6 border-b border-red-500/30 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/50">
            <ShieldAlert className="text-red-500 w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-500 tracking-widest uppercase">Threat Analysis Report</h2>
            <p className="text-red-400/60 text-xs font-mono">INCIDENT ID: {threat.id || 'UNKNOWN'}</p>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 space-y-6">

          {/* Grid de Datos Clave */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/50 p-4 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Source IP</span>
              <span className="text-white text-xl font-mono font-bold text-red-400">{threat.src_ip}</span>
            </div>
            <div className="bg-black/50 p-4 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Target IP</span>
              <span className="text-white text-xl font-mono font-bold">{threat.dst_ip}</span>
            </div>
            <div className="bg-black/50 p-4 rounded border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-1">Severity</span>
              <span className="text-red-500 text-xl font-bold uppercase flex items-center gap-2">
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
              {/* Efecto visual de escaneo */}
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

          {/* Acciones */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
            >
              INITIATE FIREWALL BLOCK
            </button>
            <button
              onClick={onClose}
              className="px-6 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded font-bold transition-colors"
            >
              IGNORE
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};