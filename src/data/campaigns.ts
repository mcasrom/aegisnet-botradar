/**
 * AegisNet-BotRadar: DATASETS DE DEMOSTRACIÓN (NO SON EVIDENCIA REAL)
 * ⚠️ ATENCIÓN: Estas campañas son EJEMPLOS ILUSTRATIVOS diseñados para probar la UI del motor.
 * NO son datos de campo capturados. Jamás deben tratarse como evidencia forense.
 * Los datos reales provienen del backend /api/campaigns (pipeline oasis.py).
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

// (Dataset preconfigurado de DEMOSTRACIÓN — cuentas, fechas y métricas son ficticias.)

import {
  InvestigationCampaign,
  SocialAccountNode,
  NetworkEdge,
  ConfidenceMatrixItem,
  ClassifierBenchmark,
  ChainOfCustodyStep
} from '../types/botradar';

// Helper to generate coordinates in a cluster or radial layout
function generateCampaign1Data() {
  const nodes: SocialAccountNode[] = [];
  const edges: NetworkEdge[] = [];

  // Hub 1: Seed Coordinator
  nodes.push({
    id: 'node_hub_alpha',
    handle: '@VozVeritas_Global',
    platform: 'x_twitter',
    displayName: 'Veritas Global Intel',
    type: 'coordinator',
    cibScore: 94,
    creationDate: '2026-01-14T03:22:00Z',
    accountAgeDays: 45,
    followersCount: 1240,
    followingCount: 38,
    followerFollowingRatio: 32.6,
    totalPosts: 8420,
    postsPerDay: 187,
    louvainCommunity: 1,
    centrality: {
      degree: 42,
      betweenness: 0.88,
      pageRank: 0.24,
      clusteringCoefficient: 0.08
    },
    temporalMetrics: {
      medianIntervalSeconds: 30.0,
      intervalJitterSeconds: 0.35, // High automation signal
      burstCount: 38,
      nightActivityRatio: 0.48 // Flat 24/7 activity
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.91,
      sentimentPolarizationIndex: 0.89,
      topHashTags: ['#AlertaElectoral2026', '#FraudeCensal', '#VotoTransparenteYa'],
      samplePosts: [
        {
          id: 'p_hub_1',
          timestamp: '2026-08-29T14:02:11Z',
          text: 'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata de la jornada. #AlertaElectoral2026 #FraudeCensal',
          isExactDuplicate: true,
          sharesOrRetweets: 384
        },
        {
          id: 'p_hub_2',
          timestamp: '2026-08-29T15:10:00Z',
          text: 'ATENCIÓN CIUDADANA: Caída intencional del sistema de conteo preliminar en servidores centrales. No acepten los resultados oficiales.',
          isExactDuplicate: true,
          sharesOrRetweets: 412
        }
      ]
    },
    geoOrigin: {
      country: 'Seychelles (Proxy ASN 49320)',
      city: 'Victoria',
      asn: 'AS49320-BULLETPROOF',
      isVpnOrProxy: true,
      lat: -4.6796,
      lng: 55.4920
    }
  });

  // Hub 2: Telegram Channel Seed
  nodes.push({
    id: 'node_hub_tg',
    handle: '@CanalResistenciaCívica',
    platform: 'telegram',
    displayName: 'Boletín Cívico Inmediato',
    type: 'coordinator',
    cibScore: 89,
    creationDate: '2026-02-01T11:00:00Z',
    accountAgeDays: 27,
    followersCount: 14200,
    followingCount: 4,
    followerFollowingRatio: 3550,
    totalPosts: 3950,
    postsPerDay: 146,
    louvainCommunity: 1,
    centrality: {
      degree: 28,
      betweenness: 0.74,
      pageRank: 0.19,
      clusteringCoefficient: 0.05
    },
    temporalMetrics: {
      medianIntervalSeconds: 60.0,
      intervalJitterSeconds: 0.2,
      burstCount: 29,
      nightActivityRatio: 0.52
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.88,
      sentimentPolarizationIndex: 0.94,
      topHashTags: ['#AlertaElectoral2026', '#TelegramAlert'],
      samplePosts: [
        {
          id: 'p_tg_1',
          timestamp: '2026-08-29T14:02:14Z',
          text: 'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata de la jornada. Difundir masivamente en X.',
          isExactDuplicate: true,
          sharesOrRetweets: 512
        }
      ]
    },
    geoOrigin: {
      country: 'Panamá (VPN Datacenter)',
      city: 'Panama City',
      asn: 'AS61138',
      isVpnOrProxy: true,
      lat: 8.9824,
      lng: -79.5199
    }
  });

  // Amplifiers (Bot Farm Cluster Alpha) - 24 bot accounts
  for (let i = 1; i <= 24; i++) {
    const paddedId = i < 10 ? `0${i}` : `${i}`;
    const botId = `bot_alpha_${paddedId}`;
    const jitter = Number((0.15 + (i * 0.05) % 0.4).toFixed(2));
    nodes.push({
      id: botId,
      handle: `@User_${Math.floor(10000000 + i * 492318)}`,
      platform: 'x_twitter',
      displayName: `Usuario Ciudadano ${i}`,
      type: 'bot',
      cibScore: 88 + (i % 8),
      creationDate: '2026-02-12T04:15:00Z',
      accountAgeDays: 16,
      followersCount: 3 + (i % 6),
      followingCount: 2400 + i * 45,
      followerFollowingRatio: 0.0018,
      totalPosts: 1240 + i * 38,
      postsPerDay: 78,
      louvainCommunity: 1,
      centrality: {
        degree: 4,
        betweenness: 0.01,
        pageRank: 0.012,
        clusteringCoefficient: 0.0
      },
      temporalMetrics: {
        medianIntervalSeconds: 30.0,
        intervalJitterSeconds: jitter,
        burstCount: 34,
        nightActivityRatio: 0.49
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.96,
        sentimentPolarizationIndex: 0.85,
        topHashTags: ['#AlertaElectoral2026', '#FraudeCensal'],
        samplePosts: [
          {
            id: `p_bot_${i}`,
            timestamp: `2026-08-29T14:02:${(14 + (i % 4)).toString().padStart(2, '0')}Z`,
            text: 'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata de la jornada. #AlertaElectoral2026 #FraudeCensal',
            isExactDuplicate: true,
            sharesOrRetweets: 1
          }
        ]
      },
      geoOrigin: {
        country: 'Moldavia / ASN Proxy Cloud',
        city: 'Chisinau',
        asn: 'AS209403',
        isVpnOrProxy: true,
        lat: 47.0105,
        lng: 28.8638
      }
    });

    // Hub and spoke edge
    edges.push({
      id: `edge_alpha_${i}`,
      source: 'node_hub_alpha',
      target: botId,
      type: 'retweet',
      weight: 12 + (i % 5),
      timestamp: `2026-08-29T14:02:${(14 + (i % 4)).toString().padStart(2, '0')}Z`,
      isBurstEdge: true
    });

    // Telegram forward bridge
    if (i % 3 === 0) {
      edges.push({
        id: `edge_tg_cross_${i}`,
        source: 'node_hub_tg',
        target: botId,
        type: 'forward',
        weight: 6,
        timestamp: '2026-08-29T14:02:20Z',
        isBurstEdge: true
      });
    }
  }

  // Organic accounts (Citizens & Fact-checkers reacting organically)
  const organicUsers = [
    { handle: '@ObservatorioElect_EC', name: 'Observatorio Electoral Independiente', followers: 45200, following: 380, posts: 5120, community: 2 },
    { handle: '@VerificaDatos_Oficial', name: 'Verifica Datos Fact-Checking', followers: 89000, following: 510, posts: 8940, community: 2 },
    { handle: '@Periodista_Real_J', name: 'J. Delgado (Cronista Electoral)', followers: 18400, following: 1120, posts: 14200, community: 2 },
    { handle: '@CiudadanoCritico_3', name: 'Marcos R. Ciudadano', followers: 412, following: 390, posts: 2100, community: 2 },
    { handle: '@AbogadosElectorales', name: 'Red de Juristas Constitucionales', followers: 12900, following: 430, posts: 3800, community: 2 },
    { handle: '@VotanteInformado_ES', name: 'Votante Informado', followers: 230, following: 280, posts: 950, community: 2 },
    { handle: '@InfoPrensaRegional', name: 'Agencia Informativa Regional', followers: 34100, following: 890, posts: 22000, community: 2 },
    { handle: '@TecnologiaYDemocracia', name: 'Tech & Democracy Lab', followers: 15400, following: 620, posts: 4100, community: 2 }
  ];

  organicUsers.forEach((org, idx) => {
    const orgId = `organic_node_${idx + 1}`;
    nodes.push({
      id: orgId,
      handle: org.handle,
      platform: 'x_twitter',
      displayName: org.name,
      type: 'organic',
      cibScore: 8 + (idx * 3), // Low organic score
      creationDate: '2019-04-10T12:00:00Z',
      accountAgeDays: 2690,
      followersCount: org.followers,
      followingCount: org.following,
      followerFollowingRatio: Number((org.followers / org.following).toFixed(2)),
      totalPosts: org.posts,
      postsPerDay: 4.2,
      louvainCommunity: 2,
      centrality: {
        degree: 8,
        betweenness: 0.35,
        pageRank: 0.12,
        clusteringCoefficient: 0.42
      },
      temporalMetrics: {
        medianIntervalSeconds: 1420.0,
        intervalJitterSeconds: 480.0, // High natural human jitter
        burstCount: 1,
        nightActivityRatio: 0.05 // Sleeps at night
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.02,
        sentimentPolarizationIndex: 0.22,
        topHashTags: ['#Elecciones2026', '#FactCheck', '#VotoSeguro'],
        samplePosts: [
          {
            id: `p_org_${idx}`,
            timestamp: '2026-08-29T14:25:00Z',
            text: 'ATENCIÓN: Desmentimos cadena viral sobre supuesto fallo en distrito 4. Se trata de un simulacro técnico programado según acta oficial N° 2026-09.',
            isExactDuplicate: false,
            sharesOrRetweets: 890
          }
        ]
      },
      geoOrigin: {
        country: 'España / Valencia',
        city: 'Valencia',
        asn: 'AS3352-TELEFONICA',
        isVpnOrProxy: false,
        lat: 39.4699,
        lng: -0.3763
      }
    });

    // Inter-organic connections (clustering coefficient is high in human networks)
    if (idx > 0) {
      edges.push({
        id: `edge_organic_dialogue_${idx}`,
        source: `organic_node_${idx}`,
        target: orgId,
        type: 'reply',
        weight: 5,
        timestamp: '2026-08-29T14:30:00Z',
        isBurstEdge: false
      });
    }

    // Some fact-checkers quote-tweet the seed coordinator to refute it
    if (idx < 3) {
      edges.push({
        id: `edge_factcheck_quote_${idx}`,
        source: orgId,
        target: 'node_hub_alpha',
        type: 'quote',
        weight: 18,
        timestamp: '2026-08-29T14:35:10Z',
        isBurstEdge: false
      });
    }
  });

  return { nodes, edges };
}

// Generate data for Campaign 2: PetroGrid Infrastructure Panic
function generateCampaign2Data() {
  const nodes: SocialAccountNode[] = [];
  const edges: NetworkEdge[] = [];

  nodes.push({
    id: 'c2_hub_yt',
    handle: 'MegaCrisis_CanalNoticias',
    platform: 'youtube',
    displayName: 'MegaCrisis Global Feed',
    type: 'coordinator',
    cibScore: 91,
    creationDate: '2026-03-01T08:00:00Z',
    accountAgeDays: 32,
    followersCount: 38000,
    followingCount: 12,
    followerFollowingRatio: 3166,
    totalPosts: 450,
    postsPerDay: 14,
    louvainCommunity: 3,
    centrality: { degree: 30, betweenness: 0.82, pageRank: 0.28, clusteringCoefficient: 0.04 },
    temporalMetrics: { medianIntervalSeconds: 45.0, intervalJitterSeconds: 0.4, burstCount: 19, nightActivityRatio: 0.44 },
    contentMetrics: {
      exactCopyPasteRatio: 0.85,
      sentimentPolarizationIndex: 0.95,
      topHashTags: ['#BlackoutTotal', '#CrisisEnergetica', '#SabotajeRed'],
      samplePosts: [
        {
          id: 'p_c2_yt1',
          timestamp: '2026-08-28T19:00:00Z',
          text: 'IMPACTANTE: Explosión confirmada en subestación principal de energía. Provisiones agotadas en 48 horas. Ver video en enlace.',
          isExactDuplicate: true,
          sharesOrRetweets: 1280
        }
      ]
    },
    geoOrigin: { country: 'Hong Kong (Hosting Bulletproof)', city: 'Kowloon', asn: 'AS133480', isVpnOrProxy: true, lat: 22.3193, lng: 114.1694 }
  });

  for (let i = 1; i <= 18; i++) {
    const botId = `c2_bot_${i}`;
    nodes.push({
      id: botId,
      handle: `@EcoShield_${1000 + i}`,
      platform: i % 2 === 0 ? 'x_twitter' : 'meta',
      displayName: `Alerta Red ${i}`,
      type: 'bot',
      cibScore: 84 + (i % 10),
      creationDate: '2026-03-08T00:00:00Z',
      accountAgeDays: 14,
      followersCount: 5,
      followingCount: 1800,
      followerFollowingRatio: 0.002,
      totalPosts: 980,
      postsPerDay: 70,
      louvainCommunity: 3,
      centrality: { degree: 2, betweenness: 0.005, pageRank: 0.015, clusteringCoefficient: 0.0 },
      temporalMetrics: { medianIntervalSeconds: 45.0, intervalJitterSeconds: 0.5, burstCount: 22, nightActivityRatio: 0.51 },
      contentMetrics: {
        exactCopyPasteRatio: 0.94,
        sentimentPolarizationIndex: 0.92,
        topHashTags: ['#BlackoutTotal', '#SabotajeRed'],
        samplePosts: [
          {
            id: `p_c2_bot_${i}`,
            timestamp: `2026-08-28T19:00:${(12 + i * 2).toString().padStart(2, '0')}Z`,
            text: 'IMPACTANTE: Explosión confirmada en subestación principal de energía. Provisiones agotadas en 48 horas. #BlackoutTotal',
            isExactDuplicate: true,
            sharesOrRetweets: 3
          }
        ]
      },
      geoOrigin: { country: 'San Petersburgo (Proxy cluster)', city: 'San Petersburgo', asn: 'AS48282', isVpnOrProxy: true, lat: 59.9343, lng: 30.3351 }
    });

    edges.push({
      id: `c2_edge_${i}`,
      source: 'c2_hub_yt',
      target: botId,
      type: 'forward',
      weight: 8,
      timestamp: `2026-08-28T19:00:${(12 + i * 2).toString().padStart(2, '0')}Z`,
      isBurstEdge: true
    });
  }

  return { nodes, edges };
}

// Generate data for Campaign 3: Health Topic (Suspicious mixed with organic)
function generateCampaign3Data() {
  const nodes: SocialAccountNode[] = [];
  const edges: NetworkEdge[] = [];

  // Mixed organic debate with small bot-amplifier group
  for (let i = 1; i <= 10; i++) {
    const isBot = i <= 4;
    const nid = `c3_node_${i}`;
    nodes.push({
      id: nid,
      handle: isBot ? `@SaludLibre_${800 + i}` : `@Dr_Martin_${i}`,
      platform: 'x_twitter',
      displayName: isBot ? `Difusor Salud ${i}` : `Dr. Martín Bioética`,
      type: isBot ? 'bot' : 'organic',
      cibScore: isBot ? 76 : 14,
      creationDate: isBot ? '2026-04-01T00:00:00Z' : '2018-09-12T00:00:00Z',
      accountAgeDays: isBot ? 10 : 2800,
      followersCount: isBot ? 12 : 3400,
      followingCount: isBot ? 1400 : 420,
      followerFollowingRatio: isBot ? 0.008 : 8.09,
      totalPosts: isBot ? 420 : 5100,
      postsPerDay: isBot ? 42 : 2.1,
      louvainCommunity: isBot ? 5 : 4,
      centrality: { degree: isBot ? 3 : 7, betweenness: 0.1, pageRank: 0.05, clusteringCoefficient: isBot ? 0.02 : 0.38 },
      temporalMetrics: { medianIntervalSeconds: isBot ? 60.0 : 3600.0, intervalJitterSeconds: isBot ? 0.8 : 980.0, burstCount: isBot ? 11 : 0, nightActivityRatio: isBot ? 0.42 : 0.02 },
      contentMetrics: {
        exactCopyPasteRatio: isBot ? 0.82 : 0.04,
        sentimentPolarizationIndex: isBot ? 0.78 : 0.35,
        topHashTags: ['#ReferendumSanitario', '#SaludPublica'],
        samplePosts: [
          {
            id: `p_c3_${i}`,
            timestamp: '2026-08-27T10:15:00Z',
            text: isBot ? 'Exclusivo: Revelan efectos ocultos en el protocolo de vacunación nacional. Exige anulación.' : 'Analizando con rigor los datos epidemiológicos oficiales del último trimestre. Debate constructivo.',
            isExactDuplicate: isBot,
            sharesOrRetweets: isBot ? 4 : 48
          }
        ]
      }
    });
  }

  edges.push({
    id: 'c3_edge_1',
    source: 'c3_node_1',
    target: 'c3_node_2',
    type: 'retweet',
    weight: 4,
    timestamp: '2026-08-27T10:15:20Z',
    isBurstEdge: true
  });

  return { nodes, edges };
}


const c1Data = generateCampaign1Data();
const c2Data = generateCampaign2Data();
const c3Data = generateCampaign3Data();

export const DEMO_CAMPAIGNS: InvestigationCampaign[] = [
  {
    id: 'camp_electoral_astroturf_2026',
    title: 'Operación Astroturf: Proceso Electoral 2026',
    electoralContext: 'Elecciones Generales / Monitoreo de Distrito Crítico',
    electoralProcess: 'Elecciones Generales 2026',
    status: 'ACTIVE_ALERT',
    investigationCode: 'AEGIS-2026-ELX-89B',
    createdAt: '2026-08-29T14:00:00Z',
    datasetSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    targetPlatforms: ['x_twitter', 'telegram'],
    totalCollectedEvents: 18450,
    summaryDescription: 'Red coordinada de 26 nodos bot y 2 cuentas semilla con topología Hub-and-Spoke. Inseminación sincronizada en X/Twitter y Telegram mediante 140 réplicas con texto idéntico y latencia menor a 4 segundos (Zero-Jitter API Scripting). Se busca amplificar artificialmente la narrativa de fraude censal para deslegitimar los colegios electorales.',
    cibBreakdown: {
      overallScore: 87,
      topologicalScore: 92,
      temporalScore: 89,
      semanticScore: 94,
      metadataScore: 73,
      riskLevel: 'CONFIRMED_CIB',
      verdictDescription: 'Comportamiento Inauténtico Coordinado confirmado con alta significancia estadística. La distribución de grados y el agrupamiento Louvain evidencian una estructura artificial sin puentes orgánicos con la sociedad civil.'
    },
    nodes: c1Data.nodes,
    edges: c1Data.edges,
    astroturfClusters: [
      {
        id: 'cluster_astroturf_01',
        seedText: 'URGENTE: Filtran actas manipuladas en el distrito 4 electoral. Se exige suspensión inmediata de la jornada. #AlertaElectoral2026 #FraudeCensal',
        occurrenceCount: 26,
        accountIds: ['node_hub_alpha', 'bot_alpha_01', 'bot_alpha_02', 'bot_alpha_03', 'bot_alpha_04', 'bot_alpha_05'],
        firstSeen: '2026-08-29T14:02:11Z',
        lastSeen: '2026-08-29T14:02:18Z',
        timeSpanMinutes: 0.12, // 7 seconds span!
        averageSimilarity: 0.98,
        targetNarrative: 'Deslegitimación de autoridades de mesas electorales',
        isDescontextualizedMedia: true
      },
      {
        id: 'cluster_astroturf_02',
        seedText: 'ATENCIÓN CIUDADANA: Caída intencional del sistema de conteo preliminar en servidores centrales. No acepten los resultados oficiales.',
        occurrenceCount: 19,
        accountIds: ['node_hub_alpha', 'bot_alpha_07', 'bot_alpha_08', 'bot_alpha_09'],
        firstSeen: '2026-08-29T15:10:00Z',
        lastSeen: '2026-08-29T15:10:14Z',
        timeSpanMinutes: 0.23,
        averageSimilarity: 0.96,
        targetNarrative: 'Inducción de pánico sobre fallos informáticos en recuento',
        isDescontextualizedMedia: false
      }
    ],
    geopoliticalVectors: [
      {
        id: 'geo_vec_1',
        originCountry: 'Moldavia / Servidores Proxied ASN209403',
        originCoords: [47.0105, 28.8638],
        targetRegion: 'España / Madrid y Valencia',
        targetCoords: [40.4168, -3.7038],
        primaryLanguage: 'Español (Sintaxis regional alterada con modismos ajenos)',
        targetElectoralProcessOrTopic: 'Jornada de votaciones distrito 4',
        estimatedReach: 245000,
        activeBotNodes: 24,
        infrastructureNotes: 'Cluster de 24 IPs residenciales rotativas asignadas a proxies HTTP transparentes con user-agents automatizados.'
      },
      {
        id: 'geo_vec_2',
        originCountry: 'Seychelles (Offshore Bulletproof ASN49320)',
        originCoords: [-4.6796, 55.4920],
        targetRegion: 'Unión Europea / Países Hispanohablantes',
        targetCoords: [48.8566, 2.3522],
        primaryLanguage: 'Español / Multilingüe',
        targetElectoralProcessOrTopic: 'Monitoreo de auditoría electoral',
        estimatedReach: 890000,
        activeBotNodes: 2,
        infrastructureNotes: 'Nodos semilla de alta capacidad con inyección de contenido directo a canales cerrados de mensajería.'
      }
    ]
  },
  {
    id: 'camp_petrogrid_sabotage',
    title: 'Campaña PetroGrid: Sabotaje de Infraestructura y Pánico',
    electoralContext: 'Seguridad Nacional & Infraestructuras Críticas',
    electoralProcess: 'Debate Energético Parlamentario',
    status: 'INVESTIGATION_ONGOING',
    investigationCode: 'AEGIS-2026-INF-44C',
    createdAt: '2026-08-28T18:30:00Z',
    datasetSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    targetPlatforms: ['youtube', 'meta', 'x_twitter'],
    totalCollectedEvents: 9820,
    summaryDescription: 'Campaña de desinformación basada en la propagación viral de vídeos descontextualizados de 2019 presentados como un colapso eléctrico inminente. Uso de granjas de comentarios en YouTube sincronizadas con difusión cruzada en Meta y X.',
    cibBreakdown: {
      overallScore: 78,
      topologicalScore: 74,
      temporalScore: 82,
      semanticScore: 88,
      metadataScore: 68,
      riskLevel: 'CONFIRMED_CIB',
      verdictDescription: 'Descontextualización de material audiovisual con metadatos EXIF suprimidos y sincronización multicanal programada.'
    },
    nodes: c2Data.nodes,
    edges: c2Data.edges,
    astroturfClusters: [
      {
        id: 'cluster_pg_01',
        seedText: 'IMPACTANTE: Explosión confirmada en subestación principal de energía. Provisiones agotadas en 48 horas. #BlackoutTotal',
        occurrenceCount: 18,
        accountIds: ['c2_hub_yt', 'c2_bot_1', 'c2_bot_2', 'c2_bot_3'],
        firstSeen: '2026-08-28T19:00:00Z',
        lastSeen: '2026-08-28T19:01:20Z',
        timeSpanMinutes: 1.33,
        averageSimilarity: 0.95,
        targetNarrative: 'Inducción de compras de pánico y desabastecimiento',
        isDescontextualizedMedia: true
      }
    ],
    geopoliticalVectors: [
      {
        id: 'geo_vec_pg_1',
        originCountry: 'San Petersburgo (Federación Rusa) ASN48282',
        originCoords: [59.9343, 30.3351],
        targetRegion: 'Europa Occidental / Sector Energético',
        targetCoords: [50.8503, 4.3517],
        primaryLanguage: 'Español e Inglés',
        targetElectoralProcessOrTopic: 'Votación ley de transición y soberanía energética',
        estimatedReach: 420000,
        activeBotNodes: 18,
        infrastructureNotes: 'Granja automatizada con rotación de tokens OAuth y emuladores de Android.'
      }
    ]
  },
  {
    id: 'camp_sanitary_referendum',
    title: 'Monitoreo: Debate en Referéndum Sanitario',
    electoralContext: 'Proceso de Consulta Pública y Salud',
    electoralProcess: 'Referéndum Sanitario Regional 2026',
    status: 'ARCHIVED',
    investigationCode: 'AEGIS-2026-MED-12A',
    createdAt: '2026-08-27T09:00:00Z',
    datasetSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    targetPlatforms: ['x_twitter'],
    totalCollectedEvents: 4120,
    summaryDescription: 'Muestra analizada donde coexiste un debate ciudadano intensamente polarizado pero predominantemente orgánico, junto con un pequeño foco de 4 cuentas que intentaron astroturfing temprano con baja eficacia de propagación.',
    cibBreakdown: {
      overallScore: 42,
      topologicalScore: 38,
      temporalScore: 45,
      semanticScore: 50,
      metadataScore: 35,
      riskLevel: 'SUSPICIOUS',
      verdictDescription: 'Predominancia de patrones orgánicos con un sub-cluster anómalo aislado. No se observó masa crítica de coordinación sistémica.'
    },
    nodes: c3Data.nodes,
    edges: c3Data.edges,
    astroturfClusters: [
      {
        id: 'cluster_san_01',
        seedText: 'Exclusivo: Revelan efectos ocultos en el protocolo de vacunación nacional. Exige anulación.',
        occurrenceCount: 4,
        accountIds: ['c3_node_1', 'c3_node_2', 'c3_node_3', 'c3_node_4'],
        firstSeen: '2026-08-27T10:15:00Z',
        lastSeen: '2026-08-27T10:16:30Z',
        timeSpanMinutes: 1.5,
        averageSimilarity: 0.92,
        targetNarrative: 'Boicot al referéndum mediante teorías sanitarias no fundamentadas',
        isDescontextualizedMedia: false
      }
    ],
    geopoliticalVectors: [
      {
        id: 'geo_vec_san_1',
        originCountry: 'Servidores VPN anónimos en Suiza / Países Bajos',
        originCoords: [46.8182, 8.2275],
        targetRegion: 'Sur de Europa',
        targetCoords: [41.3851, 2.1734],
        primaryLanguage: 'Español y Catalán',
        targetElectoralProcessOrTopic: 'Consulta de salud comunitaria',
        estimatedReach: 52000,
        activeBotNodes: 4,
        infrastructureNotes: 'Cuentas creadas hace menos de 10 días con actividad aislada y escasa interacción humana.'
      }
    ]
  }
];
