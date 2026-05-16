package com.derdimet.repository;

import com.derdimet.entity.FavoriteMeatBuyer;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteMeatBuyerRepository extends JpaRepository<FavoriteMeatBuyer, Long> {

    boolean existsBySlaughterhouse_IdAndBuyer_Id(Long slaughterhouseId, Long buyerId);

    Optional<FavoriteMeatBuyer> findBySlaughterhouse_IdAndBuyer_Id(Long slaughterhouseId, Long buyerId);

    @EntityGraph(attributePaths = {"buyer"})
    List<FavoriteMeatBuyer> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);
}

