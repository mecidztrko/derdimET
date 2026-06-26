package com.derdimet.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Her HTTP isteğine correlation / request ID atar, MDC'ye yazar ve yanıt başlığına ekler.
 * API erişim logları tek satırda method, path, status ve süreyi içerir.
 */
@Slf4j
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String HEADER_NAME = "X-Request-Id";
    public static final String LEGACY_HEADER_NAME = "X-Correlation-Id";
    public static final String MDC_KEY = "correlationId";
    public static final String REQUEST_ATTRIBUTE = "derdimet.correlationId";

    private static final String MDC_HTTP_METHOD = "httpMethod";
    private static final String MDC_HTTP_PATH = "httpPath";
    private static final String MDC_HTTP_STATUS = "httpStatus";
    private static final String MDC_DURATION_MS = "durationMs";

    private static final Set<String> QUIET_PATH_PREFIXES =
            Set.of("/swagger-ui", "/v3/api-docs", "/uploads/", "/auth/");

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String correlationId = resolveCorrelationId(request);
        long startedAt = System.currentTimeMillis();

        MDC.put(MDC_KEY, correlationId);
        MDC.put(MDC_HTTP_METHOD, request.getMethod());
        MDC.put(MDC_HTTP_PATH, request.getRequestURI());
        request.setAttribute(REQUEST_ATTRIBUTE, correlationId);
        response.setHeader(HEADER_NAME, correlationId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            long durationMs = System.currentTimeMillis() - startedAt;
            int status = response.getStatus();
            MDC.put(MDC_HTTP_STATUS, String.valueOf(status));
            MDC.put(MDC_DURATION_MS, String.valueOf(durationMs));

            if (shouldLogAccess(request)) {
                log.info(
                        "HTTP {} {} -> {} ({} ms)",
                        request.getMethod(),
                        request.getRequestURI(),
                        status,
                        durationMs);
            }

            MDC.clear();
        }
    }

    static String resolveCorrelationId(HttpServletRequest request) {
        String fromHeader = request.getHeader(HEADER_NAME);
        if (!StringUtils.hasText(fromHeader)) {
            fromHeader = request.getHeader(LEGACY_HEADER_NAME);
        }
        if (StringUtils.hasText(fromHeader)) {
            return fromHeader.trim();
        }
        return UUID.randomUUID().toString();
    }

    private static boolean shouldLogAccess(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (!path.startsWith("/api/")) {
            return false;
        }
        return QUIET_PATH_PREFIXES.stream().noneMatch(path::startsWith);
    }
}
