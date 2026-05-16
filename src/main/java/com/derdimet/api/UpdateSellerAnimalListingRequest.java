package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import java.math.BigDecimal;
import java.util.List;

/** Kısmi güncelleme — gönderilen alanlar güncellenir. */
public record UpdateSellerAnimalListingRequest(
        AnimalCategory category,
        String type,
        String breed,
        Integer ageMonths,
        Integer quantity,
        BigDecimal avgWeightKg,
        BigDecimal price,
        String location,
        String description,
        List<String> imageUrls) {}
