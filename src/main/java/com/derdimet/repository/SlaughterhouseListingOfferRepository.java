package com.derdimet.repository;

import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SlaughterhouseListingOfferRepository extends JpaRepository<SlaughterhouseListingOffer, Long> {

    boolean existsByListing_IdAndSlaughterhouse_Id(Long listingId, Long slaughterhouseId);

    @EntityGraph(attributePaths = {"listing", "slaughterhouse", "listing.seller"})
    List<SlaughterhouseListingOffer> findByListing_SellerOrderByCreatedAtDesc(User seller);

    @EntityGraph(attributePaths = {"listing", "listing.seller"})
    List<SlaughterhouseListingOffer> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    Optional<SlaughterhouseListingOffer> findByIdAndListing_Seller_Id(Long offerId, Long sellerId);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    Optional<SlaughterhouseListingOffer> findByIdAndSlaughterhouse_Id(Long offerId, Long slaughterhouseId);

    List<SlaughterhouseListingOffer> findByListing_IdAndStatus(Long listingId, OfferStatus status);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    List<SlaughterhouseListingOffer> findByListing_SellerAndStatusOrderByCreatedAtDesc(
            User seller, OfferStatus status);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    List<SlaughterhouseListingOffer> findBySlaughterhouseAndStatusOrderByCreatedAtDesc(
            User slaughterhouse, OfferStatus status);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    @Query(
            """
            SELECT o FROM SlaughterhouseListingOffer o
            WHERE (o.listing.seller.id = :userA AND o.slaughterhouse.id = :userB)
               OR (o.listing.seller.id = :userB AND o.slaughterhouse.id = :userA)
            ORDER BY o.createdAt DESC
            """)
    List<SlaughterhouseListingOffer> findBetweenUsers(@Param("userA") Long userA, @Param("userB") Long userB);

    List<SlaughterhouseListingOffer> findByStatusAndExpiresAtBefore(OfferStatus status, java.time.LocalDateTime before);
}

