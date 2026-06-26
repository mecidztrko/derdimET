package com.derdimet.config;

import com.derdimet.security.JwtAuthenticationFilter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsProperties corsProperties;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth.requestMatchers(
                                        "/swagger-ui/**",
                                        "/swagger-ui.html",
                                        "/v3/api-docs",
                                        "/v3/api-docs/**")
                        .permitAll()
                        .requestMatchers(
                                        "/api/auth/login",
                                        "/api/auth/session-login",
                                        "/api/register",
                                        "/api/auth/verification/send",
                                        "/api/auth/verification/confirm",
                                        "/api/auth/password/forgot",
                                        "/api/auth/password/reset")
                        .permitAll()
                        .requestMatchers("/uploads/**")
                        .permitAll()
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")
                        .requestMatchers("/api/seller/**")
                        .hasRole("ANIMAL_SELLER")
                        .requestMatchers("/api/slaughterhouse/**")
                        .hasRole("SLAUGHTERHOUSE")
                        .requestMatchers("/api/buyer/**")
                        .hasRole("MEAT_BUYER")
                        .requestMatchers("/api/me")
                        .authenticated()
                        .requestMatchers("/api/media/**")
                        .authenticated()
                        .requestMatchers("/api/users/*/public", "/api/users/*/public/listings")
                        .authenticated()
                        .requestMatchers("/api/listings/**")
                        .authenticated()
                        .requestMatchers("/api/meat-sale-requests/**")
                        .authenticated()
                        .requestMatchers("/api/favorites/**")
                        .authenticated()
                        .requestMatchers("/api/conversations/**")
                        .authenticated()
                        .requestMatchers("/api/conversations")
                        .authenticated()
                        .requestMatchers("/api/notifications/**")
                        .authenticated()
                        .anyRequest()
                        .permitAll())
                .exceptionHandling(ex -> ex.defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), new AntPathRequestMatcher("/api/**"))
                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {
                                    if (request.getRequestURI() != null
                                            && request.getRequestURI().startsWith("/api/")) {
                                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                                        response.setCharacterEncoding("UTF-8");
                                        response.setContentType("application/json;charset=UTF-8");
                                        response.getWriter().write("{\"message\":\"Bu işlem için yetkiniz yok\"}");
                                    } else {
                                        response.sendError(HttpServletResponse.SC_FORBIDDEN);
                                    }
                                }))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.loginPage("/auth/index.html")
                        .loginProcessingUrl("/perform_login")
                        .permitAll()
                        .defaultSuccessUrl("/auth/index.html?r=dashboard", true) // frontend maps r=dashboard → #/role-selector
                        .failureUrl("/auth/index.html?r=login&error=1"))
                .logout(logout -> logout.logoutUrl("/logout")
                        .logoutSuccessUrl("/auth/index.html?r=login")
                        .permitAll());
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        List<String> origins = corsProperties.resolvedPatterns();
        if (!origins.isEmpty()) {
            c.setAllowedOriginPatterns(origins);
            c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            c.setAllowedHeaders(List.of("*"));
            c.setAllowCredentials(false);
        }
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", c);
        return source;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
