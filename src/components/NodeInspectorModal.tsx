/**
 * AegisNet-BotRadar: Expediente Forense de Nodo (Node Inspector Modal)
 * Diagnóstico cuantitativo individual de cuentas sospechosas vs orgánicas.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Network,
  FileText,
  Globe,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Terminal,
  Fingerprint,
  History,
  Cpu,
  ShoppingBag
} from 'lucide-react';
import { SocialAccountNode } from '../types/botradar';

interface NodeInspectorModalProps {
  node: SocialAccountNode | null;
  onClose: () => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const isCoordinated = node.cibScore >= 65;
  const isSuspicious = node.cibScore >= 35 && node.cibScore < 65;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C10]/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-[#1E293B] bg-[#111827] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-sm border ${
                node.type === 'coordinator'
                  ? 'border-indigo-500/40 bg-indigo-900/30 text-indigo-400'
                  : isCoordinated
                  ? 'border-rose-500/40 bg-rose-950/30 text-rose-400'
                  : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
              }`}
            >
              {node.type === 'coordinator' ? (
                <ShieldAlert className="h-5 w-5" />
              ) : isCoordinated ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-white">{node.handle}</h3>
                <span className="rounded-sm border border-[#1E293B] bg-[#0A0C10] px-2 py-0.5 font-mono text-[10px] uppercase text-slate-300">
                  {node.platform}
                </span>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                    node.type === 'coordinator'
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                      : node.type === 'bot'
                      ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                      : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {node.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">{node.displayName}</p>
            </div>
          </div>

          {/* CIB Score Pill and Close Button */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-[10px] font-mono uppercase text-slate-500">Score CIB</span>
              <span
                className={`font-mono text-xl font-bold ${
                  isCoordinated ? 'text-rose-500' : isSuspicious ? 'text-orange-400' : 'text-emerald-400'
                }`}
              >
                {node.cibScore}
                <span className="text-xs font-normal text-slate-500">/100</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1E293B] bg-[#111827] text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-[#E2E8F0]">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="h-3 w-3 text-indigo-400" /> Antigüedad Cuenta
              </span>
              <span className="mt-1 block font-mono text-base font-bold text-slate-200">
                {node.accountAgeDays} días
              </span>
              <span className="text-[10px] text-slate-500">Creada: {node.creationDate.slice(0, 10)}</span>
            </div>

            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Share2 className="h-3 w-3 text-indigo-400" /> Ratio Seguidores
              </span>
              <span className="mt-1 block font-mono text-base font-bold text-slate-200">
                {node.followerFollowingRatio.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-500">
                {node.followersCount} seg. / {node.followingCount} seguidos
              </span>
            </div>

            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="h-3 w-3 text-indigo-400" /> Jitter Temporal
              </span>
              <span
                className={`mt-1 block font-mono text-base font-bold ${
                  node.temporalMetrics.intervalJitterSeconds < 1.0 ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {node.temporalMetrics.intervalJitterSeconds.toFixed(2)}s
              </span>
              <span className="text-[10px] text-slate-500">
                {node.temporalMetrics.intervalJitterSeconds < 1.0 ? 'Script/Cron Automático' : 'Comportamiento Humano'}
              </span>
            </div>

            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FileText className="h-3 w-3 text-indigo-400" /> Duplicación de Texto
              </span>
              <span
                className={`mt-1 block font-mono text-base font-bold ${
                  node.contentMetrics.exactCopyPasteRatio > 0.7 ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {Math.round(node.contentMetrics.exactCopyPasteRatio * 100)}%
              </span>
              <span className="text-[10px] text-slate-500">Astroturfing idéntico</span>
            </div>
          </div>

          {/* 4 Diagnostic Pillars Breakdown */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Desglose de Vectores Forenses de Ciberseguridad
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Pillar 1: Graph Topology */}
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-[#1E293B] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5 text-indigo-400" />
                    Topología & Centralidad
                  </span>
                  <span className="font-mono text-indigo-300">Comunidad #{node.louvainCommunity}</span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Grado de Conectividad (Degree):</span>
                    <span className="font-mono text-slate-200">{node.centrality.degree} enlaces</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Intermediación (Betweenness):</span>
                    <span className="font-mono text-slate-200">{node.centrality.betweenness.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>PageRank Topológico:</span>
                    <span className="font-mono text-slate-200">{node.centrality.pageRank.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Coeficiente de Agrupamiento:</span>
                    <span className="font-mono text-slate-200">{node.centrality.clusteringCoefficient.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Temporal Behavior */}
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-[#1E293B] pb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    Heurísticas Temporales
                  </span>
                  <span className="font-mono text-indigo-300">{node.postsPerDay} posts/día</span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Intervalo Mediano:</span>
                    <span className="font-mono text-slate-200">{node.temporalMetrics.medianIntervalSeconds}s</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Jitter de Ejecución:</span>
                    <span className="font-mono text-slate-200">{node.temporalMetrics.intervalJitterSeconds.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ráfagas Sincronizadas (Bursts):</span>
                    <span className="font-mono text-slate-200">{node.temporalMetrics.burstCount} eventos</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Actividad Nocturna 24/7:</span>
                    <span className="font-mono text-slate-200">
                      {Math.round(node.temporalMetrics.nightActivityRatio * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geolocation & Infrastructure Origin */}
            {node.geoOrigin && (
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 border-b border-[#1E293B] pb-2">
                  <Globe className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Infraestructura de Red y Geolocalización de Egress</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-slate-400">País / Nodo:</span>{' '}
                    <span className="font-medium text-slate-200">{node.geoOrigin.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ASN / Proveedor:</span>{' '}
                    <span className="font-mono text-slate-200">{node.geoOrigin.asn || 'No asignado'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">VPN / Datacenter Proxy:</span>{' '}
                    <span
                      className={`font-semibold ${
                        node.geoOrigin.isVpnOrProxy ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {node.geoOrigin.isVpnOrProxy ? 'SÍ (Sospechoso)' : 'NO (Residencial)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Forensics: Identity Audit & Zombie Account Mutation */}
            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Fingerprint className="h-4 w-4 text-amber-400" />
                  <span>Auditoría Forense de Identidad: Trazabilidad de Cuenta Zombi & Mercado Negro</span>
                </div>
                {node.zombieAudit?.isZombieAccount ? (
                  <span className="flex items-center gap-1 rounded-sm border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                    <ShoppingBag className="h-3 w-3" /> MUTACIÓN ANÓMALA / COMPRA CONFIRMADA
                  </span>
                ) : (
                  <span className="rounded-sm border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                    HISTORIAL DIGITAL COHERENTE (ORGÁNICO)
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-3 text-xs">
                {/* Immutable ID and Evidence */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-2.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Identificador Numérico Inmutable (User ID):
                    </span>
                    <span className="mt-0.5 block font-mono text-sm font-bold text-amber-300">
                      {node.zombieAudit?.immutableUserId || node.id}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-500 leading-tight">
                      Identificador criptográfico de bajo nivel asignado por la plataforma. Permanece inalterable aunque se cambie el @handle, idioma o avatar.
                    </p>
                  </div>

                  <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-2.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Periodo de Inactividad (Dormancia):
                    </span>
                    <span
                      className={`mt-0.5 block font-mono text-sm font-bold ${
                        (node.zombieAudit?.dormancyPeriodDays || 0) > 30 ? 'text-rose-400' : 'text-slate-200'
                      }`}
                    >
                      {node.zombieAudit?.dormancyPeriodDays
                        ? `${node.zombieAudit.dormancyPeriodDays} días dormida`
                        : '0 días (Actividad continua regular)'}
                    </span>
                    <p className="mt-1 text-[10px] text-slate-500 leading-tight">
                      Reactivación súbita tras meses sin publicaciones para amplificar narrativas específicas.
                    </p>
                  </div>
                </div>

                {/* Mutation History Timeline */}
                {node.zombieAudit?.previousHandles && node.zombieAudit.previousHandles.length > 0 && (
                  <div className="rounded-sm border border-rose-500/30 bg-rose-950/20 p-3">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-300 uppercase font-mono">
                      <History className="h-3.5 w-3.5" /> Historial de Identidades Anteriores (Wayback & DNS Archive):
                    </span>
                    <div className="mt-2 space-y-1.5">
                      {node.zombieAudit.previousHandles.map((prev, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center justify-between gap-1 rounded-sm bg-[#0A0C10] px-2.5 py-1.5 text-[11px]"
                        >
                          <span className="font-mono font-bold text-rose-400">{prev.handle}</span>
                          <span className="text-slate-400">Intervalo: {prev.detectedRange}</span>
                          <span className="text-slate-400">Idioma: {prev.language}</span>
                          <span className="text-slate-300 italic">Temática: {prev.topic}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-rose-200/80">
                      <span>➡️</span>
                      <span>
                        <strong>Mutación a temática actual:</strong> {node.zombieAudit.repurposedDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Technical Footprint: JA3 TLS & Canvas */}
                <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 pb-1 border-b border-[#1E293B]">
                    <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Huella de Infraestructura & Automatización de Peticiones</span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] block">
                        Huella TLS del Cliente (JA3 / JA4):
                      </span>
                      <span className="font-mono text-slate-200 break-all text-[10px]">
                        {node.zombieAudit?.ja3TlsHash || 'No analizado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] block">
                        Entropía de Dispositivo / Driver:
                      </span>
                      <span className="font-mono text-slate-200 text-[10px]">
                        {node.zombieAudit?.deviceEntropy || 'Dispositivo estándar'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 border-t border-[#1E293B]/60 pt-1.5">
                    <strong>Análisis Técnico:</strong> {node.zombieAudit?.marketEvidenceNote || 'Sin anomalías registradas.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Flagged Posts */}
            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-[#1E293B] pb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-orange-400" />
                  Muestra de Publicaciones Detectadas
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Hashtags: {node.contentMetrics.topHashTags.join(' ')}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {node.contentMetrics.samplePosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-sm border border-[#1E293B] bg-[#111827] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span className="font-mono text-slate-400">{post.timestamp}</span>
                      {post.isExactDuplicate && (
                        <span className="rounded-sm border border-rose-500/30 bg-rose-500/20 px-1.5 py-0.5 font-mono text-rose-300">
                          CLÓN IDÉNTICO DETECTADO
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-sans text-slate-300 leading-relaxed">
                      "{post.text}"
                    </p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Impacto/Difusiones: {post.sharesOrRetweets}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1E293B] bg-[#0F172A] px-6 py-3 text-xs text-slate-400">
          <span className="font-mono text-[11px]">Identificador Criptográfico: {node.id}</span>
          <button
            onClick={onClose}
            className="rounded-sm border border-[#1E293B] bg-[#111827] px-4 py-1.5 font-medium text-slate-200 hover:bg-[#1E293B] transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
