package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.SlaughterhouseListingMarketService;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/slaughterhouse")
@RequiredArgsConstructor
public class SlaughterhouseAnimalListingController {

    private final UserRepository userRepository;
    private final SlaughterhouseListingMarketService marketService;

    /** Kesimhane tarafı: satıcıların açtığı ilanları listeler. */
    @GetMapping("/animal-listings")
    public List<SellerAnimalListingResponse> listOpenListings(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(required = false) AnimalCategory category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(required = false) Integer quantityMin,
            @RequestParam(required = false) Integer quantityMax,
            @RequestParam(required = false) java.math.BigDecimal priceMin,
            @RequestParam(required = false) java.math.BigDecimal priceMax,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return marketService.searchListings(category, type, ageMin, ageMax, quantityMin, quantityMax, priceMin, priceMax, sort);
    }

    @PostMapping("/animal-listings/{listingId}/offers")
    public ResponseEntity<ListingOfferResponse> createOffer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long listingId,
            @Valid @RequestBody CreateSlaughterhouseListingOfferRequest body) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(marketService.createOffer(slaughterhouse, listingId, body));
    }

    /** Satıcı tarafı: ilanlarına gelen teklifleri listeler (role seller). */
    @GetMapping("/seller/incoming-offers")
    public List<ListingOfferResponse> incomingOffers(@AuthenticationPrincipal UserDetails principal) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return marketService.listOffersForSeller(seller);
    }

    /** Kesimhane tarafı: verdiği teklifler. */
    @GetMapping("/offers")
    public List<ListingOfferResponse> myOffers(@AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return marketService.listMyOffers(slaughterhouse);
    }
}

