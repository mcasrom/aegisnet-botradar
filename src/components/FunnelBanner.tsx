/**
 * AegisNet-BotRadar: Funnel global — qué gestiona esta plataforma (visible siempre)
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { ShieldAlert, ShieldCheck, Scale, FileSearch, Cpu } from 'lucide-react';

interface FunnelBannerProps {
  version: string;
  campaignTitle?: string;
}

export const FunnelBanner: React.FC<FunnelBannerProps> = ({ version, campaignTitle }) => {
  return (
    <div className="shrink-0 border-b border-[#1E293B] bg-gradient-to-r from-[#0B1120] via-cyan-950/30 to-[#0A0C10] px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-sm bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              <ShieldAlert className="h-3 w-3" />
              AegisNet-BotRadar
            </span>
            <span className="rounded-sm bg-indigo-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              v{version}
            </span>
            {campaignTitle && (
              <span className="hidden max-w-[300px] truncate rounded-sm bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 sm:inline">
                {campaignTitle}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-lg font-bold leading-tight text-white sm:text-xl">
            Detección temprana de campañas de desinformación coordinada (CIB)
          </h1>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">
            Monitoriza fuentes abiertas (verificadores, Telegram público, redes sociales), detecta{' '}
            <strong className="text-slate-200">patrones técnicos de coordinación</strong> y los presenta con
            cadena de custodia y matriz de confianza. Avisos, no conclusiones.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">
            <Scale className="h-3 w-3 text-emerald-400" /> Apartidista
          </span>
          <span className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">
            <FileSearch className="h-3 w-3 text-cyan-400" /> HECHO / HIPÓTESIS / PREGUNTA
          </span>
          <span className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">
            <ShieldCheck className="h-3 w-3 text-indigo-400" /> SHA-256 · custodia
          </span>
          <span className="flex items-center gap-1 rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">
            <Cpu className="h-3 w-3 text-amber-400" /> Score CIB
          </span>
        </div>
      </div>
    </div>
  );
};
