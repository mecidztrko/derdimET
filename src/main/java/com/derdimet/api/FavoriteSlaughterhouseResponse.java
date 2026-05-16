package com.derdimet.api;

import com.derdimet.entity.FavoriteSlaughterhouse;
import java.time.LocalDateTime;

public record FavoriteSlaughterhouseResponse(
        Long slaughterhouseId,
        String slaughterhouseName,
        String slaughterhouseCompanyName,
        String slaughterhouseCity,
        String slaughterhouseEmail,
        LocalDateTime createdAt) {

    public static FavoriteSlaughterhouseResponse fromEntity(FavoriteSlaughterhouse e) {
        var s = e.getSlaughterhouse();
        return new FavoriteSlaughterhouseResponse(
                s != null ? s.getId() : null,
                s != null ? s.getName() : null,
                s != null ? s.getCompanyName() : null,
                s != null ? s.getCity() : null,
                s != null ? s.getEmail() : null,
                e.getCreatedAt());
    }
}
