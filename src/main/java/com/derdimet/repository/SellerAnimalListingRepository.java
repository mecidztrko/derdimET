package com.derdimet.repository;

import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SellerAnimalListingRepository extends JpaRepository<SellerAnimalListing, Long>, JpaSpecificationExecutor<SellerAnimalListing> {
    List<SellerAnimalListing> findBySellerOrderByCreatedAtDesc(User seller);

    java.util.Optional<SellerAnimalListing> findByIdAndSeller_Id(Long id, Long sellerId);
}

