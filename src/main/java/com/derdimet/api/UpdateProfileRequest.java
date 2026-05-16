package com.derdimet.api;

public record UpdateProfileRequest(
        String name,
        String phone,
        String companyName,
        String taxNumber,
        String addressLine,
        String city,
        String contactSecondaryName,
        String contactSecondaryPhone,
        String profileImageUrl) {}
