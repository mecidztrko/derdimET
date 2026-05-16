package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.FavoriteSlaughterhouseRepository;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.BuyerProfileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/buyer")
@RequiredArgsConstructor
public class BuyerProfileController {

    private final UserRepository userRepository;
    private final BuyerProfileService buyerProfileService;
    private final FavoriteSlaughterhouseRepository favoriteSlaughterhouseRepository;

    @GetMapping("/favorites")
    public List<FavoriteSellerResponse> favorites(@AuthenticationPrincipal UserDetails principal) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return buyerProfileService.listFavorites(buyer);
    }

    @PostMapping("/favorites/{sellerId}")
    public ResponseEntity<Void> addFavorite(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long sellerId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        buyerProfileService.addFavorite(buyer, sellerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/favorites/{sellerId}")
    public ResponseEntity<Void> removeFavorite(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long sellerId) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        buyerProfileService.removeFavorite(buyer, sellerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/purchases")
    public List<BuyerPurchaseItemResponse> purchases(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return buyerProfileService.listPurchases(buyer, limit);
    }

    /** Et alıcısının favorilediği kesimhaneler. */
    @GetMapping("/favorite-slaughterhouses")
    public List<FavoriteSlaughterhouseResponse> favoriteSlaughterhouses(
            @AuthenticationPrincipal UserDetails principal) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return favoriteSlaughterhouseRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                .map(FavoriteSlaughterhouseResponse::fromEntity)
                .toList();
    }
}

