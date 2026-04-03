#!/usr/bin/env python3
"""Generate CTC Mobile Wishlist Business Case PowerPoint deck."""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

CT_RED = RGBColor(0xD5, 0x2B, 0x1E)
CT_DARK = RGBColor(0x33, 0x33, 0x33)
CT_GREY = RGBColor(0x66, 0x66, 0x66)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GREY = RGBColor(0xF5, 0xF5, 0xF5)
SUCCESS_GREEN = RGBColor(0x2E, 0x7D, 0x32)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
W = prs.slide_width
H = prs.slide_height

def add_bg(slide, color=WHITE):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_box(slide, left, top, width, height, fill_color):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    return shape

def add_text(slide, left, top, width, height, text, font_size=18, color=CT_DARK, bold=False, alignment=PP_ALIGN.LEFT):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.alignment = alignment
    return tf

def add_para(tf, text, font_size=18, color=CT_DARK, bold=False, alignment=PP_ALIGN.LEFT, space_before=Pt(6)):
    p = tf.add_paragraph()
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.alignment = alignment
    p.space_before = space_before
    return p

def slide_header(slide, title, subtitle=None):
    add_box(slide, Inches(0), Inches(0), W, Inches(1.1), CT_RED)
    add_text(slide, Inches(0.6), Inches(0.15), Inches(10), Inches(0.7), title, 32, WHITE, True)
    if subtitle:
        add_text(slide, Inches(0.6), Inches(0.65), Inches(10), Inches(0.4), subtitle, 16, RGBColor(0xFF,0xCC,0xCC))
    # Footer
    add_text(slide, Inches(0.6), Inches(7.0), Inches(5), Inches(0.4), "EPAM Systems | Confidential", 10, CT_GREY)
    add_text(slide, Inches(9), Inches(7.0), Inches(4), Inches(0.4), "CTC Mobile Wishlist — Business Case", 10, CT_GREY, alignment=PP_ALIGN.RIGHT)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 1: Title
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
add_box(s, Inches(0), Inches(0), W, Inches(3.2), CT_RED)
add_text(s, Inches(0.8), Inches(0.8), Inches(11), Inches(1.2), "CTC Mobile Wishlist", 48, WHITE, True)
add_text(s, Inches(0.8), Inches(2.0), Inches(11), Inches(0.8), "Scan. Save. Share. — Turning In-Store Browsing Into Revenue", 24, RGBColor(0xFF,0xCC,0xCC))
add_text(s, Inches(0.8), Inches(3.8), Inches(11), Inches(0.5), "Hackathon POC  |  Business Case & Implementation Plan", 20, CT_DARK, True)
tf = add_text(s, Inches(0.8), Inches(4.6), Inches(11), Inches(2.0), "Prepared by EPAM Systems for Canadian Tire Corporation", 16, CT_GREY)
add_para(tf, "April 2026", 16, CT_GREY)
add_para(tf, "", 12, CT_GREY)
add_para(tf, "Agentic AI SDLC powered by EPAM EliteA", 14, CT_RED, True)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 2: Agenda
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Agenda")
items = [
    ("01", "The Opportunity — What's missing in CTC's mobile experience"),
    ("02", "The Concept — Scan, Save, Share wishlist feature"),
    ("03", "CTC Revenue Landscape — Current state by banner"),
    ("04", "Revenue Uplift Model — $50M–$548M incremental opportunity"),
    ("05", "Strategic Benefits — Beyond revenue: data, loyalty, differentiation"),
    ("06", "Competitive Landscape — First-mover advantage in Canada"),
    ("07", "Implementation Plan — Agentic AI SDLC with EPAM EliteA"),
    ("08", "Investment & ROI — Cost, timeline, and payback"),
    ("09", "POC Demo — What we built at the hackathon"),
    ("10", "Recommendation & Next Steps"),
]
for i, (num, text) in enumerate(items):
    y = Inches(1.4) + Inches(i * 0.55)
    add_text(s, Inches(1.0), y, Inches(0.6), Inches(0.45), num, 20, CT_RED, True)
    add_text(s, Inches(1.7), y, Inches(9), Inches(0.45), text, 18, CT_DARK)

print("Slides 1-2 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 3: The Opportunity
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "The Opportunity", "What's missing in CTC's mobile experience")

add_text(s, Inches(0.8), Inches(1.4), Inches(5.5), Inches(0.5), "The Problem", 24, CT_RED, True)
gaps = [
    "No wishlist feature in the Canadian Tire mobile app",
    "No way to bridge in-store product discovery to digital intent",
    "No gift sharing / collaborative shopping functionality", 
    "16M Triangle members generate purchase data — but not intent data",
    "Cross-banner potential (CT + SportChek + Mark's) completely untapped",
]
tf = add_text(s, Inches(0.8), Inches(2.0), Inches(5.5), Inches(4.0), "", 16, CT_DARK)
for g in gaps:
    add_para(tf, f"    {g}", 16, CT_DARK, space_before=Pt(10))

