import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
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
    Rocket,
    Plus
} from "lucide-react";
import FeatureCarousel from "../components/FeatureCarousel";
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

// Confirmed real, permission-cleared clients. 3 slots left open below —
// need 3 more brand names/logos to complete the row of ten.
const LOGO_ROW_BRANDS = [
    "Bayangrom",
    "Emsworth",
    "Karama",
    "The Indian Tapas",
    "Flavor Atlas",
    "Kashida Layone",
    "TanRom Lifesciences",
];
const LOGO_ROW_PLACEHOLDER_SLOTS = [0, 1, 2];

const bentoModules = [
  {
    id: "01",
    label: "Market Intelligence",
    problemHook: "You're guessing. Your competitors aren't.",
    problemBody: "Entering a new market without market intelligence isn’t bold, it’s expensive. Most companies realize their assumptions about customers segments, geographic alignment, competition, and positioning were wrong only after they’ve already spent resources.",
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
    solutionDetail: "Auto-classification, document management, and end-to-end customs handling. Nothing was held at the border because someone missed a field.",
    tags: ["FDA", "Customs", "HS codes"],
    status: "Active",
    category: "Core",
  },
  {
    id: "03",
    label: "Logistics & Fulfillment",
    problemHook: "You ship, but you're flying blind.",
    problemBody: "Disconnected carriers and systems create blind spots and brands lack real-time visibility, predictable delivery, and cost control across shipments.",
    solutionDetail: "We continuously optimize routing, carrier selection, and tracking across the shipment lifecycle, ensuring end-to-end visibility, reliability, and cost efficiency.",
    tags: ["Door to Warehouse", "Last-mile"],
    status: "Active",
    category: "Core",
    result: "↓22% shipping cost · Bayangrom",
  },
  {
    id: "04",
    label: "Warehousing & Inventory",
    problemHook: "Guess wrong and it's cash or sales — you lose either way.",
    problemBody: "Limited demand visibility leads to overstocking or stockouts lead to tying up capital or losing sales due to reactive, manual planning.",
    solutionDetail: "We align inventory with demand through intelligent replenishment by understanding geographic and demographic data, ensuring optimal stock levels and efficient capital use.",
    tags: ["US-based", "No minimums"],
    status: "Active",
    category: "Core",
    result: "↓28% excess inventory · Bayangrom",
  },
  {
    id: "05",
    label: "E-commerce Setup",
    problemHook: "Weeks of setup before a single sale.",
    problemBody: "Fragmented setup across entities, payments, storefronts, and marketplaces slows time-to-market and delays revenue.",
    solutionDetail: "We handle US entity formation, merchant of record setup, your Shopify store, and marketplace listings. You sell. We make sure the infrastructure lets you.",
    tags: ["Shopify", "Amazon", "US entity"],
    status: "Active",
    category: "Revenue",
  },
  {
    id: "06",
    label: "Marketing & Growth",
    problemHook: "Spend without insight burns budget.",
    problemBody: "Brands invest in marketing without validated insights, resulting in poor targeting, weak messaging, inefficient SEO, and misaligned geographic spend.",
    solutionDetail: "We continuously use market intelligence to refine targeting, positioning, SEO, and geographic strategy, driving adaptive, data-driven growth with measurable returns.",
    tags: ["Performance", "Brand", "D2C"],
    status: "Active",
    category: "Revenue",
    result: "$100K+ pre-orders · Emsworth & Karama",
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
    const [expandedTile, setExpandedTile] = useState<string | null>(null);
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

    // Handle hash navigation - scroll to element when hash changes
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1); // Remove '#'
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        };

        // Scroll on initial load
        scrollToHash();

        // Listen for hash changes
        window.addEventListener('hashchange', scrollToHash);
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, []);



    return (
        <div className="landing-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
                        {/* <span className="lp-logo-icon">O</span> */}
                        <span className="lp-logo-text">Vybd</span>
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
                            <li><a href="#functions">How it works</a></li>
                            <li><a href="#testimonials">Results</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => goTo("/auth")}
                        >
                            Book an entry call
                        </button>
                    </div>
                </header>
            </div>

            {/* ── Sticky mobile CTA (header's CTA is hidden below 930px) ── */}
            <div className="lp-mobile-sticky-cta">
                <button className="lp-btn lp-btn-primary" onClick={() => goTo("/auth")}>
                    Book an entry call
                </button>
            </div>

            {/* ── Hero ── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting">
                        US market entry for international brands
                    </div>
                    <h2 className="lp-hero-title">
                        Your brand, established in America.
                    </h2>
                    <p className="lp-hero-subtitle">
                        Vybd runs your entire US launch — demand, storefront, and supply chain — so you enter a market you don't know without building a team you don't have.
                    </p>

                    <div className="lp-hero-cta">
                        <a href="#product" className="lp-btn-link" style={{ fontWeight: 600, color: 'var(--lp-on-surface)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            See what we run <ArrowRight size={16} />
                        </a>
                        <button
                            className="lp-btn lp-btn-accent"
                            onClick={() => goTo("/auth")}
                        >
                            Book an entry call <Calendar size={16} style={{ marginBottom: '-1px' }} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Feature Carousel (real client proof, given room to breathe) ── */}
            <section className="lp-carousel-section" id="client-carousel">
                <FeatureCarousel />
            </section>

            {/* ── Logo Row ── */}
            <section className="lp-logo-row-section">
                <div className="lp-logo-row-header">Brands entering the US with Vybd</div>
                <div className="lp-logo-row-grid">
                    {LOGO_ROW_BRANDS.map((brand) => (
                        <div className="lp-logo-chip" key={brand}>{brand}</div>
                    ))}
                    {LOGO_ROW_PLACEHOLDER_SLOTS.map((_, i) => (
                        <div className="lp-logo-chip lp-logo-chip-placeholder" key={`logo-slot-${i}`}>
                            <Plus size={14} />
                        </div>
                    ))}
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
                        <p>Most international brands don't lose the US to a better product. They lose it to the infrastructure gap — wrong compliance, wrong channels, wrong timing, and no single operator holding it together. Vybd closes that gap before it costs you.</p>
                    </div>
                </div>

                <div className="lp-fn-bento">
                    {bentoModules.map((module) => (
                        <div
                            key={module.id}
                            className={`lp-fn-tile lp-fn-bento-tile ${bentoClasses[module.id]} ${expandedTile === module.id ? "is-expanded" : ""}`}
                            onClick={() => setExpandedTile((prev) => (prev === module.id ? null : module.id))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setExpandedTile((prev) => (prev === module.id ? null : module.id));
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-expanded={expandedTile === module.id}
                        >
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
                                        <div className="lp-fn-mobile-hint">Tap to see how we solve it \u2192</div>
                                    </div>
                                    <div className="lp-fn-desc-full lp-fn-bento-solution-state">{module.solutionDetail}</div>
                                </div>
                            </div>
                            <div className="lp-fn-bento-solution-footer">
                                {module.result && (
                                    <div className="lp-fn-result-chip">
                                        <span className="lp-fn-result-label">RESULT</span>
                                        <span className="lp-fn-result-value">{module.result}</span>
                                    </div>
                                )}
                                <div className="lp-fn-footer mt-auto">
                                    <span className="lp-fn-footer-label">{module.tags.join(" \u00b7 ")}</span>
                                    <span className="lp-fn-footer-status">{module.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </section>

            {/* ── Where to Start ── */}
            <section className="lp-process-section" id="where-to-start">
                <div className="lp-process-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">02 / WHERE TO START</div>
                        <h2 className="lp-process-h2">You don't need all six.<br />Start where you need us.</h2>
                        <p className="pp-section-intro">
                            Most brands hand us the whole US entry. Some come for one piece — a store, a campaign, a warehouse — and add the rest as they grow. You only pay for what you need.
                        </p>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps">
                            {/* Storefront */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <ShoppingCart size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Get your US storefront live</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Shopify store, website, payments, US entity, merchant-of-record — the whole digital storefront, built to convert American buyers.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>

                            {/* Crowdfunding */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <Rocket size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Run your Kickstarter or crowdfunding launch</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Validate US demand before you commit. We build and run the campaign end to end.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>

                            {/* Warehousing */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap doorway">
                                    <div className="lp-agent-step-icon">
                                        <Warehouse size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Set up US warehousing & fulfillment</h3>
                                </div>
                                <div className="lp-agent-step-card">
                                    <p>Stock on US soil with fast, tracked last-mile — without signing a 3PL you don't understand.</p>
                                    <a href="#" className="lp-doorway-link" onClick={(e) => { e.preventDefault(); goTo("/auth"); }}>Start here <ArrowRight size={14} /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="lp-doorway-closing">One partner, whichever door you enter through.</p>
                </div>
            </section>

            {/* ── Mechanism Section (How We Run It) ── */}
            <section className="lp-who" id="who">
                <div
                    className="lp-who-card lp-who-card--suppliers"
                    onMouseEnter={() => setSupplierHovered(true)}
                    onMouseLeave={() => setSupplierHovered(false)}
                >
                    <SupplierParticleCanvas hovered={supplierHovered} />
                    <div className="lp-section-tag" style={{ justifyContent: 'center' }}>03 / HOW WE RUN IT</div>
                    <h3>
                        Operate at the speed of culture
                    </h3>
                    <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--lp-on-surface-variant)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Agents carry the volume — monitoring, classifying, routing, optimizing, around the clock. Senior operators carry the judgment and own the outcome.
                    </p>

                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/auth")}
                    >
                        Book an entry call
                    </button>
                </div>
            </section>



            {/* ── Testimonial Globe (Interactive 3D) ── */}
            <TestimonialGlobe />

            {/* ── Horizon Band (routes to the Lab) ── */}
            <section className="lp-horizon-section" id="horizon">
                <div className="lp-horizon-inner">
                    <div className="lp-section-tag" style={{ justifyContent: 'center' }}>THE HORIZON</div>
                    <h3 className="lp-horizon-headline">The agency is what we run today. Here's what we're building next.</h3>
                    <p className="lp-horizon-body">
                        Every entry we run feeds a per-brand knowledge layer we call Brand Brain — so each launch makes the next one smarter. It's early, and it's in development. But it's where Vybd is headed.
                    </p>
                    <a href="/lab" className="lp-horizon-link">
                        See the Lab <ArrowRight size={16} />
                    </a>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <FinalCtaParticleCanvas />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>
                            Ready to enter the US?<br />
                            Let's map your launch.
                        </h2>

                        <div className="lp-final-cta-buttons">
                            <button
                                className="lp-btn lp-btn-primary"
                                onClick={() => goTo("/auth")}
                            >
                                Book an entry call
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-tagline-group">
                        <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                        <p className="lp-footer-ethos">enabling commerce, disabling borders</p>
                    </div>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/product">How It Works</a>
                            <a href="/#functions">Solutions</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="/case-studies">Case Study</a>
                            <a href="/#pricing">Pricing</a>
                        </div>
                        <div className="lp-footer-col">
                            <a href="/lab">Lab</a>
                        </div>
                    </div>
                </div>

                <div className="lp-footer-brand">
                    <div className="lp-footer-orbit-container">
                        <div className="lp-footer-ellipses lp-footer-ellipses--thin">
                            <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                        </div>
                        <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>
                        <span>Vybd</span>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <div className="lp-footer-logo-small">Vybd</div>
                    <div className="lp-footer-legal">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
