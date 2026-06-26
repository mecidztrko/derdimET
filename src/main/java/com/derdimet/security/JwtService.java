package com.derdimet.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${derdimet.jwt.secret}")
    private String secret;

    @Value("${derdimet.jwt.access-expiration-ms:${derdimet.jwt.expiration-ms:3600000}}")
    private long accessExpirationMs;

    private SecretKey signingKey() {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("derdimet.jwt.secret en az 32 byte olmalıdır");
        }
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessExpirationMs))
                .signWith(signingKey())
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String subject = extractUsername(token);
            return subject.equals(userDetails.getUsername()) && !isExpired(parseClaims(token));
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean isExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
    }

    public long accessExpirationSeconds() {
        return accessExpirationMs / 1000;
    }
}
