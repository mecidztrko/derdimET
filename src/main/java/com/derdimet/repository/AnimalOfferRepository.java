package com.derdimet.repository;

import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AnimalOfferRepository extends JpaRepository<AnimalOffer, Long> {

    boolean existsByRequest_IdAndSeller_Id(Long requestId, Long sellerId);

    long countByRequest_Id(Long requestId);

    long countByRequest_IdAndStatus(Long requestId, OfferStatus status);

    List<AnimalOffer> findByRequest_IdAndStatus(Long requestId, OfferStatus status);

    @EntityGraph(attributePaths = {"seller", "request"})
    List<AnimalOffer> findByRequest_IdOrderByCreatedAtDesc(Long requestId);

    Optional<AnimalOffer> findByIdAndRequest_CreatedBy_Id(Long offerId, Long slaughterhouseId);

    @EntityGraph(attributePaths = {"request"})
    List<AnimalOffer> findBySellerOrderByCreatedAtDesc(User seller);

    @EntityGraph(attributePaths = {"request"})
    List<AnimalOffer> findBySellerAndStatusOrderByCreatedAtDesc(User seller, OfferStatus status);

    @EntityGraph(attributePaths = {"request", "seller"})
    List<AnimalOffer> findByRequest_CreatedByAndStatusOrderByCreatedAtDesc(User createdBy, OfferStatus status);

    @EntityGraph(attributePaths = {"seller", "request", "request.createdBy"})
    @Query(
            """
            SELECT o FROM AnimalOffer o
            WHERE (o.seller.id = :userA AND o.request.createdBy.id = :userB)
               OR (o.seller.id = :userB AND o.request.createdBy.id = :userA)
            ORDER BY o.createdAt DESC
            """)
    List<AnimalOffer> findBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    List<AnimalOffer> findByStatusAndExpiresAtBefore(OfferStatus status, java.time.LocalDateTime before);
}
