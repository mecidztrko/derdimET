package com.derdimet.api;

import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import java.util.List;

public record PublicUserListingsResponse(
        List<MeatSaleRequestResponse> meatListings, List<SellerAnimalListingResponse> animalListings) {

    public static PublicUserListingsResponse forUser(
            User user, MeatSaleRequestRepository meatRepo, SellerAnimalListingRepository animalRepo) {
        return switch (user.getRole()) {
            case SLAUGHTERHOUSE -> new PublicUserListingsResponse(
                    meatRepo.findBySlaughterhouseAndStatusOrderByCreatedAtDesc(user, RequestStatus.OPEN).stream()
                            .map(MeatSaleRequestResponse::fromEntity)
                            .toList(),
                    List.of());
            case ANIMAL_SELLER -> new PublicUserListingsResponse(
                    List.of(),
                    animalRepo.findBySellerOrderByCreatedAtDesc(user).stream()
                            .filter(l -> l.getStatus() == RequestStatus.OPEN)
                            .map(SellerAnimalListingResponse::fromEntity)
                            .toList());
            default -> new PublicUserListingsResponse(List.of(), List.of());
        };
    }
}
