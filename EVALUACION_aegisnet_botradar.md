# EVALUACIÓN DE VIABILIDAD — AegisNet-BotRadar
## Candidato a despliegue en servidor Hetzner (178.105.80.193) como herramienta OSINT

**Fecha:** 30/08/2026
**Proyecto analizado:** `~/aegisnet-botradar` (local, laptop)
**Criterio del cliente:** viabilidad, funcionalidad, capacidad de análisis, e idoneidad como
herramienta OSINT **veraz, sin fakes, placeholders ni makeups**.

---

## 1. RESUMEN EJECUTIVO

| Dimensión | Resultado |
|---|---|
| **Compila** | ✅ Sí (Vite + React, 3s, bundle 923KB/283KB gzip) |
| **Lint/TypeScript** | ✅ Sin errores (`tsc --noEmit`) |
| **Motor analítico** | ✅ Algoritmos reales y publicables (Levenshtein, Jaccard, hub-and-spoke, Louvain, pagerank) |
| **Ingesta de datos REALES** | ⚠️ **No automatizada**: no hay collectors en el código. El manual instruye a usar herramientas externas (Telethon, snscrape) y cargar el CSV/JSON a mano |
| **Capacidad Gemini declarada** | ❌ **No implementada** (dependencia en `package.json` pero cero llamadas en `src/`) |
| **Datos de demostración** | ❌ Son **ficticios diseñados a mano** ("Real Benchmark Datasets… No fake mocks!" pero son inventados) |
| **Generador de expedientes** | ❌ **Fabrica** expedientes sintéticos al introducir un tema (handles/cibScores inventados) |
| **Mapa geopolítico** | ⚠️ SVG ilustrativo simplificado (so continentes), no geográficamente exacto |
| **Peso desplegable** | ✅ ~796 KB sin node_modules; estático, sirve con nginx |

**Veredicto global:** motor de análisis **real y valioso**, pero la herramienta **en su estado
actual NO cumple el criterio de "OSINT veraz sin fakes"**: se apoya en datos de demostración
inventados y un generador que sintetiza expedientes falsos, con la ingesta de datos reales
**manual y externalizada**. No es recomendable **desplegarla tal cual**. Sí es factible
**adaptarla** para convertirla en una herramienta veraz, integrando la ingesta real al servidor.

---

## 2. VIABILIDAD TÉCNICA DE DESPLIEGUE

### Requisitos
- **Runtime:** Node.js 18+ (ya disponible en el server para PM2).
- **Build:** estático (Vite→`dist/`), servir con nginx — **sin back-end propio**, muy ligero.
- **Memoria/CPU:** trivial para el Hetzner (sea sirve como estático; ~0 RAM en ejecución).

### Compatibilidad con la infraestructura existente
- **Excelente**: es un SPA estático, cabe como subdominio/vhost naranja (Cloudflare proxy) igual
  que `libro-colaborativo`.
- **Puedo desplegar en minutos** (`npm ci && npm run build`, copiar `dist/`, crear vhost, cert).

### Observaciones técnicas
- **Bundle pesado** (923KB→283KB gzip): mitigable con code-splitting; no es bloqueante.
- **Sin back-end**: el `express`/`@google/genai` en `package.json` están **sin usar** (makeup).
- **`npm install` funciona** (verificado). El proyecto limpio pesa ~796 KB.

### Notas sobre recursos del server
- Disco ~59% (15G libres): el repositorio es despreciable.
- Reutilizables: pipeline cron de `oasis.py`, bloqueo de bots nginx, infraestructura naranja.

---

## 3. FUNCIONALIDAD (lo que la herramienta hace de verdad)

### Módulos presentes y reales
1. **Grafo de red interactivo** (D3 force-directed): nodos/cuentas, aristas, centralidad,
   comunidades. Reales sobre los datos cargados.
2. **Análisis temporal**: telemetría de micro-ráfagas, jitter, detección de automatización.
3. **Análisis semántico (NLP)**: similitud Jaccard/Levenshtein entre publicaciones.
4. **Línea de acción OSINT**: plantillas de takedown, cadena de custodia ISO 27037, dossier PDF
   (jsPDF real).
5. **Ingesta manual**: carga de JSON/CSV pegados o subidos → los procesa con el motor.

### Módulos que NO aportan valor fiable (en estado actual)
- **Mapa geopolítico**: SVG ilustrativo con continentes toscos; no es un mapa real.
- **Campañas preconfiguradas**: 16 casos de estudio **ficticios**.
- **"Benchmark datasets" de 1 clic**: **inventados** (handles/fechas/textos de ejemplo).
- **Generador de expedientes por tema**: **fabrica** cuentas y puntuaciones sintéticas.
- **Capacidad Gemini**: declarada en metadata/package pero **sin código real**.

