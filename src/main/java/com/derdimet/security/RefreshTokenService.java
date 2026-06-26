package com.derdimet.security;

import com.derdimet.entity.RefreshToken;
import com.derdimet.entity.User;
import com.derdimet.repository.RefreshTokenRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${derdimet.jwt.refresh-expiration-ms:2592000000}")
    private long refreshExpirationMs;

    @Transactional
    public String issue(User user) {
        String raw = generateRawToken();
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(raw));
        token.setExpiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000));
        refreshTokenRepository.save(token);
        return raw;
    }

    @Transactional
    public User validateAndGetUser(String rawToken) {
        RefreshToken token = refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(hash(rawToken))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz oturum"));
        LocalDateTime now = LocalDateTime.now();
        if (!token.isActive(now)) {
            token.setRevokedAt(now);
            refreshTokenRepository.save(token);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum süresi dolmuş");
        }
        return token.getUser();
    }

    @Transactional
    public String rotate(User user, String rawToken) {
        RefreshToken existing = refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(hash(rawToken))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz oturum"));
        LocalDateTime now = LocalDateTime.now();
        if (!existing.isActive(now)) {
            existing.setRevokedAt(now);
            refreshTokenRepository.save(existing);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum süresi dolmuş");
        }
        existing.setRevokedAt(now);
        refreshTokenRepository.save(existing);
        return issue(user);
    }

    @Transactional
    public void revoke(String rawToken) {
        refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(hash(rawToken))
                .ifPresent(token -> {
                    token.setRevokedAt(LocalDateTime.now());
                    refreshTokenRepository.save(token);
                });
    }

    @Transactional
    public void revokeAllForUser(User user) {
        refreshTokenRepository.revokeAllForUser(user, LocalDateTime.now());
    }

    public long refreshExpirationSeconds() {
        return refreshExpirationMs / 1000;
    }

    private static String generateRawToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    static String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 kullanılamıyor", ex);
        }
    }
}
