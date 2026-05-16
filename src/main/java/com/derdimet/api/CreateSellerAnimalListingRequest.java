package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record CreateSellerAnimalListingRequest(
        @NotNull AnimalCategory category,
        @NotBlank String type,
        String breed,
        @Min(0) Integer ageMonths,
        @NotNull @Min(1) Integer quantity,
        @DecimalMin("0.0") BigDecimal avgWeightKg,
        @DecimalMin("0.0") BigDecimal price,
        String location,
        String description,
        List<String> imageUrls) {}
