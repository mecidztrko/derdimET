package com.derdimet.repository;

import com.derdimet.entity.FavoriteSlaughterhouse;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteSlaughterhouseRepository extends JpaRepository<FavoriteSlaughterhouse, Long> {

    boolean existsByBuyer_IdAndSlaughterhouse_Id(Long buyerId, Long slaughterhouseId);

    Optional<FavoriteSlaughterhouse> findByBuyer_IdAndSlaughterhouse_Id(Long buyerId, Long slaughterhouseId);

    @EntityGraph(attributePaths = {"slaughterhouse"})
    List<FavoriteSlaughterhouse> findByBuyerOrderByCreatedAtDesc(User buyer);
}
