package com.derdimet.repository;

import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeatOfferRepository extends JpaRepository<MeatOffer, Long> {

    boolean existsBySaleRequest_IdAndBuyer_Id(Long saleRequestId, Long buyerId);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse"})
    List<MeatOffer> findByBuyerOrderByCreatedAtDesc(User buyer);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse", "buyer"})
    List<MeatOffer> findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse", "buyer"})
    Optional<MeatOffer> findByIdAndSaleRequest_Slaughterhouse_Id(Long offerId, Long slaughterhouseId);

    List<MeatOffer> findBySaleRequest_IdAndStatus(Long saleRequestId, com.derdimet.entity.OfferStatus status);
}

