import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
import WarehouseParticleCanvas from "../components/WarehouseParticleCanvas";
import LlmLogos from "../components/LlmLogos";
import FinalCtaParticleCanvas from "../components/FinalCtaParticleCanvas";
import {
    Zap,
    ShieldCheck,
    MessageSquare,
    Menu,
    X,
    Package,
    Truck,
    Warehouse,
    ShoppingCart,
    ChartColumn,
    Globe,
    Boxes,
    Settings,
    Code,
    FileText,
    Terminal,
    RefreshCw,
    Upload,
    Layers,
    GitBranch,
    Share2,
    ArrowRight,
    ArrowUpRight,
    Calendar,
    CreditCard,
    Search,
    Sparkles,
    TrendingUp,
    Rocket,
    Check
} from "lucide-react";
import HeroVisual from "../components/HeroVisual";
import "./LandingPage.css";

/**
 * Set this to your main platform URL for CTA buttons.
 * For example: "https://app.orbitplatform.com"
 */
const PLATFORM_URL = "#";

const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};



const iconList = [
    Package, Truck, Warehouse, ShieldCheck, ShoppingCart,
    ChartColumn, Globe, Boxes, Settings, Zap,
    Code, FileText, Terminal, RefreshCw, Upload,
    Layers, GitBranch, MessageSquare, Share2, ArrowRight,
    Package, Truck, Warehouse, ShieldCheck,
];

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [iconsVisible, setIconsVisible] = useState(false);
    const [supplierHovered, setSupplierHovered] = useState(false);
    const [warehouseHovered, setWarehouseHovered] = useState(false);
    const iconsRef = useRef<HTMLDivElement>(null);

    // Paint Worklet Registration
    useEffect(() => {
        if ("paintWorklet" in CSS) {
            // @ts-ignore
            (CSS as any).paintWorklet.addModule(
                "https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js"
            );
        }
    }, []);

    // Mouse Interaction for particle sections
    useEffect(() => {
        const sections = [
            document.getElementById("hero"),
            document.getElementById("final-cta-card"),
        ].filter(Boolean) as HTMLElement[];

        if (sections.length === 0) return;

        const stateMap = new Map<HTMLElement, boolean>();
        sections.forEach((el) => stateMap.set(el, false));

        const handlePointerMove = (el: HTMLElement) => (e: PointerEvent) => {
            if (!stateMap.get(el)) {
                el.classList.add("interactive");
                stateMap.set(el, true);
            }
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            el.style.setProperty("--ring-x", `${x}`);
            el.style.setProperty("--ring-y", `${y}`);
            el.style.setProperty("--ring-interactive", "1");
        };

        const handlePointerLeave = (el: HTMLElement) => () => {
            el.classList.remove("interactive");
            stateMap.set(el, false);
            el.style.setProperty("--ring-x", "50");
            el.style.setProperty("--ring-y", "50");
            el.style.setProperty("--ring-interactive", "0");
        };

        const cleanups: (() => void)[] = [];
        sections.forEach((el) => {
            const move = handlePointerMove(el);
            const leave = handlePointerLeave(el);
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
            });
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    // Intersection observer to slide-in icons
    useEffect(() => {
        const el = iconsRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIconsVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);



    return (
        <div className="landing-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        {/* <span className="lp-logo-icon">O</span> */}
                        <span className="lp-logo-text">Orbit</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="lp-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen(!menuOpen)}
                    />
                    <label className="lp-menu-btn" htmlFor="lp-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle Menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            <li><a href="#functions">Solution</a></li>
                            <li><a href="#why">Platform</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#proof">Testimonials</a></li>
                            <li><a href="/product">How It Works</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => goTo("/auth")}
                        >
                            Get Started
                        </button>
                    </div>
                </header>
            </div>

            {/* ── Hero ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting">
                        One platform. Six functions. US launch in 14 days.
                    </div>
                    <h2 className="lp-hero-title">
                        You bring the brand.<br />
                        <span>We bring the operations.</span>
                    </h2>
                    <p className="lp-hero-subtitle">
                        Orbit helps international brands enter the US market by handling compliance, e-commerce, logistics, warehousing, and marketing in one place.
                    </p>

                    <div className="lp-hero-cta">
                        <a href="#product" className="lp-btn-link" style={{ fontWeight: 600, color: 'var(--lp-on-surface)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            Explore Platform <ArrowRight size={16} />
                        </a>
                        <button
                            className="lp-btn lp-btn-accent"
                            onClick={() => goTo("/auth")}
                        >
                            Launch on Orbit <Calendar size={16} style={{ marginBottom: '-1px' }} />
                        </button>
                    </div>
                </div>

                <div className="lp-hero-visual-wrapper">
                    <HeroVisual />
                </div>
            </section>














            {/* ── Problem Section ── */}
            <section className="lp-problem-section" id="problem">
                <div className="lp-problem-header">
                    <div className="lp-problem-header-left">
                        <div className="lp-section-tag">
                            <span className="lp-problem-blinker"></span>
                            01 / PROBLEM
                        </div>
                        <h2>Three ways founders burn time entering the US</h2>
                    </div>
                    <div className="lp-problem-header-right">
                        <p>International brands doing $500K–5M at home are stuck choosing between broken options. Every path costs months of founder attention and still doesn't guarantee US market traction.</p>
                    </div>
                </div>

                <div className="lp-problem-bento">
                    {/* Item 1 */}
                    <div className="lp-problem-bento-item lp-problem-span-2">
                        <div className="lp-problem-bento-header-wrap">
                            <div className="lp-problem-bento-header">
                                <span className="lp-problem-bento-num">001</span>
                                <h3 className="lp-problem-bento-title">Scattered Consultants</h3>
                            </div>
                            <div className="lp-problem-bento-subtitle">"Six vendors, zero coordination"</div>
                        </div>
                        <div className="lp-problem-bento-content-wrap">
                            <p className="lp-problem-desc">You hire a compliance firm, a 3PL, a marketing agency, and an Amazon specialist — and then spend all your time on coordination calls that none of them attend together. The cost of misalignment falls on you.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> No single point of accountability</li>
                                <li><span className="lp-issue-dash">—</span> Optimised individually, not for your outcome</li>
                                <li><span className="lp-issue-dash">—</span> 4–6 months to get everything aligned</li>
                            </ul>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="lp-problem-bento-item">
                        <div className="lp-problem-bento-header-wrap">
                            <div className="lp-problem-bento-header">
                                <span className="lp-problem-bento-num">002</span>
                                <h3 className="lp-problem-bento-title">Full DIY</h3>
                            </div>
                            <div className="lp-problem-bento-subtitle">"I'll figure it out myself"</div>
                        </div>
                        <div className="lp-problem-bento-content-wrap">
                            <p className="lp-problem-desc">FDA filings, tariff codes, warehouse contracts, Amazon PPC — you're doing six jobs none of which is building your brand. Compliance errors are costly.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> Founders burn out on logistics</li>
                                <li><span className="lp-issue-dash">—</span> Compliance mistakes cost $50K+</li>
                                <li><span className="lp-issue-dash">—</span> No leverage — every task is manual</li>
                            </ul>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="lp-problem-bento-item">
                        <div className="lp-problem-bento-header-wrap">
                            <div className="lp-problem-bento-header">
                                <span className="lp-problem-bento-num">003</span>
                                <h3 className="lp-problem-bento-title">Single-Function Providers</h3>
                            </div>
                            <div className="lp-problem-bento-subtitle">"Great at one thing, blind to the rest"</div>
                        </div>
                        <div className="lp-problem-bento-content-wrap">
                            <p className="lp-problem-desc">You find a best-in-class 3PL and a great compliance partner — then discover they've never worked together. You've reduced vendor count but not the coordination problem.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> Handoff gaps fall through the cracks</li>
                                <li><span className="lp-issue-dash">—</span> Difficult to pivot when one part breaks</li>
                                <li><span className="lp-issue-dash">—</span> Still running 4 projects instead of 6</li>
                            </ul>
                        </div>
                    </div>
                </div>


            </section>

            {/* ── Functions Bento ── */}
            <section className="lp-functions-section" id="functions">
                <div className="lp-functions-header">
                    <div>
                        <div className="lp-section-tag">02 / WHAT WE HANDLE</div>
                        <h2>Six functions.<br />One contract.</h2>
                    </div>
                    <div className="lp-functions-header-right">
                        <p>One team. One contract. Your brand launched in the US.</p>
                    </div>
                </div>

                <div className="lp-fn-bento">
                    <div className="lp-fn-tile lp-fn-intelligence">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">01</span>
                                <span className="lp-fn-category">Core</span>
                            </div>
                            <div className="lp-fn-title">Market Intelligence</div>
                            <div className="lp-fn-desc-short">AI-powered trend mapping & competitive analysis.</div>
                            <div className="lp-fn-desc-full">AI-powered competitive analysis, US consumer trend mapping, and category positioning research. You arrive in the US market already knowing where to play and who's buying — not guessing after the fact.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">AI</div>
                            <div className="lp-fn-large-stat-label">Powered analysis</div>
                            <div className="lp-fn-footer">
                                <span className="lp-fn-footer-label">Delivered pre-launch</span>
                                <span className="lp-fn-footer-status">Running</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-compliance">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">02</span>
                            </div>
                            <div className="lp-fn-title">Compliance</div>
                            <div className="lp-fn-desc-short">FDA, FCC, CPSC — every requirement filed.</div>
                            <div className="lp-fn-desc-full">FDA, FCC, CPSC — every requirement for your product category, flagged and filed before you ship a unit. No customs holds.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">100%</div>
                            <div className="lp-fn-large-stat-label">AI clearance rate</div>
                            <div className="lp-fn-footer">
                                <span className="lp-fn-footer-label">All categories</span>
                                <span className="lp-fn-footer-status">100% rate</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-logistics">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">03</span>
                            </div>
                            <div className="lp-fn-title">Logistics</div>
                            <div className="lp-fn-desc-short">Inbound freight & last-mile.</div>
                            <div className="lp-fn-desc-full">Inbound freight, customs brokerage, and last-mile — fully coordinated. Your product arrives on time, every time.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">24/7</div>
                            <div className="lp-fn-large-stat-label">AI-routed freight</div>
                            <div className="lp-fn-footer">
                                <span className="lp-fn-footer-label">Door to warehouse</span>
                                <span className="lp-fn-footer-status">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-warehousing">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">04</span>
                            </div>
                            <div className="lp-fn-title">Warehousing &amp; Fulfilment</div>
                            <div className="lp-fn-desc-short">Flexible US warehouse scale without minimums.</div>
                            <div className="lp-fn-desc-full">Flexible US warehouse infrastructure. No long-term contracts, no volume minimums. Scale as your US sales grow — not based on a forecast you made before you launched.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">0</div>
                            <div className="lp-fn-large-stat-label">Minimums via AI allocation</div>
                            <div className="lp-fn-footer mt-auto">
                                <span className="lp-fn-footer-label">No minimums · Flexible terms</span>
                                <span className="lp-fn-footer-status">US-based</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-ecommerce">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">05</span>
                                <span className="lp-fn-category">Revenue</span>
                            </div>
                            <div className="lp-fn-title">E-commerce Setup</div>
                            <div className="lp-fn-desc-short">Amazon, Shopify, and DTC storefront built for US.</div>
                            <div className="lp-fn-desc-full">Amazon marketplace, Shopify storefront, and DTC channel — built and optimised for US buyers. Listings, A+ content, conversion architecture, and launch campaigns ready before day one.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">Day 1</div>
                            <div className="lp-fn-large-stat-label">AI optimized listings</div>
                            <div className="lp-fn-footer">
                                <span className="lp-fn-footer-label">Amazon · Shopify · DTC</span>
                                <span className="lp-fn-footer-status">Ready day 1</span>
                            </div>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-marketing">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">06</span>
                            </div>
                            <div className="lp-fn-title">Marketing</div>
                            <div className="lp-fn-desc-short">Performance & brand marketing for the US.</div>
                            <div className="lp-fn-desc-full">Performance campaigns and brand positioning calibrated to US consumers — not a translated version of what worked at home.</div>
                        </div>
                        <div>
                            <div className="lp-fn-large-stat">ROI</div>
                            <div className="lp-fn-large-stat-label">AI performance scaling</div>
                            <div className="lp-fn-footer">
                                <span className="lp-fn-footer-label">Performance + Brand</span>
                                <span className="lp-fn-footer-status">Scaling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Process Section ── */}
            <section className="lp-process-section" id="process">
                <div className="lp-process-inner">
                    <div>
                        <div className="lp-section-tag">03 / PROCESS</div>
                        <h2 className="lp-process-h2">From first call<br />to first US sale.</h2>
                    </div>
                    <div className="lp-process-track">
                        <div className="lp-process-step">
                            <div className="lp-step-num-display">01</div>
                            <div className="lp-process-step-tag">INTAKE</div>
                            <h4>Tell Us About Your Brand</h4>
                            <p>One intake session. We learn your product, your home market position, your target US customer, and your timeline. No lengthy questionnaires — 90 minutes and we have what we need.</p>
                            <div className="lp-process-step-footer">
                                <span className="lp-process-step-time">Day 0 → Day 1</span>
                            </div>
                        </div>
                        <div className="lp-process-step">
                            <div className="lp-step-num-display">02</div>
                            <div className="lp-process-step-tag">PLANNING</div>
                            <h4>We Build Your US Launch Plan</h4>
                            <p>Within 48 hours: a compliance checklist for your product, logistics routing, warehousing setup, and a 90-day e-commerce and marketing roadmap. Reviewed together before we execute.</p>
                            <div className="lp-process-step-footer">
                                <span className="lp-process-step-time">Day 1 → Day 3</span>
                            </div>
                        </div>
                        <div className="lp-process-step">
                            <div className="lp-step-num-display">03</div>
                            <div className="lp-process-step-tag">LAUNCH</div>
                            <h4>Your Brand is Live in the US</h4>
                            <p>Your product is compliant, warehoused in the US, listed on the right channels, and backed by a live marketing programme. You brief us on the brand. We run the operations.</p>
                            <div className="lp-process-step-footer">
                                <span className="lp-process-step-time">Day 3 → Day 14</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NEW 04 / WHY ORBIT (Formerly Product) ── */}
            <section className="lp-product" id="why">
                <div
                    className={`lp-icons ${iconsVisible ? "lp-icons-animate" : ""}`}
                    ref={iconsRef}
                >
                    {iconList.map((Icon, i) => (
                        <div
                            className="lp-icon-bubble"
                            key={i}
                            style={{ "--i": i } as React.CSSProperties}
                        >
                            <Icon size={28} strokeWidth={1.5} />
                        </div>
                    ))}
                </div>
                <div className="lp-product-intro">
                    <div className="lp-product-content">
                        <div className="lp-product-text">
                            {/* <div className="lp-section-tag">04 / WHY ORBIT</div> */}
                            <h2>
                                Not another app you need to manage.<br />
                                <span className="lp-text-gradient">A team that runs your US business.</span>
                            </h2>
                            <div className="lp-product-copy">
                                <p>
                                    Every part of your US operation — inventory, compliance, orders, logistics — runs in sync. You see the status. We handle the execution.
                                </p>
                            </div>
                            <a href="/product" className="lp-product-tech-link">See how it works technically →</a>
                        </div>
                        <div className="lp-product-image">
                            {/* Dashboard Screenshot */}
                            <img
                                src="/assets/dashboard_mockup.png"
                                alt="Orbit Dashboard Interface showing SKU performance and stock analytics"
                                className="lp-dashboard-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Two-Column CTA (For Brands/Warehouses) ── */}
            <section className="lp-who" id="who">
                <div
                    className="lp-who-card lp-who-card--suppliers"
                    onMouseEnter={() => setSupplierHovered(true)}
                    onMouseLeave={() => setSupplierHovered(false)}
                >
                    <SupplierParticleCanvas hovered={supplierHovered} />
                    <h3>
                        For brands
                        <span>Manage brand operations</span>
                    </h3>

                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/auth")}
                    >
                        Get Started
                    </button>
                </div>
                <div
                    className="lp-who-card lp-who-card--warehouse"
                    onMouseEnter={() => setWarehouseHovered(true)}
                    onMouseLeave={() => setWarehouseHovered(false)}
                >
                    <WarehouseParticleCanvas hovered={warehouseHovered} />
                    <h3>
                        For warehouses
                        <span>Power your facility</span>
                    </h3>

                    <button
                        className="lp-btn lp-btn-secondary"
                        onClick={() => goTo("/warehouse/login")}
                    >
                        Warehouse Login
                    </button>
                </div>
            </section>

            {/* ── Proof / Testimonials (05 / RESULTS) ── */}
            <section className="lp-proof-section" id="proof">
                <div className="lp-proof-inner">
                    <div className="lp-testimonial-header-split">
                        <div className="lp-testimonial-header-left">
                            <div className="lp-tag-testimonial">
                                <ArrowUpRight size={14} strokeWidth={2.5} /> Testimonials
                            </div>
                            <h2 className="lp-testimonial-hero-quote">
                                “Orbit has been, simply, transformative for us”
                            </h2>
                        </div>
                        <div className="lp-testimonial-header-right">
                            <p className="lp-testimonial-subtext">
                                —says the Co-Founder of Bayangrom, one of India's fastest growing apparel brand
                            </p>
                            <div className="lp-testimonial-actions">
                                <button className="lp-btn lp-btn-primary lp-btn-consult">
                                    Book A Consult <Calendar size={14} style={{ marginBottom: '-1px' }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lp-testimonials-grid">
                        <div className="lp-testimonial">
                            <div className="lp-testimonial-quote">&ldquo;</div>
                            <p className="lp-testimonial-text">We'd been trying to crack the US market for eighteen months. We had a great product, a team that believed in it, and no idea how to navigate FDA requirements at the same time as an Amazon launch. Orbit had us live in twelve days. I still don't fully understand how they moved that fast.</p>
                            <div className="lp-testimonial-byline">
                                <span className="lp-byline-name">Ji-Hoon K.</span>
                                <span className="lp-byline-role">Founder, Premium Skincare Brand — Seoul, Korea</span>
                                <span className="lp-byline-metric">→ $82K US revenue, month one</span>
                            </div>
                        </div>
                        <div className="lp-testimonial lp-testimonial-compact">
                            <div className="lp-testimonial-quote">&ldquo;</div>
                            <p className="lp-testimonial-text">We went from zero US presence to $40K in revenue in our first month. I didn't have to think about warehousing or Amazon once.</p>
                            <div className="lp-testimonial-byline">
                                <span className="lp-byline-name">Priya M.</span>
                                <span className="lp-byline-role">CEO, Home Goods Brand — Bangalore, India</span>
                                <span className="lp-byline-metric">→ $40K US revenue, month one</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Section (06 / PRICING) ── */}
            <section className="lp-pricing-section" id="pricing">
                <div className="lp-pricing-header">
                    {/* <div className="lp-section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>06 / PRICING</div> */}
                    <h2>Pricing and plans</h2>
                    {/* <p className="lp-pricing-sub">Local Businesses or Enterprises, A Plan for All</p> */}
                </div>

                <LlmLogos />

                <div className="lp-pricing-features">
                    <div className="lp-feature-pill"><Calendar size={14} className="lp-pricing-feat-icon" /> No Long Term Contracts</div>
                    <div className="lp-feature-pill"><CreditCard size={14} className="lp-pricing-feat-icon" /> Cancel Anytime</div>
                    <div className="lp-feature-pill"><Search size={14} className="lp-pricing-feat-icon" /> 100% Transparency</div>
                </div>

                {/* ── Pricing Tiers Grid ── */}
                <div className="lp-pricing-roi-banner" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--lp-on-surface-variant)' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 1.2rem', background: 'var(--lp-surface-variant)', borderRadius: '999px' }}>
                        <strong>ROI:</strong> A typical client saves ~$93,000 annually by consolidating agencies and hires.
                    </span>
                </div>

                <div className="lp-pricing-grid">
                    {/* Launch Tier */}
                    <div className="lp-pricing-card">
                        <div className="lp-pricing-card-top">
                            <div className="lp-pricing-icon" style={{ color: '#4CAF50' }}>
                                <Sparkles size={28} strokeWidth={1.5} />
                            </div>
                            <h3>Launch</h3>
                            <div className="lp-pricing-price">$499<span>/ mo</span></div>
                            <div className="lp-pricing-gmv">+ 9% GMV Fee</div>
                            <p className="lp-pricing-desc">For brands doing &lt;$25k/mo US sales. Foundational market entry and compliance setup.</p>
                            <button className="lp-btn-dark lp-btn-pricing" style={{ width: '100%', justifyContent: 'center' }}>Get Started →</button>
                        </div>
                        <div className="lp-pricing-card-bottom">
                            <ul className="lp-pricing-list">
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> AI-powered onboarding for 1 product category</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Setup for 1 sales channel (Shopify/Amazon)</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> AI-powered compliance intelligence snapshot</li>
                            </ul>
                        </div>
                    </div>

                    {/* Growth Tier */}
                    <div className="lp-pricing-card">
                        <div className="lp-pricing-card-top">
                            <div className="lp-pricing-icon" style={{ color: '#FF7043' }}>
                                <TrendingUp size={28} strokeWidth={1.5} />
                            </div>
                            <h3>Growth</h3>
                            <div className="lp-pricing-price">$999<span>/ mo</span></div>
                            <div className="lp-pricing-gmv">+ 7% GMV Fee</div>
                            <p className="lp-pricing-desc">For brands doing $25k - $100k/mo. Scaling operations with advanced AI and analytics.</p>
                            <button className="lp-btn-dark lp-btn-pricing" style={{ width: '100%', justifyContent: 'center' }}>Get Started →</button>
                        </div>
                        <div className="lp-pricing-card-bottom">
                            <ul className="lp-pricing-list">
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Full compliance roadmaps for up to 3 categories</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Multi-warehouse strategy for 2-day shipping</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Fulfillment Orchestration Agent</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Replaces multiple agencies and hires</li>
                            </ul>
                        </div>
                    </div>

                    {/* Scale Tier */}
                    <div className="lp-pricing-card">
                        <div className="lp-pricing-card-top">
                            <div className="lp-pricing-icon" style={{ color: '#42A5F5' }}>
                                <Rocket size={28} strokeWidth={1.5} />
                            </div>
                            <h3>Scale</h3>
                            <div className="lp-pricing-price">$1,999<span>/ mo</span></div>
                            <div className="lp-pricing-gmv">+ 6% GMV Fee</div>
                            <p className="lp-pricing-desc">For brands doing &gt;$100k/mo. Enterprise-grade partnership and custom integration.</p>
                            <button className="lp-btn-dark lp-btn-pricing" style={{ width: '100%', justifyContent: 'center' }}>Get Started →</button>
                        </div>
                        <div className="lp-pricing-card-bottom">
                            <ul className="lp-pricing-list">
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Dedicated Account Manager</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Custom ERP or CRM integrations</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Priority access to beta features</li>
                                <li><Check size={16} strokeWidth={2.5} className="lp-check-icon" /> Competitive fee structure for high-volume</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="lp-custom-plan-banner" style={{ maxWidth: '1080px' }}>
                    <div className="lp-custom-banner-left">
                        <div className="lp-custom-banner-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#FF4D4D" />
                            </svg>
                        </div>
                        <div className="lp-custom-banner-texts">
                            <h3>Custom Plan For You</h3>
                            <p>For enterprises requiring tailored solutions, integrations, and support.</p>
                        </div>
                    </div>
                    <div className="lp-custom-banner-right">
                        <form className="lp-pricing-email-form" onSubmit={(e) => { e.preventDefault(); const btn = e.currentTarget.querySelector('button') as HTMLButtonElement; if (btn) { btn.textContent = '✓ Received'; btn.style.background = '#158d75'; btn.disabled = true; } }}>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <input type="email" placeholder="you@brand.com" required style={{ border: '1px solid var(--lp-outline)', borderRadius: '999px', padding: '0.8rem 1.2rem', fontSize: '0.95rem', minWidth: '220px', background: 'var(--lp-surface-variant)', outline: 'none' }} />
                                <button type="submit" className="lp-btn-purple">Talk To Sales →</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <FinalCtaParticleCanvas />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>
                            You Bring the Vision.<br />
                            Orbit Runs the Operations.
                        </h2>

                        <div className="lp-final-cta-buttons">
                            <button
                                className="lp-btn lp-btn-primary"
                                onClick={() => goTo("/auth")}
                            >
                                Launch on Orbit
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="#why">Orbit Platform</a>
                            <a href="#functions">Solutions</a>
                            <a href="#changelog">Changelog</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="#press">Press</a>
                            <a href="#pricing">Pricing</a>
                        </div>
                    </div>
                </div>

                <div className="lp-footer-brand">
                    <div className="lp-footer-orbit-container">
                        <div className="lp-footer-ellipses lp-footer-ellipses--thin">
                            <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                        </div>
                        <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>
                        <span>Orbit</span>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <div className="lp-footer-logo-small">Orbit</div>
                    <div className="lp-footer-legal">
                        <a href="/about">About Orbit</a>
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
