package com.derdimet.service;

import com.derdimet.api.SlaughterhouseDashboardStatsResponse;
import com.derdimet.entity.AnimalDeal;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.Order;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.User;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.OrderRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.EnumSet;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SlaughterhouseDashboardStatsService {

    private static final Set<OrderStatus> COUNTABLE_SALE_STATUSES =
            EnumSet.of(OrderStatus.COMPLETED, OrderStatus.PAYMENT_CONFIRMED, OrderStatus.PAYMENT_PENDING, OrderStatus.PENDING);

    private final OrderRepository orderRepository;
    private final AnimalDealRepository animalDealRepository;
    private final MeatOfferRepository meatOfferRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalOfferRepository animalOfferRepository;

    @Transactional(readOnly = true)
    public SlaughterhouseDashboardStatsResponse stats(User slaughterhouse) {
        YearMonth month = YearMonth.now();
        LocalDateTime start = month.atDay(1).atStartOfDay();
        LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

        long monthlyMeatSales = 0;
        BigDecimal monthlyMeatRevenue = BigDecimal.ZERO;
        for (Order order : orderRepository.findByMeatOffer_SaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse)) {
            if (order.getCreatedAt() == null
                    || order.getCreatedAt().isBefore(start)
                    || !order.getCreatedAt().isBefore(end)) {
                continue;
            }
            if (order.getStatus() != null && COUNTABLE_SALE_STATUSES.contains(order.getStatus())) {
                monthlyMeatSales++;
                if (order.getTotalPrice() != null) {
                    monthlyMeatRevenue = monthlyMeatRevenue.add(order.getTotalPrice());
                }
            }
        }

        long monthlyAnimalPurchases = 0;
        BigDecimal monthlyAnimalSpend = BigDecimal.ZERO;
        for (AnimalDeal deal : animalDealRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse)) {
            if (deal.getCreatedAt() == null
                    || deal.getCreatedAt().isBefore(start)
                    || !deal.getCreatedAt().isBefore(end)) {
                continue;
            }
            monthlyAnimalPurchases++;
            if (deal.getTotalPrice() != null) {
                monthlyAnimalSpend = monthlyAnimalSpend.add(deal.getTotalPrice());
            }
        }

        long pendingMeatOffers =
                meatOfferRepository.findBySaleRequest_SlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                        .filter(o -> o.getStatus() == OfferStatus.PENDING)
                        .count();
        long pendingListingOffers =
                listingOfferRepository.findBySlaughterhouseAndStatusOrderByCreatedAtDesc(
                                slaughterhouse, OfferStatus.PENDING)
                        .size();
        long pendingPurchaseOffers =
                animalOfferRepository.findByRequest_CreatedByAndStatusOrderByCreatedAtDesc(
                                slaughterhouse, OfferStatus.PENDING)
                        .size();

        return new SlaughterhouseDashboardStatsResponse(
                month.toString(),
                monthlyMeatSales,
                monthlyMeatRevenue,
                monthlyAnimalPurchases,
                monthlyAnimalSpend,
                (int) pendingMeatOffers,
                (int) pendingListingOffers,
                (int) pendingPurchaseOffers);
    }
}
