'use client';

import { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    vx: number;
    vy: number;
}

export function AestheticBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize stars
        const initStars = () => {
            const stars: Star[] = [];
            const starCount = Math.floor((canvas.width * canvas.height) / 8000); // Responsive star count

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3,
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    vx: 0,
                    vy: 0,
                });
            }
            starsRef.current = stars;
        };
        initStars();

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Detect theme
            const isDarkMode = document.documentElement.classList.contains('dark');

            // Draw grid with theme-aware colors
            ctx.strokeStyle = isDarkMode
                ? 'rgba(168, 85, 247, 0.07)'
                : 'rgba(168, 85, 247, 0.1)';
            ctx.lineWidth = 1;
            const gridSize = 22; // Balanced spacing

            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw and animate stars
            starsRef.current.forEach((star) => {
                // Calculate distance from mouse
                const dx = mouseRef.current.x - star.x;
                const dy = mouseRef.current.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                // Interactive movement
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    star.vx += (dx / distance) * force * 0.5;
                    star.vy += (dy / distance) * force * 0.5;
                }

                // Apply velocity with damping
                star.x += star.vx;
                star.y += star.vy;
                star.vx *= 0.95;
                star.vy *= 0.95;

                // Wrap around edges
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Pulsing effect
                const pulse = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
                const currentOpacity = (star.opacity + pulse * 0.3) * 0.4; // Lighter, more transparent
                const currentSize = star.size * (1 + pulse * 0.2);

                // Color based on size - theme aware
                let color;
                if (star.size > 2) {
                    color = isDarkMode ? '168, 85, 247' : '109, 40, 217'; // Deep purple for light mode
                } else if (star.size > 1.5) {
                    color = isDarkMode ? '147, 197, 253' : '37, 99, 235'; // Royal blue for light mode
                } else {
                    color = isDarkMode ? '255, 255, 255' : '75, 85, 99'; // Dark gray for light mode
                }

                // Draw outer glow
                const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, currentSize * 5);
                glowGradient.addColorStop(0, `rgba(${color}, ${currentOpacity * 0.5})`);
                glowGradient.addColorStop(0.4, `rgba(${color}, ${currentOpacity * 0.2})`);
                glowGradient.addColorStop(1, `rgba(${color}, 0)`);

                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, currentSize * 5, 0, Math.PI * 2);
                ctx.fill();

                // Draw 8-pointed sparkle/starburst
                ctx.save();
                ctx.translate(star.x, star.y);

                // Main sparkle shape with alternating ray lengths
                ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
                ctx.beginPath();

                // Create 8-pointed star with alternating long and short rays
                const points = 8;
                const longRadius = currentSize * 3;
                const shortRadius = currentSize * 1.5;
                const innerRadius = currentSize * 0.3;

                for (let i = 0; i < points * 2; i++) {
                    let radius;
                    if (i % 2 === 0) {
                        // Outer points - alternate between long and short
                        radius = (i / 2) % 2 === 0 ? longRadius : shortRadius;
                    } else {
                        // Inner points
                        radius = innerRadius;
                    }

                    const angle = (Math.PI / points) * i - Math.PI / 2; // Start from top
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.closePath();
                ctx.fill();

                // Add bright center core
                const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize * 0.8);
                centerGradient.addColorStop(0, isDarkMode
                    ? `rgba(255, 255, 255, ${currentOpacity})`
                    : `rgba(${color}, ${currentOpacity})`);
                centerGradient.addColorStop(1, `rgba(${color}, ${currentOpacity * 0.5})`);

                ctx.fillStyle = centerGradient;
                ctx.beginPath();
                ctx.arc(0, 0, currentSize * 0.8, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
