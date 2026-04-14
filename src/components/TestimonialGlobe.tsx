import { useState, useEffect } from "react";
import { Globe } from "./ui/cobe-globe";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sorted by longitude: west to east (US → Europe → Asia)
const testimonialsSource = [
    {
        name: "Keshida Layone",
        initials: "KL",
        quote: "There's a particular kind of silence when your work is good and no one who can afford it knows you exist. Orbit broke that silence. Not with noise — with precision. The right eyes found me. The rest followed.",
        title: "Visual Artist & Founder, Fine Art Brand — USA",
        metric: "→ First international collector sales, week three"
    },
    {
        name: "Karama",
        initials: "K",
        quote: "Every market has a language. Ours didn't translate — not because the brand wasn't strong, but because we were speaking to people who didn't have the context yet. Orbit built that bridge. Same brand, new conversation.",
        title: "Creative Director, Fashion Brand — USA",
        metric: "→ First international stockist secured, week six"
    },
    {
        name: "Elena S.",
        initials: "ES",
        quote: "Scaling into North America felt like a gamble until we found Orbit. They didn't just provide a platform; they provided a roadmap. The level of operational detail they handle allowed us to focus entirely on the creative side of the brand.",
        title: "Founder, Sustainable Decor Brand — Mexico City, Mexico",
        metric: "→ 3x growth in North American reach, quarter one"
    },
    {
        name: "Emsworth Terry Cotton",
        initials: "ETC",
        quote: "We didn't need someone to just sell for us. We needed to understand the room — who was already in it, what they were charging, where the gap was. Orbit came back with answers we hadn't thought to ask for. We positioned around them and it landed exactly right.",
        title: "Founder, Premium Cotton Goods Brand — UK",
        metric: "→ Wholesale enquiries up 4x, month two"
    },
    {
        name: "Lucas M.",
        initials: "LM",
        quote: "Compliance in the US is a massive roadblock for European health tech. We anticipated six months of deep legal review before even seeing a customer. Orbit's native infrastructure bypassed the friction completely—we were fully compliant and selling in under three weeks.",
        title: "Director of Ops, HealthTech Brand — Berlin, Germany",
        metric: "→ US market entry accelerated by 5 months"
    },
    {
        name: "Bayangrom",
        initials: "B",
        quote: "The brand was alive. The orders were coming. But the backend was swallowing us whole. Orbit took the weight — literally. Warehousing, shipping, fulfilment — handled. We got back to building, not firefighting.",
        title: "Founder, Cultural Streetwear Brand — India",
        metric: "→ Fulfilment time cut from 12 days to 3"
    },
    {
        name: "Priya M.",
        initials: "PM",
        quote: "We went from zero US presence to $40K in revenue in our first month. I didn't have to think about warehousing or Amazon once.",
        title: "CEO, Home Goods Brand — Bangalore, India",
        metric: "→ $40K US revenue, month one"
    },
    {
        name: "Ji-Hoon K.",
        initials: "JK",
        quote: "We'd been trying to crack the US market for eighteen months. We had a great product, a team that believed in it, and no idea how to navigate FDA requirements at the same time as an Amazon launch. Orbit had us live in twelve days. I still don't fully understand how they moved that fast.",
        title: "Founder, Premium Skincare Brand — Seoul, Korea",
        metric: "→ $82K US revenue, month one"
    }
];

const NYC_LOCATION: [number, number] = [40.7128, -74.006];

const globeMarkers = [
  { id: "nyc", location: NYC_LOCATION, label: "Orbit Operations (NY)" },
  { id: "t1", location: [34.0522, -118.2437] as [number, number], label: "Los Angeles, USA" },
  { id: "t2", location: [41.8781, -87.6298] as [number, number], label: "Chicago, USA" },
  { id: "t3", location: [19.4326, -99.1332] as [number, number], label: "Mexico City, Mexico" },
  { id: "t4", location: [51.5074, -0.1278] as [number, number], label: "London, UK" },
  { id: "t5", location: [52.5200, 13.4050] as [number, number], label: "Berlin, Germany" },
  { id: "t6", location: [19.0760, 72.8777] as [number, number], label: "Mumbai, India" },
  { id: "t7", location: [12.9716, 77.5946] as [number, number], label: "Bangalore, India" },
  { id: "t8", location: [37.5665, 126.9780] as [number, number], label: "Seoul, Korea" },
];

