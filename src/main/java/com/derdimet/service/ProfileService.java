package com.derdimet.service;

import com.derdimet.api.MeResponse;
import com.derdimet.api.UpdateProfileRequest;
import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    @Transactional
    public MeResponse updateProfile(User user, UpdateProfileRequest body) {
        if (body.name() != null && !body.name().isBlank()) {
            user.setName(body.name().trim());
        }
        if (body.phone() != null) {
            user.setPhone(blankToNull(body.phone()));
        }
        if (body.companyName() != null) {
            user.setCompanyName(blankToNull(body.companyName()));
        }
        if (body.taxNumber() != null) {
            user.setTaxNumber(blankToNull(body.taxNumber()));
        }
        if (body.addressLine() != null) {
            user.setAddressLine(blankToNull(body.addressLine()));
        }
        if (body.city() != null) {
            user.setCity(blankToNull(body.city()));
        }
        if (body.contactSecondaryName() != null) {
            user.setContactSecondaryName(blankToNull(body.contactSecondaryName()));
        }
        if (body.contactSecondaryPhone() != null) {
            user.setContactSecondaryPhone(blankToNull(body.contactSecondaryPhone()));
        }
        if (body.profileImageUrl() != null) {
            user.setProfileImageUrl(blankToNull(body.profileImageUrl()));
        }
        User saved = userRepository.save(user);
        return toMeResponse(saved);
    }

    public static MeResponse toMeResponse(User u) {
        return new MeResponse(
                u.getId(),
                u.getEmail(),
                u.getName(),
                u.getRole().name(),
                u.getPhone(),
                u.getAccountType() != null ? u.getAccountType().name() : "INDIVIDUAL",
                u.getCompanyName(),
                u.getTaxNumber(),
                u.getAddressLine(),
                u.getCity(),
                u.getContactSecondaryName(),
                u.getContactSecondaryPhone(),
                u.getProfileImageUrl(),
                u.isEmailVerified(),
                u.isBusinessVerified());
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}
