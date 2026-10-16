import type { SolidShape } from "./studyContent";

/**
 * Just enough 3D to draw a solid that can be turned.
 *
 * The shapes are built as small closed meshes, rotated, projected and painted
 * back to front. That is a few hundred lines of arithmetic rather than a 3D
 * library, which keeps the whole feature dependency-free — and it means the
 * maths here is plain functions that can be checked without a browser.
 */

export type Vec3 = [number, number, number];

export interface Mesh {
  vertices: Vec3[];
  /** Each face is a loop of vertex indices. */
  faces: number[][];
}

export interface ProjectedFace {
  points: { x: number; y: number }[];
  /** Larger is nearer the viewer, so faces are painted in ascending order. */
  depth: number;
  /** 0 is turned away from the light, 1 is facing it. */
  brightness: number;
  /** Unit normal, always pointing towards the viewer. */
  normal: Vec3;
}

/** Segments around a cylinder. Smooth enough to read as round. */
const CYLINDER_SEGMENTS = 36;
/** Rings and segments on a sphere. Kept modest so turning it stays smooth. */
const SPHERE_RINGS = 12;
const SPHERE_SEGMENTS = 20;

/** Used for any dimension a question did not state. */
const FALLBACK_SIZE = 3;

/** The viewer sits this far away, measured in shape radii. */
const VIEW_DISTANCE = 6;

/**
 * How much bigger the nearest point can get from perspective. Dividing this
 * out of the scale is what guarantees the shape still fits inside `size`
 * whichever way it is turned, instead of being clipped at the silhouette.
 */
const PERSPECTIVE_MAX = VIEW_DISTANCE / (VIEW_DISTANCE - 1);

/**
 * Where the light comes from: up, to the right and slightly towards the
 * viewer. A unit vector, so a face's brightness lands between 0 and 1.
 *
 * A single directional light cannot light a corner view evenly — the face
 * pointing away from it goes black — so the ambient term below lifts the
 * darkest face to a shade that still reads on a light background.
 */
const LIGHT: Vec3 = normalize([0.55, 0.62, 0.56]);

/** Light every face receives regardless of which way it points. */
const AMBIENT = 0.45;

function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

/** A box centred on the origin: a cube when all three sides match. */
function boxMesh(width: number, depth: number, height: number): Mesh {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;

  return {
    vertices: [
      [-x, -y, z],
      [x, -y, z],
      [x, y, z],
      [-x, y, z],
      [-x, -y, -z],
      [x, -y, -z],
      [x, y, -z],
      [-x, y, -z],
    ],
    faces: [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [1, 2, 6, 5],
      [2, 3, 7, 6],
      [3, 0, 4, 7],
    ],
  };
}

/**
 * A triangular prism: a three-sided cross-section pushed through a depth.
 *
 * The triangle faces the viewer and the solid runs back into the screen, which
 * is what makes it read as a prism rather than a slab — with the cross-section
 * lying flat it would be edge-on from the opening view and nearly invisible.
 */
function prismMesh(width: number, depth: number, height: number): Mesh {
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;

  return {
    vertices: [
      [-x, -y, z],
      [x, -y, z],
      [0, y, z],
      [-x, -y, -z],
      [x, -y, -z],
      [0, y, -z],
    ],
    faces: [
      [0, 1, 2],
      [3, 4, 5],
      [0, 1, 4, 3],
      [1, 2, 5, 4],
      [2, 0, 3, 5],
    ],
  };
}

/** A cylinder standing on its base, so the axis runs through y. */
function cylinderMesh(radius: number, height: number): Mesh {
  const vertices: Vec3[] = [];
  const faces: number[][] = [];
  const half = height / 2;

  for (let i = 0; i < CYLINDER_SEGMENTS; i += 1) {
    const angle = (i / CYLINDER_SEGMENTS) * Math.PI * 2;
    vertices.push([Math.cos(angle) * radius, -half, Math.sin(angle) * radius]);
  }
  for (let i = 0; i < CYLINDER_SEGMENTS; i += 1) {
    const angle = (i / CYLINDER_SEGMENTS) * Math.PI * 2;
    vertices.push([Math.cos(angle) * radius, half, Math.sin(angle) * radius]);
  }

  for (let i = 0; i < CYLINDER_SEGMENTS; i += 1) {
    const next = (i + 1) % CYLINDER_SEGMENTS;
    faces.push([i, next, CYLINDER_SEGMENTS + next, CYLINDER_SEGMENTS + i]);
  }

  const bottom = Array.from({ length: CYLINDER_SEGMENTS }, (_, i) => i);
  const top = Array.from({ length: CYLINDER_SEGMENTS }, (_, i) => CYLINDER_SEGMENTS + i);
  faces.push(bottom);
  faces.push(top);

  return { vertices, faces };
}

/** A sphere as a grid of latitude and longitude, poles included. */
function sphereMesh(radius: number): Mesh {
  const vertices: Vec3[] = [];
  const faces: number[][] = [];

  for (let ring = 0; ring <= SPHERE_RINGS; ring += 1) {
    const phi = (ring / SPHERE_RINGS) * Math.PI;
    const y = Math.cos(phi) * radius;
    const ringRadius = Math.sin(phi) * radius;

    for (let segment = 0; segment < SPHERE_SEGMENTS; segment += 1) {
      const theta = (segment / SPHERE_SEGMENTS) * Math.PI * 2;
      vertices.push([Math.cos(theta) * ringRadius, y, Math.sin(theta) * ringRadius]);
    }
  }

  for (let ring = 0; ring < SPHERE_RINGS; ring += 1) {
    for (let segment = 0; segment < SPHERE_SEGMENTS; segment += 1) {
      const next = (segment + 1) % SPHERE_SEGMENTS;
      const a = ring * SPHERE_SEGMENTS + segment;
      const b = ring * SPHERE_SEGMENTS + next;
      const c = (ring + 1) * SPHERE_SEGMENTS + next;
      const d = (ring + 1) * SPHERE_SEGMENTS + segment;
      faces.push([a, b, c, d]);
    }
  }

  return { vertices, faces };
}

