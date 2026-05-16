package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.RequestStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record SellerAnimalListingResponse(
        Long id,
        Long sellerId,
        String sellerName,
        String sellerCompanyName,
        String sellerCity,
        AnimalCategory category,
        String type,
        String breed,
        Integer ageMonths,
        Integer quantity,
        BigDecimal avgWeightKg,
        BigDecimal price,
        String location,
        String description,
        List<String> imageUrls,
        RequestStatus status,
        LocalDateTime createdAt,
        Boolean isFavoritedByMe) {

    public static SellerAnimalListingResponse fromEntity(SellerAnimalListing e) {
        return fromEntity(e, null);
    }

    public static SellerAnimalListingResponse fromEntity(SellerAnimalListing e, Boolean isFavoritedByMe) {
        var s = e.getSeller();
        return new SellerAnimalListingResponse(
                e.getId(),
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                s != null ? s.getCity() : null,
                e.getCategory(),
                e.getType(),
                e.getBreed(),
                e.getAgeMonths(),
                e.getQuantity(),
                e.getAvgWeightKg(),
                e.getPrice(),
                e.getLocation(),
                e.getDescription(),
                splitImageUrls(e.getImageUrls()),
                e.getStatus(),
                e.getCreatedAt(),
                isFavoritedByMe);
    }

    static List<String> splitImageUrls(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return java.util.Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();
    }
}
