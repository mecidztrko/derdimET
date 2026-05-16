package com.derdimet.api;

import com.derdimet.entity.FavoriteMeatBuyer;
import java.time.LocalDateTime;

public record FavoriteMeatBuyerResponse(
        Long buyerId,
        String buyerName,
        String buyerEmail,
        LocalDateTime createdAt) {

    public static FavoriteMeatBuyerResponse fromEntity(FavoriteMeatBuyer e) {
        var b = e.getBuyer();
        return new FavoriteMeatBuyerResponse(
                b != null ? b.getId() : null,
                b != null ? b.getName() : null,
                b != null ? b.getEmail() : null,
                e.getCreatedAt());
    }
}

