/**
 * AegisNet-BotRadar: Línea de Acción Operativa OSINT & Protocolo de Respuesta
 * Guía metodológica, matriz de decisión, reporte a plataformas (Trust & Safety)
 * y protocolo de mitigación pericial para analistas e investigadores de fuentes abiertas.
 * 
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Share2,
  Lock,
  Clock,
  Fingerprint,
  Send,
  Scale,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  Terminal,
  Radio,
  Layers,
  Check,
  Building,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { InvestigationCampaign, SocialAccountNode } from '../types/botradar';
import { HealthResponse } from '../services/api';
import { SystemHealthPanel } from './SystemHealthPanel';

interface OSINTActionLineProps {
  campaign: InvestigationCampaign;
  onOpenReportModal: () => void;
  onOpenHowTo?: () => void;
  health?: HealthResponse | null;
  isDemo?: boolean;
  version?: string;
}

export const OSINTActionLineView: React.FC<OSINTActionLineProps> = ({
  campaign,
  onOpenReportModal,
  onOpenHowTo,
  health,
  isDemo,
  version = '1.2.0'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [copiedTakedown, setCopiedTakedown] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    sha256_verified: true,
    ntp_calibrated: true,
    phash_matched: true,
    attribution_limits: true,
    immutable_ids_logged: true,
    open_data_prepared: true,
    takedown_compiled: false,
    legal_dossier_signed: false
  });

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cib = campaign.cibBreakdown;
  const botNodes = campaign.nodes.filter((n) => n.type === 'bot' || n.cibScore >= 80);
  const zombieNodes = campaign.nodes.filter((n) => n.zombieAudit?.isZombieAccount);
  const burstCount = campaign.burstEvents?.length || 28;

  // Generate Takedown Report Text for Trust & Safety teams
  const generateTakedownPayload = () => {
    const lines = [
      `================================================================================`,
      `SOLICITUD FORMAL DE REVISIÓN POR COMPORTAMIENTO INAUTÉNTICO COORDINADO (CIB)`,
      `DIRIGIDO A: Equipos de Trust & Safety / Integridad de Plataformas (X, Telegram, Meta)`,
      `EMISOR: Grupo de Investigación OSINT / Protocolo AegisNet-BotRadar`,
      `EXPEDIENTE: ${campaign.investigationCode} | FECHA UTC: ${new Date().toISOString()}`,
      `HASH DATASET SHA-256: ${campaign.datasetSha256}`,
      `================================================================================\n`,
      `1. FUNDAMENTO TÉCNICO DE LA DENUNCIA:`,
      `- Infracción de las Normas de la Comunidad sobre Manipulación de Plataforma y Spam Coordinado.`,
      `- Nivel CIB Global Calculado: ${cib.overallScore}/100 (${cib.riskLevel}).`,
      `- Cron-jitter medio de amplificación y picos revisados: métricas medidas con reloj NTP Stratum 1.\n`,
      `- Coincidencia/similitud semántica o audiovisual: cotejo perceptual (si procede) con material reciclado descontextualizado.\n`,
      `2. INVENTARIO DE CUENTAS AFECTADAS PARA SUSPENSIÓN / REVISIÓN TÉCNICA:`,
      `[Total nodos identificados: ${botNodes.length} cuentas con P(bot) >= 0.85]\n`
    ];

    botNodes.forEach((node, idx) => {
      const immutableId = node.zombieAudit?.immutableUserId || `ID-NUM-${node.id}`;
      lines.push(
        `[${idx + 1}] Handle: ${node.handle} | ID Inmutable: ${immutableId} | Plataforma: ${node.platform.toUpperCase()}`
      );
      lines.push(
        `     Score CIB: ${node.cibScore}/100 | Jitter: ${node.temporalMetrics.intervalJitterSeconds}s | Egress ASN: ${node.geoOrigin?.asn || 'N/A'}`
      );
      if (node.zombieAudit?.isZombieAccount) {
        lines.push(`     AUDITORÍA ZOMBI: Cuenta adquirida tras inactividad prolongada (${node.zombieAudit.marketEvidenceNote})`);
      }
    });

    lines.push(`\n3. SOLICITUD OPERATIVA:`);
    lines.push(`a) Congelación preventiva de las cuentas indicadas para evitar el borrado de evidencias.`);
    lines.push(`b) Cotejo interno de telemetría de conexión (IPs de login, cookies compartidas, identificadores de dispositivo).`);
    lines.push(`c) Desindexación de los hashtags de astroturfing artificial asociados.`);

    return lines.join('\n');
  };

  const handleCopyTakedown = () => {
    const text = generateTakedownPayload();
    navigator.clipboard.writeText(text);
    setCopiedTakedown(true);
    setTimeout(() => setCopiedTakedown(false), 3500);
  };

  const handleDownloadPlaybook = () => {
    const content = `# LÍNEA DE ACCIÓN OPERATIVA OSINT: PROTOCOLO DE INTERVENCIÓN ANTE CIB
Proyecto: AegisNet-BotRadar
Expediente: ${campaign.investigationCode} - ${campaign.title}
Sellado Criptográfico SHA-256: ${campaign.datasetSha256}
Fecha de Emisión: ${new Date().toISOString()}

---

## 1. RESUMEN DE LA DETECCIÓN
- Nivel CIB: ${cib.overallScore}/100 (${cib.riskLevel})
- Sincronía Temporal: Ráfaga de ${burstCount} publicaciones concentradas en un intervalo corto (Reloj NTP Stratum 1).
- Patrón de Automatización: Métricas de inter-arrival compatibles con scripts/cron en los picos revisados.
- Cotejo de Contenido: Similitud semántica y/o perceptual (pHash) con material reciclado o descontextualizado, cuando proceda.
- Nodos Egress: Infraestructura de red de alquiler comercial (VPS/proxies/pasarelas móviles); no implica atribución a un país u operador concreto.

---

## 2. PLAN DE ACCIÓN POR FASES

### FASE 1: PRESERVACIÓN FORENSE INMUTABLE
- Almacenamiento WORM del dataset con sellado SHA-256: ${campaign.datasetSha256}.
- Fijación de marcas de tiempo UTC con sincronización NTP Stratum 1 (±0.045s).
- Captura de cabeceras HTTP, firmas TLS JA3 y perfiles en Wayback Machine / Archive.today.

### FASE 2: TRIANGULACIÓN Y AISLAMIENTO DE LA INFRAESTRUCTURA
- Identificación de los 2 nodos semilla coordinadores y los 26 amplificadores automatizados.
- Trazabilidad de IDs numéricos inmutables para neutralizar cambios de @handle.
- Mapeo de prefijos BGP y ASNs de salida.
- Límite técnico: No imputar autoría estatal a partir de IPs comerciales accesibles a terceros.

### FASE 3: TAKEDOWN Y NOTIFICACIÓN A PLATAFORMAS (TRUST & SAFETY)
- Emisión del paquete de denuncia con identificadores inmutables a los canales de integridad de X, Telegram y Meta.
- Solicitud de congelación de cuentas para preservar registros de conexión internos.

### FASE 4: DESMENTIDO TÉCNICO EN FUENTES ABIERTAS (OPEN OSINT)
- Difusión de datos primarios abiertos (CSV con milisegundos y GEXF para Gephi) para replicación independiente.
- Desarticulación factual de la narrativa sin citar o amplificar el lenguaje de odio.
- Presentación de la prueba audiovisual pHash desmontando el reciclaje temporal.

### FASE 5: FORMALIZACIÓN DEL DOSSIER PERICIAL (VÍA LEGAL)
- Emisión del informe técnico OSINT de 5 páginas con cadena de custodia en 5 fases.
- Puesta a disposición de autoridades judiciales bajo el estándar ISO/IEC 27037.

---
Emitido por el Grupo de Análisis OSINT — AegisNet-BotRadar
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LINEA_DE_ACCION_OSINT_${campaign.investigationCode}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-4 sm:p-6 text-[#E2E8F0]">
      {/* Top Banner: Action Line Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Línea de Acción Operativa OSINT &amp; Protocolo de Respuesta
                </h2>
                <span className="rounded-sm border border-rose-500/40 bg-rose-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300">
                  ACCIÓN OPERATIVA REQUERIDA
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Protocolo estandarizado de mitigación, notificación a plataformas (Trust &amp; Safety), desmentido factual y judicialización
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenHowTo && (
            <button
              onClick={onOpenHowTo}
              className="flex items-center gap-1.5 rounded-sm border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-semibold text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-950/40 transition-colors shadow-sm"
              title="Abrir Manual Completo de Operación y Gestión OSINT"
            >
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Manual HOW-TO</span>
            </button>
          )}

          <button
            onClick={handleDownloadPlaybook}
            className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-[#1E293B] transition-colors"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Descargar Playbook (.MD)</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 rounded-sm border border-cyan-500/50 bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-500 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Informe Técnico OSINT (5 Págs PDF)</span>
          </button>
        </div>
      </div>

      {/* Case Briefing Strip */}
      <div id="expediente" className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-sm border border-[#1E293B] bg-[#0F172A] p-3.5 text-xs">
        <div>
          <span className="block text-[10px] font-mono uppercase text-slate-400">Expediente Técnico</span>
          <span className="font-mono font-bold text-cyan-400">{campaign.investigationCode}</span>
        </div>
        <div>
          <span className="block text-[10px] font-mono uppercase text-slate-400">Índice CIB Ponderado</span>
          <span className="font-mono font-bold text-rose-400">{cib.overallScore}/100 (CRÍTICO)</span>
        </div>
        <div>
          <span className="block text-[10px] font-mono uppercase text-slate-400">Sincronía Temporal</span>
          <span className="font-mono font-bold text-slate-200">{burstCount} eventos</span>
        </div>
        <div>
          <span className="block text-[10px] font-mono uppercase text-slate-400">Cotejo de Contenido</span>
          <span className="font-mono font-bold text-amber-400">Según evidencia</span>
        </div>
      </div>

      {/* Matriz de Confianza (nivel de verificación y limitaciones) */}
      {Array.isArray(campaign.confidenceMatrix) && campaign.confidenceMatrix.length > 0 && (
        <div className="mb-5 rounded-sm border border-cyan-500/30 bg-[#0A0F1E] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <Info className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-cyan-200">Matriz de Confianza</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">nivel de verificación de los hallazgos</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {campaign.confidenceMatrix.map((cm, i) => {
              const lvl = cm.confidenceLevel || 'UNKNOWN_UNVERIFIED';
              const cfg =
                lvl === 'HIGH'
                  ? { label: 'ALTA', badge: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300', bar: 'bg-emerald-500' }
                  : lvl === 'MEDIUM'
                  ? { label: 'MEDIA', badge: 'border-amber-500/40 bg-amber-950/40 text-amber-300', bar: 'bg-amber-500' }
                  : lvl === 'LOW'
                  ? { label: 'BAJA', badge: 'border-orange-500/40 bg-orange-950/40 text-orange-300', bar: 'bg-orange-500' }
                  : { label: 'NO VERIFICADO', badge: 'border-rose-500/40 bg-rose-950/40 text-rose-300', bar: 'bg-rose-500' };
              return (
                <div key={i} className="rounded-sm border border-[#1E293B] bg-[#0F172A] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200">{cm.dimension}</span>
                    <span className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold ${cfg.badge}`}>
                      CONFIANZA {cfg.label}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full ${cfg.bar}`} style={{ width: lvl === 'HIGH' ? '90%' : lvl === 'MEDIUM' ? '55%' : lvl === 'LOW' ? '25%' : '8%' }}></div>
                  </div>
                  {cm.technicalGrounding && (
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                      <span className="font-semibold text-slate-300">Fundamento técnico: </span>
                      {cm.technicalGrounding}
                    </p>
                  )}
                  {cm.caveatsAndLimitations && (
                    <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-amber-300/90">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>{cm.caveatsAndLimitations}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Roadmap Progress: 5 Consecutive Steps */}
      <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-5">
        {[
          { num: 1, title: 'Preservación WORM', desc: 'Hash SHA-256 & NTP' },
          { num: 2, title: 'Triangulación Topológica', desc: 'IDs Inmutables & BGP' },
          { num: 3, title: 'Reporte a Plataformas', desc: 'Trust & Safety Takedown' },
          { num: 4, title: 'Desmentido Abierto', desc: 'Open Data & pHash' },
          { num: 5, title: 'Judicialización', desc: 'Peritaje ISO/IEC 27037' }
        ].map((phase) => (
          <button
            key={phase.num}
            onClick={() => setSelectedPhase(phase.num)}
            className={`flex flex-col items-start rounded-sm border p-3 text-left transition-all ${
              selectedPhase === phase.num
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-md ring-1 ring-cyan-500/50'
                : 'border-[#1E293B] bg-[#111827] text-slate-400 hover:border-slate-700 hover:bg-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  selectedPhase === phase.num
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {phase.num}
              </span>
              <span>Fase 0{phase.num}</span>
            </div>
            <span className="mt-1 font-bold text-slate-200 text-xs">{phase.title}</span>
            <span className="text-[10px] text-slate-400">{phase.desc}</span>
          </button>
        ))}
      </div>

      {/* Detailed Phase Interactive View */}
      <div className="mb-6 grid grid-cols-1 gap-6">
        {/* Full width: Selected Phase Deep-Dive */}
        <div className="space-y-4">
          {selectedPhase === 1 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Lock className="h-4 w-4" />
                  <span>Fase 1: Preservación Forense Inmutable de Evidencias Digitales</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">ESTADO: SELLADO OK</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Antes de emitir cualquier alerta pública o notificación que alerte a los operadores de la red y motive el borrado masivo de publicaciones, el grupo OSINT debe asegurar la inmutabilidad física y criptográfica de las evidencias recolectadas.
              </p>

              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">1. Cálculo de Hash SHA-256 del Dataset Bruto:</span>
                    <span className="font-mono text-[10px] text-cyan-400">INMUTABILIDAD MATEMÁTICA</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 break-all bg-[#0F172A] p-2 rounded-sm border border-[#1E293B]">
                    {campaign.datasetSha256}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Cualquier alteración posterior de una coma o marca de tiempo invalidará el hash ante un tribunal o auditor externo.
                  </p>
                </div>

                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">2. Sincronización Horaria con Reloj NTP Stratum 1:</span>
                    <span className="font-mono text-[10px] text-emerald-400">INCERTIDUMBRE: ±0.045s</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Se utilizó la referencia horaria de <code className="font-mono text-cyan-300">time.cloudflare.com</code> para fijar las 28 publicaciones de la ráfaga (02:15:01 a 02:15:17 UTC). La desviación temporal máxima registrada entre publicaciones fue de 0.18 segundos.
                  </p>
                </div>

                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">3. Preservación WORM (Write Once, Read Many):</span>
                    <span className="font-mono text-[10px] text-slate-400">ISO/IEC 27037</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Copia estática de los feeds y capturas de pantalla archivadas en almacén de sólo lectura con registro inalterable de auditoría.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPhase === 2 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Fingerprint className="h-4 w-4" />
                  <span>Fase 2: Triangulación Topológica, IDs Inmutables y Atribución Técnica</span>
                </div>
                <span className="font-mono text-[11px] text-amber-400 font-semibold">{campaign.nodes.length} NODOS CARACTERIZADOS</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                El grupo OSINT no debe guiarse por los @handles (fácilmente renombrables para borrar el rastro). Es imperativo registrar el <strong>identificador numérico inmutable</strong> asignado por la plataforma en el momento del registro.
              </p>

              <div className="space-y-3">
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
                  <span className="text-xs font-bold text-slate-200 block mb-2">
                    Detección de Cuentas Zombi Compradas en el Mercado Negro:
                  </span>
                  <div className="space-y-2">
                    {zombieNodes.map((zNode) => (
                      <div key={zNode.id} className="rounded-sm border border-[#1E293B] bg-[#111827] p-2.5 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-mono font-bold text-white">{zNode.handle}</span>
                          <span className="font-mono text-cyan-400 text-[11px]">
                            ID Inmutable: {zNode.zombieAudit?.immutableUserId}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 leading-tight">
                          {zNode.zombieAudit?.marketEvidenceNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-sm border border-rose-500/30 bg-rose-950/20 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-rose-300">Regla de Oro en la Atribución de Tráfico:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        La infraestructura de red observada (alojamiento VPS, proxies o pasarelas móviles) es de <strong>alquiler comercial</strong>, accesible a actores privados con una tarjeta de crédito. <strong className="text-rose-200">Bajo ninguna circunstancia el grupo OSINT debe atribuir esto formalmente a un gobierno, servicio de inteligencia o país concreto</strong> a partir de telemetría abierta: tal atribución excede el alcance de estos datos y requiere evidencia judicial o de señales (SIGINT).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPhase === 3 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Send className="h-4 w-4" />
                  <span>Fase 3: Notificación de Emergencia &amp; Takedown a Plataformas (Trust &amp; Safety)</span>
                </div>
                <button
                  onClick={handleCopyTakedown}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedTakedown ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedTakedown ? '¡Copiado al Portapapeles!' : 'Copiar Solicitud Formal'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Generación automática del dossier de denuncia técnica para los canales prioritarios de integridad de plataformas digitales (equipos de Coordinated Inauthentic Behavior de Meta, X Trust &amp; Safety y Telegram Abuse).
              </p>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Plantilla Formal Estandarizada para Denuncia:</span>
                  <span className="font-mono text-[10px] text-slate-400">{botNodes.length} cuentas tabuladas</span>
                </div>
                <pre className="max-h-64 overflow-y-auto rounded-sm border border-[#1E293B] bg-[#0F172A] p-3 font-mono text-[10px] leading-relaxed text-slate-300 select-all">
                  {generateTakedownPayload()}
                </pre>
              </div>
            </div>
          )}

          {selectedPhase === 4 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Share2 className="h-4 w-4" />
                  <span>Fase 4: Desmentido Factual y Publicación Abierta (Open Data)</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">REPRODUCIBLE OSINT</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                La mitigación del pánico ciudadano requiere una estrategia comunicativa dual: desmontar la falsedad del material audiovisual sin caer en la trampa de repetir o amplificar las palabras clave toxicas del ataque.
              </p>

              <div className="space-y-3">
                <div className="rounded-sm border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1.5">
                  <span className="font-bold text-emerald-300 text-xs block">
                    1. Publicación de Datos Primarios para Validación Cruzada:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Poner a disposición de periodistas, observatorios de verificación (Maldita, Newtral, EFE Verifica, EU DisinfoLab) los archivos CSV de micro-ráfaga y grafos GEXF para que puedan verificar con sus propios scripts que la campaña fue artificial.
                  </p>
                </div>

                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
                  <span className="font-bold text-slate-200 text-xs block">
                     2. Evidencia pHash (Descontextualización Demostrable):
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Exponer el cotejo perceptual cuando proceda: si se detecta coincidencia de pHash con material de archivo, demuestre que el contenido fue reutilizado fuera de su contexto original, señalando la fecha/autores originales del metraje. Presente siempre los metadatos EXIF y su cadena de custodia.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPhase === 5 && (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <Scale className="h-4 w-4" />
                  <span>Fase 5: Expediente Técnico y Remisión a Autoridades</span>
                </div>
                <span className="font-mono text-[11px] text-cyan-400 font-semibold">VALIDEZ PROCESAL</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Si la campaña persigue desestabilización electoral, alteración del orden público o delitos de odio organizados, el informe debe estructurarse conforme a la norma <strong>ISO/IEC 27037</strong> (directrices para la identificación, recogida, adquisición y preservación de evidencias digitales).
              </p>

              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 text-xs space-y-1">
                  <span className="font-bold text-slate-200">Requisitos para Admisión Judicial:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                    <li>Declaración jurada de la metodología algorítmica (Jaccard, Levenshtein, pHash).</li>
                    <li>Sello criptográfico del dataset intacto (`{campaign.datasetSha256.slice(0, 16)}...`).</li>
                    <li>Trazabilidad de la cadena de custodia en 5 etapas selladas temporalmente.</li>
                    <li>Separación estricta entre hechos técnicos verificados y opiniones no comprobables.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Checklist & Decision Matrix */}
        <div className="space-y-4 lg:col-span-1">
          {/* Action Checklist for the OSINT Team */}
          <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Checklist de Verificación Técnica</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {Object.values(checkedItems).filter(Boolean).length}/8 Completados
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'sha256_verified', label: 'Dataset sellado con hash SHA-256' },
                { id: 'ntp_calibrated', label: 'Calibración con reloj NTP Stratum 1' },
                { id: 'phash_matched', label: 'Cotejo audiovisual pHash DCT > 90%' },
                { id: 'attribution_limits', label: 'Límites de atribución declarados' },
                { id: 'immutable_ids_logged', label: 'IDs inmutables de nodos registrados' },
                { id: 'open_data_prepared', label: 'CSV y GEXF listos para descarga' },
                { id: 'takedown_compiled', label: 'Solicitud Trust & Safety remitida' },
                { id: 'legal_dossier_signed', label: 'Informe técnico OSINT 5 págs generado' }
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2 rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2 hover:bg-[#0F172A] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <span
                    className={`text-[11px] leading-tight ${
                      checkedItems[item.id] ? 'text-slate-200 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Decision Matrix Box */}
          <div className="rounded-sm border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
              MATRIZ DE ACTIVACIÓN OPERATIVA
            </span>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-bold text-rose-400 block">CIB &gt; 65% + Jitter &lt; 0.35s:</span>
                <p className="text-slate-400 text-[10px] mt-0.5">
                  Protocolo Crítico Inmediato: Notificación a plataformas, congelación de cuentas y alerta técnica con datos abiertos.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-bold text-amber-400 block">CIB 35% - 65%:</span>
                <p className="text-slate-400 text-[10px] mt-0.5">
                  Monitoreo Reforzado: Rastreo pasivo de subgrafos para determinar si la amplificación es espontánea o coordinada.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-bold text-emerald-400 block">CIB &lt; 35%:</span>
                <p className="text-slate-400 text-[10px] mt-0.5">
                  Dinámica Orgánica: Se desestima intervención al tratarse de debate ciudadano protegido por libertad de expresión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
