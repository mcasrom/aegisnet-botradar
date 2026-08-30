# MANUAL DE OPERACIÓN Y GESTIÓN OPERATIVA
## AegisNet-BotRadar: Plataforma Pericial OSINT para Detección y Mitigación de Comportamiento Inauténtico Coordinado (CIB)
**Versión del Manual:** 2.0 (Edición Pericial para Equipos e Investigadores OSINT)  
**Clasificación:** Protocolo de Fuentes Abiertas / Distribución Técnica  
**Autoría y Arquitectura:** M. Castillo — Contacto: `aegis.info@viajeinteligencia.com`  

---

## 1. INTRODUCCIÓN Y ALCANCE OPERATIVO

### 1.1. Propósito de la Plataforma
AegisNet-BotRadar es una estación de trabajo pericial de fuentes abiertas diseñada para:
1. Detectar, aislar y caracterizar cuantitativamente campañas de **Comportamiento Inauténtico Coordinado (CIB)** y astroturfing en redes digitales (X/Twitter, Telegram, Meta, YouTube).
2. Proporcionar telemetría forense con resolución de milisegundos (referenciada a reloj atómico NTP Stratum 1).
3. Generar evidencias periciales admisibles en sede judicial y ante equipos de integridad de plataformas conforme al estándar internacional **ISO/IEC 27037**.
4. Articular una **Línea de Acción Operativa** inmediata (takedowns, desmentidos basados en Open Data y judicialización).

### 1.2. Principio Rector de Atribución (Regla de Oro Pericial)
```
[HECHO PERICIAL PROBADO]  -->  [INFERENCIA TÉCNICA PROBABILÍSTICA]  -->  [LÍMITE EPISTÉMICO INFRANQUEABLE]
```
- **Hecho probado:** Nodos conectados a través de `AS48282` (Selectel VPS, San Petersburgo) o `AS36903` (Maroc Telecom 4G).
- **Inferencia técnica:** Los operadores de la campaña utilizan servicios de alojamiento en el extranjero y pasarelas móviles para ocultar su identidad real y eludir filtros geográficos.
- **Límite epistémico:** **Bajo ninguna circunstancia el analista OSINT debe imputar la autoría a gobiernos extranjeros (Kremlin, Rabat, etc.)**, dado que cualquier actor privado, corporativo o cibercriminal puede alquilar dichos VPS y proxys residenciales con medios de pago anónimos. La atribución estatal requiere mandamientos judiciales o inteligencia de señales (SIGINT).

---

## 2. FLUJO DE TRABAJO OPERATIVO (WORKFLOW PASO A PASO)

```
[1. INGESTA CLI/DATASET] 
         ↓
[2. SELLADO SHA-256 (WORM)] 
         ↓
[3. CÁLCULO CIB MULTIDIMENSIONAL] 
         ↓
[4. TRIANGULACIÓN FORENSE (Topología, NTP, pHash, Cuentas Zombi)] 
         ↓
[5. LÍNEA DE ACCIÓN (Takedown Trust & Safety + Desmentido Open Data + Dossier Legal)]
```

### Paso 1: Ingesta de Datos Reales de Campo
La plataforma procesa datos reales mediante dos vías sin exfiltrar información fuera de la máquina local:

#### Opción A: Extracción con herramientas CLI de código abierto
1. **Telegram (canales y grupos públicos):**
```python
from telethon.sync import TelegramClient
import json

client = TelegramClient('osint_session', API_ID, API_HASH).start()
messages = client.get_messages('CanalAlertaPublica', limit=200)
records = [{
    'handle': m.sender.username or f'tg_{m.sender_id}',
    'text': m.text,
    'timestamp': m.date.isoformat(),
    'platform': 'telegram',
    'followers': 10000,
    'following': 2
} for m in messages if m.text]

with open('dataset_telegram.json', 'w') as f:
    json.dump(records, f, indent=2)
```

2. **X / Twitter (búsqueda avanzada sin API keys comerciales):**
```bash
snscrape --jsonl --max-results 500 twitter-search "#HashtagInvestigado since:2026-08-01" | \
jq -s '[.[] | {
  handle: ("@" + .user.username),
  text: .rawContent,
  timestamp: .date,
  platform: "x_twitter",
  followers: .user.followersCount,
  following: .user.friendsCount
}]' > dataset_x.json
```

