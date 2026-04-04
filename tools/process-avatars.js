/**
 * process-avatars.js
 *
 * Extracts individual agent headshots from a composite team grid image
 * using tracking.js face detection (Viola-Jones).
 *
 * Input:  docs/agents/images/team-grid.png  (5 top row, 4 bottom row)
 * Output: docs/agents/images/headshots/{name}.png  (square cropped per agent)
 *
 * Agent order (left-to-right, top-to-bottom):
 *   Top row:    1-Conductor, 2-Compass, 3-Keystone, 4-Lens, 5-Palette
 *   Bottom row: 6-Forge, 7-Pixel, 8-Sentinel, 9-Circuit
 *
 * Usage: node tools/process-avatars.js [--padding 1.5]
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// --- Configuration ---
const AGENTS_ORDER = ['conductor', 'compass', 'keystone', 'lens', 'palette', 'forge', 'pixel', 'sentinel', 'circuit'];
const TOP_ROW_COUNT = 5;
const BOTTOM_ROW_COUNT = 4;
const OUTPUT_SIZE = 200; // px — square headshot output

const IMAGES_DIR = path.resolve(__dirname, '..', 'docs', 'agents', 'images');
const HEADSHOTS_DIR = path.join(IMAGES_DIR, 'headshots');

// Find team-grid file with case-insensitive match (Windows may save as Team-Grid.PNG)
function findGridFile() {
  if (!fs.existsSync(IMAGES_DIR)) return null;
  const files = fs.readdirSync(IMAGES_DIR);
  const match = files.find((f) => f.toLowerCase() === 'team-grid.png');
  if (!match) return null;
  // Rename to lowercase if needed (normalize for Linux)
  const fullPath = path.join(IMAGES_DIR, match);
  const normalizedPath = path.join(IMAGES_DIR, 'team-grid.png');
  if (match !== 'team-grid.png') {
    fs.renameSync(fullPath, normalizedPath);
    console.log(`[avatars] Normalized filename: ${match} → team-grid.png`);
  }
  return normalizedPath;
}
const GRID_FILE = findGridFile();

// Parse --padding flag (default 1.5x around detected face)
const paddingArg = process.argv.indexOf('--padding');
const PADDING_MULTIPLIER = paddingArg !== -1 ? parseFloat(process.argv[paddingArg + 1]) : 1.5;

// --- Shim window/document for tracking.js in Node.js ---
// tracking.js expects browser globals (window, document, navigator)
// and uses bare `tracking` references that must be on the global scope
const windowShim = {
  tracking: {},
  navigator: { userAgent: 'node' },
  document: { createElement: () => ({ getContext: () => ({}) }) },
  self: {},
};
windowShim.self = windowShim;
global.window = windowShim;
global.document = windowShim.document;
global.navigator = windowShim.navigator;
global.self = windowShim;
global.tracking = windowShim.tracking;

// Load tracking.js and face classifier
require('tracking');
require('tracking/build/data/face-min');

const tracking = global.tracking;

/**
 * Detect faces in an image buffer using tracking.js Viola-Jones.
 * Returns array of { x, y, width, height } rectangles.
 */
