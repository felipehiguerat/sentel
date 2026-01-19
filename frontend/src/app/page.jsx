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
  // Extraemos stopReason
  const { isConnected, isRunning, stopReason, toggleSimulation, packets, threats, chartHistory, currentStats } = useSocket();
  const [selectedThreat, setSelectedThreat] = useState(null);

  const isUnderAttack = currentStats.anomalies > 0;
  const latestThreat = threats.length > 0 ? threats[0] : null;

  return (
    <div className="flex h-screen bg-[#0f111a] text-slate-200 overflow-hidden font-mono selection:bg-red-500/30">

      <AttackModal threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
      <Sidebar />

      <main className="flex-1 flex flex-col ml-20 mr-96 relative h-full transition-all duration-300">
        <Header isConnected={isConnected} isUnderAttack={isUnderAttack} />

        <Visualizer
          packets={packets}
          isUnderAttack={isUnderAttack}
          latestThreat={latestThreat}
          isRunning={isRunning}
          stopReason={stopReason} // <--- AQUÍ LO PASAMOS
          onToggle={toggleSimulation}
        />

        <DashboardStats chartHistory={chartHistory} currentStats={currentStats} />
      </main>

      <ThreatFeed threats={threats} onSelectThreat={setSelectedThreat} />
    </div>
  );
}