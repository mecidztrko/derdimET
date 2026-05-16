package com.derdimet.repository;

import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlaughterhouseListingOfferRepository extends JpaRepository<SlaughterhouseListingOffer, Long> {

    boolean existsByListing_IdAndSlaughterhouse_Id(Long listingId, Long slaughterhouseId);

    @EntityGraph(attributePaths = {"listing", "slaughterhouse", "listing.seller"})
    List<SlaughterhouseListingOffer> findByListing_SellerOrderByCreatedAtDesc(User seller);

    @EntityGraph(attributePaths = {"listing", "listing.seller"})
    List<SlaughterhouseListingOffer> findBySlaughterhouseOrderByCreatedAtDesc(User slaughterhouse);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    Optional<SlaughterhouseListingOffer> findByIdAndListing_Seller_Id(Long offerId, Long sellerId);

    List<SlaughterhouseListingOffer> findByListing_IdAndStatus(Long listingId, OfferStatus status);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    List<SlaughterhouseListingOffer> findByListing_SellerAndStatusOrderByCreatedAtDesc(
            User seller, OfferStatus status);

    @EntityGraph(attributePaths = {"listing", "listing.seller", "slaughterhouse"})
    List<SlaughterhouseListingOffer> findBySlaughterhouseAndStatusOrderByCreatedAtDesc(
            User slaughterhouse, OfferStatus status);
}

