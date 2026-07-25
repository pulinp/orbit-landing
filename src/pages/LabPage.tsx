import { useEffect, useState } from "react";
import {
    Menu,
    X,
    Brain,
    Search,
    ShieldCheck,
    Truck,
    Warehouse as WarehouseIcon,
    ShoppingCart,
    Sparkles,
    ChevronDown,
} from "lucide-react";
import "./LandingPage.css";
import "./ProductPage.css";
import "./LabPage.css";

const PLATFORM_URL = "#";
const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

const KNOWLEDGE_TYPES = [
    {
        id: "01",
        title: "Voice",
        lead: "Brand guidelines, positioning, the dos and don'ts.",
        body: "So every agent's output — listings, campaigns, customer replies — comes out on-brand without a human re-briefing each one.",
    },
    {
        id: "02",
        title: "Operations",
        lead: "This brand's SKUs, margins, HTS codes, supplier terms, channel rules, compliance constraints.",
        body: "So agents make the correct call — what to reorder, how to classify, where to route — without stopping to ask.",
    },
    {
        id: "03",
        title: "Market",
        lead: "What our intelligence agents learn about the US market and this brand's customers.",
        body: "So strategy adapts as the signal changes, instead of running on day-one assumptions.",
    },
];

const LOOP_AGENTS = [
    { id: "market", label: "Market Intelligence", icon: Search, color: "#6366f1" },
    { id: "compliance", label: "Compliance", icon: ShieldCheck, color: "#f59e0b" },
    { id: "logistics", label: "Logistics", icon: Truck, color: "#06b6d4" },
    { id: "warehouse", label: "Warehousing", icon: WarehouseIcon, color: "#8b5cf6" },
    { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, color: "#ec4899" },
    { id: "marketing", label: "Marketing", icon: Sparkles, color: "#f97316" },
];

// Coordinate space matches the container's real aspect ratio (3:2) so the
// SVG viewBox scales uniformly — no distortion, so arrowhead markers render correctly.
const LOOP_W = 300;
const LOOP_H = 200;
const LOOP_CENTER = { x: LOOP_W / 2, y: LOOP_H / 2 };
const LOOP_RADIUS_X = 115;
const LOOP_RADIUS_Y = 72;

const LOOP_NODES = LOOP_AGENTS.map((agent, i) => {
    const angle = ((-90 + i * 60) * Math.PI) / 180;
    const dx = LOOP_RADIUS_X * Math.cos(angle);
    const dy = LOOP_RADIUS_Y * Math.sin(angle);
    return {
        ...agent,
        x: LOOP_CENTER.x + dx,
        y: LOOP_CENTER.y + dy,
        // Connector line is drawn between the visible card edges, not the
        // card centers — otherwise both arrowheads render hidden underneath
        // the opaque card backgrounds.
        lineStart: { x: LOOP_CENTER.x + dx * 0.32, y: LOOP_CENTER.y + dy * 0.32 },
        lineEnd: { x: LOOP_CENTER.x + dx * 0.82, y: LOOP_CENTER.y + dy * 0.82 },
    };
});

