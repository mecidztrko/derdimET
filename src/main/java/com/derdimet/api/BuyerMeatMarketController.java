package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.MeatMarketService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BuyerMeatMarketController {

    private final UserRepository userRepository;
    private final MeatMarketService meatMarketService;

    /** Et alıcılarının gördüğü: kesimhanelerin açtığı açık et ilanları. */
    @GetMapping("/api/buyer/meat-sale-requests")
    public List<MeatSaleRequestResponse> listOpenSaleRequests(@AuthenticationPrincipal UserDetails principal) {
        userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listOpenSaleRequests();
    }

    @PostMapping("/api/buyer/meat-sale-requests/{saleRequestId}/offers")
    public ResponseEntity<MeatOfferItemResponse> createOffer(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long saleRequestId,
            @Valid @RequestBody CreateMeatOfferRequest body) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(meatMarketService.createOffer(buyer, saleRequestId, body));
    }

    @GetMapping("/api/buyer/meat-offers")
    public List<MeatOfferItemResponse> listMyOffers(@AuthenticationPrincipal UserDetails principal) {
        User buyer = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listMyOffers(buyer);
    }
}

