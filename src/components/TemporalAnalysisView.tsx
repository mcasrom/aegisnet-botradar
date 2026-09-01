/**
 * AegisNet-BotRadar: Análisis de Heurísticas Temporales (datos reales del caso)
 * Solo muestra métricas calculadas de campaign.nodes.temporalMetrics. Nada fabricado.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState } from 'react';
import { Clock, Zap, Activity, Users, Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SocialAccountNode, InvestigationCampaign } from '../types/botradar';

interface TemporalAnalysisViewProps {
  campaign: InvestigationCampaign;
  onSelectNode: (node: SocialAccountNode) => void;
}

export const TemporalAnalysisView: React.FC<TemporalAnalysisViewProps> = ({ campaign, onSelectNode }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bots' | 'organic'>('all');
  const [search, setSearch] = useState('');

  const nodes = campaign.nodes;

  const filteredAccounts = nodes.filter((n) => {
    if (filterMode === 'bots' && n.type === 'organic') return false;
    if (filterMode === 'organic' && n.type !== 'organic') return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return n.handle.toLowerCase().includes(q) || n.displayName.toLowerCase().includes(q);
    }
    return true;
  });

  // Estadísticas reales calculadas de los datos
  const lowJitterCount = nodes.filter((n) => n.temporalMetrics.intervalJitterSeconds < 1.0).length;
  const highBurstsCount = nodes.filter((n) => n.temporalMetrics.burstCount > 15).length;
  const nightActiveCount = nodes.filter((n) => n.temporalMetrics.nightActivityRatio > 0.35).length;
  const avgJitter = nodes.length
    ? nodes.reduce((a, n) => a + n.temporalMetrics.intervalJitterSeconds, 0) / nodes.length
    : 0;
  const totalBursts = nodes.reduce((a, n) => a + n.temporalMetrics.burstCount, 0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-4 sm:p-6 text-[#E2E8F0]">
      {/* Título */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-indigo-500/30 bg-indigo-900/30 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
              Heurística Temporal
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Métricas de sincronía y ritmo de publicación calculadas sobre los datos reales de este caso.
          </p>
        </div>
        {/* Filtros */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-sm border border-[#1E293B] bg-[#0A0C10]">
            {(['all', 'bots', 'organic'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilterMode(m)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                  filterMode === m ? 'bg-indigo-900/40 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'all' ? 'Todas' : m === 'bots' ? 'Con señal de auto.' : 'Orgánicas'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#0A0C10] px-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar cuenta…"
              className="w-24 bg-transparent py-1.5 text-[11px] text-slate-200 placeholder-slate-500 outline-none sm:w-32"
            />
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen (métricas reales) */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-md border border-[#1E293B] bg-[#0F172A] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
            <Users className="h-3.5 w-3.5 text-indigo-400" /> Cuentas
          </div>
          <div className="mt-1 text-xl font-bold text-white">{nodes.length}</div>
        </div>
        <div className="rounded-md border border-[#1E293B] bg-[#0F172A] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
            <Clock className="h-3.5 w-3.5 text-amber-400" /> Jitter &lt; 1s
          </div>
          <div className="mt-1 text-xl font-bold text-white">{lowJitterCount}</div>
        </div>
        <div className="rounded-md border border-[#1E293B] bg-[#0F172A] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
            <Zap className="h-3.5 w-3.5 text-rose-400" /> Ráfagas &gt; 15
          </div>
          <div className="mt-1 text-xl font-bold text-white">{highBurstsCount}</div>
        </div>
        <div className="rounded-md border border-[#1E293B] bg-[#0F172A] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
            <Activity className="h-3.5 w-3.5 text-cyan-400" /> Jitter medio
          </div>
          <div className="mt-1 text-xl font-bold text-white">{avgJitter.toFixed(2)}s</div>
        </div>
        <div className="rounded-md border border-[#1E293B] bg-[#0F172A] p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400">
            <Zap className="h-3.5 w-3.5 text-emerald-400" /> Ráfagas totales
          </div>
          <div className="mt-1 text-xl font-bold text-white">{totalBursts}</div>
        </div>
      </div>

      {/* Nota honesta cuando no hay señales de automatización */}
      {lowJitterCount === 0 && totalBursts === 0 && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            No se detectan señales de sincronía artificial (jitter &lt; 1s) ni micro-ráfagas en los datos
            capturados de este caso. Esto es un resultado honesto: la ventana de observación o las fuentes
            disponibles no muestran patrones de automatización medibles. No se rellena con valores simulados.
          </p>
        </div>
      )}

      {/* Tabla de cuentas */}
      <div className="rounded-md border border-[#1E293B] bg-[#0F172A]">
        <div className="flex items-center justify-between border-b border-[#1E293B] px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            Métricas temporales por cuenta
          </span>
          <span className="font-mono text-[10px] text-slate-500">{filteredAccounts.length} de {nodes.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2">Cuenta</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">Score CIB</th>
                <th className="px-4 py-2">Jitter (s)</th>
                <th className="px-4 py-2">Intervalo mediano</th>
                <th className="px-4 py-2">Ráfagas</th>
                <th className="px-4 py-2">Act. 24/7</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Sin cuentas que coincidan con el filtro.
                  </td>
                </tr>
              )}
              {filteredAccounts.map((n) => {
                const tm = n.temporalMetrics;
                return (
                  <tr
                    key={n.id}
                    onClick={() => onSelectNode(n)}
                    className="cursor-pointer border-b border-[#1E293B]/60 transition-colors hover:bg-[#1E293B]/40"
                  >
                    <td className="px-4 py-2 font-mono text-cyan-300">{n.handle}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${
                        n.type === 'suspicious' ? 'bg-rose-950/40 text-rose-300' :
                        n.type === 'coordinator' ? 'bg-purple-950/40 text-purple-300' :
                        'bg-emerald-950/40 text-emerald-300'
                      }`}>
                        {n.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono">{n.cibScore}</td>
                    <td className="px-4 py-2 font-mono">{tm.intervalJitterSeconds.toFixed(2)}</td>
                    <td className="px-4 py-2 font-mono">{tm.medianIntervalSeconds.toFixed(2)}s</td>
                    <td className="px-4 py-2 font-mono">{tm.burstCount}</td>
                    <td className="px-4 py-2 font-mono">{(tm.nightActivityRatio * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota metodológica */}
      <div className="mt-4 rounded-md border border-[#1E293B] bg-[#0F172A]/60 p-3 text-[11px] leading-relaxed text-slate-400">
        <strong className="text-slate-300">Nota metodológica:</strong> los valores de jitter, ráfagas y
        actividad nocturna se calculan sobre los <span className="font-mono">temporalMetrics</span> de los
        nodos capturados por el pipeline. Cuando no hay datos suficientes, se muestra 0 y un aviso, nunca un
        valor simulado. La sincronía artificial solo se infiere a partir de jitter medible, no de suposiciones.
      </div>
    </div>
  );
};
