import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
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
    Calendar,
    CreditCard,
    Search,
    Sparkles,
    TrendingUp,
    Rocket,
    Check
} from "lucide-react";
import HeroVisual from "../components/HeroVisual";
import TestimonialGlobe from "../components/TestimonialGlobe";
import "./LandingPage.css";

/**
 * Set this to your main platform URL for CTA buttons.
 * For example: "https://app.orbitplatform.com"
 */
const PLATFORM_URL = "#";

const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

const bentoModules = [
  {
    id: "01",
    label: "Market Intelligence",
    problemHook: "You're guessing. Your competitors aren't.",
    problemBody: "Entering a new market without market intelligence isn’t bold, it’s expensive. Most companies realize their assumptions about customers segments, geographic alignment, competition, and positioning were wrong only after they’ve already spent resources.",
    stat: "Day 1",
    statLabel: "Competitive clarity",
    solutionDetail: "We continuously analyze customer behavior, regional and competitive signals before, during, and after market entry, enabling data-driven positioning, and efficient resource allocation.",
    tags: ["Competitor tracking", "Pricing analysis"],
    status: "Active",
    category: "Core",
  },
  {
    id: "02",
    label: "Compliance & Regulatory",
    problemHook: "One wrong filing and your shipment doesn't move.",
    problemBody: "Companies discover documentation gaps only after shipments are delayed, fined, or blocked, resulting in financial loss and operational disruption.",
    stat: "100%",
    statLabel: "AI clearance rate",
    solutionDetail: "Auto-classification, document management, and end-to-end customs handling. Nothing was held at the border because someone missed a field.",
    tags: ["FDA", "Customs", "HS codes"],
    status: "Active",
    category: "Core",
  },
  {
    id: "03",
    label: "Logistics & Fulfillment",
    problemHook: "You ship but you don’t see",
    problemBody: "Disconnected carriers and systems create blind spots and brands lack real-time visibility, predictable delivery, and cost control across shipments.",
    stat: "24/7",
    statLabel: "AI-routed freight",
    solutionDetail: "We continuously optimize routing, carrier selection, and tracking across the shipment lifecycle, ensuring end-to-end visibility, reliability, and cost efficiency.",
    tags: ["Door to Warehouse", "Last-mile"],
    status: "Active",
    category: "Core",
  },
  {
    id: "04",
    label: "Warehousing & Inventory",
    problemHook: "Inventory guesswork is expensive.",
    problemBody: "Limited demand visibility leads to overstocking or stockouts lead to tying up capital or losing sales due to reactive, manual planning.",
    stat: "0",
    statLabel: "",
    solutionDetail: "We align inventory with demand through intelligent replenishment by understanding geographic and demographic data, ensuring optimal stock levels and efficient capital use.",
    tags: ["US-based", "No minimums"],
    status: "Active",
    category: "Core",
  },
  {
    id: "05",
    label: "E-commerce Setup",
    problemHook: "Weeks of setup before a single sale.",
    problemBody: "Fragmented setup across entities, payments, storefronts, and marketplaces slows time-to-market and delays revenue.",
    stat: "Day 1",
    statLabel: "Ready to transact",
    solutionDetail: "We handle US entity formation, merchant of record setup, your Shopify store, and marketplace listings. You sell. We make sure the infrastructure lets you.",
    tags: ["Shopify", "Amazon", "US entity"],
    status: "Active",
    category: "Revenue",
  },
  {
    id: "06",
    label: "Marketing & Growth",
    problemHook: "Guesswork burns budget",
    problemBody: "Brands invest in marketing without validated insights, resulting in poor targeting, weak messaging, inefficient SEO, and misaligned geographic spend.",
    stat: "Data-led",
    statLabel: "Growth execution",
    solutionDetail: "We continuously use market intelligence to refine targeting, positioning, SEO, and geographic strategy, driving adaptive, data-driven growth with measurable returns.",
    tags: ["Performance", "Brand", "D2C"],
    status: "Active",
    category: "Revenue",
  },
];

