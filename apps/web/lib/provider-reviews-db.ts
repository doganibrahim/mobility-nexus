import {
  HostCancellationPolicy,
  HostReviewItem,
  HostReviewsBreakdownResponse,
  CreateHostReviewDto,
  FiveDimensionalReviewMetrics,
} from '@mobility-nexus/types';

// In-Memory store for development resilience
const cancellationPolicies: Record<string, HostCancellationPolicy> = {
  'host-de-bavaria': {
    id: 'pol-bavaria-01',
    hostId: 'host-de-bavaria',
    policyType: 'FLEXIBLE',
    refundPercentageFull: 100,
    daysBeforeFullRefund: 30,
    refundPercentagePartial: 50,
    daysBeforePartialRefund: 14,
    forceMajeureCovered: true,
    policyDetailsTr:
      'Hareketlilik başlangıcından 30 gün öncesine kadar ücretsiz %100 kesintisiz iade. 14 güne kadar %50 iade. Ulusal Ajans vize veya hibe iptali gibi mücbir sebeplerde tam iade güvencesi sunulur.',
    policyDetailsEn:
      'Free 100% cancellation up to 30 days before mobility. 50% refund up to 14 days. Full National Agency force majeure and visa denial guarantee included.',
  },
  'host-de-technordic': {
    id: 'pol-technordic-02',
    hostId: 'host-de-technordic',
    policyType: 'MODERATE',
    refundPercentageFull: 100,
    daysBeforeFullRefund: 45,
    refundPercentagePartial: 50,
    daysBeforePartialRefund: 21,
    forceMajeureCovered: true,
    policyDetailsTr:
      'Hareketlilik başlangıcından 45 gün öncesine kadar %100 iade, 21 güne kadar %50 iade veya sonraki döneme ücretsiz aktarım hakkı. Erasmus+ mücbir sebep şartları geçerlidir.',
    policyDetailsEn:
      '100% refund up to 45 days before start, 50% refund up to 21 days or free term transfer. Erasmus+ force majeure clauses apply.',
  },
  'host-fi-nordic': {
    id: 'pol-nordic-03',
    hostId: 'host-fi-nordic',
    policyType: 'FLEXIBLE',
    refundPercentageFull: 100,
    daysBeforeFullRefund: 30,
    refundPercentagePartial: 60,
    daysBeforePartialRefund: 10,
    forceMajeureCovered: true,
    policyDetailsTr:
      '30 gün öncesine kadar %100 iade, 10 gün öncesine kadar %60 iade. Kurumumuz Erasmus+ okul bütçesi koruma politikasını taahhüt eder.',
    policyDetailsEn:
      'Full 100% refund up to 30 days, 60% refund up to 10 days. Institution commits to the Erasmus+ school budget protection policy.',
  },
};

const reviewsStore: Record<string, HostReviewItem[]> = {
  'host-de-bavaria': [
    {
      id: 'rev-bav-01',
      hostId: 'host-de-bavaria',
      schoolName: 'Bursa Nilüfer Mesleki ve Teknik Anadolu Lisesi',
      schoolOid: 'E10023451',
      projectType: 'KA121',
      mobilityYear: 2025,
      overallScore: 4.9,
      metrics: {
        responseTime: 4.8,
        communication: 5.0,
        serviceDelivery: 4.9,
        programmeAlignment: 5.0,
        problemSolving: 4.8,
      },
      comment:
        'Atölye mentörleri ve lojistik koordinasyonu olağanüstüydü. Endüstri 4.0 PLC istasyonlarında öğrencilerimiz doğrudan pratik yaptı. Sorunsuz bir hareketlilikti.',
      verifiedMobility: true,
      createdAt: '2025-11-20T14:30:00Z',
    },
    {
      id: 'rev-bav-02',
      hostId: 'host-de-bavaria',
      schoolName: 'İzmir Mazhar Zorlu MTAL',
      schoolOid: 'E10194823',
      projectType: 'KA121',
      mobilityYear: 2025,
      overallScore: 4.85,
      metrics: {
        responseTime: 4.7,
        communication: 4.9,
        serviceDelivery: 4.9,
        programmeAlignment: 4.9,
        problemSolving: 4.9,
      },
      comment:
        'Ön hazırlık evrakları ve Europass sertifikasyon süreçleri gününde tamamlandı. Öğretmenlerimiz için çok verimli bir işbaşı gözlem ortamı sağlandı.',
      verifiedMobility: true,
      createdAt: '2025-10-15T09:15:00Z',
    },
  ],
  'host-de-technordic': [
    {
      id: 'rev-tech-01',
      hostId: 'host-de-technordic',
      schoolName: 'Ankara Ostim Şehit Alper Zor MTAL',
      schoolOid: 'E10283741',
      projectType: 'KA122',
      mobilityYear: 2025,
      overallScore: 4.75,
      metrics: {
        responseTime: 4.6,
        communication: 4.8,
        serviceDelivery: 4.8,
        programmeAlignment: 4.9,
        problemSolving: 4.7,
      },
      comment:
        'Yazılım ve IoT atölyelerinde harika bir eğitim aldık. Ulaşım kartları ve konaklama rezervasyonları önceden eksiksiz ayarlanmıştı.',
      verifiedMobility: true,
      createdAt: '2025-12-05T11:00:00Z',
    },
  ],
  'host-fi-nordic': [
    {
      id: 'rev-nor-01',
      hostId: 'host-fi-nordic',
      schoolName: 'Eskişehir Atatürk MTAL',
      schoolOid: 'E10123984',
      projectType: 'KA121',
      mobilityYear: 2025,
      overallScore: 4.95,
      metrics: {
        responseTime: 5.0,
        communication: 5.0,
        serviceDelivery: 4.9,
        programmeAlignment: 5.0,
        problemSolving: 4.9,
      },
      comment:
        'Helsinki çevre teknolojileri laboratuvarında gerçekleştirilen eğitim tüm beklentilerimizin üzerindeydi. Özel diyet ve erişilebilirlik hassasiyetleri çok iyiydi.',
      verifiedMobility: true,
      createdAt: '2026-01-22T16:45:00Z',
    },
  ],
};

