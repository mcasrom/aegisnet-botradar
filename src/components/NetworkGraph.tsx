/**
 * AegisNet-BotRadar: Visualizador Interactivo de Topología de Redes
 * Grafo con renderizado de alto rendimiento en Canvas, simulación física D3,
 * algoritmos de comunidades Louvain y detección visual del patrón Hub-and-Spoke.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Play,
  Pause,
  Layers,
  Search,
  Info,
  ShieldAlert,
  Users,
  Bot,
  Sparkles
} from 'lucide-react';
import { SocialAccountNode, NetworkEdge, NodeType } from '../types/botradar';

interface NetworkGraphProps {
  nodes: SocialAccountNode[];
  edges: NetworkEdge[];
  onSelectNode: (node: SocialAccountNode) => void;
  selectedNodeId?: string | null;
}

type LayoutType = 'force' | 'hub_spoke' | 'louvain';

interface SimNode extends d3.SimulationNodeDatum, SocialAccountNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
  weight: number;
  isBurstEdge: boolean;
  type: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter States
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minCibScore, setMinCibScore] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutType>('force');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Transform states for Pan & Zoom
  const transformRef = useRef<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);

  // D3 simulation reference
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simLinksRef = useRef<SimLink[]>([]);

  // Unique Louvain communities
  const communities = useMemo(() => {
    const set = new Set<number>();
    nodes.forEach((n) => set.add(n.louvainCommunity));
    return Array.from(set).sort((a, b) => a - b);
  }, [nodes]);

  // Filtered nodes based on UI controls
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (selectedType === 'zombie') {
        if (!node.zombieAudit?.isZombieAccount) return false;
      } else if (selectedType !== 'all' && node.type !== selectedType) {
        return false;
      }
      if (node.cibScore < minCibScore) return false;
      if (selectedCommunity !== 'all' && node.louvainCommunity !== Number(selectedCommunity)) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          node.handle.toLowerCase().includes(q) ||
          node.displayName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [nodes, selectedType, minCibScore, selectedCommunity, searchQuery]);

  const filteredNodeIds = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );
  }, [edges, filteredNodeIds]);

  // Node Color scheme based on technical non-partisan classification
  const getNodeColor = (type: NodeType, isSelected: boolean) => {
    if (isSelected) return '#818CF8'; // Indigo accent when selected
    switch (type) {
      case 'coordinator':
        return '#6366F1'; // Indigo coordinator
      case 'bot':
        return '#F43F5E'; // Rose bot
      case 'amplifier':
        return '#F97316'; // Orange amplifier
      case 'organic':
        return '#10B981'; // Emerald organic
      default:
        return '#64748B';
    }
  };

  // Setup D3 Force Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Initialize Sim Nodes with radial sizing
    const simNodes: SimNode[] = filteredNodes.map((n) => {
      const radius =
        n.type === 'coordinator' ? 14 : n.type === 'bot' ? 8 : 10;
      return {
        ...n,
        radius,
        x: n.x ?? width / 2 + (Math.random() - 0.5) * 200,
        y: n.y ?? height / 2 + (Math.random() - 0.5) * 200
      };
    });

    const nodeMap = new Map<string, SimNode>();
    simNodes.forEach((sn) => nodeMap.set(sn.id, sn));

    const simLinks: SimLink[] = filteredEdges
      .map((e) => ({
        source: nodeMap.get(e.source) || e.source,
        target: nodeMap.get(e.target) || e.target,
        weight: e.weight,
        isBurstEdge: e.isBurstEdge,
        type: e.type
      }))
      .filter(
        (l) => typeof l.source === 'object' && typeof l.target === 'object'
      );

    simNodesRef.current = simNodes;
    simLinksRef.current = simLinks;

    // Apply layout logic
    if (layoutMode === 'hub_spoke') {
      // Find top coordinator
      const hub = simNodes.find((n) => n.type === 'coordinator') || simNodes[0];
      if (hub) {
        hub.fx = width / 2;
        hub.fy = height / 2;
        const spokes = simNodes.filter((n) => n.id !== hub.id);
        const angleStep = (2 * Math.PI) / (spokes.length || 1);
        const radius = Math.min(width, height) * 0.38;

        spokes.forEach((spoke, idx) => {
          const angle = idx * angleStep;
          spoke.x = width / 2 + Math.cos(angle) * radius;
          spoke.y = height / 2 + Math.sin(angle) * radius;
        });
      }
    } else if (layoutMode === 'louvain') {
      // Community clusters layout
      const commCenters: Record<number, { x: number; y: number }> = {
        1: { x: width * 0.3, y: height * 0.4 },
        2: { x: width * 0.7, y: height * 0.6 },
        3: { x: width * 0.5, y: height * 0.25 },
        4: { x: width * 0.25, y: height * 0.75 },
        5: { x: width * 0.75, y: height * 0.3 }
      };

      simNodes.forEach((sn) => {
        const center = commCenters[sn.louvainCommunity] || {
          x: width / 2,
          y: height / 2
        };
        sn.x = center.x + (Math.random() - 0.5) * 120;
        sn.y = center.y + (Math.random() - 0.5) * 120;
      });
    }

    // Configure Simulation Forces
    const sim = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => (d.isBurstEdge ? 50 : 100))
          .strength(0.4)
      )
      .force('charge', d3.forceManyBody().strength(layoutMode === 'hub_spoke' ? -80 : -160))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.08))
      .force(
        'collision',
        d3.forceCollide<SimNode>().radius((d) => d.radius + 6)
      )
      .alphaDecay(0.028);

    if (layoutMode === 'louvain') {
      sim.force('x', d3.forceX<SimNode>((d) => {
        if (d.louvainCommunity === 1) return width * 0.3;
        if (d.louvainCommunity === 2) return width * 0.7;
        return width * 0.5;
      }).strength(0.15));

      sim.force('y', d3.forceY<SimNode>((d) => {
        if (d.louvainCommunity === 1) return height * 0.4;
        if (d.louvainCommunity === 2) return height * 0.6;
        return height * 0.5;
      }).strength(0.15));
    }

    simulationRef.current = sim;

    // Render loop
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pan and Zoom Transformation
      const { x, y, k } = transformRef.current;
      ctx.scale(dpr, dpr);
      ctx.translate(x, y);
      ctx.scale(k, k);

      // 1. Draw Edges
      simLinks.forEach((link) => {
        const src = link.source as SimNode;
        const tgt = link.target as SimNode;
        if (!src.x || !src.y || !tgt.x || !tgt.y) return;

        const isBurst = link.isBurstEdge;
        const isHovered =
          hoveredNodeRef.current &&
          (hoveredNodeRef.current.id === src.id ||
            hoveredNodeRef.current.id === tgt.id);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHovered) {
          ctx.strokeStyle = '#818CF8';
          ctx.lineWidth = 2.4;
        } else if (isBurst) {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)'; // Rose synchronous burst
          ctx.lineWidth = 1.6;
        } else {
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();
      });

      // 2. Draw Nodes
      simNodes.forEach((node) => {
        if (!node.x || !node.y) return;

        const isSelected = node.id === selectedNodeId;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const baseColor = getNodeColor(node.type, isSelected);

        // Highlight ring for coordinators or selected
        if (node.type === 'coordinator' || isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + (isSelected ? 6 : 4), 0, 2 * Math.PI);
          ctx.fillStyle = isSelected
            ? 'rgba(129, 140, 248, 0.25)'
            : 'rgba(99, 102, 241, 0.2)';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#818CF8' : '#6366F1';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = baseColor;
        ctx.fill();
        ctx.strokeStyle = '#0A0C10';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Zombie Account Audit indicator ring (Amber dashed halo)
        if (node.zombieAudit?.isZombieAccount) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3.5, 0, 2 * Math.PI);
          ctx.strokeStyle = '#F59E0B'; // Amber
          ctx.lineWidth = 1.8;
          ctx.setLineDash([3, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // High CIB Alert Marker (Indicator dot on node if CIB > 75)
        if (node.cibScore >= 75 && node.type !== 'coordinator') {
          ctx.beginPath();
          ctx.arc(node.x + node.radius * 0.7, node.y - node.radius * 0.7, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffedd5';
          ctx.fill();
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw Labels for coordinators or selected nodes or when zoomed in
        if (node.type === 'coordinator' || isSelected || isHovered || k > 1.4) {
          ctx.font = `${node.type === 'coordinator' ? 'bold 11px' : '10px'} "JetBrains Mono", monospace`;
          ctx.fillStyle = isSelected ? '#818CF8' : '#E2E8F0';
          ctx.textAlign = 'center';
          ctx.fillText(node.handle, node.x, node.y + node.radius + 13);
        }
      });

      ctx.restore();
    };

    sim.on('tick', render);

    return () => {
      sim.stop();
    };
  }, [filteredNodes, filteredEdges, layoutMode, selectedNodeId]);

  // Resize Canvas to parent container with High DPI support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Trigger simulation re-render
      if (simulationRef.current) {
        simulationRef.current.alpha(0.1).restart();
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Zoom & Pan Handlers via Wheel and Drag
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.x;
    const mouseY = e.clientY - rect.y;

    // Convert mouse coords to simulation space
    const { x, y, k } = transformRef.current;
    const simX = (mouseX - x) / k;
    const simY = (mouseY - y) / k;

    // Check if clicked a node
    const clickedNode = simNodesRef.current.find((node) => {
      if (!node.x || !node.y) return false;
      const dist = Math.hypot(node.x - simX, node.y - simY);
      return dist <= node.radius + 4;
    });

    if (clickedNode) {
      onSelectNode(clickedNode);
      return;
    }

    // Start Pan
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - x, y: e.clientY - y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isDraggingRef.current) {
      transformRef.current.x = e.clientX - dragStartRef.current.x;
      transformRef.current.y = e.clientY - dragStartRef.current.y;
      if (simulationRef.current) simulationRef.current.alpha(0.01).restart();
      return;
    }

    // Check Hover
    const mouseX = e.clientX - rect.x;
    const mouseY = e.clientY - rect.y;
    const { x, y, k } = transformRef.current;
    const simX = (mouseX - x) / k;
    const simY = (mouseY - y) / k;

    const hovered = simNodesRef.current.find((node) => {
      if (!node.x || !node.y) return false;
      const dist = Math.hypot(node.x - simX, node.y - simY);
      return dist <= node.radius + 4;
    });

    if (hovered !== hoveredNodeRef.current) {
      hoveredNodeRef.current = hovered || null;
      setHoveredNode(hovered || null);
      if (simulationRef.current) simulationRef.current.alpha(0.02).restart();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newK = Math.max(0.2, Math.min(4.0, transformRef.current.k * zoomFactor));

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.x;
    const mouseY = e.clientY - rect.y;

    // Zoom centered on cursor
    transformRef.current.x = mouseX - (mouseX - transformRef.current.x) * (newK / transformRef.current.k);
    transformRef.current.y = mouseY - (mouseY - transformRef.current.y) * (newK / transformRef.current.k);
    transformRef.current.k = newK;
    setZoomLevel(Number(newK.toFixed(2)));

    if (simulationRef.current) simulationRef.current.alpha(0.02).restart();
  };

  const handleZoom = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
    const cy = canvas.height / (2 * (window.devicePixelRatio || 1));

    const newK = Math.max(0.2, Math.min(4.0, transformRef.current.k * factor));
    transformRef.current.x = cx - (cx - transformRef.current.x) * (newK / transformRef.current.k);
    transformRef.current.y = cy - (cy - transformRef.current.y) * (newK / transformRef.current.k);
    transformRef.current.k = newK;
    setZoomLevel(Number(newK.toFixed(2)));

    if (simulationRef.current) simulationRef.current.alpha(0.05).restart();
  };

  const handleResetZoom = () => {
    transformRef.current = { x: 0, y: 0, k: 1 };
    setZoomLevel(1);
    if (simulationRef.current) simulationRef.current.alpha(0.08).restart();
  };

  const toggleSimulation = () => {
    if (!simulationRef.current) return;
    if (isPaused) {
      simulationRef.current.restart();
      setIsPaused(false);
    } else {
      simulationRef.current.stop();
      setIsPaused(true);
    }
  };

  // Node counts for telemetry
  const botCount = filteredNodes.filter((n) => n.type === 'bot' || n.type === 'amplifier').length;
  const coordinatorCount = filteredNodes.filter((n) => n.type === 'coordinator').length;
  const organicCount = filteredNodes.filter((n) => n.type === 'organic').length;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0A0C10]">
      {/* Top Filter and Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] bg-[#0F172A] px-4 py-2.5">
        {/* Left: Type filters and Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Node Type filter */}
          <div className="flex items-center rounded-sm border border-[#1E293B] bg-[#111827] p-0.5 text-xs">
            <button
              id="filter-type-all"
              onClick={() => setSelectedType('all')}
              className={`rounded-sm px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'all' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({nodes.length})
            </button>
            <button
              id="filter-type-coordinator"
              onClick={() => setSelectedType('coordinator')}
              className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'coordinator' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              <span>Coordinadores</span>
            </button>
            <button
              id="filter-type-bot"
              onClick={() => setSelectedType('bot')}
              className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'bot' ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span>Bots</span>
            </button>
            <button
              id="filter-type-organic"
              onClick={() => setSelectedType('organic')}
              className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'organic' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Orgánicos</span>
            </button>
            <button
              id="filter-type-zombie"
              onClick={() => setSelectedType(selectedType === 'zombie' ? 'all' : 'zombie')}
              className={`flex items-center gap-1 rounded-sm px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'zombie' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Filtrar cuentas con mutación anómala o compra en mercado negro"
            >
              <span className="h-2 w-2 rounded-full border border-amber-400 bg-amber-400"></span>
              <span>Zombis ({nodes.filter((n) => n.zombieAudit?.isZombieAccount).length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              id="graph-search-input"
              type="text"
              placeholder="Buscar @handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 rounded-sm border border-[#1E293B] bg-[#111827] pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* CIB Threshold Slider */}
          <div className="flex items-center gap-2 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Umbral CIB &ge;</span>
            <input
              id="graph-cib-slider"
              type="range"
              min="0"
              max="90"
              step="5"
              value={minCibScore}
              onChange={(e) => setMinCibScore(Number(e.target.value))}
              className="h-1.5 w-18 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono font-bold text-indigo-400">{minCibScore}</span>
          </div>
        </div>

        {/* Right: Layout Switcher & Graph Physics */}
        <div className="flex items-center gap-2">
          {/* Layout Selector */}
          <div className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#111827] p-0.5 text-xs">
            <button
              id="layout-force"
              onClick={() => setLayoutMode('force')}
              className={`rounded-sm px-2 py-1 font-medium transition-colors ${
                layoutMode === 'force' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Dispersión por fuerzas orgánicas (Fruchterman-Reingold)"
            >
              Fuerza
            </button>
            <button
              id="layout-hub-spoke"
              onClick={() => setLayoutMode('hub_spoke')}
              className={`rounded-sm px-2 py-1 font-medium transition-colors ${
                layoutMode === 'hub_spoke' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Disposición radial Hub-and-Spoke de amplificación"
            >
              Hub & Spoke
            </button>
            <button
              id="layout-louvain"
              onClick={() => setLayoutMode('louvain')}
              className={`rounded-sm px-2 py-1 font-medium transition-colors ${
                layoutMode === 'louvain' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Agrupamiento por Comunidades Louvain"
            >
              Louvain
            </button>
          </div>

          {/* Pause / Play Physics */}
          <button
            id="btn-toggle-physics"
            onClick={toggleSimulation}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1E293B] bg-[#111827] text-slate-300 hover:bg-[#1E293B] transition-colors"
            title={isPaused ? 'Reanudar física' : 'Pausar física'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-400" /> : <Pause className="h-3.5 w-3.5 text-orange-400" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div ref={containerRef} className="relative flex-1 cursor-grab active:cursor-grabbing bg-[#0A0C10]">
        {/* Geometric Balance Dot Grid Texture */}
        <div className="pointer-events-none absolute inset-0 opacity-20 geometric-grid"></div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="relative z-10 h-full w-full"
        />

        {/* Floating Zoom & View Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 rounded-sm border border-[#1E293B] bg-[#0F172A]/90 p-1.5 shadow-xl backdrop-blur-md">
          <button
            id="btn-zoom-in"
            onClick={() => handleZoom(1.25)}
            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            id="btn-zoom-out"
            onClick={() => handleZoom(0.8)}
            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            id="btn-reset-view"
            onClick={handleResetZoom}
            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-300 transition-colors hover:bg-[#1E293B] hover:text-white"
            title="Restablecer Vista"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <div className="mt-1 border-t border-[#1E293B] pt-1 text-center font-mono text-[10px] text-slate-500">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>

        {/* Floating Topology Stats Overlay (Top-Left) */}
        <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col gap-2 rounded-sm border border-[#1E293B] bg-[#111827]/95 p-3.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-1.5 text-xs font-semibold text-slate-200">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Métricas Topológicas de Red</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-sm bg-[#0A0C10] border border-[#1E293B] p-2">
              <span className="block text-[10px] uppercase font-mono text-indigo-400">Coordinadores</span>
              <span className="font-mono text-base font-bold text-white">{coordinatorCount}</span>
            </div>
            <div className="rounded-sm bg-[#0A0C10] border border-[#1E293B] p-2">
              <span className="block text-[10px] uppercase font-mono text-rose-500">Bots / Granja</span>
              <span className="font-mono text-base font-bold text-white">{botCount}</span>
            </div>
            <div className="rounded-sm bg-[#0A0C10] border border-[#1E293B] p-2">
              <span className="block text-[10px] uppercase font-mono text-emerald-400">Orgánicos</span>
              <span className="font-mono text-base font-bold text-white">{organicCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-[#1E293B] pt-1.5">
            <span>Enlaces Activos:</span>
            <span className="font-mono font-bold text-slate-200">{filteredEdges.length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Comunidades Louvain:</span>
            <span className="font-mono font-bold text-indigo-400">{communities.length} clusters</span>
          </div>
        </div>

        {/* Hovered Node Tooltip Preview */}
        {hoveredNode && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-30 max-w-sm rounded-sm border border-[#1E293B] bg-[#111827]/95 p-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-white">{hoveredNode.handle}</span>
                <p className="text-[11px] text-slate-400">{hoveredNode.displayName}</p>
              </div>
              <span
                className={`rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold ${
                  hoveredNode.cibScore >= 65
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : hoveredNode.cibScore >= 35
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                CIB {hoveredNode.cibScore}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#1E293B] pt-2 text-[11px]">
              <div>
                <span className="text-slate-400">Tipo:</span>{' '}
                <span className="font-semibold capitalize text-slate-200">{hoveredNode.type}</span>
              </div>
              <div>
                <span className="text-slate-400">Jitter:</span>{' '}
                <span className="font-mono text-slate-200">
                  {hoveredNode.temporalMetrics.intervalJitterSeconds.toFixed(2)}s
                </span>
              </div>
              <div>
                <span className="text-slate-400">Seguidores/Seguidos:</span>{' '}
                <span className="font-mono text-slate-200">
                  {hoveredNode.followersCount} / {hoveredNode.followingCount}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Copypaste:</span>{' '}
                <span className="font-mono text-slate-200">
                  {Math.round(hoveredNode.contentMetrics.exactCopyPasteRatio * 100)}%
                </span>
              </div>
            </div>

            <div className="mt-2 text-[10px] font-mono text-indigo-400">
              * Haz clic para inspeccionar expediente forense completo
            </div>
          </div>
        )}

        {/* Non-Partisan Scientific Notice */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-sm border border-[#1E293B] bg-[#0A0C10]/90 px-3 py-1 text-[11px] text-slate-400 shadow backdrop-blur-sm">
          <span>Clasificación estricta por topología e invariantes matemáticas (Apartidista)</span>
        </div>
      </div>
    </div>
  );
};
