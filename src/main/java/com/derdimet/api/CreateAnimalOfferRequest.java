package com.derdimet.api;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateAnimalOfferRequest(
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal pricePerKg,
        @Min(1) @Max(100_000) Integer animalCount,
        @Size(max = 2000) String note) {}
