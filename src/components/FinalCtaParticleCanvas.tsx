import { useEffect, useRef } from 'react';


export default function FinalCtaParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

        // Configuration
        const particleCount = 800; // "Increase them" - significantly higher count
        const particleColor = { r: 26, g: 179, b: 148 }; // Green #1ab394
        const mouseRadius = 150; // Interaction radius

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;
            alpha: number;
        }

        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                particles.push({
                    x,
                    y,
                    vx: 0,
                    vy: 0,
                    size: Math.random() * 2 + 1,
                    baseX: x,
                    baseY: y,
                    density: (Math.random() * 30) + 1,
                    alpha: Math.random() * 0.5 + 0.2 // Darker base alpha
                });
            }
        };

        init();

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];

                // Mouse interaction (Repulsion/Disturbance)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouseRadius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * p.density;
                const directionY = forceDirectionY * force * p.density;

                if (distance < mouseRadius) {
                    p.x -= directionX;
                    p.y -= directionY;
                    p.alpha = Math.min(p.alpha + 0.05, 1); // Brighten on hover
                } else {
                    if (p.x !== p.baseX) {
                        const dx = p.x - p.baseX;
                        p.x -= dx / 10;
                    }
                    if (p.y !== p.baseY) {
                        const dy = p.y - p.baseY;
                        p.y -= dy / 10;
                    }
                    // Return to base alpha
                    p.alpha -= 0.01;
                    if (p.alpha < 0.2) p.alpha = 0.2;
                }

                drawParticle(p);
            }
            requestAnimationFrame(animate);
        };

        const drawParticle = (p: Particle) => {
            ctx.fillStyle = `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        animate();

        // Event Listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        const handleResize = () => {
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
            init();
        };

        // Attach listeners to parent for better hit area
        canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
        canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        return () => {
            canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
            canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.8 // Overall slight transparency
            }}
        />
    );
}
