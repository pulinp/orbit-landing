import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Play } from "lucide-react";
import "./LandingPage.css";
import "./CaseStudyBayangrom.css";

const PLATFORM_URL = "#";
const goTo = (path: string) => {
    window.location.href = `${PLATFORM_URL}${path}`;
};

const RESULTS_STRIP = [
    { value: "↓12%", label: "Landed cost" },
    { value: "↓35%", label: "Fulfillment time" },
    { value: "↓28%", label: "Excess inventory" },
    { value: "$180K+", label: "Saved / year" },
];

const META_CHIPS = ["DTC Streetwear", "<$1M revenue", "Shopify → Amazon", "Premium graphic tees & hoodies"];

const TIMELINE = [
    {
        phase: "Weeks 1–2",
        title: "Diagnostic",
        description: "SKU profitability analysis, freight cost breakdown, lead-time mapping.",
    },
    {
        phase: "Weeks 3–6",
        title: "Infrastructure build",
        description: "Forecasting engine deployed, suppliers onboarded, US warehouse network set up.",
    },
    {
        phase: "Weeks 6–10",
        title: "Execution",
        description: "Inventory rebalancing, carrier renegotiation, automated replenishment triggers.",
    },
    {
        phase: "Ongoing",
        title: "Optimization",
        description: "Weekly demand tuning, cost tracking, margin expansion.",
    },
];

const RESULTS_TABLE = [
    { metric: "Shipping cost / order", before: "$9.20", after: "$7.15", impact: "↓ 22%" },
    { metric: "Lead time", before: "5.2 days", after: "3.4 days", impact: "↓ 35%" },
    { metric: "Inventory waste", before: "High", after: "Reduced", impact: "↓ 28%" },
    { metric: "Stockouts", before: "Frequent", after: "Controlled", impact: "↓ 40%" },
    { metric: "Data visibility", before: "None", after: "Real-time", impact: "—" },
    { metric: "Gross margin", before: "Baseline", after: "+6 pts", impact: "—" },
];

export default function BayangromCaseStudyPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const prevTitle = document.title;
        document.title = "How Bayangrom built a scalable US supply chain with Vybd";

        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute(
            "content",
            "A <$1M DTC streetwear brand cut landed cost 12%, sped fulfillment 35%, and unlocked $180K+ in annual savings in 90 days."
        );

        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
        };
    }, []);

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
                    <Link to="/work" className="cs-back-link">← Back to case studies</Link>

                    <h1 className="cs-hero-headline">
                        How Bayangrom cut costs 12% and built a US supply chain that scales.
                    </h1>
                    <p className="cs-hero-sub">
                        A &lt;$1M DTC streetwear brand, from operational losses to a real operating engine — in 90 days.
                    </p>

                    <div className="cs-meta-chips">
                        {META_CHIPS.map((chip) => (
                            <div className="lp-feature-pill" key={chip}>{chip}</div>
                        ))}
                    </div>

                    <div className="cs-results-strip">
                        {RESULTS_STRIP.map((stat) => (
                            <div className="cs-result-stat" key={stat.label}>
                                <div className="cs-result-value">{stat.value}</div>
                                <div className="cs-result-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── About the brand ── */}
            <section className="cs-section">
                <div className="cs-section-inner">
                    <div className="lp-section-tag">01 / THE BRAND</div>
                    <div className="cs-about-layout">
                        <p className="cs-body-text">
                            Bayangrom is a fast-growing DTC streetwear brand built on bold identity, oversized fits, and premium-feel garments — "luxury streetwear meets cultural identity." Graphic tees and hoodies, Shopify-first, with ambitions to scale into Amazon and the US streetwear mainstream.
                        </p>
                        <div className="cs-photo-placeholder-row">
                            <div className="cs-photo-placeholder" />
                            <div className="cs-photo-placeholder" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── The Challenge ── */}
            <section className="cs-section cs-section-tinted">
                <div className="cs-section-inner">
                    <div className="lp-section-tag">02 / THE CHALLENGE</div>
                    <p className="cs-challenge-text">
                        Bayangrom was designing products people wanted — and losing money getting them out the door. Early-stage logistics meant high shipping costs, frequent stockouts, excess inventory tying up cash, and no real-time view of any of it. Great brand, no operating engine underneath it.
                    </p>
                </div>
            </section>

            {/* ── What We Did — Timeline ── */}
            <section className="cs-section">
                <div className="cs-section-inner">
                    <div className="lp-section-tag">03 / THE OPERATING ENGINE</div>
                    <h2 className="cs-section-heading">What we did.</h2>

                    <div className="cs-timeline">
                        {TIMELINE.map((step, i) => (
                            <div className="cs-timeline-step" key={i}>
                                <div className="cs-timeline-marker">
                                    <div className="cs-timeline-dot" />
                                    {i < TIMELINE.length - 1 && <div className="cs-timeline-line" />}
                                </div>
                                <div className="cs-timeline-content">
                                    <div className="cs-timeline-phase">{step.phase}</div>
                                    <h3 className="cs-timeline-title">{step.title}</h3>
                                    <p className="cs-timeline-desc">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Results Table ── */}
            <section className="cs-section cs-section-tinted">
                <div className="cs-section-inner">
                    <div className="lp-section-tag">04 / RESULTS</div>
                    <h2 className="cs-section-heading">Before → after.</h2>

                    <div className="cs-table-wrap">
                        <table className="cs-table">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Before</th>
                                    <th>After</th>
                                    <th>Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RESULTS_TABLE.map((row) => (
                                    <tr key={row.metric}>
                                        <td className="cs-table-metric">{row.metric}</td>
                                        <td>{row.before}</td>
                                        <td>{row.after}</td>
                                        <td className="cs-table-impact">{row.impact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── Founder Testimonial ── */}
            <section className="cs-section">
                <div className="cs-section-inner">
                    <div className="lp-section-tag">05 / IN THEIR WORDS</div>

                    <div className="cs-testimonial-layout">
                        <blockquote className="cs-pull-quote">
                            "We were designing great products, but losing money operationally. Vybd rebuilt how we run the business — suppliers, shipping, inventory. Within weeks, costs dropped and delivery sped up. It felt like we finally had a real company behind the brand."
                            <cite>— Founder, Bayangrom</cite>
                        </blockquote>

                        <div className="cs-video-placeholder">
                            <div className="cs-placeholder-orb">
                                <Play size={18} />
                            </div>
                            <span className="cs-video-placeholder-label">Founder video — coming soon</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Positioning line ── */}
            <section className="cs-positioning">
                <p>Not a consultant. Not a tool. A full-stack operating partner.</p>
            </section>

            {/* ── CTA ── */}
            <section className="lp-final-cta" id="final-cta">
                <div className="lp-final-cta-card lp-dark">
                    <h2>Ready to build yours?</h2>
                    <div className="lp-final-cta-buttons">
                        <button className="lp-btn lp-btn-primary" onClick={() => goTo("/auth")}>
                            Book an entry call
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
