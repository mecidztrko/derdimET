package com.derdimet.api;

import com.derdimet.entity.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SlaughterhouseSaleItemResponse(
        Long orderId,
        Long buyerId,
        String buyerName,
        Long meatOfferId,
        Long saleRequestId,
        String saleTitle,
        String meatType,
        BigDecimal totalPrice,
        String status,
        LocalDateTime createdAt) {

    public static SlaughterhouseSaleItemResponse fromEntity(Order o) {
        var b = o.getBuyer();
        var offer = o.getMeatOffer();
        var sr = offer != null ? offer.getSaleRequest() : null;
        return new SlaughterhouseSaleItemResponse(
                o.getId(),
                b != null ? b.getId() : null,
                b != null ? b.getName() : null,
                offer != null ? offer.getId() : null,
                sr != null ? sr.getId() : null,
                sr != null ? sr.getTitle() : null,
                sr != null ? sr.getMeatType() : null,
                o.getTotalPrice(),
                o.getStatus() != null ? o.getStatus().name() : null,
                o.getCreatedAt());
    }
}

