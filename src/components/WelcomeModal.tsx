/**
 * AegisNet-BotRadar: Popup de bienvenida / guía del panel (se abre al cargar)
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useEffect } from 'react';
import {
  X, ShieldAlert, Network, Clock, FileText, ShieldCheck, ArrowRight, Radar, Scale, BookOpen
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'graph' | 'temporal' | 'nlp' | 'action' | 'about') => void;
}

const TABS = [
  { id: 'graph' as const, icon: Network, color: 'text-indigo-400', name: 'Grafo & Topología', desc: 'Red de cuentas/fuentes y sus relaciones.' },
  { id: 'temporal' as const, icon: Clock, color: 'text-amber-400', name: 'Heurística Temporal', desc: 'Ritmo de publicación y sincronía entre cuentas.' },
  { id: 'nlp' as const, icon: FileText, color: 'text-rose-400', name: 'Semántica', desc: 'Duplicación y similitud de mensajes.' },
  { id: 'action' as const, icon: ShieldAlert, color: 'text-cyan-400', name: 'Línea de Acción OSINT', desc: 'El caso: hallazgos, score CIB y expediente.' },
  { id: 'about' as const, icon: ShieldCheck, color: 'text-emerald-400', name: 'Metodología & Fuentes', desc: 'Cómo se detecta y de dónde salen los datos.' },
];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const go = (tab: WelcomeModalProps['onNavigate'] extends (t: infer T) => void ? T : never) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-xl border border-cyan-500/30 bg-[#0A0C10] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] bg-gradient-to-r from-cyan-950/40 to-[#0A0C10] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <Radar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Bienvenido a AegisNet-BotRadar</h2>
              <p className="text-[11px] text-slate-400">Detección de campañas de desinformación coordinada (CIB)</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-sm p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5 text-sm text-slate-300">
          {/* Qué hace */}
          <p className="leading-relaxed">
            Esta plataforma <strong className="text-white">monitoriza fuentes abiertas</strong> (verificadores,
            Telegram público, redes sociales), detecta <strong className="text-white">patrones técnicos de
            coordinación</strong> y los documenta con cadena de custodia. Empieza por la{' '}
            <strong className="text-cyan-300">Línea de Acción OSINT</strong>.
          </p>

          {/* Guía de tabs */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <BookOpen className="h-4 w-4" />
              Qué hace cada sección
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(t.id)}
                  className="flex items-start gap-2.5 rounded-md border border-[#1E293B] bg-[#0F172A]/60 p-3 text-left transition-colors hover:border-cyan-500/40 hover:bg-[#0F172A]"
                >
                  <t.icon className={`h-4 w-4 shrink-0 mt-0.5 ${t.color}`} />
                  <span>
                    <span className="block text-xs font-bold text-slate-100">{t.name}</span>
                    <span className="block text-[11px] text-slate-400">{t.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Principios */}
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1 rounded-sm border border-emerald-500/30 bg-emerald-950/20 px-2 py-1 font-mono">
              <Scale className="h-3 w-3 text-emerald-400" /> Apartidista
            </span>
            <span className="rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">Avisos, no conclusiones</span>
            <span className="rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">HECHO / HIPÓTESIS / PREGUNTA</span>
            <span className="rounded-sm border border-[#1E293B] bg-[#0F172A] px-2 py-1 font-mono">SHA-256 · cadena de custodia</span>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#1E293B] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-400"
            >
              Entrar y explorar
            </button>
            <button
              type="button"
              onClick={() => go('action')}
              className="flex items-center gap-1.5 rounded-md bg-cyan-500 px-4 py-2 text-xs font-bold text-[#0A0C10] shadow-md transition-colors hover:bg-cyan-400"
            >
              Ir al caso (Ceuta) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
