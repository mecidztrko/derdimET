package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.BuyerProfileService;
import com.derdimet.service.SlaughterhouseProfileService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/slaughterhouse/profile")
@RequiredArgsConstructor
public class SlaughterhouseProfileController {

    private final UserRepository userRepository;
    private final BuyerProfileService buyerProfileService;
    private final SlaughterhouseProfileService slaughterhouseProfileService;

    /** Kesimhane profilinde favori satıcıları listeler. */
    @GetMapping("/favorites/sellers")
    public List<FavoriteSellerResponse> favoriteSellers(
            @AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse =
                userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return buyerProfileService.listFavorites(slaughterhouse);
    }

    @PostMapping("/favorites/sellers/{sellerId}")
    public ResponseEntity<Void> addFavoriteSeller(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long sellerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        buyerProfileService.addFavorite(slaughterhouse, sellerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/favorites/sellers/{sellerId}")
    public ResponseEntity<Void> removeFavoriteSeller(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long sellerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        buyerProfileService.removeFavorite(slaughterhouse, sellerId);
        return ResponseEntity.noContent().build();
    }

    /** Kesimhane profilinde favori alıcıları (MEAT_BUYER) listeler. */
    @GetMapping("/favorites/buyers")
    public List<FavoriteMeatBuyerResponse> favoriteBuyers(
            @AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return slaughterhouseProfileService.listFavoriteBuyers(slaughterhouse);
    }

    @PostMapping("/favorites/buyers/{buyerId}")
    public ResponseEntity<Void> addFavoriteBuyer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long buyerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        slaughterhouseProfileService.addFavoriteBuyer(slaughterhouse, buyerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/favorites/buyers/{buyerId}")
    public ResponseEntity<Void> removeFavoriteBuyer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long buyerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        slaughterhouseProfileService.removeFavoriteBuyer(slaughterhouse, buyerId);
        return ResponseEntity.noContent().build();
    }

    /** Kesimhane: hayvan satıcılarından alınan (ACCEPTED) alımlar. */
    @GetMapping("/purchases")
    public List<SlaughterhousePurchaseItemResponse> purchases(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return slaughterhouseProfileService.listPurchases(slaughterhouse, limit);
    }

    /** Kesimhane: et satışları (orders). */
    @GetMapping("/sales")
    public List<SlaughterhouseSaleItemResponse> sales(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return slaughterhouseProfileService.listSales(slaughterhouse, limit);
    }
}

