You are a senior product designer. Design the web (desktop-first, 1440px primary grid; responsive at 1024 / 768 / 375) interface for derdimET, a B2B livestock & meat marketplace. Brand tone: minimal, cute, warm, friendly, trustworthy yet playful. The industry (livestock & butchery) is normally heavy and rough — we are deliberately approaching it from a light, modern, cuddly angle. The user should feel like they are flipping through a small, charming farm ledger.

1) Brand & Mood
Feel: a blend of "village breakfast + modern fintech". Warm but professional.
Illustration language: thin-line, hand-drawn flat illustrations (sheep, lambs, cattle, butcher apron, scale, shepherd dog). Stroke 1.5–2px, slightly imperfect, cute.
Photography: minimal, natural daylight, with a soft overlay.
Micro details: no generic emojis like 🐑🐄 — build a custom outlined icon set.
2) Color Palette (warm & minimal)
Primary — Warm Terracotta: #C75B3C (CTAs, key accents)
Primary Soft: #F4D7CB (chip & badge backgrounds)
Secondary — Olive Green: #6B8E4E (success, "OPEN" status)
Accent — Mustard Yellow: #E5A93D (warning, "PENDING")
Background — Cream: #FAF6F0 (page background)
Surface — Pure White: #FFFFFF (cards)
Surface Alt — Milky Beige: #F1EAE0 (secondary card, hover)
Border: #E7DDD0
Text Primary: #2B1F17 (near-black with a brown tint — avoid pure black)
Text Secondary: #7A6E63
Danger: #B23A2F
Dark mode: base #1A1410, surface #231914; terracotta stays the same but desaturated by ~12%.
3) Typography
Heading: "Fraunces" (display, slightly soft serif — carries the warmth), weight 500–600.
Body & UI: "Plus Jakarta Sans" or "Inter", weights 400/500/600.
Mono (prices, IDs): "JetBrains Mono".
Scale: H1 40/48, H2 32/40, H3 24/32, H4 20/28, Body 15/24, Small 13/20, Caption 12/18.
Optionally add a tiny handwritten underline or a "•" ornament next to headings for warmth.
4) Visual Language & Components
Corner radius: Cards 20px, Buttons 14px, Inputs 12px, Chips 999px (pill).
Shadow: very soft, 0 8px 24px rgba(43,31,23,0.06); hover 0 12px 32px rgba(43,31,23,0.10).
Buttons:
Primary: filled terracotta, white label, 48px height, 8px gap between icon and label.
Secondary: outlined, terracotta border 1.5px.
Tertiary: text with hover underline.
All buttons have a micro-bounce (scale 0.98) on press.
Input: outlined, label floats inside, focus = terracotta border + soft glow.
Chip / Filter: pill, selected = primary-soft background + dark label.
Status badge:
OPEN: olive
CLOSED: grey
PENDING: mustard
ACCEPTED: olive
REJECTED: terracotta
Card: alternating cream/white surfaces; favorite ❤ icon at top-right (outline → filled toggle).
Empty states: for every screen — cute illustration + 1 headline + 1 supporting line + 1 CTA. E.g. "No offers yet — find a listing to send the first one."
Skeleton loading: soft beige pulsing blocks on cream.
Micro-animation: a small Lottie sheep walking on splash; success modals show a tiny sparkle (no confetti).
5) Layout & Navigation (Web)
Top bar: left logo (derdimET wordmark + tiny sheep emblem), center global search, right side notifications, messages, profile avatar, role pill.
Left sidebar (collapsible, 256px → 72px): role-based menu. Outlined icons; active item gets a soft-primary pill background + a 3px terracotta stripe on the left edge.
Content area: 1200px max-width, 24px gutter, 12-column grid.
Bottom mobile nav (≤768): 4 icons, active is terracotta.
Breadcrumb: above the page title — "Home › My Offers › #1234".
6) Screen List (DELIVER ALL OF THEM)
For every screen produce desktop + tablet + mobile = 3 frames. Also create separate frames for empty / loading / error / success states.

