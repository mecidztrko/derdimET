package com.derdimet.api;

import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalPurchaseAdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMarketController {

    private final UserRepository userRepository;
    private final AnimalPurchaseAdminService purchaseService;

    @GetMapping("/slaughterhouses")
    public List<AdminSlaughterhouseOptionResponse> listSlaughterhouses() {
        return userRepository.findByRoleOrderByNameAsc(UserRole.SLAUGHTERHOUSE).stream()
                .map(u -> new AdminSlaughterhouseOptionResponse(u.getId(), u.getName(), u.getEmail()))
                .toList();
    }

    @PostMapping("/animal-purchase-requests")
    public ResponseEntity<AnimalPurchaseRequestResponse> create(
            @Valid @RequestBody AdminCreateAnimalPurchaseRequest body) {
        User slaughterhouse =
                userRepository
                        .findById(body.slaughterhouseUserId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kesimhane bulunamadı"));
        if (slaughterhouse.getRole() != UserRole.SLAUGHTERHOUSE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seçilen kullanıcı kesimhane değil");
        }
        CreateAnimalPurchaseRequest req =
                new CreateAnimalPurchaseRequest(
                        body.title(),
                        body.animalCategory(),
                        body.quantity(),
                        body.expectedWeight(),
                        body.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseService.create(slaughterhouse, req));
    }
}
