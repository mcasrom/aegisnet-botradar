# HOJA DE RUTA — Sprint 2026-08-31 (endurecimiento del dossier según crítica de Perplexity)

**Fecha:** 31/08/2026
**Base:** crítica externa de Perplexity al dossier PDF (30/08) + WAYAHEAD_ENDURECIMIENTO.md.
**Objetivo:** que el Informe Técnico OSINT sea **reproducible y honesto**: cada conclusión
enlaza con un evento real, cada métrica tiene definición y cada score es verificable.

---

## CRITERIOS DE LA CRÍTICA QUE GUIAN EL SPRINT

La crítica identificó como "no publicable aún": score CIB sin desglose trazable, Jaccard 0.98
contra S_semántico=0, AS-IMPORT/Captura OSIN como atribución, P(bot) como certeza, falta de
tabla de eventos primarios, y etiqueta "Crítico/Severo" para CIB 40.

---

## PRIORIDAD 0 — UX: la vista de Línea de Acción OSINT (scroll)

| # | Tarea | Detalle | Aceptación |
|---|---|---|---|
| U1 | **Eliminar el scroll que "esconde" el contenido** | La vista de Línea de Acción OSINT muestra el contenido en una zona estrecha que obliga a scroll excesivo; el contenido parece "escondido". Rediseñar: panel de fases compacto, checklist en grid-2 (ya hecho parcialmente), y que la fase activa ocupe el ancho sin requerir scroll vertical para ver lo esencial. | El contenido esencial (caso, CIB, checklist) visible sin scroll; solo scroll para profundizar |
| U2 | **Fases como pestañas desplegables** | En vez de una sola fase larga a la vez con todo apilado, mostrar las 5 fases como pestañas/accordion colapsadas para navegar sin scroll largo. | Navegación por fases sin scroll excesivo |

## PRIORIDAD 1 — Hacer el PDF reproducible (bloquea todo lo demás)

| # | Tarea | Detalle | Aceptación |
|---|---|---|---|
| P1.1 | **Tabla de eventos primarios real** | El dossier debe listar cada evento con: event_id, plataforma, cuenta, URL, timestamp_source_utc, timestamp_ingestion_utc, tipo de interacción, texto normalizado, hash de contenido. No "21 interacciones" sin detalle. | Tabla de eventos en el PDF con ≥ los campos mínimos |
| P1.2 | **Desglose del score CIB trazable** | Mostrar los valores SIN redondear de cada sub-score y el cálculo paso a paso (0.30·S_topo + 0.30·S_temp + 0.25·S_sem + 0.15·S_meta = CIB). Corregir la discrepancia 37.6 vs 40. | El PDF muestra el cálculo y coincide |
| P1.3 | **Resolver Jaccard vs S_semántico** | Si S_semántico=0, no puede haber "Jaccard 0.98". Unificar la definición: similitud literal (Jaccard sobre tokens) ≠ similitud semántica. Mostrar ambas con su definición. | Sin contradicción en el PDF |
| P1.4 | **Eliminar AS-IMPORT / Captura OSIN** | El campo país/ASN no debe imprimir valores no-geográficos ("Captura OSIN") ni "AS-IMPORT". Si no hay dato real: "—" o "no verificado". | Sin campos falsos de ASN/país |
| P1.5 | **P(bot) como salida del modelo** | Todo P(bot) debe etiquetarse como "salida del clasificador (no probabilidad objetiva)" con su umbral y dataset de calibración. | Texto del PDF aclara la naturaleza del score |
| P1.6 | **Etiqueta de severidad honesta** | Sustituir "CRÍTICO/SEVERO" para CIB moderado por "señal de coordinación" con umbrales publicados (0-34 / 35-64 / 65-79 / 80-100). | Sin etiquetas que sobredeclaran |

## PRIORIDAD 2 — Robustez del backend y datos

| # | Tarea | Detalle | Aceptación |
|---|---|---|---|
| P2.1 | **Healthcheck cron activo** | Instalar en crontab el script `aegisnet-healthcheck.sh` (creado el 30/08) con alerta de datos stale >36h. | Cron activo + log de healthcheck |
| P2.2 | **Fix del healthcheck (ok=True)** | El script da "ok=false" aunque el backend responde ok=true (bug de comparación). Depurar y dejar verde. | healthcheck exit=0 con backend sano |
| P2.3 | **Monitor uptime-kuma** | Añadir monitor HTTPS de `https://aegis.viajeinteligencia.com/api/health` intervalo 5min. | Monitor activo |
| P2.4 | **Test del backend** | `node --test` que importe server.js con fixture y verifique buildCampaign/buildCaseCampaign (nodos/edges/CIB). | npm test pasa |
| P2.5 | **Verificación de integridad** | Script que compare SHA-256 del caso en repo local vs server vs servido por API. | Hashes coinciden |

## PRIORIDAD 3 — Lenguaje y veracidad

| # | Tarea | Detalle | Aceptación |
|---|---|---|---|
| P3.1 | **Vocabulario graduado** | Sustituir "bots", "granja", "fake news" por categorías graduadas en toda la UI y el PDF: "cuenta con señales de automatización", "grupo coordinado potencial", "afirmación no verificada". | Sin "bots/granja/fake news" como conclusión |
| P3.2 | **Análisis de veracidad separado** | En el caso documentado, cada hallazgo debe tener su afirmación, fuente, evidencia y estado (verdadera/falsa/engañosa/no verificable). Ya existe estructura; asegurar que el PDF la refleje. | PDF separa veracidad de comportamiento |
| P3.3 | **No exponer datos personales** | Revisar que el dossier no muestre identificadores de operadores reales (solo públicos) ni asocie cuentas a personas físicas sin base. | Sin asociaciones personales injustificadas |

---

## DEFINICIÓN DE "HECHO"

- El PDF desplegado muestra la tabla de eventos real y el desglose del score sin redondear.
- `npm test` pasa; healthcheck en cron con exit=0.
- Sin "AS-IMPORT"/"Captura OSIN"/"CRÍTICO" engañosos en el PDF.
- Sin "bots/granja/fake news" como conclusión en UI ni PDF.
- Commit + push + bitácora al cierre.

## NOTA

Este sprint NO añade features nuevas: hace que lo que existe sea verificable y honesto,
conforme al principio rector del proyecto ("lo que no existe no se declara").