#### Opción B: Carga directa en la aplicación
1. Haz clic en el botón superior **"Ingesta OSINT"**.
2. Arrastra o selecciona tu archivo `.json` o `.csv`, o pega directamente el texto.
3. Haz clic en **"Procesar Dataset e Iniciar Auditoría"**.
4. El motor local calculará al vuelo:
   - Coeficientes de similitud Jaccard.
   - Micro-ráfagas temporales (< 15 segundos entre publicaciones idénticas).
   - Nodos, aristas dirigidas y métricas de centralidad.

---

### Paso 2: Preservación Criptográfica y Cadena de Custodia (ISO/IEC 27037)
1. Antes de publicar cualquier alerta, verifica el **Hash SHA-256** del dataset bruto.
2. Comprueba que las marcas de tiempo estén sincronizadas con reloj **NTP Stratum 1** (con incertidumbre inferior a $\pm 0.05\text{s}$).
3. Guarda una copia local del dataset en medio de almacenamiento WORM (Write Once, Read Many).

---

### Paso 3: Triangulación y Análisis de los 4 Vectores Forenses

#### Vector 1: Topología de Red y D3 Interactive Graph
- **Comunidades Louvain:** Identifica si la red está fragmentada en células aisladas de ataque.
- **Grado de Entrada (*In-Degree*) y Salida (*Out-Degree*):** Localiza nodos semilla orquestadores (alta emisión y baja recepción de interacciones).
- **Métricas de Intermediación (*Betweenness Centrality*):** Identifica puentes (*bridge nodes*) que actúan como pasarelas entre la granja de bots y perfiles de usuarios reales.

#### Vector 2: Telemetría Temporal de Micro-Ráfagas
- **Filtro de Jitter Submétrico:** Las publicaciones humanas presentan variabilidad temporal amplia ($> 3.5\text{s}$).
- **Descarte Fisiológico:** Si 20 o más cuentas publican textos coordinados con desviaciones inferiores a $0.35\text{s}$, **se descarta matemáticamente la digitación humana**. Se trata de scripts automáticos (Python/Node.js o extensiones headless de navegador).

#### Vector 3: Análisis Semántico y Cotejo Audiovisual (pHash DCT)
- **Matriz de Jaccard y Levenshtein:** Identifica variaciones mínimas introducidas para evadir filtros automáticos de spam (ej. puntuación alterna, sinónimos forzados o emojis aleatorios).
- **Peritaje Audiovisual con pHash:** 
  - Compara el hash perceptual del vídeo o imagen sospechosa con repositorios históricos (hemerotecas, YouTube, RTVE, EFE).
  - Si la distancia de Hamming es $\le 3$ (coincidencia $\ge 95\%$), queda probado que se trata de **material reciclado descontextualizado**.

#### Vector 4: Auditoría de Cuentas Zombi e Infraestructura
- **Identificadores Numéricos Inmutables:** Los operadores de bots suelen cambiar el `@handle` para borrar el rastro. El identificador numérico de plataforma (`id_str`) es inmutable y debe constar en todo informe pericial.
- **Patrón Zombi:** Cuenta creada en 2017 en idioma extranjero (ej. indonesio o turco), inactiva durante 8 años y reactivada súbitamente en 2026 para difundir mensajes políticos locales.

---

### Paso 4: Ejecución de la Línea de Acción Operativa

Accede a la pestaña **"Línea de Acción OSINT"** en la barra superior. El protocolo consta de 5 fases ejecutables:

1. **Fase 1: Preservación WORM:** Validación del hash SHA-256 y calibración horaria.
2. **Fase 2: Triangulación Topológica:** Listado de identificadores inmutables de los nodos y delimitación de IPs BGP.
3. **Fase 3: Notificación de Takedown a Trust & Safety:**
   - Haz clic en **"Copiar Solicitud Formal"**.
   - El sistema genera un documento estructurado listo para remitir a los canales de abuso:
     - X/Twitter: `https://help.twitter.com/forms/platform-manipulation`
     - Telegram Abuse: `abuse@telegram.org` / `@notoscam`
     - Meta Integrity: Formulario de denuncia CIB institucional.
4. **Fase 4: Desmentido en Fuentes Abiertas (Open OSINT):**
   - Descarga el CSV de telemetría y el grafo GEXF.
   - Facilítalo a medios de verificación (Maldita, Newtral, EFE Verifica, EU DisinfoLab) para auditoría independiente.
   - Publica la comparativa visual pHash desmontando el origen temporal de la foto o vídeo.
