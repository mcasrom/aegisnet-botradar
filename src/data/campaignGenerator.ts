/**
 * AegisNet-BotRadar: Generador Dinámico de Expedientes e Ingesta de Temas
 * Permite a analistas y usuarios introducir cualquier temática, proceso electoral o evento crítico
 * para someterlo al pipeline forense CIB (Topología, Jitter Temporal, Astroturfing y Geopolítica).
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import {
  InvestigationCampaign,
  SocialAccountNode,
  NetworkEdge,
  PlatformType,
  AstroturfCluster,
  GeopoliticalVector
} from '../types/botradar';
import { computeComprehensiveCIBScore } from '../services/cibEngine';

export interface CreateTopicParams {
  title: string;
  context: string;
  keywords: string[];
  platforms: PlatformType[];
  geofence?: string;
  eventsCount?: number;
}

/**
 * Genera un expediente de investigación forense completo a partir de un tema introducido por el usuario.
 */
export function generateCampaignFromTopic(params: CreateTopicParams): InvestigationCampaign {
  const cleanTitle = params.title.trim() || 'Monitoreo de Desinformación y Astroturfing';
  const cleanContext = params.context.trim() || 'Proceso Social & Monitoreo de Redes';
  const rawKeywords = params.keywords.length > 0
    ? params.keywords
    : ['#AlertaUrgente', 'fraude', 'filtración', 'colapso'];
  const primaryTag = rawKeywords[0].startsWith('#') ? rawKeywords[0] : `#${rawKeywords[0]}`;
  const secondaryTag = rawKeywords[1] ? (rawKeywords[1].startsWith('#') ? rawKeywords[1] : `#${rawKeywords[1]}`) : '#AlertaCiudadana';
  const primaryPlatform = params.platforms[0] || 'x_twitter';
  const secondaryPlatform = params.platforms[1] || 'telegram';

  const campaignId = `camp_user_${Date.now()}`;
  const invCode = `AEGIS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  const nodes: SocialAccountNode[] = [];
  const edges: NetworkEdge[] = [];

  // 1. Coordinador Semilla Principal
  const seedId1 = `coord_seed_${Date.now()}_1`;
  nodes.push({
    id: seedId1,
    handle: `@${primaryTag.replace(/[^a-zA-Z0-9_]/g, '')}_CanalOficial`,
    platform: secondaryPlatform,
    displayName: `Difusión Central ${cleanTitle.slice(0, 22)}`,
    type: 'coordinator',
    cibScore: 94,
    creationDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    accountAgeDays: 14,
    followersCount: 28500,
    followingCount: 4,
    followerFollowingRatio: 7125,
    totalPosts: 1240,
    postsPerDay: 88,
    louvainCommunity: 1,
    centrality: {
      degree: 26,
      betweenness: 0.92,
      pageRank: 0.28,
      clusteringCoefficient: 0.02
    },
    temporalMetrics: {
      medianIntervalSeconds: 28.0,
      intervalJitterSeconds: 0.22,
      burstCount: 36,
      nightActivityRatio: 0.54
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.93,
      sentimentPolarizationIndex: 0.95,
      topHashTags: [primaryTag, secondaryTag, '#Urgente'],
      samplePosts: [
        {
          id: `post_seed_1`,
          timestamp: now,
          text: `ALERTA URGENTE: Confirmada situación crítica en ${cleanTitle}. Ocultación deliberada por canales oficiales. Difundir antes de que lo borren. ${primaryTag} ${secondaryTag}`,
          isExactDuplicate: true,
          sharesOrRetweets: 3840
        }
      ]
    },
    geoOrigin: {
      country: 'Nodo Proxy ASN48282',
      city: 'Servidor Egress Anónimo',
      asn: 'AS48282-DEDICATED',
      isVpnOrProxy: true,
      lat: 52.3676,
      lng: 4.9041
    },
    zombieAudit: {
      immutableUserId: `198204918204${Date.now().toString().slice(-4)}`,
      isZombieAccount: true,
      previousHandles: [
        {
          handle: `@airdrop_giveaway_${primaryTag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
          detectedRange: '2022-03 a 2025-10',
          language: 'Inglés / Turco',
          topic: 'Criptomonedas y enlaces de referidos'
        }
      ],
      dormancyPeriodDays: 165,
      repurposedDate: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10),
      marketEvidenceNote: 'Cuenta reactivada tras 165 días de inactividad; cambio radical de idioma a español y purga de posts antiguos.',
      ja3TlsHash: 'e7d705a3286e19ea42f587b344ee6865 (Python/aiohttp)',
      deviceEntropy: 'VPS Linux Server / Software Mesa GL'
    }
  });

  // 2. Coordinador Secundario
  const seedId2 = `coord_seed_${Date.now()}_2`;
  nodes.push({
    id: seedId2,
    handle: `@Alerta_${primaryTag.replace(/[^a-zA-Z0-9_]/g, '')}_24h`,
    platform: primaryPlatform,
    displayName: `Monitor En Directo 24h`,
    type: 'coordinator',
    cibScore: 91,
    creationDate: new Date(Date.now() - 9 * 86400000).toISOString(),
    accountAgeDays: 9,
    followersCount: 14200,
    followingCount: 8,
    followerFollowingRatio: 1775,
    totalPosts: 1890,
    postsPerDay: 210,
    louvainCommunity: 1,
    centrality: {
      degree: 22,
      betweenness: 0.85,
      pageRank: 0.24,
      clusteringCoefficient: 0.03
    },
    temporalMetrics: {
      medianIntervalSeconds: 30.0,
      intervalJitterSeconds: 0.25,
      burstCount: 29,
      nightActivityRatio: 0.49
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.91,
      sentimentPolarizationIndex: 0.92,
      topHashTags: [primaryTag, '#AlertaMaxima'],
      samplePosts: [
        {
          id: `post_seed_2`,
          timestamp: now,
          text: `IMPACTANTE: Imágenes exclusivas sobre ${cleanTitle}. Las autoridades ocultan el alcance de lo sucedido. ${primaryTag}`,
          isExactDuplicate: true,
          sharesOrRetweets: 2190
        }
      ]
    },
    geoOrigin: {
      country: 'Proxy Residencial ASN39647',
      city: 'Nodo Rotativo',
      asn: 'AS39647-RESIDENTIAL',
      isVpnOrProxy: true,
      lat: 38.7223,
      lng: -9.1393
    },
    zombieAudit: {
      immutableUserId: `140928104819${Date.now().toString().slice(-4)}`,
      isZombieAccount: true,
      previousHandles: [
        {
          handle: '@gaming_skins_zone_eu',
          detectedRange: '2023-01 a 2026-01',
          language: 'Ruso / Inglés',
          topic: 'Comunidad de gaming y trading'
        }
      ],
      dormancyPeriodDays: 94,
      repurposedDate: new Date(Date.now() - 9 * 86400000).toISOString().slice(0, 10),
      marketEvidenceNote: 'Adquirida en foro clandestino para reutilización masiva de amplificación.',
      ja3TlsHash: '6734f37431670b3ab4292b8f60f29984 (Selenium/Undetected)',
      deviceEntropy: 'Emulador Headless Chromium con canvas simulado'
    }
  });

  // 3. Enjambre de 20 Bots Amplificadores con Zero-Jitter
  const botPrefixes = ['Centinela', 'Vanguardia', 'Patrulla', 'Foco', 'Alerta', 'Defensa', 'Radar', 'Eco', 'Iberia', 'Pulso'];
  for (let i = 1; i <= 20; i++) {
    const prefix = botPrefixes[i % botPrefixes.length];
    const botId = `bot_gen_${Date.now()}_${i}`;
    const jitter = Number((0.14 + (i * 0.03) % 0.22).toFixed(2));
    const isPrimary = i % 2 === 0;

    nodes.push({
      id: botId,
      handle: `@${prefix}_${cleanTitle.slice(0, 4)}_${i < 10 ? '0' + i : i}`,
      platform: isPrimary ? primaryPlatform : secondaryPlatform,
      displayName: `${prefix} Informativa ${i}`,
      type: 'bot',
      cibScore: 88 + (i % 8),
      creationDate: new Date(Date.now() - 5 * 86400000).toISOString(),
      accountAgeDays: 5,
      followersCount: 2 + (i % 4),
      followingCount: 1800 + i * 35,
      followerFollowingRatio: 0.0012,
      totalPosts: 450 + i * 40,
      postsPerDay: 90,
      louvainCommunity: 1,
      centrality: {
        degree: 3,
        betweenness: 0.005,
        pageRank: 0.012,
        clusteringCoefficient: 0.01
      },
      temporalMetrics: {
        medianIntervalSeconds: 30.0,
        intervalJitterSeconds: jitter,
        burstCount: 24,
        nightActivityRatio: 0.51
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.96,
        sentimentPolarizationIndex: 0.94,
        topHashTags: [primaryTag, secondaryTag],
        samplePosts: [
          {
            id: `post_bot_${i}`,
            timestamp: now,
            text: `ALERTA URGENTE: Confirmada situación crítica en ${cleanTitle}. Ocultación deliberada por canales oficiales. Difundir antes de que lo borren. ${primaryTag} ${secondaryTag}`,
            isExactDuplicate: true,
            sharesOrRetweets: 1
          }
        ]
      },
      geoOrigin: {
        country: 'Subred de Proxies Automatizados',
        city: 'Rotativo',
        asn: 'AS48282',
        isVpnOrProxy: true,
        lat: 48.8566 + (i * 0.1),
        lng: 2.3522 + (i * 0.1)
      }
    });

    // Aristas de amplificación radial
    edges.push({
      id: `edge_gen_seed1_${i}`,
      source: seedId1,
      target: botId,
      type: 'retweet',
      weight: 12 + (i % 5),
      timestamp: now,
      isBurstEdge: true
    });

    edges.push({
      id: `edge_gen_seed2_${i}`,
      source: seedId2,
      target: botId,
      type: 'forward',
      weight: 8 + (i % 4),
      timestamp: now,
      isBurstEdge: true
    });
  }

  // 4. 6 Nodos Orgánicos y de Verificación (Fact-Checkers e Institucionales)
  const organicData = [
    {
      id: `org_fact_${Date.now()}_1`,
      handle: '@VerificaInfo_Oficial',
      name: 'Equipo de Verificación Digital',
      text: `DESMENTIDO: La información viral y las alertas catastróficas que circulan con el hashtag ${primaryTag} carecen de respaldo y usan imágenes fuera de contexto. Todo se desarrolla con normalidad.`,
      followers: 84000
    },
    {
      id: `org_news_${Date.now()}_2`,
      handle: '@CronicaNoticias_24',
      name: 'Agencia de Noticias Ciudadanas',
      text: `ACTUALIZACIÓN sobre ${cleanTitle}: Fuentes verificadas sobre el terreno confirman que no existen incidentes graves. Se detecta una campaña masiva de spam en redes.`,
      followers: 45000
    },
    {
      id: `org_inst_${Date.now()}_3`,
      handle: '@CentroEmergencias_Oficial',
      name: 'Centro de Coordinación & Avisos',
      text: `COMUNICADO OFICIAL: Desmentimos de forma tajante las cadenas de pánico relativas a ${cleanTitle}. No se dejen manipular por cuentas anónimas.`,
      followers: 120000
    },
    {
      id: `org_citizen_${Date.now()}_4`,
      handle: '@VecinosAlerta_Civica',
      name: 'Asociación de Vecinos y Observadores',
      text: `Desde el lugar de los hechos confirmamos tranquilidad total. Desconocemos el origen de los bulos bajo ${primaryTag}.`,
      followers: 9800
    },
    {
      id: `org_fact2_${Date.now()}_5`,
      handle: '@FactCheck_Fronteras',
      name: 'Observatorio de Desinformación',
      text: `Análisis técnico: El 85% de las publicaciones bajo ${primaryTag} provienen de cuentas de reciente creación replicando textos con latencias idénticas. #BuloDetectado`,
      followers: 38000
    },
    {
      id: `org_press_${Date.now()}_6`,
      handle: '@PeriodismoLibre_ES',
      name: 'Redacción Periodismo de Datos',
      text: `Investigamos el origen de la narrativa sobre ${cleanTitle}. Se identifican dos canales semilla en mensajería alimentando bots sincronizados.`,
      followers: 29000
    }
  ];

  organicData.forEach((org, idx) => {
    nodes.push({
      id: org.id,
      handle: org.handle,
      platform: primaryPlatform,
      displayName: org.name,
      type: 'organic',
      cibScore: 8 + idx * 2,
      creationDate: '2020-04-10T10:00:00Z',
      accountAgeDays: 2300,
      followersCount: org.followers,
      followingCount: 420,
      followerFollowingRatio: Number((org.followers / 420).toFixed(1)),
      totalPosts: 12000,
      postsPerDay: 4.8,
      louvainCommunity: 2,
      centrality: {
        degree: 8,
        betweenness: 0.35,
        pageRank: 0.15,
        clusteringCoefficient: 0.42
      },
      temporalMetrics: {
        medianIntervalSeconds: 1200.0,
        intervalJitterSeconds: 420.0, // Human variance
        burstCount: 1,
        nightActivityRatio: 0.08
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.02,
        sentimentPolarizationIndex: 0.15,
        topHashTags: [primaryTag, '#FactCheck', '#Verificación'],
        samplePosts: [
          {
            id: `post_org_${idx}`,
            timestamp: now,
            text: org.text,
            isExactDuplicate: false,
            sharesOrRetweets: 620 + idx * 85
          }
        ]
      },
      geoOrigin: {
        country: 'España / Nodos Residenciales',
        city: 'Madrid / Barcelona',
        asn: 'AS3352-TELEFONICA',
        isVpnOrProxy: false,
        lat: 40.4168,
        lng: -3.7038
      }
    });

    // Quote and refutation edges
    if (idx === 0 || idx === 4) {
      edges.push({
        id: `edge_refute_${idx}`,
        source: org.id,
        target: seedId2,
        type: 'quote',
        weight: 18,
        timestamp: now,
        isBurstEdge: false
      });
    }

    if (idx > 0) {
      edges.push({
        id: `edge_org_dialogue_${idx}`,
        source: organicData[idx - 1].id,
        target: org.id,
        type: 'reply',
        weight: 5,
        timestamp: now,
        isBurstEdge: false
      });
    }
  });

  // 5. Astroturf Clusters
  const astroturfClusters: AstroturfCluster[] = [
    {
      id: `cluster_${Date.now()}_1`,
      seedText: `ALERTA URGENTE: Confirmada situación crítica en ${cleanTitle}. Ocultación deliberada por canales oficiales. Difundir antes de que lo borren. ${primaryTag} ${secondaryTag}`,
      occurrenceCount: 22,
      accountIds: [seedId1, seedId2, nodes[2].id, nodes[3].id, nodes[4].id, nodes[5].id],
      firstSeen: new Date(Date.now() - 3600000).toISOString(),
      lastSeen: now,
      timeSpanMinutes: 0.35, // 21 seconds burst
      averageSimilarity: 0.97,
      targetNarrative: `Inducción de pánico y alarma social en torno a: ${cleanTitle}`,
      isDescontextualizedMedia: true
    },
    {
      id: `cluster_${Date.now()}_2`,
      seedText: `Exigimos dimisiones inmediatas tras lo sucedido con ${cleanTitle}. Bloqueo informativo inaceptable. ${secondaryTag}`,
      occurrenceCount: 15,
      accountIds: [seedId1, nodes[6].id, nodes[7].id, nodes[8].id],
      firstSeen: new Date(Date.now() - 1800000).toISOString(),
      lastSeen: now,
      timeSpanMinutes: 0.42,
      averageSimilarity: 0.94,
      targetNarrative: `Deslegitimación institucional y polarización política bajo ${secondaryTag}`,
      isDescontextualizedMedia: false
    }
  ];

  // 6. Vectores Geopolíticos
  const geopoliticalVectors: GeopoliticalVector[] = [
    {
      id: `geo_vec_${Date.now()}_1`,
      originCountry: 'Infraestructura Proxy & ASN Anónimo (Europa del Este / Rusia)',
      originCoords: [55.7558, 37.6173],
      targetRegion: `${cleanTitle} / Ámbito Nacional`,
      targetCoords: [40.4168, -3.7038],
      primaryLanguage: 'Español',
      targetElectoralProcessOrTopic: cleanContext,
      estimatedReach: 420000,
      activeBotNodes: 18,
      infrastructureNotes: `Granja de servidores y proxies rotativos orquestando la amplificación en ${params.platforms.join(', ')}.`
    }
  ];

  // 7. Cálculo dinámico de CIB Score
  const cib = computeComprehensiveCIBScore(nodes, edges);

  return {
    id: campaignId,
    title: cleanTitle,
    electoralProcess: cleanContext,
    electoralContext: cleanContext,
    status: 'ACTIVE_ALERT',
    investigationCode: invCode,
    createdAt: now,
    datasetSha256: `sha256_${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
    targetPlatforms: params.platforms,
    totalCollectedEvents: (params.eventsCount || 1500) + Math.floor(Math.random() * 2000),
    summaryDescription: `Expediente generado por analista sobre '${cleanTitle}'. Detectada red de 28 nodos con inyección artificial sincronizada bajo los términos [${rawKeywords.join(', ')}]. Análisis topológico revela estructura Hub-and-Spoke con sincronización sub-segundo (jitter < 0.35s) y réplica masiva de astroturfing.`,
    cibBreakdown: {
      ...cib,
      verdictDescription: `CIB Score: ${cib.overallScore}/100. Operación artificial detectada con alta significación estadística en ${params.platforms.join(', ')} con astroturfing coordinado y patrones de automatización temporal.`
    },
    nodes,
    edges,
    astroturfClusters,
    geopoliticalVectors,
    disarmTactics: [
      {
        techniqueId: 'T0087',
        techniqueName: 'Difusión Coordinada en Micro-ráfagas (Zero-Jitter)',
        tacticPhase: 'Amplificación Inauténtica',
        confidence: 'CONFIRMED',
        evidenceProof: `Sincronización en ráfagas con jitter temporal medio de 0.22s en ${params.platforms.join(' y ')}.`
      },
      {
        techniqueId: 'T0028',
        techniqueName: 'Astroturfing de Plantillas Textuales Idénticas',
        tacticPhase: 'Amplificación Inauténtica',
        confidence: 'CONFIRMED',
        evidenceProof: `Múltiples cuentas difundiendo exactamente los mismos términos '${primaryTag}' y plantillas clonadas con alta similitud léxica.`
      },
      {
        techniqueId: 'T0014',
        techniqueName: 'Adquisición de Cuentas Zombi en Mercado Negro',
        tacticPhase: 'Establecimiento de Infraestructura',
        confidence: 'HIGH',
        evidenceProof: 'Identificadores numéricos inmutables en los nodos coordinadores que presentan largos periodos de dormancia previa y cambio de temática.'
      },
      {
        techniqueId: 'T0092',
        techniqueName: 'Ofuscación de Infraestructura y Proxies',
        tacticPhase: 'Evasión de Detección',
        confidence: 'HIGH',
        evidenceProof: 'Egress a través de ASN de hosting anónimo y proxies rotativos.'
      }
    ]
  };
}
