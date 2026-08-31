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
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createHash, randomBytes } from 'crypto';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3789;
const DATOS_DIR = process.env.DATOS_DIR || join(process.cwd(), 'DATOS');
const CASES_DIR = process.env.CASES_DIR || join(process.cwd(), 'CASOS');
// Si existe un build estático, se sirve junto a la API (mismo origen).
const DIST_DIR = process.env.DIST_DIR || join(process.cwd(), 'dist');

const app = express();
app.use(express.json({ limit: '20mb' }));

/* ================= AUTH + ANTIFRAUDE =================
   Registro email+password para cualquier persona, pero los DATOS DEL FRAUDE
   (rutas /api/campaigns*) SOLO los ve el propietario autenticado (role owner).
   Cualquier usuario registrado no-propietario recibe 403.
   ----------------------------------------------------------------- */
const USERS_FILE = process.env.USERS_FILE || join(process.cwd(), '.users.json');
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const OWNER_EMAIL = (process.env.ADMIN_EMAIL || 'aegis.info@viajeinteligencia.com').toLowerCase();

function loadUsers() {
  try { return JSON.parse(readFileSync(USERS_FILE, 'utf-8')); }
  catch { return {}; }
}
function saveUsers(users) {
  mkdirSync(join(process.cwd()), { recursive: true });
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 12 }
}));
function isAuthenticated(req) { return !!(req.session && req.session.userId); }
function isOwner(req) {
  if (!isAuthenticated(req)) return false;
  const u = loadUsers()[req.session.userId];
  return !!(u && u.role === 'owner' && u.email === OWNER_EMAIL);
}
function requireOwner(req, res, next) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'sesion_requerida' });
  if (!isOwner(req)) return res.status(403).json({ error: 'acceso_rest_owner' });
  next();
}

// --- POST /api/auth/register : cualquier persona puede crear cuenta ---
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({ error: 'email_y_password_requeridos' });
  const e = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))
    return res.status(400).json({ error: 'email_invalido' });
  if (password.length < 8)
    return res.status(400).json({ error: 'password_min_8' });
  const users = loadUsers();
  if (users[e]) return res.status(409).json({ error: 'email_ya_registrado' });
  const role = e === OWNER_EMAIL ? 'owner' : 'user';
  users[e] = { email: e, passwordHash: bcrypt.hashSync(password, 10), role, createdAt: new Date().toISOString() };
  saveUsers(users);
  req.session.userId = e;
  return res.json({ ok: true, email: e, role });
});

// --- POST /api/auth/login ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const e = (email || '').trim().toLowerCase();
  const users = loadUsers();
  const u = users[e];
  if (!u || !bcrypt.compareSync(password || '', u.passwordHash))
    return res.status(401).json({ error: 'credenciales_invalidas' });
  req.session.userId = e;
  return res.json({ ok: true, email: e, role: u.role });
});

// --- POST /api/auth/logout ---
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// --- GET /api/auth/me : perfil de la sesion actual ---
app.get('/api/auth/me', (req, res) => {
  if (!isAuthenticated(req)) return res.json({ authenticated: false });
  const u = loadUsers()[req.session.userId];
  return res.json({ authenticated: true, email: u?.email, role: u?.role });
});

// --- GET /api/auth/status : que esta publico vs restringido ---
app.get('/api/auth/status', (_req, res) => {
  return res.json({ registro: 'abierto', owner: OWNER_EMAIL, fraude: 'restringido_a_owner' });
});


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

