package com.derdimet.api;

public record NotificationSummaryResponse(
        int pendingOffers,
        int pendingIncoming,
        int pendingPurchaseOffers,
        String primaryLink) {}
