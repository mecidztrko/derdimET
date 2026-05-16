package com.derdimet.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

public record CreateSlaughterhouseListingOfferRequest(
        @DecimalMin("0.0") BigDecimal pricePerKg,
        @Min(1) Integer quantity,
        String note) {}

