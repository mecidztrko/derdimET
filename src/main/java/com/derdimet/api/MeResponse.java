package com.derdimet.api;

public record MeResponse(
        Long id,
        String email,
        String name,
        String role,
        String phone,
        String accountType,
        String companyName,
        String taxNumber,
        String addressLine,
        String city,
        String contactSecondaryName,
        String contactSecondaryPhone,
        String profileImageUrl,
        boolean emailVerified,
        boolean businessVerified) {}
