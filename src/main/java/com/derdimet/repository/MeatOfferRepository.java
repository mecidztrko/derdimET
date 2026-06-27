package com.derdimet.repository;

import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MeatOfferRepository extends JpaRepository<MeatOffer, Long> {

    boolean existsBySaleRequest_IdAndBuyer_Id(Long saleRequestId, Long buyerId);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse"})
    List<MeatOffer> findByBuyerOrderByCreatedAtDesc(User buyer);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse"})
    Optional<MeatOffer> findByIdAndBuyer_Id(Long offerId, Long buyerId);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse", "buyer"})
    List<MeatOffer> findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);

    @EntityGraph(attributePaths = {"saleRequest", "saleRequest.slaughterhouse", "buyer"})
    Optional<MeatOffer> findByIdAndSaleRequest_Slaughterhouse_Id(Long offerId, Long slaughterhouseId);

    List<MeatOffer> findBySaleRequest_IdAndStatus(Long saleRequestId, com.derdimet.entity.OfferStatus status);

    @EntityGraph(attributePaths = {"buyer", "saleRequest", "saleRequest.slaughterhouse"})
    @Query(
            """
            SELECT o FROM MeatOffer o
            WHERE (o.buyer.id = :userA AND o.saleRequest.slaughterhouse.id = :userB)
               OR (o.buyer.id = :userB AND o.saleRequest.slaughterhouse.id = :userA)
            ORDER BY o.createdAt DESC
            """)
    List<MeatOffer> findBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    List<MeatOffer> findByStatusAndExpiresAtBefore(OfferStatus status, LocalDateTime before);
}

