import { useEffect, useMemo, useState } from "react";

interface ConfettiProps {
  active: boolean;
  /** How long the effect stays on screen, in ms. */
  duration?: number;
  /** "rain" falls from the top, "burst" explodes from the middle. */
  variant?: "rain" | "burst";
  /** Number of pieces. */
  count?: number;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  round: boolean;
  tx: number;
  ty: number;
}

const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#9b59b6",
  "#e17055",
  "#22d3ee",
  "#f472b6",
];

function buildParticles(count: number, variant: "rain" | "burst"): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    // A burst sprays outwards from the centre; rain drifts down the whole width.
    const angle = (Math.PI * 2 * id) / count + Math.random() * 0.5;
    const distance = 180 + Math.random() * 320;
    return {
      id,
      left: variant === "burst" ? 50 : Math.random() * 100,
      top: variant === "burst" ? 50 : -10,
      size: variant === "burst" ? 6 + Math.random() * 8 : 5 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * (variant === "burst" ? 0.15 : 0.6),
      duration: variant === "burst" ? 1.3 + Math.random() * 0.7 : 2.6 + Math.random() * 1.2,
      rotation: Math.random() * 360,
      round: Math.random() > 0.55,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 40,
    };
  });
}

/**
 * Confetti for milestone celebrations. Particles are generated when the effect
 * turns on and cleared after `duration`, so nothing runs while it is idle.
 */
export function Confetti({ active, duration = 3000, variant = "rain", count = 60 }: ConfettiProps) {
  const [visible, setVisible] = useState(false);
  const particles = useMemo(
    () => (active ? buildParticles(count, variant) : []),
    [active, count, variant],
  );

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!visible || particles.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
      data-testid="confetti"
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={variant === "burst" ? "absolute animate-confetti-burst" : "absolute animate-confetti-fall"}
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size * (particle.round ? 1 : 1.6),
              backgroundColor: particle.color,
              borderRadius: particle.round ? "9999px" : "2px",
              animationDelay: `${particle.delay}s`,
              "--fall-duration": `${particle.duration}s`,
              "--burst-duration": `${particle.duration}s`,
              "--rot": `${particle.rotation + 540}deg`,
              "--tx": `${particle.tx}px`,
              "--ty": `${particle.ty}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
