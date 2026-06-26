package com.derdimet.repository;

import com.derdimet.entity.RefreshToken;
import com.derdimet.entity.User;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query("select r from RefreshToken r join fetch r.user where r.tokenHash = :hash and r.revokedAt is null")
    Optional<RefreshToken> findByTokenHashAndRevokedAtIsNull(@Param("hash") String hash);

    @Modifying
    @Query("update RefreshToken r set r.revokedAt = :now where r.user = :user and r.revokedAt is null")
    int revokeAllForUser(@Param("user") User user, @Param("now") LocalDateTime now);
}
