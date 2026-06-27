package com.derdimet.api;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ReviseMeatOfferRequest(
        @NotNull BigDecimal pricePerKg,
        BigDecimal quantity,
        String note) {}
