/**
 * AegisNet-BotRadar: Sistema Analítico Open-Source y Apartidista
 * Definiciones de tipos para topología de redes, métricas CIB, heurísticas temporales y PLN.
 * Copyright © M. Castillo — Contacto: mailto:aegis.info@viajeinteligencia.com
 */

export type PlatformType = 'x_twitter' | 'telegram' | 'meta' | 'youtube';

export type NodeType = 'organic' | 'bot' | 'coordinator' | 'amplifier' | 'suspicious';

export interface SocialAccountNode {
  id: string;
  handle: string;
  platform: PlatformType;
  displayName: string;
  avatarUrl?: string;
  type: NodeType;
  cibScore: number; // 0 - 100
  creationDate: string; // ISO string
  accountAgeDays: number;
  followersCount: number;
  followingCount: number;
  followerFollowingRatio: number;
  totalPosts: number;
  postsPerDay: number;
  louvainCommunity: number;
  centrality: {
    degree: number;
    betweenness: number;
    pageRank: number;
    clusteringCoefficient: number;
  };
  temporalMetrics: {
    medianIntervalSeconds: number;
    intervalJitterSeconds: number; // Low jitter (< 2s) implies API/cron automation
    burstCount: number;
    nightActivityRatio: number; // Automated bots often maintain 24/7 flat activity
  };
  contentMetrics: {
    exactCopyPasteRatio: number; // 0.0 - 1.0
    sentimentPolarizationIndex: number;
    topHashTags: string[];
    samplePosts: Array<{
      id: string;
      timestamp: string;
      text: string;
      isExactDuplicate: boolean;
      sharesOrRetweets: number;
    }>;
  };
  geoOrigin?: {
    country: string;
    city?: string;
    asn?: string;
    asName?: string;
    asPrefix?: string;
    geoIpProvider?: string;
    confidence?: number;
    routeType?: string; // e.g. 'Commercial VPS / Egress' | 'Residential 4G Gateway' | 'Broadband ISP'
    isVpnOrProxy: boolean;
    lat: number;
    lng: number;
  };
  botProbability?: number; // Estimated probability [0.0 - 1.0] from classifier benchmark
  zombieAudit?: AccountMutationAudit;
  // Coordinates for graph visualization
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'retweet' | 'mention' | 'reply' | 'forward' | 'quote';
  weight: number;
  timestamp: string;
  isBurstEdge: boolean;
}

export interface CIBBreakdown {
  overallScore: number; // 0 - 100
  topologicalScore: number; // 0 - 100 (Hub-and-spoke density, centralization)
  temporalScore: number; // 0 - 100 (Zero-jitter interval, burst intensity)
  semanticScore: number; // 0 - 100 (Astroturf copy-paste, lexical duplication)
  metadataScore: number; // 0 - 100 (Account age anomaly, follower-following skew)
  riskLevel: 'LOW_ORGANIC' | 'SUSPICIOUS' | 'CONFIRMED_CIB';
  verdictDescription: string;
}

export interface AstroturfCluster {
  id: string;
  seedText: string;
  occurrenceCount: number;
  accountIds: string[];
  firstSeen: string;
  lastSeen: string;
  timeSpanMinutes: number;
  averageSimilarity: number; // 0.0 - 1.0 (Levenshtein/Jaccard)
  targetNarrative: string;
  isDescontextualizedMedia: boolean;
}

export interface GeopoliticalVector {
  id: string;
  originCountry: string;
  originCoords: [number, number]; // [lat, lng]
  targetRegion: string;
  targetCoords: [number, number];
  primaryLanguage: string;
  targetElectoralProcessOrTopic: string;
  estimatedReach: number;
  activeBotNodes: number;
  infrastructureNotes: string; // e.g. "Cluster de servidores bulletproof en..."
}

export interface ConfidenceMatrixItem {
  dimension: string; // e.g. "Coordinación de Red", "Sincronía Temporal", "Atribución Geopolítica"
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN_UNVERIFIED';
  technicalGrounding: string;
  caveatsAndLimitations: string;
}

