package com.derdimet.api;

import com.derdimet.entity.AnimalCategory;
import java.math.BigDecimal;
import java.util.List;

/** Kısmi güncelleme — gönderilen alanlar güncellenir. */
public record UpdateMeatSaleRequest(
        String title,
        String meatType,
        AnimalCategory animalCategory,
        String cut,
        BigDecimal quantity,
        BigDecimal pricePerKg,
        String packaging,
        String location,
        String description,
        List<String> imageUrls) {}
