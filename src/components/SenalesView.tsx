/**
 * AegisNet-BotRadar: Log de señales searchable del pipeline OASIS
 * Detección temprana con timestamp, filtros y búsqueda.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Radar, Zap, RefreshCw, FileText, Database, AlertTriangle } from 'lucide-react';
import { fetchSenales, Senal, SenalesFiltro } from '../services/api';

const PAGE = 40;

function fmtTs(ts?: string) {
  if (!ts) return '—';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

export const SenalesView: React.FC = () => {
  const [lista, setLista] = useState<Senal[]>([]);
  const [totalDisponible, setTotalDisponible] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState('');
  const [entidad, setEntidad] = useState('');
  const [tipo, setTipo] = useState('');
  const [severa, setSevera] = useState('');
  const [masivo, setMasivo] = useState('');
  const [pagina, setPagina] = useState(0);

  const aplicar = (filtro: SenalesFiltro) => {
    setLoading(true);
    setError(null);
    fetchSenales(filtro)
      .then((r) => {
        setLista(r.lista);
        setTotalDisponible(r.totalDisponible);
        setPagina(0);
      })
      .catch((e) => {
        setError(e.message || 'Error al cargar señales');
        setLista([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    aplicar({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entidades: string[] = useMemo(() => Array.from(new Set(lista.map((s) => s.nombre_entidad).filter(Boolean))), [lista]);

  const buscar = () => {
    const filtro: SenalesFiltro = {};
    if (q.trim()) filtro.q = q.trim();
    if (entidad) filtro.entidad = entidad;
    if (tipo) filtro.tipo = tipo;
    if (severa) filtro.severa = severa === 'si';
    if (masivo) filtro.masivo = masivo === 'si';
    aplicar(filtro);
  };

  const limpiar = () => {
    setQ('');
    setEntidad('');
    setTipo('');
    setSevera('');
    setMasivo('');
    aplicar({});
  };

  const paginaVisible = lista.slice(pagina * PAGE, pagina * PAGE + PAGE);
  const totalPaginas = Math.max(1, Math.ceil(lista.length / PAGE));

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-4 sm:p-6 text-[#E2E8F0]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Log de Señales OSINT <span className="text-cyan-400">(pipeline OASIS)</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Detección temprana con timestamp. Señales técnicas brutas del pipeline, no conclusiones verificadas.
            </p>
          </div>
        </div>
        <button
          onClick={() => buscar()}
          className="flex items-center gap-1.5 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refrescar
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div className="relative col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
            placeholder="Buscar por texto..."
            className="w-full rounded-sm border border-[#1E293B] bg-[#111827] py-1.5 pl-8 pr-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/60 focus:outline-none"
          />
        </div>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-sm border border-[#1E293B] bg-[#111827] px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500/60 focus:outline-none">
          <option value="">Tipo: todos</option>
          <option value="social">social</option>
          <option value="rss">rss</option>
          <option value="telegram">telegram</option>
        </select>
        <select value={severa} onChange={(e) => setSevera(e.target.value)} className="rounded-sm border border-[#1E293B] bg-[#111827] px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500/60 focus:outline-none">
          <option value="">Señal severa: todas</option>
          <option value="si">Solo severas</option>
          <option value="no">Solo no severas</option>
        </select>
        <select value={masivo} onChange={(e) => setMasivo(e.target.value)} className="rounded-sm border border-[#1E293B] bg-[#111827] px-2 py-1.5 text-xs text-slate-300 focus:border-cyan-500/60 focus:outline-none">
          <option value="">Envío masivo: todos</option>
          <option value="si">Solo masivos</option>
          <option value="no">Solo no masivos</option>
        </select>
        <button onClick={buscar} className="rounded-sm border border-cyan-500/50 bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 transition-colors">
          Filtrar
        </button>
        <button onClick={limpiar} className="rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-rose-500/50 hover:text-rose-300 transition-colors">
          Limpiar
        </button>
      </div>

      {/* Selector de entidad (basado en resultados) */}
      {entidades.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Entidad:</span>
          <button
            onClick={() => { setEntidad(''); buscar(); }}
            className={`rounded-sm border px-2 py-0.5 text-[10px] font-mono ${!entidad ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-[#1E293B] bg-[#111827] text-slate-400 hover:border-cyan-500/40'}`}
          >
            todas
          </button>
          {entidades.slice(0, 20).map((e) => (
            <button
              key={e}
              onClick={() => { setEntidad(e); buscar(); }}
              className={`rounded-sm border px-2 py-0.5 text-[10px] font-mono ${entidad === e ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-[#1E293B] bg-[#111827] text-slate-400 hover:border-cyan-500/40'}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Contador */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <Database className="h-3.5 w-3.5 text-cyan-400" />
        <span>{loading ? 'Cargando…' : `${lista.length} señal(es) en esta búsqueda`}</span>
        <span>·</span>
        <span>{totalDisponible} disponibles en total</span>
        {lista.length > 0 && (
          <>
            <span>·</span>
            <span className="text-amber-300">
              {lista.filter((s) => s.señal_severa).length} severas · {lista.filter((s) => s.envio_masivo).length} masivas
            </span>
          </>
        )}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-sm border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-xs text-rose-300">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-sm border border-[#1E293B] bg-[#0F172A]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#111827] text-[10px] uppercase tracking-wider text-slate-400">
                <th className="px-3 py-2 font-semibold">Timestamp (UTC)</th>
                <th className="px-3 py-2 font-semibold">Tipo</th>
                <th className="px-3 py-2 font-semibold">Entidad</th>
                <th className="px-3 py-2 font-semibold">Canal/Red</th>
                <th className="px-3 py-2 font-semibold">Título / Señal</th>
                <th className="px-3 py-2 font-semibold">Flags</th>
              </tr>
            </thead>
            <tbody>
              {paginaVisible.map((s, i) => (
                <tr key={i} className="border-b border-[#1E293B]/60 align-top hover:bg-[#111827]">
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-slate-400">{fmtTs(s.ts)}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-sm border px-1.5 py-0.5 font-mono text-[10px] ${s.tipo === 'telegram' ? 'border-sky-500/40 bg-sky-950/40 text-sky-300' : s.tipo === 'rss' ? 'border-violet-500/40 bg-violet-950/40 text-violet-300' : 'border-slate-500/40 bg-slate-800/40 text-slate-300'}`}>
                      {s.tipo || '—'}
                    </span>
                  </td>
                  <td className="max-w-[160px] px-3 py-2 text-slate-300">{s.nombre_entidad || '—'}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-cyan-300/90">@{s.canal || s.red || '—'}</td>
                  <td className="max-w-[360px] px-3 py-2 text-slate-200">
                    {s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="text-cyan-300 hover:text-cyan-100">{s.titulo || '(sin título)'}</a> : s.titulo || '(sin título)'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <div className="flex gap-1">
                      {s.señal_severa && (
                        <span className="inline-flex items-center gap-0.5 rounded-sm border border-amber-500/40 bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          <Zap className="h-2.5 w-2.5" /> SEVERA
                        </span>
                      )}
                      {s.envio_masivo && (
                        <span className="rounded-sm border border-rose-500/40 bg-rose-950/40 px-1.5 py-0.5 text-[9px] font-bold text-rose-300">
                          MASIVO
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && lista.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-500">Sin resultados para los filtros.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                    <FileText className="mx-auto mb-1 h-4 w-4 animate-pulse text-cyan-400" /> Cargando señales…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {!loading && lista.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>Página {pagina + 1} de {totalPaginas}</span>
          <div className="flex gap-2">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              className="rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:border-cyan-500/50"
            >
              ← Anterior
            </button>
            <button
              disabled={pagina >= totalPaginas - 1}
              onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
              className="rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1 text-xs font-semibold text-slate-300 disabled:opacity-40 hover:border-cyan-500/50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
