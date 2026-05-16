package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.MeatMarketService;
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
@RequestMapping("/api/slaughterhouse/meat-offers")
@RequiredArgsConstructor
public class SlaughterhouseMeatOfferController {

    private final UserRepository userRepository;
    private final MeatMarketService meatMarketService;

    @GetMapping
    public List<SlaughterhouseMeatOfferResponse> listIncoming(@AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listIncomingMeatOffers(slaughterhouse);
    }

    @PostMapping("/{offerId}/accept")
    public ResponseEntity<SlaughterhouseMeatOfferResponse> accept(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.respondToMeatOffer(slaughterhouse, offerId, true));
    }

    @PostMapping("/{offerId}/reject")
    public ResponseEntity<SlaughterhouseMeatOfferResponse> reject(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long offerId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.respondToMeatOffer(slaughterhouse, offerId, false));
    }
}
