package com.derdimet.config;

import com.derdimet.entity.AccountType;
import com.derdimet.entity.AnimalCategory;
import com.derdimet.entity.AnimalOffer;
import com.derdimet.entity.AnimalPurchaseRequest;
import com.derdimet.entity.Conversation;
import com.derdimet.entity.Message;
import com.derdimet.entity.MeatOffer;
import com.derdimet.entity.MeatSaleRequest;
import com.derdimet.entity.OfferStatus;
import com.derdimet.entity.Order;
import com.derdimet.entity.OrderStatus;
import com.derdimet.entity.RequestStatus;
import com.derdimet.entity.SellerAnimalListing;
import com.derdimet.entity.SlaughterhouseListingOffer;
import com.derdimet.entity.User;
import com.derdimet.entity.UserRole;
import com.derdimet.repository.AnimalDealRepository;
import com.derdimet.repository.AnimalOfferRepository;
import com.derdimet.repository.AnimalPurchaseRequestRepository;
import com.derdimet.repository.ConversationRepository;
import com.derdimet.repository.MessageRepository;
import com.derdimet.repository.MeatOfferRepository;
import com.derdimet.repository.MeatSaleRequestRepository;
import com.derdimet.repository.OrderRepository;
import com.derdimet.repository.SellerAnimalListingRepository;
import com.derdimet.repository.SlaughterhouseListingOfferRepository;
import com.derdimet.repository.UserRepository;
import com.derdimet.service.AnimalDealService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dev amaçlı örnek veri. Figma mock'larını kullanmayız; DB'ye yazıp mobilin gerçek API'dan görmesini sağlar.
 *
 * <p>Çalıştırmak için:
 *
 * <pre>
 * DERDIMET_SEED=true SERVER_PORT=8081 SPRING_JPA_HIBERNATE_DDL_AUTO=update mvn spring-boot:run
 * </pre>
 */
@Component
@RequiredArgsConstructor
public class DevSeedRunner implements CommandLineRunner {

    private final Environment env;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SellerAnimalListingRepository sellerAnimalListingRepository;
    private final AnimalPurchaseRequestRepository animalPurchaseRequestRepository;
    private final MeatSaleRequestRepository meatSaleRequestRepository;
    private final AnimalOfferRepository animalOfferRepository;
    private final SlaughterhouseListingOfferRepository listingOfferRepository;
    private final AnimalDealRepository animalDealRepository;
    private final AnimalDealService animalDealService;
    private final MeatOfferRepository meatOfferRepository;
    private final OrderRepository orderRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    @Override
    public void run(String... args) {
        boolean enabled = Boolean.parseBoolean(env.getProperty("DERDIMET_SEED", "false"));
        if (!enabled) {
            return;
        }
        seed();
    }

