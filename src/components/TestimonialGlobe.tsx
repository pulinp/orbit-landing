import { useEffect, useRef, useCallback } from "react";

const N = 80;
const RADIUS = 230;

const baseQuotes = [
    "Absolutely stunning turnaround. Orbit has been a game-changer.",
    "The only platform that understood our B2B SaaS needs right out of the box.",
    "Our revenue doubled in a month. I cannot recommend this highly enough.",
    "Incredible support and flawless execution across the board. They moved incredibly fast.",
    "Smooth integration, stellar documentation, and immediately profitable.",
    "A true game changer for our international strategy. Can't imagine selling without them.",
    "The ROI we've seen since switching is simply undeniable. It pays for itself.",
    "We've established Bluelofts to fulfill our promise of responsible development that improves lives.",
];
const names = ["John W.", "Sarah L.", "Alex D.", "Michael B.", "David W.", "Emily R.", "Priya M.", "Lisa T."];
const roles = ["CEO @ Bluelofts", "CTO @ Bayangrom", "Founder @ TechNova", "VP Sales @ GrowthInc", "Director @ Logix", "Engineer @ SaaSable", "Lead @ HomeGoods", "CEO @ MetricsAI"];

interface TestimonialData {
    id: number;
    quote: string;
    name: string;
    title: string;
    avatar: string;
}

const testimonialsData: TestimonialData[] = [];
for (let i = 0; i < N; i++) {
    testimonialsData.push({
        id: i + 1,
        quote: baseQuotes[i % baseQuotes.length],
        name: names[i % names.length],
        title: roles[i % roles.length],
        avatar: `https://i.pravatar.cc/100?img=${(i % 50) + 1}`,
    });
}

const phi = Math.PI * (3 - Math.sqrt(5));

interface TileData {
    el: HTMLDivElement | null;
    lat: number;
    lon: number;
    index: number;
}

