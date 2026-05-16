Haklısın, önceki prompt sayfaları listeledi ama iş mantığını anlatmadı. Olayı tekrar inceledim, derdimET aslında tek platformda birbirine bağlanmış iki ayrı pazaryeri ve bunun çekirdek mantığını promptta hiç açıklamamışım. Düzeltilmiş İngilizce versiyonu aşağıda — bu sefer mantıkla başlıyor, ekranlar bu mantığa hizmet edecek şekilde anlatılıyor.

Figma Prompt — derdimET Web Design (v2)
You are a senior product designer. Design the web (desktop-first, 1440px primary grid; responsive at 1024 / 768 / 375) interface for derdimET. Before drawing any screen, internalize the business logic below — every page exists to serve this supply chain.

0) What derdimET Actually Is (read this first)
derdimET is a B2B marketplace that digitizes the meat supply chain in Turkey:

Farm → Slaughterhouse → Butcher / Restaurant / Market

It is not one marketplace. It is two marketplaces stitched together by one pivotal role: the slaughterhouse.

The four roles
Role	What they actually do
Animal Seller (ANIMAL_SELLER) — farmer, breeder
Has live animals (small / large livestock = küçükbaş / büyükbaş). Wants to sell animals.
Slaughterhouse (SLAUGHTERHOUSE) — the middleman
Buys live animals from farmers, processes them, and sells the meat downstream. They are the only role that participates in both marketplaces.
Meat Buyer (MEAT_BUYER) — butcher / restaurant / market
Wants to buy processed meat (kg, cut, packaging).
Admin
Verifies businesses, moderates listings, resolves disputes. Web-only.
The two marketplaces — and the bridge
Marketplace A — Livestock (between Seller ↔ Slaughterhouse) Two-way: either party can initiate.

Push side: Seller posts a Seller Animal Listing ("I have 40 lambs, ~45kg avg, 6 months, in Konya, 180 TL/kg"). Slaughterhouses browse → send an offer on the listing.
Pull side: Slaughterhouse posts an Animal Purchase Request ("I want 200 large livestock this month"). Sellers browse → send an offer on the request.
Marketplace B — Meat (between Slaughterhouse ↔ Meat Buyer) One-way (for now): only the slaughterhouse posts supply.

Slaughterhouse posts a Meat Sale Request ("500kg lamb leg, vacuum packed, 420 TL/kg, in Ankara"). Buyers browse → send an offer.
The bridge: the slaughterhouse's inbox always has two sides — purchase (animals they're buying from farmers) and sale (meat they're selling to buyers). Their dashboard must visually reflect this duality.

Offer lifecycle (universal)
PENDING → ACCEPTED | REJECTED → on ACCEPTED, an order is implicitly created and lives in "My Purchases / My Sales" on both sides. Listings/requests have status OPEN | CLOSED.

Trust signals
emailVerified (✓ light)
businessVerified (✓ strong, by admin) — businesses can't fully operate without it
accountType ("individual" / "company") — affects which fields show (tax number, company name)
Favorites are bidirectional and role-aware: buyer→slaughterhouse, slaughterhouse→seller, slaughterhouse→buyer, seller→buyer. The data model already separates these — the UI should too.
Cross-cutting
Every accepted offer creates a private 1:1 conversation between the two parties. Chat is core, not an afterthought — it's where price haggling and logistics happen.
Listings can carry images. Animal listings and meat sale requests have galleries; animal purchase requests do not (they're text specs).
Price is always per kg (₺/kg). Quantities differ: animal listings count animals; meat listings count kg.
What this implies for the UI
A user's mental model is "I'm the X side of the chain — who's on the other side right now?" — the UI must always make the counterparty role explicit (e.g. "Offers to slaughterhouses" vs "Offers from sellers").
The slaughterhouse home screen is split-brain: two columns or two tabs, "Buying side" and "Selling side".
The same word ("offer", "listing") means different things depending on which marketplace you're in — disambiguate with consistent prefixes: Animal Listing, Animal Purchase Request, Meat Sale Listing.
Empty states must teach the logic, not just say "nothing here". E.g. for a brand-new seller: "No purchase requests yet — slaughterhouses post these when they need animals. We'll ping you when one matches your livestock."
1) Brand & Mood
Tone: minimal, cute, warm, friendly, trustworthy yet playful. The livestock/butchery industry is heavy and rough — we lean the other way on purpose. The user should feel like flipping through a small charming farm ledger, not opening an ERP.

Illustration: thin-line, hand-drawn flat illustrations (sheep, lambs, cattle, butcher apron, scale, shepherd dog, paper sacks). Stroke 1.5–2px, slightly imperfect.
No bloody / raw meat photography. No "industrial slaughterhouse" imagery. Use symbols and illustration.
Photography only for verified business profiles (their own farm/facility), with a soft cream overlay.
Build a custom outlined icon set — no generic emoji like 🐑🐄 in production UI.
2) Color Palette (warm & minimal)
Primary — Warm Terracotta: #C75B3C (CTAs, key accents)
Primary Soft: #F4D7CB (chip & badge backgrounds)
Secondary — Olive Green: #6B8E4E (success, OPEN, ACCEPTED)
Accent — Mustard Yellow: #E5A93D (warning, PENDING)
Background — Cream: #FAF6F0
Surface — Pure White: #FFFFFF
Surface Alt — Milky Beige: #F1EAE0 (hover, secondary cards)
Border: #E7DDD0
Text Primary: #2B1F17 (warm near-black, no pure black)
Text Secondary: #7A6E63
Danger: #B23A2F (REJECTED, delete)
Dark mode: base #1A1410, surface #231914, terracotta desaturated ~12%.
Role tinting (subtle, identity not background):