    @Transactional
    void seed() {
        User buyer =
                ensureUser(
                        "buyer1@derdimet.local",
                        "Buyer Demo",
                        UserRole.MEAT_BUYER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        "Ankara",
                        true);

        ensureUser(
                "buyer-unverified@derdimet.local",
                "Buyer Unverified",
                UserRole.MEAT_BUYER,
                AccountType.INDIVIDUAL,
                null,
                null,
                "Ankara",
                false);

        User seller =
                ensureUser(
                        "seller1@derdimet.local",
                        "Seller Demo",
                        UserRole.ANIMAL_SELLER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        "Konya",
                        true);

        User seller2 =
                ensureUser(
                        "seller2@derdimet.local",
                        "Ahmet Yılmaz Çiftliği",
                        UserRole.ANIMAL_SELLER,
                        AccountType.INDIVIDUAL,
                        null,
                        null,
                        "Afyonkarahisar",
                        true);

        User slaughterhouse =
                ensureUser(
                        "slaughterhouse1@derdimet.local",
                        "Kesimhane Demo",
                        UserRole.SLAUGHTERHOUSE,
                        AccountType.BUSINESS,
                        "Demo Kesimhane A.Ş.",
                        "1111111111",
                        "Ankara",
                        true);

        ensureUser(
                "admin@derdimet.local",
                "Sistem Yöneticisi",
                UserRole.ADMIN,
                AccountType.INDIVIDUAL,
                null,
                null,
                "Ankara",
                true);

        // Seller animal listings (SLAUGHTERHOUSE Arama)
        if (sellerAnimalListingRepository.findBySellerOrderByCreatedAtDesc(seller).isEmpty()) {
            SellerAnimalListing l1 = new SellerAnimalListing();
            l1.setSeller(seller);
            l1.setCategory(AnimalCategory.BUYUKBAS);
            l1.setType("Simental");
            l1.setBreed("Simental");
            l1.setAgeMonths(18);
            l1.setQuantity(12);
            l1.setAvgWeightKg(new BigDecimal("420"));
            l1.setPrice(new BigDecimal("95000"));
            l1.setLocation("Konya / Ereğli");
            l1.setDescription("Besili, aşıları tam. Toplu satış.");
            l1.setImageUrls(
                    "https://images.unsplash.com/photo-1545468800-85cc9bc6ecf7?w=800&fit=crop,"
                            + "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&fit=crop");
            l1.setStatus(RequestStatus.OPEN);
            sellerAnimalListingRepository.save(l1);

            SellerAnimalListing l2 = new SellerAnimalListing();
            l2.setSeller(seller);
            l2.setCategory(AnimalCategory.KUCUKBAS);
            l2.setType("Merinos");
            l2.setBreed("Merinos");
            l2.setAgeMonths(10);
            l2.setQuantity(30);
            l2.setAvgWeightKg(new BigDecimal("48"));
            l2.setPrice(new BigDecimal("12000"));
            l2.setLocation("Konya / Merkez");
            l2.setDescription("Sağlıklı sürü, pazarlık payı var.");
            l2.setImageUrls(
                    "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&fit=crop");
            l2.setStatus(RequestStatus.OPEN);
            sellerAnimalListingRepository.save(l2);
        }

        if (sellerAnimalListingRepository.findBySellerOrderByCreatedAtDesc(seller2).isEmpty()) {
            SellerAnimalListing l3 = new SellerAnimalListing();
            l3.setSeller(seller2);
            l3.setCategory(AnimalCategory.KUCUKBAS);
            l3.setType("İvesi");
            l3.setBreed("İvesi");
            l3.setAgeMonths(8);
            l3.setQuantity(25);
            l3.setAvgWeightKg(new BigDecimal("42"));
            l3.setPrice(new BigDecimal("11500"));
            l3.setLocation("Afyonkarahisar / Sandıklı");
            l3.setDescription("Pazar takibi için ikinci satıcı ilanı.");
            l3.setImageUrls(
                    "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=800&fit=crop");
            l3.setStatus(RequestStatus.OPEN);
            sellerAnimalListingRepository.save(l3);
        }

        // Slaughterhouse purchase requests (ANIMAL_SELLER Arama)
        if (animalPurchaseRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN).isEmpty()) {
            AnimalPurchaseRequest r1 = new AnimalPurchaseRequest();
            r1.setTitle("Büyükbaş alımı (Simental / Angus)");
            r1.setAnimalCategory(AnimalCategory.BUYUKBAS);
            r1.setQuantity(15);
            r1.setExpectedWeight(new BigDecimal("400"));
            r1.setDescription("Kesime uygun besi.");
            r1.setStatus(RequestStatus.OPEN);
            r1.setCreatedBy(slaughterhouse);
            animalPurchaseRequestRepository.save(r1);

            AnimalPurchaseRequest r2 = new AnimalPurchaseRequest();
            r2.setTitle("Küçükbaş alımı (kuzu)");
            r2.setAnimalCategory(AnimalCategory.KUCUKBAS);
            r2.setQuantity(40);
            r2.setExpectedWeight(new BigDecimal("45"));
            r2.setDescription("Parti halinde alım.");
            r2.setStatus(RequestStatus.OPEN);
            r2.setCreatedBy(slaughterhouse);
            animalPurchaseRequestRepository.save(r2);
        }