---

## 4. CAPACIDAD DE ANÁLISIS (honestidad del motor)

### Lo genuino
- El **motor CIB** (`cibEngine.ts`) usa matemáticas reales y auditables:
  - Distancia de Levenshtein y Jaccard (similitud textual).
  - Hub-and-spoke (detección de orquestación topológica).
  - Métricas de centralidad (degree, betweenness, pageRank, Louvain).
  - Evaluación temporal (jitter, ráfagas) y de metadatos (ratio seguidores, zombis).
- La **fórmula de score CIB** está documentada y ponderada (0.30 topológico / 0.30 temporal /
  0.25 semántico / 0.15 metadatos) — reproducible.
- El **manual de operación** (183 líneas) es técnicamente sólido, apartidista y con buenas
  prácticas OPSEC, prevención de falsos positivos y límite epistémico correcto (no imputar
  autoría estatal sin mandamiento).

### Lo que NO es análisis real
- **Los datos de entrada**, si no se cargan manualmente, son sintéticos.
- El **cibScore por nodo** en la ingesta es un **esquema simplificado en cliente**
  (`cibScore: 40` inicial → +18 si hay textos idénticos; línea 231-234 de DataIngestionModal),
  NO el resultado del motor completo de topología. Presentado como forense, es una heurística.
- No hay **collectors automatizados** (no hay telethon/snscrape/APIs en el código); la ingesta
  real depende del usuario usando herramientas externas.

---

## 5. VIABILIDAD COMO HERRAMIENTA OSINT "VERAZ, SIN FAKES" EN EL HETZNER

### Conclusión directa
**NO recomendable desplegar el proyecto tal cual**, porque viola el criterio "sin fakes,
placeholders ni makeups":
- Se exhiben "benchmark datasets" y "casos de estudio" que son **ficción presentada con aspecto
  de dato forense real** (handles, fechas, seguidores y `postIdOrUrl` de ejemplo).
- El "generador de expedientes" **inventa** coordenadas, ASN y puntuaciones.
- La capacidad Gemini está **inflada en metadata** (MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API) sin
  implementación.

### Cómo SÍ podría ser viable (hoja de ruta de adaptación)
Para que sea una herramienta OSINT veraz y desplegable en Hetzner, haría falta:

| Acción | Esfuerzo | Imprescindible |
|---|---|---|
| **1. Conectar colectores reales** (Telethon vía número/sesión para Telegram; X/Twitter vía API de nube/SNScrape) que alimenten el motor con datos de campo reales, basados en el pipeline que ya tenemos (`oasis.py`) | Medio-alto | **Sí** |
| **2. Eliminar o etiquetar explícitamente** los datasets "benchmark" y el generador sintético como *sandbox/demo claramente señalado*, no como dato forense | Bajo | **Sí** |
| **3. Remplazar el mapa SVG** por capas reales (actualmente so) y eliminar la promesa Gemini (o implementarla de verdad) | Medio | **Sí** |
| **4. Sustituir el cibScore del cliente** por el motor analítico real y documentar la cadena de custodia con hash SHA-256 del dataset bruto | Medio | Sí (calidad) |
| **5. Código-splitting** del bundle y despliegue estático | Bajo | Recomendado |

### Sinergia con lo que ya existe en el server
- El pipeline `oasis.py` de `democracia-bajo-asalto` ya recolecta señales reales de
  Telegram/verificadores y detecta granjas/coordinación. **AegisNet podría reutilizar ese motor
  como back-end real de ingesta** en vez de los datos sintéticos.
- Podrían coexistir: `libro-colaborativo` (libro/casos) + `aegisnet-botradar` (herramienta de
  análisis forense) alimentada **por los mismos datos reales**, con cadena de custodia.

---

## 6. RECOMENDACIÓN

1. **No desplegar en su estado actual** (no cumple "sin fakes").
2. **Reutilizar lo bueno**: el motor CIB (`cibEngine.ts`), el grafo D3, las plantillas de acción
   y el reporte PDF son genuinos y portables.
3. **En el siguiente sprint**, si se desea: integrarlo como **interfaz de visualización/forense**
   sobre los **datos reales de oasis.py**, eliminando los datasets sintéticos y el generador, y
   así tener una herramienta OSINT **veraz y desplegable** en Hetzner.

*Documento de evaluación sin maquillaje, conforme al criterio del cliente.*
