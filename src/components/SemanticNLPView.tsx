/**
 * AegisNet-BotRadar: Módulo de PLN y Detección Técnica de Desinformación
 * Análisis semántico, similitud léxica (Jaccard / Levenshtein), astroturfing masivo
 * y descontextualización multimedia con estricta neutralidad ideológica.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Scale,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Sparkles
} from 'lucide-react';
import { InvestigationCampaign, AstroturfCluster } from '../types/botradar';
import { calculateJaccardSimilarity, calculateLevenshteinDistance } from '../services/cibEngine';

interface SemanticNLPViewProps {
  campaign: InvestigationCampaign;
}

export const SemanticNLPView: React.FC<SemanticNLPViewProps> = ({ campaign }) => {
  const [selectedCluster, setSelectedCluster] = useState<AstroturfCluster | null>(
    campaign.astroturfClusters[0] || null
  );

  // Interactive Live Text Similarity Testing Tool
  const [textA, setTextA] = useState(
    selectedCluster?.seedText ||
      'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata.'
  );
  const [textB, setTextB] = useState(
    'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata de la jornada.'
  );

  const currentJaccard = calculateJaccardSimilarity(textA, textB);
  const currentLevenshtein = calculateLevenshteinDistance(textA, textB);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-6 text-[#E2E8F0]">
      {/* Header and Methodological Neutrality Commitment */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-indigo-500/30 bg-indigo-900/30 text-indigo-400">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              PLN & Detección Técnica de Desinformación Masiva
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Detección de astroturfing y copypaste masivo sincronizado mediante modelos de similitud léxica y hashes perceptivos.
          </p>
        </div>

        {/* Non-Partisan Certification Tag */}
        <div className="flex items-center gap-2.5 rounded-sm border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2">
          <Scale className="h-4 w-4 text-emerald-400" />
          <div>
            <span className="block font-mono text-[11px] font-bold text-emerald-300">
              GARANTÍA DE NEUTRALIDAD APARTIDISTA
            </span>
            <span className="text-[10px] text-slate-400">
              Se audita la coordinación técnica, nunca la opinión o ideología
            </span>
          </div>
        </div>
      </div>

      {/* Non-Partisan Methodological Card */}
      <div className="mb-6 rounded-sm border border-[#1E293B] bg-[#111827] p-4 border-l-2 border-indigo-500">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-white">Principio Rector del Sistema AegisNet:</span>{' '}
            Las campañas de desinformación modernas no se caracterizan por su contenido ideológico (el cual está protegido como libertad de expresión), sino por su <span className="font-semibold text-indigo-300">método técnico de amplificación</span>: cientos de cuentas recién creadas publicando cadenas de caracteres idénticas o cuasi-idénticas en ventanas de segundos, con supresión deliberada de metadatos de origen. El motor evalúa <span className="font-semibold text-orange-400">patrones de sincronización inorgánica</span>, garantizando una auditoría objetiva aplicable a cualquier espectro o temática.
          </div>
        </div>
      </div>

      {/* Main Grid: Astroturfing Clusters & Interactive Comparator */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Detected Astroturfing Clusters */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Clústeres de Astroturfing ({campaign.astroturfClusters.length})
            </h3>
            <span className="rounded-sm border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
              Clonación Masiva
            </span>
          </div>

          <div className="space-y-3">
            {campaign.astroturfClusters.map((cluster) => {
              const isSelected = selectedCluster?.id === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => {
                    setSelectedCluster(cluster);
                    setTextA(cluster.seedText);
                  }}
                  className={`cursor-pointer rounded-sm border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-500/60 bg-[#111827] shadow-sm'
                      : 'border-[#1E293B] bg-[#111827]/40 hover:border-slate-700 hover:bg-[#111827]/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-indigo-400">
                      {cluster.occurrenceCount} réplicas
                    </span>
                    <span className="rounded-sm bg-[#0A0C10] border border-[#1E293B] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      en {Math.round(cluster.timeSpanMinutes * 60)} segundos
                    </span>
                  </div>

                  <p className="mt-2.5 line-clamp-3 text-xs italic text-slate-300 leading-relaxed">
                    "{cluster.seedText}"
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#1E293B]/80 pt-2.5 text-[11px]">
                    <span className="text-slate-400">
                      Similitud: <span className="font-mono text-white">{Math.round(cluster.averageSimilarity * 100)}%</span>
                    </span>
                    {cluster.isDescontextualizedMedia && (
                      <span className="flex items-center gap-1 text-orange-400 font-mono text-[10px]">
                        <ImageIcon className="h-3 w-3" /> Imagen Reutilizada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle & Right Column: Cluster Deep Dive and Interactive NLP Scratchpad */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Cluster Details */}
          {selectedCluster && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Inspección del Clúster Forense
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {selectedCluster.targetNarrative}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-xs font-bold text-rose-400">
                    Jaccard: {selectedCluster.averageSimilarity.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Seed Text Block */}
              <div className="mt-4 rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
                <span className="block font-mono text-[11px] uppercase text-indigo-400">
                  Cadena Semántica Matriz (Texto Semilla Inseminado):
                </span>
                <p className="mt-2 text-sm text-slate-100 font-serif leading-relaxed">
                  "{selectedCluster.seedText}"
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>Primera Inyección: <span className="font-mono text-slate-300">{selectedCluster.firstSeen}</span></span>
                  <span>Última Réplica: <span className="font-mono text-slate-300">{selectedCluster.lastSeen}</span></span>
                  <span>Cuentas Involucradas: <span className="font-mono text-indigo-400">{selectedCluster.occurrenceCount}</span></span>
                </div>
              </div>

              {/* Media Descontextualization Card */}
              {selectedCluster.isDescontextualizedMedia && (
                <div className="mt-4 rounded-sm border border-orange-500/30 bg-orange-950/20 p-4 border-l-2 border-orange-500">
                  <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-orange-300">
                        Alerta de Descontextualización Multimedia (pHash Match)
                      </h5>
                      <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                        El material gráfico adjunto en este clúster coincide significativamente mediante Perceptual Hashing (pHash) con un material fechado con anterioridad al episodio investigado. Se eliminaron los metadatos EXIF originales, lo que sugiere una posible presentación fuera de contexto cronológico.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Live Similarity Calculator */}
          <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Calculadora Forense de Similitud Léxica en Vivo
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Algoritmos Jaccard & Levenshtein</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-[11px] text-slate-400">
                  Texto A (Publicación Original o Sospechosa):
                </label>
                <textarea
                  rows={3}
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                  className="w-full rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[11px] text-slate-400">
                  Texto B (Réplica o Variación de Bot):
                </label>
                <textarea
                  rows={3}
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  className="w-full rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
              <div className="flex items-center gap-6">
                <div>
                  <span className="block text-[10px] uppercase font-mono text-slate-500">Similitud Jaccard</span>
                  <span
                    className={`font-mono text-xl font-bold ${
                      currentJaccard > 0.8
                        ? 'text-rose-400'
                        : currentJaccard > 0.5
                        ? 'text-orange-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {(currentJaccard * 100).toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-mono text-slate-500">Distancia Levenshtein</span>
                  <span className="font-mono text-xl font-bold text-indigo-400">
                    {currentLevenshtein} edic.
                  </span>
                </div>
              </div>

              <div className="max-w-xs text-right text-xs">
                {currentJaccard > 0.8 ? (
                  <span className="rounded-sm border border-rose-500/30 bg-rose-500/20 px-2 py-1 font-semibold text-rose-300">
                    Alta Probabilidad de Copypaste Astroturf
                  </span>
                ) : (
                  <span className="rounded-sm border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 font-semibold text-emerald-300">
                    Dispersión Léxica Orgánica
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
