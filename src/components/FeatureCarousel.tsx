import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";

type MediaItem = {
    // Left empty until real footage/storefront captures are cleared for use.
    // Once ready, drop files into public/videos/ and point this at
    // "/videos/<filename>.mp4" — e.g. videoSrc: "/videos/bayangrom-1.mp4".
    // Nothing else needs to change; muted autoplay, lazy loading, and
    // sound-on-click already wire up automatically once an item has one.
    videoSrc?: string;
};

type BrandPage = {
    id: string;
    brand: string;
    caption: string;
    subLine?: string;
    media: MediaItem[]; // 4-5 videos/images for this brand
};

// Fixed order — strongest proof first. Real, permission-cleared clients only.
// Each brand gets its own full page with its own media gallery.
const BRANDS: BrandPage[] = [
    {
        id: "bayangrom",
        brand: "Bayangrom",
        caption: "Indian streetwear, now built to scale across the US.",
        subLine: "35% faster fulfillment · ~$180K saved in year one",
        media: [{}, {}, {}, {}, {}],
    },
    {
        id: "emsworth",
        brand: "Emsworth",
        caption: "Premium terry cotton essentials, now selling direct to US buyers.",
        subLine: "$100K+ combined pre-orders · with Karama",
        media: [{}, {}, {}, {}],
    },
    {
        id: "karama",
        brand: "Karama",
        caption: "One of our two newest US launches, already gaining traction.",
        subLine: "$100K+ combined pre-orders · with Emsworth",
        media: [{}, {}, {}, {}],
    },
    {
        id: "indian-tapas",
        brand: "The Indian Tapas",
        caption: "Modern Indian street food, now live in the US.",
        media: [{}, {}, {}, {}],
    },
    {
        id: "flavor-atlas",
        brand: "Flavor Atlas",
        caption: "Premium exotic produce, now live in the US.",
        media: [{}, {}, {}, {}],
    },
    {
        id: "kashida-layone",
        brand: "Kashida Layone",
        caption: "Original fine art, now live in the US.",
        media: [{}, {}, {}, {}],
    },
];

const AUTO_ADVANCE_MS = 8000;
const RESUME_AFTER_MS = 12000;

function MediaTile({ item, isActivePage }: { item: MediaItem; isActivePage: boolean }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Only start loading/playing once this brand page is the active one AND
    // the tile has actually scrolled into view within its gallery row —
    // with up to 5 items per brand across 6 brands, loading everything
    // up front would wreck first paint.
    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isActivePage) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25, root: el.closest(".cg-media-row") }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [isActivePage]);

    if (!item.videoSrc) {
        return (
            <div ref={containerRef} className="cg-media-placeholder">
                <div className="cg-placeholder-orb">
                    <Play size={16} />
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="cg-media-video-wrap">
            <video ref={videoRef} muted={isMuted} autoPlay={isVisible} loop playsInline preload="none">
                {isVisible && <source src={item.videoSrc} type="video/mp4" />}
            </video>
            <button
                className="cg-sound-toggle"
                onClick={(e) => {
                    e.stopPropagation();
                    const video = videoRef.current;
                    if (!video) return;
                    video.muted = !video.muted;
                    setIsMuted(video.muted);
                }}
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
        </div>
    );
}

function BrandGallery({ brand, isActivePage }: { brand: BrandPage; isActivePage: boolean }) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scrollNext = () => {
        const row = rowRef.current;
        if (!row) return;
        const tile = row.querySelector<HTMLElement>(".cg-media-tile");
        const step = tile ? tile.offsetWidth + 12 : row.clientWidth * 0.8;
        row.scrollBy({ left: step, behavior: "smooth" });
    };

    return (
        <div className="cg-brand-page">
            <div className="cg-brand-header">
                <h3 className="cg-brand-name">{brand.brand}</h3>
                <p className="cg-brand-caption">{brand.caption}</p>
                {brand.subLine && <div className="cg-brand-subline">{brand.subLine}</div>}
            </div>

            <div className="cg-media-row-wrap">
                <div className="cg-media-row" ref={rowRef}>
                    {brand.media.map((item, i) => (
                        <div className="cg-media-tile" key={`${brand.id}:${i}`}>
                            <MediaTile item={item} isActivePage={isActivePage} />
                        </div>
                    ))}
                </div>
                <button className="cg-media-next" onClick={scrollNext} aria-label={`See more from ${brand.brand}`}>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default function FeatureCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoAdvance, setAutoAdvance] = useState(true);
    const touchStartX = useRef<number | null>(null);
    const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!autoAdvance) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % BRANDS.length);
        }, AUTO_ADVANCE_MS);
        return () => clearInterval(timer);
    }, [autoAdvance]);

    useEffect(() => {
        return () => {
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
        };
    }, []);

    const pauseThenResume = () => {
        setAutoAdvance(false);
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => setAutoAdvance(true), RESUME_AFTER_MS);
    };

    const goTo = (index: number) => {
        setActiveIndex((index + BRANDS.length) % BRANDS.length);
        pauseThenResume();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
            if (delta < 0) goTo(activeIndex + 1);
            else goTo(activeIndex - 1);
        }
        touchStartX.current = null;
    };

    return (
        <div
            className="cg-carousel"
            onMouseEnter={() => setAutoAdvance(false)}
            onMouseLeave={() => setAutoAdvance(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="cg-carousel-viewport">
                <div className="cg-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                    {BRANDS.map((brand, i) => (
                        <div className="cg-carousel-slide" key={brand.id}>
                            <BrandGallery brand={brand} isActivePage={i === activeIndex} />
                        </div>
                    ))}
                </div>

                <button className="cg-arrow cg-arrow-prev" onClick={() => goTo(activeIndex - 1)} aria-label="Previous brand">
                    <ChevronLeft size={20} />
                </button>
                <button className="cg-arrow cg-arrow-next" onClick={() => goTo(activeIndex + 1)} aria-label="Next brand">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="cg-dots">
                {BRANDS.map((brand, i) => (
                    <button
                        key={brand.id}
                        className={`cg-dot ${i === activeIndex ? "active" : ""}`}
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${brand.brand}`}
                    />
                ))}
            </div>
        </div>
    );
}
