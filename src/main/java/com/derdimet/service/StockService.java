package com.derdimet.service;

import com.derdimet.api.StockItemResponse;
import com.derdimet.entity.Animal;
import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.AnimalStatus;
import com.derdimet.entity.MeatProduct;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.Stock;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalRepository;
import com.derdimet.repository.MeatProductRepository;
import com.derdimet.repository.StockRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StockService {

    private final AnimalRepository animalRepository;
    private final MeatProductRepository meatProductRepository;
    private final StockRepository stockRepository;

    @Transactional
    public void receiveFromAnimalDeal(AnimalDeal deal) {
        if (deal == null || animalRepository.existsByAnimalDeal_Id(deal.getId())) {
            return;
        }
        User slaughterhouse = deal.getSlaughterhouse();
        if (slaughterhouse == null) {
            return;
        }

        SellerAnimalListing listing =
                deal.getListingOffer() != null ? deal.getListingOffer().getListing() : null;
        String animalType = listing != null
                ? listing.getType()
                : deal.getAnimalOffer() != null && deal.getAnimalOffer().getRequest() != null
                        ? deal.getAnimalOffer().getRequest().getTitle()
                        : "Hayvan";
        BigDecimal unitWeight = listing != null && listing.getAvgWeightKg() != null
                ? listing.getAvgWeightKg()
                : deal.getAnimalOffer() != null
                                && deal.getAnimalOffer().getRequest() != null
                                && deal.getAnimalOffer().getRequest().getExpectedWeight() != null
                        ? deal.getAnimalOffer().getRequest().getExpectedWeight()
                        : BigDecimal.valueOf(400);
        int count = deal.getQuantity() != null ? deal.getQuantity() : 1;
        BigDecimal totalKg = unitWeight.multiply(BigDecimal.valueOf(count));

        Animal animal = new Animal();
        animal.setAnimalDeal(deal);
        animal.setSlaughterhouse(slaughterhouse);
        animal.setAnimalType(animalType);
        animal.setWeight(totalKg);
        animal.setArrivalDate(LocalDate.now());
        animal.setStatus(AnimalStatus.WAITING);
        animal = animalRepository.save(animal);

        MeatProduct product = new MeatProduct();
        product.setAnimal(animal);
        product.setSlaughterhouse(slaughterhouse);
        product.setMeatType(listing != null && listing.getCategory() != null
                ? listing.getCategory().name()
                : animalType);
        product.setWeight(totalKg);
        product.setCreatedAt(LocalDateTime.now());
        product = meatProductRepository.save(product);

        Stock stock = new Stock();
        stock.setMeatProduct(product);
        stock.setQuantity(totalKg);
        stock.setLastUpdate(LocalDateTime.now());
        stockRepository.save(stock);
    }

    @Transactional(readOnly = true)
    public List<StockItemResponse> listStock(User slaughterhouse) {
        return stockRepository.findBySlaughterhouseId(slaughterhouse.getId()).stream()
                .map(StockItemResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Stock requireOwnedStock(User slaughterhouse, Long stockId) {
        return stockRepository
                .findByIdAndMeatProduct_Slaughterhouse_Id(stockId, slaughterhouse.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stok bulunamadı"));
    }

    @Transactional
    public void reserveQuantity(Long stockId, BigDecimal quantityKg) {
        Stock stock = stockRepository
                .findById(stockId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stok bulunamadı"));
        if (stock.getQuantity() == null || stock.getQuantity().compareTo(quantityKg) < 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Yetersiz stok");
        }
        stock.setQuantity(stock.getQuantity().subtract(quantityKg));
        stock.setLastUpdate(LocalDateTime.now());
        stockRepository.save(stock);
    }
}
