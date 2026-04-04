# Business Plan — CTC Mobile Wishlist Feature

**Prepared by:** EPAM Systems — Hackathon POC Team
**Client:** Canadian Tire Corporation (CTC)
**Date:** April 2026
**Status:** Draft — POC Phase

---

## Executive Summary

Canadian Tire Corporation operates Canada's largest non-grocery retail network with ~1,700+ locations and ~$17.3B in consolidated annual revenue. Despite strong digital investment, CTC's mobile app lacks a wishlist feature — a proven commerce tool that increases engagement, conversion, and average order value across retail.

This proposal outlines a **Mobile Wishlist** feature that enables customers to create and manage wishlists, add products via catalog browsing or in-store barcode scanning, and share wishlists with contacts for collaborative gift fulfillment. The feature leverages CTC's existing strengths — the Triangle Rewards ecosystem, 500+ retail locations, and 10M+ app installs — to drive incremental revenue estimated at **$85M–$215M annually** across all banners.

---

## 1. Current State — CTC Revenue Landscape

### 1.1 Consolidated Revenue (FY 2024)

> **Sources:** CTC Q4 2024 Earnings Release (Feb 2025); CTC 2024 Annual Information Form (SEDAR+); CTC 2024 Annual Report. Party City: CTC acquisition announcement ($174.4M, Aug 2019, CBC). PartSource: ZoomInfo/Growjo estimates. Store counts: CTC 2024 AIF.

| Metric | Value |
|--------|-------|
| **Consolidated Revenue** | ~$17.3B |
| **Retail Revenue (excl. Financial Services)** | ~$14.5B |
| **E-commerce Revenue (all banners)** | ~$2.1–2.4B (14–16% of retail) |
| **Financial Services (CT Bank)** | ~$1.9B |

### 1.2 Revenue by Banner

| Banner | Est. Revenue | Stores | Avg. Transaction Value |
|--------|-------------|--------|----------------------|
| **Canadian Tire Retail** (incl. gas bars) | ~$9.8B | ~500 retail + ~300 gas | $45–65 |
| **SportChek / Sports Experts** | ~$2.2B | ~185 | $70–90 |
| **Mark's / L'Équipeur** | ~$1.4B | ~385 | $55–75 |
| **Helly Hansen** | ~$1.0B | ~65 (+ wholesale) | N/A (wholesale-heavy) |
| **Party City Canada** | ~$175M | ~69 (expanding) | $30–50 |
| **PartSource** | ~$76M | ~95 | $50–80 |
| **CT Financial Services** | ~$1.9B | — | — |

### 1.3 Digital & Loyalty Ecosystem

| Metric | Value |
|--------|-------|
| **Triangle Rewards Members** | ~16 million active |
| **Triangle Transaction Penetration** | ~65–70% of CT retail transactions |
| **App Downloads (cumulative)** | 10M+ across iOS/Android |
| **Estimated Mobile MAU** | 3–5 million (all banners combined) |
| **Online ATV Premium** | 20–30% higher than in-store |

---

## 2. The Opportunity — Why Wishlists Matter

### 2.1 Industry Benchmarks

Wishlist features are proven revenue drivers across retail e-commerce:

| Benchmark | Industry Average | Source Context |
|-----------|-----------------|----------------|
| **Conversion rate lift** (wishlist users vs. non-users) | +25–40% | Retail e-commerce studies |
| **AOV increase** for wishlist users | +15–25% | Higher intent = larger baskets |
| **Return visit rate** for users with active wishlists | +30–50% | Wishlists create reason to return |
| **Email/push re-engagement** (price drop on wishlisted item) | 5–8x higher CTR | vs. generic promotional emails |
| **Gift conversion** (shared wishlists) | 60–70% fulfilment rate | Gift registry / wishlist sharing data |
| **Abandonment recovery** | +10–15% recovery rate | Wishlist as alternative to cart |

### 2.2 CTC-Specific Opportunity Gaps

| Gap | Impact |
|-----|--------|
| **No wishlist in current CT app** | Customers have no way to save items for later outside of cart |
| **No barcode-to-wishlist in-store** | In-store discovery cannot bridge to digital purchase intent |
| **No gift sharing via mobile** | Major seasonal revenue (Christmas, birthdays) lacks a digital enabler |
| **Triangle data underutilized** | 16M members generate purchase data but not intent/aspiration data |
| **Cross-banner potential untapped** | A wishlist could span CT + SportChek + Mark's + Party City + PartSource in a unified experience |

---

