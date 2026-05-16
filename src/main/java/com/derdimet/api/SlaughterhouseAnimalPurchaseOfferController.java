package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalPurchaseAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slaughterhouse/animal-purchase-offers")
@RequiredArgsConstructor
public class SlaughterhouseAnimalPurchaseOfferController {

    private final UserRepository userRepository;
    private final AnimalPurchaseAdminService purchaseService;

    @PostMapping("/{offerId}/accept")
    public ResponseEntity<PurchaseRequestIncomingOfferResponse> accept(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(purchaseService.respondToOffer(slaughterhouse, offerId, true));
    }

    @PostMapping("/{offerId}/reject")
    public ResponseEntity<PurchaseRequestIncomingOfferResponse> reject(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(purchaseService.respondToOffer(slaughterhouse, offerId, false));
    }
}
