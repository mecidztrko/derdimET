package com.derdimet.support;

import com.derdimet.api.LoginRequest;
import com.derdimet.api.TokenResponse;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.DefaultResponseErrorHandler;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class AbstractApiIntegrationTest {

    @Autowired
    protected TestRestTemplate rest;

    @Autowired
    protected TestUserFactory users;

    @BeforeEach
    void allow4xxResponses() {
        rest.getRestTemplate()
                .setErrorHandler(
                        new DefaultResponseErrorHandler() {
                            @Override
                            protected boolean hasError(HttpStatusCode statusCode) {
                                return statusCode.is5xxServerError();
                            }
                        });
    }

    protected String loginToken(String email, String password) {
        ResponseEntity<TokenResponse> response =
                rest.postForEntity("/api/auth/login", new LoginRequest(email, password), TokenResponse.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().token()).isNotBlank();
        return response.getBody().token();
    }

    protected String login(TestUserFactory.TestUser user) {
        return loginToken(user.email(), user.password());
    }

    protected HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    protected <T> HttpEntity<T> bearerEntity(String token, T body) {
        return new HttpEntity<>(body, bearerHeaders(token));
    }

    protected HttpEntity<Void> bearerEntity(String token) {
        return new HttpEntity<>(bearerHeaders(token));
    }
}
