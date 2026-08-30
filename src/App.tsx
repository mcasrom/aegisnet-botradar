/**
 * AegisNet-BotRadar: Aplicación Web Analítica Open-Source y Apartidista
 * Detección temprana de granjas de bots, campañas de desinformación coordinada (CIB)
 * e injerencias en procesos electorales y temáticas críticas.
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
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
import { Footer } from './components/Footer';

import { INITIAL_CAMPAIGNS } from './data/campaigns';
import { InvestigationCampaign, SocialAccountNode, NetworkEdge } from './types/botradar';
import { computeComprehensiveCIBScore } from './services/cibEngine';

const STORAGE_CAMPAIGNS_KEY = 'aegisnet_campaigns_history_v1';

export default function App() {
  const [campaigns, setCampaigns] = useState<InvestigationCampaign[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CAMPAIGNS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Retain custom user-created campaigns, but ensure built-in campaigns load updated forensic schema
          const builtInIds = new Set(INITIAL_CAMPAIGNS.map((c) => c.id));
          const customCampaigns = parsed.filter((c: InvestigationCampaign) => !builtInIds.has(c.id));
          return [...INITIAL_CAMPAIGNS, ...customCampaigns];
        }
      }
    } catch {
      // ignore JSON parse errors and fallback
    }
    return INITIAL_CAMPAIGNS;
  });

  const [activeCampaign, setActiveCampaign] = useState<InvestigationCampaign>(() => {
    return campaigns[0] || INITIAL_CAMPAIGNS[0];
  });
  const [activeTab, setActiveTab] = useState<'graph' | 'temporal' | 'nlp' | 'geo' | 'action'>('action');

  // Save campaigns history whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (e) {
      console.warn('No se pudo persistir en localStorage:', e);
    }
  }, [campaigns]);

  // Modals state
  const [selectedNode, setSelectedNode] = useState<SocialAccountNode | null>(null);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHowToOpen, setIsHowToOpen] = useState(false);

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
      />

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
          />
        )}
      </main>

      {/* Institutional Footer with Mandatory Copyright Credit */}
      <Footer onOpenHowTo={() => setIsHowToOpen(true)} />

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
    </div>
  );
}
