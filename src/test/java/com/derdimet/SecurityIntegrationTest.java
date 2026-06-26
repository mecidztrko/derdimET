package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.RefreshTokenRequest;
import com.derdimet.api.RegisterRequest;
import com.derdimet.api.TokenResponse;
import com.derdimet.entity.AccountType;
import com.derdimet.entity.AuditAction;
import com.derdimet.entity.UserRole;
import com.derdimet.support.AbstractApiIntegrationTest;
import com.derdimet.support.TestUserFactory;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class SecurityIntegrationTest extends AbstractApiIntegrationTest {

    @Test
    void weakPasswordRejectedOnRegister() {
        String email = "weak-" + UUID.randomUUID() + "@test.local";

        ResponseEntity<String> response = rest.postForEntity(
                "/api/register",
                new RegisterRequest(
                        email,
                        "password",
                        "Zayıf Şifre",
                        null,
                        UserRole.MEAT_BUYER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        null,
                        "Ankara"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("büyük harf");
    }

    @Test
    void loginReturnsRefreshTokenAndExpiry() {
        var user = users.verified(UserRole.MEAT_BUYER);

        ResponseEntity<TokenResponse> response = rest.postForEntity(
                "/api/auth/login",
                new com.derdimet.api.LoginRequest(user.email(), user.password()),
                TokenResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().refreshToken()).isNotBlank();
        assertThat(response.getBody().expiresInSeconds()).isPositive();
    }

    @Test
    void refreshTokenIssuesNewAccessToken() {
        var user = users.verified(UserRole.ANIMAL_SELLER);
        ResponseEntity<TokenResponse> login =
                rest.postForEntity(
                        "/api/auth/login",
                        new com.derdimet.api.LoginRequest(user.email(), user.password()),
                        TokenResponse.class);
        String refresh = login.getBody().refreshToken();

        ResponseEntity<TokenResponse> refreshed = rest.postForEntity(
                "/api/auth/refresh", new RefreshTokenRequest(refresh), TokenResponse.class);

        assertThat(refreshed.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(refreshed.getBody()).isNotNull();
        assertThat(refreshed.getBody().token()).isNotBlank();
        assertThat(refreshed.getBody().refreshToken()).isNotEqualTo(refresh);
    }

    @Test
    void meatOfferAcceptCreatesAuditEvent() {
        var slaughterhouse = users.verified(UserRole.SLAUGHTERHOUSE);
        var buyer = users.verified(UserRole.MEAT_BUYER);
        String shToken = login(slaughterhouse);
        String buyerToken = login(buyer);

        var createSale = rest.postForEntity(
                "/api/slaughterhouse/meat-sale-requests",
                bearerEntity(
                        shToken,
                        new com.derdimet.api.CreateMeatSaleRequest(
                                "Güvenlik Test Et",
                                "Dana",
                                com.derdimet.entity.AnimalCategory.BUYUKBAS,
                                "But",
                                java.math.BigDecimal.valueOf(50),
                                java.math.BigDecimal.valueOf(320),
                                null,
                                "Ankara",
                                "Test",
                                java.util.List.of(),
                                null)),
                com.derdimet.api.MeatSaleRequestResponse.class);
        Long saleId = createSale.getBody().id();

        var offer = rest.postForEntity(
                "/api/buyer/meat-sale-requests/" + saleId + "/offers",
                bearerEntity(
                        buyerToken,
                        new com.derdimet.api.CreateMeatOfferRequest(
                                java.math.BigDecimal.valueOf(300), java.math.BigDecimal.valueOf(50), null)),
                com.derdimet.api.MeatOfferItemResponse.class);
        Long offerId = offer.getBody().offerId();

        ResponseEntity<String> accept = rest.postForEntity(
                "/api/slaughterhouse/meat-offers/" + offerId + "/accept",
                bearerEntity(shToken),
                String.class);
        assertThat(accept.getStatusCode()).isEqualTo(HttpStatus.OK);

        var admin = users.verified(UserRole.ADMIN);
        String adminToken = login(admin);
        ResponseEntity<java.util.List<com.derdimet.api.AuditEventResponse>> audit = rest.exchange(
                "/api/admin/audit-events?limit=20",
                HttpMethod.GET,
                bearerEntity(adminToken),
                new ParameterizedTypeReference<>() {});

        assertThat(audit.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(audit.getBody()).isNotNull();
        assertThat(audit.getBody().stream()
                        .anyMatch(e -> e.action() == AuditAction.OFFER_ACCEPTED && "MEAT_OFFER".equals(e.resourceType())))
                .isTrue();
    }
}
