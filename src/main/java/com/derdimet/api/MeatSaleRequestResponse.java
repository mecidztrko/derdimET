package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.ListingClosedReason;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.RequestStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record MeatSaleRequestResponse(
        Long id,
        Long slaughterhouseId,
        String slaughterhouseName,
        String slaughterhouseCompanyName,
        String slaughterhouseCity,
        String title,
        String meatType,
        AnimalCategory animalCategory,
        String cut,
        BigDecimal quantity,
        BigDecimal pricePerKg,
        String packaging,
        String location,
        String description,
        List<String> imageUrls,
        RequestStatus status,
        ListingClosedReason closedReason,
        LocalDateTime expiresAt,
        LocalDateTime closedAt,
        LocalDateTime createdAt,
        Boolean isFavoritedByMe) {

    public static MeatSaleRequestResponse fromEntity(MeatSaleRequest e) {
        return fromEntity(e, null);
    }

    public static MeatSaleRequestResponse fromEntity(MeatSaleRequest e, Boolean isFavoritedByMe) {
        var s = e.getSlaughterhouse();
        return new MeatSaleRequestResponse(
                e.getId(),
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                s != null ? s.getCity() : null,
                e.getTitle(),
                e.getMeatType(),
                e.getAnimalCategory(),
                e.getCut(),
                e.getQuantity(),
                e.getPricePerKg(),
                e.getPackaging(),
                e.getLocation(),
                e.getDescription(),
                SellerAnimalListingResponse.splitImageUrls(e.getImageUrls()),
                e.getStatus(),
                e.getClosedReason(),
                e.getExpiresAt(),
                e.getClosedAt(),
                e.getCreatedAt(),
                isFavoritedByMe);
    }
}