        // Meat sale requests (MEAT_BUYER Arama)
        if (meatSaleRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN).isEmpty()) {
            MeatSaleRequest m1 = new MeatSaleRequest();
            m1.setSlaughterhouse(slaughterhouse);
            m1.setTitle("Taze Dana Kıyma - günlük üretim");
            m1.setMeatType("Dana Kıyma");
            m1.setAnimalCategory(AnimalCategory.BUYUKBAS);
            m1.setCut("Kıyma");
            m1.setQuantity(new BigDecimal("200"));
            m1.setPricePerKg(new BigDecimal("420"));
            m1.setPackaging("Vakumlu 1 kg");
            m1.setLocation("Ankara / Sincan");
            m1.setDescription("Soğuk zincir, vakumlu paket.");
            m1.setImageUrls(
                    "https://images.unsplash.com/photo-1607621048318-c2b1e15a01c0?w=800&fit=crop,"
                            + "https://images.unsplash.com/photo-1603048719536-7b1d3edd84e8?w=800&fit=crop");
            m1.setStatus(RequestStatus.OPEN);
            meatSaleRequestRepository.save(m1);

            MeatSaleRequest m2 = new MeatSaleRequest();
            m2.setSlaughterhouse(slaughterhouse);
            m2.setTitle("Kuzu But - özel parti");
            m2.setMeatType("Kuzu But");
            m2.setAnimalCategory(AnimalCategory.KUCUKBAS);
            m2.setCut("But");
            m2.setQuantity(new BigDecimal("120"));
            m2.setPricePerKg(new BigDecimal("680"));
            m2.setPackaging("Bütün parça, vakum");
            m2.setLocation("Ankara / Sincan");
            m2.setDescription("Kalite garantili, hızlı sevkiyat.");
            m2.setImageUrls(
                    "https://images.unsplash.com/photo-1603048719536-7b1d3edd84e8?w=800&fit=crop");
            m2.setStatus(RequestStatus.OPEN);
            meatSaleRequestRepository.save(m2);
        }

        seedDemoTransactions(buyer, seller, slaughterhouse);
        seedDemoPendingOffers(buyer, seller, slaughterhouse, seller2);
        ensureBuyerTestPendingMeatOffer(buyer, slaughterhouse);
        seedDemoMessages(buyer, slaughterhouse);
    }

    private void seedDemoMessages(User buyer, User slaughterhouse) {
        Long low = Math.min(buyer.getId(), slaughterhouse.getId());
        Long high = Math.max(buyer.getId(), slaughterhouse.getId());
        Conversation conv =
                conversationRepository
                        .findByUser1_IdAndUser2_Id(low, high)
                        .orElseGet(
                                () -> {
                                    Conversation c = new Conversation();
                                    if (buyer.getId().equals(low)) {
                                        c.setUser1(buyer);
                                        c.setUser2(slaughterhouse);
                                    } else {
                                        c.setUser1(slaughterhouse);
                                        c.setUser2(buyer);
                                    }
                                    c.setLastMessageAt(LocalDateTime.now());
                                    return conversationRepository.save(c);
                                });
        if (messageRepository.countByConversation_Id(conv.getId()) == 0) {
            Message msg = new Message();
            msg.setConversation(conv);
            msg.setSender(buyer);
            msg.setText("Merhaba, et ilanınız hakkında bilgi alabilir miyim?");
            Message saved = messageRepository.save(msg);
            conv.setLastMessageAt(saved.getCreatedAt() != null ? saved.getCreatedAt() : LocalDateTime.now());
            conversationRepository.save(conv);
        }
    }

    private void seedDemoTransactions(User buyer, User seller, User slaughterhouse) {
        if (animalDealRepository.count() > 0 || orderRepository.count() > 0) {
            return;
        }

        var purchaseRequests =
                animalPurchaseRequestRepository.findByCreatedByOrderByCreatedAtDesc(slaughterhouse);
        if (!purchaseRequests.isEmpty()) {
            AnimalPurchaseRequest req = purchaseRequests.get(0);
            AnimalOffer animalOffer = new AnimalOffer();
            animalOffer.setRequest(req);
            animalOffer.setSeller(seller);
            animalOffer.setPricePerKg(new BigDecimal("85000"));
            animalOffer.setAnimalCount(10);
            animalOffer.setNote("Demo: kabul edilmiş alış talebi teklifi");
            animalOffer.setStatus(OfferStatus.ACCEPTED);
            animalOfferRepository.save(animalOffer);
            req.setStatus(RequestStatus.CLOSED);
            animalPurchaseRequestRepository.save(req);
            animalDealService.recordAcceptedAnimalOffer(animalOffer);
        }

        var listings = sellerAnimalListingRepository.findBySellerOrderByCreatedAtDesc(seller);
        if (!listings.isEmpty()) {
            SellerAnimalListing listing = listings.get(0);
            SlaughterhouseListingOffer listingOffer = new SlaughterhouseListingOffer();
            listingOffer.setListing(listing);
            listingOffer.setSlaughterhouse(slaughterhouse);
            listingOffer.setPricePerKg(new BigDecimal("92000"));
            listingOffer.setQuantity(5);
            listingOffer.setNote("Demo: kabul edilmiş ilan teklifi");
            listingOffer.setStatus(OfferStatus.ACCEPTED);
            listingOfferRepository.save(listingOffer);
            listing.setStatus(RequestStatus.CLOSED);
            sellerAnimalListingRepository.save(listing);
            animalDealService.recordAcceptedListingOffer(listingOffer);
        }

        var meatSales = meatSaleRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN);
        if (meatSales.isEmpty()) {
            meatSales = meatSaleRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.CLOSED);
        }
        if (!meatSales.isEmpty()) {
            MeatSaleRequest sale = meatSales.get(0);
            MeatOffer meatOffer = new MeatOffer();
            meatOffer.setSaleRequest(sale);
            meatOffer.setBuyer(buyer);
            meatOffer.setPricePerKg(sale.getPricePerKg());
            meatOffer.setQuantity(new BigDecimal("50"));
            meatOffer.setNote("Demo: kabul edilmiş et teklifi");
            meatOffer.setStatus(OfferStatus.ACCEPTED);
            meatOfferRepository.save(meatOffer);
            sale.setStatus(RequestStatus.CLOSED);
            meatSaleRequestRepository.save(sale);

            if (!orderRepository.existsByMeatOffer_Id(meatOffer.getId())) {
                Order order = new Order();
                order.setMeatOffer(meatOffer);
                order.setBuyer(buyer);
                BigDecimal price = meatOffer.getPricePerKg() != null ? meatOffer.getPricePerKg() : BigDecimal.ZERO;
                BigDecimal qty = meatOffer.getQuantity() != null ? meatOffer.getQuantity() : BigDecimal.ZERO;
                order.setTotalPrice(price.multiply(qty));
                order.setStatus(OrderStatus.COMPLETED);
                orderRepository.save(order);
            }
        }
    }

    private void seedDemoPendingOffers(User buyer, User seller, User slaughterhouse, User seller2) {
        animalPurchaseRequestRepository.findByCreatedByOrderByCreatedAtDesc(slaughterhouse).stream()
                .filter(r -> r.getStatus() == RequestStatus.OPEN)
                .forEach(req -> {
                    if (!animalOfferRepository.existsByRequest_IdAndSeller_Id(req.getId(), seller.getId())) {
                        AnimalOffer offer = new AnimalOffer();
                        offer.setRequest(req);
                        offer.setSeller(seller);
                        offer.setPricePerKg(new BigDecimal("82000"));
                        offer.setAnimalCount(Math.min(req.getQuantity(), 20));
                        offer.setNote("Demo: bekleyen alış talebi teklifi");
                        offer.setStatus(OfferStatus.PENDING);
                        animalOfferRepository.save(offer);
                    }
                });

        java.util.stream.Stream.concat(
                        sellerAnimalListingRepository.findBySellerOrderByCreatedAtDesc(seller).stream(),
                        sellerAnimalListingRepository.findBySellerOrderByCreatedAtDesc(seller2).stream())
                .filter(l -> l.getStatus() == RequestStatus.OPEN)
                .forEach(listing -> {
                    if (!listingOfferRepository.existsByListing_IdAndSlaughterhouse_Id(
                            listing.getId(), slaughterhouse.getId())) {
                        SlaughterhouseListingOffer offer = new SlaughterhouseListingOffer();
                        offer.setListing(listing);
                        offer.setSlaughterhouse(slaughterhouse);
                        offer.setPricePerKg(listing.getPrice());
                        offer.setQuantity(Math.min(listing.getQuantity(), 10));
                        offer.setNote("Demo: bekleyen ilan teklifi");
                        offer.setStatus(OfferStatus.PENDING);
                        listingOfferRepository.save(offer);
                    }
                });

        meatSaleRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.OPEN).forEach(sale -> {
            if (!meatOfferRepository.existsBySaleRequest_IdAndBuyer_Id(sale.getId(), buyer.getId())) {
                MeatOffer offer = new MeatOffer();
                offer.setSaleRequest(sale);
                offer.setBuyer(buyer);
                offer.setPricePerKg(sale.getPricePerKg());
                offer.setQuantity(new BigDecimal("25"));
                offer.setNote("Demo: bekleyen et teklifi");
                offer.setStatus(OfferStatus.PENDING);
                meatOfferRepository.save(offer);
            }
        });
    }

    /** Mobil kabul/red testi için her seed'de en az bir bekleyen et teklifi. */
    private void ensureBuyerTestPendingMeatOffer(User buyer, User slaughterhouse) {
        final String testTitle = "Demo — Bekleyen Teklif Testi";
        MeatSaleRequest sale =
                meatSaleRequestRepository.findBySlaughterhouseOrderByCreatedAtDesc(slaughterhouse).stream()
                        .filter(s -> testTitle.equals(s.getTitle()))
                        .findFirst()
                        .orElseGet(
                                () -> {
                                    MeatSaleRequest m = new MeatSaleRequest();
                                    m.setSlaughterhouse(slaughterhouse);
                                    m.setTitle(testTitle);
                                    m.setMeatType("Dana");
                                    m.setAnimalCategory(AnimalCategory.BUYUKBAS);
                                    m.setCut("Kontrfile");
                                    m.setQuantity(new BigDecimal("80"));
                                    m.setPricePerKg(new BigDecimal("520"));
                                    m.setPackaging("Vakum");
                                    m.setLocation("Ankara / Sincan");
                                    m.setDescription("Mobil kabul/red test ilanı");
                                    m.setStatus(RequestStatus.OPEN);
                                    return meatSaleRequestRepository.save(m);
                                });
        if (sale.getStatus() != RequestStatus.OPEN) {
            sale.setStatus(RequestStatus.OPEN);
            meatSaleRequestRepository.save(sale);
        }

        MeatOffer offer =
                meatOfferRepository.findByBuyerOrderByCreatedAtDesc(buyer).stream()
                        .filter(o -> o.getSaleRequest() != null && sale.getId().equals(o.getSaleRequest().getId()))
                        .findFirst()
                        .orElseGet(
                                () -> {
                                    MeatOffer o = new MeatOffer();
                                    o.setSaleRequest(sale);
                                    o.setBuyer(buyer);
                                    o.setPricePerKg(new BigDecimal("510"));
                                    o.setQuantity(new BigDecimal("30"));
                                    o.setNote("Demo: bekleyen teklif testi");
                                    o.setStatus(OfferStatus.PENDING);
                                    return meatOfferRepository.save(o);
                                });
        if (offer.getStatus() != OfferStatus.PENDING) {
            offer.setStatus(OfferStatus.PENDING);
            offer.setNote("Demo: bekleyen teklif testi");
            meatOfferRepository.save(offer);
        }
    }

    private User ensureUser(
            String email,
            String name,
            UserRole role,
            AccountType accountType,
            String companyName,
            String taxNumber,
            String city,
            boolean emailVerified) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return userRepository
                .findByEmail(normalized)
                .map(
                        existing -> {
                            if (existing.isEmailVerified() != emailVerified) {
                                existing.setEmailVerified(emailVerified);
                                return userRepository.save(existing);
                            }
                            return existing;
                        })
                .orElseGet(
                        () -> {
                            User u = new User();
                            u.setEmail(normalized);
                            u.setPassword(passwordEncoder.encode("123456"));
                            u.setName(name);
                            u.setRole(role);
                            u.setAccountType(accountType);
                            u.setCompanyName(companyName);
                            u.setTaxNumber(taxNumber);
                            u.setCity(city);
                            u.setEmailVerified(emailVerified);
                            u.setBusinessVerified(true);
                            return userRepository.save(u);
                        });
    }
}

