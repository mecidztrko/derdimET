package com.derdimet.config;

import com.derdimet.security.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final RateLimitProperties properties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!properties.isEnabled() || !"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        RateRule rule = RULES.get(path);
        if (rule == null) {
            filterChain.doFilter(request, response);
            return;
        }

        int limit = resolveLimit(rule);
        String key = rule.bucket() + ":" + clientIp(request);
        if (!rateLimitService.tryConsume(key, limit, rule.window())) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"message\":\"Çok fazla istek. Lütfen bir süre sonra tekrar deneyin.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private int resolveLimit(RateRule rule) {
        return switch (rule.bucket()) {
            case "login" -> properties.getLoginMaxPerMinute();
            case "register" -> properties.getRegisterMaxPerHour();
            case "password-recovery" -> properties.getPasswordRecoveryMaxPerHour();
            default -> 10;
        };
    }

    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final Map<String, RateRule> RULES = Map.of(
            "/api/auth/login", new RateRule("login", Duration.ofMinutes(1)),
            "/api/register", new RateRule("register", Duration.ofHours(1)),
            "/api/auth/password/forgot", new RateRule("password-recovery", Duration.ofHours(1)),
            "/api/auth/password/reset", new RateRule("password-recovery", Duration.ofHours(1)),
            "/api/auth/verification/send", new RateRule("password-recovery", Duration.ofHours(1)));

    private record RateRule(String bucket, Duration window) {}
}
