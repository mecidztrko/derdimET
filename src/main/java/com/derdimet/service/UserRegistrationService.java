package com.derdimet.service;

import com.derdimet.api.RegisterRequest;
import com.derdimet.entity.AccountType;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.UserRepository;
import com.derdimet.security.PasswordPolicyService;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicyService passwordPolicyService;

    public User register(RegisterRequest req) {
        passwordPolicyService.validate(req.password());
        String email = req.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu e-posta adresi zaten kayıtlı");
        }
        if (req.role() == UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz rol");
        }
        if (req.accountType() == AccountType.BUSINESS) {
            if (req.companyName() == null
                    || req.companyName().isBlank()
                    || req.taxNumber() == null
                    || req.taxNumber().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Kurumsal hesap için şirket adı ve vergi numarası zorunludur");
            }
        }

        User u = new User();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setName(req.name().trim());
        u.setPhone(blankToNull(req.phone()));
        u.setRole(req.role());
        u.setAccountType(req.accountType());
        if (req.accountType() == AccountType.BUSINESS) {
            u.setCompanyName(req.companyName().trim());
            u.setTaxNumber(req.taxNumber().trim());
            u.setAddressLine(blankToNull(req.addressLine()));
            u.setCity(blankToNull(req.city()));
        } else {
            u.setCompanyName(null);
            u.setTaxNumber(null);
            u.setAddressLine(blankToNull(req.addressLine()));
            u.setCity(blankToNull(req.city()));
        }
        u.setBusinessVerified(false);
        u.setEmailVerified(false);
        return userRepository.save(u);
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}
