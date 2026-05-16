package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalPurchaseAdminService;
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
@RequestMapping("/api/slaughterhouse/animal-purchase-requests")
@RequiredArgsConstructor
public class AdminAnimalPurchaseController {

    private final UserRepository userRepository;
    private final AnimalPurchaseAdminService adminService;

    @GetMapping
    public List<AnimalPurchaseRequestResponse> list(@AuthenticationPrincipal UserDetails principal) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return adminService.listMyRequests(slaughterhouse);
    }

    @PostMapping
    public ResponseEntity<AnimalPurchaseRequestResponse> create(
            @AuthenticationPrincipal UserDetails principal, @Valid @RequestBody CreateAnimalPurchaseRequest body) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.create(slaughterhouse, body));
    }

    @PatchMapping("/{requestId}")
    public ResponseEntity<AnimalPurchaseRequestResponse> update(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long requestId,
            @Valid @RequestBody UpdateAnimalPurchaseRequest body) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(adminService.update(slaughterhouse, requestId, body));
    }

    @PostMapping("/{requestId}/close")
    public ResponseEntity<AnimalPurchaseRequestResponse> close(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long requestId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(adminService.close(slaughterhouse, requestId));
    }

    @GetMapping("/{requestId}/offers")
    public List<PurchaseRequestIncomingOfferResponse> listOffers(
            @AuthenticationPrincipal UserDetails principal, @PathVariable Long requestId) {
        User slaughterhouse = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        return adminService.listIncomingOffers(slaughterhouse, requestId);
    }
}
