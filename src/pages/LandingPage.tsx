import { useEffect, useRef, useState } from "react";
import SupplierParticleCanvas from "../components/SupplierParticleCanvas";
import WarehouseParticleCanvas from "../components/WarehouseParticleCanvas";
import {
    Package,
    Truck,
    Warehouse,
    ShieldCheck,
    ShoppingCart,
    BarChart3,
    Globe,
    Boxes,
    Settings,
    Zap,
    Code,
    FileText,
    Terminal,
    RefreshCw,
    Upload,
    Layers,
    GitBranch,
    MessageSquare,
    Share2,
    ArrowRight,
    Menu,
    X,
    Play,
    ChevronLeft,
    ChevronRight,
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
    BarChart3, Globe, Boxes, Settings, Zap,
    Code, FileText, Terminal, RefreshCw, Upload,
    Layers, GitBranch, MessageSquare, Share2, ArrowRight,
    Package, Truck, Warehouse, ShieldCheck,
];

const features = [
    {
        title: "Real-Time Inventory Visibility",
        description:
            "Monitor stock levels, product locations, and storage capacities across every warehouse in your network with a single unified dashboard.",
        image: "/landing/feature-inventory.png",
    },
    {
        title: "End-to-End Shipment Tracking",
        description:
            "Track shipments from origin to destination with live status updates, route visualization, and automated exception alerts.",
        image: "/landing/feature-shipments.png",
    },
    {
        title: "Connected Warehouse Network",
        description:
            "Manage a distributed network of warehouses with capacity monitoring, health indicators, and performance analytics from one place.",
        image: "/landing/feature-warehouses.png",
    },
    {
        title: "Compliance Intelligence",
        description:
            "Stay ahead of regulatory requirements with automated document verification, risk scoring, and ESG tracking built into your workflow.",
        image: "/landing/feature-compliance.png",
    },
    {
        title: "Unified Order Pipeline",
        description:
            "Oversee every order from placement to delivery with visual pipeline views, revenue insights, and multi-channel consolidation.",
        image: "/landing/feature-orders.png",
    },
];

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
                <p>
                    Supply chain,
                    <span>simplified and connected</span>
                </p>
                <div className="lp-hero-cta">
                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/auth")}
                    >
                        Get Started Free
                    </button>
                    <a href="#product" className="lp-btn lp-btn-secondary">
                        Explore the platform
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
                <h2>
                    Orbit is your unified supply chain platform — connecting warehouses, suppliers, and orders in one view.
                </h2>

                <div
                    className={`lp-icons ${iconsVisible ? "lp-icons-animate" : ""}`}
                    ref={iconsRef}
                >
                    {iconList.map((Icon, i) => (
                        <div className="lp-icon-bubble" key={i}>
                            <Icon size={28} strokeWidth={1.5} />
                        </div>
                    ))}
                </div>

                <div className="lp-features" id="features">
                    {features.map((feat, i) => (
                        <div className="lp-feature" key={i}>
                            <div className="lp-feature-img-wrapper">
                                <img src={feat.image} alt={feat.title} loading="lazy" />
                            </div>
                            <div className="lp-feature-content">
                                <h3>{feat.title}</h3>
                                <p>{feat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Use Cases / Carousel ── */}
            <section className="lp-usecases" id="usecases">
                <div className="lp-usecases-header">
                    <h2>Built for every link in the chain</h2>
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
                <div className="lp-final-cta-card lp-dark" id="final-cta-card">
                    <p>Get started with Orbit — it&apos;s free</p>
                    <div className="lp-final-cta-buttons">
                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => goTo("/auth")}
                        >
                            Create your account
                        </button>
                        <button
                            className="lp-btn lp-btn-secondary"
                            onClick={() => goTo("/admin/login")}
                        >
                            Admin Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer">
                <p>© 2026 Orbit. All rights reserved.</p>
                <div className="lp-footer-links">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
            </footer>
        </div>
    );
}
