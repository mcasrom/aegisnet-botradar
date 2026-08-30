# HOJA DE RUTA — Reconfiguración de AegisNet-BotRadar como herramienta OSINT real, honesta y viable

**Fecha:** 30/08/2026
**Producto:** AegisNet-BotRadar → plataforma de trabajo forense OSINT alimentada con **datos
reales**, sin fakes, placeholders ni maquillaje.
**Base del análisis:** `EVALUACION_aegisnet_botradar.md` (mismo repo).
**Estado de partida:** frontend React que compila (bundle 923KB→283KB gzip), motor CIB real,
pero con datasets sintéticos "benchmark", generador de expedientes ficticio, mapa ilustrativo
tosco, Gemini declarado sin implementar, y score CIB simplificado en cliente.

---

## 1. PRINCIPIOS RECTORES (no negociables)

1. **Ningún dato de ejemplo se presenta como evidencia.** Todo dato de demostración queda
   aislado en un "modo demo" con banner persistente y sin contacto con el flujo forense.
2. **Todo hallazgo sale de datos de campo recolectados reales**, con rastro auditable
   (fuente, timestamp, hash SHA-256 del dataset bruto).
3. **Apartidista**: se evalúan patrones técnicos de coordinación, nunca se imputa autoría
   estatal sin mandamiento (se mantiene el límite epistémico del manual).
4. **Lo que no existe no se declara**: se elimina la promesa Gemini sin código.
5. **Reutilizar lo real del ecosistema**: el pipeline `oasis.py` del servidor (Hetzner) ya
   recolecta datos reales de Telegram/verificadores con cron — es la fuente primaria.

---

## 2. ARQUITECTURA OBJETIVO

```
[oasis.py pipeline en Hetzner]  →  DATOS reales (estado.json, señales, datasets crudos)
        │  (cron 12h, ya existente)
        ▼
[Backend AegisNet API (Node/Express o reutilizar Python, en server)]
        ├─ Sirve datasets reales sellados (SHA-256 manifesto)
        ├─ Calcula score CIB con el motor (server-side)
        └─ Endpoints: /campaigns, /campaign/:id, /datasets, /chain-of-custody
        ▼
[Frontend AegisNet (React, el actual adaptado)]
        ├─ Vista de panel sobre campañas reales
        ├─ Grafo D3, temporal, NLP, reporte PDF (ya existen)
        └─ Modo demo aislado (opcional) con banner persistente
```

Despliegue: estático + API en el mismo vhost Hetzner (nginx), naranja en Cloudflare, igual que
`libro-colaborativo`.

---

## 3. FASES Y TAREAS

### FASE 1 — "Hacerlo real": backend + datos de campo (Sprint, ~1 semana)

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| 1.1 | **Eliminar/aislar los fakes** | Retirar los 3 botones "benchmark datasets" del flujo principal y el generador sintético del flujo rápido. Moverlos a un componente "Modo demo" con banner persistente "DATOS DE EJEMPLO — no son evidencia". | Sin datos sintéticos alcanzables en el flujo forense; modo demo claramente señalado |
| 1.2 | **Endpoints de campaña** | API que lea los outputs reales de `oasis.py` (`DATOS/estado.json`, `DATOS/oasis_senales_*.json`) y los exponga como campañas de investigación con nodos/aristas derivados de señales y fuentes reales. | UI muestra campañas reales del último ciclo (no inventadas) |
| 1.3 | **Ingesta real server-side** | Definir contrato JSON de ingesta (mismo formato que procesa hoy la app: handle, text, timestamp, platform, followers, following) y un conector que alimente el backend desde Telegram público (t.me/s, como ya hace oasis) y X vía snscrape/X API. | Un dataset importado de un canal real se procesa con cadena completa |
| 1.4 | **Test end-to-end honesto** | Probar con datos reales de Ceuta/elecciones ya en el server. | Demostración real reproducible en staging antes de tocar producción |