/** Archivos de casos documentados (patrón caso_<slug>.json) */
/** Calcula betweenness centrality y pageRank reales sobre el grafo (BFS por nodo + iteracion) */
function computeCentrality(nodes, edges) {
  const ids = nodes.map((n) => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));
  const adj = ids.map(() => []);
  edges.forEach((e) => {
    const s = idx.get(e.source);
    const t = idx.get(e.target);
    if (s !== undefined && t !== undefined && s !== t) {
      adj[s].push(t);
      adj[t].push(s);
    }
  });
  const n = ids.length;
  const betweenness = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const stack = [];
    const pred = new Array(n).fill(null).map(() => []);
    const sigma = new Array(n).fill(0);
    const dist = new Array(n).fill(-1);
    sigma[s] = 1;
    dist[s] = 0;
    const queue = [s];
    while (queue.length) {
      const v = queue.shift();
      stack.push(v);
      for (const w of adj[v]) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1;
          queue.push(w);
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          pred[w].push(v);
        }
      }
    }
    const delta = new Array(n).fill(0);
    while (stack.length) {
      const w = stack.pop();
      for (const v of pred[w]) {
        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      }
      if (w !== s) betweenness[w] += delta[w];
    }
  }
  const maxB = n > 2 ? Math.max(...betweenness) : 1;
  const bNorm = maxB > 0 ? betweenness.map((b) => b / maxB) : betweenness;

  // PageRank iterativo
  const damping = 0.85;
  let pr = ids.map(() => 1 / n);
  for (let iter = 0; iter < 30; iter++) {
    let next = new Array(n).fill((1 - damping) / n);
    for (let i = 0; i < n; i++) {
      const deg = adj[i].length;
      if (deg > 0) {
        const share = (damping * pr[i]) / deg;
        for (const j of adj[i]) next[j] += share;
      }
    }
    pr = next;
  }
  const prMax = Math.max(...pr, 1e-9);
  nodes.forEach((node, i) => {
    node.centrality.betweenness = Number(bNorm[i].toFixed(4));
    node.centrality.pageRank = Number((pr[i] / prMax).toFixed(4));
    node.centrality.degree = edges.filter((e) => e.source === node.id || e.target === node.id).length;
  });
}

function listCaseFiles() {
  const dirs = [CASES_DIR, DATOS_DIR];
  for (const dir of dirs) {
    try {
      if (existsSync(dir)) {
        const f = readdirSync(dir).filter((f) => /^caso_[a-z0-9-]+\.json$/.test(f)).sort();
        if (f.length) return f;
      }
    } catch (_e) { /* ignorar dir no legible */ }
  }
  return [];
}

