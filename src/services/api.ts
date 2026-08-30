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
  datosDir: string;
  existeEstado: boolean;
  fechaSenales: string | null;
  nEntidades: number;
}

export async function apiHealth(): Promise<HealthResponse | null> {
  try {
    const r = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()) as HealthResponse;
  } catch {
    return null;
  }
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