add_text(s, Inches(7.0), Inches(1.4), Inches(5.5), Inches(0.5), "The Insight", 24, SUCCESS_GREEN, True)
insights = [
    "Wishlist users convert 25-40% better than non-users",
    "Wishlist users spend 15-25% more per transaction",
    "Price-drop alerts on wishlisted items get 5-8x higher CTR",
    "Gift wishlists see 60-70% fulfilment rates",
    "Wishlists recover 10-15% of would-be cart abandonments",
]
tf2 = add_text(s, Inches(7.0), Inches(2.0), Inches(5.5), Inches(4.0), "", 16, CT_DARK)
for ins in insights:
    add_para(tf2, f"    {ins}", 16, CT_DARK, space_before=Pt(10))

add_box(s, Inches(0.8), Inches(6.0), Inches(11.5), Inches(0.7), LIGHT_GREY)
add_text(s, Inches(1.0), Inches(6.1), Inches(11), Inches(0.5),
    "Canadian Tire has the infrastructure (16M loyalty members, 500+ stores, 10M+ app installs) — it just needs the feature.",
    14, CT_DARK, True, PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 4: The Concept
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "The Concept", "Scan. Save. Share.")

features = [
    ("SCAN", "Scan any barcode on\na store shelf with your\nphone camera to instantly\nidentify the product", "In-Store\nDiscovery"),
    ("SAVE", "Add products to named\nwishlists from browsing\nthe catalog or scanning\nbarcodes", "Wishlist\nManagement"),
    ("SHARE", "Share your wishlist with\nfamily & friends from\nyour phone contacts for\ngift coordination", "Social\nCommerce"),
    ("FULFILL", "Recipients browse your\nlist, claim items they'll\nbuy — no duplicate\ngifts", "Gift\nFulfillment"),
]

for i, (title, desc, label) in enumerate(features):
    x = Inches(0.6 + i * 3.15)
    # Card background
    add_box(s, x, Inches(1.5), Inches(2.9), Inches(4.8), LIGHT_GREY)
    # Number circle
    circle = add_box(s, x + Inches(1.05), Inches(1.7), Inches(0.8), Inches(0.8), CT_RED)
    add_text(s, x + Inches(1.05), Inches(1.75), Inches(0.8), Inches(0.8), str(i+1), 28, WHITE, True, PP_ALIGN.CENTER)
    # Title
    add_text(s, x + Inches(0.2), Inches(2.7), Inches(2.5), Inches(0.5), title, 22, CT_RED, True, PP_ALIGN.CENTER)
    # Description
    add_text(s, x + Inches(0.2), Inches(3.3), Inches(2.5), Inches(1.5), desc, 14, CT_GREY, alignment=PP_ALIGN.CENTER)
    # Bottom label
    add_box(s, x + Inches(0.4), Inches(5.2), Inches(2.1), Inches(0.8), CT_RED)
    add_text(s, x + Inches(0.4), Inches(5.25), Inches(2.1), Inches(0.8), label, 13, WHITE, True, PP_ALIGN.CENTER)

print("Slides 3-4 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 5: CTC Revenue Landscape
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "CTC Revenue Landscape", "FY 2024 Estimated — $17.3B consolidated")

# Left: Revenue by banner table
add_text(s, Inches(0.8), Inches(1.3), Inches(6), Inches(0.5), "Revenue by Banner", 20, CT_DARK, True)

headers = ["Banner", "Revenue", "Stores", "Avg. Transaction"]
col_x = [Inches(0.8), Inches(4.0), Inches(5.8), Inches(7.0)]
col_w = [Inches(3.2), Inches(1.8), Inches(1.2), Inches(2.0)]

# Header row
add_box(s, Inches(0.8), Inches(1.8), Inches(8.2), Inches(0.45), CT_RED)
for hdr, cx, cw in zip(headers, col_x, col_w):
    add_text(s, cx, Inches(1.82), cw, Inches(0.4), hdr, 13, WHITE, True)

rows = [
    ("Canadian Tire Retail", "$9.8B", "500+", "$45-65"),
    ("SportChek / Sports Experts", "$2.2B", "185", "$70-90"),
    ("Mark's / L'Equipeur", "$1.4B", "385", "$55-75"),
    ("Helly Hansen", "$1.0B", "65+", "N/A"),
    ("CT Financial Services", "$1.9B", "—", "—"),
]
for ri, (b, r, st, atv) in enumerate(rows):
    y = Inches(2.3 + ri * 0.42)
    bg_c = LIGHT_GREY if ri % 2 == 0 else WHITE
    add_box(s, Inches(0.8), y, Inches(8.2), Inches(0.42), bg_c)
    vals = [b, r, st, atv]
    for v, cx, cw in zip(vals, col_x, col_w):
        add_text(s, cx, y, cw, Inches(0.4), v, 12, CT_DARK)

