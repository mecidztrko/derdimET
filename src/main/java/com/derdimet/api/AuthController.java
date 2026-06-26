package com.derdimet.api;

import com.derdimet.entity.AuditAction;
import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.security.JwtService;
import com.derdimet.security.RefreshTokenService;
import com.derdimet.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Mobil ve diğer istemciler için JSON tabanlı giriş. Web arayüzü form oturumunu kullanmaya devam eder.
 */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuditService auditService;

    @PostMapping("/api/auth/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (org.springframework.security.core.AuthenticationException ex) {
            auditService.logAuthEvent(request.email(), AuditAction.LOGIN_FAILED, "Başarısız giriş denemesi");
            throw ex;
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow();
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = refreshTokenService.issue(user);
        auditService.log(user, AuditAction.LOGIN_SUCCESS, "AUTH", null, "JWT giriş");
        return ResponseEntity.ok(
                new TokenResponse(accessToken, refreshToken, jwtService.accessExpirationSeconds()));
    }

    @PostMapping("/api/auth/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        User user = refreshTokenService.validateAndGetUser(request.refreshToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = refreshTokenService.rotate(user, request.refreshToken());
        return ResponseEntity.ok(
                new TokenResponse(accessToken, refreshToken, jwtService.accessExpirationSeconds()));
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<MessageResponse> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revoke(request.refreshToken());
        return ResponseEntity.ok(new MessageResponse("Oturum sonlandırıldı"));
    }
}
