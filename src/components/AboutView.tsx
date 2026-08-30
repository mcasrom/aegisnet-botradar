/**
 * AegisNet-BotRadar: Vista Metodología & Fuentes (tab)
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { FileSearch, Scale, ShieldCheck } from 'lucide-react';
import { AboutContent } from './AboutModal';

export const AboutView: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-4 sm:p-6 text-[#E2E8F0]">
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-[#1E293B] bg-[#0F172A]/60">
        <div className="flex items-center gap-2.5 border-b border-[#1E293B] px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">Metodología &amp; Fuentes</h2>
            <p className="text-[11px] text-slate-400">Cómo se detectan y verifican las campañas de desinformación coordinada</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
            <FileSearch className="h-3.5 w-3.5" />
            <Scale className="h-3.5 w-3.5" />
          </div>
        </div>
        <AboutContent />
      </div>
    </div>
  );
};
