/**
 * AegisNet-BotRadar: Servicio de carga de campañas REALES desde el backend.
 * El backend (server.js) lee los outputs del pipeline oasis.py y los expone
 * como campañas de investigación forense. Aquí se consumen.
 *
 * NUNCA sirve datos de demostración: si el backend no responde, devuelve
 * una lista vacía (el caller decide mostrar el modo demo con banner).
 */
import { InvestigationCampaign } from '../types/botradar';

const API_BASE = (() => {
  // En producción se sirve desde el mismo origen (/api/...).
  // En desarrollo se puede apuntar al server local con VITE_API_BASE.
  try {
    const meta: any = (import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env;
    return (meta?.VITE_API_BASE as string) || '/api';
  } catch {
    return '/api';
  }
})();

export interface CampaignSummary {
  id: string;
  title: string;
  electoralProcess: string;
  status: InvestigationCampaign['status'];
  reportClassification: InvestigationCampaign['reportClassification'];
  createdAt: string;
  summaryDescription: string;
  nNodes: number;
  nEdges: number;
  cibBreakdown: InvestigationCampaign['cibBreakdown'];
  totalCollectedEvents: number;
  datasetSha256: string;
}

export interface HealthResponse {
  ok: boolean;
  version: string;
  datosDir: string;
  existeEstado: boolean;
  fechaSenales: string | null;
  senalesMtime: string | null;
  estadoMtime: string | null;
  nEntidades: number;
  nCampanas: number;
}

export async function apiHealth(): Promise<HealthResponse | null> {
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
      if (r.ok) {
        const data = (await r.json()) as HealthResponse;
        if (data && data.ok) return data;
      }
    } catch {
      /* reintentar: el challenge anti-bot de Cloudflare puede responder 403/HTML en el primer intento */
    }
    if (attempt < 2) await sleep(900 + attempt * 700);
  }
  return null;
}

export async function fetchCampaigns(): Promise<CampaignSummary[]> {
  const r = await fetch(`${API_BASE}/campaigns`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Backend no disponible (${r.status})`);
  const data = (await r.json()) as { campaigns: CampaignSummary[] };
  return data.campaigns;
}

export async function fetchCampaignDetail(id: string): Promise<InvestigationCampaign> {
  const r = await fetch(`${API_BASE}/campaigns/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Campaña no encontrada (${r.status})`);
  return (await r.json()) as InvestigationCampaign;
}

export interface Senal {
  tipo?: string;
  canal?: string;
  red?: string;
  titulo?: string;
  url?: string;
  fuente?: string;
  entidad?: string;
  nombre_entidad?: string;
  entidad_region?: string;
  señal_severa?: boolean;
  envio_masivo?: boolean;
  ts?: string;
  archivo?: string;
}

export interface SenalesResponse {
  totalDisponible: number;
  count: number;
  lista: Senal[];
}

export interface SenalesFiltro {
  q?: string;
  entidad?: string;
  tipo?: string;
  severa?: boolean;
  masivo?: boolean;
  fecha?: string;
  desde?: string;
  hasta?: string;
}

export async function fetchSenales(f: SenalesFiltro = {}): Promise<SenalesResponse> {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q);
  if (f.entidad) p.set('entidad', f.entidad);
  if (f.tipo) p.set('tipo', f.tipo);
  if (f.severa !== undefined) p.set('severa', String(f.severa));
  if (f.masivo !== undefined) p.set('masivo', String(f.masivo));
  if (f.fecha) p.set('fecha', f.fecha);
  if (f.desde) p.set('desde', f.desde);
  if (f.hasta) p.set('hasta', f.hasta);
  const qs = p.toString();
  const r = await fetch(`${API_BASE}/senales${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Senales no disponibles (${r.status})`);
  return (await r.json()) as SenalesResponse;
}
/* ===== AUTH ===== */
export interface AuthUser { authenticated: boolean; email?: string; role?: string; }
export interface AuthResult { ok?: boolean; email?: string; role?: string; error?: string }

async function postAuth(path: string, body: unknown): Promise<AuthResult> {
  const r = await fetch(`${API_BASE}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return data as AuthResult;
}

export async function apiAuthMe(): Promise<AuthUser> {
  try {
    const r = await fetch(`${API_BASE}/auth/me`, { cache: 'no-store' });
    if (r.ok) return (await r.json()) as AuthUser;
  } catch { /* sin backend */ }
  return { authenticated: false };
}

export async function apiLogin(email: string, password: string): Promise<AuthResult> {
  return postAuth('login', { email, password });
}
export async function apiRegister(email: string, password: string): Promise<AuthResult> {
  return postAuth('register', { email, password });
}
export async function apiLogout(): Promise<void> {
  try { await fetch(`${API_BASE}/auth/logout`, { method: 'POST' }); } catch { /* ignore */ }
}
