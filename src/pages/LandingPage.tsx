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
} from "lucide-react";
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
                        <span className="lp-logo-icon">O</span>
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
                            <li><a href="#product">Platform</a></li>
                            <li><a href="#who">Network</a></li>
                            <li><a href="#pricing">Pricing</a></li>
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
                <h1 className="lp-hero-logo">
                    <span>O</span>rbit
                </h1>
                <h2 className="lp-hero-title">
                    You bring the brand.<br />
                    <span>We bring the operations.</span>
                </h2>
                <p className="lp-hero-subtitle">
                    Orbit is the full-stack US market entry platform for international brands — coordinating compliance, logistics, warehousing, e-commerce, and marketing under one contract, so you're live in 14 days.
                </p>
                <div className="lp-hero-supporting">
                    One platform. Seven functions. Continuous orchestration.
                </div>
                <div className="lp-hero-cta">
                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/auth")}
                    >
                        Launch on Orbit
                    </button>
                    <a href="#product" className="lp-btn lp-btn-secondary">
                        Explore the Platform
                    </a>
                </div>
            </section>













            {/* ── Stats Band ── */}
            <div className="lp-stats-band">
                <div className="lp-stat-item">
                    <span className="lp-stat-number">3</span>
                    <span className="lp-stat-label">Brands Launched — Cohort 1</span>
                </div>
                <div className="lp-stat-item">
                    <span className="lp-stat-number lp-stat-accent">100%</span>
                    <span className="lp-stat-label">Compliance Rate</span>
                </div>
            </div>

            {/* ── Problem Section ── */}
            <section className="lp-problem-section" id="problem">
                <div className="lp-problem-header">
                    <div className="lp-problem-header-left">
                        <div className="lp-section-tag">01 / PROBLEM</div>
                        <h2>Three ways founders burn time entering the US</h2>
                    </div>
                    <div className="lp-problem-header-right">
                        <p>International brands doing $500K–5M at home are stuck choosing between broken options. Every path costs months of founder attention and still doesn't guarantee US market traction.</p>
                    </div>
                </div>

                <div className="lp-problem-list">
                    <div className="lp-problem-item">
                        <div className="lp-problem-num">001</div>
                        <div>
                            <div className="lp-problem-title">Scattered Consultants</div>
                            <div className="lp-problem-subtitle">"Seven vendors, zero coordination"</div>
                        </div>
                        <div>
                            <p className="lp-problem-desc">You hire a compliance firm, a 3PL, a marketing agency, and an Amazon specialist — and then spend all your time on coordination calls that none of them attend together. The cost of misalignment falls on you.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> No single point of accountability</li>
                                <li><span className="lp-issue-dash">—</span> Optimised individually, not for your outcome</li>
                                <li><span className="lp-issue-dash">—</span> 4–6 months to get everything aligned</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lp-problem-item">
                        <div className="lp-problem-num">002</div>
                        <div>
                            <div className="lp-problem-title">Full DIY</div>
                            <div className="lp-problem-subtitle">"I'll figure it out myself"</div>
                        </div>
                        <div>
                            <p className="lp-problem-desc">FDA filings, tariff codes, warehouse contracts, Amazon PPC — you're doing seven jobs none of which is building your brand. Compliance errors are costly. The learning curve is 6–12 months. You lose the market window.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> Founders burn out on logistics</li>
                                <li><span className="lp-issue-dash">—</span> Compliance mistakes cost $50K+</li>
                                <li><span className="lp-issue-dash">—</span> No leverage — every task is manual</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lp-problem-item">
                        <div className="lp-problem-num">003</div>
                        <div>
                            <div className="lp-problem-title">Single-Function Providers</div>
                            <div className="lp-problem-subtitle">"Great at one thing, blind to the rest"</div>
                        </div>
                        <div>
                            <p className="lp-problem-desc">You find a best-in-class 3PL and a great compliance partner — then discover they've never worked together and you're the integration layer. You've reduced the vendor count but not the coordination problem.</p>
                            <ul className="lp-problem-issues">
                                <li><span className="lp-issue-dash">—</span> Handoff gaps fall through the cracks</li>
                                <li><span className="lp-issue-dash">—</span> Difficult to pivot when one part breaks</li>
                                <li><span className="lp-issue-dash">—</span> Still running 5 projects instead of 7</li>
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
                        <p>One team. One contract. Your brand live in the US.</p>
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
                            <div className="lp-fn-desc">AI-powered competitive analysis, US consumer trend mapping, and category positioning research. You arrive in the US market already knowing where to play and who's buying — not guessing after the fact.</div>
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
                            <div className="lp-fn-desc">FDA, FCC, CPSC — every requirement for your product category, flagged and filed before you ship a unit. No customs holds.</div>
                        </div>
                        <div className="lp-fn-footer">
                            <span className="lp-fn-footer-label">All categories</span>
                            <span className="lp-fn-footer-status">100% rate</span>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-logistics">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">03</span>
                            </div>
                            <div className="lp-fn-title">Logistics</div>
                            <div className="lp-fn-desc">Inbound freight, customs brokerage, and last-mile — fully coordinated. Your product arrives on time, every time.</div>
                        </div>
                        <div className="lp-fn-footer">
                            <span className="lp-fn-footer-label">Door to warehouse</span>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-warehousing">
                        <div className="lp-fn-tile-header">
                            <span className="lp-fn-index">04</span>
                        </div>
                        <div className="lp-fn-title">Warehousing &amp; Fulfilment</div>
                        <div className="lp-fn-desc">Flexible US warehouse infrastructure. No long-term contracts, no volume minimums. Scale as your US sales grow — not based on a forecast you made before you launched.</div>
                        <div className="lp-fn-footer">
                            <span className="lp-fn-footer-label">No minimums · Flexible terms</span>
                            <span className="lp-fn-footer-status">US-based</span>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-ecommerce">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">05</span>
                                <span className="lp-fn-category">Revenue</span>
                            </div>
                            <div className="lp-fn-title">E-commerce Setup</div>
                            <div className="lp-fn-desc">Amazon marketplace, Shopify storefront, and DTC channel — built and optimised for US buyers. Listings, A+ content, conversion architecture, and launch campaigns ready before day one.</div>
                        </div>
                        <div className="lp-fn-footer">
                            <span className="lp-fn-footer-label">Amazon · Shopify · DTC</span>
                            <span className="lp-fn-footer-status">Ready day 1</span>
                        </div>
                    </div>

                    <div className="lp-fn-tile lp-fn-marketing">
                        <div>
                            <div className="lp-fn-tile-header">
                                <span className="lp-fn-index">06</span>
                            </div>
                            <div className="lp-fn-title">Marketing</div>
                            <div className="lp-fn-desc">Performance campaigns and brand positioning calibrated to US consumers — not a translated version of what worked at home.</div>
                        </div>
                        <div className="lp-fn-footer">
                            <span className="lp-fn-footer-label">Performance + Brand</span>
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
                            <h4>Live in the US.</h4>
                            <p>Your product is compliant, warehoused in the US, listed on the right channels, and backed by a live marketing programme. You brief us on the brand. We run the operations.</p>
                            <div className="lp-process-step-footer">
                                <span className="lp-process-step-time">Day 3 → Day 14</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Differentiators Section ── */}
            <section className="lp-diff-section" id="why">
                <div className="lp-diff-inner">
                    <div className="lp-diff-header">
                        <div className="lp-section-tag">04 / WHY ORBIT</div>
                        <h2 className="lp-diff-h2">Two things<br />no one else offers.</h2>
                    </div>
                    <div className="lp-diff-bento">
                        <div className="lp-diff-tile">
                            <div className="lp-diff-eyebrow">01 — Cultural Fit</div>
                            <h4>We Speak Both Languages</h4>
                            <p>Our team has worked with brands from Korea, India, and Thailand navigating US consumer culture. We know what translates and what needs reframing before you invest in the wrong message for the wrong audience.</p>
                        </div>

                        <div className="lp-diff-tile">
                            <div className="lp-diff-eyebrow">02 — AI-Powered</div>
                            <h4>Agents Catch What Humans Miss</h4>
                            <p>Compliance and market intelligence agents monitor regulatory changes and competitive shifts in real time — flagging issues the moment they appear, not in your quarterly review.</p>
                        </div>
                    </div>
                </div>
            </section>



            {/* ── Proof / Testimonials ── */}
            <section className="lp-proof-section" id="proof">
                <div className="lp-proof-inner">
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="lp-section-tag">05 / RESULTS</div>
                        <h2 className="lp-proof-h2">Early cohort.<br />Real numbers.</h2>
                    </div>

                    <div className="lp-proof-numbers">
                        <div className="lp-proof-num-item">
                            <span className="lp-proof-num-value lp-proof-num-accent">3</span>
                            <span className="lp-proof-num-label">Brands Launched</span>
                        </div>
                        <div className="lp-proof-num-item">
                            <span className="lp-proof-num-value">11.4</span>
                            <span className="lp-proof-num-label">Avg. Days to Live</span>
                        </div>
                        <div className="lp-proof-num-item">
                            <span className="lp-proof-num-value lp-proof-num-accent">100%</span>
                            <span className="lp-proof-num-label">Compliance Rate</span>
                        </div>
                        <div className="lp-proof-num-item">
                            <span className="lp-proof-num-value">3</span>
                            <span className="lp-proof-num-label">Countries in Cohort 1</span>
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

            {/* ── Two-Column CTA ── */}
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

            {/* ── Product Section ── */}
            <section className="lp-product" id="product">
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
                            <h2>
                                Not another app to manage.<br />
                                <span className="lp-text-gradient">A team that runs your US business.</span>
                            </h2>
                            <div className="lp-product-copy">
                                <p>
                                    Traditional commerce software provides dashboards.
                                    <strong> Orbit provides coordinated execution.</strong>
                                </p>
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

            {/* ── Pricing Section ── */}
            <section className="lp-pricing-section" id="pricing">
                <div className="lp-pricing-header">
                    <h2>Pricing and plans</h2>
                    <p className="lp-pricing-sub">Local Businesses or Enterprises, A Plan for All</p>
                </div>
                
                <LlmLogos />

                <div className="lp-pricing-features">
                    <div className="lp-feature-pill">No Long Term Contracts</div>
                    <div className="lp-feature-pill">Cancel Anytime</div>
                    <div className="lp-feature-pill">100% Transparency</div>
                </div>

                <div className="lp-custom-plan-banner">
                    <div className="lp-custom-banner-left">
                        <div className="lp-custom-banner-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#FF4D4D"/>
                            </svg>
                        </div>
                        <div className="lp-custom-banner-texts">
                            <h3>Custom Plan For You</h3>
                            <p>Need more? Need Better? Contact Sales</p>
                        </div>
                    </div>
                    <div className="lp-custom-banner-right">
                        <p>For enterprises requiring tailored solutions, integrations, and support</p>
                        <button className="lp-btn-purple">Talk To Sales →</button>
                    </div>
                </div>
            </section>

            {/* ── Contact / CTA Form ── */}
            <section className="lp-cta-section" id="contact">
                <div className="lp-cta-inner">
                    <div className="lp-cta-copy">
                        <div className="lp-section-tag">06 / GET STARTED</div>
                        <h2 className="lp-cta-h2">Ready to bring your brand to the US?</h2>
                        <p className="lp-cta-desc">Fill in the form and we'll send you a custom US launch plan within 48 hours — market intelligence, compliance checklist, and a 90-day revenue projection for your category.</p>
                        <ul className="lp-cta-promise-list">
                            <li><span className="lp-promise-icon">→</span> Full compliance audit for your product category</li>
                            <li><span className="lp-promise-icon">→</span> Recommended logistics and warehousing setup</li>
                            <li><span className="lp-promise-icon">→</span> 90-day revenue projection based on your category</li>
                            <li><span className="lp-promise-icon">→</span> No commitment required to receive the plan</li>
                        </ul>
                    </div>

                    <div className="lp-contact-form-wrap">
                        <div className="lp-form-title">Just drop us your email and we'll reach out</div>
                        <form onSubmit={(e) => { e.preventDefault(); const btn = e.currentTarget.querySelector('.lp-form-submit') as HTMLButtonElement; if (btn) { btn.textContent = '✓ Received — plan arriving within 48h'; btn.style.background = '#158d75'; btn.disabled = true; } }}>
                            <div className="lp-form-group" style={{ marginBottom: "1.5rem" }}>
                                <label className="lp-form-label" htmlFor="f-email">Email</label>
                                <input className="lp-form-input" id="f-email" type="email" placeholder="you@brand.com" required />
                            </div>
                            <button className="lp-form-submit" type="submit">Contact The Team →</button>
                            <p className="lp-form-footnote">48h turnaround · No sales call without your consent</p>
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
                            <button
                                className="lp-btn lp-btn-secondary"
                                onClick={() => goTo("/auth")}
                            >
                                Manage Brand Operations
                            </button>
                            <button
                                className="lp-btn lp-btn-secondary"
                                onClick={() => goTo("/warehouse/login")}
                            >
                                Power Your Warehouse
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
                            <a href="#product">Download</a>
                            <a href="#product">Product</a>
                            <a href="#docs">Docs</a>
                            <a href="#changelog">Changelog</a>
                            <a href="#press">Press</a>
                            <a href="#releases">Releases</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="/blog">Blog</a>
                            <a href="/pricing">Pricing</a>
                            <a href="/use-cases">Use Cases</a>
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
                        <a href="/products">Orbit Products</a>
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