# Right: Key metrics
add_text(s, Inches(9.5), Inches(1.3), Inches(3.5), Inches(0.5), "Digital & Loyalty", 20, CT_DARK, True)
metrics = [
    ("16M", "Triangle Rewards\nmembers"),
    ("65-70%", "Transaction\npenetration"),
    ("10M+", "App downloads\n(cumulative)"),
    ("$2.2B", "E-commerce\nrevenue"),
    ("14-16%", "Digital share\nof retail"),
]
for i, (val, label) in enumerate(metrics):
    y = Inches(1.9 + i * 1.0)
    add_text(s, Inches(9.5), y, Inches(1.3), Inches(0.5), val, 24, CT_RED, True)
    add_text(s, Inches(10.8), y, Inches(2.2), Inches(0.8), label, 12, CT_GREY)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 6: Revenue Uplift Model
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Revenue Uplift Model", "Four independent revenue channels — $50M to $548M annually")

channels = [
    ("Direct Wishlist Revenue", "Higher conversion + AOV\nfrom wishlist users", "$21.6M", "$96.0M", "$315.0M"),
    ("Gift Sharing / Fulfillment", "Shared wishlists drive\nfull-price gift purchases", "$10.8M", "$45.0M", "$140.0M"),
    ("Abandonment Recovery", "Wishlists catch items that\nwould otherwise be lost", "$8.3M", "$21.0M", "$39.0M"),
    ("Re-engagement Alerts", "Price-drop / back-in-stock\non wishlisted items", "$10.0M", "$27.5M", "$54.0M"),
]

# Column headers
add_box(s, Inches(0.6), Inches(1.3), Inches(12.0), Inches(0.5), CT_RED)
ch = [("Revenue Channel", 0.8, 3.0), ("Driver", 3.8, 2.5), ("Conservative", 6.5, 1.8), ("Moderate", 8.5, 1.8), ("Aggressive", 10.5, 1.8)]
for label, x, w in ch:
    add_text(s, Inches(x), Inches(1.32), Inches(w), Inches(0.45), label, 14, WHITE, True)

for ri, (name, driver, con, mod, agg) in enumerate(channels):
    y = Inches(1.9 + ri * 1.05)
    bg_c = LIGHT_GREY if ri % 2 == 0 else WHITE
    add_box(s, Inches(0.6), y, Inches(12.0), Inches(0.95), bg_c)
    add_text(s, Inches(0.8), y + Inches(0.1), Inches(3.0), Inches(0.8), name, 15, CT_DARK, True)
    add_text(s, Inches(3.8), y + Inches(0.1), Inches(2.5), Inches(0.8), driver, 11, CT_GREY)
    add_text(s, Inches(6.5), y + Inches(0.2), Inches(1.8), Inches(0.5), con, 16, CT_DARK, alignment=PP_ALIGN.CENTER)
    add_text(s, Inches(8.5), y + Inches(0.2), Inches(1.8), Inches(0.5), mod, 16, CT_RED, True, PP_ALIGN.CENTER)
    add_text(s, Inches(10.5), y + Inches(0.2), Inches(1.8), Inches(0.5), agg, 16, CT_DARK, alignment=PP_ALIGN.CENTER)

# Total row
ty = Inches(6.1)
add_box(s, Inches(0.6), ty, Inches(12.0), Inches(0.7), CT_DARK)
add_text(s, Inches(0.8), ty + Inches(0.1), Inches(3.0), Inches(0.5), "TOTAL", 16, WHITE, True)
add_text(s, Inches(6.5), ty + Inches(0.1), Inches(1.8), Inches(0.5), "$50.7M", 16, WHITE, True, PP_ALIGN.CENTER)
add_text(s, Inches(8.5), ty + Inches(0.1), Inches(1.8), Inches(0.5), "$189.5M", 18, RGBColor(0xFF,0xCC,0xCC), True, PP_ALIGN.CENTER)
add_text(s, Inches(10.5), ty + Inches(0.1), Inches(1.8), Inches(0.5), "$548.0M", 16, WHITE, True, PP_ALIGN.CENTER)

add_text(s, Inches(0.8), Inches(6.85), Inches(11), Inches(0.4),
    "Moderate scenario = ~1.3% lift on $14.5B retail revenue. Conservative assumptions: 25% adoption, $12 AOV lift, 8 transactions/year.",
    12, CT_GREY, alignment=PP_ALIGN.LEFT)

