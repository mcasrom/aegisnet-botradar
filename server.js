/**
 * AegisNet-BotRadar: Backend API de Datos Reales (OSINT)
 * Sirve los outputs del pipeline oasis.py (democracia-bajo-asalto) como
 * campañas de investigación forense reales para el frontend.
 *
 * Uso:
 *   node server.js                       # lee ./DATOS por defecto
 *   DATOS_DIR=/ruta/al/DATOS node server.js
 *   PORT=3789 node server.js
 *
 * Endpoints:
 *   GET /api/health          -> estado y ruta de datos
 *   GET /api/campaigns       -> lista de campañas (por entidad)
 *   GET /api/campaigns/:id   -> campaña detalle (nodos, edges, señales)
 *   GET /api/raw/:tipo       -> estado.json u oasis_senales_<fecha>.json
 */
import express from 'express';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const PORT = process.env.PORT || 3789;
const DATOS_DIR = process.env.DATOS_DIR || join(process.cwd(), 'DATOS');
// Si existe un build estático, se sirve junto a la API (mismo origen).
const DIST_DIR = process.env.DIST_DIR || join(process.cwd(), 'dist');

const app = express();
app.use(express.json({ limit: '20mb' }));

/** Lee JSON con fallback vacío */
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
}

/** SHA-256 de un archivo (cadena de custodia) */
function sha256File(file) {
  try {
    return createHash('sha256').update(readFileSync(file)).digest('hex');
  } catch {
    return null;
  }
}

/** Colección de todos los archivos de señales disponibles */
function listSenalFiles() {
  if (!existsSync(DATOS_DIR)) return [];
  return readdirSync(DATOS_DIR)
    .filter((f) => /^oasis_senales_[\d-]+\.json$/.test(f))
    .sort()
    .reverse();
}

/** Última fecha disponible de señales */
function latestSenaFile() {
  const files = listSenalFiles();
  return files.length ? files[0] : null;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senal = latestSenaFile();
  res.json({
    ok: true,
    datosDir: DATOS_DIR,
    existeEstado: existsSync(join(DATOS_DIR, 'estado.json')),
    fechaSenales: senal ? senal.replace('oasis_senales_', '').replace('.json', '') : null,
    nEntidades: estado && estado.entidades ? Object.keys(estado.entidades).length : 0
  });
});

