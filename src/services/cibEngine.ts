/**
 * AegisNet-BotRadar: Motor Analítico de Coordinación Inauténtica (CIB Engine)
 * Algoritmos de Topología de Redes (Graph Theory), Heurísticas Temporales y Similitud PLN.
 * Enfoque rigurosamente apartidista: Evalúa únicamente patrones de coordinación técnica.
 * Copyright © M. Castillo — Contacto: mailto:mybloggingnotes@gmail.com
 */

import { SocialAccountNode, NetworkEdge, CIBBreakdown } from '../types/botradar';

/**
 * Calcula la distancia de Levenshtein entre dos cadenas de texto.
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Coeficiente de similitud de Jaccard sobre conjuntos de n-gramas / palabras tokenizadas.
 */
export function calculateJaccardSimilarity(text1: string, text2: string): number {
  const tokenize = (t: string) =>
    new Set(
      t
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const setA = tokenize(text1);
  const setB = tokenize(text2);

  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * Análisis del patrón Hub-and-Spoke en un grafo dirigido.
 * En una red inorgánica, un nodo central (Hub) conecta radialmente con múltiples nodos
 * periféricos (Spokes) con muy baja o nula reciprocidad e interconexión entre radios.
 */
export function calculateHubAndSpokeIndex(nodes: SocialAccountNode[], edges: NetworkEdge[]): number {
  if (nodes.length < 3 || edges.length === 0) return 0;

  const degreeMap = new Map<string, { inDegree: number; outDegree: number }>();
  nodes.forEach((n) => degreeMap.set(n.id, { inDegree: 0, outDegree: 0 }));

  edges.forEach((e) => {
    const s = degreeMap.get(e.source);
    const t = degreeMap.get(e.target);
    if (s) s.outDegree++;
    if (t) t.inDegree++;
  });

  // Encuentra el nodo con mayor out-degree (candidato a semilla o coordinador)
  let maxDegree = 0;
  let topNodeId = '';
  degreeMap.forEach((val, id) => {
    const total = val.outDegree + val.inDegree;
    if (total > maxDegree) {
      maxDegree = total;
      topNodeId = id;
    }
  });

  if (maxDegree <= 1) return 20;

  // Evaluar conectividad entre los vecinos del nodo principal
  const neighbors = new Set<string>();
  edges.forEach((e) => {
    if (e.source === topNodeId) neighbors.add(e.target);
    if (e.target === topNodeId) neighbors.add(e.source);
  });

  let interNeighborEdges = 0;
  edges.forEach((e) => {
    if (e.source !== topNodeId && e.target !== topNodeId) {
      if (neighbors.has(e.source) && neighbors.has(e.target)) {
        interNeighborEdges++;
      }
    }
  });

  const possibleInterEdges = (neighbors.size * (neighbors.size - 1)) / 2;
  const clusteringCoeff = possibleInterEdges > 0 ? interNeighborEdges / possibleInterEdges : 0;

  // En un Hub-and-Spoke inorgánico, la centralidad de estrella es muy alta y el clustering coefficient es ~0
  const starCentralization = Math.min(1.0, maxDegree / (nodes.length - 1));
  const hubSpokeScore = Math.round((starCentralization * 0.7 + (1 - clusteringCoeff) * 0.3) * 100);

  return Math.max(10, Math.min(100, hubSpokeScore));
}

/**
 * Evaluación de Heurísticas Temporales de Automatización (Zero-Jitter, Bursts, 24/7 flatline).
 */
export function calculateTemporalHeuristicScore(nodes: SocialAccountNode[]): number {
  if (nodes.length === 0) return 0;

  let totalScore = 0;
  nodes.forEach((n) => {
    const tm = n.temporalMetrics;
    let nodeRisk = 0;

    // Jitter bajo (< 2s) es un fuerte indicador de automatización (scripts / crons)
    if (tm.intervalJitterSeconds < 1.0) {
      nodeRisk += 45;
    } else if (tm.intervalJitterSeconds < 3.0) {
      nodeRisk += 25;
    }

    // Picos de publicación simultáneos (bursts)
    if (tm.burstCount > 20) {
      nodeRisk += 30;
    } else if (tm.burstCount > 10) {
      nodeRisk += 15;
    }

    // Actividad nocturna ininterrumpida (un humano duerme, un bot corre 24/7)
    if (tm.nightActivityRatio > 0.4) {
      nodeRisk += 25;
    } else if (tm.nightActivityRatio > 0.25) {
      nodeRisk += 10;
    }

    totalScore += Math.min(100, nodeRisk);
  });

  return Math.round(totalScore / nodes.length);
}

/**
 * Evaluación Semántica PLN y Astroturfing (Copypastes masivos y duplicación idéntica).
 */
export function calculateSemanticDuplicationScore(nodes: SocialAccountNode[]): number {
  if (nodes.length === 0) return 0;

  let totalCopyRatio = 0;
  nodes.forEach((n) => {
    totalCopyRatio += n.contentMetrics.exactCopyPasteRatio;
  });

  const avgCopyRatio = totalCopyRatio / nodes.length;
  // Escalar 0 - 1.0 a 0 - 100
  return Math.round(avgCopyRatio * 100);
}

/**
 * Evaluación de Metadatos de Cuenta (Antigüedad vs Nivel de actividad, Follower/Following Skew).
 */
export function calculateMetadataScore(nodes: SocialAccountNode[]): number {
  if (nodes.length === 0) return 0;

  let totalScore = 0;
  nodes.forEach((n) => {
    let score = 0;

    // Cuenta creada recientemente (< 30 días) pero con miles de publicaciones
    if (n.accountAgeDays < 30 && n.totalPosts > 500) {
      score += 40;
    } else if (n.accountAgeDays < 60 && n.postsPerDay > 50) {
      score += 25;
    }

    // Ratio de seguidores vs seguidos anómalo (sigue a miles, casi 0 seguidores)
    if (n.followingCount > 1000 && n.followersCount < 50) {
      score += 35;
    } else if (n.followingCount > 500 && n.followerFollowingRatio < 0.05) {
      score += 20;
    }

    // Si el nombre de usuario tiene patrón de números generados aleatoriamente (ej: @User_9824982)
    if (/@User_\d{6,}/.test(n.handle) || /@\w+\d{6,}/.test(n.handle)) {
      score += 25;
    }

    totalScore += Math.min(100, score);
  });

  return Math.round(totalScore / nodes.length);
}

/**
 * Motor Central de Puntuación CIB Ponderada (0 a 100)
 *
 * Fórmula matemática transparente:
 * CIB = 0.30 * S_topología + 0.30 * S_temporal + 0.25 * S_semántica + 0.15 * S_metadatos
 */
export function computeComprehensiveCIBScore(
  nodes: SocialAccountNode[],
  edges: NetworkEdge[]
): CIBBreakdown {
  const topologicalScore = calculateHubAndSpokeIndex(nodes, edges);
  const temporalScore = calculateTemporalHeuristicScore(nodes);
  const semanticScore = calculateSemanticDuplicationScore(nodes);
  const metadataScore = calculateMetadataScore(nodes);

  const weightedScore = Math.round(
    0.30 * topologicalScore +
    0.30 * temporalScore +
    0.25 * semanticScore +
    0.15 * metadataScore
  );

  const finalScore = Math.max(0, Math.min(100, weightedScore));

  let riskLevel: 'LOW_ORGANIC' | 'SUSPICIOUS' | 'CONFIRMED_CIB' = 'LOW_ORGANIC';
  let verdictDescription = '';

  if (finalScore >= 65) {
    riskLevel = 'CONFIRMED_CIB';
    verdictDescription =
      'Patrones de Coordinación Inauténtica (CIB) confirmados técnicamente. Se observa alta sincronía cronométrica de publicaciones (jitter < 1s), arquitectura de red tipo Hub-and-Spoke y difusión coordinada de textos clonados.';
  } else if (finalScore >= 35) {
    riskLevel = 'SUSPICIOUS';
    verdictDescription =
      'Comportamiento sospechoso detectado. Existen indicios de amplificación acelerada y sub-clusters con similitud semántica, aunque con participación de cuentas con patrones mixtos u orgánicos.';
  } else {
    riskLevel = 'LOW_ORGANIC';
    verdictDescription =
      'Comportamiento predominantemente orgánico. La dispersión de tiempos, diversidad de vocabulario y reciprocidad en las interacciones son consistentes con dinámica ciudadana natural.';
  }

  return {
    overallScore: finalScore,
    topologicalScore,
    temporalScore,
    semanticScore,
    metadataScore,
    riskLevel,
    verdictDescription
  };
}
