package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MeController {

    private final UserRepository userRepository;
    private final ProfileService profileService;

    /**
     * Oturumdaki kullanıcının rolü ve profil özeti (ileride rol bazlı ana ekran / SPA için).
     * Spring Security oturumunda zaten {@code ROLE_MEAT_BUYER} vb. yetkiler vardır; bu API aynı
     * kullanıcıyı veritabanından okuyarak {@code role} alanını JSON olarak döner.
     */
    @GetMapping("/api/me")
    public ResponseEntity<MeResponse> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository
                .findByEmail(principal.getUsername())
                .map(u -> ResponseEntity.ok(ProfileService.toMeResponse(u)))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    @PatchMapping("/api/me")
    public ResponseEntity<MeResponse> updateProfile(
            @AuthenticationPrincipal UserDetails principal, @RequestBody UpdateProfileRequest body) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(profileService.updateProfile(user, body));
    }
}
