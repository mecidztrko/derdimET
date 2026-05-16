package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.MeatMarketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slaughterhouse/meat-sale-requests")
@RequiredArgsConstructor
public class SlaughterhouseMeatController {

    private final UserRepository userRepository;
    private final MeatMarketService meatMarketService;

    @GetMapping
    public List<MeatSaleRequestResponse> myListings(@AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return meatMarketService.listMySaleRequests(slaughterhouse);
    }

    @PostMapping
    public ResponseEntity<MeatSaleRequestResponse> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateMeatSaleRequest body) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(meatMarketService.createSaleRequest(slaughterhouse, body));
    }

    @PatchMapping("/{saleRequestId}")
    public ResponseEntity<MeatSaleRequestResponse> update(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long saleRequestId,
            @RequestBody UpdateMeatSaleRequest body) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.updateSaleRequest(slaughterhouse, saleRequestId, body));
    }

    @PostMapping("/{saleRequestId}/close")
    public ResponseEntity<MeatSaleRequestResponse> close(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long saleRequestId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(meatMarketService.closeSaleRequest(slaughterhouse, saleRequestId));
    }
}

