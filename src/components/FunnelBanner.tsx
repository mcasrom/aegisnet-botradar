/**
 * AegisNet-BotRadar: Funnel global — qué gestiona esta plataforma
 * Hero compacto y plegable para no robar altura al contenido (casos/hallazgos).
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState } from 'react';
import { ShieldAlert, Radar, FileSearch, Scale, ShieldCheck, Cpu, ChevronDown, X } from 'lucide-react';
import { SystemHealthPanel } from './SystemHealthPanel';
import { HealthResponse } from '../services/api';

interface FunnelBannerProps {
  version: string;
  campaignTitle?: string;
  health?: HealthResponse | null;
  isDemo?: boolean;
}

export const FunnelBanner: React.FC<FunnelBannerProps> = ({ version, campaignTitle, health, isDemo }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="shrink-0 border-b border-cyan-500/30 bg-[#0B1120]">
      {/* Barra compacta: título + semáforo + toggle */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 sm:px-8">
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

        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
          title={open ? 'Colapsar' : 'Ver qué hace la plataforma'}
        >
          {open ? <X className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>{open ? 'Ocultar' : 'Qué hace'}</span>
        </button>

        {/* Semáforo de salud siempre visible a la derecha */}
        <div className="w-full sm:w-auto sm:min-w-[420px]">
          <SystemHealthPanel health={health ?? null} isDemo={isDemo ?? true} version={version} />
        </div>
      </div>

      {/* Panel plegable: funnel de 3 pasos + cintillo de principios */}
      {open && (
        <div className="border-t border-[#1E293B] bg-gradient-to-r from-[#06253a] to-[#0A0C10] px-4 py-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-base font-black leading-tight text-white sm:text-lg">
              Detección temprana de campañas de{' '}
              <span className="text-cyan-400">desinformación coordinada (CIB)</span>
            </h2>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">
              Monitoriza fuentes abiertas (verificadores, Telegram público, redes sociales), detecta
              patrones técnicos de coordinación y los documenta con cadena de custodia y matriz de confianza.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-md border border-cyan-500/25 bg-[#0A0C10]/80 p-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Radar className="h-3.5 w-3.5" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider">1 · Monitoriza</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Verificadores (Maldita, Newtral, EFE), Telegram público, Bluesky, Mastodon.</p>
              </div>
              <div className="rounded-md border border-indigo-500/25 bg-[#0A0C10]/80 p-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <FileSearch className="h-3.5 w-3.5" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider">2 · Detecta</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Duplicación, sincronía temporal, topología, score CIB por campaña.</p>
              </div>
              <div className="rounded-md border border-emerald-500/25 bg-[#0A0C10]/80 p-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider">3 · Documenta</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">HECHO / HIPÓTESIS / PREGUNTA, SHA-256, matriz de confianza. Avisos, no conclusiones.</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-emerald-400" /> Apartidista
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-amber-400" /> Score CIB real (server-side)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
