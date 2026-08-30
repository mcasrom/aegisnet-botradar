/**
 * AegisNet-BotRadar: Panel de salud del sistema (semáforo) — estado real de cada componente
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { Activity, Database, Radar, Server, Cpu, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { HealthResponse } from '../services/api';

interface SystemHealthPanelProps {
  health: HealthResponse | null;
  isDemo: boolean;
  version: string;
}

function Pill({ ok, warn, label, detail, icon }: { ok: boolean; warn?: boolean; label: string; detail?: string; icon: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] font-semibold ${
      ok
        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
        : warn
          ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
          : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
    }`}>
      <span className="shrink-0">
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : warn ? <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> : <XCircle className="h-3.5 w-3.5 text-rose-400" />}
      </span>
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {detail && <span className="ml-1 font-mono text-[10px] text-slate-400">{detail}</span>}
    </div>
  );
}

export const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({ health, isDemo, version }) => {
  const apiOk = !!health && health.ok;
  const datosOk = !!health && health.existeEstado;
  const nEntidades = health?.nEntidades ?? 0;

  // Frescura de datos: las señales del pipeline se generan cada 12h; si la última es > 36h, amarillo.
  let pipelineOk = false;
  let pipelineWarn = false;
  if (health?.senalesMtime) {
    const ageHours = (Date.now() - new Date(health.senalesMtime).getTime()) / 3600000;
    pipelineOk = ageHours <= 36;
    pipelineWarn = ageHours > 36 && ageHours <= 72;
  }

  return (
    <div className="rounded-lg border border-[#1E293B] bg-[#0F172A]/80 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Estado del sistema</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">v{version}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Pill ok={!isDemo} warn={isDemo} label="Panel" detail={isDemo ? 'demo' : 'datos reales'} icon={<Server className="h-3 w-3" />} />
        <Pill ok={apiOk} label="API" detail={apiOk ? 'operativa' : 'caída'} icon={<Cpu className="h-3 w-3" />} />
        <Pill ok={datosOk} warn={!apiOk} label="DATOS" detail={`${nEntidades} entidades`} icon={<Database className="h-3 w-3" />} />
        <Pill ok={pipelineOk} warn={pipelineWarn} label="Pipeline" detail={health?.fechaSenales ?? 'sin ciclo'} icon={<Radar className="h-3 w-3" />} />
      </div>
    </div>
  );
};
