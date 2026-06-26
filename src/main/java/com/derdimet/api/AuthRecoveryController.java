package com.derdimet.api;

import com.derdimet.service.AuthRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.derdimet.repository.UserRepository;

@RestController
@RequiredArgsConstructor
public class AuthRecoveryController {
    private final AuthRecoveryService authRecoveryService;
    private final UserRepository userRepository;

    @PostMapping("/api/auth/verification/send")
    public ResponseEntity<MessageResponse> sendVerification(@Valid @RequestBody EmailOnlyRequest request) {
        authRecoveryService.sendEmailVerificationCode(request.email());
        return ResponseEntity.ok(new MessageResponse("Eğer e-posta kayıtlıysa doğrulama kodu gönderildi"));
    }

    @PostMapping("/api/auth/verification/confirm")
    public ResponseEntity<MessageResponse> confirmVerification(@Valid @RequestBody EmailCodeRequest request) {
        authRecoveryService.confirmEmailVerification(request.email(), request.code());
        return ResponseEntity.ok(new MessageResponse("E-posta doğrulandı"));
    }

    @PostMapping("/api/auth/password/forgot")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody EmailOnlyRequest request) {
        authRecoveryService.sendPasswordResetCode(request.email());
        return ResponseEntity.ok(new MessageResponse("Eğer e-posta kayıtlıysa şifre sıfırlama kodu gönderildi"));
    }

    @PostMapping("/api/auth/password/reset")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authRecoveryService.resetPassword(request.email(), request.code(), request.newPassword());
        return ResponseEntity.ok(new MessageResponse("Şifre güncellendi"));
    }

    @PostMapping("/api/auth/password/change")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        var user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        authRecoveryService.changePassword(user, request.currentPassword(), request.newPassword());
        return ResponseEntity.ok(new MessageResponse("Şifre güncellendi"));
    }
}
