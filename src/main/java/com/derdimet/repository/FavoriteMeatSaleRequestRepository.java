package com.derdimet.repository;

import com.derdimet.entity.FavoriteMeatSaleRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteMeatSaleRequestRepository extends JpaRepository<FavoriteMeatSaleRequest, Long> {

    boolean existsByBuyer_IdAndSaleRequest_Id(Long buyerId, Long saleRequestId);

    Optional<FavoriteMeatSaleRequest> findByBuyer_IdAndSaleRequest_Id(Long buyerId, Long saleRequestId);

    List<FavoriteMeatSaleRequest> findByBuyer_IdOrderByCreatedAtDesc(Long buyerId);
}
