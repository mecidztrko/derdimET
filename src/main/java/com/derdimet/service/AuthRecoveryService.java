package com.derdimet.service;

import com.derdimet.entity.AuthActionToken;
import com.derdimet.entity.AuthTokenPurpose;
import com.derdimet.entity.User;
import com.derdimet.repository.AuthActionTokenRepository;
import com.derdimet.repository.UserRepository;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthRecoveryService {
    private static final Logger log = LoggerFactory.getLogger(AuthRecoveryService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final AuthActionTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void sendEmailVerificationCode(String rawEmail) {
        var email = normalize(rawEmail);
        userRepository.findByEmail(email).ifPresent(user -> {
            if (user.isEmailVerified()) {
                return;
            }
            var code = createToken(email, AuthTokenPurpose.EMAIL_VERIFICATION);
            log.info("[Auth] Email verification code for {}: {}", email, code);
        });
    }

    @Transactional
    public void confirmEmailVerification(String rawEmail, String rawCode) {
        var email = normalize(rawEmail);
        var code = rawCode.trim();
        var now = LocalDateTime.now();
        var token = tokenRepository
                .findTopByEmailAndPurposeAndCodeAndUsedAtIsNullAndExpiresAtAfterOrderByIdDesc(
                        email, AuthTokenPurpose.EMAIL_VERIFICATION, code, now)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kod geçersiz veya süresi dolmuş"));
        token.setUsedAt(now);
        tokenRepository.save(token);

        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    @Transactional
    public void sendPasswordResetCode(String rawEmail) {
        var email = normalize(rawEmail);
        userRepository.findByEmail(email).ifPresent(user -> {
            var code = createToken(email, AuthTokenPurpose.PASSWORD_RESET);
            log.info("[Auth] Password reset code for {}: {}", email, code);
        });
    }

    @Transactional
    public void resetPassword(String rawEmail, String rawCode, String newPassword) {
        var email = normalize(rawEmail);
        var code = rawCode.trim();
        var now = LocalDateTime.now();
        var token = tokenRepository
                .findTopByEmailAndPurposeAndCodeAndUsedAtIsNullAndExpiresAtAfterOrderByIdDesc(
                        email, AuthTokenPurpose.PASSWORD_RESET, code, now)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kod geçersiz veya süresi dolmuş"));
        token.setUsedAt(now);
        tokenRepository.save(token);

        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String createToken(String email, AuthTokenPurpose purpose) {
        var token = new AuthActionToken();
        token.setEmail(email);
        token.setPurpose(purpose);
        token.setCode(generateCode());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(token);
        return token.getCode();
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String generateCode() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }
}
