package com.derdimet.api;

import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.Order;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BuyerPurchaseItemResponse(
        Long orderId,
        Long meatOfferId,
        Long saleRequestId,
        String saleTitle,
        String meatType,
        Long slaughterhouseId,
        String slaughterhouseName,
        String slaughterhouseCompanyName,
        BigDecimal pricePerKg,
        BigDecimal quantity,
        BigDecimal totalPrice,
        OrderStatus status,
        LocalDateTime createdAt) {

    public static BuyerPurchaseItemResponse fromEntity(Order o) {
        MeatOffer offer = o.getMeatOffer();
        MeatSaleRequest sr = offer != null ? offer.getSaleRequest() : null;
        User sh = sr != null ? sr.getSlaughterhouse() : null;
        return new BuyerPurchaseItemResponse(
                o.getId(),
                offer != null ? offer.getId() : null,
                sr != null ? sr.getId() : null,
                sr != null ? sr.getTitle() : null,
                sr != null ? sr.getMeatType() : null,
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                sh != null ? sh.getCompanyName() : null,
                offer != null ? offer.getPricePerKg() : null,
                offer != null ? offer.getQuantity() : null,
                o.getTotalPrice(),
                o.getStatus(),
                o.getCreatedAt());
    }

    /** Sipariş oluşmadan kabul edilmiş et teklifleri. */
    public static BuyerPurchaseItemResponse fromAcceptedOffer(MeatOffer offer) {
        MeatSaleRequest sr = offer.getSaleRequest();
        User sh = sr != null ? sr.getSlaughterhouse() : null;
        BigDecimal price = offer.getPricePerKg();
        BigDecimal qty = offer.getQuantity();
        BigDecimal total = null;
        if (price != null && qty != null) {
            total = price.multiply(qty);
        }
        return new BuyerPurchaseItemResponse(
                null,
                offer.getId(),
                sr != null ? sr.getId() : null,
                sr != null ? sr.getTitle() : null,
                sr != null ? sr.getMeatType() : null,
                sh != null ? sh.getId() : null,
                sh != null ? sh.getName() : null,
                sh != null ? sh.getCompanyName() : null,
                price,
                qty,
                total,
                OrderStatus.COMPLETED,
                offer.getCreatedAt());
    }
}