## 3. Revenue Impact Model

### 3.1 Assumptions

| Parameter | Conservative | Moderate | Aggressive |
|-----------|-------------|----------|------------|
| Mobile MAU (baseline) | 3.0M | 4.0M | 5.0M |
| Wishlist adoption rate | 15% | 25% | 35% |
| Active wishlist users | 450K | 1.0M | 1.75M |
| Incremental conversion rate lift | +2.0% | +3.5% | +5.0% |
| Incremental AOV lift | +$8 | +$12 | +$18 |
| Avg. transactions/year (wishlist users) | 6 | 8 | 10 |
| Gift sharing adoption (% of wishlist users) | 20% | 30% | 40% |
| Avg. gift list value fulfilled | $120 | $150 | $200 |

### 3.2 Projected Incremental Revenue — Annual

#### A. Direct Wishlist-Driven Revenue (higher conversion + AOV)

| Scenario | Wishlist Users | Incremental Rev/User/Year | Total |
|----------|---------------|--------------------------|-------|
| **Conservative** | 450K | $48 | **$21.6M** |
| **Moderate** | 1.0M | $96 | **$96.0M** |
| **Aggressive** | 1.75M | $180 | **$315.0M** |

*Calculation: Users × (incremental AOV × transactions/year)*

#### B. Gift Sharing / Fulfillment Revenue

| Scenario | Sharers | Fulfillment Value | Total |
|----------|---------|-------------------|-------|
| **Conservative** | 90K | $120 | **$10.8M** |
| **Moderate** | 300K | $150 | **$45.0M** |
| **Aggressive** | 700K | $200 | **$140.0M** |

#### C. Abandonment Recovery (wishlist as cart alternative)

| Scenario | Recovered Transactions | Avg. Value | Total |
|----------|----------------------|------------|-------|
| **Conservative** | 150K | $55 | **$8.3M** |
| **Moderate** | 350K | $60 | **$21.0M** |
| **Aggressive** | 600K | $65 | **$39.0M** |

#### D. Re-engagement Revenue (price drop / back-in-stock alerts)

| Scenario | Triggered Purchases | Avg. Value | Total |
|----------|-------------------|------------|-------|
| **Conservative** | 200K | $50 | **$10.0M** |
| **Moderate** | 500K | $55 | **$27.5M** |
| **Aggressive** | 900K | $60 | **$54.0M** |

### 3.3 Total Incremental Revenue Summary

| Scenario | Direct | Gift | Recovery | Re-engage | **Total** |
|----------|--------|------|----------|-----------|-----------|
| **Conservative** | $21.6M | $10.8M | $8.3M | $10.0M | **$50.7M** |
| **Moderate** | $96.0M | $45.0M | $21.0M | $27.5M | **$189.5M** |
| **Aggressive** | $315.0M | $140.0M | $39.0M | $54.0M | **$548.0M** |

**Realistic target (moderate scenario): ~$190M incremental annual revenue**, representing a **~1.3% lift on total retail revenue**.

---

## 4. Revenue Uplift by Banner

Applying the moderate scenario proportionally to banner revenue and e-commerce penetration:

| Banner | Current Revenue | E-comm Penetration | Wishlist Uplift Est. | Notes |
|--------|----------------|-------------------|---------------------|-------|
| **Canadian Tire** | $9.8B | ~15% | **$112M** | Largest user base, broadest catalog, strongest barcode scan use case |
| **SportChek** | $2.2B | ~18% | **$36M** | Higher AOV, strong gift-giving category (sports equipment) |
| **Mark's** | $1.4B | ~12% | **$21M** | Workwear wishlists, seasonal apparel gifting |
| **Helly Hansen** | $1.0B | ~25% (DTC) | **$14M** | Premium outdoor gear — high wishlist affinity, global DTC |
| **Party City Canada** | $175M | ~8% | **$4M** | Celebration wishlists — birthday/holiday party planning, seasonal peak alignment |
| **PartSource** | $76M | ~5% (BOPIS) | **$2.5M** | Automotive parts wishlists — save parts for scheduled maintenance, share with mechanic |
| **Total** | **$14.65B** | | **$189.5M** | |

---

## 5. Strategic Benefits Beyond Revenue

### 5.1 Consumer Benefits

