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

## PRIORIDAD 0b — L2R: Lessons Learned Report (crítica de Perplexity)

| # | Tarea | Detalle | Aceptación |
|---|---|---|---|
| L1 | **Crear L2R de la crítica de Perplexity** | Convertir la crítica del dossier (30/08) en un documento Lessons Learned: qué falló, qué se corrigió ya, qué queda. Estructura: (1) contexto, (2) hallazgos de la crítica, (3) acciones tomadas, (4) lecciones, (5) acciones pendientes. | L2R.md versionado en el repo |
| L2 | **Verificar que cada lección tiene acción** | Mapear cada punto de la crítica a un estado: CORREGIDO (con commit) / PENDIENTE (en sprint). Sin lecciones huérfanas. | Tabla crítica→estado completa |
| L3 | **Adjuntar el análisis a la bitácora** | Añadir entrada en SEGUIMIENTO.md con el L2R y el estado de cada punto. | Bitácora actualizada |

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

---

## SPRINT "LO QUE DEBERÍA SER" — Rediseño honesto (post-veredicto de los días 31/08)

**Fecha:** 31/08/2026
**Contexto / veredicto:** Tras sesión con el propietario (y auditar el pipeline), se confirma que
la app actual es **una interfaz con login que no vale para nada**: no busca ninguna pregunta,
no verifica nada, no vigila la red real (X/WhatsApp), no mide tráfico previo, y cada hallazgo
queda en "NO VERIFICADO" de forma vacía. Este sprint redefine qué debe SER la herramienta.

### Diagnóstico del mierdón (qué hace HOY, real)

| Qué hace | Qué debería hacer | Dónde falla |
|---|---|---|
| Junta posts/noticias (Bluesky, Mastodon, Telegram, RSS) y cuenta repeticiones | Plantear una hipótesis de investigación y buscar evidencia a favor y en contra | No hay pregunta: solo "recopila lo que repite" |
| Etiqueta cada afirmación como "no verificado" | VERIFICAR cada afirmación contra fuentes (verdadera/falsa/engañosa/no verificable) | "No verificado" es renunciar, no rigor |
| Muestra grafos/CIB/temporal "bonitos" | Que cada visual responda a una métrica definida y trazable | Pintan datos que no significan nada sin verificación |
| Detecta volumen de menciones | DETECTAR PICO DE TRÁFICO PREVIO A UN EVENTO (alerta temprana) | No midió el cruce: no corrió antes del evento y no construye línea base temporal |
| Vigila Bluesky/Mastodon/Telegram público | Vigilar la RED DONDE SE COORDINA LA GENTE (X/WhatsApp/Telegram árabe) | La red real de movilización es inaccesible con el diseño actual |

### Definición de lo que debería SER (criterios de aceptación del rediseño)

1. **Basado en hipótesis, no en volumen.** Cada caso parte de UNA pregunta concreta
   ("¿hubo pico de tráfico previo a un cruce?"), con variables medibles y umbrales.
2. **Verifica o desmiente.** Ninguna afirmación sale como "no verificado" vacío: cada hallazgo
   tiene afirmación + fuente + evidencia + estado (verdadera/falsa/engañosa/no verificable),
   y el sistema intenta contrastar antes de publicar.
3. **Mide el tiempo.** Construye línea base de tráfico POR CANAL y POR HORA desde el despliegue,
   y dispara alerta cuando el volumen se desvía de la línea base (no "repetición", sino pico).
4. **Alcance honesto de fuentes.** Declara explícitamente qué redes cubre y cuáles no
   (X/WhatsApp no accesibles): la caja no pretende cubrir lo que no puede.
5. **Sin fraude.** No expone datos no verificados como públicos por defecto; lo sensato
   (casos, evidencia) queda restringido al propietario autenticado (ya logrado con login).

### Tareas del sprint (orden de prioridad)

| # | Tarea | Entregable / Aceptación |
|---|---|---|
| V1 | Definir el motor de hipótesis | Un caso se crea SOLO con una pregunta + variables + umbrales, no por volumen de menciones |
| V2 | Pipeline de verificación | Cada hallazgo pasa por contraste de fuentes y se clasifica (Sin se puede verificar → queda interno, no en informe público) |
| V3 | Línea base temporal por canal | Tabla canal→mensajes/hora desde despliegue; alerta cuando pico > N desviaciones de la media |
| V4 | Panel de cobertura de fuentes | Mostrar qué redes SÍ (Telegram público, Bluesky, Mastodon, RSS) y NO (X, WhatsApp) se vigilan |
| V5 | Régimen de acceso por defecto | Datos de investigación NO públicos por defecto; solo visibles tras login del propietario (ya logrado) |
| V6 | Retirar el mierdón irrelevante | Limpiar "no verificado" vacío y visuales sin métrica de los informes y la UI |

### NOTA (verdad asumida)

La app actual consume poco (≈72 MB RAM, 0.4% CPU) pero no produce nada útil: el problema
no es de máquina, es de propósito. Este sprint no es "añadir más fuentes", es **cambiar de
paradigma: de contador de menciones a investigador que verifica y mide el tiempo**.
