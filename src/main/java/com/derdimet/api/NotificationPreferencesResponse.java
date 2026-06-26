package com.derdimet.api;

public record NotificationPreferencesResponse(
        boolean pushOffersEnabled, boolean pushMessagesEnabled, boolean pushMarketingEnabled) {}
