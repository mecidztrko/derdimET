package com.derdimet.repository;

import com.derdimet.entity.AuthActionToken;
import com.derdimet.entity.AuthTokenPurpose;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthActionTokenRepository extends JpaRepository<AuthActionToken, Long> {
    Optional<AuthActionToken> findTopByEmailAndPurposeAndCodeAndUsedAtIsNullAndExpiresAtAfterOrderByIdDesc(
            String email, AuthTokenPurpose purpose, String code, LocalDateTime now);
}
