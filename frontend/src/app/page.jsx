'use client';
import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
// ... imports components ...
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ThreatFeed } from '../components/ThreatFeed';
import { Visualizer } from '../components/Visualizer';
import { DashboardStats } from '../components/DashboardStats';
import { AttackModal } from '../components/AttackModal';

export default function Home() {
  const { isConnected, isRunning, stopReason, toggleSimulation, packets, threats, chartHistory, currentStats } = useSocket();
  const [selectedThreat, setSelectedThreat] = useState(null);

  const isUnderAttack = currentStats.anomalies > 0;
  const latestThreat = threats.length > 0 ? threats[0] : null;

  return (
    // CAMBIO 1: 'flex-col' en móvil para apilar cosas si fuera necesario.
    // CAMBIO 2: 'overflow-y-auto' en móvil (permite scroll), 'md:overflow-hidden' en desktop (app fija).
    <div className="flex flex-col md:flex-row h-screen bg-[#0f111a] text-slate-200 overflow-y-auto md:overflow-hidden font-mono selection:bg-red-500/30">

      <AttackModal threat={selectedThreat} onClose={() => setSelectedThreat(null)} />

      {/* CAMBIO 3: Ocultar Sidebar en móvil (hidden), mostrar en desktop (md:block).
          En móvil usualmente se usa un menú hamburguesa en el Header en lugar de esta barra lateral fija. */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MAIN CONTAINER */}
      {/* CAMBIO 4: Quitar márgenes en móvil (ml-0 mr-0). Restaurarlos en desktop (md:ml-20 md:mr-96) */}
      <main className="flex-1 flex flex-col ml-0 md:ml-20 mr-0 md:mr-96 relative h-auto md:h-full transition-all duration-300">
        
        <Header isConnected={isConnected} isUnderAttack={isUnderAttack} />

        {/* Contenedor del Visualizer: Asegurar altura mínima en móvil */}
        <div className="flex-1 min-h-[50vh] md:min-h-0 relative">
            <Visualizer
            packets={packets}
            isUnderAttack={isUnderAttack}
            latestThreat={latestThreat}
            isRunning={isRunning}
            stopReason={stopReason}
            onToggle={toggleSimulation}
            />
        </div>

        {/* DashboardStats ahora se apilará abajo y se podrá hacer scroll para verlo */}
        <DashboardStats chartHistory={chartHistory} currentStats={currentStats} />
      </main>

      {/* CAMBIO 5: ThreatFeed.
          En desktop es fijo a la derecha (asumo por tu margin-right-96).
          En móvil lo ocultamos (hidden) o lo ponemos debajo (block), pero el componente ThreatFeed
          probablemente tenga posición 'fixed' interna.
          
          Opción A (Recomendada): Ocultarlo en móvil para no tapar la pantalla.
      */}
      <div className="hidden md:block">
         <ThreatFeed threats={threats} onSelectThreat={setSelectedThreat} />
      </div>

    </div>
  );
}