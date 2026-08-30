/**
 * AegisNet-BotRadar: Barra de Navegación Principal
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import {
  ShieldAlert,
  Radio,
  Network,
  Clock,
  FileText,
  Globe,
  Database,
  Cpu,
  Download,
  AlertTriangle,
  Plus,
  BookOpen,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';
import { InvestigationCampaign } from '../types/botradar';

/**
 * Clasifica el origen del dataset de una campaña según su investigationCode.
 * - "-DOC-"   -> caso documentado (reconstrucción verificada, no captura bruta)
 * - "-OASIS-" -> señales reales del pipeline oasis.py
 * - resto     -> demo/legado
 */
function isDocumentedCase(c: InvestigationCampaign): boolean {
  return /-DOC-/.test(c.investigationCode || '');
}

interface NavbarProps {
  campaigns: InvestigationCampaign[];
  activeCampaign: InvestigationCampaign;
  onSelectCampaign: (campaign: InvestigationCampaign) => void;
  activeTab: 'graph' | 'temporal' | 'nlp' | 'geo' | 'action';
  onChangeTab: (tab: 'graph' | 'temporal' | 'nlp' | 'geo' | 'action') => void;
  onOpenIngestion: () => void;
  onOpenArchitecture: () => void;
  onOpenReportModal: () => void;
  onOpenHowTo: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  campaigns,
  activeCampaign,
  onSelectCampaign,
  activeTab,
  onChangeTab,
  onOpenIngestion,
  onOpenArchitecture,
  onOpenReportModal,
  onOpenHowTo,
  onOpenAbout
}) => {
  const cib = activeCampaign.cibBreakdown;

  const getRiskBadge = (score: number) => {
    if (score >= 65) {
      return {
        label: 'CIB CRÍTICO / COORDINADO',
        bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
      };
    }
    if (score >= 35) {
      return {
        label: 'PATRÓN SOSPECHOSO',
        bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400'
      };
    }
    return {
      label: 'FLUJO ORGÁNICO',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    };
  };

  const riskBadge = getRiskBadge(cib.overallScore);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0F172A]">
      {/* Top Banner: Status & Context */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B]/70 bg-[#0A0C10] px-6 py-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            <span className="font-mono font-medium tracking-wide text-slate-300">RADAR ACTIVO: INGESTIÓN MULTICANAL</span>
          </div>
          <span className="hidden text-slate-700 sm:inline">|</span>
          <span className="hidden font-mono text-slate-400 sm:inline">
            EXP: <span className="text-indigo-400 font-semibold">{activeCampaign.investigationCode}</span>
          </span>
          {isDocumentedCase(activeCampaign) && (
            <span
              className="hidden items-center gap-1 rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300 md:inline-flex"
              title="Caso reconstruido a partir de documentación pública verificada (fuentes periodísticas), no captura bruta del pipeline."
            >
              <FlaskConical className="h-3 w-3" />
              CASO DOCUMENTADO
            </span>
          )}
          <span className="hidden text-slate-700 md:inline">|</span>
          <span className="hidden text-slate-400 md:inline">
            {activeCampaign.electoralProcess}
          </span>
        </div>

        {/* Global CIB Score Alert Badge & Metric */}
        <div className="flex items-center gap-6">
          {/* Global Risk Level Horizontal Progress Bar */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Global Risk Level</span>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    cib.overallScore >= 65
                      ? 'bg-rose-500'
                      : cib.overallScore >= 35
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, cib.overallScore))}%` }}
                ></div>
              </div>
              <span
                className={`text-xs font-mono font-bold ${
                  cib.overallScore >= 65
                    ? 'text-rose-400'
                    : cib.overallScore >= 35
                    ? 'text-orange-400'
                    : 'text-emerald-400'
                }`}
              >
                {cib.overallScore.toFixed(1)}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${riskBadge.bg}`}>
            <AlertTriangle className="h-3 w-3" />
            <span>CIB {cib.overallScore}/100</span>
            <span className="hidden sm:inline">({riskBadge.label})</span>
          </div>

          <div className="hidden items-center gap-1 text-[11px] text-slate-500 lg:flex">
            <span>SHA-256:</span>
            <span className="font-mono text-slate-400">{activeCampaign.datasetSha256.slice(0, 10)}...</span>
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Campaign Selector, Navigation, and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
        {/* Logo and Brand with Geometric Balance Diamond Mark */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-indigo-600 shadow-sm shrink-0">
            <div className="h-4 w-4 rotate-45 border-2 border-white"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                AegisNet-<span className="text-indigo-400">BotRadar</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest font-semibold rounded-sm">
                OSINT Workbench
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inteligencia de Fuentes Abiertas: Detección Técnica CIB y Línea de Acción
            </p>
          </div>
        </div>

        {/* Campaign Switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="campaign-select" className="hidden text-xs font-medium text-slate-400 xl:inline">
            Campaña Activa:
          </label>
          <select
            id="campaign-select"
            value={activeCampaign.id}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                onOpenIngestion();
                return;
              }
              const found = campaigns.find((c) => c.id === e.target.value);
              if (found) onSelectCampaign(found);
            }}
            className="rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm focus:border-indigo-500 focus:outline-none"
          >
            {campaigns.map((camp) => (
              <option key={camp.id} value={camp.id}>
                {camp.title} ({camp.nodes.length} nodos)
              </option>
            ))}
            <option value="__new__" className="text-indigo-400 font-semibold bg-[#0A0C10]">
              + Configurar Nuevo Tema / Ingesta...
            </option>
          </select>

          {/* Quick + Button to create a new topic */}
          <button
            type="button"
            onClick={onOpenIngestion}
            className="flex items-center gap-1 rounded-sm border border-indigo-500/40 bg-indigo-950/40 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all shadow-sm"
            title="Introducir un nuevo tema o campaña a analizar"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nuevo Tema</span>
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center rounded-sm border border-[#1E293B] bg-[#0A0C10] p-1">
          <button
            id="tab-graph"
            onClick={() => onChangeTab('graph')}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'graph'
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Grafo & Topología</span>
          </button>

          <button
            id="tab-temporal"
            onClick={() => onChangeTab('temporal')}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'temporal'
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Heurística Temporal</span>
          </button>

          <button
            id="tab-nlp"
            onClick={() => onChangeTab('nlp')}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'nlp'
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Semántica & pHash</span>
          </button>

          <button
            id="tab-geo"
            onClick={() => onChangeTab('geo')}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'geo'
                ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Mapa Geopolítico</span>
          </button>

          {/* New Tab: Línea de Acción OSINT */}
          <button
            id="tab-action-line"
            onClick={() => onChangeTab('action')}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'action'
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/50 shadow-sm ring-1 ring-cyan-500/30'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/20'
            }`}
            title="Protocolo Operativo de Respuesta, Takedowns a Plataformas y Mitigación para el Grupo OSINT"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
            <span>Línea de Acción OSINT</span>
            <span className="ml-0.5 rounded-full bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-mono font-black text-cyan-300 border border-cyan-500/40">
              PLAYBOOK
            </span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Real OSINT Ingestion */}
          <button
            id="btn-ingestion"
            onClick={onOpenIngestion}
            className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/40 hover:bg-[#1E293B]"
            title="Importar datasets brutos JSON/CSV de capturas OSINT (snscrape, telethon, twint)"
          >
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ingesta OSINT</span>
          </button>

          {/* Architecture & CLI Pipeline */}
          <button
            id="btn-architecture"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-700 hover:bg-[#1E293B]"
            title="Ver Pipeline Técnico, Scripts CLI y Conectores de Campo"
          >
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">Pipeline CLI</span>
          </button>

          {/* Operational HOW-TO Guide */}
          <button
            id="btn-howto-guide"
            onClick={onOpenHowTo}
            className="flex items-center gap-1.5 rounded-sm border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:border-emerald-500/60 hover:bg-emerald-950/40 shadow-sm"
            title="Manual de Operación y Gestión Operativa OSINT (HOW-TO)"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Guía HOW-TO</span>
          </button>

          {/* About / Metodología y fuentes */}
          <button
            id="btn-about"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 rounded-sm border border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:border-cyan-500/60 hover:bg-cyan-950/40 shadow-sm"
            title="Sobre el proyecto, metodología y fuentes"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>About</span>
          </button>

          {/* Forensic Report Generator */}
          <button
            id="btn-forensic-report"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Informe Técnico OSINT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
