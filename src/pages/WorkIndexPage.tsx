import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./LandingPage.css";
import "./CaseStudyBayangrom.css";

const PLATFORM_URL = "#";
const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

// Emsworth & Karama graduate here once their launches produce a measured result.
const CASE_STUDIES = [
    {
        slug: "bayangrom",
        brand: "Bayangrom",
        summary: "How a <$1M DTC streetwear brand cut landed cost 12% and built a US supply chain that scales.",
        stat: "$180K+ saved / year",
    },
];

export default function WorkIndexPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="landing-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo">
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
                            <li><a href="/#functions">How it works</a></li>
                            <li><a href="/#testimonials">Results</a></li>
                            <li><a href="/#pricing">Pricing</a></li>
                            <li><a href="/lab">Lab</a></li>
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <button className="lp-btn lp-btn-primary" onClick={() => goTo("/auth")}>
                            Book an entry call
                        </button>
                    </div>
                </header>
            </div>

            {/* ── Sticky mobile CTA ── */}
            <div className="lp-mobile-sticky-cta">
                <button className="lp-btn lp-btn-primary" onClick={() => goTo("/auth")}>
                    Book an entry call
                </button>
            </div>

            {/* ── Hero ── */}
            <section className="cs-hero">
                <div className="cs-hero-inner">
                    <h1 className="cs-hero-headline">Real entries. Real numbers.</h1>
                    <p className="cs-hero-sub">
                        The permanent home for Vybd case studies — measured results from brands we've taken into the US.
                    </p>
                </div>
            </section>

            {/* ── Case study list ── */}
            <section className="cs-section">
                <div className="cs-section-inner" style={{ display: "grid", gap: "1.25rem" }}>
                    {CASE_STUDIES.map((cs) => (
                        <Link
                            key={cs.slug}
                            to={`/work/${cs.slug}`}
                            style={{
                                display: "block",
                                padding: "1.75rem",
                                border: "1px solid var(--lp-outline-variant)",
                                borderRadius: "14px",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <div className="lp-section-tag" style={{ marginBottom: "0.5rem" }}>{cs.brand}</div>
                            <p className="cs-body-text" style={{ margin: 0 }}>{cs.summary}</p>
                            <div className="cg-brand-subline" style={{ marginTop: "1rem" }}>{cs.stat}</div>
                        </Link>
                    ))}
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