export default function TestimonialGlobe() {
    const sphereRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const tilesRef = useRef<TileData[]>([]);
    const activeTileRef = useRef<HTMLDivElement | null>(null);
    const animFrameRef = useRef<number>(0);

    const rotRef = useRef({ x: -10, y: 0 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startRotX: -10, startRotY: 0 });

    const indexRef = useRef<HTMLSpanElement>(null);
    const quoteRef = useRef<HTMLParagraphElement>(null);
    const nameRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const avatarRef = useRef<HTMLImageElement>(null);

    const updateCard = useCallback((index: number) => {
        const data = testimonialsData[index];
        if (indexRef.current) indexRef.current.innerText = `#0${data.id} / ${N}`;
        if (quoteRef.current) quoteRef.current.innerText = `"${data.quote}"`;
        if (nameRef.current) nameRef.current.innerText = data.name;
        if (titleRef.current) titleRef.current.innerText = data.title;
        if (avatarRef.current) avatarRef.current.src = data.avatar;
    }, []);

    useEffect(() => {
        const sphere = sphereRef.current;
        const scene = sceneRef.current;
        if (!sphere || !scene) return;

        // Clear any existing tiles
        sphere.innerHTML = "";
        tilesRef.current = [];

        // Build tiles
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2;
            Math.sqrt(1 - y * y); // radial distance (used implicitly in lat/lon calc)
            const theta = phi * i;
            const lat = Math.asin(y) * (180 / Math.PI);
            const lon = theta * (180 / Math.PI);

            const rootEl = document.createElement("div");
            rootEl.className = "tg-globe-tile";
            rootEl.style.transform = `rotateY(${lon}deg) rotateX(${lat}deg) translateZ(${RADIUS}px)`;
            rootEl.dataset.lat = String(lat);
            rootEl.dataset.lon = String(lon);

            const inner = document.createElement("div");
            inner.className = "tg-tile-inner";
            rootEl.appendChild(inner);

            sphere.appendChild(rootEl);
            tilesRef.current.push({ el: rootEl, lat, lon, index: i });
        }

        // Drag handlers
        const onMouseDown = (e: MouseEvent) => {
            dragRef.current.isDragging = true;
            dragRef.current.startX = e.clientX;
            dragRef.current.startY = e.clientY;
            dragRef.current.startRotX = rotRef.current.x;
            dragRef.current.startRotY = rotRef.current.y;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            rotRef.current.y = dragRef.current.startRotY + deltaX * 0.4;
            rotRef.current.x = Math.max(-85, Math.min(85, dragRef.current.startRotX - deltaY * 0.4));
        };

        const onMouseUp = () => { dragRef.current.isDragging = false; };

        // Touch handlers
        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1) return;
            dragRef.current.isDragging = true;
            dragRef.current.startX = e.touches[0].clientX;
            dragRef.current.startY = e.touches[0].clientY;
            dragRef.current.startRotX = rotRef.current.x;
            dragRef.current.startRotY = rotRef.current.y;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!dragRef.current.isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - dragRef.current.startX;
            const deltaY = e.touches[0].clientY - dragRef.current.startY;
            rotRef.current.y = dragRef.current.startRotY + deltaX * 0.4;
            rotRef.current.x = Math.max(-85, Math.min(85, dragRef.current.startRotX - deltaY * 0.4));
        };

        const onTouchEnd = () => { dragRef.current.isDragging = false; };

        scene.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mouseleave", onMouseUp);
        scene.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        // Animation loop
        const tick = () => {
            if (!dragRef.current.isDragging) {
                rotRef.current.y -= 0.15;
            }

            sphere.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;

            let minOffset = Infinity;
            let winner: TileData | null = null;

            for (let i = 0; i < tilesRef.current.length; i++) {
                const t = tilesRef.current[i];
                let visualLon = (t.lon + rotRef.current.y) % 360;
                if (visualLon > 180) visualLon -= 360;
                if (visualLon < -180) visualLon += 360;

                let visualLat = (t.lat + rotRef.current.x) % 360;
                if (visualLat > 180) visualLat -= 360;
                if (visualLat < -180) visualLat += 360;

                const dist = Math.sqrt(visualLon * visualLon + visualLat * visualLat);
                if (dist < minOffset) {
                    minOffset = dist;
                    winner = t;
                }
            }

            if (winner && winner.el && winner.el !== activeTileRef.current) {
                if (activeTileRef.current) activeTileRef.current.classList.remove("active");
                winner.el.classList.add("active");
                activeTileRef.current = winner.el;
                updateCard(winner.index);
            }

            animFrameRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            scene.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseleave", onMouseUp);
            scene.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [updateCard]);

    return (
        <section className="tg-globe-section" id="testimonial-globe">
            <div className="tg-dual-panel">
                {/* Left: Text + Active Testimonial Card */}
                <div className="tg-content-side">
                    <header className="tg-grid-header">
                        <span className="tg-orbit-label">Global Impact ↗</span>
                        <h2 className="tg-orbit-heading">The world revolves around Orbit</h2>
                        <p className="tg-orbit-sub">
                            Grab and spin our interactive globe to see how we've scaled brands across the Americas.
                        </p>
                    </header>

                    <div className="tg-active-testimonial-card">
                        <div className="tg-quote-header">
                            <span className="tg-quote-number" ref={indexRef}>#01 / 80</span>
                            <span className="tg-pulse-indicator"></span>
                        </div>
                        <p className="tg-main-quote" ref={quoteRef}>
                            "We've established Bluelofts to fulfill our promise of responsible development that improves lives across the United States. Orbit's infrastructure made this possible."
                        </p>
                        <div className="tg-main-client">
                            <img
                                src="https://i.pravatar.cc/100?img=11"
                                alt="Avatar"
                                className="tg-avatar"
                                ref={avatarRef}
                            />
                            <div className="tg-client-details">
                                <strong ref={nameRef}>John Williams</strong>
                                <span ref={titleRef}>CEO @ Bluelofts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive 3D Globe */}
                <div className="tg-globe-side">
                    <div className="tg-drag-instruction">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l-7 7 7 7" />
                        </svg>
                        Drag to rotate
                    </div>

                    <div className="tg-scene" ref={sceneRef}>
                        <div className="tg-sphere" ref={sphereRef}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
