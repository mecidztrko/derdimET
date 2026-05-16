package com.derdimet.api;

public record TokenResponse(String token, String tokenType) {
    public TokenResponse(String token) {
        this(token, "Bearer");
    }
}
