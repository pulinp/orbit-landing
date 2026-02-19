import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
import WarehouseParticleCanvas from "../components/WarehouseParticleCanvas";
import FinalCtaParticleCanvas from "../components/FinalCtaParticleCanvas";
import ArchitectureNodeGraph from "../components/ArchitectureNodeGraph";
import {
    Zap,
    ShieldCheck,
    MessageSquare,
    Menu,
    X,
    Play,
    ChevronLeft,
    ChevronRight,
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



const useCases = [
    {
        title: "Manufacturers",
        caption: "Manufacturers",
        description:
            "Streamline production-to-warehouse flows by automating inbound shipment creation and real-time inventory updates.",
        image: "/landing/usecase-manufacturer.png",
    },
    {
        title: "Distributors",
        caption: "Distributors",
        description:
            "Coordinate multi-warehouse fulfillment with intelligent routing, capacity-aware allocation, and cross-dock management.",
        image: "/landing/usecase-distributor.png",
    },
    {
        title: "Retailers",
        caption: "Retailers",
        description:
            "Integrate your Shopify, Amazon, or DTC channels and let Orbit orchestrate fulfillment across your warehouse network automatically.",
        image: "/landing/usecase-retailer.png",
    },
];

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
    const carouselRef = useRef<HTMLDivElement>(null);

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



    const scrollCarousel = (dir: "left" | "right") => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.65;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

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
                            <li><a href="#usecases">Solutions</a></li>
                            <li><a href="#who">Pricing</a></li>
                            <li><a href="#final-cta">Resources</a></li>
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
                    The Operating System for
                    <span>Vibe-Commerce</span>
                </h2>
                <p className="lp-hero-subtitle">
                    Orbit is open commerce infrastructure that coordinates autonomous agents and specialist providers across compliance, logistics, marketing, support, and e-commerce.
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

            {/* ── Visual Section ── */}
            <section className="lp-visual">
                <div className="lp-visual-card">
                    <div className="lp-visual-inner">
                        <Play size={80} strokeWidth={1} />
                        <p>See Orbit in action</p>
                    </div>
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
                                Not Another Tool. <br />
                                <span className="lp-text-gradient">A Commerce Infrastructure Layer.</span>
                            </h2>
                            <div className="lp-product-copy">
                                <p>
                                    Traditional commerce software provides dashboards.
                                    <strong> Orbit provides coordinated execution.</strong>
                                </p>
                                <p>
                                    Instead of fragmented vendors and disconnected systems, Orbit creates a shared operational layer where inventory, compliance, logistics, support, and orders operate in synchronized workflows.
                                </p>
                            </div>
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

                <div className="lp-architecture-section">
                    <div className="lp-architecture-header">
                        <h3>A Full Commerce Stack, Coordinated.</h3>
                        <p>
                            Orbit is built as a layered commerce operating system. Each module operates autonomously while synchronizing through a central orchestration layer.
                        </p>
                    </div>

                    <div className="lp-architecture-grid">
                        <ArchitectureNodeGraph />
                    </div>
                </div>
            </section>

            {/* ── Agent Execution Model ── */}
            <section className="lp-agent-model">
                <div className="lp-agent-model-header">
                    <h2>Autonomous. Supervised. Accountable.</h2>
                    <p>
                        Orbit agents operate in three modes depending on risk and confidence thresholds.
                    </p>
                </div>
                <div className="lp-agent-cards">
                    <div className="lp-agent-card">
                        <div className="lp-agent-card-icon autonomous">
                            <Zap size={32} />
                        </div>
                        <h3>Autonomous</h3>
                        <p>Agent executes and logs actions.</p>
                        <ul className="lp-agent-card-list">
                            <li>Routine workflows</li>
                            <li>Low-risk decisions</li>
                            <li>High confidence</li>
                        </ul>
                    </div>
                    <div className="lp-agent-card">
                        <div className="lp-agent-card-icon supervised">
                            <ShieldCheck size={32} />
                        </div>
                        <h3>Supervised</h3>
                        <p>Agent executes; specialist reviews.</p>
                        <ul className="lp-agent-card-list">
                            <li>Complex exceptions</li>
                            <li>Medium risk</li>
                            <li>Learning phase</li>
                        </ul>
                    </div>
                    <div className="lp-agent-card">
                        <div className="lp-agent-card-icon approval">
                            <MessageSquare size={32} />
                        </div>
                        <h3>Approval</h3>
                        <p>Agent recommends; merchant approves.</p>
                        <ul className="lp-agent-card-list">
                            <li>Critical decisions</li>
                            <li>High financial impact</li>
                            <li>SLA overrides</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Use Cases / Carousel ── */}
            <section className="lp-usecases" id="usecases">
                <div className="lp-usecases-header">
                    <h2>Built for Every Node in Your Commerce Network</h2>
                    <p className="lp-usecases-intro">
                        Whether you&apos;re a manufacturer shipping finished goods, a distributor managing
                        multi-warehouse fulfillment, or a retailer integrating sales channels — Orbit adapts
                        to your workflow.
                    </p>
                </div>

                <div className="lp-carousel" ref={carouselRef}>
                    {useCases.map((uc, i) => (
                        <div className="lp-carousel-item" key={i}>
                            <figure>
                                <img src={uc.image} alt={uc.title} loading="lazy" />
                                <figcaption>{uc.caption}</figcaption>
                            </figure>
                            <h3>{uc.title}</h3>
                            <p>{uc.description}</p>
                            <a href="#product">Learn more</a>
                        </div>
                    ))}
                </div>

                {/* Carousel nav buttons */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        padding: "0 3rem 2rem",
                        gridColumn: "main",
                    }}
                >
                    <button
                        className="lp-btn lp-btn-secondary"
                        onClick={() => scrollCarousel("left")}
                        aria-label="Previous"
                        style={{ padding: "0.5em 0.7em" }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className="lp-btn lp-btn-secondary"
                        onClick={() => scrollCarousel("right")}
                        aria-label="Next"
                        style={{ padding: "0.5em 0.7em" }}
                    >
                        <ChevronRight size={20} />
                    </button>
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
                        For suppliers
                        <span>Manage your operations</span>
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





            {/* ── Final CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark" id="final-cta-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <FinalCtaParticleCanvas />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2>You Bring the Vision. Orbit Runs the Operations.</h2>

                        <div className="lp-final-cta-buttons">
                            <button
                                className="lp-btn lp-btn-primary"
                                onClick={() => goTo("/auth")}
                            >
                                Launch on Orbit
                            </button>
                            <button
                                className="lp-btn lp-btn-secondary"
                                onClick={() => goTo("/apply")}
                            >
                                Apply as a Specialist
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <h3 className="lp-footer-tagline">Experience liftoff</h3>
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
                    <span>Orbit</span>
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
