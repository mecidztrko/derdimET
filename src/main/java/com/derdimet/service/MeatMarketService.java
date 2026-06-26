package com.derdimet.service;

import com.derdimet.api.CreateMeatOfferRequest;
import com.derdimet.api.CreateMeatSaleRequest;
import com.derdimet.api.UpdateMeatSaleRequest;
import com.derdimet.api.MeatOfferItemResponse;
import com.derdimet.api.MeatSaleRequestResponse;
import com.derdimet.api.SlaughterhouseMeatOfferResponse;
import com.derdimet.entity.FavoriteMeatSaleRequest;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.Order;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.FavoriteMeatSaleRequestRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.OrderRepository;
import com.derdimet.util.ListingSearchSupport;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MeatMarketService {

    private final MeatSaleRequestRepository saleRequestRepository;
    private final MeatOfferRepository meatOfferRepository;
    private final OrderRepository orderRepository;
    private final FavoriteMeatSaleRequestRepository favoriteMeatSaleRequestRepository;
    private final AccountGuardService accountGuard;
    private final FavoriteService favoriteService;
    private final StockService stockService;
    private final TransactionService transactionService;
    private final PushNotificationService pushNotificationService;

    @Transactional
    public MeatSaleRequestResponse createSaleRequest(User slaughterhouse, CreateMeatSaleRequest body) {
        accountGuard.requireEmailVerified(slaughterhouse);
        MeatSaleRequest e = new MeatSaleRequest();
        e.setSlaughterhouse(slaughterhouse);
        e.setTitle(body.title().trim());
        e.setMeatType(body.meatType().trim());
        e.setAnimalCategory(body.animalCategory());
        e.setCut(blankToNull(body.cut()));
        e.setQuantity(body.quantity());
        e.setPricePerKg(body.pricePerKg());
        e.setPackaging(blankToNull(body.packaging()));
        e.setLocation(blankToNull(body.location()));
        e.setDescription(blankToNull(body.description()));
        e.setImageUrls(joinImageUrls(body.imageUrls()));
        e.setStatus(RequestStatus.OPEN);
        if (body.stockId() != null) {
            var stock = stockService.requireOwnedStock(slaughterhouse, body.stockId());
            if (stock.getQuantity() == null || stock.getQuantity().compareTo(body.quantity()) < 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stok miktarı yetersiz");
            }
            e.setStockId(body.stockId());
        }
        return MeatSaleRequestResponse.fromEntity(saleRequestRepository.save(e));
    }

    private static String joinImageUrls(java.util.List<String> urls) {
        if (urls == null || urls.isEmpty()) return null;
        return String.join(
                ",",
                urls.stream().filter(u -> u != null && !u.isBlank()).map(String::trim).toList());
    }

    @Transactional(readOnly = true)
    public List<MeatSaleRequestResponse> listOpenSaleRequests(User buyer, String q) {
        return saleRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN).stream()
                .filter(m -> ListingSearchSupport.matchesMeatSale(m, q))
                .map(
                        m -> {
                            Boolean fav =
                                    buyer != null
                                            ? isListingFavoritedByMe(buyer, m.getId())
                                            : null;
                            return MeatSaleRequestResponse.fromEntity(m, fav);
                        })
                .toList();
    }

    @Transactional
    public MeatOfferItemResponse createOffer(User buyer, Long saleRequestId, CreateMeatOfferRequest body) {
        accountGuard.requireEmailVerified(buyer);
        MeatSaleRequest req =
                saleRequestRepository
                        .findById(saleRequestId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Et ilanı bulunamadı"));
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilan kapalı veya teklif almıyor");
        }
        if (meatOfferRepository.existsBySaleRequest_IdAndBuyer_Id(saleRequestId, buyer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bu ilan için zaten teklif verdiniz");
        }
        MeatOffer o = new MeatOffer();
        o.setSaleRequest(req);
        o.setBuyer(buyer);
        o.setPricePerKg(body.pricePerKg());
        o.setQuantity(body.quantity());
        o.setNote(blankToNull(body.note()));
        o.setStatus(OfferStatus.PENDING);
        MeatOffer saved = meatOfferRepository.save(o);
        pushNotificationService.notifyOfferEvent(
                req.getSlaughterhouse(),
                "Yeni et teklifi",
                buyer.getName() + " ilanınıza teklif verdi.");
        return MeatOfferItemResponse.fromEntity(saved);
    }

    @Transactional
    public MeatOfferItemResponse withdrawOffer(User buyer, Long offerId) {
        MeatOffer offer = requireBuyerPendingOffer(buyer, offerId);
        offer.setStatus(OfferStatus.REJECTED);
        if (offer.getNote() == null || offer.getNote().isBlank()) {
            offer.setNote("Alıcı tarafından geri çekildi");
        }
        return MeatOfferItemResponse.fromEntity(meatOfferRepository.save(offer));
    }

    @Transactional
    public MeatOfferItemResponse acceptMyOffer(User buyer, Long offerId) {
        MeatOffer offer = requireBuyerPendingOffer(buyer, offerId);
        offer.setStatus(OfferStatus.ACCEPTED);
        return MeatOfferItemResponse.fromEntity(meatOfferRepository.save(offer));
    }

    private MeatOffer requireBuyerPendingOffer(User buyer, Long offerId) {
        MeatOffer offer =
                meatOfferRepository
                        .findByIdAndBuyer_Id(offerId, buyer.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teklif bulunamadı"));
        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Yalnızca bekleyen teklif işlenebilir");
        }
        return offer;
    }

    @Transactional(readOnly = true)
    public List<MeatOfferItemResponse> listMyOffers(User buyer, String q) {
        return meatOfferRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                .filter(o -> ListingSearchSupport.matchesMeatOffer(o, q))
                .map(MeatOfferItemResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MeatSaleRequestResponse> listMySaleRequests(User slaughterhouse, String q) {
        return saleRequestRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                .filter(r -> ListingSearchSupport.matchesMeatSale(r, q))
                .map(MeatSaleRequestResponse::fromEntity)
                .toList();
    }

    @Transactional
    public MeatSaleRequestResponse updateSaleRequest(User slaughterhouse, Long saleRequestId, UpdateMeatSaleRequest body) {
        MeatSaleRequest req =
                saleRequestRepository
                        .findByIdAndSlaughterhouse_Id(saleRequestId, slaughterhouse.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Et ilanı bulunamadı"));
        if (req.getStatus() != RequestStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Kapalı ilan düzenlenemez");
        }
        if (body.title() != null && !body.title().isBlank()) req.setTitle(body.title().trim());
        if (body.meatType() != null && !body.meatType().isBlank()) req.setMeatType(body.meatType().trim());
        if (body.animalCategory() != null) req.setAnimalCategory(body.animalCategory());
        if (body.cut() != null) req.setCut(blankToNull(body.cut()));
        if (body.quantity() != null) req.setQuantity(body.quantity());
        if (body.pricePerKg() != null) req.setPricePerKg(body.pricePerKg());
        if (body.packaging() != null) req.setPackaging(blankToNull(body.packaging()));
        if (body.location() != null) req.setLocation(blankToNull(body.location()));
        if (body.description() != null) req.setDescription(blankToNull(body.description()));
        if (body.imageUrls() != null) req.setImageUrls(joinImageUrls(body.imageUrls()));
        return MeatSaleRequestResponse.fromEntity(saleRequestRepository.save(req));
    }

    @Transactional
    public MeatSaleRequestResponse closeSaleRequest(User slaughterhouse, Long saleRequestId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        MeatSaleRequest req =
                saleRequestRepository
                        .findByIdAndSlaughterhouse_Id(saleRequestId, slaughterhouse.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Et ilanı bulunamadı"));
        if (req.getStatus() == RequestStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "İlan zaten kapalı");
        }
        req.setStatus(RequestStatus.CLOSED);
        return MeatSaleRequestResponse.fromEntity(saleRequestRepository.save(req));
    }

    @Transactional
    public MeatSaleRequestResponse reopenSaleRequest(User slaughterhouse, Long saleRequestId) {
        accountGuard.requireEmailVerified(slaughterhouse);
        MeatSaleRequest req =
                saleRequestRepository
                        .findByIdAndSlaughterhouse_Id(saleRequestId, slaughterhouse.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Et ilanı bulunamadı"));
        if (req.getStatus() != RequestStatus.CLOSED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Yalnızca kapalı ilanlar yeniden açılabilir");
        }
        boolean hasAccepted =
                meatOfferRepository.findBySaleRequest_IdAndStatus(saleRequestId, OfferStatus.ACCEPTED).stream()
                        .findAny()
                        .isPresent();
        if (hasAccepted) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Kabul edilmiş teklifi olan ilan yeniden açılamaz");
        }
        req.setStatus(RequestStatus.OPEN);
        return MeatSaleRequestResponse.fromEntity(saleRequestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<SlaughterhouseMeatOfferResponse> listIncomingMeatOffers(User slaughterhouse) {
        return meatOfferRepository.findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                .map(SlaughterhouseMeatOfferResponse::fromEntity)
                .toList();
    }

    @Transactional
    public SlaughterhouseMeatOfferResponse respondToMeatOffer(User slaughterhouse, Long offerId, boolean accept) {
        accountGuard.requireEmailVerified(slaughterhouse);
        MeatOffer offer =
                meatOfferRepository
                        .findByIdAndSaleRequest_Slaughterhouse_Id(offerId, slaughterhouse.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teklif bulunamadı"));
        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Teklif zaten işlenmiş");
        }
        if (accept) {
            offer.setStatus(OfferStatus.ACCEPTED);
            meatOfferRepository.save(offer);
            Long saleRequestId = offer.getSaleRequest().getId();
            for (MeatOffer other : meatOfferRepository.findBySaleRequest_IdAndStatus(saleRequestId, OfferStatus.PENDING)) {
                if (!other.getId().equals(offerId)) {
                    other.setStatus(OfferStatus.REJECTED);
                    meatOfferRepository.save(other);
                }
            }
            MeatSaleRequest sale = offer.getSaleRequest();
            if (sale.getStatus() == RequestStatus.OPEN) {
                sale.setStatus(RequestStatus.CLOSED);
                saleRequestRepository.save(sale);
            }
            if (!orderRepository.existsByMeatOffer_Id(offerId)) {
                Order order = new Order();
                order.setMeatOffer(offer);
                order.setBuyer(offer.getBuyer());
                BigDecimal qty = offer.getQuantity() != null ? offer.getQuantity() : BigDecimal.ZERO;
                BigDecimal price = offer.getPricePerKg() != null ? offer.getPricePerKg() : BigDecimal.ZERO;
                order.setTotalPrice(price.multiply(qty));
                order.setStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);
                transactionService.recordCompletedOrder(order);
            }
            if (sale.getStockId() != null && offer.getQuantity() != null) {
                stockService.reserveQuantity(sale.getStockId(), offer.getQuantity());
            }
        } else {
            offer.setStatus(OfferStatus.REJECTED);
            meatOfferRepository.save(offer);
        }
        return SlaughterhouseMeatOfferResponse.fromEntity(offer);
    }

    @Transactional(readOnly = true)
    public List<MeatSaleRequestResponse> listFavoriteMeatSaleRequests(User buyer) {
        return favoriteMeatSaleRequestRepository.findByBuyer_IdOrderByCreatedAtDesc(buyer.getId()).stream()
                .map(f -> MeatSaleRequestResponse.fromEntity(f.getSaleRequest(), true))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isListingFavoritedByMe(User buyer, Long saleRequestId) {
        return favoriteMeatSaleRequestRepository.existsByBuyer_IdAndSaleRequest_Id(buyer.getId(), saleRequestId);
    }

    @Transactional
    public boolean toggleListingFavorite(User buyer, Long saleRequestId) {
        accountGuard.requireEmailVerified(buyer);
        MeatSaleRequest req =
                saleRequestRepository
                        .findById(saleRequestId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Et ilanı bulunamadı"));
        var existing =
                favoriteMeatSaleRequestRepository.findByBuyer_IdAndSaleRequest_Id(buyer.getId(), saleRequestId);
        if (existing.isPresent()) {
            favoriteMeatSaleRequestRepository.delete(existing.get());
            return false;
        }
        var fav = new FavoriteMeatSaleRequest();
        fav.setBuyer(buyer);
        fav.setSaleRequest(req);
        favoriteMeatSaleRequestRepository.save(fav);
        return true;
    }

    private static String blankToNull(String s) {
        if (s == null || s.isBlank()) {
            return null;
        }
        return s.trim();
    }
}

