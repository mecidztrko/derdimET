package com.derdimet.api;

import com.derdimet.config.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestControllerAdvice(basePackages = "com.derdimet.api")
public class ApiExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException ex, WebRequest request) {
        return error(HttpStatus.UNAUTHORIZED, "E-posta veya şifre hatalı", ex, request, false);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        var err = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getDefaultMessage())
                .filter(m -> m != null && !m.isBlank())
                .findFirst()
                .orElse("Geçersiz istek");
        return error(HttpStatus.BAD_REQUEST, err, ex, request, false);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex, WebRequest request) {
        String msg = ex.getReason() != null ? ex.getReason() : HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase();
        boolean serverError = ex.getStatusCode().is5xxServerError();
        return error(HttpStatus.valueOf(ex.getStatusCode().value()), msg, ex, request, serverError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex, WebRequest request) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Beklenmeyen bir hata oluştu", ex, request, true);
    }

    private ResponseEntity<Map<String, Object>> error(
            HttpStatus status, String message, Exception ex, WebRequest request, boolean logAsError) {
        String correlationId = correlationId(request);
        if (logAsError) {
            log.error("API error [{}] {}: {}", correlationId, status.value(), message, ex);
        } else if (status.is4xxClientError()) {
            log.warn("API client error [{}] {}: {}", correlationId, status.value(), message);
        }
        return ResponseEntity.status(status).body(errorBody(message, correlationId));
    }

    private static Map<String, Object> errorBody(String message, String correlationId) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message);
        if (correlationId != null && !correlationId.isBlank()) {
            body.put("correlationId", correlationId);
        }
        return body;
    }

    private static String correlationId(WebRequest request) {
        String fromMdc = MDC.get(CorrelationIdFilter.MDC_KEY);
        if (fromMdc != null && !fromMdc.isBlank()) {
            return fromMdc;
        }
        if (request instanceof ServletWebRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getRequest();
            Object attribute = httpRequest.getAttribute(CorrelationIdFilter.REQUEST_ATTRIBUTE);
            if (attribute != null) {
                return attribute.toString();
            }
        }
        return null;
    }
}
