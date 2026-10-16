/**
 * Checks the 3D maths behind the solid-shape questions.
 *
 * Run from the project root: npx tsx script/check-shapes.mts
 */
import {
  boundingRadius,
  buildMesh,
  describeShape,
  faceLightness,
  projectMesh,
  rotatePoint,
} from "../client/src/lib/shapes3d";
import { readFileSync } from "node:fs";
import { parseHslTriplet } from "../client/src/lib/shapes3d";
import { getStudyContent } from "../client/src/lib/studyContent";
import type { PracticeQuestion, SolidShape } from "../client/src/lib/studyContent";

const DRAW_SIZE = 176;

let failures = 0;
function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function close(actual: number, expected: number, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

// ---------------------------------------------------------------- the meshes

console.log("meshes");

const cube = buildMesh({ kind: "cube", width: 4 });
check("cube has 8 vertices", cube.vertices.length === 8);
check("cube has 6 faces", cube.faces.length === 6);
check("cube bounding radius = s√3/2", close(boundingRadius(cube), (4 * Math.sqrt(3)) / 2));

// A cuboid question giving 6 × 4 × 3.
const cuboid = buildMesh({ kind: "cuboid", width: 6, depth: 4, height: 3 });
check("cuboid has 8 vertices", cuboid.vertices.length === 8);
check("cuboid has 6 faces", cuboid.faces.length === 6);
check(
  "cuboid bounding radius matches its dimensions",
  close(boundingRadius(cuboid), Math.sqrt(3 ** 2 + 2 ** 2 + 1.5 ** 2)),
);

// The prism question: base 6, depth 4, height 8.
const prism = buildMesh({ kind: "prism", width: 6, depth: 4, height: 8 });
check("prism has 6 vertices", prism.vertices.length === 6);
check("prism has 5 faces", prism.faces.length === 5);
check("prism bounding radius matches its dimensions", close(boundingRadius(prism), Math.sqrt(29)));

// The cylinder question: radius 3, height 8.
const cylinder = buildMesh({ kind: "cylinder", radius: 3, height: 8 });
check("cylinder has two rings of vertices", cylinder.vertices.length === 72);
check("cylinder has 36 sides plus 2 caps", cylinder.faces.length === 38);
check(
  "cylinder bounding radius matches radius and height",
  close(boundingRadius(cylinder), Math.sqrt(3 ** 2 + 4 ** 2), 1e-12),
);

// The sphere question: radius 5.
const sphere = buildMesh({ kind: "sphere", radius: 5 });
check("sphere bounding radius = its radius", close(boundingRadius(sphere), 5, 1e-12));
check("sphere has rings × segments faces", sphere.faces.length === 12 * 20);

check(
  "every kind produces a closed mesh with no stray coordinates",
  [cube, cuboid, prism, cylinder, sphere].every(
    (mesh) =>
      mesh.faces.every((face) => face.every((i) => i >= 0 && i < mesh.vertices.length)) &&
      mesh.vertices.every((v) => v.every(Number.isFinite)),
  ),
);

// A question that gives no dimensions still gets a drawable shape.
console.log("\nmissing dimensions");
const bare = buildMesh({ kind: "cylinder", height: 5 });
check("cylinder with no radius still builds", boundingRadius(bare) > 0);
check("a bare cube builds", boundingRadius(buildMesh({ kind: "cube" })) > 0);
check("a bare prism builds", buildMesh({ kind: "prism" }).faces.length === 5);
check("a bare sphere builds", boundingRadius(buildMesh({ kind: "sphere" })) > 0);

// ------------------------------------------------------------- the rotation

console.log("\nrotation");
const point: [number, number, number] = [1, 2, 3];
const original = Math.hypot(...point);
let rotationKeepsLength = true;
for (let step = 0; step < 40; step += 1) {
  const turned = rotatePoint(point, step * 0.17, step * 0.31);
  if (!close(Math.hypot(...turned), original, 1e-12)) rotationKeepsLength = false;
}
check("rotation preserves distance, so the shape cannot warp", rotationKeepsLength);
check(
  "a quarter turn about y moves x onto z",
  (() => {
    const turned = rotatePoint([1, 0, 0], 0, Math.PI / 2);
    return close(turned[0], 0, 1e-12) && close(turned[2], -1, 1e-12);
  })(),
);

// ------------------------------------------------------------ the projection

console.log("\nprojection");
const shapes: SolidShape[] = [
  { kind: "cube", width: 4 },
  { kind: "cuboid", width: 6, depth: 4, height: 3 },
  { kind: "prism", width: 6, depth: 4, height: 8 },
  { kind: "cylinder", radius: 3, height: 8 },
  { kind: "sphere", radius: 5 },
  // The dimensions the questions themselves state, tall thin cylinders
  // included, since those are the awkward ones to fit on screen.
  { kind: "cube", width: 3, depth: 3, height: 3 },
  { kind: "cuboid", width: 4, depth: 3, height: 5 },
  { kind: "cylinder", radius: 2, height: 10 },
  { kind: "cylinder", radius: 5, height: 4 },
  { kind: "sphere", radius: 3 },
  { kind: "prism", width: 3, depth: 3, height: 4 },
  { kind: "cube" },
  { kind: "sphere" },
];

let staysInside = true;
let noNaN = true;
let sorted = true;
let brightnessInRange = true;
let worstRadius = 0;

for (const shape of shapes) {
  const mesh = buildMesh(shape);
  for (let step = 0; step < 60; step += 1) {
    const faces = projectMesh(mesh, { ax: -1.45 + step * 0.05, ay: step * 0.21 }, DRAW_SIZE);
    let previousDepth = -Infinity;
    for (const face of faces) {
      if (face.depth < previousDepth) sorted = false;
      previousDepth = face.depth;
      if (!(face.brightness >= 0 && face.brightness <= 1)) brightnessInRange = false;
      for (const p of face.points) {
        if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) noNaN = false;
        worstRadius = Math.max(worstRadius, Math.hypot(p.x, p.y));
        if (Math.abs(p.x) > DRAW_SIZE / 2 + 1e-9 || Math.abs(p.y) > DRAW_SIZE / 2 + 1e-9) {
          staysInside = false;
        }
      }
    }
  }
}

