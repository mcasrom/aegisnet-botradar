# L2R — Lessons Learned Report: crítica de Perplexity al dossier OSINT

**Proyecto:** AegisNet-BotRadar
**Fecha:** 31/08/2026
**Autor de la crítica:** Perplexity (revisión externa del dossier PDF, 30/08/2026)
**Principio rector:** *"lo que no existe no se declara"* — todo lo que se imprime debe ser
verificable o estar explícitamente etiquetado como hipótesis/pregunta.

---

## 1. CONTEXTO

Perplexity revisó el Informe Técnico OSINT generado por la herramienta y concluyó que el
dossier **no era publicable todavía** por una serie de inconsistencias de honestidad y
reproducibilidad. El objetivo de este L2R es convertir esa crítica en acciones verificables,
mapear qué se ha corregido ya y qué queda por hacer, sin lecciones huérfanas.

---

## 2. HALLAZGOS DE LA CRÍTICA → ESTADO

| # | Crítica (hallazgo) | Estado | Acción | Evidencia / commit |
|---|---|---|---|---|
| C1 | Score CIB sin desglose trazable (no se ve el cálculo) | 🟡 PARCIAL | Score CIB ya es server-side y derivado de datos reales, pero falta imprimir en el PDF el desglose SIN redondear (0.30·S_topo + 0.30·S_temp + 0.25·S_sem + 0.15·S_meta) y corregir la discrepancia 37.6 vs 40 | Backend server-side; PENDIENTE P1.2 |
| C2 | Jaccard 0.98 contradice S_semántico=0 | ✅ CORREGIDO | Se eliminó el hardcode de `exactCopyPasteRatio=0`; el subsemántico (S_semántico) ahora se computa de verdad como proporción de posts duplicados en ventana; se unifica similitud literal vs semántica | Fix P1 en server.js, verificado: caso Ceuta S_semántico 0 → 57 |
| C3 | "AS-IMPORT" / "Captura OSIN" impresos como atribución geográfica | ✅ CORREGIDO | Se eliminaron valores no-geográficos; si no hay dato real se muestra "Sin geolocalizado"/0; se retiró la geo fabricada con coordenadas Madrid | Purga f6985f7 |
| C4 | P(bot) presentado como certeza objetiva | ✅ CORREGIDO | Fase de cadena de custodia redactada como "salida del clasificador", no probabilidad objetiva; P(inauténtico) derivado del score real, no fijo | Purga f6985f7 / ForensicReportModal |
| C5 | Falta tabla de eventos primarios reales (no "21 interacciones") | 🔴 PENDIENTE | El PDF debe listar cada evento con event_id, plataforma, cuenta, URL, timestamps de fuente e ingesta, texto normalizado y hash | PENDIENTE P1.1 |
| C6 | Etiqueta "CRÍTICO/SEVERO" para CIB moderado (40) sobredeclara | ✅ CORREGIDO | `riskLabel` y severidad se derivan de umbrales publicados (0-34 / 35-64 / 65-79 / 80-100); se eliminan etiquetas que sobredeclaran | Norma en forensicReport.ts, purga de "Crítico/Severo" fijos |
| C7 | Benchmark fabricado (precision 0.92/recall 0.89/F1 0.904, "N=45.000") | ✅ CORREGIDO | Sección de benchmark ahora muestra "NO DISPONIBLE" en vez de cifras inventadas; se eliminó "3.8% (Est.)" | Purga f6985f7 |
| C8 | `neutrality_certified=true` incondicional | ✅ CORREGIDO | Eliminado el certificado de neutralidad incondicional; hash de fallback → sentinel `'UNSEALABLE_CRYPTO_UNAVAILABLE'` | Purga f6985f7 |
| C9 | Datos de demostración inventados en la ingesta | ✅ CORREGIDO | Purga de defaults falsos (followers, jitter, hashtag '#OSINT_Dataset', `*420`, `*12`) en DataIngestionModal; valores honestos | Purga f6985f7 |
| C10 | "7 Dimensiones"/"5 Fases"/EXIF "RECICLAJE HISTÓRICO VERIFICADO" fijos | ✅ CORREGIDO | Conteo dinámico de `matrix.length`/`custody.length`; badge EXIF condicional al verdict real | Purga f6985f7 |

---

## 3. LECCIONES

1. **El ruido de la honestidad no es negociable en OSINT**: generar un dossier que sobredeclara
   ("pericial", "irrebatible", P(bot)=0.94) es peor que no generarlo, porque compromete la
   credibilidad de TODO el caso.
2. **Los números no se hardcodean**: si un valor (semántico, benchmark, P(bot)) no puede
   computarse en la ventana de datos disponible, se imprime "—" o "NO DISPONIBLE", nunca un
   número inventado.
3. **Atribución geográfica ≠ entrada de telemetría**: "AS-IMPORT"/"Captura OSIN" son artefactos
   de importación, no ubicaciones reales; deben tratarse como "no verificado".
4. **Separar veracidad de comportamiento**: el nivel de verificación (HECHO/HIPÓTESIS/PREGUNTA)
   es distinto de la detección técnica (score CIB); mezclarlos produce etiquetas que sobredeclaran.
5. **La reproducibilidad es el antídoto**: cualquier métrica del PDF debe poder rastrearse al
   dato de origen (archivo, hook de pipeline, timestamp).

---

## 4. ACCIONES PENDIENTES (sin lecciones huérfanas)

| Referencia | Acción | Sprint |
|---|---|---|
| P1.1 | Tabla de eventos primarios reales en el PDF | Sprint 31/08 |
| P1.2 | Desglose del score CIB sin redondear + corregir discrepancia | Sprint 31/08 |
| P1.3 | Definición unificada de similitud literal vs semántica en el PDF | Sprint 31/08 |
| P1.4 | Auditar que ningún campo de ASN/país imprima valores no-geográficos | Sprint 31/08 |
| P1.5 | Texto del PDF que declare P(bot) como salida del clasificador con umbral | Sprint 31/08 |
| P1.6 | Etiquetas de severidad con umbrales publicados | Sprint 31/08 |
| P3.1 | Vocabulario graduado (sustituir "bots/granja/fake news") en UI y PDF | Sprint 31/08 |
| P3.2 | Análisis de veracidad separado del comportamiento en el PDF | Sprint 31/08 |
| P3.3 | No exponer datos personales injustificados | Sprint 31/08 |

---

## 5. CIERRE

C9 concretas de la crítica: 6 cerradas (C2, C3, C4, C6, C7, C8), 1 parcial (C1), 1 pendiente
(C5) y las de C9 trasladadas a pendientes del sprint. Este L2R se versiona en el repo y se
registra en la bitácora (L3). La prioridad restante del sprint se concentra en P1 (PDF
reproducible) y P3 (lenguaje y veracidad).
