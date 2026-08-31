/**
 * AegisNet-BotRadar: Funnel global — qué gestiona esta plataforma
 * Hero compacto (visible) para no robar altura al contenido (casos/hallazgos).
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { ShieldAlert, Radar, FileSearch, Scale, ShieldCheck, Cpu } from 'lucide-react';
import { SystemHealthPanel } from './SystemHealthPanel';
import { HealthResponse } from '../services/api';

interface FunnelBannerProps {
  version: string;
  campaignTitle?: string;
  health?: HealthResponse | null;
  isDemo?: boolean;
}

export const FunnelBanner: React.FC<FunnelBannerProps> = ({ version, campaignTitle, health, isDemo }) => {
  return (
    <div className="shrink-0 border-b border-cyan-500/30 bg-[#0B1120]">
      {/* Barra superior: título + versión + semáforo */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-4 py-2 sm:px-8">
        <span className="flex items-center gap-1.5 rounded-sm bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-cyan-300 ring-1 ring-cyan-500/40">
          <ShieldAlert className="h-3.5 w-3.5" />
          AegisNet-BotRadar
        </span>
        <span className="rounded-sm bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-black text-indigo-300 ring-1 ring-indigo-500/40">
          v{version}
        </span>
        {campaignTitle && (
          <span className="hidden max-w-[280px] truncate rounded-sm bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/40 md:inline">
            {campaignTitle}
          </span>
        )}

        <div className="w-full sm:w-auto sm:ml-auto sm:min-w-[420px]">
          <SystemHealthPanel health={health ?? null} isDemo={isDemo ?? true} version={version} />
        </div>
      </div>

      {/* Funnel visible siempre: 3 pasos en una fila compacta horizontal */}
      <div className="border-t border-[#1E293B] bg-gradient-to-r from-[#06253a] to-[#0A0C10] px-4 py-1.5 sm:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-1.5 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-md border border-cyan-500/25 bg-[#0A0C10]/80 px-2.5 py-1">
            <Radar className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-cyan-400">1 · Monitoriza</span>
            <span className="hidden truncate text-[11px] text-slate-400 lg:inline">verificadores, Telegram, Bluesky, Mastodon</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-indigo-500/25 bg-[#0A0C10]/80 px-2.5 py-1">
            <FileSearch className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-indigo-400">2 · Detecta</span>
            <span className="hidden truncate text-[11px] text-slate-400 lg:inline">duplicación, sincronía, topología, score CIB</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/25 bg-[#0A0C10]/80 px-2.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-emerald-400">3 · Documenta</span>
            <span className="hidden truncate text-[11px] text-slate-400 lg:inline">HECHO/HIPÓTESIS/PREGUNTA, SHA-256, matriz</span>
          </div>
        </div>

        {/* Cintillo de principios */}
        <div className="mx-auto mt-1 flex max-w-7xl flex-wrap items-center gap-x-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Scale className="h-3 w-3 text-emerald-400" /> Apartidista
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-amber-400" /> Score CIB real (server-side)
          </span>
        </div>
      </div>
    </div>
  );
};