const globeArcs = [
  { id: "arc1", from: [34.0522, -118.2437] as [number, number], to: NYC_LOCATION, label: "Keshida Layone (Los Angeles → New York)" },
  { id: "arc2", from: [41.8781, -87.6298] as [number, number], to: NYC_LOCATION, label: "Karama (Chicago → New York)" },
  { id: "arc3", from: [19.4326, -99.1332] as [number, number], to: NYC_LOCATION, label: "Elena S. (Mexico City → New York)" },
  { id: "arc4", from: [51.5074, -0.1278] as [number, number], to: NYC_LOCATION, label: "Emsworth Terry Cotton (London → New York)" },
  { id: "arc5", from: [52.5200, 13.4050] as [number, number], to: NYC_LOCATION, label: "Lucas M. (Berlin → New York)" },
  { id: "arc6", from: [19.0760, 72.8777] as [number, number], to: NYC_LOCATION, label: "Bayangrom (Mumbai → New York)" },
  { id: "arc7", from: [12.9716, 77.5946] as [number, number], to: NYC_LOCATION, label: "Priya M. (Bangalore → New York)" },
  { id: "arc8", from: [37.5665, 126.9780] as [number, number], to: NYC_LOCATION, label: "Ji-Hoon K. (Seoul → New York)" },
];

export default function TestimonialGlobe() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoAdvance, setAutoAdvance] = useState(true);

    // Auto-advance testimonials every 12 seconds (reduced switch speed)
    useEffect(() => {
        if (!autoAdvance) return;
        
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonialsSource.length);
        }, 12000);

        return () => clearInterval(timer);
    }, [autoAdvance]);

    const handleMarkerClick = (id: string) => {
        if (id.startsWith('t')) {
            const idx = parseInt(id.replace('t', '')) - 1;
            if (!isNaN(idx)) {
                setActiveIndex(idx);
                setAutoAdvance(false);
                
                // Resume auto-advance after 12 seconds of no interaction
                const resumeTimer = setTimeout(() => setAutoAdvance(true), 12000);
                return () => clearTimeout(resumeTimer);
            }
        }
    };

    const handlePrevious = () => {
        setActiveIndex((prev) => (prev - 1 + testimonialsSource.length) % testimonialsSource.length);
        setAutoAdvance(false);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonialsSource.length);
        setAutoAdvance(false);
    };

    const active = testimonialsSource[activeIndex];
    const activeMarkerId = `t${activeIndex + 1}`;
    const activeMarkerData = globeMarkers.find(m => m.id === activeMarkerId);
    
    const dynamicMarkers = globeMarkers.map((m) => {
        // We only want to see the start (active brand location) and the end node (NYC) labels
        const isActiveNode = m.id === activeMarkerId || m.id === 'nyc';
        
        return {
            ...m,
            label: isActiveNode ? m.label : undefined
        };
    });

    return (
        <section className="tg-globe-section" id="testimonials">
            <div className="tg-dual-panel">
                {/* Left: Text + Active Testimonial Card */}
                <div className="tg-content-side">
                    <header className="tg-grid-header">
                        <span className="tg-orbit-label">Global Impact ↗</span>
                        <h2 className="tg-orbit-heading">Built around companies that move the world</h2>
                        <p className="tg-orbit-sub">
                            Spin the world. Our clients left something for you.
                        </p>
                    </header>

                    <div className="tg-active-testimonial-card shadow-premium\" style={{ minHeight: '280px' }}>
                        <div className="tg-card-top-row">
                            <div className="tg-quote-section-group">
                                <div className="tg-quote-icon-large">“</div>
                                <div className="tg-card-meta-below">
                                    <span className="tg-quote-number">#{String(activeIndex + 1).padStart(2, '0')} / 08</span>
                                    <span className="tg-pulse-indicator"></span>
                                </div>
                            </div>
                        </div>

                        <p className="tg-main-quote">
                            {active.quote}
                        </p>

                        <div className="tg-main-client">
                            <div className="tg-pulsing-orb">
                                <span className="tg-orb-initials">{active.initials}</span>
                            </div>
                            <div className="tg-client-details">
                                <strong>{active.name}</strong>
                                <span>{active.title}</span>
                                <span className="tg-client-metric">{active.metric}</span>
                            </div>
                        </div>

                        {/* Navigation Controls Inside Card */}
                        <div className="tg-nav-controls">
                            <button 
                                className="tg-nav-button" 
                                onClick={handlePrevious}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                className="tg-nav-button" 
                                onClick={handleNext}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive 3D Globe */}
                <div className="tg-globe-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe 
                        markers={dynamicMarkers}
                        onMarkerClick={handleMarkerClick}
                        focusLocation={activeMarkerData?.location}
                        arcs={globeArcs.map((arc, idx) => ({
                            ...arc,
                            label: idx === activeIndex ? arc.label : undefined,
                            color: idx === activeIndex ? ([0.1, 0.1, 0.2] as [number, number, number]) : ([0.85, 0.85, 0.85] as [number, number, number])
                        }))}
                        className="w-full max-w-lg"
                        markerColor={[0.3, 0.45, 0.85]}
                        baseColor={[1, 1, 1]}
                        arcColor={[0.3, 0.45, 0.85]}
                        glowColor={[0.94, 0.93, 0.91]}
                        dark={0}
                        mapBrightness={10}
                        markerSize={0.025}
                        markerElevation={0.01}
                        speed={0.005} // Slower rotation: ~20 seconds per full rotation
                    />
                </div>
            </div>
        </section>
    );
}
