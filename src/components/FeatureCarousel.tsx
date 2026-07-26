import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";

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
    ctaLabel?: string;
    ctaHref?: string;
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
        ctaLabel: "Read the case study →",
        ctaHref: "/work/bayangrom",
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
// Below this width, treat as a phone: skip autoplay entirely, require a tap
// to load/play a video, and never allow more than one loaded at once.
const MOBILE_QUERY = "(max-width: 768px)";

function MediaTile({
    item,
    isActivePage,
    isMobile,
    isPlaying,
    onRequestPlay,
}: {
    item: MediaItem;
    isActivePage: boolean;
    isMobile: boolean;
    isPlaying: boolean;
    onRequestPlay: () => void;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Desktop only: start loading/playing once this brand page is active AND
    // the tile has scrolled into view within its gallery row. Mobile never
    // autoplays — see the tap-to-play branch below.
    useEffect(() => {
        if (isMobile) return;
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
    }, [isActivePage, isMobile]);

    if (!item.videoSrc) {
        return (
            <div ref={containerRef} className="cg-media-placeholder">
                <div className="cg-placeholder-orb">
                    <Play size={16} />
                </div>
            </div>
        );
    }

    // Mobile: poster-only until tapped. Only the single tile the user tapped
    // ever loads a video file — tapping another tile hands off playback and
    // this one unmounts its <video>, so at most one is ever loaded.
    if (isMobile && !isPlaying) {
        return (
            <button
                className="cg-media-placeholder cg-media-tap-target"
                onClick={onRequestPlay}
                aria-label="Play video"
            >
                <div className="cg-placeholder-orb">
                    <Play size={16} />
                </div>
            </button>
        );
    }

    const shouldLoad = isMobile ? isPlaying : isVisible;

    return (
        <div ref={containerRef} className="cg-media-video-wrap">
            {/* muted + playsInline are required on iOS Safari — without both,
                the browser force-fullscreens the video on play. */}
            <video ref={videoRef} muted={isMuted} autoPlay={shouldLoad} loop playsInline preload="none">
                {shouldLoad && <source src={item.videoSrc} type="video/mp4" />}
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

function BrandGallery({
    brand,
    isActivePage,
    isMobile,
    playingKey,
    setPlayingKey,
}: {
    brand: BrandPage;
    isActivePage: boolean;
    isMobile: boolean;
    playingKey: string | null;
    setPlayingKey: (key: string | null) => void;
}) {
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
                {brand.ctaHref && brand.ctaLabel && (
                    <a href={brand.ctaHref} className="cg-brand-cta-link">
                        {brand.ctaLabel}
                    </a>
                )}
            </div>

            <div className="cg-media-row-wrap">
                <div className="cg-media-row" ref={rowRef}>
                    {brand.media.map((item, i) => {
                        const key = `${brand.id}:${i}`;
                        return (
                            <div className="cg-media-tile" key={key}>
                                <MediaTile
                                    item={item}
                                    isActivePage={isActivePage}
                                    isMobile={isMobile}
                                    isPlaying={playingKey === key}
                                    onRequestPlay={() => setPlayingKey(key)}
                                />
                            </div>
                        );
                    })}
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
    const [playingKey, setPlayingKey] = useState<string | null>(null);
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const touchStartX = useRef<number | null>(null);
    const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!autoAdvance) return;
        const timer = setInterval(() => {
            // Never carry a "playing" video across brand pages — land fresh.
            setPlayingKey(null);
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
        setPlayingKey(null);
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
                            <BrandGallery
                                brand={brand}
                                isActivePage={i === activeIndex}
                                isMobile={isMobile}
                                playingKey={playingKey}
                                setPlayingKey={setPlayingKey}
                            />
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
