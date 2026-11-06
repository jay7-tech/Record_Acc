"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useIsMobile } from "@/hooks/use-mobile";

interface Shard {
  angle: number;
  dist: number;
  rotate: number;
  size: number;
}

interface Entity {
  id: number;
  x: number;
  y: number;
  startX?: number;
  startY?: number;
  midX?: number;
  midY?: number;
  angle?: number;
  color: string;
  type: "projectile" | "ember" | "explosion";
  shards?: Shard[];
}

const COLORS = ["#60A5FA", "#A78BFA", "#38BDF8", "#F472B6"];

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function makeShards(): Shard[] {
  const count = 9;
  const shards: Shard[] = [];
  for (let i = 0; i < count; i++) {
    const baseAngle = (360 / count) * i;
    shards.push({
      angle: baseAngle + (Math.random() - 0.5) * 24,
      dist: 36 + Math.random() * 46,
      rotate: (Math.random() - 0.5) * 420,
      size: 2 + Math.random() * 3,
    });
  }
  return shards;
}

/**
 * A small meteor streaks in on an arcing path and detonates on impact —
 * a flash, a double shockwave, a spray of individually-tumbling debris,
 * and a couple of trailing embers riding just behind the main body for
 * depth. Everything is precomputed per-click so repeated clicks never
 * look identical, and every DOM node is removed the moment its own
 * animation finishes.
 */
export function ClickSparkle() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();

      const targetX = e.clientX;
      const targetY = e.clientY;
      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 140;
      const startY = -60;

      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const curve = Math.min(90, dist * 0.2) * (Math.random() > 0.5 ? 1 : -1);
      const midX = startX + dx * 0.5 + perpX * curve;
      const midY = startY + dy * 0.5 + perpY * curve;
      const angle = Math.atan2(targetY - midY, targetX - midX) * (180 / Math.PI);
      const color = pickColor();

      const projectile: Entity = {
        id,
        x: targetX,
        y: targetY,
        startX,
        startY,
        midX,
        midY,
        angle,
        color,
        type: "projectile",
      };

      // Two faint embers trailing the same arc, a beat behind the main body.
      const embers: Entity[] = [0.12, 0.22].map((delayTag) => ({
        id: id + delayTag,
        x: targetX,
        y: targetY,
        startX,
        startY,
        midX,
        midY,
        angle,
        color,
        type: "ember",
      }));

      setEntities((prev) => [...prev, projectile, ...embers]);

      // Embers clean themselves up without spawning their own explosion.
      embers.forEach((ember, i) => {
        setTimeout(() => {
          setEntities((prev) => prev.filter((e) => e.id !== ember.id));
        }, 460 + i * 40);
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isMobile]);

  const handleAnimationComplete = (id: number, x: number, y: number, color: string) => {
    setEntities((prev) => prev.filter((e) => e.id !== id));

    const explosionId = Date.now() + Math.random();
    const explosion: Entity = {
      id: explosionId,
      x,
      y,
      color,
      type: "explosion",
      shards: makeShards(),
    };

    setEntities((prev) => [...prev, explosion]);

    setTimeout(() => {
      setEntities((prev) => prev.filter((e) => e.id !== explosionId));
    }, 750);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {entities.map((entity) => {
          if (entity.type === "projectile" || entity.type === "ember") {
            const isEmber = entity.type === "ember";
            return (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, scale: isEmber ? 0.3 : 0.5 }}
                animate={{
                  x: [entity.startX, entity.midX, entity.x],
                  y: [entity.startY, entity.midY, entity.y],
                  opacity: isEmber ? [0, 0.5, 0] : [0, 1, 1],
                  scale: isEmber ? 0.4 : 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: isEmber ? 0.46 : 0.42,
                  delay: isEmber ? 0.05 : 0,
                  times: [0, 0.55, 1],
                  ease: ["easeOut", "easeIn"],
                }}
                onAnimationComplete={
                  isEmber ? undefined : () => handleAnimationComplete(entity.id, entity.x, entity.y, entity.color)
                }
                style={{ position: "absolute", left: 0, top: 0 }}
                className={`flex items-center justify-center ${isEmber ? "" : "filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"}`}
              >
                {/* Fiery trail */}
                <div
                  className="absolute h-[5px] rounded-full origin-right blur-[1px]"
                  style={{
                    width: isEmber ? "90px" : "170px",
                    right: "2px",
                    rotate: `${entity.angle}deg`,
                    opacity: isEmber ? 0.45 : 1,
                    background: `linear-gradient(to right, transparent, ${entity.color}, white)`,
                  }}
                />
                {/* Tumbling rock core, spinning independently of the travel path */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  className="relative z-10"
                  style={{ width: isEmber ? 8 : 13, height: isEmber ? 8 : 13 }}
                >
                  <svg viewBox="0 0 20 20" width="100%" height="100%">
                    <polygon
                      points="10,1 15,4 19,10 15,17 9,19 3,16 1,9 4,3"
                      fill="white"
                      opacity={isEmber ? 0.6 : 0.95}
                    />
                  </svg>
                </motion.div>
                {/* Flaming halo */}
                <div
                  className="absolute rounded-full blur-[2px]"
                  style={{
                    width: isEmber ? 10 : 22,
                    height: isEmber ? 10 : 22,
                    backgroundColor: entity.color,
                    opacity: isEmber ? 0.5 : 0.8,
                  }}
                />
              </motion.div>
            );
          }

          // Explosion entity
          return (
            <motion.div
              key={entity.id}
              initial={{ x: entity.x, y: entity.y }}
              style={{ position: "absolute", left: 0, top: 0 }}
              className="relative"
            >
              {/* Flash */}
              <motion.div
                initial={{ scale: 0, opacity: 0.95 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  left: -18,
                  top: -18,
                  background: `radial-gradient(circle, white, ${entity.color}80, transparent 70%)`,
                }}
              />
              {/* Double shockwave rings */}
              {[0, 0.09].map((delay, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 2.4 + i * 0.6, opacity: 0 }}
                  transition={{ duration: 0.55, delay, ease: "easeOut" }}
                  className="absolute rounded-full border-2"
                  style={{
                    width: 30,
                    height: 30,
                    left: -15,
                    top: -15,
                    borderColor: i === 0 ? "white" : entity.color,
                  }}
                />
              ))}
              {/* Core burst */}
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute rounded-full blur-md"
                style={{ width: 48, height: 48, left: -24, top: -24, backgroundColor: entity.color }}
              />
              {/* Tumbling debris spray */}
              {entity.shards?.map((shard, i) => {
                const rad = (shard.angle * Math.PI) / 180;
                const dx = Math.cos(rad) * shard.dist;
                const dy = Math.sin(rad) * shard.dist;
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                    animate={{ x: dx, y: dy, opacity: 0, rotate: shard.rotate, scale: 0.4 }}
                    transition={{ duration: 0.62, ease: "easeOut" }}
                    className="absolute rounded-[1px]"
                    style={{
                      width: shard.size * 2.4,
                      height: shard.size,
                      left: -shard.size,
                      top: -shard.size / 2,
                      background: i % 2 === 0 ? "white" : entity.color,
                    }}
                  />
                );
              })}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
