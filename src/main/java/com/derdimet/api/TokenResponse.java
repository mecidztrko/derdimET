package com.derdimet.api;

public record TokenResponse(String token, String tokenType, String refreshToken, long expiresInSeconds) {
    public TokenResponse(String token, String refreshToken, long expiresInSeconds) {
        this(token, "Bearer", refreshToken, expiresInSeconds);
    }

    public TokenResponse(String token) {
        this(token, "Bearer", null, 0);
    }
}
