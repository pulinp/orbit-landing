import { useState } from "react";
import {
    Zap,
    ShieldCheck,
    MessageSquare,
    Menu,
    X,
    Layers,
    GitBranch,
    Settings,
} from "lucide-react";
import "./LandingPage.css";
import "./ProductPage.css";

const PLATFORM_URL = "#";
const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

export default function ProductPage() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                            <li><a href="/#product">Platform</a></li>
                            <li><a href="/#who">Network</a></li>
                            <li><a href="/#pricing">Pricing</a></li>
                            <li><a href="/product" className="lp-nav-active">How It Works</a></li>
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
            <section className="pp-hero">
                <div className="pp-hero-inner">
                    <div className="pp-hero-tag">How Orbit Works</div>
                    <h1 className="pp-hero-h1">How Orbit Works</h1>
                    <p className="pp-hero-sub">
                        Orbit is built as a layered commerce operating system. Each function runs autonomously and synchronises through a central orchestration layer — so nothing falls through the gaps between vendors.
                    </p>
                </div>
            </section>

            {/* ── Section 1: Three Layers ── */}
            <section className="pp-section pp-layers-section">
                <div className="pp-section-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">01 / ARCHITECTURE</div>
                        <h2>Three layers. One outcome.</h2>
                    </div>

                    <div className="pp-layers-grid">
                        <div className="pp-layer-card pp-layer-1">
                            <div className="pp-layer-icon">
                                <Zap size={28} strokeWidth={1.8} />
                            </div>
                            <div className="pp-layer-badge">Layer 1</div>
                            <h3>Intelligence</h3>
                            <p>Market data, compliance monitoring, and competitive signals processed in real time by AI agents.</p>
                            <div className="pp-layer-footer">
                                <span>Real-time</span>
                                <span>AI-powered</span>
                            </div>
                        </div>

                        <div className="pp-layer-card pp-layer-2">
                            <div className="pp-layer-icon">
                                <GitBranch size={28} strokeWidth={1.8} />
                            </div>
                            <div className="pp-layer-badge">Layer 2</div>
                            <h3>Orchestration</h3>
                            <p>A central coordination layer that synchronises inventory, logistics, compliance status, and order data across all functions.</p>
                            <div className="pp-layer-footer">
                                <span>Always in sync</span>
                                <span>Zero gaps</span>
                            </div>
                        </div>

                        <div className="pp-layer-card pp-layer-3">
                            <div className="pp-layer-icon">
                                <Layers size={28} strokeWidth={1.8} />
                            </div>
                            <div className="pp-layer-badge">Layer 3</div>
                            <h3>Execution</h3>
                            <p>Warehousing, fulfilment, e-commerce channels, and marketing campaigns — operating from a shared operational state.</p>
                            <div className="pp-layer-footer">
                                <span>Fully integrated</span>
                                <span>Shared state</span>
                            </div>
                        </div>
                    </div>

                    <div className="pp-layers-body">
                        <p>No function operates in isolation. When a compliance rule changes, the execution layer is updated automatically. When inventory drops below threshold, logistics is notified before you notice.</p>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Agent Model ── */}
            <section className="pp-section pp-agent-section">
                <div className="pp-section-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">02 / AGENT MODEL</div>
                        <h2>Autonomous. Supervised. Accountable.</h2>
                        <p className="pp-section-intro">
                            Orbit automates what's safe, reviews what's complex, and lets you decide what matters most.
                        </p>
                    </div>

                    <div className="lp-agent-steps-container">
                        <div className="lp-agent-steps-line"></div>
                        <div className="lp-agent-steps">
                            {/* Autonomous */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap autonomous">
                                    <div className="lp-agent-step-icon">
                                        <Zap size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Autonomous</h3>
                                    <p>Routine tasks run automatically.</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>Routine workflows</li>
                                        <li>Low-risk decisions</li>
                                        <li>High confidence</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Supervised */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap supervised">
                                    <div className="lp-agent-step-icon">
                                        <ShieldCheck size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Supervised</h3>
                                    <p>Complex situations are checked by specialists.</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>Complex exceptions</li>
                                        <li>Medium risk</li>
                                        <li>Learning phase</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Your Approval */}
                            <div className="lp-agent-step">
                                <div className="lp-agent-step-icon-wrap approval">
                                    <div className="lp-agent-step-icon">
                                        <MessageSquare size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="lp-agent-step-content">
                                    <h3>Your Approval</h3>
                                    <p>Critical actions require your decision.</p>
                                </div>
                                <div className="lp-agent-step-card">
                                    <ul>
                                        <li>Critical decisions</li>
                                        <li>High financial impact</li>
                                        <li>SLA overrides</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Dashboard ── */}
            <section className="pp-section pp-dashboard-section">
                <div className="pp-section-inner">
                    <div className="pp-section-header">
                        <div className="lp-section-tag">03 / DASHBOARD</div>
                        <h2>One view across everything.</h2>
                    </div>

                    <div className="pp-dashboard-content">
                        <div className="pp-dashboard-copy">
                            <p>
                                Traditional commerce software provides dashboards.
                                <strong> Orbit provides coordinated execution.</strong>
                            </p>
                            <p>
                                Every part of your US operation — inventory, compliance, orders, logistics — runs in sync. You see the status. We handle the execution.
                            </p>
                        </div>
                        <div className="pp-dashboard-img-wrap">
                            <img
                                src="/assets/dashboard_mockup.png"
                                alt="Orbit Dashboard Interface showing SKU performance and stock analytics"
                                className="lp-dashboard-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 4: CTA ── */}
            <section className="pp-section pp-cta-section">
                <div className="pp-cta-card">
                    <div className="pp-cta-icon">
                        <Settings size={32} strokeWidth={1.5} />
                    </div>
                    <h2>Want to go deeper?</h2>
                    <p>Book a technical walkthrough with the Orbit team. We'll show you exactly how the orchestration layer handles your product category.</p>
                    <button
                        className="lp-btn lp-btn-accent"
                        onClick={() => goTo("/contact")}
                    >
                        Request a Technical Walkthrough →
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <h3 className="lp-footer-tagline">Commerce, Coordinated.</h3>
                    <div className="lp-footer-nav">
                        <div className="lp-footer-col">
                            <a href="/#product">Download</a>
                            <a href="/#product">Platform</a>
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
