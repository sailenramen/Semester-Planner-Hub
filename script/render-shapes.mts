/**
 * Renders the shapes to a PNG with the same projection, paint order and shading
 * the canvas uses, so the drawing can actually be looked at without a browser.
 *
 * Run from the project root: npx tsx script/render-shapes.mts
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { buildMesh, faceLightness, projectMesh } from "../client/src/lib/shapes3d";
import type { SolidShape } from "../client/src/lib/studyContent";

const CELL = 200;
const DRAW_SIZE = 176;
const SHAPES: SolidShape[] = [
  { kind: "cube", width: 3, depth: 3, height: 3 },
  { kind: "cuboid", width: 4, depth: 3, height: 5 },
  { kind: "prism", width: 3, depth: 3, height: 4 },
  { kind: "cylinder", radius: 2, height: 10 },
  { kind: "sphere", radius: 3 },
];
const ROTATION = { ax: 0.4, ay: 0.6 };
const PRIMARY = { h: 221, s: 83, l: 53 };

const width = CELL * SHAPES.length;
const height = CELL;
const pixels = new Uint8Array(width * height * 4).fill(255);

function setPixel(x: number, y: number, rgb: [number, number, number], alpha: number) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= width || py >= height) return;
  const offset = (py * width + px) * 4;
  for (let i = 0; i < 3; i += 1) {
    pixels[offset + i] = Math.round(pixels[offset + i] * (1 - alpha) + rgb[i] * alpha);
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = light - c / 2;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function insidePolygon(points: { x: number; y: number }[], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const a = points[i];
    const b = points[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

function drawLine(
  from: { x: number; y: number },
  to: { x: number; y: number },
  rgb: [number, number, number],
) {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    setPixel(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, rgb, 1);
  }
}

SHAPES.forEach((shape, cell) => {
  const originX = cell * CELL + CELL / 2;
  const originY = CELL / 2;
  const faces = projectMesh(buildMesh(shape), ROTATION, DRAW_SIZE);

  for (const face of faces) {
    const points = face.points.map((p) => ({ x: originX + p.x, y: originY + p.y }));
    const lightness = faceLightness(PRIMARY.l, face.brightness);
    const fill = hslToRgb(PRIMARY.h, PRIMARY.s, lightness);
    const edge = hslToRgb(PRIMARY.h, PRIMARY.s, Math.max(10, lightness - 18));

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.floor(Math.min(...xs));
    const maxX = Math.ceil(Math.max(...xs));
    const minY = Math.floor(Math.min(...ys));
    const maxY = Math.ceil(Math.max(...ys));

    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        if (insidePolygon(points, x + 0.5, y + 0.5)) setPixel(x, y, fill, 1);
      }
    }

    for (let i = 0; i < points.length; i += 1) {
      drawLine(points[i], points[(i + 1) % points.length], edge);
    }
  }
});

// ------------------------------------------------------------------- PNG out

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  raw[y * (width * 4 + 1)] = 0;
  Buffer.from(pixels.buffer, y * width * 4, width * 4).copy(raw, y * (width * 4 + 1) + 1);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

writeFileSync("shape-preview.png", png);
console.log(`Wrote shape-preview.png (${width}×${height}) with ${SHAPES.length} shapes.`);
