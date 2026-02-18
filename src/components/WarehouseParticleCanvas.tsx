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
        { angle: -135, label: "tl" },  // top-left  → forklift
        { angle: -45, label: "tr" },  // top-right → shield + checkmark
        { angle: 135, label: "bl" },  // bottom-left → barcode scanner
        { angle: 45, label: "br" },  // bottom-right → clipboard checklist
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

    // ── Forklift (top-left) ──
    function drawForklift(ix: number, iy: number) {
        // Body/chassis (rectangle)
        ctx.beginPath();
        ctx.roundRect(ix - 7 * s, iy - 1 * s, 10 * s, 6 * s, 1 * s);
        ctx.stroke();
        // Mast (vertical pillar on left)
        ctx.beginPath();
        ctx.moveTo(ix - 7 * s, iy - 1 * s);
        ctx.lineTo(ix - 7 * s, iy - 9 * s);
        ctx.stroke();
        // Fork arms (two horizontal prongs)
        ctx.beginPath();
        ctx.moveTo(ix - 7 * s, iy - 7 * s);
        ctx.lineTo(ix + 4 * s, iy - 7 * s);
        ctx.moveTo(ix - 7 * s, iy - 4 * s);
        ctx.lineTo(ix + 4 * s, iy - 4 * s);
        ctx.stroke();
        // Front wheel
        ctx.beginPath();
        ctx.arc(ix + 1 * s, iy + 5 * s, 2.5 * s, 0, Math.PI * 2);
        ctx.stroke();
        // Rear wheel
        ctx.beginPath();
        ctx.arc(ix - 5.5 * s, iy + 5 * s, 2.5 * s, 0, Math.PI * 2);
        ctx.stroke();
        // Cab/overhead guard
        ctx.beginPath();
        ctx.moveTo(ix - 2 * s, iy - 1 * s);
        ctx.lineTo(ix - 2 * s, iy - 5 * s);
        ctx.lineTo(ix + 3 * s, iy - 5 * s);
        ctx.lineTo(ix + 3 * s, iy - 1 * s);
        ctx.stroke();
    }

    // ── Shield with checkmark (top-right) ──
    function drawShield(ix: number, iy: number) {
        // Shield body
        ctx.beginPath();
        ctx.moveTo(ix, iy - 9 * s);
        ctx.lineTo(ix + 7 * s, iy - 5 * s);
        ctx.lineTo(ix + 7 * s, iy + 2 * s);
        ctx.quadraticCurveTo(ix + 7 * s, iy + 8 * s, ix, iy + 10 * s);
        ctx.quadraticCurveTo(ix - 7 * s, iy + 8 * s, ix - 7 * s, iy + 2 * s);
        ctx.lineTo(ix - 7 * s, iy - 5 * s);
        ctx.closePath();
        ctx.stroke();
        // Inner shield ring
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

    // ── Barcode scanner (bottom-left) ──
    function drawScanner(ix: number, iy: number) {
        // Scanner gun body
        ctx.beginPath();
        ctx.roundRect(ix - 4 * s, iy - 8 * s, 7 * s, 5 * s, 1.5 * s);
        ctx.stroke();
        // Handle
        ctx.beginPath();
        ctx.moveTo(ix - 1 * s, iy - 3 * s);
        ctx.lineTo(ix - 3 * s, iy + 4 * s);
        ctx.lineTo(ix + 1 * s, iy + 5 * s);
        ctx.lineTo(ix + 2 * s, iy - 1 * s);
        ctx.stroke();
        // Trigger
        ctx.beginPath();
        ctx.moveTo(ix - 1 * s, iy);
        ctx.lineTo(ix - 2 * s, iy + 2.5 * s);
        ctx.stroke();
        // Scan lines (3 vertical lines in scan head)
        ctx.beginPath();
        ctx.moveTo(ix - 2.5 * s, iy - 7 * s);
        ctx.lineTo(ix - 2.5 * s, iy - 4 * s);
        ctx.moveTo(ix - 0.5 * s, iy - 7.5 * s);
        ctx.lineTo(ix - 0.5 * s, iy - 3.5 * s);
        ctx.moveTo(ix + 1.5 * s, iy - 7 * s);
        ctx.lineTo(ix + 1.5 * s, iy - 4 * s);
        ctx.stroke();
        // Scanning beam lines coming out
        ctx.beginPath();
        ctx.moveTo(ix + 3 * s, iy - 7.5 * s);
        ctx.lineTo(ix + 7 * s, iy - 8.5 * s);
        ctx.moveTo(ix + 3 * s, iy - 5.5 * s);
        ctx.lineTo(ix + 7 * s, iy - 5.5 * s);
        ctx.moveTo(ix + 3 * s, iy - 3.5 * s);
        ctx.lineTo(ix + 7 * s, iy - 2.5 * s);
        ctx.stroke();
    }

    // ── Clipboard with checklist (bottom-right) ──
    function drawClipboard(ix: number, iy: number) {
        // Board body
        ctx.beginPath();
        ctx.roundRect(ix - 6 * s, iy - 7 * s, 12 * s, 16 * s, 1.5 * s);
        ctx.stroke();
        // Clip at top
        ctx.beginPath();
        ctx.roundRect(ix - 3 * s, iy - 9.5 * s, 6 * s, 4 * s, 1.5 * s);
        ctx.stroke();
        // Three checklist rows
        for (let row = 0; row < 3; row++) {
            const ry = iy - 2 * s + row * 5 * s;
            // Checkbox
            ctx.beginPath();
            ctx.roundRect(ix - 5 * s, ry - 1.5 * s, 3 * s, 3 * s, 0.5 * s);
            ctx.stroke();
            // Checkmark inside
            ctx.beginPath();
            ctx.moveTo(ix - 4.5 * s, ry);
            ctx.lineTo(ix - 3.5 * s, ry + 1 * s);
            ctx.lineTo(ix - 2.5 * s, ry - 1 * s);
            ctx.stroke();
            // Line
            ctx.beginPath();
            ctx.moveTo(ix - 1 * s, ry);
            ctx.lineTo(ix + 5 * s, ry);
            ctx.stroke();
        }
    }

    // ── Place icons at corners ──
    iconCentres.forEach(({ x, y, label }) => {
        if (label === "tl") {
            drawForklift(x, y);
        } else if (label === "tr") {
            drawShield(x, y);
        } else if (label === "bl") {
            drawScanner(x, y);
        } else if (label === "br") {
            drawClipboard(x, y);
        }
    });

    // ── Sample every dark pixel for maximum coverage ──
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts: Array<{ x: number; y: number }> = [];

    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            const i = (py * w + px) * 4;
            if (data[i + 3] > 40) {
                pts.push({ x: px, y: py });
            }
        }
    }

    // Shuffle for even distribution
    for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
    }

    const result = pts.slice(0, count);
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
// Blue matching suppliers card
const TR = 66, TG = 133, TB = 244;

function mkParticle(w: number, h: number, i: number, isDesign: boolean): Particle {
    const x = Math.random() * w;
    const y = Math.random() * h;
    return {
        x, y, baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        size: isDesign ? 0.8 + Math.random() * 0.8 : 1.3 + Math.random() * 2.0,
        alpha: 0.25 + Math.random() * 0.30,
        targetX: x, targetY: y,
        phase: (i / TOTAL) * Math.PI * 2,
        isDesign,
    };
}

// ─── Component ─────────────────────────────────────────────────────────────
interface Props { hovered: boolean }

export default function WarehouseParticleCanvas({ hovered }: Props) {
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
