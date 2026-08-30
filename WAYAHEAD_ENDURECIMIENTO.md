# WAYAHEAD — Endurecimiento de AegisNet-BotRadar (v1.1 → sólido/duro)

**Fecha:** 30/08/2026
**Objetivo:** convertir el proyecto de "funciona" a "sólido y duro": que no dependa de
que alguien esté mirando, que avise cuando algo falla, y que no mienta nunca.

---

## ESTADO ACTUAL (verificado)

- Backend pm2 `aegisnet-api` online (v1.1.0), health OK, 17 campañas, caso Ceuta 20 hallazgos.
- Datos auto-actualizables: cron `oasis.py` cada 12h (git commit+push) + captura de casos cada 6h.
- Frontend en producción (bundle nuevo), Cloudflare naranja + SSL.
- **DEBILIDADES**: sin healthcheck, sin alerta de datos stale, sin monitor externo, sin tests.

---

## FASE A — Observabilidad (que avise solo cuando algo falla)

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| A1 | **Healthcheck cron** | Cron cada 5 min que haga curl a `/api/health` y `/api/campaigns`; si falla o devuelve no-OK, escribe a un log y envia alerta (mismo patron que otros vhosts del server). | Cron activo; log de healthcheck; alerta configurada |
| A2 | **Alerta de datos stale** | El healthcheck debe detectar si `fechaSenales` tiene >36h (pipeline muerto) y marcarlo como ALERTA, aunque el API responda 200. | Detecta pipeline stale y lo separa de "API caida" |
| A3 | **Monitor en uptime-kuma** | El server ya tiene uptime-kuma. Anadir monitor HTTPS de `https://aegis.viajeinteligencia.com/api/health` con intervalo 5min. | Monitor activo en uptime-kuma |
| A4 | **Semaforo ya visible** | SystemHealthPanel (UI) ya muestra Panel/API/DATOS/Pipeline en verde/ambar/rojo. | Verificado en produccion |

## FASE B — Tests y reproducibilidad

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| B1 | **Test del backend** | Test automatizado que importe `server.js` como modulo (ya tiene guard de test), cargue un fixture de DATOS y verifique que `buildCampaign`/`buildCaseCampaign` producen nodos/edges/CIB validos. | `node --test` (o npm test) pasa |
| B2 | **package-lock versionado** | Confirmar que el server puede hacer `npm ci` limpio (ya versionado tras el fix). | `npm ci` desde 0 OK |
| B3 | **Verificacion de integridad** | Script que compare SHA-256 del caso en repo local vs server vs lo servido por API. | Hashes coinciden |

## FASE C — Robusteza del backend

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| C1 | **Resiliencia a DATOS ausentes** | Verificar que si `estado.json` falta o esta corrupto, el API responde 503/500 con mensaje claro (no crash ni datos falsos). | API no crashea con datos ausentes |
| C2 | **Rate limiting / proteccion** | Cloudflare ya protege; revisar que `/api/*` no exponga rutas sensibles y que el challenge anti-bot no rompa la UX (pendiente regla de CF para privada). | /api/* funciona en navegador normal y privada |
| C3 | **Error handling en frontend** | Si el API devuelve 5xx, mostrar mensaje claro en la UI (no pantalla rota). | ErrorBoundary + mensaje |

## FASE D — Documentacion y release

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| D1 | **Release v1.1.0** | Tag + release en GitHub marcando el estado endurecido. | Release publicado |
| D2 | **WAYAHEAD en repo del server** | Añadir entrada en `/home/deploy/democracia-bajo-asalto/WAYAHEAD.md` (el que sigue el server). | Entrada documentada |

---

## DEFINICION DE "HECHO" (verificable)

- `crontab -l` muestra el healthcheck de aegis; el log tiene entradas recientes.
- Una simulacion de pipeline stale (fecha vieja) dispara alerta en el healthcheck.
- Monitor de uptime-kuma activo para aegis.
- `npm test` pasa con fixtures.
- Release v1.1.0 publicado.

## NOTA DE HONESTIDAD

Ninguna de estas tareas inventa datos ni maquilla: son protecciones para que el sistema
siga siendo honesto cuando algo falla (avisa en vez de mentir). El objetivo es que un
fallo se detecte en minutos, no en dias.