/** Convierte un archivo caso_*.json (documentación verificada) en campaña */
function buildCaseCampaign(file) {
  const dir = existsSync(join(CASES_DIR, file)) ? CASES_DIR : DATOS_DIR;
  const data = readJson(join(dir, file));
  if (!data || !Array.isArray(data.hallazgos)) return null;
  const slug = file.replace(/^caso_/, '').replace(/\.json$/, '');
  const hallazgos = data.hallazgos;
  const nodes = [];
  const edges = [];
  const chanMap = new Map();
  hallazgos.forEach((h, i) => {
    const key = (h.canal || h.fuente || `fuente_${i}`).toLowerCase().replace(/\s+/g, '-').slice(0, 40) || `canal_${i}`;
    if (!chanMap.has(key)) {
      const isPregunta = h.nivel_verificacion === 'PREGUNTA';
      const isHipotesis = h.nivel_verificacion === 'HIPOTESIS';
      chanMap.set(key, {
        id: `node_${slug}_${canonical(key)}`,
        handle: formatHandle(key),
        platform: h.tipo === 'documentado' || h.tipo === 'contexto' ? 'web' : 'x_twitter',
        displayName: h.canal || key,
        type: isPregunta ? 'suspicious' : isHipotesis ? 'coordinator' : 'organic',
        cibScore: isPregunta ? 72 : isHipotesis ? 55 : 35,
        creationDate: h.ts || data.generado_utc || new Date().toISOString(),
        accountAgeDays: 0,
        followersCount: 10,
        followingCount: 0,
        followerFollowingRatio: 0,
        totalPosts: 0,
        postsPerDay: 0,
        louvainCommunity: 0,
        centrality: { degree: 0, betweenness: 0, pageRank: 0, clusteringCoefficient: 0 },
        temporalMetrics: { medianIntervalSeconds: 0, intervalJitterSeconds: 0, burstCount: 0, nightActivityRatio: 0 },
        contentMetrics: {
          exactCopyPasteRatio: 0,
          sentimentPolarizationIndex: 0.5,
          topHashTags: ['#Ceuta', '#Julio2026'],
          samplePosts: []
        }
      });
    }
    const node = chanMap.get(key);
    node.totalPosts += 1;
    node.contentMetrics.samplePosts.push({
      id: `post_${slug}_${i}`,
      timestamp: h.ts || new Date().toISOString(),
      text: `${h.titulo || ''} [${h.nivel_verificacion || 'HECHO'}] | ${h.fuente || ''}`.slice(0, 280),
      isExactDuplicate: !!h.envio_masivo,
      sharesOrRetweets: 0
    });
    if (h.envio_masivo) node.cibScore = Math.min(92, node.cibScore + 8);
    if (h.nivel_verificacion === 'PREGUNTA') node.cibScore = Math.min(node.cibScore, 25);
  });
  chanMap.forEach((node) => {
    const posts = node.contentMetrics.samplePosts || [];
    const dups = posts.filter((p) => p.isExactDuplicate).length;
    node.contentMetrics.exactCopyPasteRatio = posts.length ? dups / posts.length : 0;
  });
  const nodesArr = Array.from(chanMap.values());
  hallazgos.forEach((h, i) => {
    const srcKey = (h.canal || '').toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    const src = chanMap.get(srcKey);
    for (let j = i + 1; j < hallazgos.length; j += 1) {
      const h2 = hallazgos[j];
      const dstKey = (h2.canal || '').toLowerCase().replace(/\s+/g, '-').slice(0, 40);
      const dst = chanMap.get(dstKey);
      if (src && dst && src.id !== dst.id && h.entidad === h2.entidad) {
        edges.push({
          id: `edge_${slug}_${i}_${j}`,
          source: src.id,
          target: dst.id,
          type: 'mention',
          weight: h2.nivel_verificacion === 'HECHO' ? 3 : 1,
          timestamp: h2.ts || new Date().toISOString(),
          isBurstEdge: !!h.envio_masivo && !!h2.envio_masivo
        });
      }
    }
  });
  computeCentrality(nodesArr, edges);
  const cib = computeCibFromCampaign(nodesArr, edges);
  return {
    id: slug,
    title: data.nombre_entidad || slug.replace(/-/g, ' '),
    electoralProcess: data.entidad_region || 'Casos documentados',
    electoralContext: data.descripcion || '',
    status: 'INVESTIGATION_ONGOING',
    reportClassification: 'ACTIVE_AUDIT',
    investigationCode: `AEGIS-2026-DOC-${slug.toUpperCase().slice(0, 6)}`,
    createdAt: data.generado_utc || new Date().toISOString(),
    datasetSha256: sha256File(join(existsSync(join(CASES_DIR, file)) ? CASES_DIR : DATOS_DIR, file)) || 'no-disponible',
    targetPlatforms: ['x_twitter', 'telegram'],
    nodes: nodesArr,
    edges,
    cibBreakdown: cib,
    astroturfClusters: [],
    geopoliticalVectors: [],
    exifForensics: [],
    burstEvents: [],
    confidenceMatrix: [
      {
        dimension: 'Verificación de los hallazgos',
        confidenceLevel: hallazgos.some((h) => h.nivel_verificacion === 'HIPOTESIS' || h.nivel_verificacion === 'PREGUNTA') ? 'MEDIUM' : 'HIGH',
        technicalGrounding: data.metodologia || 'Casos documentados por verificadores públicos',
        caveatsAndLimitations: 'Reconstrucción desde documentación pública; no captura directa de canales de campaña.'
      }
    ],
    chainOfCustody: [
      {
        step: 1,
        phase: 'Caso documentado (verificado)',
        timestampUtc: data.generado_utc || new Date().toISOString(),
        actor: 'documentación del proyecto',
        evidenceHashSha256: sha256File(join(existsSync(join(CASES_DIR, file)) ? CASES_DIR : DATOS_DIR, file)) || 'no-disponible',
        actionDescription: `Lectura de ${file} (documentación verificada con fuentes públicas)`
      }
    ],
    summaryDescription: data.descripcion || '',
    totalCollectedEvents: hallazgos.length,
    hallazgos: hallazgos.map((h) => ({
      tipo: h.tipo || 'documentado',
      canal: h.canal || h.fuente || '',
      titulo: h.titulo || '',
      url: h.url || '',
      fuente: h.fuente || '',
      entidad: h.entidad || slug,
      nivel_verificacion: h.nivel_verificacion || 'PREGUNTA',
      fecha_evento: h.fecha_evento || null,
      ts: h.ts || null,
      señal_severa: !!h.señal_severa,
      envio_masivo: !!h.envio_masivo
    }))
  };
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senal = latestSenaFile();
  const senalStat = senal ? statSync(join(DATOS_DIR, senal), { throwIfNoEntry: false }) : null;
  const pkg = readJson(join(fileURLToPath(new URL('.', import.meta.url)), 'package.json'));
  const estadoStat = statSync(join(DATOS_DIR, 'estado.json'), { throwIfNoEntry: false });
  res.json({
    ok: true,
    version: pkg?.version || '0.0.0',
    datosDir: DATOS_DIR,
    existeEstado: existsSync(join(DATOS_DIR, 'estado.json')),
    fechaSenales: senal ? senal.replace('oasis_senales_', '').replace('.json', '') : null,
    senalesMtime: senalStat?.mtime?.toISOString() || null,
    estadoMtime: estadoStat?.mtime?.toISOString() || null,
    nEntidades: estado && estado.entidades ? Object.keys(estado.entidades).length : 0,
    nCampanas: estado && estado.entidades ? Object.keys(estado.entidades).length : 0
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

  chanMap.forEach((node) => {
    const posts = node.contentMetrics.samplePosts || [];
    const dups = posts.filter((p) => p.isExactDuplicate).length;
    node.contentMetrics.exactCopyPasteRatio = posts.length ? dups / posts.length : 0;
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
  computeCentrality(nodesArr, edges);

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
app.get('/api/campaigns', requireOwner, (_req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senalFile = latestSenaFile();
  const senales = senalFile ? readJson(join(DATOS_DIR, senalFile)) : null;
  const hallazgos = senales?.hallazgos || [];
  const entidades = estado?.entidades || {};

  const summarize = (c) => ({
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
  });

  const base = Object.keys(entidades)
    .map((ent) => buildCampaign(ent, entidades[ent], hallazgos))
    .map(summarize)
    .filter((c) => c.nNodes > 0);

  // Casos documentados (caso_*.json)
  const documented = listCaseFiles()
    .map((f) => buildCaseCampaign(f))
    .filter((c) => c && c.nodes && c.nodes.length > 0)
    .map(summarize);

  const campaigns = [...documented, ...base];
  res.json({ generatedAt: senales?.generado_utc || new Date().toISOString(), count: campaigns.length, campaigns, nDocumented: documented.length, nPipeline: base.length });
});

app.get('/api/campaigns/:id', requireOwner, (req, res) => {
  const estado = readJson(join(DATOS_DIR, 'estado.json'));
  const senalFile = latestSenaFile();
  const senales = senalFile ? readJson(join(DATOS_DIR, senalFile)) : null;
  const hallazgos = senales?.hallazgos || [];
  const entidades = estado?.entidades || {};
  const ent = req.params.id;

  // 1. Caso documentado (caso_*.json)
  const caseFile = `caso_${ent}.json`;
  if (existsSync(join(existsSync(join(CASES_DIR, caseFile)) ? CASES_DIR : DATOS_DIR, caseFile))) {
    const c = buildCaseCampaign(caseFile);
    if (c) return res.json(c);
  }
  // 2. Entidad del pipeline
  if (entidades[ent]) return res.json(buildCampaign(ent, entidades[ent], hallazgos));

  res.status(404).json({ error: 'Entidad o caso no encontrado' });
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

// --- Log de señales searchable (todos los archivos, con filtros/timestamp) ---
app.get('/api/senales', (req, res) => {
  const files = listSenalFiles();
  const baseDate = req.query.fecha; // YYYY-MM-DD (archivo exacto)
  const q = String(req.query.q || '').trim().toLowerCase();
  const entidad = String(req.query.entidad || '');
  const tipo = String(req.query.tipo || '');
  const severa = req.query.severa; // 'true'|'false'
  const masivo = req.query.masivo; // 'true'|'false'
  const desde = req.query.desde;   // fecha ISO
  const hasta = req.query.hasta;   // fecha ISO

  const selected = baseDate
    ? files.filter((f) => f.includes(baseDate))
    : files;

  const rows = [];
  let nTotal = 0;
  for (const f of selected) {
    const d = readJson(join(DATOS_DIR, f));
    if (!d?.hallazgos) continue;
    nTotal += d.hallazgos.length;
    for (const h of d.hallazgos) {
      const ts = h.ts || '';
      if (desde && ts && ts < desde) continue;
      if (hasta && ts && ts > hasta) continue;
      if (entidad && (h.entidad || '') !== entidad) continue;
      if (tipo && (h.tipo || '') !== tipo) continue;
      if (severa === 'true' && !h.señal_severa) continue;
      if (severa === 'false' && h.señal_severa) continue;
      if (masivo === 'true' && !h.envio_masivo) continue;
      if (masivo === 'false' && h.envio_masivo) continue;
      if (q) {
        const hay = [h.titulo, h.canal, h.red, h.fuente, h.nombre_entidad, h.entidad_region]
          .filter(Boolean).join(' ').toLowerCase().includes(q);
        if (!hay) continue;
      }
      rows.push({ ...h, archivo: f });
    }
  }
  rows.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  res.json({ totalDisponible: nTotal, count: rows.length, lista: rows });
});

// --- Frontend estático (si existe dist/) ---
if (existsSync(join(DIST_DIR, 'index.html'))) {
  app.use(express.static(DIST_DIR));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
  console.log(`[aegisnet] sirviendo frontend estático desde ${DIST_DIR}`);
} else {
  console.log('[aegisnet] warning: DIST_DIR sin index.html (frontend no compilado). Solo API.');
}

const isDirectRun = (() => {
  if (typeof process === 'undefined' || !process.argv || !process.argv[1]) return true;
  const candidates = [process.argv[1], process.env.pm_exec_path].filter(Boolean);
  try {
    return candidates.some((p) => pathToFileURL(p).href === import.meta.url);
  } catch {
    return true;
  }
})();

if (process.env.NODE_ENV !== 'test' && isDirectRun) {
  app.listen(PORT, () => {
    console.log(`[aegisnet] API real escuchando en :${PORT}`);
    console.log(`[aegisnet] DATOS_DIR=${DATOS_DIR}`);
    const estado = readJson(join(DATOS_DIR, 'estado.json'));
    console.log(`[aegisnet] entidades en estado.json: ${estado?.entidades ? Object.keys(estado.entidades).length : 0}`);
  });
} else {
  console.log('[aegisnet] server.js importado como módulo (test), no se inicia listen');
}

export { listCaseFiles, buildCaseCampaign, listSenalFiles, latestSenaFile, formatHandle, computeCibFromCampaign, canonical, readJson, sha256File };