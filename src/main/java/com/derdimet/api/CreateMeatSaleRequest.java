package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record CreateMeatSaleRequest(
        @NotBlank String title,
        @NotBlank String meatType,
        AnimalCategory animalCategory,
        String cut,
        @NotNull @DecimalMin("0.0") BigDecimal quantity,
        @DecimalMin("0.0") BigDecimal pricePerKg,
        String packaging,
        String location,
        String description,
        List<String> imageUrls) {}
