package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Tüm rollerin erişebileceği ilan detay endpoint'leri. Mobilde liste → detay sayfasında kullanılır.
 * Response içinde "isFavoritedByMe" ile mevcut kullanıcının ilan sahibini favorileyip favorilemediği bilgisi gelir.
 */
@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingDetailController {

    private final UserRepository userRepository;
    private final SellerAnimalListingRepository sellerAnimalListingRepository;
    private final MeatSaleRequestRepository meatSaleRequestRepository;
    private final AnimalPurchaseRequestRepository animalPurchaseRequestRepository;
    private final FavoriteService favoriteService;

    @GetMapping("/animal/{id}")
    public ResponseEntity<SellerAnimalListingResponse> animalListing(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var listing = sellerAnimalListingRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = checkFavoriteForSeller(principal, listing.getSeller());
        return ResponseEntity.ok(SellerAnimalListingResponse.fromEntity(listing, fav));
    }

    @GetMapping("/meat/{id}")
    public ResponseEntity<MeatSaleRequestResponse> meatSaleRequest(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var sale = meatSaleRequestRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = checkFavoriteForSeller(principal, sale.getSlaughterhouse());
        return ResponseEntity.ok(MeatSaleRequestResponse.fromEntity(sale, fav));
    }

    @GetMapping("/animal-request/{id}")
    public ResponseEntity<AnimalPurchaseRequestResponse> animalPurchaseRequest(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var req = animalPurchaseRequestRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "İlan bulunamadı"));
        Boolean fav = checkFavoriteForSeller(principal, req.getCreatedBy());
        return ResponseEntity.ok(AnimalPurchaseRequestResponse.fromEntity(req, fav));
    }

    private Boolean checkFavoriteForSeller(UserDetails principal, User owner) {
        if (principal == null || owner == null) return null;
        return userRepository
                .findByEmail(principal.getUsername())
                .map(me -> favoriteService.isFavoritedByMe(me, owner.getId()))
                .orElse(null);
    }
}
