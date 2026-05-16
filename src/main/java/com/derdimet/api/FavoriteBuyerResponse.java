package com.derdimet.api;

import com.derdimet.entity.FavoriteBuyer;
import java.time.LocalDateTime;

public record FavoriteBuyerResponse(
        Long buyerId,
        String buyerName,
        String buyerEmail,
        LocalDateTime createdAt) {

    public static FavoriteBuyerResponse fromEntity(FavoriteBuyer e) {
        var b = e.getBuyer();
        return new FavoriteBuyerResponse(
                b != null ? b.getId() : null,
                b != null ? b.getName() : null,
                b != null ? b.getEmail() : null,
                e.getCreatedAt());
    }
}

