package com.derdimet.repository;

import com.derdimet.entity.FavoriteSeller;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteSellerRepository extends JpaRepository<FavoriteSeller, Long> {

    boolean existsByBuyer_IdAndSeller_Id(Long buyerId, Long sellerId);

    Optional<FavoriteSeller> findByBuyer_IdAndSeller_Id(Long buyerId, Long sellerId);

    @EntityGraph(attributePaths = {"seller"})
    List<FavoriteSeller> findByBuyerOrderByCreatedAtDesc(User buyer);
}

