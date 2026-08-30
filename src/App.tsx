/**
 * AegisNet-BotRadar: Aplicación Web Analítica Open-Source y Apartidista
 * Detección temprana de granjas de bots, campañas de desinformación coordinada (CIB)
 * e injerencias en procesos electorales y temáticas críticas.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkGraph } from './components/NetworkGraph';
import { TemporalAnalysisView } from './components/TemporalAnalysisView';
import { SemanticNLPView } from './components/SemanticNLPView';
import { GeopoliticalMapView } from './components/GeopoliticalMapView';
import { OSINTActionLineView } from './components/OSINTActionLineView';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { DataIngestionModal } from './components/DataIngestionModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { ForensicReportModal } from './components/ForensicReportModal';
import { HowToGuideModal } from './components/HowToGuideModal';
import { AboutModal } from './components/AboutModal';
import { AboutView } from './components/AboutView';
import { WelcomeModal } from './components/WelcomeModal';
import { FunnelBanner } from './components/FunnelBanner';
import { Footer } from './components/Footer';

import { DEMO_CAMPAIGNS } from './data/campaigns';
import { InvestigationCampaign, SocialAccountNode, NetworkEdge } from './types/botradar';
import { computeComprehensiveCIBScore } from './services/cibEngine';
import { fetchCampaigns, fetchCampaignDetail, apiHealth, HealthResponse } from './services/api';


export default function App() {
  const [campaigns, setCampaigns] = useState<InvestigationCampaign[]>(DEMO_CAMPAIGNS as InvestigationCampaign[]);
  const [activeCampaign, setActiveCampaign] = useState<InvestigationCampaign>(DEMO_CAMPAIGNS[0] as InvestigationCampaign);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('backend no conectado');
  const [healthInfo, setHealthInfo] = useState<HealthResponse | null>(null);
  const [appVersion, setAppVersion] = useState<string>('1.2.0');
  const [activeTab, setActiveTab] = useState<'graph' | 'temporal' | 'nlp' | 'geo' | 'action' | 'about'>('action');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);

  // Cargar campañas REALES desde el backend; si falla, queda en modo demo.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const health = await apiHealth();
        if (health) {
          setHealthInfo(health);
          if (health.version) setAppVersion(health.version);
        }
        if (health && health.ok && health.existeEstado) {
          setIsDemo(false);
          setDataSource(`datos reales oasis.py (${health.fechaSenales})`);
          let loaded: InvestigationCampaign[] = [];
          try {
            const summaries = await fetchCampaigns();
            if (!cancelled && summaries.length > 0) {
              for (const s of summaries.slice(0, 20)) {
                try {
                  const detail = await fetchCampaignDetail(s.id);
                  loaded.push(detail);
                } catch {
                  /* omitir campaña con detalle no disponible */
                }
              }
              loaded.forEach((c, i) => { c.id = c.id || `real_${i}`; });
              loaded.sort((a, b) => (b.cibBreakdown?.overallScore || 0) - (a.cibBreakdown?.overallScore || 0));
            }
          } catch {
            /* las campañas pueden fallar por el challenge CF; no entramos en demo si el health es valido */
          }
          if (!cancelled && loaded.length > 0) {
            setCampaigns(loaded);
            setActiveCampaign(loaded[0]);
          }
        }
      } catch {
        /* sin backend: se mantiene modo demo */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Modals state
  const [selectedNode, setSelectedNode] = useState<SocialAccountNode | null>(null);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Handle adding newly ingested streaming nodes from Multi-API connector
  const handleAddIngestedNodes = (newNodes: SocialAccountNode[], newEdges: NetworkEdge[]) => {
    const updatedNodes = [...activeCampaign.nodes, ...newNodes];
    const updatedEdges = [...activeCampaign.edges, ...newEdges];

    // Recalculate dynamic CIB score with new incoming evidence
    const updatedCIB = computeComprehensiveCIBScore(updatedNodes, updatedEdges);

    const updatedCampaign: InvestigationCampaign = {
      ...activeCampaign,
      nodes: updatedNodes,
      edges: updatedEdges,
      cibBreakdown: updatedCIB,
      totalCollectedEvents: activeCampaign.totalCollectedEvents + newNodes.length * 12
    };

    setActiveCampaign(updatedCampaign);
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
  };

  // Handle creating a brand new investigation campaign from user input topic
  const handleCreateNewCampaign = (newCampaign: InvestigationCampaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    setActiveCampaign(newCampaign);
    setIsIngestionOpen(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0A0C10] text-[#E2E8F0] font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar with Campaign Selector, CIB Status & Global Actions */}
      <Navbar
        campaigns={campaigns}
        activeCampaign={activeCampaign}
        onSelectCampaign={setActiveCampaign}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenHowTo={() => setIsHowToOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Funnel global: qué gestiona la página (visible en todas las tabs) */}
      <FunnelBanner version={appVersion} campaignTitle={activeCampaign.title} health={healthInfo} isDemo={isDemo} />

      {/* Main View Area (Switched by Tabs) */}
      <main className="relative flex flex-1 overflow-hidden">
        {activeTab === 'graph' && (
          <NetworkGraph
            nodes={activeCampaign.nodes}
            edges={activeCampaign.edges}
            onSelectNode={setSelectedNode}
            selectedNodeId={selectedNode?.id}
          />
        )}

        {activeTab === 'temporal' && (
          <TemporalAnalysisView
            campaign={activeCampaign}
            onSelectNode={setSelectedNode}
          />
        )}

        {activeTab === 'nlp' && (
          <SemanticNLPView campaign={activeCampaign} />
        )}

        {activeTab === 'geo' && (
          <GeopoliticalMapView campaign={activeCampaign} />
        )}

        {activeTab === 'action' && (
          <OSINTActionLineView
            campaign={activeCampaign}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenHowTo={() => setIsHowToOpen(true)}
            health={healthInfo}
            isDemo={isDemo}
            version={appVersion}
          />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Institutional Footer with Mandatory Copyright Credit */}
      <Footer onOpenHowTo={() => setIsHowToOpen(true)} version={appVersion} />

      {/* Modals & Dialogs */}
      {selectedNode && (
        <NodeInspectorModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <DataIngestionModal
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onAddIngestedNodes={handleAddIngestedNodes}
        onCreateNewCampaign={handleCreateNewCampaign}
        activeCampaignTitle={activeCampaign.title}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        campaign={activeCampaign}
      />

      <HowToGuideModal
        isOpen={isHowToOpen}
        onClose={() => setIsHowToOpen(false)}
        onNavigateToActionLine={() => setActiveTab('action')}
        onOpenIngestion={() => setIsIngestionOpen(true)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