/** The mesh for a question's solid, filling in any dimension it left out. */
export function buildMesh(shape: SolidShape): Mesh {
  const width = shape.width ?? FALLBACK_SIZE;
  const depth = shape.depth ?? width;
  const height = shape.height ?? width;
  const radius = shape.radius ?? Math.min(width, depth) / 2;

  switch (shape.kind) {
    case "cube":
      return boxMesh(width, width, width);
    case "cuboid":
      return boxMesh(width, depth, height);
    case "prism":
      return prismMesh(width, depth, height);
    case "cylinder":
      return cylinderMesh(radius, height);
    case "sphere":
      return sphereMesh(radius);
  }
}

/** Turns a point about x, then about y. */
export function rotatePoint(point: Vec3, ax: number, ay: number): Vec3 {
  const [x, y, z] = point;

  const cosY = Math.cos(ay);
  const sinY = Math.sin(ay);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  const cosX = Math.cos(ax);
  const sinX = Math.sin(ax);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return [x1, y1, z2];
}

/** Distance from the centre to the furthest vertex. */
export function boundingRadius(mesh: Mesh): number {
  let radius = 0;
  for (const vertex of mesh.vertices) {
    radius = Math.max(radius, Math.hypot(vertex[0], vertex[1], vertex[2]));
  }
  return radius || 1;
}

/**
 * Rotates, projects and orders the faces for painting.
 *
 * `size` is the width of the square the shape must fit inside, and the scale is
 * derived from the bounding sphere rather than the current pose, so turning the
 * shape does not make it grow and shrink. Every projected point stays within
 * `size / 2` of the centre at any rotation.
 */
export function projectMesh(
  mesh: Mesh,
  rotation: { ax: number; ay: number },
  size: number,
): ProjectedFace[] {
  const radius = boundingRadius(mesh);
  const scale = size / 2 / (radius * PERSPECTIVE_MAX);
  const rotated = mesh.vertices.map((vertex) => rotatePoint(vertex, rotation.ax, rotation.ay));

  const faces: ProjectedFace[] = [];
  for (const face of mesh.faces) {
    const points: { x: number; y: number }[] = [];
    let depth = 0;

    for (const index of face) {
      const vertex = rotated[index];
      // A gentle perspective: nearer points grow a little.
      const factor = VIEW_DISTANCE / (VIEW_DISTANCE - vertex[2] / radius);
      points.push({
        x: vertex[0] * scale * factor,
        y: -vertex[1] * scale * factor,
      });
      depth += vertex[2] / radius;
    }

    const normal = cross(
      subtract(rotated[face[1]], rotated[face[0]]),
      subtract(rotated[face[2]], rotated[face[0]]),
    );
    const length = Math.hypot(normal[0], normal[1], normal[2]);
    // Degenerate faces (the slivers at a sphere's poles) have no normal and
    // nothing to draw, so they are dropped rather than divided by zero.
    if (length < 1e-9) continue;

    const unit: Vec3 = [normal[0] / length, normal[1] / length, normal[2] / length];
    // Shade whichever side of the face the viewer can actually see. Far faces
    // are painted first and then covered, so it does not matter that a back
    // face is lit as brightly as the front face it mirrors.
    const facing: Vec3 = unit[2] < 0 ? [-unit[0], -unit[1], -unit[2]] : unit;
    const lit = Math.max(
      0,
      facing[0] * LIGHT[0] + facing[1] * LIGHT[1] + facing[2] * LIGHT[2],
    );

    faces.push({
      points,
      depth: depth / face.length,
      brightness: clamp(AMBIENT + (1 - AMBIENT) * lit, 0, 1),
      normal: facing,
    });
  }

  // Painted in ascending depth: furthest first, nearest last.
  return faces.sort((a, b) => a.depth - b.depth);
}

/**
 * Reads a CSS colour written the way this project writes them, "217 91% 60%",
 * into its three numbers.
 *
 * Kept here rather than in the component so the parsing can be checked against
 * the real value in the stylesheet without a browser.
 */
export function parseHslTriplet(raw: string): { h: number; s: number; l: number } | null {
  const parts = raw.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!parts) return null;
  return { h: Number(parts[1]), s: Number(parts[2]), l: Number(parts[3]) };
}

/**
 * Turns a face's brightness into the lightness to paint it at.
 *
 * The swing is deliberately wide: two faces of a cube that catch the light at
 * slightly different angles have to end up visibly different shades, otherwise
 * the solid reads as a flat outline.
 *
 * With the light and ambient above, a cube's three visible faces land roughly
 * 34, 64 and 78 out of 100 against a mid-tone theme colour: the top face is the
 * lightest and one side is clearly in shadow.
 */
export function faceLightness(baseLightness: number, brightness: number): number {
  return clamp(baseLightness + (brightness - 0.62) * 110, 16, 88);
}

/** What the drawing shows, for screen readers and the caption tooltip. */
export function describeShape(shape: SolidShape): string {
  const names: Record<SolidShape["kind"], string> = {
    cube: "cube",
    cuboid: "rectangular prism",
    prism: "prism",
    cylinder: "cylinder",
    sphere: "sphere",
  };
  return `Interactive 3D ${names[shape.kind]}`;
}
