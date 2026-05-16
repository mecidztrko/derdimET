package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.SellerProfileService;
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
@RequestMapping("/api/seller/profile")
@RequiredArgsConstructor
public class SellerProfileController {

    private final UserRepository userRepository;
    private final SellerProfileService sellerProfileService;

    @GetMapping("/favorites")
    public List<FavoriteBuyerResponse> favorites(@AuthenticationPrincipal UserDetails principal) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerProfileService.listFavorites(seller);
    }

    @PostMapping("/favorites/{buyerId}")
    public ResponseEntity<Void> addFavorite(@AuthenticationPrincipal UserDetails principal, @PathVariable Long buyerId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        sellerProfileService.addFavorite(seller, buyerId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/favorites/{buyerId}")
    public ResponseEntity<Void> removeFavorite(@AuthenticationPrincipal UserDetails principal, @PathVariable Long buyerId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        sellerProfileService.removeFavorite(seller, buyerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sales")
    public List<SellerSaleItemResponse> sales(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerProfileService.listSales(seller, limit);
    }
}

