package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.SellerListingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/animal-listings")
@RequiredArgsConstructor
public class SellerAnimalListingController {

    private final UserRepository userRepository;
    private final SellerListingService sellerListingService;

    @GetMapping
    public List<SellerAnimalListingResponse> myListings(
            @AuthenticationPrincipal UserDetails principal, @RequestParam(required = false) String q) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return sellerListingService.myListings(seller, q);
    }

    @PostMapping
    public ResponseEntity<SellerAnimalListingResponse> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateSellerAnimalListingRequest body) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(sellerListingService.create(seller, body));
    }

    @PatchMapping("/{listingId}")
    public ResponseEntity<SellerAnimalListingResponse> update(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long listingId,
            @RequestBody UpdateSellerAnimalListingRequest body) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(sellerListingService.updateListing(seller, listingId, body));
    }

    @PostMapping("/{listingId}/close")
    public ResponseEntity<SellerAnimalListingResponse> close(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long listingId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(sellerListingService.closeListing(seller, listingId));
    }

    @PostMapping("/{listingId}/reopen")
    public ResponseEntity<SellerAnimalListingResponse> reopen(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long listingId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(sellerListingService.reopenListing(seller, listingId));
    }
}

