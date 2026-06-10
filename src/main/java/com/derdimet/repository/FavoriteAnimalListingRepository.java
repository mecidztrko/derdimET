package com.derdimet.repository;

import com.derdimet.entity.FavoriteAnimalListing;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteAnimalListingRepository extends JpaRepository<FavoriteAnimalListing, Long> {

    boolean existsBySlaughterhouse_IdAndListing_Id(Long slaughterhouseId, Long listingId);

    Optional<FavoriteAnimalListing> findBySlaughterhouse_IdAndListing_Id(Long slaughterhouseId, Long listingId);

    List<FavoriteAnimalListing> findBySlaughterhouse_IdOrderByCreatedAtDesc(Long slaughterhouseId);
}
