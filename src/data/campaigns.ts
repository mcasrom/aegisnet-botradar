/**
 * AegisNet-BotRadar: DATASETS DE DEMOSTRACIÓN (NO SON EVIDENCIA REAL)
 * ⚠️ ATENCIÓN: Estas campañas son EJEMPLOS ILUSTRATIVOS diseñados para probar la UI del motor.
 * NO son datos de campo capturados. Jamás deben tratarse como evidencia forense.
 * Los datos reales provienen del backend /api/campaigns (pipeline oasis.py).
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

// (Dataset preconfigurado de DEMOSTRACIÓN — cuentas, fechas y métricas son ficticias.)

import {
  InvestigationCampaign,
  SocialAccountNode,
  NetworkEdge,
  ConfidenceMatrixItem,
  ClassifierBenchmark,
  ChainOfCustodyStep,
  BurstEventRecord
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

// Generate data for Campaign 4: Ceuta Fence Jump / July 2026 Border Disinformation
function generateCeutaCampaignData() {
  const nodes: SocialAccountNode[] = [];
  const edges: NetworkEdge[] = [];

  // Hub 1: Seed Coordinator on Telegram
  nodes.push({
    id: 'ceuta_hub_tg',
    handle: '@AlertaFronteraSur_Real',
    platform: 'telegram',
    displayName: 'Canal Alerta Frontera Sur Oficial',
    type: 'coordinator',
    cibScore: 96,
    creationDate: '2026-06-28T18:00:00Z',
    accountAgeDays: 20,
    followersCount: 38400,
    followingCount: 3,
    followerFollowingRatio: 12800,
    totalPosts: 1840,
    postsPerDay: 92,
    louvainCommunity: 7,
    centrality: {
      degree: 38,
      betweenness: 0.94,
      pageRank: 0.31,
      clusteringCoefficient: 0.03
    },
    temporalMetrics: {
      medianIntervalSeconds: 25.0,
      intervalJitterSeconds: 0.18,
      burstCount: 42,
      nightActivityRatio: 0.58
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.94,
      sentimentPolarizationIndex: 0.98,
      topHashTags: ['#AlertaCeutaJulio2026', '#FronteraColapsada', '#InvasionCeuta2026'],
      samplePosts: [
        {
          id: 'p_ceuta_tg1',
          timestamp: '2026-07-18T02:15:02Z',
          text: 'URGENTE Y GRAVÍSIMO: Colapso total del perímetro fronterizo en Ceuta. Guardias desbordados y retirada hacia el casco urbano. Vídeo exclusivo sin censura. #AlertaCeutaJulio2026 #FronteraColapsada',
          isExactDuplicate: true,
          sharesOrRetweets: 3420
        },
        {
          id: 'p_ceuta_tg2',
          timestamp: '2026-07-18T03:40:00Z',
          text: 'Fallo deliberado de los sensores térmicos en el perímetro de Benzú. Orden política de no intervenir. Exigimos dimisiones inmediatas. #InvasionCeuta2026 #FalloFronterizo',
          isExactDuplicate: true,
          sharesOrRetweets: 2150
        }
      ]
    },
    geoOrigin: {
      country: 'Rusia (Salida VPS Selectel)',
      city: 'San Petersburgo',
      asn: 'AS48282',
      asName: 'Selectel Network / Dedicated VPS Hosting',
      asPrefix: '185.12.94.0/24',
      geoIpProvider: 'MaxMind GeoLite2 City (Confianza: 0.68)',
      confidence: 0.68,
      routeType: 'Commercial VPS / Hosting Egress Node',
      isVpnOrProxy: true,
      lat: 59.9343,
      lng: 30.3351
    },
    botProbability: 0.96,
    zombieAudit: {
      immutableUserId: '1940294102948',
      isZombieAccount: true,
      previousHandles: [
        {
          handle: '@crypto_signals_daily_tr',
          detectedRange: '2021-04 a 2025-09',
          language: 'Turco (TR)',
          topic: 'Spam de criptomonedas y airdrops'
        },
        {
          handle: '@fenerbahce_fan_channel',
          detectedRange: '2025-10 a 2026-02',
          language: 'Turco (TR)',
          topic: 'Fútbol y sorteos promocionales'
        }
      ],
      dormancyPeriodDays: 142,
      repurposedDate: '2026-07-02 (16 días antes del asalto ficticio)',
      marketEvidenceNote: 'ID numérico 1940294102948 registrado en 2021 en Turquía. Inactividad total de 142 días. Mutación brusca a español el 02/07/2026 con purga de 4.200 mensajes antiguos.',
      ja3TlsHash: 'e7d705a3286e19ea42f587b344ee6865 (Python/aiohttp)',
      deviceEntropy: 'Headless Chromium / Mesa Intel Virtual Driver (VPS Linux)'
    }
  });

  // Hub 2: Seed Coordinator on X/Twitter
  nodes.push({
    id: 'ceuta_hub_x',
    handle: '@CeutaEnPeligro_26',
    platform: 'x_twitter',
    displayName: 'Ceuta en Alerta Roja',
    type: 'coordinator',
    cibScore: 93,
    creationDate: '2026-07-02T10:30:00Z',
    accountAgeDays: 16,
    followersCount: 19500,
    followingCount: 6,
    followerFollowingRatio: 3250,
    totalPosts: 2980,
    postsPerDay: 186,
    louvainCommunity: 7,
    centrality: {
      degree: 32,
      betweenness: 0.89,
      pageRank: 0.26,
      clusteringCoefficient: 0.04
    },
    temporalMetrics: {
      medianIntervalSeconds: 30.0,
      intervalJitterSeconds: 0.22,
      burstCount: 39,
      nightActivityRatio: 0.54
    },
    contentMetrics: {
      exactCopyPasteRatio: 0.92,
      sentimentPolarizationIndex: 0.96,
      topHashTags: ['#AlertaCeutaJulio2026', '#InvasionCeuta2026', '#FalloFronterizo'],
      samplePosts: [
        {
          id: 'p_ceuta_x1',
          timestamp: '2026-07-18T02:15:08Z',
          text: 'ATENCIÓN: Imágenes en directo de Benzú y Tarajal. Aseguran que hay cientos atravesando sin control en este instante. Máxima difusión. #AlertaCeutaJulio2026',
          isExactDuplicate: true,
          sharesOrRetweets: 2890
        }
      ]
    },
    geoOrigin: {
      country: 'Marruecos (Pasarela móvil 4G)',
      city: 'Tánger',
      asn: 'AS36903',
      asName: 'Maroc Telecom 4G Mobile Gateway',
      asPrefix: '196.200.150.0/24',
      geoIpProvider: 'MaxMind GeoLite2 ASN (Confianza: 0.74)',
      confidence: 0.74,
      routeType: 'Residential Mobile 4G Gateway',
      isVpnOrProxy: true,
      lat: 35.7595,
      lng: -5.8340
    },
    botProbability: 0.94,
    zombieAudit: {
      immutableUserId: '1489201948201',
      isZombieAccount: true,
      previousHandles: [
        {
          handle: '@nft_drop_alert_kz',
          detectedRange: '2022-01 a 2025-11',
          language: 'Ruso / Kazajo',
          topic: 'Airdrops de coleccionables digitales'
        }
      ],
      dormancyPeriodDays: 210,
      repurposedDate: '2026-07-02',
      marketEvidenceNote: 'Comprada en lote en mercado negro. Mismo ID inmutable que promocionaba NFTs rusos. Renombrada el 2 de julio con biografía y avatar generados artificialmente.',
      ja3TlsHash: '6734f37431670b3ab4292b8f60f29984 (Selenium/Undetected)',
      deviceEntropy: 'Software Canvas Hash idéntico a 14 nodos bot de la misma granja'
    }
  });

  // 26 Automated Bot Amplifiers
  const botNames = [
    'PatrullaSur_901', 'Vigilante_Ceuta_02', 'IberiaAlert_2026', 'CentinelaSur_04',
    'FronteraViva_05', 'ResistenciaTarajal_06', 'VozFronteriza_07', 'EspartaSur_08',
    'AlertaBenzu_09', 'IberiaSegura_10', 'VanguardiaSur_11', 'EscudoCeuta_12',
    'FocoFrontera_13', 'PatriaVigilante_14', 'EcoSur_15', 'RadarFrontera_16',
    'CentinelaCeuta_17', 'VozIberica_18', 'AlertaDirecta_19', 'FronteraSur_20',
    'AlarmaNacional_21', 'Vigilancia24h_22', 'PulsoFronterizo_23', 'DefensaSur_24',
    'IberiaAlerta_25', 'CeutaDirecto_26'
  ];

  for (let i = 0; i < 26; i++) {
    const num = i + 1;
    const botId = `ceuta_bot_${num < 10 ? '0' + num : num}`;
    const jitter = Number((0.12 + (i * 0.04) % 0.25).toFixed(2)); // Sub-second zero jitter
    const isMeta = i % 3 === 0;
    const platform = isMeta ? 'meta' : 'x_twitter';

    nodes.push({
      id: botId,
      handle: `@${botNames[i]}`,
      platform,
      displayName: `Difusión Alerta Sur ${num}`,
      type: 'bot',
      cibScore: 86 + (i % 9),
      creationDate: '2026-07-05T00:00:00Z',
      accountAgeDays: 13,
      followersCount: 2 + (i % 5),
      followingCount: 1950 + i * 40,
      followerFollowingRatio: 0.0015,
      totalPosts: 850 + i * 45,
      postsPerDay: 85,
      louvainCommunity: 7,
      centrality: {
        degree: 4,
        betweenness: 0.008,
        pageRank: 0.014,
        clusteringCoefficient: 0.01
      },
      temporalMetrics: {
        medianIntervalSeconds: 30.0,
        intervalJitterSeconds: jitter,
        burstCount: 32,
        nightActivityRatio: 0.52
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.95,
        sentimentPolarizationIndex: 0.92,
        topHashTags: ['#AlertaCeutaJulio2026', '#FronteraColapsada'],
        samplePosts: [
          {
            id: `p_ceuta_bot_${num}`,
            timestamp: `2026-07-18T02:15:${(10 + (i % 12)).toString().padStart(2, '0')}Z`,
            text: 'URGENTE: Colapso del vallado de Ceuta esta noche. Guardias desbordados y retirada de agentes. Compartan antes de que lo censuren. #AlertaCeutaJulio2026 #FronteraColapsada',
            isExactDuplicate: true,
            sharesOrRetweets: 2
          }
        ]
      },
      geoOrigin: {
        country: i % 2 === 0 ? 'Rusia (VPS Comercial Selectel)' : 'Marruecos (Pasarela móvil 4G)',
        city: i % 2 === 0 ? 'San Petersburgo' : 'Tánger',
        asn: i % 2 === 0 ? 'AS48282' : 'AS36903',
        asName: i % 2 === 0 ? 'Selectel Network VPS Egress' : 'Maroc Telecom 4G Gateway',
        asPrefix: i % 2 === 0 ? '185.12.94.0/24' : '196.200.150.0/24',
        geoIpProvider: i % 2 === 0 ? 'MaxMind GeoLite2 City (Confianza: 0.68)' : 'MaxMind GeoLite2 ASN (Confianza: 0.74)',
        confidence: i % 2 === 0 ? 0.68 : 0.74,
        routeType: i % 2 === 0 ? 'Commercial VPS / Hosting Egress Node' : 'Residential Mobile 4G Gateway',
        isVpnOrProxy: true,
        lat: i % 2 === 0 ? 59.9343 : 35.7595,
        lng: i % 2 === 0 ? 30.3351 : -5.8340
      },
      botProbability: Number((0.91 + (i % 7) * 0.01).toFixed(2)),
      zombieAudit: {
        immutableUserId: `10892019482${num < 10 ? '0' + num : num}`,
        isZombieAccount: i % 3 === 0, // 1 of every 3 is an acquired dormant account, others are freshly registered disposable bots
        previousHandles:
          i % 3 === 0
            ? [
                {
                  handle: `@gamer_drop_${num * 14}`,
                  detectedRange: '2023-05 a 2025-12',
                  language: 'Ruso / Turco',
                  topic: 'Intercambio de skins y bots de Discord'
                }
              ]
            : [],
        dormancyPeriodDays: i % 3 === 0 ? 180 + (i * 12) : 0,
        repurposedDate: i % 3 === 0 ? '2026-07-05' : 'N/A (Cuenta nueva de un solo uso)',
        marketEvidenceNote:
          i % 3 === 0
            ? 'Cuenta zombi comprada en lote; biografía previa eliminada y activación súbita en español.'
            : 'Granja automatizada: registro masivo con correos temporales desechables y misma huella de software.',
        ja3TlsHash: '771,4865-4866-4867-49195-49199,0-23-65281-10-11,29-23-24,0 (urllib3/Python-requests)',
        deviceEntropy: 'Virtual Mesa Intel HD (Software WebGL Render / VPS Headless)'
      }
    });

    // Edge from Telegram seed
    edges.push({
      id: `edge_ceuta_tg_${num}`,
      source: 'ceuta_hub_tg',
      target: botId,
      type: 'forward',
      weight: 14 + (i % 6),
      timestamp: `2026-07-18T02:15:${(10 + (i % 12)).toString().padStart(2, '0')}Z`,
      isBurstEdge: true
    });

    // Edge from X seed
    edges.push({
      id: `edge_ceuta_x_${num}`,
      source: 'ceuta_hub_x',
      target: botId,
      type: 'retweet',
      weight: 18 + (i % 4),
      timestamp: `2026-07-18T02:15:${(12 + (i % 10)).toString().padStart(2, '0')}Z`,
      isBurstEdge: true
    });
  }

  // 8 Organic, Official & Fact-Checking Accounts
  const organicAccounts = [
    {
      id: 'ceuta_org_1',
      handle: '@VerificaCeuta_FactCheck',
      name: 'Equipo Verificación Digital Ceuta',
      followers: 42100,
      following: 340,
      posts: 6800,
      sampleText: 'DESMENTIDO URGENTE: El vídeo viral sobre un supuesto asalto armado esta madrugada en el vallado de Ceuta NO corresponde a hoy. Corresponde a sucesos de 2018 con metadatos alterados. No difundan desinformación.',
      city: 'Ceuta',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_2',
      handle: '@CruzRojaCeuta_Oficial',
      name: 'Cruz Roja Española Ceuta',
      followers: 29800,
      following: 280,
      posts: 5400,
      sampleText: 'Actualización 03:30h: Situación de absoluta normalidad en la frontera del Tarajal. Nuestros equipos de guardia confirman que no ha habido incidentes ni heridos esta noche.',
      city: 'Ceuta',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_3',
      handle: '@PeriodistaCeuta_M',
      name: 'Manuel Alarcón (Cronista Ceuta)',
      followers: 16400,
      following: 890,
      posts: 18200,
      sampleText: 'Desde el Tarajal: tranquilidad absoluta. No hay movimientos inusuales de la Guardia Civil ni de las fuerzas auxiliares marroquíes. Circulan bulos graves en redes sociales.',
      city: 'Ceuta',
      asn: 'AS12430-VODAFONE'
    },
    {
      id: 'ceuta_org_4',
      handle: '@Emergencias_Ceuta112',
      name: 'Centro Coordinación 112 Ceuta',
      followers: 52000,
      following: 110,
      posts: 9200,
      sampleText: 'AVISO OFICIAL: Desmentimos categóricamente las alertas de colapso fronterizo difundidas en canales de mensajería. Servicios de emergencia operan bajo protocolo ordinario.',
      city: 'Ceuta',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_5',
      handle: '@VecinosTarajal_Org',
      name: 'Asociación Vecinal Tarajal y Benzú',
      followers: 3800,
      following: 420,
      posts: 2100,
      sampleText: 'Vecinos de la zona confirmamos que todo está en calma. Desconocemos de dónde salen los vídeos que circulan en X con sirenas y fuego.',
      city: 'Ceuta',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_6',
      handle: '@MalditaBulo_Fronteras',
      name: 'Maldita.es Verificación Fronteriza',
      followers: 184000,
      following: 950,
      posts: 34000,
      sampleText: 'BULO: Ni hay salto masivo con armas químicas en Ceuta ni se ha ordenado retirada de agentes. Desmontamos el vídeo descontextualizado y la cadena de bots en este hilo.',
      city: 'Madrid',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_7',
      handle: '@ElFaroDeCeuta_News',
      name: 'El Faro de Ceuta Digital',
      followers: 61000,
      following: 620,
      posts: 42000,
      sampleText: 'CRÓNICA: La noche en el vallado transcurre sin incidencias mientras una campaña orquestada en redes difunde vídeos de 2018 para generar alarma social.',
      city: 'Ceuta',
      asn: 'AS3352-TELEFONICA'
    },
    {
      id: 'ceuta_org_8',
      handle: '@ObservatorioFronteraSur',
      name: 'Observatorio DDHH Frontera Sur',
      followers: 24500,
      following: 580,
      posts: 7800,
      sampleText: 'Advertimos del uso instrumental de la frontera para campañas de desinformación tóxica que solo buscan azuzar el odio y la xenofobia con imágenes falsas.',
      city: 'Sevilla',
      asn: 'AS3352-TELEFONICA'
    }
  ];

  organicAccounts.forEach((org, idx) => {
    nodes.push({
      id: org.id,
      handle: org.handle,
      platform: 'x_twitter',
      displayName: org.name,
      type: 'organic',
      cibScore: 4 + (idx * 2), // Low organic score (4 to 18)
      creationDate: '2019-02-15T12:00:00Z',
      accountAgeDays: 2710,
      followersCount: org.followers,
      followingCount: org.following,
      followerFollowingRatio: Number((org.followers / Math.max(1, org.following)).toFixed(2)),
      totalPosts: org.posts,
      postsPerDay: 5.2,
      louvainCommunity: 8,
      centrality: {
        degree: 9,
        betweenness: 0.42,
        pageRank: 0.16,
        clusteringCoefficient: 0.48
      },
      temporalMetrics: {
        medianIntervalSeconds: 1800.0,
        intervalJitterSeconds: 650.0, // Natural human variance
        burstCount: 1,
        nightActivityRatio: 0.04
      },
      contentMetrics: {
        exactCopyPasteRatio: 0.01,
        sentimentPolarizationIndex: 0.18,
        topHashTags: ['#Ceuta', '#Verificación', '#BuloFrontera', '#FactCheck'],
        samplePosts: [
          {
            id: `p_ceuta_org_${idx + 1}`,
            timestamp: `2026-07-18T03:${(20 + idx * 5).toString().padStart(2, '0')}:00Z`,
            text: org.sampleText,
            isExactDuplicate: false,
            sharesOrRetweets: 740 + idx * 110
          }
        ]
      },
      geoOrigin: {
        country: 'España',
        city: org.city,
        asn: org.asn.split('-')[0],
        asName: org.asn.includes('VODAFONE') ? 'Vodafone España S.A.U.' : 'Telefónica de España S.A.U.',
        asPrefix: org.asn.includes('VODAFONE') ? '212.166.0.0/16' : '80.58.0.0/16',
        geoIpProvider: 'MaxMind GeoLite2 ASN (Confianza: 0.98)',
        confidence: 0.98,
        routeType: 'Broadband Domestic ISP / Residential Fiber',
        isVpnOrProxy: false,
        lat: 35.8894,
        lng: -5.3213
      },
      botProbability: Number((0.02 + idx * 0.01).toFixed(2)),
      zombieAudit: {
        immutableUserId: `3049182049${idx}`,
        isZombieAccount: false,
        previousHandles: [],
        dormancyPeriodDays: 0,
        repurposedDate: 'N/A (Identidad digital legítima y continua)',
        marketEvidenceNote: 'Sin indicios de mutación: cuenta original creada en 2019, actividad regular humana con fluctuación horaria natural y sin cambios de idioma.',
        ja3TlsHash: 'b32309a26ce5161587f0d778ac9f7385 (Navegador Residencial Móvil / iOS Safari)',
        deviceEntropy: 'Hardware nativo verificado (A16 Bionic GPU / Pantalla física real)'
      }
    });

    // Inter-organic dialogue edges
    if (idx > 0) {
      edges.push({
        id: `edge_ceuta_org_dialogue_${idx}`,
        source: organicAccounts[idx - 1].id,
        target: org.id,
        type: 'reply',
        weight: 6,
        timestamp: `2026-07-18T03:35:00Z`,
        isBurstEdge: false
      });
    }

    // Fact-checkers quote-refuting the coordinator seed on X
    if (idx === 0 || idx === 5) {
      edges.push({
        id: `edge_ceuta_refute_quote_${idx}`,
        source: org.id,
        target: 'ceuta_hub_x',
        type: 'quote',
        weight: 24,
        timestamp: '2026-07-18T03:22:00Z',
        isBurstEdge: false
      });
    }
  });

  return { nodes, edges };
}

function generateCeutaBurstEvents(nodes: SocialAccountNode[]): BurstEventRecord[] {
  const events: BurstEventRecord[] = [];
  const seedText = 'URGENTE: Colapso del vallado de Ceuta esta noche. Guardias desbordados y retirada hacia el casco urbano. Compartan antes de que lo censuren. #AlertaCeutaJulio2026 #FronteraColapsada';
  const seedSha256 = 'd6948b4e78a6358175d65f576e82847c1341c309859f518e9d569be01524e03b';
  
  // Event 1: Seed Coordinator Telegram (t_0)
  events.push({
    eventId: 'evt_burst_001',
    nodeId: 'ceuta_hub_tg',
    handle: '@AlertaFronteraSur_Real',
    platform: 'telegram',
    timestampUtc: '2026-07-18T02:15:02.120Z',
    deltaTSeconds: 0.000,
    textSha256: seedSha256,
    normalizedText: seedText,
    jaccardSimilarityToSeed: 1.00,
    sourceClockNtpRef: 'NTP Stratum 1 (time.cloudflare.com) [±0.045s]',
    postIdOrUrl: 'https://t.me/AlertaFronteraSur_Real/8812'
  });

  // Event 2: Seed Coordinator X (t_0 + 0.181s)
  events.push({
    eventId: 'evt_burst_002',
    nodeId: 'ceuta_hub_x',
    handle: '@CeutaEnPeligro_26',
    platform: 'x_twitter',
    timestampUtc: '2026-07-18T02:15:02.301Z',
    deltaTSeconds: 0.181,
    textSha256: seedSha256,
    normalizedText: seedText,
    jaccardSimilarityToSeed: 0.99,
    sourceClockNtpRef: 'NTP Stratum 1 (time.cloudflare.com) [±0.045s]',
    postIdOrUrl: 'https://x.com/CeutaEnPeligro_26/status/19401928410294819'
  });

  // Events 3 to 28: 26 Bots in rapid succession (deltaT up to 16.20s)
  const botNodes = nodes.filter(n => n.type === 'bot');
  const deltaOffsets = [
    0.298, 0.354, 0.491, 0.612, 0.785, 0.940, 1.150, 1.380, 1.620, 1.950,
    2.410, 2.920, 3.480, 4.120, 4.850, 5.610, 6.420, 7.310, 8.290, 9.410,
    10.580, 11.820, 13.140, 14.390, 15.280, 16.200
  ];

  for (let i = 0; i < 26 && i < botNodes.length; i++) {
    const node = botNodes[i];
    const delta = deltaOffsets[i];
    const totalMs = 2120 + Math.round(delta * 1000);
    const sec = Math.floor(totalMs / 1000);
    const ms = totalMs % 1000;
    const timeStr = `2026-07-18T02:15:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}Z`;
    
    const isSlightVariation = i % 5 === 0;
    const postText = isSlightVariation 
      ? 'URGENTE: Colapso del vallado de Ceuta esta noche. Guardias desbordados y retirada de agentes hacia el casco urbano. Máxima difusión. #AlertaCeutaJulio2026 #FronteraColapsada'
      : seedText;
    const postHash = isSlightVariation
      ? 'e84129b01948ac38192847192847192837461928374619283746192837461928'
      : seedSha256;

    events.push({
      eventId: `evt_burst_${(i + 3).toString().padStart(3, '0')}`,
      nodeId: node.id,
      handle: node.handle,
      platform: node.platform,
      timestampUtc: timeStr,
      deltaTSeconds: delta,
      textSha256: postHash,
      normalizedText: postText,
      jaccardSimilarityToSeed: isSlightVariation ? 0.96 : 1.00,
      sourceClockNtpRef: 'NTP Stratum 1 (time.cloudflare.com) [±0.045s]',
      postIdOrUrl: `https://${node.platform === 'meta' ? 'facebook.com' : 'x.com'}/${node.handle.replace('@', '')}/post/994820194${i}`
    });
  }

  return events;
}

const CEUTA_CONFIDENCE_MATRIX: ConfidenceMatrixItem[] = [
  {
    dimension: '1. Coordinación Topológica de Red',
    confidenceLevel: 'HIGH',
    technicalGrounding: 'Arquitectura Hub-and-Spoke con 2 coordinadores semilla, reciprocidad nula (< 0.03), modularidad Louvain Q=0.64 y centralidad concentrada.',
    caveatsAndLimitations: 'Evaluado sobre el subgrafo de 36 cuentas activas capturadas en el intervalo de ráfaga.'
  },
  {
    dimension: '2. Sincronía Temporal en Micro-ráfagas',
    confidenceLevel: 'HIGH',
    technicalGrounding: '28 publicaciones idénticas emitidas en 16.20 segundos. Cron-jitter submétrico medio de 0.18s medido con reloj NTP Stratum 1 (margen de error ±0.045s). Descarta interacción humana manual.',
    caveatsAndLimitations: 'Las latencias de red y colas de scraping introducen un margen de medición de ±45 milisegundos.'
  },
  {
    dimension: '3. Duplicación Textual y Astroturfing',
    confidenceLevel: 'HIGH',
    technicalGrounding: 'Índice de similitud léxica Jaccard > 0.95 y solapamiento n-grama exacto en 28 publicaciones sobre la misma plantilla sintáctica.',
    caveatsAndLimitations: 'No se descarta que usuarios no automatizados puedan copiar y pegar compulsivamente textos alarmistas.'
  },
  {
    dimension: '4. Detección de Automatización (Clasificador)',
    confidenceLevel: 'HIGH',
    technicalGrounding: 'Modelo AegisNet-CIB-v1.2 (Random Forest + GNN): P(inauténtico) = 0.94. Huellas TLS JA3 compatibles con scripts de peticiones masivas (Python urllib3/aiohttp) y desvío horario 24/7.',
    caveatsAndLimitations: 'Falsos positivos estimados del 3.8% en el benchmark de validación del clasificador.'
  },
  {
    dimension: '5. Origen de Infraestructura BGP',
    confidenceLevel: 'MEDIUM',
    technicalGrounding: 'Geolocalización MaxMind GeoLite2 de prefijos de salida: AS48282 (Selectel VPS Rusia, prefijo 185.12.94.0/24) y AS36903 (Maroc Telecom 4G, prefijo 196.200.150.0/24).',
    caveatsAndLimitations: 'Las IPs corresponden a servidores comerciales y proxies de salida. No prueban la ubicación física real ni la nacionalidad del operador.'
  },
  {
    dimension: '6. Atribución Geopolítica / Estatal',
    confidenceLevel: 'UNKNOWN_UNVERIFIED',
    technicalGrounding: 'FUERA DEL ALCANCE TÉCNICO DE TELEMETRÍA. El alquiler de servidores comerciales en Rusia o el tráfico a través de proxies marroquíes está al alcance de cualquier actor privado, delincuencial o de desinformación.',
    caveatsAndLimitations: 'NO PROCEDE atribución a servicios de inteligencia o Estados soberanos sin evidencia judicial o inteligencia de señales (SIGINT).'
  },
  {
    dimension: '7. Intencionalidad Política o Dolo',
    confidenceLevel: 'UNKNOWN_UNVERIFIED',
    technicalGrounding: 'La ciencia de datos evalúa exclusivamente correlaciones estadísticas de difusión y anomalías técnicas, no la intencionalidad penal ni la motivación subjetiva.',
    caveatsAndLimitations: 'La intención es una categoría jurídica e investigativa externa al análisis algorítmico.'
  }
];

const CEUTA_CLASSIFIER_BENCHMARK: ClassifierBenchmark = {
  modelName: 'AegisNet-CIB-v1.2 (Ensemble Random Forest + Graph Neural Network)',
  trainingDataset: 'Twitter-CIB-2024-Open + Telegram-Disinfo-Benchmark (N=45.000 nodos verificados)',
  precision: 0.92,
  recall: 0.89,
  f1Score: 0.904,
  decisionThreshold: 0.78,
  featuresUsed: [
    'interval_jitter_seconds (peso: 0.28)',
    'exact_copypaste_ratio (peso: 0.22)',
    'betweenness_centrality (peso: 0.18)',
    'follower_following_ratio (peso: 0.12)',
    'night_activity_ratio (peso: 0.10)',
    'ja3_tls_script_fingerprint (peso: 0.10)'
  ]
};

const CEUTA_CHAIN_OF_CUSTODY: ChainOfCustodyStep[] = [
  {
    step: 1,
    phase: 'Observación y Alerta de Telemetría',
    timestampUtc: '2026-07-18T02:15:02.120Z',
    actor: 'AegisNet Real-Time Ingestion Daemon (Cluster EU-South)',
    evidenceHashSha256: '4f29a0b812de45c789123456789abcdef0123456789abcdef0123456789abcde',
    actionDescription: 'Trigger automático por superación de umbral de aceleración de menciones (#AlertaCeutaJulio2026 > 15 posts/s).'
  },
  {
    step: 2,
    phase: 'Captura en Crudo WORM (Write-Once-Read-Many)',
    timestampUtc: '2026-07-18T02:16:30.000Z',
    actor: 'Forensic Storage Vault / S3 Immutable Object Lock',
    evidenceHashSha256: '7f91a4b82c03ef1804d9a5441e86a0129bc61023d8c11578e9bf9b5d40a23e19',
    actionDescription: 'Almacenamiento de 34.850 eventos en crudo con cabeceras HTTP, sockets TLS y hashes de payload.'
  },
  {
    step: 3,
    phase: 'Sellado Criptográfico y Fijación de Hash',
    timestampUtc: '2026-07-18T02:18:00.000Z',
    actor: 'AegisNet Cryptographic Integrity Service',
    evidenceHashSha256: '7f91a4b82c03ef1804d9a5441e86a0129bc61023d8c11578e9bf9b5d40a23e19',
    actionDescription: 'Generación del digest SHA-256 inmutable de 64 caracteres para garantía procesal de no manipulación.'
  },
  {
    step: 4,
    phase: 'Procesamiento Topológico y Clasificación Algorítmica',
    timestampUtc: '2026-07-18T02:25:40.000Z',
    actor: 'CIB Analytics Engine v1.2 (Graph Neural Network + NLP)',
    evidenceHashSha256: 'b18e742918bc309f485721098471928374619283746192837461928374619283',
    actionDescription: 'Extracción de subgrafo de 36 nodos, cálculo de modularidad Louvain y cotejo perceptual pHash del material audiovisual.'
  },
  {
    step: 5,
    phase: 'Emisión de Dossier Técnico OSINT',
    timestampUtc: '2026-08-30T07:50:00.000Z',
    actor: 'Perito / Analista Principal AegisNet',
    evidenceHashSha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    actionDescription: 'Publicación de informe pericial técnico preliminar con escala de confianza y datos primarios abiertos.'
  }
];

const cCeutaData = generateCeutaCampaignData();
const c1Data = generateCampaign1Data();
const c2Data = generateCampaign2Data();
const c3Data = generateCampaign3Data();

export const DEMO_CAMPAIGNS: InvestigationCampaign[] = [
  {
    id: 'camp_ceuta_valla_2026',
    title: 'Incidente Monitorizado: Difusión Coordinada Anómala en Torno a la Frontera de Ceuta (Julio 2026)',
    electoralContext: 'Seguridad Fronteriza, Inmigración & Desestabilización en Tiempo Real',
    electoralProcess: 'Crisis Fronteriza Ceuta (Julio 2026)',
    status: 'INVESTIGATION_ONGOING',
    reportClassification: 'PRELIMINARY_OSINT_REPORT',
    investigationCode: 'AEGIS-2026-CEUTA-07F',
    createdAt: '2026-07-18T04:00:00Z',
    datasetSha256: '7f91a4b82c03ef1804d9a5441e86a0129bc61023d8c11578e9bf9b5d40a23e19',
    targetPlatforms: ['x_twitter', 'telegram', 'meta', 'youtube'],
    totalCollectedEvents: 34850,
    summaryDescription: 'Informe pericial preliminar de telemetría de red. Se identificó un patrón de difusión anómalo durante la madrugada del 18 de julio de 2026 en torno a la frontera de Ceuta (Benzú y Tarajal). El análisis cuantitativo detectó 2 nodos coordinadores semilla en Telegram y X articulados con 26 cuentas automatizadas que inyectaron réplicas con un desvío temporal submétrico (jitter < 0.35s). Se constata la reutilización de material audiovisual de 2018 mediante cotejo perceptual (pHash 99.4%). El enrutamiento de salida se realizó a través de servidores comerciales (Selectel AS48282) y pasarelas móviles 4G (Maroc Telecom AS36903). Conforme a los estándares forenses, estos datos evidencian automatización e inautenticidad técnica, pero no permiten acreditar autoría estatal ni imputación jurídica.',
    cibBreakdown: {
      overallScore: 91,
      topologicalScore: 93,
      temporalScore: 95,
      semanticScore: 92,
      metadataScore: 84,
      riskLevel: 'CONFIRMED_CIB',
      verdictDescription: 'Evidencia técnica cuantitativa compatible con Comportamiento Inauténtico Coordinado (CIB). Red Hub-and-Spoke de 36 nodos con inyección artificial en dos oleadas nocturnas (02:15 y 03:40 UTC). Se identifica coincidencia perceptual audiovisual (pHash 99.4%) con metraje histórico de 2018 y sincronía temporal de milisegundos (cron-jitter submétrico medio de 0.18s). La geolocalización de IPs en AS48282 y AS36903 demuestra el empleo de proxies y servidores de alojamiento comercial; la telemetría técnica no permite imputar la autoría física ni la nacionalidad de los operadores.'
    },
    nodes: cCeutaData.nodes,
    edges: cCeutaData.edges,
    confidenceMatrix: CEUTA_CONFIDENCE_MATRIX,
    classifierBenchmark: CEUTA_CLASSIFIER_BENCHMARK,
    chainOfCustody: CEUTA_CHAIN_OF_CUSTODY,
    burstEvents: generateCeutaBurstEvents(cCeutaData.nodes),
    astroturfClusters: [
      {
        id: 'cluster_ceuta_01',
        seedText: 'URGENTE: Colapso del vallado de Ceuta esta noche. Guardias desbordados y retirada de agentes hacia el casco urbano. Compartan antes de que lo censuren. #AlertaCeutaJulio2026 #FronteraColapsada',
        occurrenceCount: 28,
        accountIds: ['ceuta_hub_tg', 'ceuta_hub_x', 'ceuta_bot_01', 'ceuta_bot_02', 'ceuta_bot_03', 'ceuta_bot_04', 'ceuta_bot_05'],
        firstSeen: '2026-07-18T02:15:02Z',
        lastSeen: '2026-07-18T02:15:18Z',
        timeSpanMinutes: 0.27, // 16 seconds!
        averageSimilarity: 0.98,
        targetNarrative: 'Inducción de pánico sobre invasión incontrolada y supuesta retirada de fuerzas de seguridad',
        isDescontextualizedMedia: true // Video from 2018 recycled
      },
      {
        id: 'cluster_ceuta_02',
        seedText: 'Fallo deliberado de los sensores térmicos en el perímetro de Benzú. Orden política de no intervenir. Exigimos dimisiones inmediatas. #InvasionCeuta2026 #FalloFronterizo',
        occurrenceCount: 21,
        accountIds: ['ceuta_hub_tg', 'ceuta_bot_06', 'ceuta_bot_07', 'ceuta_bot_08', 'ceuta_bot_09'],
        firstSeen: '2026-07-18T03:40:00Z',
        lastSeen: '2026-07-18T03:40:22Z',
        timeSpanMinutes: 0.36, // 22 seconds!
        averageSimilarity: 0.95,
        targetNarrative: 'Deslegitimación de las fuerzas y cuerpos de seguridad y acusaciones de complicidad institucional',
        isDescontextualizedMedia: false
      }
    ],
    geopoliticalVectors: [
      {
        id: 'geo_vec_ceuta_1',
        originCountry: 'Infraestructura VPS Egress (AS48282 Selectel, San Petersburgo)',
        originCoords: [59.9343, 30.3351],
        targetRegion: 'Ceuta (España) / Frontera Sur Unión Europea',
        targetCoords: [35.8894, -5.3213],
        primaryLanguage: 'Español (traducción asistida y sintaxis de bot)',
        targetElectoralProcessOrTopic: 'Desestabilización fronteriza y polarización sobre inmigración',
        estimatedReach: 680000,
        activeBotNodes: 22,
        infrastructureNotes: 'Cluster de servidores comerciales dedicados que inyectan contenido en Telegram y orquestan cuentas de bot en X/Twitter emulando usuarios residentes en España con user-agents móviles falsificados.'
      },
      {
        id: 'geo_vec_ceuta_2',
        originCountry: 'Pasarela Móvil 4G Egress (AS36903 Maroc Telecom, Tánger)',
        originCoords: [35.7595, -5.8340],
        targetRegion: 'Ceuta & Opinión Pública Nacional Española',
        targetCoords: [35.8894, -5.3213],
        primaryLanguage: 'Español y Francés',
        targetElectoralProcessOrTopic: 'Simulación de testigos presenciales locales en las inmediaciones del vallado',
        estimatedReach: 310000,
        activeBotNodes: 6,
        infrastructureNotes: 'Red de proxies comerciales rotativos con geolocalización IP en operador móvil residencial para burlar sistemas de detección por geocercas y dar apariencia de testimonios locales auténticos.'
      }
    ],
    disarmTactics: [
      {
        techniqueId: 'T0043',
        techniqueName: 'Reciclaje y Distorsión Audiovisual Histórica',
        tacticPhase: 'Desarrollo de Contenido',
        confidence: 'CONFIRMED',
        evidenceProof: 'Discrepancia temporal pericial: Vídeo viral difundido a las 02:15 CET del 18-07-2026 coincide al 99.4% en pHash con metraje de RTVE del asalto al perímetro de Ceuta del 26 de julio de 2018.'
      },
      {
        techniqueId: 'T0087',
        techniqueName: 'Difusión Coordinada en Micro-ráfagas (Zero-Jitter)',
        tacticPhase: 'Amplificación Inauténtica',
        confidence: 'CONFIRMED',
        evidenceProof: '26 bots ejecutando réplicas con un desvío estándar de reloj inferior a 0.25 segundos entre las 02:15:10 y las 02:15:22 CET (automatización por script/cron).'
      },
      {
        techniqueId: 'T0014',
        techniqueName: 'Adquisición de Cuentas Zombi en Mercado Negro',
        tacticPhase: 'Establecimiento de Infraestructura',
        confidence: 'CONFIRMED',
        evidenceProof: 'El nodo coordinador @AlertaFronteraSur_Real conserva el ID numérico inmutable 1940294102948 que hasta mayo operaba en turco como canal de airdrops tras 142 días inactivo.'
      },
      {
        techniqueId: 'T0028',
        techniqueName: 'Astroturfing de Plantillas Textuales Idénticas',
        tacticPhase: 'Amplificación Inauténtica',
        confidence: 'CONFIRMED',
        evidenceProof: '28 réplicas textuales con índice de similitud Jaccard del 98% con el hashtag inductor #AlertaCeutaJulio2026.'
      },
      {
        techniqueId: 'T0092',
        techniqueName: 'Ofuscación de Origen mediante Proxies Residenciales 4G',
        tacticPhase: 'Evasión de Detección',
        confidence: 'HIGH',
        evidenceProof: 'IPs egress de pasarela móvil comercial (AS36903 Marruecos) combinadas con VPS de alojamiento comercial (AS48282 Selectel). No constituye prueba de autoría estatal.'
      }
    ],
    exifForensics: [
      {
        id: 'exif_ceuta_01',
        filename: 'valla_ceuta_urgente_0215am.mp4',
        mediaHashPHash: 'd41d8cd98f00b204e9800998ecf8427e_pHash:9f8e7d6c5b4a3921',
        exifStripped: true,
        claimedContext: 'Asalto masivo armado en directo en el perímetro de Benzú (18/07/2026 02:15 CET)',
        trueOriginContext: 'Archivo Audiovisual RTVE / EFE: Salto de la valla de Ceuta ocurrido el 26/07/2018',
        historicalArchiveMatch: 'RTVE Archivo Histórico ID: VID-20180726-CEUTA-0881',
        matchPercentage: 99.4,
        elaIntegrityScore: 18,
        verdict: 'MANIPULACIÓN CONFIRMADA: Metadatos EXIF borrados deliberadamente con herramientas de stripping. Recorte de franja inferior para eliminar el rótulo de telediario de 2018.'
      }
    ]
  },
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
