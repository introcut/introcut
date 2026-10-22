# Payments and legal routes for a Nepal-based solo developer (as of 2026-10-22)

STATUS NOTE FOR THE REPORT WRITER: This note is PARTIAL. The research session hit a tool usage limit ("session limit, resets 4:25pm Asia/Kathmandu") after about 17 tool calls. Roughly half of the key questions were answered with sources, and the rest are listed under Gaps for a follow-up run. Nothing here is legal or tax advice; a Nepali chartered accountant (CA) and, for company formation and privacy, a Nepali lawyer are needed. Many Nepali sources below are news or consultancy pages, not primary NRB/IRD texts; they are marked as such.

## 1. Collecting money: international platforms (Stripe, Atlas, PayPal, Paddle, Lemon Squeezy, Polar, Dodo, Payoneer, Wise)

### Takeaway
Direct Stripe is NOT available to Nepal-based merchants; Polar payouts also exclude Nepal. The two merchant-of-record (MoR) options whose official pages do not exclude Nepal are Dodo Payments (Nepal explicitly listed as #110 in its supported countries) and Paddle (Nepal not on its unsupported list, but payout method to Nepal not verified). Lemon Squeezy is unclear (Nepal not named in bank payout list; depends on PayPal list). PayPal's status in Nepal is contradictory across sources and must be verified on PayPal's own page.

### Cited Findings
- Stripe's global availability page does not list Nepal (India is shown as "Preview", contact sales; Bhutan, Bangladesh, Sri Lanka not listed). Fetched 2026-10-22. — [Stripe Global](https://stripe.com/global)
- Stripe Atlas costs a one-time USD 500 (includes government fees and first-year registered agent), then USD 100/year for the registered agent. It creates a Delaware company (C corp or LLC), a company tax ID, 83(b) filing, templates, USD 2,500 Stripe credits. The Atlas page itself states no country eligibility list and says startups in "over 175 countries" have used it. The USD 500 fee can be refunded if you fund a Stripe Treasury account with USD 5,000 within 90 days (per the homepage; Treasury has own terms). Atlas is not legal or tax advice. — [Stripe Atlas](https://stripe.com/atlas)
- Stripe's own global page says no matter where you are based you can use Atlas to incorporate a US company, set up a US bank account and activate payments (as summarized from search result snippet; I could not independently re-read the exact sentence). — [Stripe Global (en-fr)](https://stripe.com/en-fr/global)
- Stripe Tax lists Nepal separately and says for Nepal it supports only collecting VAT on digital services; Nepal was added to the Tax Registration API in Dec 2024. This is about taxing Nepali customers, not seller eligibility. — [Stripe Tax Nepal](https://docs.stripe.com/tax/supported-countries/asia-pacific/nepal); [Stripe changelog 2024-12-18](https://docs.stripe.com/changelog/acacia/2024-12-18/tax-registration-21-new-countries)
- Polar.sh pays out through Stripe Connect Express to countries in its supported list; the list includes Bangladesh, Bhutan, India, Pakistan, Sri Lanka, but Nepal is NOT in it. Fees not stated on that page. Fetched 2026-10-22. — [Polar supported countries](https://polar.sh/docs/merchant-of-record/supported-countries)
- Paddle: sellers can be based anywhere except countries on its unsupported list (examples: Afghanistan, Cuba, Iran, North Korea, Syria, Russia). Nepal is not on that list. Paddle says the list can change and it may ask for more information before processing orders or releasing payments. Payout countries and currencies not covered on the page fetched. — [Paddle supported countries](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle)
- Lemon Squeezy: bank payouts are in USD; PayPal payouts are "supported in 200+ countries and regions". Nepal is not named in its bank payout list; Nepal is also not on its unsupported-purchase list. The page says that if your country is on neither PayPal's list nor the bank list you "won't be able to use Lemon Squeezy at this time". — [Lemon Squeezy supported countries](https://docs.lemonsqueezy.com/help/getting-started/supported-countries); [Getting paid](https://docs.lemonsqueezy.com/help/getting-started/getting-paid)
- Dodo Payments (MoR): its docs list Nepal as country #110 (and India as #75) for merchant accounts and payouts. Rule: merchant accounts are supported only where KYC documents (government ID) are issued in a listed country; for registered entities, every director and beneficial owner must verify with ID from a listed country. Payouts only to listed countries; list may change. Fetched 2026-10-22. — [Dodo accepted countries](https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories.md)
- Dodo's Nepal marketing page says customers in Nepal can pay in NPR (2-4% conversion fee borne by customer), by cards, Apple/Google Pay, stablecoin. This concerns buyers, not seller payout. — [Dodo Payments in Nepal](https://dodopayments.com/payments-in/nepal)
- PayPal in Nepal conflicts: a Nepali Telecom article dated 2025-02-20 says PayPal is "not yet available in Nepal" and could enter soon; a Merokalam guide (stated "updated June 2026", but internally inconsistent with "as of April 2026") says PayPal is not officially operational in Nepal and a launch might come mid-2026 to early 2027 with no official announcement; a Zenind "2026 guide" (undated) says Nepal is on PayPal's supported list but availability varies and does not confirm receiving or bank withdrawal. I could not read PayPal's own country page (page returned only a title). — [Nepali Telecom](https://nepalitelecom.com/paypal-in-nepal); [Merokalam](https://merokalam.com/blog/payoneer-card-in-nepal/); [Zenind](https://www.zenind.com/help/post/how-to-open-a-paypal-account-in-nepal-2026-guide-for-freelancers-and-founders); PayPal list: [PayPal countries](https://www.paypal.com/us/webapps/mpp/country-worldwide) (unreadable)
- Payoneer is described by Merokalam (vendor-adjacent guide, 2026) as the most widely used route for Nepali professionals: USD/GBP/EUR receiving accounts, about 2% conversion fee to NPR plus bank rate (about 2-3% total), bank link verified with a small deposit, transfers 1-3 business days, names must match exactly. This guide is a single secondary source; confirm on Payoneer. Note that Payoneer receiving accounts mainly accept marketplace/B2B payments and the guide does not say it can act as a subscription checkout. — [Merokalam Payoneer guide](https://merokalam.com/blog/payoneer-card-in-nepal/)
- Wise: the Wise UK page I fetched did not say whether Nepal residents can open a Wise account (it points to a Nepal-specific site). A search snippet claimed Wise "accepts PayPal in Nepal" (not relevant to account opening). Wise availability for Nepal residents is UNVERIFIED. — [Wise Nepal hub](https://wise.com/gb/hub/payment-methods/nepal)

### Inferences
- A zero-capital Nepal-resident individual can most plausibly start with Dodo Payments (MoR) since Nepal is explicitly listed, subject to Dodo's KYC (Nepali government ID) and checking which payout rails (bank/SWIFT, local rails) Dodo offers to Nepali banks and what NRB/bank will accept inbound.
- Polar (a popular indie MoR) and direct Stripe are blocked for a Nepal-resident individual; Stripe via a US company (Atlas) is a different route that requires a US entity (and has tax/compliance cost, see Gaps).
- Paddle may accept a Nepal-based seller but typically requires a business entity and its approval process can be strict; this note has no source on that (marked verify).

### Gaps
- Official Stripe Atlas eligibility for Nepali founders and Stripe Docs Atlas FAQ (URL returned 404); US LLC/C-corp annual costs (Delaware franchise tax, US tax filings like Form 5472 for single-member LLCs), US bank account options for non-residents (Mercury etc.), and how NRB treats a Nepali resident owning a foreign company (NRB approval for overseas investment) — not researched.
- Paddle payout countries/currencies, fee schedule (reported 5% + 50 cents; not verified here), MoR tax handling, and whether Paddle accepts individuals without a company — not verified.
- Lemon Squeezy full bank payout list (Nepal absent from the text I saw) and fee (a competitor blog says 5% + 50c; unverified).
- Dodo fee schedule, payout method/fee to Nepal, subscription and chargeback handling terms — not retrieved.
- PayPal official status for Nepal, FastSpring, Gumroad, 2Checkout/Verifone supported countries — not researched.
- Wise and Payoneer official eligibility pages — not read.

## 2. Local gateways (eSewa, Khalti, Fonepay, IME Pay, connectIPS) and India (Razorpay, Cashfree, UPI)

### Takeaway
Not researched: the session limit hit before any local-gateway page could be fetched. No claims are made.

### Cited Findings
- Dodo's Nepal page says foreign buyers can pay in NPR via Dodo with a 2-4% conversion fee; this is the only Nepal-pricing item found. — [Dodo Payments in Nepal](https://dodopayments.com/payments-in/nepal)

### Inferences
- None sourced.

### Gaps
- eSewa, Khalti, Fonepay, IME Pay, connectIPS merchant onboarding (individual vs registered business, PAN/VAT/company docs), API/webhooks, fees, recurring/subscription support, international card access — all unresearched. Suggested follow-up sources: Khalti docs (docs.khalti.com), eSewa developer docs (developer.esewa.com.np), connectIPS (npi.com.np), Fonepay merchant page.
- Razorpay/Cashfree/UPI eligibility for a Nepal-based seller and Indian users paying a Nepal merchant (including NRB/RBI cross-border QR link between Nepal's Fonepay and India's NPCI/UPI) — unresearched.

## 3. Nepal rules (NRB, IRD, company registration, VAT)

### Takeaway
Reports (secondary sources) say Nepal gives IT/service exporters preferential treatment: a 5% final withholding tax on IT export income for individuals received in foreign currency through banking channels, foreign-currency account/retention facilities (10% of prior-year foreign earnings per a 2023 amendment), and a 2026 NRB ICT circular enabling IT prepaid cards with higher limits. Exact current text must be verified with a CA and the NRB/IRD sites; sources conflict on tax incentives (5% final tax vs 75% rebate vs 50% exemption) and the FY 2083/84 Finance Act (effective 2026-07-17) may have changed rates.

### Cited Findings
- 5% final withholding on income from export of IT services by individuals, provided it is received in foreign currency through formal banking channels (reported by Nepali news/consultancy sources, not IRD primary text). — [nepal.it.com tax guide](https://nepal.it.com/tax-guide) (promotional calculator page, low reliability); search summary also cited [Law Alpine](https://lawalpine.com/blog/income-tax-rate-in-nepal)
- Merokalam guide (June 2026 / April 2026, inconsistent date): flat 5% advance tax on foreign-currency IT/digital service income received through a Nepali bank, final for individuals with annual foreign income under NPR 40 lakh; link PAN to bank account; annual returns (D01 individuals, D04 above NPR 40 lakh); late-filing penalty NPR 100/day or 0.1% of tax; 15% annual interest on unpaid tax; VAT registration mandatory above NPR 30 lakh turnover; exported services zero-rated. Single secondary source: verify with IRD/CA. — [Merokalam](https://merokalam.com/blog/payoneer-card-in-nepal/)
- Conflicting tax-incentive reports: a tax guide for FY 2082/83 lists a 75% rebate on tax payable from IT services exported in foreign currency, while an article on the newer budget reports a 50% income tax exemption for IT service exports; one source notes the Finance Act 2083 rewrote the personal rate table effective 1 Shrawan 2083 (2026-07-17). — [nepsetrading FY 2082/83 reform](https://nepsetrading.com/news/comprehensive-tax-reform-in-nepals-fy-208283-budget?lang=en); [B360 IT budget 2083/84](https://www.b360nepal.com/detail/29119/nepals-it-budget-208384); [NITI Partners incentives 2026](https://nitipartners.com/nepal-it-business-incentives-2026/) (these pages could only be read as search summaries; verify)
- 2023-08-08 (Sharesansar): NRB revised its integrated foreign exchange instructions so service exporters including IT firms can open foreign bank accounts and buy software/equipment in foreign currency via commercial banks, capped at 10% of the previous fiscal year's foreign currency earnings; requires audited statements of prior-year earnings and bank details showing conversion. More than 12 months old: re-check. — [Sharesansar 2023-08-08](https://www.sharesansar.com/newsdetail/foreign-exchange-facilities-for-it-and-service-exporting-businesses-in-nepal-2023-08-08)
- 2026 ICT circular (B360, report dated 2026-04-06, header dates inconsistent): Class A and national-level Class B banks may issue IT prepaid cards for IT/communication/broadcasting services with annual USD 3,000 limit; exporting IT entities may qualify for USD 5,000; large IT companies with significant foreign earnings may pay up to USD 100,000 annually for online software and infrastructure. IT exporters may invest up to USD 1 million abroad; non-exporters up to USD 20,000. — [B360 CAN Federation on NRB directive](https://www.b360nepal.com/detail/28246/can-federation-welcomes-nrb-directive-to-expand-foreign-currency-access-for-ict-sector); [MEA Tech Watch 2026-01-01](https://meatechwatch.com/2026/01/01/nepal-aims-for-rs-300-billion-in-it-exports-as-nrb-opens-doors-for-overseas-investment/)
- Stripe Tax says Nepal supports collecting VAT on digital services (confirms Nepal VAT applies to foreign digital service providers' sales to Nepali customers in principle). — [Stripe Tax Nepal](https://docs.stripe.com/tax/supported-countries/asia-pacific/nepal)

### Inferences
- Whatever the correct tax rate, an individual earning foreign income through a Nepali bank (e.g., MoR payout by SWIFT) appears to be in a favorable 5%-final or rebate regime, but this likely requires PAN, bank-reported foreign receipts, and a bank that classifies the inflow as IT service export. A CA must confirm.
- Operating as an unregistered individual is likely workable for a small start, but a registered business (sole proprietorship/firm or private company) is likely needed for exporter-specific bank facilities (audited statements requirement implies a registered entity).

### Gaps
- NRB primary circulars (nrb.org.np) for IT service export, mandatory remittance/conversion periods, and the current Foreign Exchange Regulation text — not read.
- IRD primary text on IT export tax, VAT registration threshold/zero-rating, and VAT on digital services to Nepali customers — only secondary reports.
- Office of the Company Registrar: costs, time for private limited registration, minimum capital, individual vs company requirements — not researched.
- Which changes happened 2024-2026 beyond the ICT circular and Finance Act 2083 — incomplete.

## 4. Paying foreign providers (AI APIs, hosting) from Nepal

### Takeaway
Ordinary Nepali individuals can get a prepaid "dollar card" (online only) with a historical USD 500/year limit (older 2021 rule); a 2026 reported NRB ICT circular raises limits for IT-category entities to USD 3,000 (USD 5,000 for exporters, up to USD 100,000 for larger IT firms with foreign earnings). Whether the AI/cloud bills of Introcut would qualify depends on registration as an IT entity; verify with your bank.

### Cited Findings
- NRB announced on 2021-03-21 that banks can issue prepaid foreign-currency cards for online transactions to individuals, firms, companies: deposits and online purchases up to USD 500 per year; income from international outlets can be deposited up to USD 5,000/year; needs KYC form, PAN, declaration of holding one such card; no ATM withdrawals or POS. More than 12 months old: re-check. — [Online Khabar](https://english.onlinekhabar.com/nepali-banks-can-issue-prepaid-dollar-cards-now-here-are-basics-you-need-to-know-about.html)
- Merokalam (2026) says the standard e-commerce card limit is USD 500 per fiscal year, may be increased with documented foreign income, annual fee NPR 500-1,500, online purchases only. — [Merokalam](https://merokalam.com/blog/payoneer-card-in-nepal/)
- The 2026 ICT prepaid-card limits (USD 3,000 / 5,000 / up to 100,000) are in section 3. — [B360](https://www.b360nepal.com/detail/28246/can-federation-welcomes-nrb-directive-to-expand-foreign-currency-access-for-ict-sector)
- Domestic rupee card limits (not USD): debit Rs 20,000/transaction and Rs 50,000/day; prepaid Rs 10,000/transaction, Rs 20,000/day, Rs 200,000/month; credit transactions up to 10% of approved limit (Nov 2025 report); a April 2026 unified payment directive revised ATM limits. — [Sharesansar 2025-11-11](https://www.sharesansar.com/newsdetail/nepal-rastra-bank-introduces-new-rules-for-foreign-currency-transactions-and-card-usage-limits-2025-11-11); [Sharesansar 2026-04-17](https://www.sharesansar.com/index.php/newsdetail/nrb-issues-unified-payment-directive-with-revised-atm-limits-and-stronger-security-rules-2026-04-17) (headline only)
- Older reports (2014) cited USD 2,000/year for dollar credit cards (stale; 12+ months, likely superseded). — [Sharesansar](https://www.sharesansar.com/newsdetail/limit-on-dollar-denominated-credit-cards-up)

### Inferences
- A typical solo-development spend (a few hundred USD/month on AI APIs) would exceed the old USD 500/year individual limit within 1-2 months; the ICT limits (if they apply to an individual or a newly registered IT firm) are the practical route, so registering a business and discussing the "IT prepaid card" with a Class A bank is likely required.
- The number of Nepali banks offering the IT card and their requirements was not found.

### Gaps
- Primary NRB circular for the ICT card; which banks issue it; Wise/Payoneer card use in Nepal; practical reports of Nepalis paying OpenAI/Google Cloud/Vercel/AWS; Google Cloud billing support/tax ID for Nepal; providers refusing Nepal cards/billing addresses (e.g., OpenAI/Anthropic/Google unsupported-country lists) — not researched.

## 5. Legal basics (ToS/privacy, Nepal privacy law, GDPR/DPDP, refunds, VAT/GST, age limits, AI content liability, MIT license)

### Takeaway
Not researched in this session. Only the Nepal digital-VAT point from Stripe Tax is sourced (section 3).

### Cited Findings
- Stripe Tax: Nepal supports collection of VAT on digital services. — [Stripe Tax Nepal](https://docs.stripe.com/tax/supported-countries/asia-pacific/nepal)
- A merchant of record (e.g., Dodo, Paddle, Lemon Squeezy) is the legal seller of record and handles sales tax/VAT collection; this is what these vendors advertise but I did not capture a quoted source for each; verify in their terms. — no source retrieved

### Inferences
- Choosing an MoR is likely the largest single legal simplifier for a Nepal-resident solo founder (VAT/GST for EU/India/US shifts to the MoR), but the founder still owes Nepali income tax and PAN compliance, and still controls privacy and content liability.

### Gaps
- Nepal's Individual Privacy Act 2018 and any newer data protection bill; GDPR (including Article 27 representative), India DPDP Act 2023 exposure; consumer refund obligations by region; EU/India/US digital tax thresholds; age limits (COPPA, GDPR-K); AI-generated-content liability; effect of MIT license on payments/legal obligations — all unresearched.

## 6. Practical route comparison for a zero-capital solo founder

### Takeaway
Provisional ranking from verified facts only; costs and fees for several routes unverified.

### Cited Findings
- Route A: Dodo Payments as MoR (Nepal explicitly supported; KYC with Nepali government ID; payouts to Nepal supported per docs). Upfront cost: none found. Fees: not retrieved. — [Dodo accepted countries](https://docs.dodopayments.com/miscellaneous/accepted-countries-and-territories.md)
- Route B: Stripe Atlas + Stripe account for a Delaware company: USD 500 one-time + USD 100/year registered agent (plus unlisted US tax/accounting costs). — [Stripe Atlas](https://stripe.com/atlas)
- Route C: Paddle: Nepal not excluded, approval and payout path to Nepal unverified. — [Paddle](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle)
- Ruled out as seller platforms for Nepal-resident individuals (per official pages): direct Stripe ([Stripe Global](https://stripe.com/global)) and Polar ([Polar](https://polar.sh/docs/merchant-of-record/supported-countries)).
- Lemon Squeezy: only possible if PayPal payouts work for Nepal or Nepal is on the bank list; not verified. — [Lemon Squeezy](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)

### Inferences
- Suggested provisional order for the owner to validate: (1) Dodo Payments MoR with Nepali KYC, payout by bank to Nepal, with a Class A bank account configured for IT-export foreign income and a CA to confirm 5% final tax and PAN reporting; (2) Stripe Atlas US company if growth justifies about USD 500 + US compliance and NRB approval for foreign ownership is clarified by a lawyer; (3) Paddle if Dodo fails; (4) a local gateway (eSewa/Khalti) for Nepal-only users, details unresearched. Crypto/stablecoin payment is not recommended (Dodo itself lists stablecoin as a buyer option, which is distinct).
- Before building billing, make the first step a short test: sign up on Dodo with Nepali ID, and ask the bank in writing how an inbound payout will be classified (IT service export) and what documents it needs.

### Gaps
- Fees, timing, payout rails and setup times for every route; Nepal local-only route; ranking confidence is low because of the research gaps above.

## Source quality and dating notes
- Primary/official pages read on 2026-10-22: Stripe Global, Stripe Atlas, Polar docs, Paddle help, Lemon Squeezy docs, Dodo docs. All eligibility lists can change.
- Secondary/news: Sharesansar (2023-08-08, 2025-11-11, 2026-04-17 headline), Online Khabar (2021-03-21), B360 (2026-04-06 reported), Nepali Telecom (2025-02-20), Merokalam (2026, inconsistent), Zenind (undated), NITI Partners, nepal.it.com (promotional). Flag: Online Khabar 2021, Sharesansar 2023 and Nepali Telecom Feb 2025 items are older than 12 months; re-check against NRB (nrb.org.np) and IRD (ird.gov.np).
- Recommended follow-up run: finish local gateways, Nepal company registration, Google Cloud/AI-provider billing from Nepal, privacy/GDPR/DPDP, Wise/Payoneer/PayPal/Paddle official pages. (Partly done in the addendum below.)

---

# ADDENDUM (second research pass, 2026-10-22): gaps filled after the coordinator asked to resume

Rule: this addendum fills the gaps in the order the coordinator set. Where it conflicts with the earlier "Not researched" statements above, THIS addendum supersedes them. Same limits as before: not legal or tax advice; Nepali CA and lawyer needed; unverified items are marked "verify".

## A1. Local gateways (eSewa, Khalti, Fonepay, IME Pay, connectIPS)

### Takeaway
Nepali wallet gateways onboard LEGALLY REGISTERED businesses (at least a registered sole proprietorship with PAN); eSewa's terms point to a registered entity, with only a small-turnover sole-proprietor tier. They serve Nepali wallet/bank users, not foreign cards, and I found no official recurring-billing product. Fees are not published; one anecdotal quote exists.

### Cited Findings
- eSewa merchant API is open to "eligible, legally registered merchants in Nepal": sole proprietorships, partnership firms, private/public limited companies, NGOs, cooperatives and others. Documents: sole proprietorship with transactions of NPR 1 lakh or more per fiscal year: business registration certificate, PAN/VAT certificate, business licence if applicable, proprietor citizenship copy, latest tax clearance certificate. Small sole proprietorship (under NPR 1 lakh per fiscal year): business registration if registered, a third-party document confirming the business exists (e.g., ward office/local authority letter), citizenship copy and the proprietor's personal PAN copy. Private limited: certificate of incorporation, PAN/VAT, MOA/AOA, board minute, signatory citizenship, tax clearance, KYM form. Onboarding online via the merchant portal or in person at eSewa head office. The page lists no fees. Fetched 2026-10-22 — [eSewa: documents required for merchant API integration](https://blog.esewa.com.np/documents-required-esewa-merchant-api-integration)
- eSewa's terms define a merchant as a business entity or organization with separate legal existence (per a search summary of eSewa's terms; I did not open the terms page) — [eSewa terms](https://blog.esewa.com.np/?p=593); an older eSewa post lists PAN/VAT, registration certificate, owner citizenship, tax clearance, a bank account with a member bank and a website — [eSewa merchant post](https://blog.esewa.com.np/interested-in-becoming-an-esewa-merchant-heres-how-you-can-do-it/)
- Khalti Payment Gateway (KPG): web (ePayment) and mobile SDK integrations; payment sources are Khalti wallet, e-banking/mobile banking of partner banks, SCT/VISA cardholders and connectIPS users; merchant dashboard with refunds, reports, multi-user accounts, transfer of collected funds to bank. The intro docs do not mention recurring payments, webhooks or fees (contact merchant@khalti.com). Fetched 2026-10-22 — [Khalti docs](https://docs.khalti.com/)
- Khalti merchant onboarding (via Khalti blog/merchant terms, search summary): business must be registered with a government-recognized body; documents include company registration certificate, PAN/VAT certificate, latest tax clearance and logo; business KYC through the merchant dashboard before payments go live. — [Khalti merchant terms](https://khalti.com/info/terms/merchant/); [Khalti blog](https://blog.khalti.com/?p=16372)
- Khalti consumer transaction limit per NRB directive (March 2025): KYC-verified user merchant payment up to Rs 2 lakh per transaction/day and Rs 10 lakh per month. This can cap a Nepali buyer's wallet payments. — [Khalti transaction limits](https://khalti.com/info/transaction-limits/)
- Anecdotal (Reddit r/technepal, 2025-04-30, summarized by a search result; the thread page itself returned 404 to me): a SaaS founder said only Khalti replied with a quote of NPR 30,000 one-time fee plus 3% on every payment; IME Pay gave inconsistent quotes (free vs Rs 15,000) and IME Pay does not accept payments from eSewa. A Nepali guide says bank card gateways (Himalayan, Nabil) charge roughly 3-4%. Khalti's 2024 tariff notice reportedly says no additional fee for merchant payments (consumer side). — [r/technepal mirror](https://reddit.birdcat.cafe/r/technepal/comments/1kbbi6p/payment_gateway_for_saas) (anecdotal, unverifiable); [Nepali Telecom wallet fees](https://nepalitelecom.com/wallet-service-fees)
- Fonepay: QR-based merchant model settling to the merchant's bank account; enrollment page lists "Basic Information" and "Business Information" sections but not the document list. One acquiring bank (Muktinath) lists: account in that bank, merchant application, PAN, account-holder citizenship, company registration certificate, mobile number. Requirements vary by acquiring bank. — [Fonepay merchant enrollment](https://fonepay.com/business/merchant-enrollment); [Muktinath QR merchant](https://www.muktinathbank.com.np/digital-banking/digital-banking-submenu/qr-merchant-payment)
- connectIPS (run by NCHL) is a bank-account payment rail needing one-time customer enrollment through the customer's bank; covers e-commerce, e-payments, bill payments. — [Khalti blog on connectIPS](https://blog.khalti.com/fintech-trends/connectips-e-payment-system-launched/); [Himalayan Times](https://thehimalayantimes.com/business/nibl-on-board-connectips)

### Inferences
- A pure individual with no business registration likely cannot get a standard eSewa/Khalti merchant account; the minimum is a sole proprietorship registered at the ward/local office with PAN (cheap, quick relative to a company), which also helps with bank foreign-currency facilities. Confirm with eSewa/Khalti support.
- None of the sources show subscription/auto-debit for wallets, so a Nepal subscription would need monthly manual payment or pre-paid credit packs (the Introcut "credit pack" model fits this better than recurring plans).
- Local gateways will not take foreign users' cards or wallets; they serve only Nepali buyers.

### Gaps
- Official fee schedules, webhook/callback details and recurring-payment support for eSewa/Khalti/Fonepay/IME Pay; eSewa's developer docs loaded as an empty page. IME Pay and Fonepay API documentation not read. India: Razorpay/Cashfree/UPI eligibility for a Nepal seller and the Nepal-India Fonepay/NPCI UPI link not researched (still a gap; Dodo does list India-domestic UPI as a buyer payment method, see A2).

## A2. Dodo Payments detail, Paddle, FastSpring

### Takeaway
Dodo accepts Nepal-based individuals with only a Nepali government ID (verified by Persona), publishes clear fees (4% + 40 cents, plus surcharges), supports subscriptions and Standard Webhooks, and pays out by USD SWIFT for non-US businesses at a USD 25 fee. Paddle charges about 5% + 50 cents but Nepal seller/payout eligibility and individual onboarding remain unverified. FastSpring: no Nepal confirmation.

### Cited Findings
- Dodo fees (pricing page, fetched 2026-10-22): "Standard rate is 4% + 40 cents per domestic US transaction"; international surcharge +1.5% (cards and local methods outside the US); subscription/addon/usage-billing surcharge +0.5%; India domestic cards/UPI 4% + 15 cents; BNPL and PayPal +3%; refunds USD 1; disputes USD 30; USD SWIFT payouts for non-US businesses USD 25; payouts "free" in the table but the FAQ says USD 5 applies to payouts under USD 1,000 (page is internally inconsistent: verify); recovery/dunning tools 5% of recovered amount only; no monthly or setup fee. — [Dodo pricing](https://dodopayments.com/pricing)
- Docs vs pricing conflict on payout fees: an earlier search result said docs state (international merchants outside US and India) USD 5 plus 2.5% of the transaction amount per payout; I could not re-read that docs page (it redirects to the pricing page). Treat the payout cost as unresolved; a third-party review (Fungies) estimates about 6.8% effective on a USD 50 non-US-card subscription. — [Fungies review (third party)](https://fungies.io/dodo-payments-review-2026.md)
- Dodo verification (docs, fetched 2026-10-22): individuals/sole proprietors need only a government-issued ID verified via Persona with a selfie, ID from an accepted country, bank details must match the ID name. The site must be published before submitting and must show pricing, Terms of Service, Privacy Policy, a Refund and Cancellation Policy and a contact route; the live site must match the form. Identity checks finish within minutes; form review is typically 1-3 business days. Registered entities add KYB: company registration number and document plus IDs for all directors and beneficial owners; bank name must match the company legal name. Prohibited products are in a separate Merchant Acceptance Policy (not read: verify AI video/avatar use cases). — [Dodo verification process](https://docs.dodopayments.com/miscellaneous/verification-process.md)
- Dodo is the legal seller on the merchant's behalf (tax, fraud, regulation) and supports subscriptions; a third-party WooCommerce/Listeo guide shows Standard Webhooks signing and events such as subscription.active/renewed/cancelled/failed. Dodo's own webhook reference not read. — [Listeo Dodo setup (third party)](https://docs.purethemes.net/listeo/knowledge-base/listeo-subscriptions-dodo-payments-setup/); [Dodo FAQ](https://docs.dodopayments.com/miscellaneous/faq)
- Paddle fee: several third-party sources say 5% + 50 cents per checkout transaction; monthly payouts with a USD 100 minimum are reported; Paddle reviews the business and website before live sales. Nothing found on individual/sole-proprietor requirements. Official page paddle.com/pricing not read. — [Fungies Paddle comparison (competitor)](https://fungies.io/alternatives/paddle); [learnwithhasan Paddle](https://learnwithhasan.com/payment-gateways/paddle/)
- Paddle's developer page on supported countries covers CUSTOMER checkout countries (the fetched table was truncated at 25 of 229 countries) and says `GET /countries` returns every country Paddle knows; it does not address seller location or payouts. — [Paddle supported countries and locales](https://developer.paddle.com/concepts/sell/supported-countries-locales)
- FastSpring: payout portal says direct bank deposit is available in 90+ countries without naming them; no source confirms Nepal. — [FastSpring payout portal](https://developer.fastspring.com/docs/payout-portal)

### Inferences
- Dodo's cost for a small sale from a non-US buyer is roughly 4% + 40 cents + 1.5% (about 10% on a USD 9 sale, because the fixed 40 cents hurts small packs), plus payout and FX/bank costs. Larger pack sizes (e.g., USD 15-25) keep the effective fee lower. (Arithmetic from the cited rates; not a quote.)
- Dodo is the only option with documentation that explicitly allows a Nepal-ID individual without a company. Test KYC early.

### Gaps
- Dodo's payout-to-Nepal bank experience (does a Nepal bank receive USD SWIFT and classify it as export income?), the Merchant Acceptance Policy for AI/video tools, and chargeback outcomes. Paddle official eligibility/fees, Gumroad, 2Checkout, Creem (a search result suggested Creem's local-bank payout list includes Nepal; docs.creem.io/faq/supported-countries not read; verify) are worth a check as alternative MoRs.

## A3. Nepal company registration and whether it is needed

### Takeaway
Secondary sources say a sole proprietorship registers at the local ward office and a company at the Office of the Company Registrar (OCR). Private-limited cost and time are modest but vary by source. No source showed a company is legally required just to receive foreign income as an individual with PAN, but bank foreign-currency facilities and gateway merchant accounts effectively require a registered business.

### Cited Findings
- Time: 7-10 days online (one guide); NITI Partners 2026: name reservation 1-2 days, verification 3-7 days, certificate within 1-2 weeks. Government fee scales with authorised capital: NPR 1,000 up to NPR 100,000; NPR 4,500 for NPR 100,001-500,000; NPR 16,000 for NPR 2,500,001-10,000,000; plus legal/notary/professional fees. Minimum capital: one guide says none for most private companies, another says NPR 100,000 paid-up (conflict: verify on ocr.gov.np). — [NITI Partners online registration 2026](https://nitipartners.com/online-company-registration-in-nepal-2026-updated/); [Necojobs guide](https://www.necojobs.com.np/blogs/business-tips/how-to-start-a-company-in-nepal)
- Sole proprietorship is registered at the local ward office; a company through OCR (promotional 2026 finance guide, so low reliability). — [Beaumont finance handbook (promotional)](https://beaumont-capitalmarkets.co.uk/essential-2026-finance-handbook-freelancers-nepal/)
- PAN: Global IME Bank says freelancers must register for a (personal) PAN, practically needed for bank accounts. — [Global IME PAN guide](https://www.globalimebank.com/blog/pan-card-for-banking-in-nepal/)
- VAT registration threshold: Beaumont and an FNCCI page cite NPR 5 million turnover for services (conflicts with Merokalam's NPR 30 lakh figure earlier in this note: verify at IRD). — [FNCCI FDI FAQ](https://fncci.org/fdi-faq1-349.html)
- I found no current NRB directive stating how freelance/individual export receipts are treated versus a company's (gap).

### Inferences
- A pragmatic path: personal PAN now; register a sole proprietorship at the ward office (low cost; also satisfies eSewa/Khalti tier 1); consider a private limited later when revenue, co-founders or the IT-card/10% foreign-currency rules (which presuppose audited accounts) matter. A CA must confirm tax treatment and whether the 5% final tax is available to a proprietorship.

### Gaps
- Official OCR/IRD pages; exact IT service-exporter registration needs; time for a bank to open a foreign-currency account.

## A4. Paying foreign providers from Nepal

### Takeaway
Nepal is NOT on Google Cloud's currency/billing country table, so Cloud Billing there falls back to USD charges and Google points to its payment-options tool; cards and virtual-card vendors are the practical route, with limits set by NRB (see section 4 above). No independent Nepali developer experience reports were found, only vendor marketing.

### Cited Findings
- Google Cloud's currency page has no Nepal row; for unlisted countries "your Cloud Billing account might incur charges in USD" and it points to the payment options finder. It does not say whether a Nepal billing profile is accepted at all: verify by trying to create the profile. Fetched 2026-10-22 — [Google Cloud billing currencies](https://docs.cloud.google.com/billing/docs/resources/currency)
- Google Cloud payment-method docs (search summary): Visa/Mastercard/Amex cards accepted, bank accounts only where supported, prepaid and virtual cards are not accepted (one localized version differs on PayPal). Summarized from search; verify. — [Cloud payment methods](https://docs.cloud.google.com/billing/docs/how-to/payment-methods)
- Virtual-card vendors market Nepal-compatible cards funded by USDT/USDC for Vercel, AWS, ChatGPT, Claude, GitHub; this is vendor marketing, and a Vercel guide from the same vendor says Vercel accepts credit and debit cards only. Not independent; crypto funding is not recommended and its legality for Nepali residents is not established here. — [EverTry Nepal virtual card (vendor)](https://www.evertry.co/public/virtual-card/nepal); [EverTry Vercel guide (vendor)](https://evertry.co/blog/how-to-pay-for-vercel-subscription-in-africa/)
- NRB card and IT-prepaid-card limits: see section 4 (USD 500/year individual; USD 3,000/5,000/100,000 under the reported 2026 ICT circular).

### Inferences
- If Google Cloud rejects prepaid/virtual cards (per the summary), the IT-category prepaid card might not work for Google Cloud billing; a proper dollar credit card from a Nepali bank may be needed. Verify with the bank and Google's payment finder before depending on Google AI billing.
- Cloudflare and Vercel: no primary source on Nepal support was retrieved (gap). Fraud filters can decline Nepal-issued cards even where the country is not blocked.

### Gaps
- Official OpenAI, Anthropic, fal.ai, Runway, Azure, Cloudflare, Vercel, Supabase supported-country/billing pages; real Nepali developer reports; which Nepali banks issue the USD credit/ICT card and their terms.

## A5. Privacy law exposure

### Takeaway
Nepal's Individual Privacy Act 2018 is consent-centred but its reach over foreign or small operators is unclear and enforcement is described as limited; GDPR Article 3(2) and India's DPDP Act both apply to services aimed at people there, so the privacy policy and consent flows should be written to GDPR/DPDP standard from day one. Introcut's browser-only processing lowers exposure, but account data (Google sign-in identity, payments) still counts.

### Cited Findings
- Nepal Individual Privacy Act 2018 (2075): intended to regulate data held by public authorities or corporate bodies incorporated in Nepal; unclear whether "person" covers legal persons; consent and disclosure of purpose, nature, method and safety are central; implementing rules were reported missing initially, and an Individual Privacy Regulation 2020 (2077) was listed later; a Data Act 2079 (2022) and E-commerce Act 2025 (2081) (requiring e-commerce businesses to keep personal information private) were listed by DLA Piper; one tracker rates enforcement as limited with no comprehensive cross-border transfer framework. Secondary sources; a Nepali lawyer should confirm. — [DLA Piper Nepal](https://www.dlapiperdataprotection.com/?c=NP&t=law); [Pioneer Law IPA summary](https://pioneerlaw.com/individual-privacy-act-2018-2075); [Martin Chautari](https://martinchautari.org.np/blogs/nepal-needs-robust-data-protection-legislation)
- GDPR Art. 3(2): applies to controllers outside the EU when processing relates to offering goods or services to people in the Union "irrespective of whether a payment of the data subject is required", or monitoring their behaviour. This covers the free tier. — [GDPR Art. 3](https://gdpr-info.eu/art-3-gdpr/)
- India DPDP Act 2023: covers foreign companies processing personal data outside India in connection with offering goods or services to individuals in India. Rules notified 2025-11-13; Data Protection Board set up immediately; consent-manager registration about November 2026; main obligations (notice, security, breach notification, rights) at 18 months, 2027-05-13. Sources differ on rule-level dates. — [Hogan Lovells](https://www.hoganlovells.com/en/publications/indias-digital-personal-data-protection-act-2023-brought-into-force-); [Privacy World](https://www.privacyworld.blog/2025/11/india-passes-the-digital-personal-data-protection-rules-ushering-in-a-new-digital-age-in-india/); [KS&K](https://ksandk.com/md/data-protection-and-data-privacy/dpdp-act-rules-2026-compliance-deadline/)
- Dodo requires a published Terms of Service, Privacy Policy and Refund and Cancellation Policy before KYC approval. — [Dodo verification](https://docs.dodopayments.com/miscellaneous/verification-process.md)

### Inferences
- The MoR does not take over privacy compliance: Introcut remains controller for its own accounts, so a short privacy policy, deletion on request and consent notes are needed. EU Article 27 representative duty and small-processing exemptions were not researched (verify with counsel).

### Gaps
- Consumer refund law by region, EU/India/US digital tax thresholds (MoR shifts these but not verified per vendor), age limits (COPPA, GDPR-K), AI-generated-content liability, MIT licence effects. Still unresearched.

## Updated route recommendation (supersedes the provisional order in section 6)
1. Start now (zero cost): personal PAN, publish a site with Terms/Privacy/Refund pages, apply to Dodo Payments as an individual with Nepali ID (about 4% + 40 cents + 1.5% international + 0.5% subscription; USD SWIFT payout USD 25); sell credit packs of USD 15+ rather than tiny packs; ask a Class A bank in writing how the inbound USD will be classified.
2. Register a ward-level sole proprietorship (cheap) when you want eSewa/Khalti for Nepali users and bank foreign-currency/IT-card facilities; expect quotes like the anecdotal NPR 30,000 + 3% and no subscriptions.
3. Consider Stripe Atlas (USD 500 + USD 100/yr + US compliance) only after traction and lawyer advice, mainly because direct Stripe and Polar exclude Nepal.
4. Not recommended: crypto/stablecoin card funding for provider bills, and any account in another person's name.
Re-check before building: Dodo payout to Nepal, Merchant Acceptance Policy, NRB ICT card text, Finance Act 2083 tax treatment.
