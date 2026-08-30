/**
 * AegisNet-BotRadar: Generador & Visor de Informes Forenses Auditables
 * Emisión de evidencias abiertas en PDF (5 páginas), CSV primario, GEXF, y STIX 2.1
 * 
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  Table,
  Lock,
  Scale,
  Network,
  Code2,
  Fingerprint,
  Image as ImageIcon,
  Clock,
  Cpu,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { InvestigationCampaign } from '../types/botradar';
import {
  generateForensicPDF,
  exportNodesCSV,
  exportBurstEventsCSV,
  exportGEXFGraph,
  exportDISARMJson
} from '../services/forensicReport';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: InvestigationCampaign;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  campaign
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    generateForensicPDF(campaign);
    setDownloadSuccess('Dossier pericial formal de 5 páginas descargado en formato PDF con sellado SHA-256.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadNodesCSV = () => {
    exportNodesCSV(campaign);
    setDownloadSuccess('Inventario completo de los 36 nodos exportado en CSV (IDs inmutables, ASN y BGP).');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadBurstCSV = () => {
    exportBurstEventsCSV(campaign);
    setDownloadSuccess('Registro de micro-ráfaga con marcas de tiempo en milisegundos (reloj NTP Stratum 1) descargado.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadGEXF = () => {
    exportGEXFGraph(campaign);
    setDownloadSuccess('Grafo topológico GEXF exportado para análisis reproducible en Gephi o Cytoscape.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadDISARM = () => {
    exportDISARMJson(campaign);
    setDownloadSuccess('Paquete STIX 2.1 / DISARM exportado con taxonomía internacional de contramedidas.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const cib = campaign.cibBreakdown;
  const zombieNodes = campaign.nodes.filter((n) => n.zombieAudit?.isZombieAccount);
  const matrix = campaign.confidenceMatrix || [];
  const benchmark = campaign.classifierBenchmark;
  const custody = campaign.chainOfCustody || [];
  const burstEvents = campaign.burstEvents || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C10]/85 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-[#1E293B] bg-[#111827] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-cyan-500/30 bg-cyan-950/30 text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Dossier Técnico Forense y Exportación de Datos Primarios
                </h3>
                <span className="rounded-sm border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                  REPRODUCIBLE OSINT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evidencia empírica abierta: NTP Stratum 1 (±0.045s), inventario íntegro de 36 nodos, pHash y matriz de confianza
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1E293B] bg-[#111827] text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notification banner */}
        {downloadSuccess && (
          <div className="flex items-center gap-2 border-b border-emerald-500/40 bg-emerald-950/40 px-6 py-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs text-[#E2E8F0]">
          {/* Quick Export Hub Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            <button
              onClick={handleDownloadPDF}
              className="flex flex-col items-start justify-between rounded-sm border border-cyan-500/40 bg-cyan-950/30 p-3 text-left hover:border-cyan-400 hover:bg-cyan-900/30 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Download className="h-4 w-4" />
                <span className="text-xs font-mono">Dossier PDF (5 Págs)</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-300">
                Dossier técnico formal con desglose completo de 36 nodos y matriz de certeza.
              </p>
              <span className="mt-2 text-[10px] font-mono text-cyan-300 underline">Descargar PDF ⬇</span>
            </button>

            <button
              onClick={handleDownloadNodesCSV}
              className="flex flex-col items-start justify-between rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-left hover:border-indigo-500/50 hover:bg-[#111827] transition-all group"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Table className="h-4 w-4" />
                <span className="text-xs font-mono">CSV 36 Nodos</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-300">
                Inventario primario: IDs inmutables, BGP ASN, JA3 y P(bot).
              </p>
              <span className="mt-2 text-[10px] font-mono text-indigo-400 underline">Descargar CSV ⬇</span>
            </button>

            <button
              onClick={handleDownloadBurstCSV}
              className="flex flex-col items-start justify-between rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-left hover:border-emerald-500/50 hover:bg-[#111827] transition-all group"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-mono">CSV Micro-Ráfaga</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-300">
                28 eventos en 16.20s con precisión en milisegundos (NTP Stratum 1).
              </p>
              <span className="mt-2 text-[10px] font-mono text-emerald-400 underline">Descargar CSV ⬇</span>
            </button>

            <button
              onClick={handleDownloadGEXF}
              className="flex flex-col items-start justify-between rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-left hover:border-blue-500/50 hover:bg-[#111827] transition-all group"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Network className="h-4 w-4" />
                <span className="text-xs font-mono">GEXF (Gephi)</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-300">
                Grafo topológico para apertura en Gephi o Cytoscape.
              </p>
              <span className="mt-2 text-[10px] font-mono text-blue-400 underline">Descargar .gexf ⬇</span>
            </button>

            <button
              onClick={handleDownloadDISARM}
              className="flex flex-col items-start justify-between rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-left hover:border-amber-500/50 hover:bg-[#111827] transition-all group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Code2 className="h-4 w-4" />
                <span className="text-xs font-mono">STIX 2.1 DISARM</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-300">
                TTPs mapeados en estándar internacional DISARM contra desinformación.
              </p>
              <span className="mt-2 text-[10px] font-mono text-amber-400 underline">Descargar .json ⬇</span>
            </button>
          </div>

          {/* Legal and Epistemic Disclaimer Box */}
          <div className="rounded-sm border border-rose-500/30 bg-rose-950/20 p-3.5">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-300 text-xs">
                  Aviso Metodológico y Límites Periciales (No Atribución Estatal en Telemetría Abierta):
                </p>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  El presente informe pericial preliminar expone parámetros técnicos cuantitativos (sincronía temporal de milisegundos, 
                  reciclaje de archivos audiovisuales cotejado por pHash, y huellas TLS JA3). Estos datos demuestran 
                  <strong> automatización e inautenticidad técnica coordinada</strong>, pero <strong className="text-rose-200">NO acreditan autoría jurídica</strong> de personas 
                  físicas ni permiten imputar la acción a servicios de inteligencia de Estados extranjeros, ya que el alquiler de servidores VPS comerciales (Selectel AS48282) 
                  y pasarelas móviles 4G (Maroc Telecom AS36903) está al alcance de actores privados independientes.
                </p>
              </div>
            </div>
          </div>

          {/* Report Metadata and Cryptographic Sealing */}
          <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-2.5">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                  IDENTIFICADOR TÉCNICO DE INVESTIGACIÓN
                </span>
                <h4 className="text-sm font-bold text-white">{campaign.title}</h4>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-400">
                <div>Código: <span className="text-slate-200">{campaign.investigationCode}</span></div>
                <div>Clasificación: <span className="font-bold text-cyan-400">INFORME PRELIMINAR (NO VINCULANTE)</span></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#1E293B] bg-[#111827] p-2.5 text-[11px]">
              <span className="flex items-center gap-1.5 font-mono text-slate-400">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                Sellado Criptográfico SHA-256 Inmutable:
              </span>
              <span className="font-mono font-bold text-cyan-300 break-all text-[10px]">
                {campaign.datasetSha256}
              </span>
            </div>

            {/* Structured Evidence -> Inference -> Limits Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3 space-y-1.5">
                <span className="text-xs font-bold text-slate-200">1. Evidencia Empírica Observada</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>28 publicaciones textuales idénticas emitidas en 16.20 segundos.</li>
                  <li>Cron-jitter submétrico medio de 0.18s medido con reloj NTP Stratum 1 (±0.045s).</li>
                  <li>Coincidencia audiovisual del 99.4% (pHash DCT) con archivo de RTVE de julio de 2018.</li>
                  <li>Nodos de salida en AS48282 (Selectel VPS Rusia) y AS36903 (Maroc Telecom 4G).</li>
                </ul>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-3 space-y-1.5">
                <span className="text-xs font-bold text-slate-200">2. Inferencia &amp; Límites de Conclusión</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>La latencia inferior a 0.35s descarta fisiológicamente interacción manual humana.</li>
                  <li>El clasificador AegisNet-CIB-v1.2 otorga probabilidad P(bot) = 0.94.</li>
                  <li><strong className="text-rose-400">Límite:</strong> No se puede atribuir autoría estatal ni imputación penal sin investigación judicial o SIGINT.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Matriz de Certeza Metodológica (Confidence Matrix) */}
          {matrix.length > 0 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
                  <Scale className="h-4 w-4" />
                  <span>Matriz de Confianza y Certeza Metodológica por Dimensión Analítica</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  7 Dimensiones Auditadas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1E293B] bg-[#0F172A] text-slate-400 font-mono text-[10px]">
                      <th className="p-2">Dimensión Analítica</th>
                      <th className="p-2">Nivel de Certeza</th>
                      <th className="p-2">Fundamento Técnico Cuantitativo</th>
                      <th className="p-2">Salvedades y Límites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {matrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#0A0C10]/50 transition-colors">
                        <td className="p-2 font-bold text-slate-200">{item.dimension}</td>
                        <td className="p-2">
                          {item.confidenceLevel === 'HIGH' ? (
                            <span className="rounded-sm border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                              ALTA (CONFIRMADO)
                            </span>
                          ) : item.confidenceLevel === 'MEDIUM' ? (
                            <span className="rounded-sm border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                              MEDIA (INFERIDO)
                            </span>
                          ) : (
                            <span className="rounded-sm border border-slate-600/40 bg-slate-800/40 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-400">
                              NO ATRIBUIBLE (N/A)
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-slate-300 leading-snug">{item.technicalGrounding}</td>
                        <td className="p-2 text-slate-400 leading-snug">{item.caveatsAndLimitations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Benchmark del Clasificador & Fórmula CIB */}
          {benchmark && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-indigo-400">
                  <Cpu className="h-4 w-4" />
                  <span>Fórmula Matemática CIB &amp; Benchmark del Clasificador</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  P(inauténtico) = 0.94
                </span>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 font-mono text-[11px] text-cyan-300">
                CIB = (0.30 * S_topologico) + (0.30 * S_temporal) + (0.25 * S_semantico) + (0.15 * S_metadatos)
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-center">
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2">
                  <span className="block text-[9px] font-mono text-slate-400">Precisión</span>
                  <span className="font-mono text-base font-bold text-white">{(benchmark.precision * 100).toFixed(1)}%</span>
                </div>
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2">
                  <span className="block text-[9px] font-mono text-slate-400">Recall</span>
                  <span className="font-mono text-base font-bold text-white">{(benchmark.recall * 100).toFixed(1)}%</span>
                </div>
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2">
                  <span className="block text-[9px] font-mono text-slate-400">F1-Score</span>
                  <span className="font-mono text-base font-bold text-white">{benchmark.f1Score.toFixed(3)}</span>
                </div>
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2">
                  <span className="block text-[9px] font-mono text-slate-400">Umbral Corte</span>
                  <span className="font-mono text-base font-bold text-white">&gt;= {benchmark.decisionThreshold.toFixed(2)}</span>
                </div>
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2">
                  <span className="block text-[9px] font-mono text-slate-400">Falsos Positivos</span>
                  <span className="font-mono text-base font-bold text-emerald-400">3.8% (Est.)</span>
                </div>
              </div>
            </div>
          )}

          {/* Cadena de Custodia Criptográfica (Chain of Custody) */}
          {custody.length > 0 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                  <Lock className="h-4 w-4 text-cyan-400" />
                  <span>Cadena de Custodia Criptográfica (Chain of Custody)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  5 Fases Inmutables Selladas
                </span>
              </div>

              <div className="space-y-2">
                {custody.map((step) => (
                  <div
                    key={step.step}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5 text-[11px]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">Fase 0{step.step}: {step.phase}</span>
                        <span className="font-mono text-[10px] text-slate-500">{step.timestampUtc}</span>
                      </div>
                      <p className="text-slate-300">{step.actionDescription}</p>
                      <div className="font-mono text-[10px] text-slate-500">
                        Actor: {step.actor}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] text-cyan-300">
                      {step.evidenceHashSha256.slice(0, 24)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audiovisual Forensics: EXIF & pHash */}
          {campaign.exifForensics && campaign.exifForensics.length > 0 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400">
                  <ImageIcon className="h-4 w-4" />
                  <span>Peritaje Audiovisual: Cotejo Perceptual pHash y EXIF Stripping</span>
                </div>
                <span className="rounded-sm border border-rose-500/40 bg-rose-950/30 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                  RECICLAJE HISTÓRICO VERIFICADO
                </span>
              </div>
              {campaign.exifForensics.map((exif) => (
                <div
                  key={exif.id}
                  className="space-y-1.5 rounded-sm border border-cyan-500/20 bg-[#0A0C10] p-3 text-[11px]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-slate-300">
                    <span>Archivo: <strong className="text-white">{exif.filename}</strong></span>
                    <span className="text-cyan-400 font-mono text-[10px]">Coincidencia pHash DCT: {exif.matchPercentage}%</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-slate-400 sm:grid-cols-2">
                    <div>
                      <strong>Contexto Alegado:</strong> {exif.claimedContext}
                    </div>
                    <div>
                      <strong>Origen Real Cotejado:</strong>{' '}
                      <span className="text-amber-300">{exif.trueOriginContext}</span>
                    </div>
                  </div>
                  {exif.historicalArchiveMatch && (
                    <div className="text-[10px] font-mono text-slate-500">
                      Cotejo Archivo RTVE: {exif.historicalArchiveMatch}
                    </div>
                  )}
                  <div className="mt-1 border-t border-[#1E293B] pt-1.5 text-rose-300">
                    <strong>Dictamen Pericial:</strong> {exif.verdict}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zombie Account Findings */}
          {zombieNodes.length > 0 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 border-b border-[#1E293B] pb-2 font-mono text-xs font-bold text-rose-400">
                <Fingerprint className="h-4 w-4" />
                <span>Auditoría de Cuentas Zombi Compradas (Trazabilidad de ID Numérico Inmutable)</span>
              </div>
              <div className="space-y-1.5">
                {zombieNodes.slice(0, 3).map((zNode) => (
                  <div
                    key={zNode.id}
                    className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5 text-[11px]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-mono font-bold text-slate-200">
                        {zNode.handle} ({zNode.displayName})
                      </span>
                      <span className="font-mono text-amber-300 text-[10px]">
                        User ID Inmutable: {zNode.zombieAudit?.immutableUserId}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-400 leading-tight">
                      {zNode.zombieAudit?.marketEvidenceNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with copyright and download actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E293B] bg-[#0F172A] px-6 py-3.5">
          <div className="text-[11px] text-slate-400">
            Copyright © M. Castillo — Contacto pericial:{' '}
            <span className="font-mono text-slate-300">mybloggingnotes@gmail.com</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadGEXF}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:bg-[#1E293B] transition-colors"
            >
              <Network className="h-3.5 w-3.5" />
              <span>GEXF</span>
            </button>

            <button
              onClick={handleDownloadDISARM}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-[#1E293B] transition-colors"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>DISARM</span>
            </button>

            <button
              onClick={handleDownloadBurstCSV}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-[#1E293B] transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>CSV Ráfaga</span>
            </button>

            <button
              onClick={handleDownloadNodesCSV}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-[#1E293B] transition-colors"
            >
              <Table className="h-3.5 w-3.5 text-indigo-400" />
              <span>CSV 36 Nodos</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 rounded-sm border border-cyan-500/40 bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-cyan-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar Dossier PDF (5 Págs)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
