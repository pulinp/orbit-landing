import { useEffect, useRef } from "react";

// ─── Generate target points by drawing directly onto an offscreen canvas ───
function generateDesignPoints(w: number, h: number, count: number): Array<{ x: number; y: number }> {
    const oc = document.createElement("canvas");
    oc.width = w;
    oc.height = h;
    const ctx = oc.getContext("2d")!;

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = Math.min(w, h) * 0.005;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.40;   // ring radius
    const ic = Math.min(w, h) * 0.20;  // icon size scale

    // ── 4 icon positions on the ring ──
    const positions = [
        { angle: -135, label: "tl" },  // top-left
        { angle: -45, label: "tr" },  // top-right
        { angle: 135, label: "bl" },  // bottom-left
        { angle: 45, label: "br" },  // bottom-right
    ];

    const iconCentres = positions.map(p => ({
        x: cx + Math.cos((p.angle * Math.PI) / 180) * r,
        y: cy + Math.sin((p.angle * Math.PI) / 180) * r,
        label: p.label,
    }));

    // ── Draw ring arcs (4 segments, each skipping ~30° around each icon) ──
    const gapRad = (28 * Math.PI) / 180;
    const angles = [-135, -45, 45, 135].map(d => (d * Math.PI) / 180);

    for (let i = 0; i < 4; i++) {
        const startAngle = angles[i] + gapRad;
        const endAngle = angles[(i + 1) % 4] - gapRad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.stroke();
    }

    // ── Helper: draw icon at (ix, iy) with scale s ──
    const s = ic / 20;

    function drawApple(ix: number, iy: number) {
        // Body (two overlapping circles)
        ctx.beginPath();
        ctx.ellipse(ix - 2.5 * s, iy + s, 4.5 * s, 5.5 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(ix + 2.5 * s, iy + s, 4.5 * s, 5.5 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Stem
        ctx.beginPath();
        ctx.moveTo(ix, iy - 4.5 * s);
        ctx.bezierCurveTo(ix, iy - 8 * s, ix + 3.5 * s, iy - 9 * s, ix + 3.5 * s, iy - 9 * s);
        ctx.stroke();
        // Leaf
        ctx.beginPath();
        ctx.moveTo(ix, iy - 6.5 * s);
        ctx.bezierCurveTo(ix - 3.5 * s, iy - 9.5 * s, ix - 5.5 * s, iy - 6.5 * s, ix, iy - 6.5 * s);
        ctx.stroke();
    }

    function drawCup(ix: number, iy: number) {
        ctx.beginPath();
        ctx.moveTo(ix - 4 * s, iy - 5 * s);
        ctx.lineTo(ix - 5 * s, iy + 6 * s);
        ctx.lineTo(ix + 5 * s, iy + 6 * s);
        ctx.lineTo(ix + 4 * s, iy - 5 * s);
        ctx.closePath();
        ctx.stroke();
        // Lid line
        ctx.beginPath();
        ctx.moveTo(ix - 4.5 * s, iy - 3 * s);
        ctx.lineTo(ix + 4.5 * s, iy - 3 * s);
        ctx.stroke();
        // Straw
        ctx.beginPath();
        ctx.moveTo(ix + 2 * s, iy - 5 * s);
        ctx.lineTo(ix, iy - 11 * s);
        ctx.stroke();
    }

    function drawPharmaBottle(ix: number, iy: number) {
        // Body
        ctx.beginPath();
        ctx.roundRect(ix - 5 * s, iy - 3 * s, 10 * s, 11 * s, 2 * s);
        ctx.stroke();
        // Cap
        ctx.beginPath();
        ctx.roundRect(ix - 3 * s, iy - 7.5 * s, 6 * s, 5 * s, 1.5 * s);
        ctx.stroke();
        // Cross
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ix, iy + 5 * s);
        ctx.moveTo(ix - 3 * s, iy + 2.5 * s);
        ctx.lineTo(ix + 3 * s, iy + 2.5 * s);
        ctx.stroke();
    }

    function drawPill(ix: number, iy: number) {
        ctx.beginPath();
        ctx.roundRect(ix - 5 * s, iy - 2 * s, 10 * s, 4 * s, 2 * s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ix, iy - 2 * s);
        ctx.lineTo(ix, iy + 2 * s);
        ctx.stroke();
    }

    function drawBox(ix: number, iy: number) {
        // Main box
        ctx.beginPath();
        ctx.roundRect(ix - 6 * s, iy - 2 * s, 12 * s, 9 * s, 1.5 * s);
        ctx.stroke();
        // Horizontal divider
        ctx.beginPath();
        ctx.moveTo(ix - 6 * s, iy + 2.5 * s);
        ctx.lineTo(ix + 6 * s, iy + 2.5 * s);
        ctx.stroke();
        // Vertical dividers on top half
        ctx.beginPath();
        ctx.moveTo(ix - 2 * s, iy - 2 * s);
        ctx.lineTo(ix - 2 * s, iy + 2.5 * s);
        ctx.moveTo(ix + 2 * s, iy - 2 * s);
        ctx.lineTo(ix + 2 * s, iy + 2.5 * s);
        ctx.stroke();
        // Flap (top)
        ctx.beginPath();
        ctx.moveTo(ix - 6 * s, iy - 2 * s);
        ctx.lineTo(ix - 2 * s, iy - 6.5 * s);
        ctx.lineTo(ix + 2 * s, iy - 6.5 * s);
        ctx.lineTo(ix + 6 * s, iy - 2 * s);
        ctx.stroke();
    }

    function drawShoppingBag(ix: number, iy: number) {
        ctx.beginPath();
        ctx.moveTo(ix - 6 * s, iy - 1 * s);
        ctx.lineTo(ix - 4 * s, iy + 7 * s);
        ctx.lineTo(ix + 4 * s, iy + 7 * s);
        ctx.lineTo(ix + 6 * s, iy - 1 * s);
        ctx.closePath();
        ctx.stroke();
        // Handle
        ctx.beginPath();
        ctx.moveTo(ix - 3 * s, iy - 1 * s);
        ctx.bezierCurveTo(ix - 3 * s, iy - 6 * s, ix + 3 * s, iy - 6 * s, ix + 3 * s, iy - 1 * s);
        ctx.stroke();
    }

    function drawPerson(ix: number, iy: number) {
        // Head
        ctx.beginPath();
        ctx.arc(ix, iy - 7 * s, 3 * s, 0, Math.PI * 2);
        ctx.stroke();
        // Body
        ctx.beginPath();
        ctx.moveTo(ix - 4 * s, iy + 6 * s);
        ctx.lineTo(ix - 4 * s, iy - 1 * s);
        ctx.bezierCurveTo(ix - 4 * s, iy - 4 * s, ix + 4 * s, iy - 4 * s, ix + 4 * s, iy - 1 * s);
        ctx.lineTo(ix + 4 * s, iy + 6 * s);
        ctx.stroke();
    }

    // ── Place icons at corners ──
    const off = ic * 0.52; // offset between paired icons

    iconCentres.forEach(({ x, y, label }) => {
        if (label === "tl") {
            drawApple(x - off, y);
            drawCup(x + off, y);
        } else if (label === "tr") {
            drawPharmaBottle(x - off * 0.5, y);
            drawPill(x + off * 0.9, y - ic * 0.15);
            drawPill(x + off * 0.9, y + ic * 0.25);
        } else if (label === "bl") {
            drawBox(x, y);
        } else if (label === "br") {
            drawShoppingBag(x - off * 0.6, y);
            drawPerson(x + off * 0.7, y);
        }
    });

    // ── Sample every dark pixel for maximum coverage ──
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts: Array<{ x: number; y: number }> = [];

    // Step of 1 = every pixel; gives us the densest possible set of stroke pixels
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            const i = (py * w + px) * 4;
            if (data[i + 3] > 40) {
                pts.push({ x: px, y: py });
            }
        }
    }

    // Shuffle so particles are distributed evenly across all shapes
    for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
    }

    const result = pts.slice(0, count);
    // Pad by jittering existing points if we need more than available
    let padIdx = 0;
    while (result.length < count && pts.length > 0) {
        const src = pts[padIdx % pts.length];
        result.push({ x: src.x + (Math.random() - 0.5) * 1, y: src.y + (Math.random() - 0.5) * 1 });
        padIdx++;
    }

    return result;
}