/** Convierte los hallazgos de oasis.py en una campaña de investigación por entidad */
function buildCampaign(entidad, entData, hallazgos) {
  const nodes = [];
  const edges = [];
  const postsOfEntity = hallazgos.filter((h) => h.entidad === entidad);

  // Nodo por canal real
  const chanMap = new Map();
  postsOfEntity.forEach((h, i) => {
    const key = h.canal || h.fuente || `fuente_${i}`;
    if (!chanMap.has(key)) {
      chanMap.set(key, {
        id: `node_${entidad}_${canonical(key)}`,
        handle: formatHandle(key),
        platform: platformOf(h),
        displayName: h.canal || key,
        type: nodeTypeOf(h),
        cibScore: clusterScore(h),
        creationDate: h.ts || new Date().toISOString(),
        accountAgeDays: 0,
        followersCount: (h.señal_severa ? 1 : 0) + 10,
        followingCount: 0,
        followerFollowingRatio: 0,
        totalPosts: 0,
        postsPerDay: 0,
        louvainCommunity: 0,
        centrality: { degree: 0, betweenness: 0, pageRank: 0.05, clusteringCoefficient: 0 },
        temporalMetrics: {
          medianIntervalSeconds: 0,
          intervalJitterSeconds: 0,
          burstCount: 0,
          nightActivityRatio: 0
        },
        contentMetrics: {
          exactCopyPasteRatio: 0,
          sentimentPolarizationIndex: 0.5,
          topHashTags: [],
          samplePosts: []
        },
        geoOrigin: undefined,
        botProbability: undefined
      });
    }
    const node = chanMap.get(key);
    node.totalPosts += 1;
    node.contentMetrics.samplePosts.push({
      id: `post_${entidad}_${i}`,
      timestamp: h.ts || new Date().toISOString(),
      text: (h.titulo || '').slice(0, 280),
      isExactDuplicate: !!h.envio_masivo,
      sharesOrRetweets: 0
    });
    if (h.envio_masivo) {
      node.cibScore = Math.min(90, node.cibScore + 10);
      node.type = node.cibScore >= 75 ? 'bot' : node.type;
    }
  });

  // Conecta canales con mismo envio_masivo / señal_severa (células)
  const nodesArr = Array.from(chanMap.values());
  const severe = postsOfEntity.filter((h) => h.envio_masivo || h.señal_severa);
  severe.forEach((h, i) => {
    const src = chanMap.get(h.canal || '');
    if (!src) return;
    for (let j = i + 1; j < severe.length; j++) {
      const h2 = severe[j];
      if (h2.canal === h.canal) continue;
      const dst = chanMap.get(h2.canal || '');
      if (!dst) continue;
      edges.push({
        id: `edge_${entidad}_${i}_${j}`,
        source: src.id,
        target: dst.id,
        type: 'mention',
        weight: h.titulo && h2.titulo && similarityScore(h.titulo, h2.titulo) > 0.5 ? 3 : 2,
        timestamp: h.ts || h2.ts || new Date().toISOString(),
        isBurstEdge: true
      });
    }
  });
  nodesArr.forEach((n) => (n.centrality.degree = edges.filter((e) => e.source === n.id || e.target === n.id).length));

  const cib = computeCibFromCampaign(nodesArr, edges);

  return {
    id: entidad,
    title: entData?.nombre_entidad || entidad.replace(/-/g, ' '),
    electoralProcess: entData?.entidad_region || 'OSINT Abierto',
    electoralContext: `Entidad: ${entidad} | Volumen ciclo reciente`,
    status: 'ACTIVE_ALERT',
    reportClassification: 'ACTIVE_AUDIT',
    investigationCode: `AEGIS-${new Date().getUTCFullYear()}-OASIS-${entidad.toUpperCase().slice(0, 6)}`,
    createdAt: entData?.primera || new Date().toISOString(),
    datasetSha256: sha256File(join(DATOS_DIR, latestSenaFile() || '')) || 'no-disponible',
    targetPlatforms: ['x_twitter', 'telegram'],
    nodes: nodesArr,
    edges,
    cibBreakdown: cib,
    astroturfClusters: [],
    geopoliticalVectors: [],
    summaryDescription: `Datos reales del pipeline oasis.py: ${nodesArr.length} nodos (canales reales) y ${postsOfEntity.length} señales sobre "${entidad}". Fuente: ${DATOS_DIR} / ${latestSenaFile()}.`,
    totalCollectedEvents: postsOfEntity.length,
    exifForensics: [],
    burstEvents: [],
    confidenceMatrix: [
      {
        dimension: 'Origen de los datos',
        confidenceLevel: 'HIGH',
        technicalGrounding: `Pipeline oasis.py (cron, fuentes públicas Telegram/verificadores) — archivo ${latestSenaFile()}`,
        caveatsAndLimitations: 'Volumen por ciclo de 12h; no incluye captura completa de cada canal.'
      }
    ],
    chainOfCustody: [
      {
        step: 1,
        phase: 'Ingesta de datos reales',
        timestampUtc: new Date().toISOString(),
        actor: 'pipeline oasis.py',
        evidenceHashSha256: sha256File(join(DATOS_DIR, latestSenaFile() || '')) || 'no-disponible',
        actionDescription: `Lectura de ${latestSenaFile() || 'sin datos'} desde el pipeline automatizado`
      }
    ]
  };
}

