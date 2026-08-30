/**
 * AegisNet-BotRadar: Sobre el proyecto, metodología y fuentes
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

import React from 'react';
import { X, Scale, ShieldCheck, FileSearch, GitBranch, Mail } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutContent: React.FC = () => {
  return (
    <div className="space-y-5 px-6 py-5 text-sm text-slate-300">
          {/* Sobre el proyecto */}
          <section>
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Sobre el proyecto</h3>
            </div>
            <p className="mt-2 leading-relaxed">
              <strong className="text-slate-100">AegisNet-BotRadar</strong> es una plataforma analítica{' '}
              <strong className="text-slate-100">open-source y apartidista</strong> para la detección temprana de
              granjas de bots y campañas de desinformación coordinada (CIB) en redes digitales. Forma parte del
              ecosistema <span className="font-mono text-slate-200">viajeinteligencia.com</span>, junto con el libro
              abierto <em>Flood the Zone — El manual en acción</em> (que documenta y verifica los mismos casos).
            </p>
            <p className="mt-2 leading-relaxed">
              AegisNet no imputa autoría: evalúa <strong className="text-slate-100">patrones técnicos de coordinación</strong>{' '}
              (duplicación, sincronía temporal, topología) y los presenta como avisos a contrastar, nunca como prueba
              de culpabilidad.
            </p>
          </section>

          {/* Metodología */}
          <section>
            <div className="flex items-center gap-2 text-emerald-400">
              <FileSearch className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Metodología</h3>
            </div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li>
                <strong className="text-slate-100">Tres registros separados</strong> en cada hallazgo:{' '}
                <span className="font-mono text-emerald-300">HECHO</span> (verificable, con fuente),{' '}
                <span className="font-mono text-amber-300">HIPÓTESIS</span> (plausible, etiquetada) y{' '}
                <span className="font-mono text-rose-300">PREGUNTA</span> (pendiente de investigación).
              </li>
              <li>
                <strong className="text-slate-100">Avisos, no conclusiones</strong>: las señales automáticas
                (envío masivo, coordinación temporal, duplicación) son pistas a contrastar, nunca una prueba de bot,
                campaña o culpa.
              </li>
              <li>
                <strong className="text-slate-100">Score CIB ponderado</strong> con cuatro sub-métricas: topológica,
                temporal, semántica y de metadatos, calculado server-side sobre los datos reales.
              </li>
              <li>
                <strong className="text-slate-100">Cadena de custodia</strong>: sellado SHA-256 del dataset bruto
                y matriz de confianza que declara el nivel de verificación de cada campaña.
              </li>
              <li>
                <strong className="text-slate-100">Detección automatizada</strong> (cada 12h): el pipeline{' '}
                <span className="font-mono text-slate-200">oasis.py</span> monitoriza RSS de verificadores, canales
                públicos de Telegram y APIs públicas (Bluesky, Mastodon), con umbrales de volumen y coordinación.
              </li>
              <li>
                <strong className="text-slate-100">Revisión humana</strong>: todo hallazgo documentado pasa por
                criterios editoriales públicos antes de integrarse.
              </li>
            </ul>
          </section>

          {/* Fuentes */}
          <section>
            <div className="flex items-center gap-2 text-indigo-400">
              <Scale className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Fuentes</h3>
            </div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed">
              <li><strong className="text-slate-100">Verificadores</strong>: Maldita.es, Newtral, EFE Verifica, Chequeado (Argentina/LatAm).</li>
              <li><strong className="text-slate-100">Medios</strong>: El Faro de Ceuta, Euronews Spain, El País, EFE, BBC, Al Arabiya, Infobae (contraste).</li>
              <li><strong className="text-slate-100">Redes sociales</strong> (APIs públicas): Bluesky y Mastodon, para detección de coordinación temporal.</li>
              <li><strong className="text-slate-100">Canales públicos de Telegram</strong> de verificadores y medios locales.</li>
              <li><strong className="text-slate-100">Documentos e informes</strong>: Informe de Seguridad Nacional, sentencias y comunicados oficiales citados por caso.</li>
              <li>Cada hallazgo lleva enlace a su <strong className="text-slate-100">fuente original</strong>.</li>
            </ul>
          </section>

          {/* Transparencia y contacto */}
          <section className="border-t border-[#1E293B] pt-4">
            <div className="flex flex-wrap items-center gap-4 text-[12px]">
              <a
                href="https://github.com/mcasrom/aegisnet-botradar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>Código abierto en GitHub</span>
              </a>
              <a
                href="mailto:aegis.info@viajeinteligencia.com"
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>aegis.info@viajeinteligencia.com</span>
              </a>
              <span className="text-slate-500">© M. Castillo — Uso ético y respeto a los términos de servicio de las plataformas.</span>
            </div>
          </section>
        </div>
  );
};

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-y-auto rounded-lg border border-[#1E293B] bg-[#0A0C10] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">AegisNet-BotRadar</h2>
              <p className="text-[11px] text-slate-400">Plataforma OSINT de detección de campañas de desinformación coordinada (CIB)</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-sm p-1.5 text-slate-400 hover:bg-[#1E293B] hover:text-white transition-colors" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <AboutContent />
      </div>
    </div>
  );
};