export const ProviderReviewsDb = {
  getCancellationPolicy(hostId: string): HostCancellationPolicy {
    return (
      cancellationPolicies[hostId] || {
        id: `pol-${hostId}`,
        hostId,
        policyType: 'FLEXIBLE',
        refundPercentageFull: 100,
        daysBeforeFullRefund: 30,
        refundPercentagePartial: 50,
        daysBeforePartialRefund: 14,
        forceMajeureCovered: true,
        policyDetailsTr:
          'Hareketlilik başlangıcından 30 gün öncesine kadar ücretsiz %100 iade. 14 güne kadar %50 iade. Ulusal Ajans mücbir sebep güvencesi dahildir.',
        policyDetailsEn:
          '100% full refund up to 30 days before mobility. 50% refund up to 14 days. National Agency force majeure protection included.',
      }
    );
  },

  saveCancellationPolicy(policy: HostCancellationPolicy): HostCancellationPolicy {
    if (policy.hostId) {
      cancellationPolicies[policy.hostId] = policy;
    }
    return policy;
  },

  getReviewsBreakdown(hostId: string, hostName = 'Ev Sahibi Sağlayıcı'): HostReviewsBreakdownResponse {
    const list = reviewsStore[hostId] || [];

    if (list.length === 0) {
      return {
        hostId,
        hostName,
        totalReviews: 0,
        overallAverage: 4.8,
        metricAverages: {
          responseTime: 4.8,
          communication: 4.9,
          serviceDelivery: 4.8,
          programmeAlignment: 4.9,
          problemSolving: 4.7,
        },
        reviews: [],
      };
    }

    const sum = list.reduce(
      (acc, r) => ({
        responseTime: acc.responseTime + r.metrics.responseTime,
        communication: acc.communication + r.metrics.communication,
        serviceDelivery: acc.serviceDelivery + r.metrics.serviceDelivery,
        programmeAlignment: acc.programmeAlignment + r.metrics.programmeAlignment,
        problemSolving: acc.problemSolving + r.metrics.problemSolving,
        overall: acc.overall + r.overallScore,
      }),
      { responseTime: 0, communication: 0, serviceDelivery: 0, programmeAlignment: 0, problemSolving: 0, overall: 0 }
    );

    const count = list.length;
    const metricAverages: FiveDimensionalReviewMetrics = {
      responseTime: Number((sum.responseTime / count).toFixed(1)),
      communication: Number((sum.communication / count).toFixed(1)),
      serviceDelivery: Number((sum.serviceDelivery / count).toFixed(1)),
      programmeAlignment: Number((sum.programmeAlignment / count).toFixed(1)),
      problemSolving: Number((sum.problemSolving / count).toFixed(1)),
    };

    return {
      hostId,
      hostName,
      totalReviews: count,
      overallAverage: Number((sum.overall / count).toFixed(1)),
      metricAverages,
      reviews: list,
    };
  },

  addReview(hostId: string, dto: CreateHostReviewDto): HostReviewItem {
    const scores = dto.metrics;
    const overallScore = Number(
      (
        (scores.responseTime +
          scores.communication +
          scores.serviceDelivery +
          scores.programmeAlignment +
          scores.problemSolving) /
        5
      ).toFixed(2)
    );

    const reviewItem: HostReviewItem = {
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      hostId,
      schoolName: dto.schoolName.trim(),
      schoolOid: dto.schoolOid?.trim() || null,
      projectType: dto.projectType || 'KA121',
      mobilityYear: dto.mobilityYear || new Date().getFullYear(),
      overallScore,
      metrics: {
        responseTime: Number(scores.responseTime),
        communication: Number(scores.communication),
        serviceDelivery: Number(scores.serviceDelivery),
        programmeAlignment: Number(scores.programmeAlignment),
        problemSolving: Number(scores.problemSolving),
      },
      comment: dto.comment?.trim() || '',
      verifiedMobility: true,
      createdAt: new Date().toISOString(),
    };

    if (!reviewsStore[hostId]) {
      reviewsStore[hostId] = [];
    }
    reviewsStore[hostId].unshift(reviewItem);

    return reviewItem;
  },
};