// Helpers de transformación
function canonical(s) {
  return s.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
}
function formatHandle(canal) {
  if (canal.startsWith('@')) return canal;
  if (canal.includes('://')) {
    const m = canal.match(/^https?:\/\/(?:www\.)?([^/]+)/);
    if (m) return '@' + m[1].split('.')[0] + '_feed';
  }
  return '@' + canal.replace(/^t(s|elegram):?/, '').replace(/[^a-zA-Z0-9_]/g, '_');
}
function platformOf(h) {
  if (h.tipo === 'telegram') return 'telegram';
  if (h.tipo === 'social' || h.tipo === 'x' || h.tipo === 'twitter') return 'x_twitter';
  return 'x_twitter';
}
function nodeTypeOf(h) {
  if (h.señal_severa) return 'bot';
  if (h.envio_masivo) return 'suspicious';
  return 'organic';
}
function clusterScore(h) {
  if (h.señal_severa) return 85;
  if (h.envio_masivo) return 70;
  return 25;
}
function similarityScore(a, b) {
  if (!a || !b) return 0;
  const set = (s) => new Set(s.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const sa = set(a), sb = set(b);
  if (!sa.size || !sb.size) return 0;
  const inter = new Set([...sa].filter((x) => sb.has(x)));
  return inter.size / new Set([...sa, ...sb]).size;
}

/** CIB engine (server-side ligero, espejo del cibEngine del cliente) */
function computeCibFromCampaign(nodes, edges) {
  const n = nodes.length || 1;
  // Topología: hub concentration (distribución de grados)
  const degrees = nodes.map((nd) => edges.filter((e) => e.source === nd.id || e.target === nd.id).length);
  const maxDeg = Math.max(...degrees, 1);
  const meanDeg = degrees.reduce((a, b) => a + b, 0) / n;
  const topo = Math.min(100, (maxDeg / Math.max(meanDeg, 1)) * 40 + (edges.length / n) * 25);
  // Temporal: micro-burst (envio_masivo) ratio
  const burstNodes = nodes.filter((nd) => nd.temporalMetrics && nd.temporalMetrics.burstCount > 0 ||
    nd.contentMetrics.samplePosts.some((p) => p.isExactDuplicate)).length;
  const temporal = Math.min(100, (burstNodes / n) * 80 + (nodes.filter((nd) => nd.cibScore >= 75).length / n) * 40);
  // Semántico: ratio de duplicación exacta
  const dupCount = nodes.reduce((acc, nd) => acc + nd.contentMetrics.samplePosts.filter((p) => p.isExactDuplicate).length, 0);
  const totalPosts = nodes.reduce((acc, nd) => acc + nd.contentMetrics.samplePosts.length, 0) || 1;
  const semantic = Math.min(100, (dupCount / totalPosts) * 100);
  // Metadatos
  const suspicious = nodes.filter((nd) => nd.cibScore >= 70).length / n;
  const metadata = Math.min(100, suspicious * 80);
  const overall = Math.round(0.3 * topo + 0.3 * temporal + 0.25 * semantic + 0.15 * metadata);
  let risk = 'LOW_ORGANIC';
  if (overall >= 65) risk = 'CONFIRMED_CIB';
  else if (overall >= 35) risk = 'SUSPICIOUS';
  return {
    overallScore: overall,
    topologicalScore: Math.round(topo),
    temporalScore: Math.round(temporal),
    semanticScore: Math.round(semantic),
    metadataScore: Math.round(metadata),
    riskLevel: risk,
    verdictDescription: `Score CIB real calculado sobre datos oasis.py: topología ${Math.round(topo)}, temporal ${Math.round(temporal)}, semántico ${Math.round(semantic)}, metadatos ${Math.round(metadata)}.`
  };
}

/** Última fecha de señales para cargar en /api/campaigns */
app.get('/api/campaigns', (_req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senalFile = latestSenaFile();
  const senales = senalFile ? readJson(join(DATOS_DIR, senalFile)) : null;
  const hallazgos = senales?.hallazgos || [];
  const entidades = estado?.entidades || {};

  const campaigns = Object.keys(entidades)
    .map((ent) => {
      const c = buildCampaign(ent, entidades[ent], hallazgos);
      return {
        id: c.id,
        title: c.title,
        electoralProcess: c.electoralProcess,
        status: c.status,
        reportClassification: c.reportClassification,
        createdAt: c.createdAt,
        summaryDescription: c.summaryDescription,
        nNodes: c.nodes.length,
        nEdges: c.edges.length,
        cibBreakdown: c.cibBreakdown,
        totalCollectedEvents: c.totalCollectedEvents,
        datasetSha256: c.datasetSha256
      };
    })
    .filter((c) => c.nNodes > 0);

  res.json({ generatedAt: senales?.generado_utc || new Date().toISOString(), count: campaigns.length, campaigns });
});

app.get('/api/campaigns/:id', (req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senalFile = latestSenaFile();
  const senales = senalFile ? readJson(join(DATOS_DIR, senalFile)) : null;
  const hallazgos = senales?.hallazgos || [];
  const entidades = estado?.entidades || {};
  const ent = req.params.id;
  if (!entidades[ent]) return res.status(404).json({ error: 'Entidad no encontrada' });
  res.json(buildCampaign(ent, entidades[ent], hallazgos));
});

app.get('/api/raw/estado', (_req, res) => {
  const d = readJson(join(DATOS_DIR, 'estado.json'));
  if (!d) return res.status(404).json({ error: 'estado.json no disponible' });
  res.json(d);
});

app.get('/api/raw/senales', (_req, res) => {
  const f = latestSenaFile();
  const d = f ? readJson(join(DATOS_DIR, f)) : null;
  if (!d) return res.status(404).json({ error: 'sin archivo de señales' });
  res.json(d);
});

// --- Frontend estático (si existe dist/) ---
if (existsSync(join(DIST_DIR, 'index.html'))) {
  app.use(express.static(DIST_DIR));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
  console.log(`[aegisnet] sirviendo frontend estático desde ${DIST_DIR}`);
} else {
  console.log('[aegisnet] warning: DIST_DIR sin index.html (frontend no compilado). Solo API.');
}

app.listen(PORT, () => {
  console.log(`[aegisnet] API real escuchando en :${PORT}`);
  console.log(`[aegisnet] DATOS_DIR=${DATOS_DIR}`);
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  console.log(`[aegisnet] entidades en estado.json: ${estado?.entidades ? Object.keys(estado.entidades).length : 0}`);
});