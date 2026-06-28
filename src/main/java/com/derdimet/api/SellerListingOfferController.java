package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.SlaughterhouseListingMarketService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerListingOfferController {

    private final UserRepository userRepository;
    private final SlaughterhouseListingMarketService listingMarketService;

    /** İlanlarıma gelen kesimhane teklifleri. */
    @GetMapping("/incoming-listing-offers")
    public List<ListingOfferResponse> incomingListingOffers(@AuthenticationPrincipal UserDetails principal) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return listingMarketService.listOffersForSeller(seller);
    }

    @PostMapping("/listing-offers/{offerId}/accept")
    public ResponseEntity<ListingOfferResponse> accept(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(listingMarketService.respondToListingOffer(seller, offerId, true));
    }

    @PostMapping("/listing-offers/{offerId}/reject")
    public ResponseEntity<ListingOfferResponse> reject(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(listingMarketService.respondToListingOffer(seller, offerId, false));
    }

    @GetMapping("/listing-offers/{offerId}/history")
    public List<OfferEventResponse> incomingOfferHistory(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User seller = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return listingMarketService.listIncomingOfferHistoryForSeller(seller, offerId);
    }
}