// ─── Particle ──────────────────────────────────────────────────────────────
interface Particle {
    x: number; y: number;
    baseX: number; baseY: number;
    vx: number; vy: number;
    size: number; alpha: number;
    targetX: number; targetY: number;
    phase: number;
    isDesign: boolean;
}

const TOTAL = 7000;
const DESIGN_COUNT = 6000;
// Blue matching reference image
const TR = 66, TG = 133, TB = 244;

function mkParticle(w: number, h: number, i: number, isDesign: boolean): Particle {
    const x = Math.random() * w;
    const y = Math.random() * h;
    return {
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        // Design particles start small; background particles are slightly larger
        size: isDesign ? 0.8 + Math.random() * 0.8 : 1.3 + Math.random() * 2.0,
        alpha: 0.25 + Math.random() * 0.30,
        targetX: x, targetY: y,
        phase: (i / TOTAL) * Math.PI * 2,
        isDesign,
    };
}

// ─── Component ─────────────────────────────────────────────────────────────
interface Props { hovered: boolean }

export default function SupplierParticleCanvas({ hovered }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef({
        particles: [] as Particle[],
        designTargets: [] as Array<{ x: number; y: number }>,
        hovered: false,
        animId: 0,
        tick: 0,
        w: 0, h: 0,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const state = stateRef.current;

        function init() {
            const parent = canvas!.parentElement!;
            const w = parent.offsetWidth || 500;
            const h = parent.offsetHeight || 500;
            canvas!.width = w;
            canvas!.height = h;
            state.w = w; state.h = h;

            state.particles = Array.from({ length: TOTAL }, (_, i) =>
                mkParticle(w, h, i, i < DESIGN_COUNT)
            );

            state.designTargets = generateDesignPoints(w, h, DESIGN_COUNT);
        }

        const ctx = canvas.getContext("2d")!;

        function draw() {
            state.tick++;
            const { w, h, tick } = state;
            ctx.clearRect(0, 0, w, h);
            const isHovered = state.hovered;

            state.particles.forEach((p, i) => {
                if (isHovered && p.isDesign && state.designTargets.length > 0) {
                    const ep = state.designTargets[i % state.designTargets.length];
                    p.x += (ep.x - p.x) * 0.07;
                    p.y += (ep.y - p.y) * 0.07;
                    // Small, crisp particles for clear icon definition
                    p.size += (0.9 - p.size) * 0.06;
                    p.alpha += (0.92 - p.alpha) * 0.06;
                } else {
                    const amp = 18 + Math.sin(p.phase * 1.7) * 9;
                    p.targetX = p.baseX + Math.cos(tick * 0.007 + p.phase) * amp;
                    p.targetY = p.baseY + Math.sin(tick * 0.009 + p.phase) * amp;
                    p.x += (p.targetX - p.x) * 0.016;
                    p.y += (p.targetY - p.y) * 0.016;

                    p.baseX += p.vx * 0.22;
                    p.baseY += p.vy * 0.22;
                    if (p.baseX < 0 || p.baseX > w) p.vx *= -1;
                    if (p.baseY < 0 || p.baseY > h) p.vy *= -1;
                    p.baseX = Math.max(0, Math.min(w, p.baseX));
                    p.baseY = Math.max(0, Math.min(h, p.baseY));

                    const ta = 0.28 + Math.sin(tick * 0.022 + p.phase) * 0.12;
                    p.alpha += (ta - p.alpha) * 0.04;
                    const ts = 1.4 + Math.sin(tick * 0.017 + p.phase) * 0.5;
                    p.size += (ts - p.size) * 0.04;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${TR},${TG},${TB},${p.alpha.toFixed(3)})`;
                ctx.fill();
            });

            state.animId = requestAnimationFrame(draw);
        }

        // Delay init slightly to ensure parent has layout dimensions
        const timer = setTimeout(() => {
            init();
            draw();
        }, 100);

        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(state.animId);
            init();
            draw();
        });
        ro.observe(canvas.parentElement!);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(state.animId);
            ro.disconnect();
        };
    }, []);

    useEffect(() => { stateRef.current.hovered = hovered; }, [hovered]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                borderRadius: "inherit",
            }}
        />
    );
}
