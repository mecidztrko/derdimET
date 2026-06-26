package com.derdimet.api;

import com.derdimet.entity.BusinessVerificationStatus;
import com.derdimet.entity.User;

public record AdminBusinessVerificationResponse(
        Long userId,
        String name,
        String email,
        String role,
        String companyName,
        String taxNumber,
        String documentUrl,
        BusinessVerificationStatus status,
        String note) {

    public static AdminBusinessVerificationResponse fromEntity(User user) {
        return new AdminBusinessVerificationResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : null,
                user.getCompanyName(),
                user.getTaxNumber(),
                user.getBusinessDocumentUrl(),
                user.getBusinessVerificationStatus(),
                user.getBusinessVerificationNote());
    }
}
