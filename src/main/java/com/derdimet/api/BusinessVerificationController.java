package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.BusinessVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me/business-verification")
@RequiredArgsConstructor
public class BusinessVerificationController {

    private final BusinessVerificationService businessVerificationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<AdminBusinessVerificationResponse> submit(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody SubmitBusinessVerificationRequest body) {
        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(businessVerificationService.submit(user, body));
    }
}
