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

    // ── Helper scale ──
    const s = ic / 20;

    // ── Shield + checkmark (top-left) ──
    function drawShield(ix: number, iy: number) {
        ctx.beginPath();
        ctx.moveTo(ix, iy - 9 * s);
        ctx.lineTo(ix + 7 * s, iy - 5 * s);
        ctx.lineTo(ix + 7 * s, iy + 2 * s);
        ctx.quadraticCurveTo(ix + 7 * s, iy + 8 * s, ix, iy + 10 * s);
        ctx.quadraticCurveTo(ix - 7 * s, iy + 8 * s, ix - 7 * s, iy + 2 * s);
        ctx.lineTo(ix - 7 * s, iy - 5 * s);
        ctx.closePath();
        ctx.stroke();
        // Inner shield
        ctx.beginPath();
        ctx.moveTo(ix, iy - 6 * s);
        ctx.lineTo(ix + 5 * s, iy - 3 * s);
        ctx.lineTo(ix + 5 * s, iy + 2 * s);
        ctx.quadraticCurveTo(ix + 5 * s, iy + 6 * s, ix, iy + 8 * s);
        ctx.quadraticCurveTo(ix - 5 * s, iy + 6 * s, ix - 5 * s, iy + 2 * s);
        ctx.lineTo(ix - 5 * s, iy - 3 * s);
        ctx.closePath();
        ctx.stroke();
        // Checkmark
        ctx.beginPath();
        ctx.moveTo(ix - 3 * s, iy + 1 * s);
        ctx.lineTo(ix - 0.5 * s, iy + 3.5 * s);
        ctx.lineTo(ix + 4 * s, iy - 2.5 * s);
        ctx.stroke();
    }

    // ── Bar chart + magnifying glass (top-right) ──
    function drawAnalytics(ix: number, iy: number) {
        // Magnifying glass circle rim
        const mr = 6.0 * s;
        ctx.beginPath();
        ctx.arc(ix - 1.5 * s, iy - 1.5 * s, mr, 0, Math.PI * 2);
        ctx.stroke();

        // Magnifying glass handle (rounded + slightly tapered)
        // Angle is approx 45 deg (PI/4)
        const angle = Math.PI * 0.25;
        const handleLen = 8 * s;
        const startX = (ix - 1.5 * s) + mr * Math.cos(angle);
        const startY = (iy - 1.5 * s) + mr * Math.sin(angle);

        ctx.beginPath();
        // Thick line for handle
        ctx.lineWidth = Math.min(w, h) * 0.009;
        ctx.lineCap = "round";
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + handleLen * Math.cos(angle), startY + handleLen * Math.sin(angle));
        ctx.stroke();
        // Reset line width
        ctx.lineWidth = Math.min(w, h) * 0.005;

        // Bar chart inside (3 bars rising)
        const chartX = ix - 1.5 * s;
        const chartY = iy - 1.5 * s;

        // Axis
        ctx.beginPath();
        ctx.moveTo(chartX - 3.5 * s, chartY - 3.5 * s); // Top of Y axis
        ctx.lineTo(chartX - 3.5 * s, chartY + 3.5 * s); // Bottom-left corner
        ctx.lineTo(chartX + 3.5 * s, chartY + 3.5 * s); // End of X axis
        ctx.stroke();

        // Bars
        const barW = 1.5 * s;
        const spacing = 0.5 * s;
        const startBarX = chartX - 3 * s + spacing;

        // Bar 1
        ctx.fillStyle = "#000"; // Fill bars for solidity
        ctx.fillRect(startBarX, chartY + 3.5 * s - 2 * s, barW, 2 * s);
        // Bar 2
        ctx.fillRect(startBarX + barW + spacing, chartY + 3.5 * s - 4 * s, barW, 4 * s);
        // Bar 3
        ctx.fillRect(startBarX + (barW + spacing) * 2, chartY + 3.5 * s - 6 * s, barW, 6 * s);
    }

    // ── Laptop + shopping cart + document (bottom-left) ──
    function drawEcommerce(ix: number, iy: number) {
        // Document/list behind (top-left offset)
        const dx = ix - 5 * s, dy = iy - 4 * s;
        ctx.beginPath();
        ctx.roundRect(dx - 5 * s, dy - 4 * s, 9 * s, 11 * s, 1 * s);
        ctx.stroke();

        // Lines on document
        ctx.beginPath();
        ctx.moveTo(dx - 3 * s, dy - 1.5 * s); ctx.lineTo(dx + 2 * s, dy - 1.5 * s);
        ctx.moveTo(dx - 3 * s, dy + 1.0 * s); ctx.lineTo(dx + 2 * s, dy + 1.0 * s);
        ctx.moveTo(dx - 3 * s, dy + 3.5 * s); ctx.lineTo(dx + 2 * s, dy + 3.5 * s);
        ctx.stroke();

        // Laptop screen
        ctx.clearRect(ix - 3.5 * s, iy - 6.5 * s, 13 * s, 10 * s); // Clear behind laptop
        ctx.beginPath();
        ctx.roundRect(ix - 3 * s, iy - 6 * s, 12 * s, 9 * s, 1 * s);
        ctx.stroke();
        // Laptop base
        ctx.beginPath();
        ctx.moveTo(ix - 5 * s, iy + 3 * s);
        ctx.lineTo(ix + 11 * s, iy + 3 * s);
        ctx.stroke();

        // Shopping cart icon inside screen
        // Cart body
        ctx.beginPath();
        ctx.moveTo(ix, iy - 4.5 * s);
        ctx.lineTo(ix + 1.5 * s, iy - 0.5 * s);
        ctx.lineTo(ix + 7.5 * s, iy - 0.5 * s);
        ctx.lineTo(ix + 8.5 * s, iy - 3.5 * s);
        ctx.lineTo(ix + 1 * s, iy - 3.5 * s);
        ctx.stroke();
        // Wheels
        ctx.beginPath();
        ctx.arc(ix + 3 * s, iy + 0.5 * s, 1 * s, 0, Math.PI * 2);
        ctx.arc(ix + 6.5 * s, iy + 0.5 * s, 1 * s, 0, Math.PI * 2);
        ctx.stroke(); // Hollow wheels looks cleaner
    }

    // ── Megaphone + checklist + dollar (bottom-right) ──
    function drawMarketing(ix: number, iy: number) {
        // --- Megaphone ---
        // Cone
        ctx.beginPath();
        ctx.moveTo(ix - 7 * s, iy - 2 * s);
        ctx.lineTo(ix - 7 * s, iy + 2 * s);
        ctx.lineTo(ix + 1 * s, iy + 5 * s);
        ctx.lineTo(ix + 1 * s, iy - 5 * s);
        ctx.closePath();
        ctx.stroke();
        // Mouthpiece/Body
        ctx.beginPath();
        ctx.roundRect(ix - 10 * s, iy - 2 * s, 3 * s, 4 * s, 0.5 * s);
        ctx.stroke();
        // Handle
        ctx.beginPath();
        ctx.moveTo(ix - 6 * s, iy + 2 * s);
        ctx.quadraticCurveTo(ix - 6 * s, iy + 6 * s, ix - 2 * s, iy + 6 * s);
        ctx.lineTo(ix - 1 * s, iy + 4.5 * s); // connect back to cone
        ctx.stroke();

        // Sound waves (arcs)
        ctx.beginPath();
        ctx.arc(ix + 2 * s, iy, 4 * s, -0.6, 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ix + 2 * s, iy, 7 * s, -0.6, 0.6);
        ctx.stroke();

        // --- Checklist (Offset to top-right) ---
        const lx = ix + 4 * s, ly = iy - 6 * s;
        // Clear area behind checklist so it pops
        ctx.clearRect(lx - 1 * s, ly - 1 * s, 9 * s, 11 * s);

        ctx.beginPath();
        ctx.roundRect(lx, ly, 7 * s, 9 * s, 1 * s);
        ctx.stroke();
        // Lines
        for (let r = 0; r < 3; r++) {
            const ry = ly + 2.5 * s + r * 2.5 * s;
            // Bullet
            ctx.beginPath();
            ctx.arc(lx + 1.5 * s, ry, 0.5 * s, 0, Math.PI * 2);
            ctx.fill();
            // Line
            ctx.beginPath();
            ctx.moveTo(lx + 3 * s, ry);
            ctx.lineTo(lx + 6 * s, ry);
            ctx.stroke();
        }

        // --- Dollar Coin (Money) ---
        const dx = ix + 2 * s, dy = iy + 6 * s;
        const dr = 3.5 * s;
        // Clear behind coin
        ctx.clearRect(dx - dr - 1, dy - dr - 1, dr * 2 + 2, dr * 2 + 2);

        // Coin circle
        ctx.beginPath();
        ctx.arc(dx, dy, dr, 0, Math.PI * 2);
        ctx.stroke();

        // Dollar Sign ($) - drawn as S with line
        ctx.beginPath();
        // S shape
        ctx.moveTo(dx + 1.5 * s, dy - 2 * s);
        ctx.bezierCurveTo(dx - 1.5 * s, dy - 2 * s, dx - 1.5 * s, dy - 0.5 * s, dx, dy);
        ctx.bezierCurveTo(dx + 1.5 * s, dy + 0.5 * s, dx + 1.5 * s, dy + 2 * s, dx - 1.5 * s, dy + 2 * s);
        ctx.stroke();
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(dx, dy - 2.5 * s);
        ctx.lineTo(dx, dy + 2.5 * s);
        ctx.stroke();
    }

    // ── Place icons at corners ──
    iconCentres.forEach(({ x, y, label }) => {
        if (label === "tl") {
            drawShield(x, y);
        } else if (label === "tr") {
            drawAnalytics(x, y);
        } else if (label === "bl") {
            drawEcommerce(x, y);
        } else if (label === "br") {
            drawMarketing(x, y);
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