print("Slides 5-6 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 7: Revenue by Banner
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Revenue Uplift by Banner", "Moderate scenario — $189.5M distributed across CTC banners")

banners = [
    ("Canadian Tire", "$9.8B", "~15%", "$115M", "Largest user base, broadest catalog,\nstrongest barcode scan use case", 7.5),
    ("SportChek", "$2.2B", "~18%", "$38M", "Higher AOV, strong gift-giving\ncategory (sports equipment)", 4.2),
    ("Mark's", "$1.4B", "~12%", "$22M", "Workwear wishlists, seasonal\napparel gifting", 2.5),
    ("Helly Hansen", "$1.0B", "~25%", "$14.5M", "Premium outdoor gear, high wishlist\naffinity, global DTC", 1.8),
]

for i, (name, rev, ecom, uplift, notes, bar_w) in enumerate(banners):
    y = Inches(1.5 + i * 1.3)
    # Banner name and stats
    add_text(s, Inches(0.8), y, Inches(2.5), Inches(0.4), name, 18, CT_DARK, True)
    add_text(s, Inches(0.8), y + Inches(0.4), Inches(2.5), Inches(0.3), f"Revenue: {rev}  |  E-comm: {ecom}", 11, CT_GREY)
    # Bar
    add_box(s, Inches(3.5), y + Inches(0.1), Inches(bar_w * 0.85), Inches(0.5), CT_RED)
    add_text(s, Inches(3.5) + Inches(bar_w * 0.85) + Inches(0.15), y + Inches(0.1), Inches(1.5), Inches(0.5), uplift, 18, CT_RED, True)
    # Notes
    add_text(s, Inches(3.5), y + Inches(0.65), Inches(8), Inches(0.6), notes, 11, CT_GREY)

# Total
add_box(s, Inches(0.6), Inches(6.4), Inches(12.0), Inches(0.5), LIGHT_GREY)
add_text(s, Inches(0.8), Inches(6.42), Inches(4), Inches(0.45), "Total Moderate Uplift:", 16, CT_DARK, True)
add_text(s, Inches(5.0), Inches(6.42), Inches(3), Inches(0.45), "$189.5M / year", 16, CT_RED, True)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 8: Strategic Benefits
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Strategic Benefits Beyond Revenue")

add_text(s, Inches(0.8), Inches(1.3), Inches(5.5), Inches(0.5), "Consumer Benefits", 20, CT_RED, True)
consumer = [
    ("Save for Later", "Bookmark items without cart commitment"),
    ("In-Store to Digital Bridge", "Scan shelf products, buy later anywhere"),
    ("Gift Coordination", "Share lists, eliminate duplicate gifts"),
    ("Price Monitoring", "Alerts when wishlisted items go on sale"),
    ("Cross-Device Continuity", "Start on phone in-store, buy on desktop"),
]
for i, (title, desc) in enumerate(consumer):
    y = Inches(1.9 + i * 0.75)
    add_text(s, Inches(0.8), y, Inches(5.5), Inches(0.35), title, 14, CT_DARK, True)
    add_text(s, Inches(0.8), y + Inches(0.3), Inches(5.5), Inches(0.35), desc, 12, CT_GREY)

add_text(s, Inches(7.0), Inches(1.3), Inches(5.5), Inches(0.5), "CTC Business Benefits", 20, SUCCESS_GREEN, True)
business = [
    ("First-Party Intent Data", "What customers WANT — not just what they buy"),
    ("Triangle Enrichment", "Richest customer intent dataset in Canadian retail"),
    ("Seasonal Revenue Capture", "Convert holiday browsing into purchase pipelines"),
    ("Dealer Inventory Signals", "Aggregated wishlist data improves local stocking"),
    ("Cross-Banner Discovery", "Unified wishlists across CT + SportChek + Mark's"),
    ("Competitive Moat", "Only Canadian retailer with scan-to-wishlist + sharing"),
]
for i, (title, desc) in enumerate(business):
    y = Inches(1.9 + i * 0.75)
    add_text(s, Inches(7.0), y, Inches(5.5), Inches(0.35), title, 14, CT_DARK, True)
    add_text(s, Inches(7.0), y + Inches(0.3), Inches(5.5), Inches(0.35), desc, 12, CT_GREY)

print("Slides 7-8 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 9: Competitive Landscape
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Competitive Landscape", "CTC would be the only Canadian retailer with all four capabilities")

# Table
headers2 = ["Retailer", "Wishlist", "Barcode Scan", "Gift Sharing", "Cross-Banner"]
cx2 = [Inches(0.8), Inches(4.5), Inches(6.3), Inches(8.1), Inches(10.0)]
cw2 = [Inches(3.7), Inches(1.8), Inches(1.8), Inches(1.9), Inches(2.0)]

add_box(s, Inches(0.6), Inches(1.5), Inches(11.8), Inches(0.5), CT_DARK)
for h, cx, cw in zip(headers2, cx2, cw2):
    add_text(s, cx, Inches(1.52), cw, Inches(0.45), h, 14, WHITE, True)

comp_rows = [
    ("Canadian Tire (proposed)", "Yes", "Yes", "Yes", "Yes", True),
    ("Amazon.ca", "Yes", "No", "Yes", "N/A", False),
    ("Walmart Canada", "Basic", "No", "No", "No", False),
    ("Costco Canada", "No", "No", "No", "N/A", False),
    ("Home Depot Canada", "Basic", "No", "No", "N/A", False),
    ("Best Buy Canada", "Yes", "No", "Limited", "N/A", False),
]
for ri, (name, w, b, g, cb, highlight) in enumerate(comp_rows):
    y = Inches(2.1 + ri * 0.6)
    bg_c = RGBColor(0xFF, 0xEB, 0xEE) if highlight else (LIGHT_GREY if ri % 2 == 0 else WHITE)
    add_box(s, Inches(0.6), y, Inches(11.8), Inches(0.55), bg_c)
    n_color = CT_RED if highlight else CT_DARK
    add_text(s, Inches(0.8), y + Inches(0.05), Inches(3.7), Inches(0.45), name, 14, n_color, highlight)
    for val, cx, cw in zip([w, b, g, cb], cx2[1:], cw2[1:]):
        v_color = SUCCESS_GREEN if val == "Yes" else (CT_RED if val == "No" else CT_GREY)
        add_text(s, cx, y + Inches(0.05), cw, Inches(0.45), val, 14, v_color, val=="Yes", PP_ALIGN.CENTER)

add_box(s, Inches(0.8), Inches(5.9), Inches(11.0), Inches(0.7), LIGHT_GREY)
add_text(s, Inches(1.0), Inches(6.0), Inches(10.5), Inches(0.5),
    "No Canadian competitor combines all four capabilities. CTC has a clear first-mover advantage.",
    15, CT_DARK, True, PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 10: Agentic AI SDLC with EPAM EliteA
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Implementation Approach", "Fully Agentic AI SDLC powered by EPAM EliteA")

add_text(s, Inches(0.8), Inches(1.3), Inches(11), Inches(0.5),
    "EPAM EliteA: AI-Augmented Software Development at Scale", 20, CT_DARK, True)

tf = add_text(s, Inches(0.8), Inches(1.8), Inches(11), Inches(0.8),
    "EliteA is EPAM's proprietary agentic AI platform that orchestrates the full SDLC — from requirements to deployment — "
    "using specialized AI agents supervised by senior engineers. This approach delivers 3-5x velocity improvement over "
    "traditional development while maintaining enterprise-grade quality.", 14, CT_GREY)

phases = [
    ("Requirements\n& Architecture", "AI agents analyze\nbusiness requirements,\ngenerate architecture\ndocs, data schemas,\nand API contracts", "1-2 weeks"),
    ("Agentic\nDevelopment", "Coding agents generate\nfeatures in parallel.\nHuman engineers review,\nguide, and approve\nall output", "3-4 weeks"),
    ("AI-Assisted\nQA & Testing", "Test agents generate\nunit/integration/E2E\ntests. Coverage agents\nenforce 80%+ coverage\nthresholds", "1-2 weeks"),
    ("Integration\n& Hardening", "Integration with CTC\nbackend APIs, Triangle\nRewards, product catalog.\nSecurity & perf testing", "2-3 weeks"),
    ("Deployment\n& Launch", "CI/CD pipeline, staged\nrollout to 50 pilot\nstores, monitoring,\nA/B testing framework", "1-2 weeks"),
]

for i, (title, desc, duration) in enumerate(phases):
    x = Inches(0.4 + i * 2.5)
    add_box(s, x, Inches(3.0), Inches(2.3), Inches(3.5), LIGHT_GREY)
    # Phase number
    add_box(s, x + Inches(0.8), Inches(3.1), Inches(0.7), Inches(0.7), CT_RED)
    add_text(s, x + Inches(0.8), Inches(3.15), Inches(0.7), Inches(0.7), str(i+1), 22, WHITE, True, PP_ALIGN.CENTER)
    # Title
    add_text(s, x + Inches(0.1), Inches(3.9), Inches(2.1), Inches(0.7), title, 13, CT_DARK, True, PP_ALIGN.CENTER)
    # Description
    add_text(s, x + Inches(0.1), Inches(4.6), Inches(2.1), Inches(1.5), desc, 10, CT_GREY, alignment=PP_ALIGN.CENTER)
    # Duration badge
    add_box(s, x + Inches(0.5), Inches(6.1), Inches(1.3), Inches(0.35), CT_DARK)
    add_text(s, x + Inches(0.5), Inches(6.1), Inches(1.3), Inches(0.35), duration, 11, WHITE, True, PP_ALIGN.CENTER)

print("Slides 9-10 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 11: Investment & ROI
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Investment & ROI", "Agentic AI SDLC reduces cost by ~60% and timeline by ~50% vs. traditional")

# Left: Cost comparison
add_text(s, Inches(0.8), Inches(1.3), Inches(5.5), Inches(0.5), "Implementation Cost Comparison", 18, CT_DARK, True)

# Traditional
add_text(s, Inches(0.8), Inches(1.9), Inches(5.5), Inches(0.35), "Traditional SDLC", 14, CT_GREY, True)
trad_items = [
    ("Design & Architecture", "$200K-300K", "4-6 weeks"),
    ("Backend Development", "$500K-800K", "8-12 weeks"),
    ("Mobile Development", "$400K-600K", "8-12 weeks"),
    ("QA & Security", "$200K-300K", "4-6 weeks"),
    ("Launch & Monitoring", "$100K-150K", "2-4 weeks"),
]
for i, (phase, cost, dur) in enumerate(trad_items):
    y = Inches(2.3 + i * 0.38)
    add_text(s, Inches(0.8), y, Inches(2.5), Inches(0.35), phase, 11, CT_DARK)
    add_text(s, Inches(3.3), y, Inches(1.2), Inches(0.35), cost, 11, CT_GREY, alignment=PP_ALIGN.RIGHT)
    add_text(s, Inches(4.6), y, Inches(1.2), Inches(0.35), dur, 11, CT_GREY)

add_box(s, Inches(0.8), Inches(4.3), Inches(5.0), Inches(0.4), LIGHT_GREY)
add_text(s, Inches(0.8), Inches(4.32), Inches(2.5), Inches(0.35), "Traditional Total:", 13, CT_DARK, True)
add_text(s, Inches(3.3), Inches(4.32), Inches(1.2), Inches(0.35), "$1.4M-2.2M", 13, CT_DARK, True, PP_ALIGN.RIGHT)
add_text(s, Inches(4.6), Inches(4.32), Inches(1.2), Inches(0.35), "6-9 months", 13, CT_DARK, True)

# EliteA
add_text(s, Inches(0.8), Inches(5.0), Inches(5.5), Inches(0.35), "EPAM EliteA Agentic AI SDLC", 14, CT_RED, True)
elite_items = [
    ("AI Requirements + Architecture", "$60K-90K", "1-2 weeks"),
    ("Agentic Backend Dev", "$150K-250K", "3-4 weeks"),
    ("Agentic Mobile Dev", "$120K-200K", "3-4 weeks"),
    ("AI-Assisted QA", "$60K-100K", "1-2 weeks"),
    ("Launch & Monitoring", "$80K-120K", "1-2 weeks"),
]
for i, (phase, cost, dur) in enumerate(elite_items):
    y = Inches(5.4 + i * 0.32)
    add_text(s, Inches(0.8), y, Inches(2.5), Inches(0.3), phase, 11, CT_DARK)
    add_text(s, Inches(3.3), y, Inches(1.2), Inches(0.3), cost, 11, SUCCESS_GREEN, alignment=PP_ALIGN.RIGHT)
    add_text(s, Inches(4.6), y, Inches(1.2), Inches(0.3), dur, 11, SUCCESS_GREEN)

add_box(s, Inches(0.8), Inches(7.0) - Inches(0.4), Inches(5.0), Inches(0.4), CT_RED)
add_text(s, Inches(0.8), Inches(7.0) - Inches(0.38), Inches(2.5), Inches(0.35), "EliteA Total:", 13, WHITE, True)
add_text(s, Inches(3.3), Inches(7.0) - Inches(0.38), Inches(1.2), Inches(0.35), "$470K-760K", 13, WHITE, True, PP_ALIGN.RIGHT)
add_text(s, Inches(4.6), Inches(7.0) - Inches(0.38), Inches(1.2), Inches(0.35), "8-13 weeks", 13, WHITE, True)

# Right: ROI metrics
add_text(s, Inches(7.0), Inches(1.3), Inches(5.5), Inches(0.5), "ROI Analysis (Moderate Scenario)", 18, CT_DARK, True)

roi_metrics = [
    ("Year 1 Incremental Revenue", "$189.5M"),
    ("Blended Gross Margin", "~35%"),
    ("Year 1 Gross Profit", "$66.3M"),
    ("EliteA Build Investment", "$615K"),
    ("Payback Period", "< 1 week"),
    ("Year 1 ROI", "10,680%"),
]
for i, (label, val) in enumerate(roi_metrics):
    y = Inches(2.0 + i * 0.7)
    add_text(s, Inches(7.0), y, Inches(3.5), Inches(0.35), label, 14, CT_DARK)
    is_highlight = i >= 4
    add_text(s, Inches(10.5), y, Inches(2.3), Inches(0.4), val, 20 if is_highlight else 16,
        CT_RED if is_highlight else CT_DARK, is_highlight, PP_ALIGN.RIGHT)

# Savings callout
add_box(s, Inches(7.0), Inches(6.2), Inches(5.5), Inches(0.7), LIGHT_GREY)
tf = add_text(s, Inches(7.2), Inches(6.25), Inches(5.1), Inches(0.6),
    "EliteA saves ~$1M and 4+ months vs. traditional development", 14, CT_RED, True, PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 12: Assumptions
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Key Assumptions", "EliteA agentic AI SDLC cost and timeline estimates")

add_text(s, Inches(0.8), Inches(1.3), Inches(5.5), Inches(0.5), "EliteA Delivery Assumptions", 18, CT_RED, True)

assumptions_left = [
    "3-5x developer velocity via AI pair programming and code generation",
    "Senior EPAM engineers supervise all AI-generated output (human-in-the-loop)",
    "AI agents handle ~70% of boilerplate code, tests, and documentation",
    "Human engineers focus on architecture, integration, edge cases, and review",
    "Blended rate: $85-120/hr for EliteA teams (AI + human combined)",
    "Team composition: 2 senior engineers + AI agent cluster per workstream",
    "Parallel workstreams: backend + mobile + QA run concurrently, not sequentially",
    "CTC provides API access, design assets, and Triangle sandbox within 2 weeks",
]

tf = add_text(s, Inches(0.8), Inches(1.9), Inches(5.5), Inches(5.0), "", 12, CT_DARK)
for a in assumptions_left:
    add_para(tf, f"  {a}", 12, CT_DARK, space_before=Pt(8))

add_text(s, Inches(7.0), Inches(1.3), Inches(5.5), Inches(0.5), "Revenue Model Assumptions", 18, CT_RED, True)

assumptions_right = [
    "Mobile MAU baseline: 4M across all CTC banners",
    "Wishlist adoption: 25% of MAU (1M users) within Year 1",
    "Incremental AOV lift: +$12 per transaction for wishlist users",
    "Average 8 transactions/year for engaged wishlist users",
    "Gift sharing: 30% of wishlist users share at least one list",
    "Average fulfilled gift value: $150 per shared wishlist",
    "Abandonment recovery: 350K transactions saved at $60 avg",
    "Re-engagement CTR: 5-8x higher than generic promotional pushes",
    "Blended gross margin: 35% (mix of owned brands + national brands)",
    "No cannibalization assumed — wishlist drives net-new purchases",
]

tf2 = add_text(s, Inches(7.0), Inches(1.9), Inches(5.5), Inches(5.0), "", 12, CT_DARK)
for a in assumptions_right:
    add_para(tf2, f"  {a}", 12, CT_DARK, space_before=Pt(8))

print("Slides 11-12 done")

# ═══════════════════════════════════════════════════════════════════
# SLIDE 13: POC Demo
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "POC Demonstration", "Built in <48 hours at the EPAM-CTC Hackathon using agentic AI")

add_text(s, Inches(0.8), Inches(1.3), Inches(11), Inches(0.5),
    "What We Built", 20, CT_DARK, True)
tf = add_text(s, Inches(0.8), Inches(1.8), Inches(11), Inches(0.5),
    "A fully functional React Native + Expo mobile app demonstrating the complete wishlist journey — built entirely with EPAM EliteA's agentic AI workflow.", 14, CT_GREY)

screens = [
    ("Home", "Personalized landing\nwith quick access to\nwishlists and recent\nscanned items"),
    ("Catalog", "Browsable product grid\nwith category filters\nand real-time search"),
    ("Barcode\nScanner", "Camera-based barcode\nscanning with instant\nproduct identification"),
    ("Wishlist\nManager", "Create, name, and\nmanage multiple\nwishlists with items"),
    ("Share &\nFulfill", "Share with contacts,\nrecipients claim items\nthey'll purchase"),
]

for i, (title, desc) in enumerate(screens):
    x = Inches(0.5 + i * 2.5)
    # Phone mockup shape
    add_box(s, x, Inches(2.6), Inches(2.2), Inches(3.8), LIGHT_GREY)
    add_box(s, x + Inches(0.1), Inches(2.7), Inches(2.0), Inches(0.4), CT_RED)
    add_text(s, x + Inches(0.1), Inches(2.72), Inches(2.0), Inches(0.4), title, 13, WHITE, True, PP_ALIGN.CENTER)
    add_text(s, x + Inches(0.15), Inches(3.3), Inches(1.9), Inches(2.5), desc, 11, CT_GREY, alignment=PP_ALIGN.CENTER)

add_box(s, Inches(0.8), Inches(6.5), Inches(11.5), Inches(0.4), LIGHT_GREY)
add_text(s, Inches(1.0), Inches(6.5), Inches(11), Inches(0.4),
    "Tech: React Native + Expo  |  TypeScript  |  Local mock data  |  iOS + Android  |  Built with EPAM EliteA agentic AI",
    12, CT_GREY, False, PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 14: KPIs
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Success Metrics", "Year 1 KPIs for the fully realized feature")

kpis = [
    ("Wishlist Adoption", ">=20%", "of mobile MAU", "Core adoption target"),
    ("Avg Items/Wishlist", ">=5", "items", "Engagement depth"),
    ("Wishlist-to-Purchase", ">=15%", "conversion rate", "Revenue validation"),
    ("Gift Sharing Rate", ">=25%", "of wishlist users", "Social commerce uptake"),
    ("Gift Fulfilment", ">=50%", "of shared items", "Collaborative shopping proof"),
    ("Re-engagement CTR", ">=12%", "open rate on alerts", "Price-drop notification effectiveness"),
    ("AOV Lift", "+$10", "vs. non-wishlist users", "Incremental spend proof"),
    ("NPS Impact", "+5 pts", "vs. non-wishlist users", "Customer satisfaction"),
]

for i, (name, target, unit, why) in enumerate(kpis):
    col = 0 if i < 4 else 1
    row = i if i < 4 else i - 4
    x = Inches(0.8 + col * 6.2)
    y = Inches(1.5 + row * 1.35)
    add_box(s, x, y, Inches(5.8), Inches(1.2), LIGHT_GREY)
    add_text(s, x + Inches(0.2), y + Inches(0.1), Inches(3.0), Inches(0.4), name, 15, CT_DARK, True)
    add_text(s, x + Inches(3.5), y + Inches(0.05), Inches(2.0), Inches(0.5), target, 24, CT_RED, True, PP_ALIGN.RIGHT)
    add_text(s, x + Inches(3.5), y + Inches(0.55), Inches(2.0), Inches(0.3), unit, 11, CT_GREY, alignment=PP_ALIGN.RIGHT)
    add_text(s, x + Inches(0.2), y + Inches(0.55), Inches(3.0), Inches(0.6), why, 11, CT_GREY)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 15: Recommendation
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
slide_header(s, "Recommendation & Next Steps")

add_box(s, Inches(0.8), Inches(1.4), Inches(11.5), Inches(1.2), LIGHT_GREY)
add_text(s, Inches(1.0), Inches(1.5), Inches(11), Inches(1.0),
    "We recommend proceeding from POC to production build using EPAM EliteA, "
    "targeting pilot launch at 50 Canadian Tire locations within 13 weeks, "
    "with full rollout across all banners within 6 months.",
    16, CT_DARK, True, PP_ALIGN.CENTER)

add_text(s, Inches(0.8), Inches(2.9), Inches(11), Inches(0.5), "Next Steps", 22, CT_RED, True)

steps = [
    ("1", "Approve POC findings", "Stakeholder alignment on business case and revenue model", "Week 1"),
    ("2", "Stand up EliteA team", "2 senior engineers + AI agent cluster, CTC API sandbox access", "Week 2"),
    ("3", "Architecture & integration design", "API contracts with CTC backend, Triangle Rewards, product catalog", "Weeks 2-3"),
    ("4", "Agentic development sprint", "Parallel build: backend APIs + mobile app + test suites", "Weeks 3-8"),
    ("5", "Integration & hardening", "CTC backend integration, security audit, performance testing", "Weeks 8-11"),
    ("6", "Pilot launch (50 stores)", "Staged rollout with A/B testing, real-time monitoring", "Weeks 11-13"),
]

for i, (num, title, desc, timeline) in enumerate(steps):
    y = Inches(3.5 + i * 0.6)
    add_box(s, Inches(0.8), y, Inches(0.5), Inches(0.5), CT_RED)
    add_text(s, Inches(0.8), y + Inches(0.02), Inches(0.5), Inches(0.5), num, 16, WHITE, True, PP_ALIGN.CENTER)
    add_text(s, Inches(1.5), y + Inches(0.02), Inches(3.5), Inches(0.45), title, 14, CT_DARK, True)
    add_text(s, Inches(5.0), y + Inches(0.02), Inches(5.0), Inches(0.45), desc, 12, CT_GREY)
    add_text(s, Inches(10.5), y + Inches(0.02), Inches(2.0), Inches(0.45), timeline, 12, CT_RED, True, PP_ALIGN.RIGHT)

# Big numbers at bottom
add_box(s, Inches(0.8), Inches(6.7) - Inches(0.2), Inches(11.5), Inches(0.8), CT_DARK)
stats = [
    ("$189.5M", "revenue uplift/yr"),
    ("$615K", "EliteA investment"),
    ("13 weeks", "to pilot launch"),
    ("10,680%", "Year 1 ROI"),
]
for i, (val, label) in enumerate(stats):
    x = Inches(1.2 + i * 2.9)
    add_text(s, x, Inches(6.55), Inches(2.5), Inches(0.4), val, 20, WHITE, True, PP_ALIGN.CENTER)
    add_text(s, x, Inches(6.9), Inches(2.5), Inches(0.3), label, 11, RGBColor(0xCC,0xCC,0xCC), alignment=PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# SLIDE 16: Thank You
# ═══════════════════════════════════════════════════════════════════
s = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(s, WHITE)
add_box(s, Inches(0), Inches(0), W, Inches(3.5), CT_RED)
add_text(s, Inches(0.8), Inches(1.0), Inches(11), Inches(1.2), "Thank You", 52, WHITE, True, PP_ALIGN.CENTER)
add_text(s, Inches(0.8), Inches(2.3), Inches(11), Inches(0.6),
    "Scan. Save. Share. — Let's build the future of Canadian Tire shopping together.",
    20, RGBColor(0xFF,0xCC,0xCC), alignment=PP_ALIGN.CENTER)

add_text(s, Inches(0.8), Inches(4.5), Inches(11), Inches(0.5),
    "EPAM Systems  |  Hackathon POC Team", 18, CT_DARK, True, PP_ALIGN.CENTER)
add_text(s, Inches(0.8), Inches(5.2), Inches(11), Inches(0.5),
    "Powered by EPAM EliteA — Agentic AI Software Development", 16, CT_RED, False, PP_ALIGN.CENTER)
add_text(s, Inches(0.8), Inches(6.0), Inches(11), Inches(0.5),
    "Questions?", 24, CT_GREY, True, PP_ALIGN.CENTER)

# ═══════════════════════════════════════════════════════════════════
# Save
# ═══════════════════════════════════════════════════════════════════
out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "CTC_Mobile_Wishlist_Business_Case.pptx")
prs.save(out_path)
print(f"\nSaved: {out_path}")
print(f"Slides: {len(prs.slides)}")
