/**
 * AegisNet-BotRadar: Módulo de Heurísticas de Comportamiento Temporal
 * Detección de picos de actividad artificial (Burst Analysis), intervalos cronométricos
 * idénticos (Zero-Jitter API Scripting), y ratios anómalos de antigüedad vs volumen.
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Activity,
  AlertTriangle,
  Users,
  ShieldCheck,
  Search,
  Filter,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { SocialAccountNode, InvestigationCampaign } from '../types/botradar';

interface TemporalAnalysisViewProps {
  campaign: InvestigationCampaign;
  onSelectNode: (node: SocialAccountNode) => void;
}

export const TemporalAnalysisView: React.FC<TemporalAnalysisViewProps> = ({
  campaign,
  onSelectNode
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bots' | 'organic'>('all');
  const [search, setSearch] = useState('');

  const nodes = campaign.nodes;

  // Filtered accounts list
  const filteredAccounts = nodes.filter((n) => {
    if (filterMode === 'bots' && n.type === 'organic') return false;
    if (filterMode === 'organic' && n.type !== 'organic') return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return n.handle.toLowerCase().includes(q) || n.displayName.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate global temporal statistics
  const lowJitterCount = nodes.filter((n) => n.temporalMetrics.intervalJitterSeconds < 1.0).length;
  const highBurstsCount = nodes.filter((n) => n.temporalMetrics.burstCount > 15).length;
  const nightActiveCount = nodes.filter((n) => n.temporalMetrics.nightActivityRatio > 0.35).length;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-6 text-[#E2E8F0]">
      {/* Module Title & Scientific Method Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-indigo-500/30 bg-indigo-900/30 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Análisis de Heurísticas Temporales & Cronometría de Ráfagas
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Detección de sincronización artificial entre cuentas mediante análisis de jitter de milisegundos y desvío de la tasa humana de publicación.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 font-mono text-xs text-slate-300">
          <span className="text-slate-500 uppercase text-[10px] font-semibold">Ventana de Muestreo:</span>
          <span className="font-bold text-indigo-400">Alta Resolución (1-sec bins)</span>
        </div>
      </div>

      {/* Top Telemetry KPI Cards - Geometric Balance style with clean accent borders */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 border-l-2 border-rose-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Cuentas Zero-Jitter (&lt; 1.0s)</span>
            <Zap className="h-4 w-4 text-rose-400" />
          </div>
          <span className="mt-2 block font-mono text-3xl font-bold text-rose-500 tracking-tighter">{lowJitterCount}</span>
          <span className="mt-1 text-[11px] text-slate-400">
            Firma inequívoca de automatización por script o cron job API
          </span>
        </div>

        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 border-l-2 border-orange-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Picos de Ráfaga Artificial</span>
            <Activity className="h-4 w-4 text-orange-400" />
          </div>
          <span className="mt-2 block font-mono text-3xl font-bold text-orange-400 tracking-tighter">{highBurstsCount}</span>
          <span className="mt-1 text-[11px] text-slate-400">
            Eventos sincronizados con más de 15 réplicas simultáneas
          </span>
        </div>

        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 border-l-2 border-indigo-500 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Actividad Plana 24/7 (Sin Sueño)</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="mt-2 block font-mono text-3xl font-bold text-indigo-400 tracking-tighter">{nightActiveCount}</span>
          <span className="mt-1 text-[11px] text-slate-400">
            Ausencia de descanso circadiano compatible con operadores humanos
          </span>
        </div>
      </div>

      {/* Visual Charts Grid: Burst Timeline & Jitter Histogram */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Burst Analysis Timeline Chart */}
        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Monitoreo de Picos de Ráfaga (Burst Timeline Analysis)
              </h3>
              <p className="text-[11px] text-slate-500">
                Comparativa de tasa de publicaciones por minuto (Línea base vs Picos Anómalos)
              </p>
            </div>
            <span className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
              Pico Crítico Detectado
            </span>
          </div>

          {/* SVG Custom Burst Timeline */}
          <div className="mt-4 flex h-52 flex-col justify-end">
            <div className="relative h-44 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                {/* Horizontal guide lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1E293B" strokeDasharray="3 3" />

                {/* Normal Organic Baseline (Smooth low curve) */}
                <path
                  d="M 0 145 Q 60 140, 120 142 T 240 140 T 360 144 T 500 142"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Inorganic Burst Spike (Sharp unnatural needle) */}
                <path
                  d="M 0 145 L 140 145 L 180 142 L 210 20 L 225 24 L 245 140 L 500 145"
                  fill="rgba(244, 63, 94, 0.15)"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                />

                {/* Highlight dot on burst peak */}
                <circle cx="210" cy="20" r="4" fill="#F43F5E" />
                <circle cx="210" cy="20" r="8" fill="rgba(244, 63, 94, 0.4)" />
              </svg>

              {/* Annotation Label on Peak */}
              <div className="absolute left-[38%] top-0 -translate-x-1/2 rounded-sm border border-rose-500/50 bg-[#0A0C10] px-2.5 py-1 text-center shadow-lg">
                <span className="block font-mono text-xs font-bold text-rose-400">
                  BURST: 140 posts en 4 seg
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">Tasa: 2100 posts/min</span>
              </div>
            </div>

            {/* Time axis markers */}
            <div className="flex justify-between border-t border-[#1E293B] pt-2 font-mono text-[10px] text-slate-500">
              <span>T-60 min</span>
              <span>T-45 min</span>
              <span className="text-rose-400 font-bold">14:02:11 UTC (Inyección)</span>
              <span>T-15 min</span>
              <span>Tiempo Real</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Línea Base Orgánica Ciudadana (~3 posts/min)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              Ráfaga Coordinada de Botnet
            </span>
          </div>
        </div>

        {/* Jitter Distribution: Dirac Delta vs Gaussian Human */}
        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Histograma de Jitter entre Intervalos (&Delta;t)
              </h3>
              <p className="text-[11px] text-slate-500">
                La automatización genera una aguja estrecha (Jitter &lt; 0.5s) frente a la dispersión humana
              </p>
            </div>
            <span className="rounded-sm border border-indigo-500/30 bg-indigo-900/30 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-400">
              Prueba Kolmogorov-Smirnov p &lt; 0.001
            </span>
          </div>

          {/* Graphical Representation of Jitter Distribution */}
          <div className="mt-4 flex h-52 flex-col justify-end">
            <div className="relative h-44 w-full">
              <svg className="h-full w-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                {/* Horizontal axis */}
                <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeWidth="1.5" />

                {/* Inorganic Narrow Spike (Dirac Delta around 0.3s) */}
                <rect x="50" y="15" width="22" height="135" fill="rgba(244, 63, 94, 0.65)" rx="1" />
                <rect x="74" y="45" width="18" height="105" fill="rgba(244, 63, 94, 0.4)" rx="1" />

                {/* Organic Broad Curve (Human reaction time variance) */}
                <path
                  d="M 120 150 C 200 148, 250 80, 320 80 C 390 80, 440 145, 500 150"
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="#10B981"
                  strokeWidth="2"
                />
              </svg>

              {/* Annotation labels */}
              <div className="absolute left-[14%] top-2 rounded-sm border border-rose-500/40 bg-[#0A0C10] px-2 py-0.5 text-[10px] text-rose-300 font-mono">
                Script Jitter = 0.35s
              </div>

              <div className="absolute right-[20%] top-16 rounded-sm border border-emerald-500/40 bg-[#0A0C10] px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                Campana Humana (&sigma; &gt; 400s)
              </div>
            </div>

            {/* Interval Axis */}
            <div className="flex justify-between border-t border-[#1E293B] pt-2 font-mono text-[10px] text-slate-500">
              <span>0.1s (Automático)</span>
              <span>1.0s</span>
              <span>10s</span>
              <span>60s</span>
              <span>300s</span>
              <span>&gt;1800s (Humano)</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400">
            * Criterio forense: Todo grupo con &ge;10 cuentas publicando con desviaciones de latencia menores a 2 segundos se etiqueta como orquestación automatizada.
          </div>
        </div>
      </div>

      {/* Account Table with Sort & Filters */}
      <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Cuentas Analizadas y Registro de Latencias Forenses
            </h3>
            <p className="text-xs text-slate-500">
              Inspección de anomalías cronométricas cuenta por cuenta
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter pills */}
            <div className="flex rounded-sm border border-[#1E293B] bg-[#0A0C10] p-0.5 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`rounded-sm px-3 py-1 font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({nodes.length})
              </button>
              <button
                onClick={() => setFilterMode('bots')}
                className={`rounded-sm px-3 py-1 font-medium transition-colors ${
                  filterMode === 'bots' ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sospechosas de Bot
              </button>
              <button
                onClick={() => setFilterMode('organic')}
                className={`rounded-sm px-3 py-1 font-medium transition-colors ${
                  filterMode === 'organic' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cuentas Orgánicas
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar por @handle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 rounded-sm border border-[#1E293B] bg-[#0A0C10] pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] font-mono text-[10px] uppercase tracking-widest text-slate-400 bg-[#0F172A]">
                <th className="p-3 font-semibold">Identificador</th>
                <th className="p-3 font-semibold">Rol</th>
                <th className="p-3 font-semibold">Score CIB</th>
                <th className="p-3 font-semibold">Jitter Latencia</th>
                <th className="p-3 font-semibold">Intervalo Mediano</th>
                <th className="p-3 font-semibold">Ráfagas</th>
                <th className="p-3 font-semibold">Act. 24/7</th>
                <th className="p-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 font-sans">
              {filteredAccounts.map((node) => {
                const isZeroJitter = node.temporalMetrics.intervalJitterSeconds < 1.0;
                return (
                  <tr
                    key={node.id}
                    className="transition-colors hover:bg-[#1E293B]/30"
                  >
                    <td className="p-3">
                      <div>
                        <span className="font-mono font-bold text-white">{node.handle}</span>
                        <span className="block text-[11px] text-slate-500">{node.displayName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          node.type === 'coordinator'
                            ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30'
                            : node.type === 'bot'
                            ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {node.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span
                        className={
                          node.cibScore >= 65
                            ? 'text-rose-400'
                            : node.cibScore >= 35
                            ? 'text-orange-400'
                            : 'text-emerald-400'
                        }
                      >
                        {node.cibScore}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isZeroJitter ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {isZeroJitter && <Zap className="h-3 w-3" />}
                        {node.temporalMetrics.intervalJitterSeconds.toFixed(2)}s
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {node.temporalMetrics.medianIntervalSeconds}s
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {node.temporalMetrics.burstCount}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {Math.round(node.temporalMetrics.nightActivityRatio * 100)}%
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectNode(node)}
                        className="rounded-sm border border-[#1E293B] bg-[#0A0C10] px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-[#1E293B] transition-colors"
                      >
                        Auditar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
