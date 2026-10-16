import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SolidShape } from "@/lib/studyContent";
import { buildMesh, describeShape, faceLightness, parseHslTriplet, projectMesh } from "@/lib/shapes3d";

/**
 * An interactive drawing of a solid shape: it turns slowly on its own, and can
 * be dragged to look at any side.
 *
 * Canvas rather than DOM nodes because a sphere is a few hundred faces, and
 * because the whole thing is repainted from one animation loop instead of
 * re-rendering React on every frame.
 */

const VIEW_SIZE = 200;
/** The shape is drawn a little smaller than the box so corners never clip. */
const DRAW_SIZE = VIEW_SIZE - 24;
/** Roughly 25 frames a second: smooth to the eye, light on low-end machines. */
const FRAME_MS = 40;
/** How far the shape may be tipped before it looks like it fell over. */
const MAX_TILT = 1.45;
// Tipped a little towards the viewer and turned a little to the side, the view
// a textbook draws a solid from: the top face is visible and the light falls
// on it.
const START_ROTATION = { ax: 0.4, ay: 0.6 };

interface Rotation {
  ax: number;
  ay: number;
}

/** The theme's primary colour, read live so a theme switch is picked up. */
function readPrimaryColour(): { h: number; s: number; l: number } {
  const fallback = { h: 217, s: 91, l: 60 };
  if (typeof window === "undefined") return fallback;

  const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary");
  return parseHslTriplet(raw) ?? fallback;
}

export function ShapeViewer({ shape }: { shape: SolidShape }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<Rotation>({ ...START_ROTATION });
  const draggingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const mesh = useMemo(() => buildMesh(shape), [shape]);

  const draw = useCallback(
    (rotation: Rotation) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const ratio = window.devicePixelRatio || 1;
      const pixelSize = VIEW_SIZE * ratio;
      if (canvas.width !== pixelSize) {
        canvas.width = pixelSize;
        canvas.height = pixelSize;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, VIEW_SIZE, VIEW_SIZE);

      const colour = readPrimaryColour();
      const faces = projectMesh(mesh, rotation, DRAW_SIZE);

      for (const face of faces) {
        context.beginPath();
        context.moveTo(VIEW_SIZE / 2 + face.points[0].x, VIEW_SIZE / 2 + face.points[0].y);
        for (let i = 1; i < face.points.length; i += 1) {
          context.lineTo(VIEW_SIZE / 2 + face.points[i].x, VIEW_SIZE / 2 + face.points[i].y);
        }
        context.closePath();

        // Each face is shaded from the theme's own primary colour, so the
        // solid belongs to whatever palette the visitor is using.
        const lightness = faceLightness(colour.l, face.brightness);
        context.fillStyle = `hsl(${colour.h} ${colour.s}% ${lightness}%)`;
        context.fill();

        context.strokeStyle = `hsl(${colour.h} ${colour.s}% ${Math.max(10, lightness - 18)}%)`;
        context.lineWidth = 1;
        context.stroke();
      }
    },
    [mesh],
  );

  // Own animation loop: turns the shape when idle, stops when it is being
  // dragged or when the visitor has asked for reduced motion.
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let last = 0;
    let cancelled = false;

    const tick = (now: number) => {
      if (cancelled) return;
      if (!draggingRef.current && !prefersReducedMotion && now - last >= FRAME_MS) {
        last = now;
        rotationRef.current.ay += 0.018;
        draw(rotationRef.current);
      }
      frame = window.requestAnimationFrame(tick);
    };

    draw(rotationRef.current);
    if (!prefersReducedMotion) {
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [draw]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    setIsDragging(true);
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current || !lastPointRef.current) return;
    const previous = lastPointRef.current;
    const rotation = rotationRef.current;
    rotation.ay += (event.clientX - previous.x) * 0.012;
    rotation.ax = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, rotation.ax + (event.clientY - previous.y) * 0.012),
    );
    lastPointRef.current = { x: event.clientX, y: event.clientY };
    draw(rotation);
  };

  const endDrag = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    lastPointRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-2" data-testid="shape-viewer">
      <canvas
        ref={canvasRef}
        width={VIEW_SIZE}
        height={VIEW_SIZE}
        role="img"
        aria-label={describeShape(shape)}
        data-testid="shape-canvas"
        data-shape-kind={shape.kind}
        style={{ width: VIEW_SIZE, height: VIEW_SIZE }}
        className={`touch-none rounded-lg border border-border/60 bg-muted/30 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <p className="text-xs text-muted-foreground">{shape.caption ?? "Drag the shape to turn it"}</p>
    </div>
  );
}

export default ShapeViewer;
