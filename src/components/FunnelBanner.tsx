/**
 * AegisNet-BotRadar: Funnel global — qué gestiona esta plataforma (visible siempre)
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { ShieldAlert, Radar, FileSearch, Scale, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
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
    <div className="shrink-0 border-b-2 border-cyan-500/30 bg-gradient-to-r from-[#0B1120] via-[#06253a] to-[#0A0C10] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Título principal */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-sm bg-cyan-500/20 px-2.5 py-1 font-mono text-[11px] font-black uppercase tracking-widest text-cyan-300 ring-1 ring-cyan-500/40">
            <ShieldAlert className="h-3.5 w-3.5" />
            AegisNet-BotRadar
          </span>
          <span className="rounded-sm bg-indigo-500/20 px-2.5 py-1 font-mono text-[11px] font-black text-indigo-300 ring-1 ring-indigo-500/40">
            v{version}
          </span>
          {campaignTitle && (
            <span className="hidden max-w-[320px] truncate rounded-sm bg-emerald-500/20 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-500/40 md:inline">
              {campaignTitle}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
          Detección temprana de campañas de{' '}
          <span className="text-cyan-400">desinformación coordinada (CIB)</span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Esta plataforma monitoriza fuentes abiertas (verificadores, Telegram público, redes
          sociales), detecta <strong className="text-white">patrones técnicos de coordinación</strong>{' '}
          y los documenta con cadena de custodia y matriz de confianza.
        </p>

        {/* Funnel de 3 pasos: qué hace la página */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-cyan-500/25 bg-[#0A0C10]/80 p-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <Radar className="h-4 w-4" />
              <span className="font-mono text-[10px] font-black uppercase tracking-wider">1 · Monitoriza</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Fuentes abiertas: verificadores (Maldita, Newtral, EFE), Telegram público, Bluesky, Mastodon.</p>
          </div>
          <div className="rounded-lg border border-indigo-500/25 bg-[#0A0C10]/80 p-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <FileSearch className="h-4 w-4" />
              <span className="font-mono text-[10px] font-black uppercase tracking-wider">2 · Detecta</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">Patrones técnicos: duplicación, sincronía temporal, topología, score CIB por campaña.</p>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-[#0A0C10]/80 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono text-[10px] font-black uppercase tracking-wider">3 · Documenta</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">HECHO / HIPÓTESIS / PREGUNTA, SHA-256, matriz de confianza. Avisos, no conclusiones.</p>
          </div>
        </div>

        {/* Cintillo de principios */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-emerald-400" /> Apartidista
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-amber-400" /> Score CIB real (server-side)
          </span>
          <span className="flex items-center gap-1.5">
            <ArrowRight className="h-3.5 w-3.5 text-cyan-400" /> Caso de estudio: asalto a la valla de Ceuta (julio 2026)
          </span>
        </div>

        {/* Estado del sistema */}
        <div className="mt-4">
          <SystemHealthPanel health={health ?? null} isDemo={isDemo ?? true} version={version} />
        </div>
      </div>
    </div>
  );
};