function BrandBrainLoop() {
    return (
        <div className="dash-mock lab-loop-mock">
            <div className="dash-bar">
                <div className="dash-dot r" />
                <div className="dash-dot y" />
                <div className="dash-dot g" />
                <div className="orch-title-bar">
                    <Brain size={13} style={{ color: "var(--lp-primary)" }} />
                    <span>Brand Brain</span>
                </div>
            </div>

            <div className="lab-loop-content">
                <svg
                    className="lab-loop-svg"
                    viewBox={`0 0 ${LOOP_W} ${LOOP_H}`}
                >
                    <defs>
                        <marker
                            id="lab-loop-arrow"
                            viewBox="0 0 10 10"
                            refX="8"
                            refY="5"
                            markerWidth="5"
                            markerHeight="5"
                            orient="auto-start-reverse"
                        >
                            <path d="M0,0 L10,5 L0,10 z" fill="var(--lp-on-surface-variant)" />
                        </marker>
                    </defs>
                    {LOOP_NODES.map((n) => (
                        <line
                            key={n.id}
                            x1={n.lineStart.x}
                            y1={n.lineStart.y}
                            x2={n.lineEnd.x}
                            y2={n.lineEnd.y}
                            stroke="var(--lp-outline)"
                            strokeWidth="2"
                            markerStart="url(#lab-loop-arrow)"
                            markerEnd="url(#lab-loop-arrow)"
                        />
                    ))}
                </svg>

                <div
                    className="lab-loop-center"
                    style={{
                        left: `${(LOOP_CENTER.x / LOOP_W) * 100}%`,
                        top: `${(LOOP_CENTER.y / LOOP_H) * 100}%`,
                    }}
                >
                    <Brain size={22} />
                    <span>Brand Brain</span>
                </div>

                {LOOP_NODES.map((n) => {
                    const Icon = n.icon;
                    return (
                        <div
                            key={n.id}
                            className="lab-loop-node"
                            style={{
                                left: `${(n.x / LOOP_W) * 100}%`,
                                top: `${(n.y / LOOP_H) * 100}%`,
                                "--node-color": n.color,
                            } as React.CSSProperties}
                        >
                            <Icon size={16} />
                            <span>{n.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function LabPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Vybd Lab — What we're building behind the agency";

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute(
            "content",
            "Vybd Lab is where we build the infrastructure our agency runs on — starting with Brand Brain, a per-brand knowledge layer our agents read from and write back to. In development, in the open."
        );

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
        };
    }, []);

    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }, 100);
            }
        };
        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    return (
        <div className="landing-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo lab-logo">
                        <span className="lp-logo-text">Vybd</span>
                        <span className="lab-badge">Lab</span>
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
                            <li><a href="/#functions">How it works</a></li>
                            <li><a href="/#testimonials">Results</a></li>
                            <li><a href="/#pricing">Pricing</a></li>
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

            {/* ── Hero ── */}
            <section className="lp-hero" id="lab-hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-supporting">
                        Vybd Lab · In development
                    </div>
                    <h1 className="lp-hero-title">
                        What we're building behind the agency.
                    </h1>
                    <p className="lp-hero-subtitle">
                        Vybd runs full US launches today. Underneath that work, we're building the infrastructure that makes each launch smarter than the last. The Lab is where that lives — in the open, before it's finished.
                    </p>

                    <div className="lp-hero-cta" style={{ justifyContent: "center" }}>
                        <a href="#brand-brain" className="lp-btn lp-btn-accent">
                            See Brand Brain <ChevronDown size={16} />
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Brand Brain ── */}
            <section className="lp-functions-section" id="brand-brain">
                <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
                    <div className="lp-section-tag">01 / BRAND BRAIN</div>
                </div>
                <div className="lp-functions-header" style={{ alignItems: "flex-start" }}>
                    <div>
                        <h2>One brain per brand.<br />Every agent acts on it.</h2>
                    </div>
                    <div className="lp-functions-header-right">
                        <p>Brand Brain is the per-brand knowledge layer every Vybd agent reads from and writes back to — so the whole stack acts on one brand's context, and gets sharper about it with every entry.</p>
                    </div>
                </div>

                <div className="lab-brain-grid">
                    {KNOWLEDGE_TYPES.map((item) => (
                        <div key={item.id} className="lp-fn-tile lab-brain-card">
                            <div>
                                <div className="lp-fn-tile-header">
                                    <span className="lp-fn-index">{item.id}</span>
                                </div>
                                <div className="lp-fn-title">{item.title}</div>
                                <div className="lab-brain-lead">{item.lead}</div>
                                <p className="lab-brain-body">{item.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── The Loop ── */}
            <section className="lp-process-section" id="loop">
                <div className="lp-process-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">02 / WHY IT'S A BRAIN, NOT A CONFIG FILE</div>
                        <h2 className="lp-process-h2">Agents don't just read it.<br />They write back to it.</h2>
                        <p className="pp-section-intro">
                            A knowledge layer agents only read from is a settings page. Brand Brain is different: agents write findings back into it. Market intelligence updates what the marketing agent targets. A classification decision updates how the next shipment clears. A campaign result updates the strategy. Every entry Vybd runs makes the brain sharper for the next one — so a brand's fifth month is smarter than its first, and its second market starts ahead of where its first did.
                        </p>
                    </div>

                    <BrandBrainLoop />
                </div>
            </section>

            {/* ── Status Band ── */}
            <section className="lab-status-section" id="status">
                <div className="lp-final-cta-card lp-dark lab-status-card">
                    <div className="lp-section-tag lab-status-tag">STATUS</div>
                    <h2>Where this actually is.</h2>
                    <p className="lab-status-body">
                        Brand Brain is in active development. It's not something you can buy today — it's the direction the agency is building toward, grounded in the real entries we run now. We're sharing it early because the people who find this interesting are usually the people we want to talk to.
                    </p>
                    <div className="lab-status-ctas">
                        <button
                            className="lp-btn lp-btn-primary"
                            onClick={() => goTo("/contact")}
                        >
                            Talk to us
                        </button>
                        <button
                            className="lp-btn lp-btn-secondary"
                            onClick={() => goTo("/careers")}
                        >
                            Build it with us
                        </button>
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