5. **Fase 5: Formalización Judicial:**
   - Haz clic en **"Dossier Pericial (5 Págs PDF)"**.
   - El documento incluye resumen ejecutivo, matriz de confianza de 7 dimensiones, metodología matemática auditada, telemetría completa y listado de los 36 nodos con sellado SHA-256.

---

## 3. GESTIÓN, CALIBRACIÓN Y ADMINISTRACIÓN DEL MODELO

### 3.1. Fórmula Ponderada del Score CIB
El índice global de Comportamiento Inauténtico Coordinado se rige por:
$$\text{Score CIB} = (0.30 \cdot S_{\text{topológico}}) + (0.30 \cdot S_{\text{temporal}}) + (0.25 \cdot S_{\text{semántico}}) + (0.15 \cdot S_{\text{metadatos}})$$

Donde:
* **$S_{\text{topológico}}$:** Ratio Hub-and-Spoke, clustering deficitario y densidad de amplificación unidireccional.
* **$S_{\text{temporal}}$:** Frecuencia de micro-ráfagas ($< 15\text{s}$) y dispersión de jitter ($< 0.35\text{s}$).
* **$S_{\text{semántico}}$:** Similitud léxica Jaccard ($> 0.70$) y reciclaje multimedia pHash ($> 90\%$).
* **$S_{\text{metadatos}}$:** Anomalías zombi, ratio seguidores/seguidos ($< 0.01$), clientes de posting sospechosos y geolocalización en datacenters VPS.

### 3.2. Calibración de Umbrales de Alerta
| Rango CIB | Clasificación | Acción Operativa Recomendada |
| :--- | :--- | :--- |
| **0 – 34%** | **Orgánico / Discurso Ciudadano** | No intervenir. Respetar libertad de expresión. No remitir denuncias. |
| **35 – 64%** | **Anómalo / Sospechoso** | Monitoreo pasivo reforzado. Rastrear si la amplificación se coordina en canales privados. |
| **65 – 79%** | **Coordinación Inauténtica Probable** | Alerta interna y preparación de dataset para verificación cruzada. |
| **80 – 100%** | **CIB Crítico / Ataque Automatizado** | Ejecución inmediata de la Línea de Acción: Takedown, Open Data y Peritaje. |

### 3.3. Prevención de Falsos Positivos en Manifestaciones o Eventos Cívicos
En eventos reales (manifestaciones, partidos, conciertos), miles de usuarios legítimos publican con el mismo hashtag al mismo tiempo. Para no catalogar a ciudadanos como bots:
1. **Verificar el Cron-Jitter:** Los humanos tienen un jitter heterogéneo ($1\text{s} - 45\text{s}$). Los bots presentan sincronía mecánica ($< 0.35\text{s}$).
2. **Diversidad Léxica:** Los humanos redactan con variaciones morfológicas y errores tipográficos espontáneos. Las granjas de bots repiten bloques exactos o permutaciones programadas.
3. **Historial de la Cuenta:** Comprobar si las cuentas tienen interacciones previas variadas a lo largo de meses o si carecen por completo de actividad orgánica.

---

## 4. SEGURIDAD OPERACIONAL (OPSEC) PARA EL INVESTIGADOR

1. **Aislamiento de Entorno:** Emplea navegadores limpios o máquinas virtuales dedicadas (Whonix, Tails o contenedores Docker aislados) para recolectar datos de canales hostiles.
2. **Cuentas Sock Puppet:** No utilices perfiles personales para monitorizar canales de Telegram o foros donde se gestan las campañas.
3. **No Tocar la Infraestructura Adversaria:** Nunca lances peticiones activas, escaneos de puertos o intentos de acceso a los servidores VPS identificados (`AS48282`). Toda la telemetría debe obtenerse de forma pasiva mediante registros BGP, certificados SSL históricos y fuentes abiertas (Shodan, Censys, Hurricane Electric BGP).
4. **Preservación Inalterable:** Nunca modifiques manualmente un archivo CSV o JSON original. Trabaja siempre sobre copias de lectura y mantén intacto el hash SHA-256 del archivo primario.

---

## 5. CONTACTO Y ASISTENCIA TÉCNICA
Para consultas metodológicas, auditorías conjuntas de campañas o aportación de nuevos conectores OSINT:
* **Director de Arquitectura y Análisis:** M. Castillo
* **Correo Electrónico de Contacto Pericial:** `aegis.info@viajeinteligencia.com`
* **Licencia de Uso:** Protocolo de Fuentes Abiertas para Fines de Investigación, Verificación Periodística y Defensa de la Integridad Democrática.