| Benefit | Description |
|---------|-------------|
| **Save for later** | Customers can bookmark items without committing to cart, reducing decision fatigue |
| **In-store to digital bridge** | Scan a shelf product, add to wishlist, purchase later online or at any location |
| **Gift coordination** | Share wishlists with family/friends — eliminates duplicate gifts, ensures recipients get what they want |
| **Price monitoring** | Get notified when wishlisted items go on sale — especially valuable for CT's frequent promotional cycles |
| **Cross-device continuity** | Start a wishlist on phone in-store, complete purchase on desktop at home |

### 5.2 CTC Business Benefits

| Benefit | Description |
|---------|-------------|
| **First-party intent data** | Wishlists reveal what customers *want* (not just what they buy) — a goldmine for merchandising, assortment planning, and ad targeting |
| **Triangle Rewards enrichment** | Wishlist data layered on 16M Triangle profiles creates the richest customer intent dataset in Canadian retail |
| **Seasonal revenue capture** | Christmas, Father's Day, Back-to-School — wishlists convert seasonal browsing into committed purchase pipelines |
| **Dealer-owner inventory signals** | Aggregated wishlist data at the store level tells dealers what to stock — reducing overstock and stockouts |
| **Reduced cart abandonment** | Wishlists give customers an alternative to abandoning carts entirely — keeping items in the CTC ecosystem |
| **Cross-banner discovery** | A unified wishlist across CT + SportChek + Mark's drives cross-banner traffic and basket expansion |
| **Competitive differentiation** | No Canadian general-merchandise competitor offers barcode-scan-to-wishlist — a first-mover advantage |

### 5.3 Data & Personalization Value

| Data Signal | Use Case |
|------------|----------|
| Products wishlisted but not purchased | Targeted promotions, price-sensitivity analysis |
| Wishlist category affinity | Personalized app home screen, email content |
| Seasonal wishlist spikes | Demand forecasting, inventory pre-positioning |
| Shared wishlist demographics | Gift-giver persona identification, cross-sell targeting |
| Barcode scan frequency by store | In-store merchandising effectiveness, planogram optimization |
| Wishlist-to-purchase conversion time | Purchase cycle analysis by category |

---

## 6. Implementation Investment

### 6.1 POC Phase (Current — Hackathon)

| Item | Cost |
|------|------|
| EPAM team (hackathon) | Included in engagement |
| Technology | React Native + Expo (open source) |
| Infrastructure | None (local mock data) |
| **Total POC cost** | **Minimal — hackathon scope** |

### 6.2 Traditional Production Build Estimate (CAD)

> **Rate card:** Onshore (Canada): DM $200 CAD/h, BA $160 CAD/h, SA $190 CAD/h. Offshore: All resources $72 CAD/h. All based on 160h/month.

| Role | HC | Shore | Rate (CAD/h) | Duration | Est. Cost (CAD) |
|------|-----|-------|-------------|----------|----------------|
| Delivery Manager | 1 | Onshore | $200 | 6–9 months | $192K–288K |
| Business Analyst | 1 | Onshore | $160 | 2–3 months | $51K–77K |
| Solution Architect | 1 | Onshore | $190 | 3–4 months | $91K–122K |
| Sr Backend Developer | 2 | Offshore | $72 | 5–6 months | $115K–138K |
| Sr Mobile Developer | 2 | Offshore | $72 | 5–6 months | $115K–138K |
| Functional Tester | 1 | Offshore | $72 | 3–4 months | $35K–46K |
| Automation Tester | 1 | Offshore | $72 | 3–4 months | $35K–46K |
| DevOps / SRE | 1 | Offshore | $72 | 2.5–3 months | $29K–35K |
| **Total** | **10 FTEs** | **3 on / 7 off** | | **6–9 months** | **$663K–890K CAD** |

### 6.3 EPAM EliteA Agentic AI SDLC Estimate (CAD)

EliteA is EPAM's proprietary agentic AI platform that orchestrates the full SDLC — from requirements to deployment — using specialized AI agents supervised by senior engineers. This approach delivers 3–5x velocity improvement over traditional development while maintaining enterprise-grade quality.

**Key assumptions:**
- 3–5x developer velocity via AI pair programming and code generation
- Senior EPAM engineers supervise all AI-generated output (human-in-the-loop)
- AI agents handle ~70% of boilerplate code, tests, and documentation
- Human engineers focus on architecture, integration, edge cases, and review
- Onshore rates (CAD/h): DM $200, BA $160, SA $190
- Offshore rates (CAD/h): All resources $72
- Team: 3 onshore (DM, BA, SA) + 2 offshore engineers + AI agent cluster
- Parallel workstreams: backend + mobile + QA run concurrently

