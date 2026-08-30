# AegisNet-BotRadar

Plataforma analítica **open-source y apartidista** para la detección temprana de granjas de
bots y campañas de desinformación coordinada (CIB / Coordinated Inauthentic Behavior) en redes
digitales (X/Twitter, Telegram, Meta, YouTube).

**Contacto:** [mybloggingnotes@gmail.com](mailto:mybloggingnotes@gmail.com)

---

## ¿Qué hace?

Servidor de trabajo pericial OSINT que procesa datasets de publicaciones de redes sociales y
calcula métricas forenses de coordinación inauténtica:

- **Motor analítico real** (`src/services/cibEngine.ts`): distancia de Levenshtein, similitud
  de Jaccard, detección hub-and-spoke, centralidad (degree, betweenness, pageRank) y score CIB
  ponderado (topología 0.30 / temporal 0.30 / semántico 0.25 / metadatos 0.15).
- **Grafo de red interactivo** (D3 force-directed) con comunidades y métricas por nodo.
- **Análisis temporal**: micro-ráfagas, dispersión de jitter, detección de automatización.
- **Análisis semántico** (NLP) de similitud entre publicaciones.
- **Cadena de custodia**: plantilla de sellado SHA-256 (ISO/IEC 27037), formularios de
  takedown para Trust & Safety, y reporte forense exportable a PDF (jsPDF).
- **Ingesta manual**: carga de datasets reales en JSON/CSV (pegando texto o subiendo archivo).

## Limitaciones conocidas (lectura honesta)

- La **ingesta de datos reales es manual**: usa tus colectores CLI (Telethon para Telegram,
  snscrape/X API para X) para extraer datasets y carga el resultado en la app. No hay
  colectores automatizados incluidos en este repositorio.
- Los **datasets de demostración** incluidos en la UI (botón "benchmark") **son ejemplos
  ilustrativos diseñados a mano**, no datos de campo capturados. Sirven solo para probar el
  motor. No deben tratarse como evidencia forense.
- La **capacidad Gemini** declarada en `metadata.json` es una declaración de intención de la
  plataforma AI Studio; **no hay llamadas a Gemini implementadas en este código**.

## Requisitos

- Node.js 18+
- (Opcional) `GEMINI_API_KEY` para futuras capacidades del asistente — **sin usar hoy**.

## Ejecución local

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build de producción

```bash
npm run build    # genera dist/ (estático, servible con nginx/cualquier host estático)
npm run lint     # tsc --noEmit
```

## Documentación

- `MANUAL_OPERACION_GESTION_OSINT.md` — manual de operación, metodología y cadena de custodia.
- `EVALUACION_aegisnet_botradar.md` — evaluación de viabilidad y hoja de ruta de adaptación.

---

*Herramienta para investigación y verificación periodística. Uso ético y respeto a los
términos de servicio de las plataformas.*