# HOJA DE RUTA — Sprint v1.1 (post-v1.0.0)

**Fecha:** 30/08/2026
**Estado previo:** v1.0.0 desplegado en produccion (https://aegis.viajeinteligencia.com), release en GitHub,
seguro de vida completo (repo + datos reales en democracia-bajo-asalto). Tareas 3.2/3.3/3.4 de la
hoja de ruta original cerradas.

---

## Objetivo del sprint

Convertir AegisNet de "panel que consume datos del pipeline" a **herramienta de analisis autonoma**:
mapa real, profundidad de analisis por nodo, y madurez SEO/observabilidad.

---

## FASE A — Mapa georreferenciado (cierra la 3.1 pendiente)

| # | Tarea | Detalle | Criterio de aceptacion |
|---|---|---|---|
| A1 | **Decidir mantener/retirar Geo** | Las senales del pipeline raramente traen geo. Evaluar: (a) TopoJSON/GeoJSON mundial con marcadores solo cuando el nodo tiene geoOrigin verificado, o (b) retirar la tab Geo y sustituir por "vista de entidades/region" derivada de entidad_region. | Decision documentada en README |
| A2 | **Geo honesta** | Si se mantiene: cargar mapa base (TopoJSON desde CDN o bundle), marcadores SOLO con datos verificados (nunca inventar lat/lng), tooltip con fuente. Si no: sustituir por tarjeta de region/entidad con la campana real. | Ningun marcador sin dato verificado; sin fakes |
| A3 | **Entidad_region en UI** | Exponer `entidad_region` (Espana, LatAm, etc.) del caso/pipeline como vista alternativa al mapa. | La region del caso Ceuta y las campañas se ve de forma honesta |

## FASE B — Profundidad de analisis (valor real)

| # | Tarea | Detalle | Criterio de aceptacion |
|---|---|---|---|
| B1 | **Calibracion de umbrales CIB** | Medir falsos positivos/negativos de los umbrales (0-34/35-64/65-79/80-100) contra los 16 dias de datos reales acumulados. Documentar tasas. | Documento de calibracion con tasas medidas |
| B2 | **Detalle por nodo ampliado** | NodeInspectorModal: anadir post-samples reales del nodo (texto, timestamp, hash), ratio duplicados, y vinculo al hallazgo HECHO/HIPOTESIS/PREGUNTA que lo origina. | Cada nodo del caso real muestra su sustento documental |
| B3 | **Vista comparativa de campanas** | Selector que compare scores CIB (topo/temp/sem/meta) de varias campanas en una tabla/radar. | Comparacion visual honesta entre caso real y pipeline |

## FASE C — Madurez SEO/observabilidad

| # | Tarea | Detalle | Criterio de aceptacion |
|---|---|---|---|
| C1 | **sitemap + robots** | Ya creados (public/sitemap.xml, public/robots.txt). Verificar despliegue y envio a Search Console. | /sitemap.xml y /robots.txt 200 en produccion |
| C2 | **meta dinamicas por campana** | Cuando se selecciona una campana, actualizar document.title + og:title con el nombre de la campana (historia de SPA). | El titulo del panel refleja la campana activa |
| C3 | **healthcheck + monitorizacion** | Cron que haga curl a /api/health y /api/campaigns cada 5 min y alerte (p. ej. al mismo healthcheck.sh que usan otros vhosts). | Alerta si el backend cae o DATOS stale > 24h |
| C4 | **Uptime Kuma / status** | El server ya tiene uptime-kuma y status.viajeinteligencia.com. Anadir monitor HTTPS de aegis. | Monitor activo en uptime-kuma |

---

## Definicion de "hecho" (verificable)

- `grep` sin fakes geo; decision de A1 documentada.
- NodeInspectorModal muestra post-samples reales del caso.
- /sitemap.xml + /robots.txt 200; titulo dinamico por campana.
- healthcheck cron activo con alerta; monitor en uptime-kuma.
- Commit + push + bitacora al cierre.

## Notas de sincronizacion

- Los datos siguen actualizandose solos: cron oasis.py cada 12h (17 */12) + git commit/push automatico;
  AegisNet lee DATOS en cada request (sin cache) — NO necesita cron propio.
- pm2 aegisnet-api es systemd-enabled (persiste tras reboot).
- Referencia: HOJA_DE_RUTA_RECONFIGURACION.md (v1, sprint anterior), WAYAHEAD.md (server).
