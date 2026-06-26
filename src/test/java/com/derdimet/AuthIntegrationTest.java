package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import com.derdimet.api.LoginRequest;
import com.derdimet.api.MeResponse;
import com.derdimet.api.RegisterRequest;
import com.derdimet.api.RegisterResponse;
import com.derdimet.api.TokenResponse;
import com.derdimet.entity.AccountType;
import com.derdimet.entity.UserRole;
import com.derdimet.support.AbstractApiIntegrationTest;
import com.derdimet.support.TestUserFactory;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

class AuthIntegrationTest extends AbstractApiIntegrationTest {

    @Test
    void registerCreatesUser() {
        String email = "register-" + UUID.randomUUID() + "@test.local";

        ResponseEntity<RegisterResponse> response = rest.postForEntity(
                "/api/register",
                new RegisterRequest(
                        email,
                        TestUserFactory.DEFAULT_PASSWORD,
                        "Yeni Kullanıcı",
                        null,
                        UserRole.MEAT_BUYER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        null,
                        "Ankara"),
                RegisterResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().email()).isEqualTo(email);
        assertThat(response.getBody().id()).isNotNull();
    }

    @Test
    void registerDuplicateEmailReturns409() {
        var user = users.verified(UserRole.MEAT_BUYER);

        ResponseEntity<String> response = rest.postForEntity(
                "/api/register",
                new RegisterRequest(
                        user.email(),
                        TestUserFactory.DEFAULT_PASSWORD,
                        "Tekrar",
                        null,
                        UserRole.MEAT_BUYER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        null,
                        "Ankara"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).contains("zaten kayıtlı");
    }

    @Test
    void loginReturnsBearerToken() {
        var user = users.verified(UserRole.ANIMAL_SELLER);

        ResponseEntity<TokenResponse> response =
                rest.postForEntity("/api/auth/login", new LoginRequest(user.email(), user.password()), TokenResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isNotBlank();
        assertThat(response.getBody().tokenType()).isEqualToIgnoringCase("Bearer");
    }

    @Test
    void invalidTokenReturns401() {
        ResponseEntity<String> response =
                rest.exchange("/api/me", HttpMethod.GET, bearerEntity("invalid.jwt.token"), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void meReturnsProfileForAuthenticatedUser() {
        var user = users.verified(UserRole.SLAUGHTERHOUSE);
        String token = login(user);

        ResponseEntity<MeResponse> response =
                rest.exchange("/api/me", HttpMethod.GET, bearerEntity(token), MeResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().email()).isEqualTo(user.email());
        assertThat(response.getBody().role()).isEqualTo("SLAUGHTERHOUSE");
    }

    @Test
    void meWithoutTokenReturns401() {
        ResponseEntity<String> response = rest.getForEntity("/api/me", String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void wrongRoleCannotAccessBuyerEndpoints() {
        var seller = users.verified(UserRole.ANIMAL_SELLER);
        String token = login(seller);

        ResponseEntity<String> response = rest.exchange(
                "/api/buyer/meat-sale-requests",
                HttpMethod.GET,
                bearerEntity(token),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void wrongRoleCannotAccessSellerEndpoints() {
        var buyer = users.verified(UserRole.MEAT_BUYER);
        String token = login(buyer);

        ResponseEntity<String> response = rest.exchange(
                "/api/seller/animal-listings",
                HttpMethod.GET,
                bearerEntity(token),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