function detectFaces(imageData, width, height) {
  const classifier = tracking.ViolaJones.classifiers.face;
  if (!classifier) {
    throw new Error('Face classifier not loaded');
  }

  // Convert RGBA imageData to grayscale pixel array
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = imageData[i * 4];
    const g = imageData[i * 4 + 1];
    const b = imageData[i * 4 + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  // Run Viola-Jones detection
  const rects = tracking.ViolaJones.detect(gray, width, height, 1.1, 2.0, 0.1, classifier);

  // rects is a flat array: [x1, y1, w1, h1, x2, y2, w2, h2, ...]
  const faces = [];
  for (let i = 0; i < rects.length; i += 4) {
    faces.push({
      x: rects[i],
      y: rects[i + 1],
      width: rects[i + 2],
      height: rects[i + 3],
    });
  }

  return faces;
}

/**
 * Merge overlapping face detections (non-maximum suppression).
 */
function mergeOverlapping(faces, overlapThreshold = 0.3) {
  if (faces.length === 0) return [];

  // Sort by area descending
  const sorted = [...faces].sort((a, b) => b.width * b.height - a.width * a.height);
  const merged = [];
  const used = new Set();

  for (let i = 0; i < sorted.length; i++) {
    if (used.has(i)) continue;

    const group = [sorted[i]];
    used.add(i);

    for (let j = i + 1; j < sorted.length; j++) {
      if (used.has(j)) continue;

      const a = sorted[i];
      const b = sorted[j];

      // Check overlap
      const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
      const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
      const overlapArea = overlapX * overlapY;
      const minArea = Math.min(a.width * a.height, b.width * b.height);

      if (overlapArea / minArea > overlapThreshold) {
        group.push(sorted[j]);
        used.add(j);
      }
    }

    // Average the group into one detection
    const avgX = group.reduce((s, f) => s + f.x, 0) / group.length;
    const avgY = group.reduce((s, f) => s + f.y, 0) / group.length;
    const avgW = group.reduce((s, f) => s + f.width, 0) / group.length;
    const avgH = group.reduce((s, f) => s + f.height, 0) / group.length;
    merged.push({ x: Math.round(avgX), y: Math.round(avgY), width: Math.round(avgW), height: Math.round(avgH) });
  }

  return merged;
}

/**
 * Sort faces into grid order: top row L→R, bottom row L→R.
 */
function sortFacesGridOrder(faces, imgHeight) {
  const midY = imgHeight / 2;

  const topRow = faces.filter((f) => f.y + f.height / 2 < midY).sort((a, b) => a.x - b.x);
  const bottomRow = faces.filter((f) => f.y + f.height / 2 >= midY).sort((a, b) => a.x - b.x);

  return [...topRow, ...bottomRow];
}

/**
 * Fallback: divide the composite into a grid if face detection fails.
 */
function gridFallback(imgWidth, imgHeight) {
  console.log('[avatars] Face detection insufficient — using grid fallback');
  const faces = [];

  // Top row: 5 cells
  const cellW = imgWidth / TOP_ROW_COUNT;
  const cellH = imgHeight / 2;
  for (let i = 0; i < TOP_ROW_COUNT; i++) {
    const size = Math.min(cellW, cellH) * 0.6;
    faces.push({
      x: Math.round(i * cellW + (cellW - size) / 2),
      y: Math.round((cellH - size) / 2),
      width: Math.round(size),
      height: Math.round(size),
    });
  }

  // Bottom row: 4 cells (centered)
  const bottomCellW = imgWidth / BOTTOM_ROW_COUNT;
  for (let i = 0; i < BOTTOM_ROW_COUNT; i++) {
    const size = Math.min(bottomCellW, cellH) * 0.6;
    faces.push({
      x: Math.round(i * bottomCellW + (bottomCellW - size) / 2),
      y: Math.round(cellH + (cellH - size) / 2),
      width: Math.round(size),
      height: Math.round(size),
    });
  }

  return faces;
}

/**
 * Crop a face region with padding and save as a square PNG.
 */
function cropAndSave(sourceCanvas, face, outputPath, padding) {
  const imgW = sourceCanvas.width;
  const imgH = sourceCanvas.height;

  // Expand face rect by padding multiplier
  const centerX = face.x + face.width / 2;
  const centerY = face.y + face.height / 2;
  const size = Math.max(face.width, face.height) * padding;

  let cropX = Math.round(centerX - size / 2);
  let cropY = Math.round(centerY - size / 2);
  let cropSize = Math.round(size);

  // Clamp to image bounds
  cropX = Math.max(0, cropX);
  cropY = Math.max(0, cropY);
  if (cropX + cropSize > imgW) cropSize = imgW - cropX;
  if (cropY + cropSize > imgH) cropSize = imgH - cropY;

  // Make it square (take the smaller dimension)
  const finalSize = Math.min(cropSize, cropSize);

  // Draw cropped region to output canvas
  const outCanvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const ctx = outCanvas.getContext('2d');
  ctx.drawImage(sourceCanvas, cropX, cropY, finalSize, finalSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  const buffer = outCanvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

async function main() {
  // Check input exists
  if (!GRID_FILE) {
    console.log(`[avatars] No team-grid.png found in ${IMAGES_DIR} — skipping avatar extraction`);
    process.exit(0);
  }

  // Ensure output directory exists
  if (!fs.existsSync(HEADSHOTS_DIR)) {
    fs.mkdirSync(HEADSHOTS_DIR, { recursive: true });
  }

  console.log(`[avatars] Loading ${GRID_FILE}`);
  const image = await loadImage(GRID_FILE);
  const { width, height } = image;
  console.log(`[avatars] Image size: ${width}x${height}`);

  // Draw image to canvas for pixel access
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  // Detect faces
  console.log('[avatars] Running face detection...');
  let faces = detectFaces(imageData, width, height);
  console.log(`[avatars] Raw detections: ${faces.length}`);

  // Merge overlapping detections
  faces = mergeOverlapping(faces);
  console.log(`[avatars] After merge: ${faces.length} faces`);

  // Need exactly 9 faces
  if (faces.length < 9) {
    faces = gridFallback(width, height);
  } else if (faces.length > 9) {
    // Take the 9 largest
    faces.sort((a, b) => b.width * b.height - a.width * a.height);
    faces = faces.slice(0, 9);
  }

  // Sort into grid order
  faces = sortFacesGridOrder(faces, height);

  if (faces.length !== 9) {
    console.error(`[avatars] Expected 9 faces, got ${faces.length}. Check input image.`);
    process.exit(1);
  }

  // Extract and save each headshot
  for (let i = 0; i < AGENTS_ORDER.length; i++) {
    const agentName = AGENTS_ORDER[i];
    const face = faces[i];
    const outputPath = path.join(HEADSHOTS_DIR, `${agentName}.png`);

    cropAndSave(canvas, face, outputPath, PADDING_MULTIPLIER);
    console.log(`[avatars] ${agentName}: face at (${face.x},${face.y}) ${face.width}x${face.height} → ${outputPath}`);
  }

  console.log(`[avatars] Done. ${AGENTS_ORDER.length} headshots saved to ${HEADSHOTS_DIR}`);
}

main().catch((err) => {
  console.error('[avatars] Error:', err.message);
  process.exit(1);
});