export interface BurstEventRecord {
  eventId: string;
  nodeId: string;
  handle: string;
  platform: PlatformType;
  timestampUtc: string; // e.g. "2026-07-18T02:15:01.120Z"
  deltaTSeconds: number; // relative to t_0
  textSha256: string; // 64-char full SHA-256
  normalizedText: string;
  jaccardSimilarityToSeed: number; // 0.0 - 1.0
  sourceClockNtpRef: string; // e.g. "NTP Stratum 1 (time.cloudflare.com) [±0.045s]"
  postIdOrUrl: string;
}

export interface ClassifierBenchmark {
  modelName: string;
  trainingDataset: string;
  precision: number;
  recall: number;
  f1Score: number;
  decisionThreshold: number;
  featuresUsed: string[];
}

export interface ChainOfCustodyStep {
  step: number;
  phase: string;
  timestampUtc: string;
  actor: string;
  evidenceHashSha256: string;
  actionDescription: string;
}

export interface CasoHallazgo {
  tipo: string;
  canal: string;
  titulo: string;
  url?: string;
  fuente: string;
  entidad: string;
  nivel_verificacion: 'HECHO' | 'HIPOTESIS' | 'PREGUNTA';
  fecha_evento?: string;
  ts?: string;
  señal_severa?: boolean;
  envio_masivo?: boolean;
}

export interface InvestigationCampaign {
  id: string;
  title: string;
  electoralProcess: string;
  electoralContext?: string;
  status: 'ACTIVE_ALERT' | 'INVESTIGATION_ONGOING' | 'ARCHIVED';
  reportClassification?: 'PRELIMINARY_OSINT_REPORT' | 'ACTIVE_AUDIT' | 'DEMO_TELEMETRY';
  investigationCode: string; // e.g. "AEGIS-2026-ELX-09"
  createdAt: string;
  datasetSha256: string; // 64-char SHA-256 hash
  targetPlatforms: PlatformType[];
  nodes: SocialAccountNode[];
  edges: NetworkEdge[];
  cibBreakdown: CIBBreakdown;
  astroturfClusters: AstroturfCluster[];
  geopoliticalVectors: GeopoliticalVector[];
  summaryDescription: string;
  totalCollectedEvents: number;
  disarmTactics?: DisarmTactic[];
  exifForensics?: ExifForensicAnalysis[];
  confidenceMatrix?: ConfidenceMatrixItem[];
  classifierBenchmark?: ClassifierBenchmark;
  chainOfCustody?: ChainOfCustodyStep[];
  burstEvents?: BurstEventRecord[];
  hallazgos?: CasoHallazgo[];
}

export interface AccountMutationAudit {
  immutableUserId: string; // Persistent numerical ID that never changes
  previousHandles: Array<{
    handle: string;
    detectedRange: string;
    language: string;
    topic: string;
  }>;
  dormancyPeriodDays: number;
  repurposedDate: string;
  isZombieAccount: boolean;
  marketEvidenceNote: string;
  ja3TlsHash: string; // Fingerprint TLS
  deviceEntropy: string; // Virtual Canvas/WebGL fingerprint
}

export interface DisarmTactic {
  techniqueId: string; // e.g. "T0043"
  techniqueName: string; // e.g. "Distort Historic Video"
  tacticPhase: string; // e.g. "Develop Content", "Inauthentic Amplification"
  confidence: 'CONFIRMED' | 'HIGH' | 'MEDIUM';
  evidenceProof: string;
}

export interface ExifForensicAnalysis {
  id: string;
  filename: string;
  mediaHashPHash: string;
  exifStripped: boolean;
  claimedContext: string;
  trueOriginContext: string;
  historicalArchiveMatch: string;
  matchPercentage: number;
  elaIntegrityScore: number; // 0 - 100 Error Level Analysis
  verdict: string;
}

export interface IngestionJobConfig {
  campaignTitle: string;
  platforms: PlatformType[];
  keywords: string[];
  hashtags: string[];
  electoralContext: string;
  geoBoundingBox?: string;
  maxEvents: number;
}
