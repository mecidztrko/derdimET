package com.derdimet.repository;

import com.derdimet.entity.FavoriteAnimalPurchaseRequest;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteAnimalPurchaseRequestRepository extends JpaRepository<FavoriteAnimalPurchaseRequest, Long> {

    boolean existsBySeller_IdAndPurchaseRequest_Id(Long sellerId, Long purchaseRequestId);

    Optional<FavoriteAnimalPurchaseRequest> findBySeller_IdAndPurchaseRequest_Id(Long sellerId, Long purchaseRequestId);

    @EntityGraph(attributePaths = {"purchaseRequest", "purchaseRequest.createdBy"})
    List<FavoriteAnimalPurchaseRequest> findBySeller_IdOrderByCreatedAtDesc(Long sellerId);
}