const bentoClasses: Record<string, string> = {
    "01": "lp-fn-intelligence",
    "02": "lp-fn-compliance",
    "03": "lp-fn-logistics",
    "04": "lp-fn-warehousing",
    "05": "lp-fn-ecommerce",
    "06": "lp-fn-marketing",
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














            {/* ── Functions Bento ── */}
            <section className="lp-functions-section" id="functions">
                <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
                    <div className="lp-section-tag">01 / WHAT WE HANDLE</div>
                </div>
                <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                    <div>
                        <h2>Six problems. One contract.</h2>
                    </div>
                    <div className="lp-functions-header-right">
                        <p>Most international brands don't lose the US market to a better product. They lose it to the infrastructure gap. Wrong compliance, wrong channels, wrong timing, no single operator holding it together. Orbit closes that gap before it costs you.</p>
                    </div>
                </div>

                <div className="lp-fn-bento">
                    {bentoModules.map((module) => (
                        <div key={module.id} className={`lp-fn-tile lp-fn-bento-tile ${bentoClasses[module.id]}`}>
                            <div>
                                <div className="lp-fn-tile-header">
                                    <span className="lp-fn-index">{module.id}</span>
                                    {module.category && <span className="lp-fn-category">{module.category}</span>}
                                </div>
                                <div className="lp-fn-title">{module.label}</div>
                                
                                <div className="lp-fn-bento-content-stack">
                                    <div className="lp-fn-bento-problem-state">
                                        <div className="lp-fn-tile-problem-hook">{module.problemHook}</div>
                                        <div className="lp-fn-tile-problem-body">{module.problemBody}</div>
                                    </div>
                                    <div className="lp-fn-desc-full lp-fn-bento-solution-state">{module.solutionDetail}</div>
                                </div>
                            </div>
                            <div className="lp-fn-bento-solution-footer">
                                <div className="lp-fn-large-stat">{module.stat}</div>
                                <div className="lp-fn-large-stat-label">{module.statLabel}</div>
                                <div className="lp-fn-footer mt-auto">
                                    <span className="lp-fn-footer-label">{module.tags.join(" \u00b7 ")}</span>
                                    <span className="lp-fn-footer-status">{module.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                    <a href="/product" className="lp-product-tech-link" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--lp-primary)', textDecoration: 'none' }}>See how it works technically &rarr;</a>
                </div>
            </section>

            {/* ── Process Section ── */}
            <section className="lp-process-section" id="process">
                <div className="lp-process-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">02 / PROCESS</div>
                        <h2 className="lp-process-h2">From first call<br />to first US sale.</h2>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps-line"></div>
                        <div className="lp-agent-steps">
                            {/* Intake */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap autonomous">
                                    <div className="lp-agent-step-icon">
                                        <Zap size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Intake</h3>
                                    <p>Tell Us About Your Brand</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>One intake session</li>
                                        <li>Product & market mapping</li>
                                        <li>Day 0 → Day 1</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Planning */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap supervised">
                                    <div className="lp-agent-step-icon">
                                        <ShieldCheck size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Planning</h3>
                                    <p>We Build Your US Launch Plan</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>48h compliance checklist</li>
                                        <li>Logistics & marketing roadmap</li>
                                        <li>Day 1 → Day 3</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Launch */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap approval">
                                    <div className="lp-agent-step-icon">
                                        <MessageSquare size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Launch</h3>
                                    <p>Your Brand is Live in the US</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>Warehoused & listed</li>
                                        <li>Live marketing programme</li>
                                        <li>Day 3 → Day 14</li>
                                    </ul>
                                </div>
                            </div>
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
            </section>



            {/* ── Testimonial Globe (Interactive 3D) ── */}
            <TestimonialGlobe />

            {/* ── Pricing Section (05 / PRICING) ── */}
            <section className="lp-pricing-section" id="pricing">
                <div className="lp-pricing-header">
                    {/* <div className="lp-section-tag" style={{ justifyContent: 'center', marginBottom: '1rem' }}>05 / PRICING</div> */}
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
