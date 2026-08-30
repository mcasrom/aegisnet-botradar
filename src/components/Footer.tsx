/**
 * AegisNet-BotRadar: Pie de Página Institucional
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { ShieldCheck, Mail, GitBranch, Scale, Lock, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenHowTo?: () => void;
  version?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHowTo, version = '1.1.0' }) => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0A0C10] px-6 py-2.5 text-[11px] text-slate-500">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Statement */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>AegisNet-BotRadar Architecture &copy; M. Castillo</span>
          </div>
          <span className="hidden text-slate-800 sm:inline">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Scale className="h-3.5 w-3.5 text-emerald-400" />
            Strictly Non-Partisan Protocol Active
          </span>
          <span className="hidden text-slate-800 sm:inline">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            Auditoría Criptográfica SHA-256
          </span>
          {onOpenHowTo && (
            <>
              <span className="hidden text-slate-800 sm:inline">|</span>
              <button
                type="button"
                onClick={onOpenHowTo}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Manual de Operación & Gestión (HOW-TO)</span>
              </button>
            </>
          )}
        </div>

        {/* Telemetry Status Pills & Mandatory Contact */}
        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <span className="font-mono text-slate-500">v{version}</span>
          <span className="hidden text-slate-800 sm:inline">|</span>
          <div>
            <span>Contacto:</span>{' '}
            <a
              href="mailto:aegis.info@viajeinteligencia.com"
              className="font-mono text-indigo-400 underline decoration-indigo-500/40 hover:text-indigo-300"
            >
              aegis.info@viajeinteligencia.com
            </a>
          </div>
          <span className="hidden text-slate-800 sm:inline">|</span>
          <a
            href="https://github.com/mcasrom/aegisnet-botradar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-cyan-300"
            title="Código abierto en GitHub"
          >
            <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
            <span>Código abierto (GitHub)</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
