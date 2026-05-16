package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteToggleController {

    private final UserRepository userRepository;
    private final FavoriteService favoriteService;

    public record ToggleResponse(boolean isFavoritedByMe) {}

    /** Toggle: ekli ise siler, ekli değilse ekler. */
    @PostMapping("/toggle/{userId}")
    public ResponseEntity<ToggleResponse> toggle(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long userId) {
        User me = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        boolean now = favoriteService.toggleFavorite(me, userId);
        return ResponseEntity.ok(new ToggleResponse(now));
    }
}
