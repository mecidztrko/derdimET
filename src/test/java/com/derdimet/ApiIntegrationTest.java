package com.derdimet;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.DefaultResponseErrorHandler;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiIntegrationTest {

    @Autowired
    private TestRestTemplate rest;

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

    @Test
    void unauthenticatedMeReturns401() {
        ResponseEntity<String> res = rest.getForEntity("/api/me", String.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void sessionLoginEndpointExists() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> body = new HttpEntity<>("{\"email\":\"x\",\"password\":\"y\"}", headers);
        ResponseEntity<String> res = rest.postForEntity("/api/auth/session-login", body, String.class);
        assertThat(res.getStatusCode()).isNotEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void notificationsSummaryRequiresAuth() {
        ResponseEntity<String> res = rest.getForEntity("/api/notifications/summary", String.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void conversationsRequireAuth() {
        ResponseEntity<String> res = rest.exchange("/api/conversations", HttpMethod.GET, null, String.class);
        assertThat(res.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
