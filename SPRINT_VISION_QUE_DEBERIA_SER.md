
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