| Role | HC | Shore | Rate (CAD/h) | Duration | Est. Cost (CAD) |
|------|-----|-------|-------------|----------|----------------|
| Delivery Manager | 1 | Onshore | $200 | 15 weeks | $120K |
| Business Analyst | 1 (PT) | Onshore | $160 | 4 weeks | $26K |
| Solution Architect | 1 | Onshore | $190 | 6 weeks | $46K |
| Sr Full-Stack Engineer | 1 | Offshore | $72 | 12 weeks | $35K |
| Sr Mobile Engineer | 1 | Offshore | $72 | 10 weeks | $29K |
| AI Agent Cluster (Dev) | 5–8 agents | AI | — | 4–6 weeks | $45K |
| AI Agent Cluster (QA) | 2–3 agents | AI | — | 2–3 weeks | $20K |
| Human QA Reviewer | 1 (PT) | Offshore | $72 | 5 weeks | $14K |
| DevOps (human + AI) | 0.5 + AI | Offshore | $72 | 3 weeks | $9K |
| **Total** | **5 humans + AI** | **3 on / 2 off** | | **8–15 weeks** | **$344K CAD** |

**Savings vs. traditional:** ~$320K–550K CAD cost reduction (48–61%) and 4+ months faster (~50% timeline reduction).

### 6.4 ROI Analysis (Moderate Scenario — EliteA Build, CAD)

| Metric | Value |
|--------|-------|
| Year 1 incremental revenue | $189.5M CAD |
| Assumed gross margin (blended) | ~35% |
| Year 1 incremental gross profit | ~$66.3M CAD |
| EliteA build investment | ~$344K CAD |
| **Payback period** | **< 1 day after launch** |
| **Year 1 ROI** | **~19,270%** |

---

## 7. Competitive Landscape

| Retailer | Wishlist Feature | Barcode Scan | Gift Sharing | Cross-Banner |
|----------|-----------------|-------------|-------------|-------------|
| **Canadian Tire (proposed)** | ✅ | ✅ | ✅ | ✅ |
| Amazon.ca | ✅ | ❌ | ✅ | N/A |
| Walmart Canada | ✅ (basic) | ❌ | ❌ | ❌ |
| Costco Canada | ❌ | ❌ | ❌ | N/A |
| Home Depot Canada | ✅ (basic) | ❌ | ❌ | N/A |
| Best Buy Canada | ✅ | ❌ | ✅ (limited) | N/A |

**CTC would be the only Canadian retailer combining wishlists + in-store barcode scanning + gift sharing + cross-banner support.**

---

## 8. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low wishlist adoption | Medium | High | Integrate into existing Triangle flows; incentivize with bonus CT Money for first wishlist |
| Barcode scanning accuracy in-store | Low | Medium | Fallback to manual search; extensive barcode database coverage |
| Privacy concerns (contact sharing) | Medium | Medium | Clear permissions UX; no contact data leaves device without consent |
| Cross-banner catalog complexity | Medium | Medium | Start with CT-only, expand to other banners in Phase 2 |
| Dealer-owner resistance to data sharing | Low | Low | Position as demand signal tool that helps dealers stock better |

---

## 9. Success Metrics (KPIs)

| KPI | Target (Year 1) |
|-----|-----------------|
| Wishlist adoption rate (% of MAU) | ≥ 20% |
| Avg. items per wishlist | ≥ 5 |
| Wishlist-to-purchase conversion | ≥ 15% |
| Gift sharing rate (% of wishlist users) | ≥ 25% |
| Gift fulfilment rate | ≥ 50% |
| Re-engagement open rate (price drop alerts) | ≥ 12% |
| Incremental AOV lift (wishlist users vs. control) | ≥ +$10 |
| NPS impact (wishlist users vs. non-users) | ≥ +5 points |

---

## 10. Recommendation

The Mobile Wishlist feature addresses a clear gap in CTC's digital experience. With 16M Triangle members, 10M+ app installs, and 500+ physical stores, CTC has the infrastructure to make wishlist + barcode scanning a category-defining feature in Canadian retail.

**We recommend proceeding from POC to production build**, targeting a pilot launch at 50 Canadian Tire locations within 6 months, with full rollout across all banners within 12 months.

The estimated **$190M in incremental annual revenue** against a **$344K EliteA build investment** represents one of the highest-ROI digital features available to CTC today.

---

*This document is a mock business plan prepared for the EPAM–CTC Hackathon POC. Revenue figures are based on publicly available CTC financial data (FY 2023–2024) and industry benchmarks. Actual results will vary based on implementation, adoption, and market conditions.*
