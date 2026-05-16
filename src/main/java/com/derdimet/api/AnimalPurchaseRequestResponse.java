package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.RequestStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AnimalPurchaseRequestResponse(
        Long id,
        Long slaughterhouseId,
        String slaughterhouseName,
        String slaughterhouseCompanyName,
        String slaughterhouseCity,
        String title,
        AnimalCategory animalCategory,
        Integer quantity,
        BigDecimal expectedWeight,
        String description,
        RequestStatus status,
        LocalDateTime createdAt,
        Boolean isFavoritedByMe,
        Integer offerCount,
        Integer pendingOfferCount) {

    public static AnimalPurchaseRequestResponse fromEntity(AnimalPurchaseRequest e) {
        return fromEntity(e, null, null, null);
    }

    public static AnimalPurchaseRequestResponse fromEntity(AnimalPurchaseRequest e, Boolean isFavoritedByMe) {
        return fromEntity(e, isFavoritedByMe, null, null);
    }

    public static AnimalPurchaseRequestResponse fromEntity(
            AnimalPurchaseRequest e, Boolean isFavoritedByMe, Integer offerCount, Integer pendingOfferCount) {
        var sh = e.getCreatedBy();
        return new AnimalPurchaseRequestResponse(
                e.getId(),
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                sh != null ? sh.getCompanyName() : null,
                sh != null ? sh.getCity() : null,
                e.getTitle(),
                e.getAnimalCategory(),
                e.getQuantity(),
                e.getExpectedWeight(),
                e.getDescription(),
                e.getStatus(),
                e.getCreatedAt(),
                isFavoritedByMe,
                offerCount,
                pendingOfferCount);
    }
}
