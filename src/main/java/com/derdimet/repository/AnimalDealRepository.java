package com.derdimet.repository;

import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalDealRepository extends JpaRepository<AnimalDeal, Long> {

    boolean existsByAnimalOffer_Id(Long animalOfferId);

    boolean existsByListingOffer_Id(Long listingOfferId);

    @EntityGraph(
            attributePaths = {
                "animalOffer",
                "animalOffer.request",
                "animalOffer.request.createdBy",
                "listingOffer",
                "listingOffer.listing",
                "seller",
                "slaughterhouse"
            })
    List<AnimalDeal> findBySellerOrderByCreatedAtDesc(User seller);

    @EntityGraph(
            attributePaths = {
                "animalOffer",
                "animalOffer.request",
                "animalOffer.seller",
                "listingOffer",
                "listingOffer.listing",
                "listingOffer.listing.seller",
                "seller",
                "slaughterhouse"
            })
    List<AnimalDeal> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);
}
