/**
 * AegisNet-BotRadar: Manual de Operación y Gestión Operativa OSINT (HOW-TO)
 * Documento interactivo y guía completa para operar, calibrar y gestionar
 * la plataforma pericial en investigaciones de fuentes abiertas.
 * 
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  X,
  Search,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  FileText,
  AlertTriangle,
  Layers,
  Database,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  Fingerprint,
  Scale,
  Send,
  Share2
} from 'lucide-react';

interface HowToGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToActionLine?: () => void;
  onOpenIngestion?: () => void;
}

interface GuideSection {
  id: string;
  category: 'fundamentos' | 'workflow' | 'ingesta' | 'analisis' | 'accion' | 'gestion';
  title: string;
  subtitle: string;
  badge: string;
  content: React.ReactNode;
}

export const HowToGuideModal: React.FC<HowToGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToActionLine,
  onOpenIngestion
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sec_fundamentos: true,
    sec_workflow: true,
    sec_ingesta: true,
    sec_analisis: true,
    sec_accion: true,
    sec_gestion: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    const rawMarkdown = `# MANUAL DE OPERACIÓN Y GESTIÓN OPERATIVA
## AegisNet-BotRadar: Plataforma Técnica OSINT para Detección y Mitigación de CIB
Versión 2.0 | Guía de Procedimientos para Equipos e Investigadores de Fuentes Abiertas
Copyright © M. Castillo — Contacto: aegis.info@viajeinteligencia.com

---

### 1. INTRODUCCIÓN Y ALCANCE OPERATIVO
AegisNet-BotRadar es una estación de trabajo técnica de fuentes abiertas diseñada para:
- Detectar, aislar y caracterizar cuantitativamente campañas de Comportamiento Inauténtico Coordinado (CIB).
- Proporcionar telemetría forense con resolución de milisegundos referenciada a reloj atómico NTP Stratum 1.
- Generar evidencias técnicas rastreables, con cadena de custodia (ISO/IEC 27037).
- Articular una Línea de Acción Operativa inmediata (takedowns, desmentidos y análisis técnico).

### 2. LÍMITES DE ATRIBUCIÓN (REGLA DE ORO)
- Hecho probable: Conexiones a través de infraestructura de red de alquiler comercial (VPS, proxies, pasarelas móviles).
- Inferencia técnica: Empleo de infraestructura ajena para evadir geocercas y filtros.
- Límite infranqueable: NO imputar autoría a gobiernos estatales sin mandamientos judiciales o SIGINT. Cualquier actor privado puede alquilar VPS y proxies comerciales.

### 3. FLUJO OPERATIVO (5 FASES)
1. Preservación WORM: Sellado SHA-256 y marcas de tiempo NTP Stratum 1 (±0.045s).
2. Triangulación Topológica: Registro de IDs numéricos inmutables y mapeo BGP.
3. Notificación a Plataformas: Solicitud formal a equipos de Trust & Safety para congelación de cuentas.
4. Desmentido Open Data: Publicación de CSV con milisegundos, grafos GEXF y cotejo semántico/perceptual cuando proceda.
5. Formalización del Expediente: Emisión del informe técnico OSINT de 5 páginas con cadena de custodia.

### 4. GESTIÓN Y CALIBRACIÓN DEL MODELO
Fórmula del Score CIB:
CIB = 0.30 * S_topológico + 0.30 * S_temporal + 0.25 * S_semántico + 0.15 * S_metadatos

Umbrales operativos:
- 0-34%: Dinámica orgánica ciudadana (no intervenir).
- 35-64%: Monitoreo pasivo reforzado.
- 65-79%: Coordinación inauténtica probable.
- 80-100%: CIB crítico / Ataque automatizado (ejecución de Línea de Acción).

### 5. SEGURIDAD OPERACIONAL (OPSEC)
- Aislamiento de entornos con máquinas virtuales o contenedores limpios.
- Uso de cuentas sock puppet no vinculadas para observación pasiva.
- No tocar la infraestructura del adversario (cero escaneos o peticiones activas).
- Preservación inmutable del dataset de origen.
`;

    const blob = new Blob([rawMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MANUAL_OPERACION_GESTION_OSINT_BOTRADAR.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections: GuideSection[] = useMemo(
    () => [
      {
        id: 'sec_fundamentos',
        category: 'fundamentos',
        title: '1. Fundamentos Técnicos y Límites de Atribución',
        subtitle: 'Principios rectores de la investigación OSINT, cadena de custodia y delimitación técnica',
        badge: 'PRINCIPIO PERICIAL',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <p className="leading-relaxed">
              El análisis técnico de redes sociales exige una separación tajante entre los <strong>hechos probados mediante telemetría</strong> y las inferencias políticas o geopolíticas.
            </p>

            <div className="rounded-sm border border-rose-500/30 bg-rose-950/20 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-rose-300">La Regla de Oro en la Atribución Técnica:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Identificar nodos que operan a través de <strong>infraestructura de red de alquiler comercial</strong> (VPS, proxies o pasarelas móviles) ayuda a describir la capa de red utilizada para saltarse geocercas. <strong>Bajo ninguna circunstancia el analista OSINT debe atribuir esto formalmente a un gobierno extranjero</strong> sin mandamientos judiciales o inteligencia de señales (SIGINT), ya que cualquier cibercriminal, agencia privada o actor local puede contratar estos servicios comerciales anónimamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-mono text-[10px] uppercase text-cyan-400 block font-bold">1. Hecho Probado</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Telemetría objetiva: marcas de tiempo, direcciones IP, hashes de contenido y grafos de interacción.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-mono text-[10px] uppercase text-amber-400 block font-bold">2. Inferencia Probabilística</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cálculo algorítmico CIB: ráfagas artificiales, cron-jitter mecánico y reciclaje audiovisual.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                <span className="font-mono text-[10px] uppercase text-rose-400 block font-bold">3. Límite Infranqueable</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  No imputar autoría de Estado sin pruebas de mandamiento judicial, interceptación o registros de pago.
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'sec_workflow',
        category: 'workflow',
        title: '2. Flujo de Trabajo Operativo en 5 Fases',
        subtitle: 'Secuencia estandarizada desde la captura de campo hasta la judicialización',
        badge: 'WORKFLOW OSINT',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <p className="leading-relaxed">
              Toda investigación técnica en AegisNet-BotRadar debe seguir un orden secuencial estricto para no alertar a los operadores de la red ni invalidar las pruebas ante un tribunal:
            </p>

            <div className="space-y-2">
              {[
                {
                  num: '01',
                  name: 'Preservación Forense Inmutable (WORM)',
                  desc: 'Sellado inmediato del dataset con hash criptográfico SHA-256 y sincronización horaria NTP Stratum 1 (±0.045s). Garantiza que ninguna prueba pueda ser alterada.',
                  tag: 'ISO/IEC 27037'
                },
                {
                  num: '02',
                  name: 'Triangulación Topológica & IDs Inmutables',
                  desc: 'Extracción de identificadores numéricos de plataforma (id_str) para neutralizar cambios de @handle, detección de cuentas zombi compradas y mapeo de prefijos BGP.',
                  tag: 'TELEMETRÍA'
                },
                {
                  num: '03',
                  name: 'Notificación de Emergencia & Takedown',
                  desc: 'Emisión del paquete formal a equipos de Trust & Safety (X, Telegram Abuse, Meta CIB) solicitando la congelación cautelar de cuentas para preservar registros de conexión internos.',
                  tag: 'TRUST & SAFETY'
                },
                {
                  num: '04',
                  name: 'Desmentido Factual en Fuentes Abiertas (Open OSINT)',
                  desc: 'Publicación de datos brutos (CSV con resolución de milisegundos y GEXF para Gephi) y demostración del reciclaje de contenido mediante cotejo semántico/perceptual cuando proceda.',
                  tag: 'OPEN DATA'
                },
                {
                  num: '05',
                  name: 'Expediente Técnico & Remisión',
                  desc: 'Emisión del informe técnico OSINT de 5 páginas con cadena de custodia sellada para su revisión por análisis o audiencia técnica.',
                  tag: 'JUDICIAL'
                }
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3 rounded-sm border border-[#1E293B] bg-[#0A0C10] p-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{step.name}</span>
                      <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded-sm border border-cyan-500/30">
                        {step.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {onNavigateToActionLine && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToActionLine();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  <span>Ir a la pestaña de Línea de Acción Operativa y generar Playbook</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )
      },
      {
        id: 'sec_ingesta',
        category: 'ingesta',
        title: '3. Ingesta y Procesamiento de Datos Reales',
        subtitle: 'Uso de colectores de campo (Python/CLI) e importación de datasets JSON/CSV',
        badge: 'INGESTA DE DATOS',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <p className="leading-relaxed">
              La plataforma no depende de APIs comerciales cerradas con cuotas restrictivas. Puedes capturar datos brutos de campo y volcarlos en el motor local:
            </p>

            <div className="space-y-3">
              {/* Telethon Script */}
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    Colector Telegram (Canales y Grupos Públicos con Telethon):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `from telethon.sync import TelegramClient\nimport json\n\nclient = TelegramClient('osint_session', API_ID, API_HASH).start()\nmessages = client.get_messages('CanalInvestigado', limit=200)\nrecords = [{\n    'handle': m.sender.username or f'tg_{m.sender_id}',\n    'text': m.text,\n    'timestamp': m.date.isoformat(),\n    'platform': 'telegram'\n} for m in messages if m.text]\n\nwith open('dataset_telegram.json', 'w') as f:\n    json.dump(records, f, indent=2)`,
                        'code_telethon'
                      )
                    }
                    className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'code_telethon' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'code_telethon' ? 'Copiado' : 'Copiar Script'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-sm bg-[#0F172A] p-2.5 font-mono text-[10px] text-slate-300 leading-relaxed">
{`from telethon.sync import TelegramClient
import json

client = TelegramClient('osint_session', API_ID, API_HASH).start()
messages = client.get_messages('CanalInvestigado', limit=200)
records = [{
    'handle': m.sender.username or f'tg_{m.sender_id}',
    'text': m.text,
    'timestamp': m.date.isoformat(),
    'platform': 'telegram'
} for m in messages if m.text]

with open('dataset_telegram.json', 'w') as f:
    json.dump(records, f, indent=2)`}
                </pre>
              </div>

              {/* Snscrape CLI */}
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                    Colector X / Twitter con snscrape (Sin API Keys Comerciales):
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `snscrape --jsonl --max-results 500 twitter-search "#HashtagInvestigado since:2026-08-01" | jq -s '[.[] | {handle: ("@" + .user.username), text: .rawContent, timestamp: .date, platform: "x_twitter", followers: .user.followersCount, following: .user.friendsCount}]' > dataset_x.json`,
                        'code_snscrape'
                      )
                    }
                    className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'code_snscrape' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'code_snscrape' ? 'Copiado' : 'Copiar CLI'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-sm bg-[#0F172A] p-2.5 font-mono text-[10px] text-slate-300 leading-relaxed">
{`snscrape --jsonl --max-results 500 twitter-search "#HashtagInvestigado since:2026-08-01" | \\
jq -s '[.[] | {
  handle: ("@" + .user.username),
  text: .rawContent,
  timestamp: .date,
  platform: "x_twitter",
  followers: .user.followersCount,
  following: .user.friendsCount
}]' > dataset_x.json`}
                </pre>
              </div>
            </div>

            {onOpenIngestion && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenIngestion();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  <span>Abrir el Modal de Ingesta OSINT para cargar un JSON o CSV local</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )
      },
      {
        id: 'sec_analisis',
        category: 'analisis',
        title: '4. Interpretación Forense de los 4 Vectores',
        subtitle: 'Cómo leer e interpretar el Grafo, la Heurística Temporal, el PLN y el Mapa',
        badge: 'VECTORES ANALÍTICOS',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Layers className="h-4 w-4" />
                  <span>1. Grafo Topológico Interactivo (D3)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Busca topologías en forma de estrella (<strong>Hub-and-Spoke</strong>). Un nodo emisor central con decenas de nodos periféricos con bajo número de seguidores y alta tasa de retweet/compartición sin respuestas cruzadas indica amplificación artificial programada.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Clock className="h-4 w-4" />
                  <span>2. Heurística Temporal & Cron-Jitter</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Las publicaciones humanas tienen variabilidad (&gt; 3.5 segundos). Si 20 o más cuentas publican textos con un <strong>jitter inferior a 0.35 segundos</strong>, el descarte fisiológico es concluyente: se trata de scripts automáticos o extensiones headless de navegador.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Fingerprint className="h-4 w-4" />
                  <span>3. PLN & Peritaje Audiovisual (pHash DCT)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  La matriz Jaccard mide copias directas o con pequeñas mutaciones. El algoritmo <strong>pHash</strong> genera un hash perceptual de 64 bits de los fotogramas clave; una coincidencia superior al 95% desmonta el reciclaje de vídeos de años anteriores presentados como sucesos de hoy.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>4. Auditoría de Cuentas Zombi</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cuentas creadas hace años en idiomas no relacionados (ej. turco, indonesio) que tras años inactivas son reactivadas coordinadamente en una misma semana para difundir bulos locales. Revisa siempre el identificador numérico inmutable (`immutableUserId`).
                </p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'sec_accion',
        category: 'accion',
        title: '5. Línea de Acción: Denuncia y Desmentido Efectivo',
        subtitle: 'Protocolo para notificar a Trust & Safety y publicar datos abiertos sin amplificar el bulo',
        badge: 'PROTOCOLO OPERATIVO',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="space-y-2.5">
              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
                <span className="font-bold text-slate-200 block mb-1 text-xs">
                  A. Solicitud Formal a Equipos de Trust &amp; Safety:
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Las plataformas no atienden quejas emocionales. Requieren:
                  <br />
                  1. Listado con identificadores numéricos inmutables (`id_str`).
                  <br />
                  2. Marcas de tiempo UTC con milisegundos y desviación jitter calculada.
                  <br />
                  3. Indicación expresa de infracción de la política de <em>Coordinated Inauthentic Behavior / Platform Manipulation</em>.
                </p>
              </div>

              <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3">
                <span className="font-bold text-slate-200 block mb-1 text-xs">
                  B. Reglas de Desmentido sin Efecto Retroceso (Backfire Effect):
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 leading-relaxed">
                  <li><strong>Nunca retuitees ni enlaces al contenido tóxico original.</strong> Realiza capturas estáticas selladas.</li>
                  <li><strong>No repitas las palabras clave falsas en el titular.</strong> Encabeza con el hecho verificado: <em>"Frontera opera con normalidad: el vídeo viral corresponde a julio de 2018"</em>.</li>
                  <li><strong>Adjunta los datos primarios abiertos (Open OSINT).</strong> Permite que observatorios y prensa técnica verifiquen la anomalía temporal en sus propios ordenadores.</li>
                </ul>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'sec_gestion',
        category: 'gestion',
        title: '6. Gestión, Calibración del Score y OPSEC',
        subtitle: 'Fórmulas matemáticas de ponderación, falsos positivos y seguridad del analista',
        badge: 'CALIBRACIÓN & OPSEC',
        content: (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-2">
              <span className="font-bold text-white text-xs block">
                Fórmula de Ponderación Multidimensional del Score CIB:
              </span>
              <div className="font-mono text-[11px] text-cyan-300 bg-[#0F172A] p-2.5 rounded-sm border border-[#1E293B]">
                Score CIB = (0.30 × S_topológico) + (0.30 × S_temporal) + (0.25 × S_semántico) + (0.15 × S_metadatos)
              </div>
              <p className="text-[10px] text-slate-400">
                Un score superior a 75/100 activa automáticamente el protocolo de intervención crítica.
              </p>
            </div>

            <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 space-y-1.5">
              <span className="font-bold text-slate-200 text-xs block">
                Reglas de Seguridad Operacional (OPSEC) para el Equipo OSINT:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 leading-relaxed">
                <li><strong>No realizar escaneos activos de puertos ni ataques a los VPS identificados:</strong> Toda la investigación debe ser estrictamente pasiva mediante telemetría BGP y certificados SSL públicos.</li>
                <li><strong>Mantener identidades disociadas:</strong> Nunca interactuar con los canales analizados desde perfiles personales o institucionales.</li>
                <li><strong>Preservación estricta de copias maestras:</strong> Mantener una copia de sólo lectura del dataset original con verificación periódica del hash SHA-256.</li>
              </ul>
            </div>
          </div>
        )
      }
    ],
    [copiedKey, onNavigateToActionLine, onOpenIngestion]
  );

  // Filter sections according to search query and category
  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const matchesCat = selectedCategory === 'todos' || sec.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = sec.title.toLowerCase().includes(q);
      const subMatch = sec.subtitle.toLowerCase().includes(q);
      const badgeMatch = sec.badge.toLowerCase().includes(q);

      return titleMatch || subMatch || badgeMatch;
    });
  }, [sections, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0C10]/85 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm border border-[#1E293B] bg-[#111827] shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] bg-[#0F172A] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Manual de Operación &amp; Gestión Operativa OSINT (HOW-TO)
                </h3>
                <span className="rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                  DOC-OSINT-v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Guía metodológica, calibración del modelo CIB, cadena de custodia ISO/IEC 27037 y protocolo de mitigación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-[#1E293B] transition-colors"
              title="Descargar el manual completo en formato Markdown (.MD)"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Descargar Manual (.MD)</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1E293B] bg-[#111827] text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="border-b border-[#1E293B] bg-[#0A0C10] px-6 py-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tema, comando o término (ej. takedown, pHash, jitter, ISO 27037, OPSEC)..."
                className="w-full rounded-sm border border-[#1E293B] bg-[#0F172A] pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'fundamentos', label: '1. Fundamentos' },
                { id: 'workflow', label: '2. Workflow' },
                { id: 'ingesta', label: '3. Ingesta' },
                { id: 'analisis', label: '4. Vectores' },
                { id: 'accion', label: '5. Takedown' },
                { id: 'gestion', label: '6. OPSEC' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-sm px-2.5 py-1 font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50'
                      : 'border border-transparent text-slate-400 hover:bg-[#1E293B] hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs text-[#E2E8F0]">
          {filteredSections.length === 0 ? (
            <div className="rounded-sm border border-[#1E293B] bg-[#0F172A] p-8 text-center text-slate-400">
              <p>No se encontraron secciones para el término de búsqueda "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todos');
                }}
                className="mt-2 text-xs font-semibold text-cyan-400 underline"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredSections.map((section) => {
              const isExpanded = expandedSections[section.id] ?? true;
              return (
                <div
                  key={section.id}
                  className="rounded-sm border border-[#1E293B] bg-[#111827] transition-colors hover:border-slate-700"
                >
                  {/* Collapsible Section Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between border-b border-[#1E293B]/60 bg-[#0F172A]/70 px-4 py-3 text-left hover:bg-[#0F172A] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs tracking-tight">
                          {section.title}
                        </span>
                        <span className="rounded-sm border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
                          {section.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">{section.subtitle}</p>
                    </div>

                    <div className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Section Content */}
                  {isExpanded && <div className="p-4">{section.content}</div>}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E293B] bg-[#0F172A] px-6 py-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>AegisNet-BotRadar Architecture &copy; M. Castillo — Protocolo Abierto</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-[#1E293B] transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Exportar .MD</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-sm bg-cyan-600 hover:bg-cyan-500 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
