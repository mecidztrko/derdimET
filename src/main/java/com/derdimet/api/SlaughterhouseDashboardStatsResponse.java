package com.derdimet.api;

import java.math.BigDecimal;

public record SlaughterhouseDashboardStatsResponse(
        String month,
        long monthlyMeatSales,
        BigDecimal monthlyMeatRevenue,
        long monthlyAnimalPurchases,
        BigDecimal monthlyAnimalSpend,
        int pendingMeatOffers,
        int pendingListingOffers,
        int pendingPurchaseOffers) {}
