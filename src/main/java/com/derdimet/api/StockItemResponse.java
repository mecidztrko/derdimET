package com.derdimet.api;

import com.derdimet.entity.Stock;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record StockItemResponse(
        Long stockId,
        Long meatProductId,
        String meatType,
        BigDecimal quantityKg,
        LocalDateTime lastUpdate) {

    public static StockItemResponse fromEntity(Stock stock) {
        var product = stock.getMeatProduct();
        return new StockItemResponse(
                stock.getId(),
                product != null ? product.getId() : null,
                product != null ? product.getMeatType() : null,
                stock.getQuantity(),
                stock.getLastUpdate());
    }
}
