'use client';

import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
    const isMobile = useIsMobile();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        // Initialize stars
        const initStars = () => {
            const stars: Star[] = [];
            // Significantly reduce star count on mobile
            const density = isMobile ? 15000 : 8000;
            const starCount = Math.floor((window.innerWidth * window.innerHeight) / density);

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
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

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isDarkMode = document.documentElement.classList.contains('dark');

            // Draw Grid - OPTIMIZED: CSS background is better, but if we must use canvas, 
            // only draw it at a lower frequency or use a single path
            ctx.strokeStyle = isDarkMode
                ? 'rgba(168, 85, 247, 0.05)'
                : 'rgba(168, 85, 247, 0.08)';
            ctx.lineWidth = 1;
            const gridSize = isMobile ? 44 : 22; // Larger grid on mobile

            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            ctx.stroke();

            // Draw and animate stars
            starsRef.current.forEach((star) => {
                const dx = mouseRef.current.x - star.x;
                const dy = mouseRef.current.y - star.y;
                const distanceSq = dx * dx + dy * dy;
                const maxDistance = 150;
                const maxDistanceSq = maxDistance * maxDistance;

                if (distanceSq < maxDistanceSq) {
                    const distance = Math.sqrt(distanceSq);
                    const force = (maxDistance - distance) / maxDistance;
                    star.vx += (dx / distance) * force * 0.5;
                    star.vy += (dy / distance) * force * 0.5;
                }

                star.x += star.vx;
                star.y += star.vy;
                star.vx *= 0.95;
                star.vy *= 0.95;

                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                const pulse = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
                const currentOpacity = (star.opacity + pulse * 0.3) * 0.4;
                const currentSize = star.size * (1 + pulse * 0.2);

                let color;
                if (star.size > 2) {
                    color = isDarkMode ? '168, 85, 247' : '109, 40, 217';
                } else if (star.size > 1.5) {
                    color = isDarkMode ? '147, 197, 253' : '37, 99, 235';
                } else {
                    color = isDarkMode ? '255, 255, 255' : '75, 85, 99';
                }

                // Simplified drawing on mobile
                if (isMobile) {
                    ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Desktop: Premium effects
                    const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, currentSize * 5);
                    glowGradient.addColorStop(0, `rgba(${color}, ${currentOpacity * 0.5})`);
                    glowGradient.addColorStop(0.4, `rgba(${color}, ${currentOpacity * 0.2})`);
                    glowGradient.addColorStop(1, `rgba(${color}, 0)`);

                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, currentSize * 5, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.save();
                    ctx.translate(star.x, star.y);
                    ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
                    ctx.beginPath();
                    const points = 8;
                    const longRadius = currentSize * 3;
                    const shortRadius = currentSize * 1.5;
                    const innerRadius = currentSize * 0.3;

                    for (let i = 0; i < points * 2; i++) {
                        const radius = i % 2 === 0 ? ((i / 2) % 2 === 0 ? longRadius : shortRadius) : innerRadius;
                        const angle = (Math.PI / points) * i - Math.PI / 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isMobile]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