### FASE 2 — "Hacerlo auditable": cadena de custodia y score real (Sprint, ~1 semana)

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| 2.1 | **Sellado SHA-256 real** | Al importar cualquier dataset, calcular SHA-256 server-side, guardarlo en un manifiesto y mostrarlo en el reporte. | Cada campaña muestra su hash del dataset bruto; el PDF lo incluye |
| 2.2 | **Score CIB server-side** | Reemplazar la heurística actual de cliente (`cibScore:40` + incrementos) por el motor real (`cibEngine.ts`) ejecutado sobre los datos importados, con desglose topológico/temporal/semántico/metadatos. | El score mostrado coincide con un recálculo independiente |
| 2.3 | **Metadatos y cadena** | Persistir por nodo: id_str inmutable, creada/edad, ratio seguidores/seguidos, clientes, geolocalización VPS (ASN). Los datos ausentes se marcan como "no verificados" (nunca se inventan). | Campo ausente = "no disponible", jamás valor fabricado |
| 2.4 | **Verificación de umbrales** | Validar los umbrales CIB (0-34 orgánico / 35-64 anómalo / 65-79 probable / 80-100 crítico) contra datasets reales históricos para medir falsos positivos/negativos. | Documento de calibración con tasas medidas |

### FASE 3 — "Pulido honesto": mapa, Gemini y documentación (Sprint, ~3-4 días)

| # | Tarea | Detalle | Criterio de aceptación |
|---|---|---|---|
| 3.1 | **Mapa real** | Sustituir el SVG ilustrativo por capas geoespaciales reales (TopoJSON/GeoJSON mundial) o retirar el módulo si no aporta valor con datos reales (las señales suelen carecer de geo). | Decisión documentada; si se mantiene, los marcadores solo provienen de datos verificados |
| 3.2 | **Gemini** | Decidir: eliminar `metadata.json` la claim `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` y la dependencia `@google/genai`, o implementarla de verdad (resumen ejecutivo asistido por IA de campañas reales). | Si no se implementa, nada menciona Gemini. Si se implementa, solo sobre datos reales |
| 3.3 | **Documentación honesta** | Actualizar `README.md` y `MANUAL_OPERACION_GESTION_OSINT.md` con la arquitectura real, el modo demo, los límites conocidos y la cadena de custodia. | Documentación refleja exactamente lo que el código hace |
| 3.4 | **Deploy + SEGUIMIENTO** | Desplegar en Hetzner (vhost propio, naranja CF, cert), verificar edge, añadir a WAYAHEAD y bitácora. | Edge 200 con datos reales; registro en bitácora |

---

## 4. SINERGIAS CON EL ECOSISTEMA EXISTENTE

| Componente | Rol en la reconfiguración |
|---|---|
| `oasis.py` (server) | Fuente primaria de datos reales; se integran sus outputs al backend AegisNet |
| `libro-colaborativo` | Consume los mismos hallazgos para narrativa/casos; AegisNet es el panel forense anexo |
| Bloqueo de bots nginx | Aplicable al vhost AegisNet |
| Cloudflare naranja + cert | Misma plantilla de despliegue que libro-colaborativo |

## 5. DEFINICIÓN DE "HECHO" (verificable)

- `grep` del repo no encuentra datos sintéticos en el flujo forense (solo en modo demo).
- Ningún módulo declara capacidades sin implementar (Gemini fuera, salvo que se haga).
- Un dataset real importado produce campaña + hash + score reproducible en staging.
- La documentación del repo se ajusta 1:1 al comportamiento real.

## 6. NOTAS DE SINCRONIZACIÓN

- Documento v1: este mismo archivo (repo aegisnet-botradar).
- Referencia en WAYAHEAD.md (server): entrada del sprint de reconfiguración con enlace.
- Bitácora local `SEGUIMIENTO.md`: estado por sprint al cierre.
- Cada fase termina con commit+pull-push y verificación en el destino correspondiente.

*Hoja de ruta sin maquillaje, conforme a los criterios del proyecto.*