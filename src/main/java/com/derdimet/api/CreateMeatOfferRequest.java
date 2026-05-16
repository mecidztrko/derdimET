package com.derdimet.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record CreateMeatOfferRequest(
        @NotNull @DecimalMin("0.0") BigDecimal pricePerKg,
        @NotNull @DecimalMin("0.0") BigDecimal quantity,
        String note) {}