A. Public / Auth Flow
Splash: cream background, centered logo + walking-sheep Lottie + "Loading…" micro-typo.
Landing (web-only marketing page, optional): hero ("From pasture to table, an honest marketplace"), 3 role cards (Seller / Slaughterhouse / Buyer), "How it works" 4 steps, social proof, footer.
Login: centered 480px card; left half illustration (shepherd + flock), right side form. Email/password, "Remember me", "Forgot password", "Sign up" link.
Register: multi-step stepper (1-2-3): Account → Role selection (three large cards: Animal Seller 🐑, Slaughterhouse 🔪, Meat Buyer 🥩 — with cute custom icons) → Company/personal details (changes based on accountType).
Password reset: request email → verify code → set new password. Three separate frames.
Email verification: cute envelope illustration + a large 6-digit OTP input.
B. Meat Buyer (MEAT_BUYER) Flow
Buyer Home / Feed: welcome card + today's summary (active offers, favorite slaughterhouses, new listings). Below: tabs "Meat Sale Listings" (3-column card grid) and "Recommended".
Buyer Search: left filter panel (meat type, animal category Small/Large, city, price slider, packaging), right results grid + map toggle.
Meat Sale Request Detail: photo carousel up top, title, seller card (avatar + name + verified ✓ badge + city + "View profile"), spec table (meat type, cut, quantity, price/kg, packaging, location), description, sticky right rail "Make Offer" CTA + favorite + start chat.
Offer Create (Meat): modal or side panel; price/kg, quantity, note. Live total estimate.
Buyer My Offers: tabbed list (Pending / Accepted / Rejected); each row is a mini card with status badge and "Open chat".
Buyer Profile: left avatar + company card, right tabs (My Info, Favorite Slaughterhouses, My Purchases, Settings, Security).
C. Animal Seller (ANIMAL_SELLER) Flow
Seller Home: small/large livestock filter chips on top, list of "Animal Purchase Requests" (requests coming from slaughterhouses) + per-row "Make Offer".
Seller Search: filter requests (category, slaughterhouse, city, date).
Animal Purchase Request Detail: slaughterhouse info card + request specs (category, count, expected weight, description) + sticky "Make Offer" CTA.
Offer Create (Animal): price/kg, animal count, note.
Seller Offers: status tracking of submitted offers.
Seller Create Listing: multi-step form (Category → Type/Breed → Count, Avg kg, Age → Price & Location → Drag-drop photos → Preview & Publish). Live preview card on the right.
Seller Animal Listing Detail (own listing): stats (views, offers received), incoming offers table, "Close/Edit listing".
Seller Profile: My Info, My Listings, My Sales, Favorite Buyers, Settings.
D. Slaughterhouse (SLAUGHTERHOUSE) Flow
Slaughterhouse Home / Dashboard: small metric cards (Active purchase requests, Active meat sale listings, Pending offers, Monthly revenue line chart), recent activity timeline below.
Slaughterhouse Search: "Browse seller listings" — animal listings grid.
Slaughterhouse Offers: two tabs — offers given (to sellers) and offers received (from buyers).
Slaughterhouse Create Meat Sale Request: meat type, cut, quantity, price/kg, packaging, location, photos, description → Publish.
Slaughterhouse Profile (public): gallery, about, certifications, verification badges, contact, favorite toggle.
E. Shared Modules
Public User Profile: outward-facing page of any user (avatar, role badge, city, verifications, their listings/requests, "Send message").
Messaging — Conversation List: left column conversations (avatar + last message + unread badge), right column selected chat. Single column + back on mobile.
Chat: bubbles (sender terracotta, receiver white), day separators, "typing…" indicator, attachments / photos, shared listing card, bottom input + emoji.
Notifications: clean list (new offer, offer accepted/rejected, new message, listing closed). Mark-as-read toggle.
Settings: Account, Notifications (toggle list), Change password, KVKK/Terms, Delete account (danger zone — red card).
Admin Panel (web-only): left sidebar (Users, Business verification queue, Listing moderation, Reports, Metrics). Data table + filters + bulk actions.
F. System Screens
404 / not found: lost-sheep illustration + "Nobody in this meadow" + "Home" CTA.
500 / error: "Something went sideways" + retry.
Maintenance mode.
Cookie banner & KVKK consents.
7) Delivery Format (inside Figma)
Single Figma file, split into pages: 00 — Cover, 01 — Foundations (colors, type, icons, grid, shadow), 02 — Components (Library with Auto Layout + Variants), 03 — Auth, 04 — Buyer, 05 — Seller, 06 — Slaughterhouse, 07 — Shared (chat, profile, settings), 08 — Admin, 09 — System.
All components built with Auto Layout + Variants + Component Properties (Button: size/variant/state/icon; Input: state/leading/trailing; Card: density/elevation).
Colors as Variables under color/brand/primary… plus a Mode 2 for dark mode.
Typography exposed as Text Styles.
8px base grid; spacing tokens space/4, 8, 12, 16, 24, 32, 48, 64.
Prototype at least the critical paths: Register → Seller Create Listing → Publish → Home; Buyer Search → Detail → Make Offer → My Offers.
8) Don'ts
No pure black #000 or neutral grey #888 — always warm neutrals.
No sharp corners, hard shadows, neon, or gradient mesh.
No stock meat photography or bloody imagery — use illustrations and symbols.
Minimal emoji usage; rely on the custom icon set.
Do not leave Material defaults visible — apply the brand thoroughly.
9) Tone — Microcopy Examples (warm)
Empty listing state: "The barn is quiet — be the first to post a listing."
Offer sent: "Your offer is on its way. We've nudged the other side."
Network error: "Looks like the line dropped. Mind trying again?"
Confirm modal: "Close this listing? This can't be undone."
Deliverable: all 35 screens, across 3 breakpoints, with the required states (empty/loading/error/success), produced as a shareable Figma library + prototype.