Seller tint: olive
Slaughterhouse tint: terracotta (primary brand — they're the hub)
Buyer tint: mustard Tints appear only on the small role pill next to the user's name, and on the role-selection cards during registration. Don't paint whole pages.
3) Typography
Headings: Fraunces (soft display serif), 500–600.
Body & UI: Plus Jakarta Sans or Inter, 400/500/600.
Numbers (price, kg, IDs): JetBrains Mono or Plus Jakarta tabular.
Scale: H1 40/48, H2 32/40, H3 24/32, H4 20/28, Body 15/24, Small 13/20, Caption 12/18.
Money is always typeset as ₺180,00 / kg with a thin space.
4) Visual Language & Components
Radius: Cards 20, Buttons 14, Inputs 12, Chips 999 (pill).
Shadow: very soft, 0 8px 24px rgba(43,31,23,0.06); hover 0 12px 32px rgba(43,31,23,0.10).
Buttons: Primary (terracotta fill, white text, 48h, 8px icon gap), Secondary (1.5px outline), Tertiary (text, hover underline). Press = scale 0.98.
Inputs: outlined, floating label inside, focus = terracotta border + soft glow.
Chips/Filters: pill; selected = primary-soft background + dark label.
Status badges (universal vocabulary):
OPEN → olive · CLOSED → grey
PENDING → mustard · ACCEPTED → olive · REJECTED → terracotta
Email ✓ → thin · Business ✓ → bold + tooltip
Cards: alternating cream/white surfaces; favorite ❤ at top-right (outline ↔ filled toggle).
Empty states: every screen has one. Cute illustration + headline + one-line explanation of the marketplace mechanic + CTA. They are teaching moments.
Skeletons: soft beige pulsing on cream.
Micro-animation: walking-sheep Lottie on splash; subtle sparkle on success; no confetti.
5) Layout & Navigation
Top bar: left logo (derdimET wordmark + tiny sheep emblem), center global search (context-aware to role), right notifications, messages with unread badge, profile avatar with role pill.
Left sidebar (collapsible 256 ↔ 72): role-based menu. Active item gets primary-soft pill + 3px terracotta stripe on the left edge.
Content area: 1200px max, 12-col grid, 24px gutter.
Mobile bottom nav (≤768): 4 icons per role.
Breadcrumbs above page titles, e.g. Home › Meat Sale Listings › #1234.
6) Sidebar Menu by Role (drives information architecture)
Animal Seller → Home (open purchase requests feed) · Marketplace search · My Animal Listings · My Offers (given) · Messages · Profile
Slaughterhouse → Dashboard (split: buying & selling) · Buy Animals (browse seller listings) · My Purchase Requests (animals I want) · Sell Meat (my meat sale listings) · Offers (sub-tabs: Given to sellers / Received from buyers) · Messages · Profile
Meat Buyer → Home (open meat sale listings feed) · Search · My Offers (given) · Favorite Slaughterhouses · Messages · Profile
Admin → Verification Queue · Users · Listing Moderation · Reports · Metrics
7) Screen List (DELIVER ALL — desktop + tablet + mobile, plus empty/loading/error/success states)
A. Public / Auth
Splash — cream, centered logo, walking-sheep Lottie.
Landing (web-only marketing) — hero "From pasture to table, an honest marketplace", three role cards (Seller / Slaughterhouse / Buyer), "How it works" diagram that shows the chain (Farm → Slaughterhouse → Buyer), social proof, footer.
Login — 480px card, illustration on left half.
Register (multi-step) — Step 1 Account · Step 2 Role pick (3 oversized cards with a one-sentence explanation of what each role does in the chain) · Step 3 dynamic profile fields (individual vs company; tax number etc.) · Step 4 awaiting business verification screen.
Forgot password — request → OTP → set new (3 frames).
Email verification — envelope illustration + 6-digit OTP.
B. Animal Seller flow (sells animals to slaughterhouses)
Seller Home — "Slaughterhouses are looking for…" feed of open AnimalPurchaseRequests. Filter chips: küçükbaş / büyükbaş / all. Each card: slaughterhouse name + verified ✓ + city + category + count + expected weight + "Send offer" CTA + favorite.
Seller Search — same data, structured filter sidebar (category, city, slaughterhouse, date), sort (newest, closest).
Animal Purchase Request — Detail — slaughterhouse info card (avatar, business name, ✓, city, "View profile", "Message"), request specs (category, count, expected weight, description), right rail sticky CTA "Send offer" + favorite.
Offer Create — Animal (modal/side panel from #9) — price/kg, animal count, optional note. Live total: count × avgWeight × pricePerKg.
My Offers (Seller) — tabs Pending / Accepted / Rejected; each row references the parent request + slaughterhouse + my offered price + status + "Open chat".
My Animal Listings (Seller) — table/grid of my own outgoing listings (the push side), with views, incoming offer count, status, "Edit" / "Close".
Animal Listing Detail (own) — stats panel + incoming offers table (offerer slaughterhouse, price, count, note, Accept/Reject) + edit pencil.
Create Animal Listing — multi-step (Category → Type/Breed/Age → Count, Avg kg → Price & Location → Photos drag-drop → Preview & Publish), live preview card on the right showing what slaughterhouses will see.
Seller Profile — sub-tabs: Profile info · My Listings · My Sales (orders from accepted offers) · Favorite Buyers (slaughterhouses I prefer) · Settings.
C. Slaughterhouse flow (the pivot — buys animals, sells meat)
Slaughterhouse Dashboard — split-brain — top KPI row: Active purchase requests · Active meat sale listings · Pending offers (given) · Pending offers (received) · Revenue this month (small line chart). Below, two columns:
Left "Buying side" — recent seller listings matching my open requests, my own purchase requests with offer counts.
Right "Selling side" — my meat sale listings with offer counts, recent buyer offers.
Recent activity timeline at the bottom mixing both sides, color-coded.
Buy Animals — Browse Seller Listings — grid of SellerAnimalListings, filter sidebar (category, type, age range, quantity range, price range), card has photo, breed, count, avg kg, price/kg, seller + city, "Send offer".
Seller Animal Listing — Detail (as slaughterhouse) — gallery, seller card, specs, description, sticky "Send offer" + favorite + "Message seller".
Offer Create — On a Seller Listing — price/kg, quantity, note.
My Purchase Requests (Slaughterhouse) — list/cards of my AnimalPurchaseRequests, status, offers-in count, "View offers".
Create Animal Purchase Request — short form (category, count, expected weight, description). No photos. Preview card on the right.
Purchase Request Detail (own) — incoming offers table from sellers (price/kg, count, note, Accept/Reject), close request.
Sell Meat — My Meat Sale Listings — table of my MeatSaleRequests with views, offers-in, status.
Create Meat Sale Listing — multi-step (Meat type → Cut + Animal category → Quantity (kg) + Price/kg → Packaging + Location → Photos → Preview → Publish).
Meat Sale Listing Detail (own) — gallery + incoming buyer offers table (price, quantity, note, Accept/Reject), close listing.
Offers (Slaughterhouse) — two top tabs: Given (to sellers, on their animal listings) | Received (from buyers, on my meat listings). Each tab has Pending/Accepted/Rejected sub-tabs.
Slaughterhouse Profile — sub-tabs: Profile (gallery, about, certifications, verifications) · My Purchase Requests · My Meat Listings · My Purchases (animals bought) · My Sales (meat sold) · Favorites (Sellers / Buyers) · Settings.
D. Meat Buyer flow (buys meat from slaughterhouses)
Buyer Home — "Fresh meat listings" feed of open MeatSaleRequests with gallery thumbnails, meat type, cut, price/kg, slaughterhouse + ✓ + city.
Buyer Search — filter sidebar (meat type, animal category, cut, price range, city, packaging), grid + optional map toggle.
Meat Sale Listing — Detail (as buyer) — large photo carousel, slaughterhouse card with ✓ + "View profile" + "Message", spec table (type, cut, quantity, price/kg, packaging, location), description, sticky "Send offer" + favorite.
Offer Create — Meat — price/kg, quantity (kg), note. Live total.
My Offers (Buyer) — tabs Pending / Accepted / Rejected.
Favorite Slaughterhouses — grid.
Buyer Profile — sub-tabs: Info · Favorites · My Purchases · Settings · Security.
E. Shared
Public User Profile — outward-facing page for any user (avatar, role pill, city, verifications, listings/requests they have open, "Send message"). Layout differs slightly per role (slaughterhouses get a gallery & certifications block).
Conversations List — left column conversations (avatar + counterparty's role pill + last message + unread badge), right column open chat. Mobile: single column.
Chat — bubbles (mine terracotta, theirs white on cream), day separators, "typing…", attachments, a "shared listing" card type that embeds the listing being discussed (price, photo, status), bottom input.
Notifications — new offer received, my offer accepted/rejected, new message, my listing closed, business verification approved. Read/unread toggle.
Settings — Account · Notifications (toggles) · Change password · KVKK/Terms · Delete account (danger card).
F. Admin (web-only)
Verification Queue — list of pending business verifications, side panel with documents preview, Approve / Reject with reason.
Users — searchable, role filter, suspend / unverify.
Listing Moderation — flagged listings, side panel preview, remove with reason.
Reports — user/listing reports, status tracking.
Metrics — DAU, GMV proxy, offers→acceptance rate, listings by category, role distribution. Small charts, cream cards.
G. System
404 — lost-sheep illustration + "Nobody in this meadow" + Home.
500 — "Something went sideways" + retry.
Maintenance.
Cookie banner & KVKK consents.
8) Delivery Format
One Figma file. Pages: 00 Cover · 01 Foundations · 02 Components · 03 Auth · 04 Seller · 05 Slaughterhouse · 06 Buyer · 07 Shared · 08 Admin · 09 System.
Auto Layout + Variants + Component Properties for every component.
Colors as Variables (color/brand/primary…) + a Mode 2 for dark.
Typography exposed as Text Styles.
8px base grid; spacing tokens space/4, 8, 12, 16, 24, 32, 48, 64.
Prototype these critical flows end-to-end:
Register → choose Slaughterhouse → land on split dashboard.
Seller browses purchase requests → opens detail → sends offer → sees it in "My Offers / Pending".
Slaughterhouse creates meat sale listing → publishes → buyer finds it via search → sends offer → slaughterhouse accepts in "Offers / Received" → chat opens.
9) Don'ts
Don't conflate the two marketplaces visually. Animal listings ≠ meat listings ≠ purchase requests. Use consistent labeling everywhere.
Don't hide who the counterparty is — the role pill must always be visible on cards.
No pure black or cold neutral greys.
No sharp corners, no hard shadows, no neon, no gradient meshes.
No raw/bloody meat photography.
No emoji in the production UI; use the custom icon set.
Don't leave Material defaults — fully apply the brand.
10) Microcopy (warm + teaches the logic)
Empty seller home: "No purchase requests right now. Slaughterhouses post these when they need animals — we'll ping you when one matches your livestock."
Empty slaughterhouse "selling side": "Your shelf is empty. Publish a meat sale listing and butchers will start sending offers."
Empty buyer offers: "You haven't made any offers yet. Find a meat listing you like and propose your price."
Offer sent: "Your offer is on its way. We've nudged the other side."
Offer accepted: "Deal! Chat is open — agree on delivery details with the other side."
Deliverable: all 48 screens across 3 breakpoints with the required states, as a shareable Figma library + prototype.

