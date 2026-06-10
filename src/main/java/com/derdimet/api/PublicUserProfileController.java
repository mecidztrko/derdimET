package com.derdimet.api;

import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class PublicUserProfileController {

    private final UserRepository userRepository;
    private final MeatSaleRequestRepository meatSaleRequestRepository;
    private final SellerAnimalListingRepository sellerAnimalListingRepository;

    @GetMapping("/{id}/public")
    public ResponseEntity<PublicUserProfileResponse> publicProfile(@PathVariable Long id) {
        var u = userRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        return ResponseEntity.ok(PublicUserProfileResponse.fromEntity(u));
    }

    @GetMapping("/{id}/public/listings")
    public ResponseEntity<PublicUserListingsResponse> publicListings(@PathVariable Long id) {
        var u = userRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        return ResponseEntity.ok(
                PublicUserListingsResponse.forUser(u, meatSaleRequestRepository, sellerAnimalListingRepository));
    }
}
