package com.derdimet.api;

import com.derdimet.entity.User;

public record PublicUserProfileResponse(
        Long id,
        String name,
        String role,
        String accountType,
        String companyName,
        String city,
        String addressLine,
        String profileImageUrl,
        boolean emailVerified,
        boolean businessVerified) {

    public static PublicUserProfileResponse fromEntity(User u) {
        return new PublicUserProfileResponse(
                u.getId(),
                u.getName(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getAccountType() != null ? u.getAccountType().name() : null,
                u.getCompanyName(),
                u.getCity(),
                u.getAddressLine(),
                u.getProfileImageUrl(),
                u.isEmailVerified(),
                u.isBusinessVerified());
    }
}
