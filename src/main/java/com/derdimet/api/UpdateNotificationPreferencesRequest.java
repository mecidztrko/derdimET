package com.derdimet.api;

public record UpdateNotificationPreferencesRequest(
        Boolean pushOffersEnabled, Boolean pushMessagesEnabled, Boolean pushMarketingEnabled) {}
