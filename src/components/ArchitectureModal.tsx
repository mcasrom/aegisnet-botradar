/**
 * AegisNet-BotRadar: Especificación de Arquitectura de Software Open-Source
 * Backend Python (FastAPI), Base de Datos Vectorial y Relacional (PostgreSQL + pgvector).
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import React, { useState } from 'react';
import {
  Cpu,
  X,
  Database,
  Layers,
  Server,
  Code,
  Copy,
  Check,
  Radio,
  Network,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'main' | 'cib' | 'louvain' | 'sql' | 'connectors'>('cib');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, { filename: string; language: string; code: string }> = {
    main: {
      filename: 'app/main.py',
      language: 'python',
      code: `"""
AegisNet-BotRadar: FastAPI Core Gateway
Endpoints de análisis CIB, detección de comunidades y orquestación de ingesta.
Copyright © M. Castillo - Contacto: mybloggingnotes@gmail.com
"""

from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from app.services.cib_scorer import compute_cib_score
from app.services.louvain_analyzer import detect_communities
from app.api.connectors import stream_social_events
from app.db.database import get_db, SessionLocal

app = FastAPI(
    title="AegisNet-BotRadar API",
    description="Plataforma analítica open-source para detección de granjas de bots y desinformación coordinada (CIB).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestionRequest(BaseModel):
    campaign_title: str
    platforms: List[str]
    keywords: List[str]
    electoral_context: str
    max_events: Optional[int] = 5000

@app.post("/api/v1/ingestion/start")
async def start_ingestion(req: IngestionRequest, background_tasks: BackgroundTasks):
    """Inicia colector multicanal en segundo plano (X, Telegram, Meta, YouTube)"""
    task_id = f"job_{req.campaign_title[:10]}"
    background_tasks.add_task(stream_social_events, req)
    return {"status": "INGESTION_RUNNING", "job_id": task_id, "platforms": req.platforms}

@app.get("/api/v1/analytics/cib-score/{campaign_id}")
async def get_campaign_cib(campaign_id: str, db = Depends(get_db)):
    """Computa métricas ponderadas CIB con desglose topológico, temporal y semántico"""
    breakdown = await compute_cib_score(campaign_id, db)
    return breakdown

@app.get("/api/v1/analytics/graph-communities/{campaign_id}")
async def get_graph_communities(campaign_id: str, db = Depends(get_db)):
    """Calcula detección de comunidades Louvain y centralidad Betweenness en NetworkX"""
    graph_data = await detect_communities(campaign_id, db)
    return graph_data

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
`
    },
    cib: {
      filename: 'app/services/cib_scorer.py',
      language: 'python',
      code: `"""
AegisNet-BotRadar: Motor de Puntuación CIB Ponderada (0 a 100)
Evaluación técnica matemática estrictamente apartidista e independiente.
Copyright © M. Castillo - Contacto: mybloggingnotes@gmail.com
"""

import numpy as np
from typing import Dict, Any

class CIBScoringEngine:
    @staticmethod
    def calculate_cib(
        topological_score: float,   # Hub-and-Spoke index, star centralization
        temporal_score: float,      # Zero-jitter cron signature, bursts
        semantic_score: float,      # Astroturfing exact copy-paste ratio
        metadata_score: float       # Account age vs volume, follower skew
    ) -> Dict[str, Any]:
        """
        Fórmula Matemática del CIB Score Ponderado:
        CIB = 0.30*S_topo + 0.30*S_temp + 0.25*S_sem + 0.15*S_meta
        """
        raw_score = (
            0.30 * topological_score +
            0.30 * temporal_score +
            0.25 * semantic_score +
            0.15 * metadata_score
        )
        cib_normalized = int(np.clip(raw_score, 0, 100))
        
        # Clasificación por umbrales objetivos
        if cib_normalized >= 65:
            risk_level = "CONFIRMED_CIB"
            verdict = "Coordinación inauténtica confirmada por sincronización de scripts y topología inorgánica."
        elif cib_normalized >= 35:
            risk_level = "SUSPICIOUS"
            verdict = "Actividad sospechosa con indicios de amplificación artificial en subgrafos."
        else:
            risk_level = "LOW_ORGANIC"
            verdict = "Comportamiento representativo de dinámica ciudadana humana y orgánica."
            
        return {
            "overall_cib_score": cib_normalized,
            "components": {
                "topological_score": round(topological_score, 2),
                "temporal_score": round(temporal_score, 2),
                "semantic_score": round(semantic_score, 2),
                "metadata_score": round(metadata_score, 2)
            },
            "risk_level": risk_level,
            "verdict": verdict,
            "methodology": "Strictly Non-Partisan Quantitative Analysis"
        }
`
    },
    louvain: {
      filename: 'app/services/louvain_analyzer.py',
      language: 'python',
      code: `"""
AegisNet-BotRadar: Algoritmos de Topología de Redes (Graph Theory)
Detección de comunidades Louvain (Modularidad Q) y métricas de centralidad con NetworkX.
Copyright © M. Castillo - Contacto: mybloggingnotes@gmail.com
"""

import networkx as nx
import community as community_louvain  # python-louvain
from typing import Dict, Any, List

def analyze_network_topology(nodes: List[Dict], edges: List[Dict]) -> Dict[str, Any]:
    G = nx.DiGraph()
    
    # Cargar nodos y aristas
    for n in nodes:
        G.add_node(n["id"], **n)
    for e in edges:
        G.add_edge(e["source"], e["target"], weight=e.get("weight", 1.0))
        
    # Convertir a grafo no dirigido para Louvain modularity
    G_undirected = G.to_undirected()
    partition = community_louvain.best_partition(G_undirected)
    modularity_q = community_louvain.modularity(partition, G_undirected)
    
    # Calcular métricas de centralidad
    degree_cent = nx.degree_centrality(G)
    betweenness_cent = nx.betweenness_centrality(G, weight="weight")
    pagerank_val = nx.pagerank(G, alpha=0.85)
    
    # Detección de patrón Hub-and-Spoke
    in_degrees = dict(G.in_degree())
    out_degrees = dict(G.out_degree())
    top_coordinator = max(out_degrees, key=out_degrees.get) if out_degrees else None
    
    return {
        "modularity_q": round(modularity_q, 4),
        "communities_count": len(set(partition.values())),
        "communities_map": partition,
        "betweenness": betweenness_cent,
        "pagerank": pagerank_val,
        "top_coordinator_id": top_coordinator
    }
`
    },
    sql: {
      filename: 'app/db/schema.sql',
      language: 'sql',
      code: `-- AegisNet-BotRadar Database Architecture
-- PostgreSQL 16 + pgvector para metadatos históricos y similitud semántica de embeddings

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector

-- Tabla de Campañas de Auditoría
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    electoral_context TEXT NOT NULL,
    cib_overall_score INT NOT NULL CHECK (cib_overall_score BETWEEN 0 AND 100),
    dataset_sha256 CHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Cuentas / Nodos de Red
CREATE TABLE social_accounts (
    id VARCHAR(64) PRIMARY KEY,
    handle VARCHAR(128) NOT NULL,
    platform VARCHAR(32) NOT NULL,
    display_name VARCHAR(255),
    node_type VARCHAR(32) NOT NULL, -- coordinator, bot, amplifier, organic
    cib_score INT NOT NULL,
    account_age_days INT NOT NULL,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    interval_jitter_seconds NUMERIC(6,3),
    exact_copypaste_ratio NUMERIC(4,3),
    geo_country VARCHAR(128),
    is_vpn_proxy BOOLEAN DEFAULT FALSE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Tabla de Publicaciones y Embeddings Semánticos
CREATE TABLE social_posts (
    id VARCHAR(64) PRIMARY KEY,
    account_id VARCHAR(64) REFERENCES social_accounts(id),
    text_content TEXT NOT NULL,
    text_embedding vector(768), -- Vector de embeddings para búsqueda de similitud coseno
    timestamp_utc TIMESTAMP WITH TIME ZONE NOT NULL,
    shares_count INT DEFAULT 0,
    is_duplicate BOOLEAN DEFAULT FALSE
);

-- Índice vectorial IVFFlat para búsqueda acelerada de copypastes
CREATE INDEX ON social_posts USING ivfflat (text_embedding vector_cosine_ops) WITH (lists = 100);
`
    },
    connectors: {
      filename: 'app/api/connectors.py',
      language: 'python',
      code: `"""
AegisNet-BotRadar: Conectores API Multicanal Asíncronos
Integración con X/Twitter API v2, Telegram Telethon MTProto, Meta y YouTube.
Copyright © M. Castillo - Contacto: mybloggingnotes@gmail.com
"""

import asyncio
import httpx
from typing import AsyncGenerator, Dict, Any

class MultiChannelIngestor:
    def __init__(self, x_bearer_token: str, telegram_api_id: int, telegram_api_hash: str):
        self.x_bearer_token = x_bearer_token
        self.telegram_api_id = telegram_api_id
        self.telegram_api_hash = telegram_api_hash
        
    async def stream_x_twitter(self, query: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Conexión persistente a X/Twitter Filtered Stream v2"""
        url = "https://api.twitter.com/2/tweets/search/stream?tweet.fields=created_at,author_id,public_metrics"
        headers = {"Authorization": f"Bearer {self.x_bearer_token}"}
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("GET", url, headers=headers) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield {"platform": "x_twitter", "raw_data": line}

    async def monitor_telegram_channels(self, target_channel: str):
        """Monitoreo de canales públicos de Telegram mediante cliente MTProto Telethon"""
        # Telethon async client listening for forwarded messages and timestamp clustering
        pass
`
    }
  };

  const currentSnippet = codeSnippets[activeCodeTab];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C10]/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm border border-[#1E293B] bg-[#111827] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-indigo-500/30 bg-indigo-900/30 text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Pipeline Técnico de Ingesta &amp; Protocolo de Despliegue OSINT
              </h3>
              <p className="text-xs text-slate-400">
                Colectores de campo, backend analítico FastAPI, PostgreSQL con pgvector y motor matemático CIB
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1E293B] bg-[#111827] text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs text-[#E2E8F0]">
          {/* Architecture Pipeline Flow Diagram */}
          <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-5">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Layers className="h-4 w-4 text-indigo-400" />
              Diagrama de Flujo del Pipeline de Detección Forense
            </h4>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {/* Step 1: Multichannel Ingestion */}
              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3.5 text-center">
                <span className="block font-mono text-[10px] font-bold text-indigo-400">PASO 1</span>
                <Radio className="mx-auto my-2 h-5 w-5 text-indigo-400" />
                <span className="block font-semibold text-white">Ingesta API</span>
                <p className="mt-1 text-[10px] text-slate-400">X, Telegram, Meta, YouTube Streaming</p>
              </div>

              {/* Step 2: Queue & Rate Limiting */}
              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3.5 text-center">
                <span className="block font-mono text-[10px] font-bold text-indigo-400">PASO 2</span>
                <Server className="mx-auto my-2 h-5 w-5 text-indigo-400" />
                <span className="block font-semibold text-white">Cola Redis</span>
                <p className="mt-1 text-[10px] text-slate-400">Desacoplamiento asíncrono y búfer</p>
              </div>

              {/* Step 3: Analytics Microservices */}
              <div className="rounded-sm border border-indigo-500/40 bg-indigo-950/20 p-3.5 text-center">
                <span className="block font-mono text-[10px] font-bold text-indigo-300">PASO 3</span>
                <Cpu className="mx-auto my-2 h-5 w-5 text-indigo-400" />
                <span className="block font-semibold text-white">Motor FastAPI</span>
                <p className="mt-1 text-[10px] text-slate-300">Louvain, Burst & CIB Scoring</p>
              </div>

              {/* Step 4: Storage */}
              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3.5 text-center">
                <span className="block font-mono text-[10px] font-bold text-emerald-400">PASO 4</span>
                <Database className="mx-auto my-2 h-5 w-5 text-emerald-400" />
                <span className="block font-semibold text-white">PostgreSQL</span>
                <p className="mt-1 text-[10px] text-slate-400">Relacional + pgvector Embeddings</p>
              </div>

              {/* Step 5: Frontend Dashboard */}
              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3.5 text-center">
                <span className="block font-mono text-[10px] font-bold text-orange-400">PASO 5</span>
                <Network className="mx-auto my-2 h-5 w-5 text-orange-400" />
                <span className="block font-semibold text-white">React UI</span>
                <p className="mt-1 text-[10px] text-slate-400">Canvas D3, Mapas e Informes PDF</p>
              </div>
            </div>
          </div>

          {/* Interactive Source Code Viewer */}
          <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <button
                  onClick={() => setActiveCodeTab('cib')}
                  className={`rounded-sm px-3 py-1.5 transition-colors border ${
                    activeCodeTab === 'cib'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  }`}
                >
                  cib_scorer.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('louvain')}
                  className={`rounded-sm px-3 py-1.5 transition-colors border ${
                    activeCodeTab === 'louvain'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  }`}
                >
                  louvain_analyzer.py
                </button>
                <button
                  onClick={() => setActiveCodeTab('main')}
                  className={`rounded-sm px-3 py-1.5 transition-colors border ${
                    activeCodeTab === 'main'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  }`}
                >
                  main.py (FastAPI)
                </button>
                <button
                  onClick={() => setActiveCodeTab('sql')}
                  className={`rounded-sm px-3 py-1.5 transition-colors border ${
                    activeCodeTab === 'sql'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  }`}
                >
                  schema.sql (pgvector)
                </button>
                <button
                  onClick={() => setActiveCodeTab('connectors')}
                  className={`rounded-sm px-3 py-1.5 transition-colors border ${
                    activeCodeTab === 'connectors'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                  }`}
                >
                  connectors.py
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1 text-xs text-slate-300 hover:bg-[#1E293B] transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="mt-3 max-h-96 overflow-x-auto rounded-sm border border-[#1E293B] bg-[#111827] p-4 font-mono text-[11px] leading-relaxed text-slate-200">
              <div className="mb-2 text-slate-500 font-semibold">// Archivo: {currentSnippet.filename}</div>
              <pre>{currentSnippet.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E293B] bg-[#0F172A] px-6 py-3.5 text-xs text-slate-400">
          <span>Licencia: Open-Source MIT | Auditoría y Reproducibilidad Garantizada</span>
          <button
            onClick={onClose}
            className="rounded-sm border border-[#1E293B] bg-[#111827] px-4 py-1.5 font-medium text-slate-200 hover:bg-[#1E293B] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
