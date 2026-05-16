package com.derdimet.repository;

import com.derdimet.entity.FavoriteBuyer;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteBuyerRepository extends JpaRepository<FavoriteBuyer, Long> {

    boolean existsBySeller_IdAndBuyer_Id(Long sellerId, Long buyerId);

    Optional<FavoriteBuyer> findBySeller_IdAndBuyer_Id(Long sellerId, Long buyerId);

    @EntityGraph(attributePaths = {"buyer"})
    List<FavoriteBuyer> findBySellerOrderByCreatedAtDesc(User seller);
}

