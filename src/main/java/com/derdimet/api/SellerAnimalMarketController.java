package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalSellerMarketService;
import com.derdimet.service.SlaughterhouseListingMarketService;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerAnimalMarketController {

    private final UserRepository userRepository;
    private final AnimalSellerMarketService sellerService;
    private final SlaughterhouseListingMarketService listingMarketService;

    /** Diğer satıcıların açık hayvan ilanları (pazar takibi, teklif verilemez). */
    @GetMapping("/market-listings")
    public List<SellerAnimalListingResponse> browseMarketListings(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) AnimalCategory category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(required = false) Integer quantityMin,
            @RequestParam(required = false) Integer quantityMax,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false) String q) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return listingMarketService.browseMarketExcludingSeller(
                seller, category, type, ageMin, ageMax, quantityMin, quantityMax, priceMin, priceMax, sort, q);
    }

    /** Admin tarafından açılmış hayvan alış ilanları (açık olanlar). */
    @GetMapping("/animal-purchase-requests")
    public List<AnimalPurchaseRequestResponse> listOpenPurchaseRequests(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) AnimalCategory category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer quantityMin,
            @RequestParam(required = false) Integer quantityMax,
            @RequestParam(required = false) BigDecimal expectedWeightMin,
            @RequestParam(required = false) BigDecimal expectedWeightMax,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerService.listOpenPurchaseRequests(
                seller, category, q, quantityMin, quantityMax, expectedWeightMin, expectedWeightMax, sort);
    }

    @PostMapping("/animal-purchase-requests/{requestId}/offers")
    public ResponseEntity<AnimalOfferResponse> createOffer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long requestId,
            @Valid @RequestBody CreateAnimalOfferRequest body) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerService.createOffer(seller, requestId, body));
    }

    @GetMapping("/animal-offers")
    public List<SellerAnimalOfferItemResponse> listMyOffers(@AuthenticationPrincipal UserDetails principal) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerService.listMyOffers(seller);
    }

    @GetMapping("/favorite-animal-purchase-requests")
    public List<AnimalPurchaseRequestResponse> listFavoritePurchaseRequests(
            @AuthenticationPrincipal UserDetails principal) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerService.listFavoritePurchaseRequests(seller);
    }

    @PostMapping("/animal-purchase-requests/{requestId}/favorite/toggle")
    public ResponseEntity<FavoriteToggleController.ToggleResponse> togglePurchaseRequestFavorite(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long requestId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        boolean now = sellerService.togglePurchaseRequestFavorite(seller, requestId);
        return ResponseEntity.ok(new FavoriteToggleController.ToggleResponse(now));
    }
}
