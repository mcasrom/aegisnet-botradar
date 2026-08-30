/**
 * AegisNet-BotRadar: Mapa Geopolítico y Temático de Desinformación
 * Visualización interactiva de procedencia de infraestructura (ASNs, Proxies, Granjas),
 * vectores transfronterizos hacia procesos electorales e idiomas predominantes.
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Radio,
  Server,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Languages,
  Users,
  Compass
} from 'lucide-react';
import { InvestigationCampaign, GeopoliticalVector } from '../types/botradar';

interface GeopoliticalMapViewProps {
  campaign: InvestigationCampaign;
}

export const GeopoliticalMapView: React.FC<GeopoliticalMapViewProps> = ({ campaign }) => {
  const [selectedVector, setSelectedVector] = useState<GeopoliticalVector | null>(
    campaign.geopoliticalVectors[0] || null
  );

  // Convert lat/lng to approximate SVG 2D mercator projection coordinates [0..800, 0..400]
  const projectCoords = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return [x, y];
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#0A0C10] p-6 text-[#E2E8F0]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-indigo-500/30 bg-indigo-900/30 text-indigo-400">
              <Globe className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Mapa Geopolítico de Vectores de Injerencia & Procedencia
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Trazabilidad de infraestructura de servidores proxy, enrutamiento ASNs de botnets y objetivos electorales de la narrativa.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-sm border border-[#1E293B] bg-[#111827] px-3 py-1.5 font-mono text-xs text-slate-300">
          <Server className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-slate-500 uppercase text-[10px]">Vectores Activos:</span>
          <span className="font-bold text-indigo-400">{campaign.geopoliticalVectors.length} rutas</span>
        </div>
      </div>

      {/* Main Interactive Map & Vector Inspection Card */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* SVG World Map Vector Projection (2 columns) */}
        <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Compass className="h-4 w-4 text-indigo-400" />
              Proyección de Trayectorias de Injerencia y Nodos Egress
            </span>
            <span className="rounded-sm bg-[#0A0C10] border border-[#1E293B] px-2 py-0.5 font-mono text-[10px] text-slate-400">
              Proyección Global Ciberespacio
            </span>
          </div>

          {/* Interactive World Map SVG */}
          <div className="relative mt-4 flex items-center justify-center overflow-hidden rounded-sm border border-[#1E293B] bg-[#0A0C10] p-4">
            <svg
              viewBox="0 0 800 400"
              className="h-auto w-full max-h-[380px]"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle Grid Lat/Long Lines */}
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>

              <rect width="800" height="400" fill="#0A0C10" />
              <rect width="800" height="400" fill="url(#gridPattern)" />

              {/* Simplified world continents outlines */}
              {/* North America */}
              <path
                d="M 120 70 Q 180 60 220 90 Q 240 140 190 190 Q 150 200 130 150 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* South America */}
              <path
                d="M 230 210 Q 290 220 270 320 Q 240 370 210 320 Q 190 250 230 210 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Europe */}
              <path
                d="M 370 90 Q 440 80 470 120 Q 450 160 390 160 Q 360 120 370 90 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Africa */}
              <path
                d="M 370 170 Q 450 170 470 260 Q 420 340 380 300 Q 350 220 370 170 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Asia & Eurasia */}
              <path
                d="M 460 70 Q 640 50 690 120 Q 660 200 560 190 Q 470 150 460 70 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Australia / Oceania */}
              <path
                d="M 640 260 Q 720 270 700 330 Q 630 340 640 260 Z"
                fill="#0F172A"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* Render Geopolitical Vectors */}
              {campaign.geopoliticalVectors.map((vec) => {
                const [srcX, srcY] = projectCoords(vec.originCoords[0], vec.originCoords[1]);
                const [tgtX, tgtY] = projectCoords(vec.targetCoords[0], vec.targetCoords[1]);
                const isSelected = selectedVector?.id === vec.id;

                // Midpoint control point for arched trajectory
                const midX = (srcX + tgtX) / 2;
                const midY = Math.min(srcY, tgtY) - 40;

                return (
                  <g key={vec.id} onClick={() => setSelectedVector(vec)} className="cursor-pointer">
                    {/* Arched Attack Vector Path */}
                    <path
                      d={`M ${srcX} ${srcY} Q ${midX} ${midY} ${tgtX} ${tgtY}`}
                      fill="none"
                      stroke={isSelected ? 'url(#vectorGrad)' : 'rgba(244, 63, 94, 0.45)'}
                      strokeWidth={isSelected ? 3 : 1.8}
                      strokeDasharray={isSelected ? 'none' : '4 4'}
                    />

                    {/* Origin Node Indicator (Rose pulsatile dot) */}
                    <circle cx={srcX} cy={srcY} r={isSelected ? 6 : 4} fill="#F43F5E" />
                    <circle
                      cx={srcX}
                      cy={srcY}
                      r={isSelected ? 11 : 7}
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="1"
                      opacity="0.6"
                    />

                    {/* Target Node Indicator (Indigo dot) */}
                    <circle cx={tgtX} cy={tgtY} r={isSelected ? 6 : 4} fill="#818CF8" />
                    <circle
                      cx={tgtX}
                      cy={tgtY}
                      r={isSelected ? 11 : 7}
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Map Floating Legend */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-sm border border-[#1E293B] bg-[#0F172A]/90 p-2.5 text-[11px] shadow-lg backdrop-blur-md">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                Origen Infraestructura (ASN / Proxy / Granja)
              </span>
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
                Objetivo Electoral / Territorio Afectado
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Vector Inspector Card */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ficha de Vector Geopolítico Seleccionado
          </h3>

          {selectedVector ? (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 space-y-4">
              <div className="border-b border-[#1E293B] pb-3">
                <span className="rounded-sm border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                  Vector #{selectedVector.id}
                </span>
                <h4 className="mt-2 text-sm font-bold text-white">
                  {selectedVector.originCountry} &rarr; {selectedVector.targetRegion}
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-mono text-[11px] block uppercase">Proceso Electoral / Temática Crítica:</span>
                  <span className="font-semibold text-indigo-300 text-sm">
                    {selectedVector.targetElectoralProcessOrTopic}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[11px] block uppercase">Alcance Estimado de la Campaña:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedVector.estimatedReach.toLocaleString()} impresiones potenciales
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[11px] block uppercase">Nodos Bot Activos en este Vector:</span>
                  <span className="font-mono font-bold text-rose-400">
                    {selectedVector.activeBotNodes} cuentas automatizadas
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono text-[11px] block uppercase">Idioma y Variación Sintáctica:</span>
                  <span className="text-slate-200">
                    {selectedVector.primaryLanguage}
                  </span>
                </div>

                <div className="rounded-sm border border-[#1E293B] bg-[#0A0C10] p-3 border-l-2 border-orange-500">
                  <span className="block font-mono text-[11px] uppercase text-orange-400">
                    Notas de Inteligencia de Infraestructura:
                  </span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {selectedVector.infrastructureNotes}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5 text-center text-xs text-slate-400">
              Selecciona un vector en el mapa para ver los detalles.
            </div>
          )}

          {/* Languages Distribution Card */}
          <div className="rounded-sm border border-[#1E293B] bg-[#111827] p-5">
            <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 text-xs font-bold uppercase text-slate-300">
              <Languages className="h-4 w-4 text-indigo-400" />
              <span>Distribución Lingüística de la Desinformación</span>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Español (Sintaxis Regional Alterada)</span>
                  <span className="text-indigo-400 font-bold">78%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-sm bg-[#0A0C10] border border-[#1E293B]">
                  <div className="h-full rounded-sm bg-indigo-500" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Inglés (Traducciones Sintéticas)</span>
                  <span className="text-slate-400 font-bold">14%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-sm bg-[#0A0C10] border border-[#1E293B]">
                  <div className="h-full rounded-sm bg-slate-400" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Otros / Multilingüe</span>
                  <span className="text-orange-400 font-bold">8%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-sm bg-[#0A0C10] border border-[#1E293B]">
                  <div className="h-full rounded-sm bg-orange-500" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
