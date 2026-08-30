# AegisNet-BotRadar

Plataforma analítica **open-source y apartidista** para la detección temprana de granjas de
bots y campañas de desinformación coordinada (CIB / Coordinated Inauthentic Behavior) en redes
digitales (X/Twitter, Telegram, Meta, YouTube).

**Contacto:** [mybloggingnotes@gmail.com](mailto:mybloggingnotes@gmail.com)

---

## ¿Qué hace?

Plataforma de trabajo pericial OSINT que procesa datasets de publicaciones de redes sociales y
calcula métricas forenses de coordinación inauténtica. Desde la **Fase 1** (ver
`HOJA_DE_RUTA_RECONFIGURACION.md`) se alimenta de **datos reales** del pipeline
`oasis.py` (Telegram/verificadores monitorizados por cron), no de muestras inventadas:

- **Backend real** (`server.js`): lee los outputs de `oasis.py` (`DATOS/estado.json`,
  `DATOS/oasis_senales_*.json`) y los expone como campañas por entidad vía `/api/campaigns`.
  Nodos = canales reales; posts = señales reales. Calcula el score CIB server-side y el
  **SHA-256 del dataset bruto** (cadena de custodia).
- **Motor analítico** (`src/services/cibEngine.ts`): Levenshtein, Jaccard, hub-and-spoke,
  centralidad (degree, betweenness, pageRank) y score CIB ponderado.
- **Grafo de red interactivo** (D3 force-directed) con comunidades y métricas por nodo.
- **Análisis temporal**: micro-ráfagas, dispersión de jitter, detección de automatización.
- **Análisis semántico** (NLP) de similitud entre publicaciones.
- **Cadena de custodia**: sellado SHA-256 (ISO/IEC 27037), formularios de takedown y reporte
  forense exportable a PDF (jsPDF).
- **Ingesta manual**: carga de datasets reales en JSON/CSV (pegando texto o subiendo archivo).

### Modo demo (claramente señalado)

Si el backend no está disponible, la app se inicia en **MODO DEMO** con un **banner persistente
ámbar**: muestra las campañas de demostración (`DEMO_CAMPAIGNS`) y los botones "DATOS DE
EJEMPLO" de la ingesta. Ninguno de esos datos es evidencia real y el banner lo indica
explícitamente.

## Limitaciones conocidas (lectura honesta)

- **Los datos viven en el backend**: la app necesita `server.js` apuntando a los `DATOS` del
  pipeline para mostrar evidencias reales. Sin backend, entra en modo demo (banner ámbar).
- La **cobertura de datos** depende del pipeline `oasis.py`: canales Telegram públicos y feeds
  de verificadores, por ciclos de 12h. No incluye captura completa de cada cuenta.
- El **score CIB** server-side usa heurísticas sobre las señales disponibles (volumen,
  envío masivo, duplicación); no reemplaza un análisis de topología completo con aristas de
  interacción real (fase 2 del roadmap).
- Los **datasets de demostración** quedan solo en modo demo, claramente etiquetados.
- La **capacidad Gemini** declarada en `metadata.json` es intención de la plataforma AI Studio;
  **no hay llamadas a Gemini implementadas** en este código.

## Requisitos

- Node.js 18+

## Ejecución local

```bash
npm install
npm run build           # genera dist/
# arrancar frontend + backend real (lee ./DATOS o la variable DATOS_DIR):
npm run start:server    # sirve http://localhost:3789 (frontend estático + API)
# o solo frontend con back externo:
VITE_API_BASE="https://localhost:3789" npm run dev   # http://localhost:3000
```

## Build de producción

```bash
npm run build    # genera dist/ (estático)
npm run lint     # tsc --noEmit
```

## Documentación

- `MANUAL_OPERACION_GESTION_OSINT.md` — manual de operación, metodología y cadena de custodia.
- `EVALUACION_aegisnet_botradar.md` — evaluación de viabilidad y hoja de ruta de adaptación.

---

*Herramienta para investigación y verificación periodística. Uso ético y respeto a los
términos de servicio de las plataformas.*