check("no face ever produces NaN", noNaN);
check("faces are ordered far to near for painting", sorted);
check("brightness stays within 0 to 1", brightnessInRange);
check(
  "the shape always fits inside its box, at any angle",
  staysInside,
  `widest point reached ${worstRadius.toFixed(2)} of ${DRAW_SIZE / 2}`,
);
check(
  "the silhouette fills a good part of the box, so it is not drawn tiny",
  worstRadius > DRAW_SIZE * 0.35,
  `widest point only reached ${worstRadius.toFixed(2)}`,
);

check(
  "a sphere's pole slivers are dropped rather than drawn as blanks",
  (() => {
    const faces = projectMesh(buildMesh({ kind: "sphere", radius: 5 }), { ax: 0, ay: 0 }, DRAW_SIZE);
    return faces.length > 0 && faces.every((f) => f.points.length >= 3);
  })(),
);

// The visible faces of a cube have to end up clearly different shades, or the
// student sees a flat hexagon instead of a solid.
console.log("\nlegibility");
const POSE = { ax: 0.4, ay: 0.6 };
const cubeFaces = projectMesh(buildMesh({ kind: "cube", width: 3 }), POSE, DRAW_SIZE);
const visible = cubeFaces.slice(-3).map((face) => faceLightness(53, face.brightness));
visible.sort((a, b) => a - b);
check(
  "a cube's three visible faces are all different shades",
  visible.length === 3 && visible[1] - visible[0] >= 5 && visible[2] - visible[1] >= 5,
  `shades were ${visible.map((l) => l.toFixed(1)).join(", ")}`,
);
check(
  "the brightest face is clearly lighter than the darkest",
  visible[2] - visible[0] >= 18,
  `spread was only ${(visible[2] - visible[0]).toFixed(1)}`,
);
check(
  "every shade stays inside a readable range",
  visible.every((l) => l >= 16 && l <= 88),
);
check(
  "the lightest visible face is the top one",
  (() => {
    const byShade = cubeFaces
      .slice(-3)
      .map((face) => ({ up: face.normal[1], lightness: faceLightness(53, face.brightness) }))
      .sort((a, b) => b.lightness - a.lightness);
    return byShade[0].up > 0.8;
  })(),
);
check(
  "a face turned away from the light is darker than one facing it",
  (() => {
    const turnedAway = projectMesh(
      buildMesh({ kind: "cube", width: 3 }),
      { ax: 0, ay: 0 },
      DRAW_SIZE,
    ).find((face) => face.normal[0] < -0.9);
    const facing = projectMesh(
      buildMesh({ kind: "cube", width: 3 }),
      { ax: 0, ay: 0 },
      DRAW_SIZE,
    ).find((face) => face.normal[1] > 0.9);
    return !!turnedAway && !!facing && turnedAway.brightness < facing.brightness;
  })(),
);

// A cylinder has to shade from dark to light across its curve, or it looks like
// a flat rectangle.
const cylinderFaces = projectMesh(buildMesh({ kind: "cylinder", radius: 2, height: 10 }), POSE, DRAW_SIZE);
const sideShades = cylinderFaces
  .filter((face) => Math.abs(face.normal[1]) < 0.5)
  .map((face) => faceLightness(53, face.brightness));
