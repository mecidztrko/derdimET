package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AdminCreateAnimalPurchaseRequest(
        @NotNull Long slaughterhouseUserId,
        @NotBlank @Size(max = 300) String title,
        @NotNull AnimalCategory animalCategory,
        @Min(1) Integer quantity,
        @DecimalMin(value = "0.0", inclusive = false) BigDecimal expectedWeight,
        @Size(max = 5000) String description) {}
