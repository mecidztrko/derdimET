package com.derdimet.api;

import com.derdimet.entity.FavoriteSeller;
import java.time.LocalDateTime;

public record FavoriteSellerResponse(
        Long sellerId,
        String sellerName,
        String sellerEmail,
        LocalDateTime createdAt) {

    public static FavoriteSellerResponse fromEntity(FavoriteSeller e) {
        var s = e.getSeller();
        return new FavoriteSellerResponse(
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getEmail() : null,
                e.getCreatedAt());
    }
}