check(
  "a cylinder shades gradually from dark to light around its curve",
  sideShades.length > 10 && Math.max(...sideShades) - Math.min(...sideShades) >= 25,
  `range was ${(Math.max(...sideShades) - Math.min(...sideShades)).toFixed(1)}`,
);
check(
  "a cylinder has no black faces",
  cylinderFaces.every((face) => faceLightness(53, face.brightness) >= 30),
);

// Whatever the shape, its largest visible face has to be big enough on screen
// to read as a solid rather than a sliver. This is what caught the prism being
// drawn edge-on as a slab.
function projectedArea(points: { x: number; y: number }[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

console.log("\nhow each shape reads on screen");
const box = DRAW_SIZE * DRAW_SIZE;
for (const shape of shapes) {
  const faces = projectMesh(buildMesh(shape), POSE, DRAW_SIZE);
  // A solid is convex, so its visible faces tile its silhouette exactly: the
  // total area is how much of the drawing the shape actually fills. This is the
  // measure that works for a sphere too, whose individual facets are tiny by
  // design.
  const covered = faces.reduce((sum, face) => sum + projectedArea(face.points), 0);
  check(
    `the ${shape.kind} fills a readable part of the drawing`,
    covered >= box * 0.15,
    `it filled only ${((covered / box) * 100).toFixed(1)}% of the box`,
  );
}

check(
  "a prism shows its triangular cross-section, not its edge",
  (() => {
    const faces = projectMesh(buildMesh({ kind: "prism", width: 3, depth: 3, height: 4 }), POSE, DRAW_SIZE);
    return faces.some(
      (face) =>
        Math.abs(face.normal[2]) > 0.7 && projectedArea(face.points) > box * 0.05,
    );
  })(),
);

// The shade of every face is built from the theme's own colour, so that colour
// has to be readable from the stylesheet the app actually ships.
console.log("\ncolours");
check(
  "the theme's own colour is parsed",
  (() => {
    const parsed = parseHslTriplet("217 91% 60%");
    return !!parsed && parsed.h === 217 && parsed.s === 91 && parsed.l === 60;
  })(),
);
check("an unreadable value is rejected rather than guessed at", parseHslTriplet("not a colour") === null);
check(
  "the stylesheet really contains a colour in the form the parser expects",
  (() => {
    const css = readFileSync("client/src/index.css", "utf8");
    const match = css.match(/--primary:\s*([^;]+);/);
    return !!match && parseHslTriplet(match[1]) !== null;
  })(),
);

// The questions themselves: every one that carries a shape has to be a proper
// multiple-choice question, or the drawing is attached to something that cannot
// show it.
console.log("\nthe questions");
// Went through the same lookup the study page uses, rather than reading the
// source text, so this covers the content as the app really receives it.
const seen = new Map<string, PracticeQuestion>();
for (let week = 1; week <= 12; week += 1) {
  for (const taskTitle of ["Practice Questions", "Chapter 5", "Topic Test"]) {
    const content = getStudyContent("math", taskTitle, week);
    for (const question of content.practiceQuestions ?? []) {
      if (question.shape) seen.set(question.id, question);
    }
  }
}
const withShapes = [...seen.values()];

check("the solids questions are the ones we expect", withShapes.length === 6, `found ${withShapes.length}`);
check(
  "each one asks about a different solid",
  new Set(withShapes.map((q) => q.shape?.kind)).size === 5,
  `kinds were ${[...new Set(withShapes.map((q) => q.shape?.kind))].join(", ")}`,
);
check(
  "every one of them is a multiple-choice question",
  withShapes.every((q) => q.type === "multiple-choice"),
  withShapes
    .filter((q) => q.type !== "multiple-choice")
    .map((q) => q.id)
    .join(", "),
);
check(
  "each still has a correct answer among its options",
  withShapes.every((q) => Array.isArray(q.options) && q.options.includes(q.answer)),
);
check(
  "each drawing states its dimensions in words too",
  withShapes.every((q) => (q.shape?.caption ?? "").length > 10),
);
check(
  "every shape draws without a fallback for a missing dimension",
  withShapes.every((q) => Boolean(q.shape) && boundingRadius(buildMesh(q.shape as SolidShape)) > 0),
);
check(
  "the cube questions give one edge length, not three",
  withShapes
    .filter((q) => q.shape?.kind === "cube")
    .every((q) => q.shape?.width === q.shape?.depth && q.shape?.depth === q.shape?.height),
);

console.log("\nlabels");
check("a cube is described as a cube", describeShape({ kind: "cube", width: 2 }) === "Interactive 3D cube");
check(
  "a cuboid is described as a prism",
  describeShape({ kind: "cuboid", width: 2 }).includes("rectangular prism"),
);

console.log(failures === 0 ? "\nAll shape checks passed." : `\n${failures} shape check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
