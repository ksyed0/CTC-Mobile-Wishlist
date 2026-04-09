#!/usr/bin/env node
'use strict';

/**
 * ID Renumbering Script
 *
 * Converts all project IDs from flat global-sequential format to embedded-hierarchy format:
 *   EPIC-0001        → EPIC-001
 *   US-0001          → US-001-001   (epic.story)
 *   AC-0001          → AC-001-001-001   (epic.story.ac)
 *   TASK-0001        → TASK-001-001-001 (epic.story.task)
 *   TC-0001          → TC-001-001-001   (epic.story.tc)
 *   BUG-0001         → BUG-001   (flat 3-digit)
 *   L-0001           → L-001    (flat 3-digit)
 *
 * Usage:
 *   node tools/renumber-ids.js --dry-run   # Print mapping table, no file changes
 *   node tools/renumber-ids.js --apply     # Apply renaming across all target files
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const APPLY = process.argv.includes('--apply');

if (!DRY_RUN && !APPLY) {
  console.error('Usage: node tools/renumber-ids.js [--dry-run | --apply]');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad(n, digits) {
  return String(n).padStart(digits, '0');
}

function extractCodeBlocks(md) {
  const blocks = [];
  const re = /```[^\n]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md)) !== null) blocks.push(m[1]);
  return blocks;
}

// ─── Step 1: Parse RELEASE_PLAN.md → build EPIC / US / AC / TASK mappings ────

function buildReleasePlanMappings(md) {
  const epicMap = new Map(); // "EPIC-0001" → "EPIC-001"
  const storyMap = new Map(); // "US-0001" → { newId, epicNum, storyNum, storyKey }
  const acMap = new Map(); // "AC-0001" → "AC-001-001-001"
  const taskMap = new Map(); // "TASK-0001" → "TASK-001-001-001"

  let epicCounter = 0;
  const epicStoryCounters = {}; // epicNum → count
  const storyAcCounters = {}; // storyKey → count
  const storyTaskCounters = {}; // storyKey → count

  for (const block of extractCodeBlocks(md)) {
    for (const chunk of block.split(/\n{2,}/)) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      // ── Epic block ──────────────────────────────────────────────────────────
      if (/^EPIC-\d{4}:/.test(trimmed)) {
        const m = trimmed.match(/^(EPIC-\d{4}):/);
        if (m && !epicMap.has(m[1])) {
          epicCounter++;
          const epicNum = pad(epicCounter, 3);
          epicMap.set(m[1], `EPIC-${epicNum}`);
          epicStoryCounters[epicNum] = 0;
        }
        continue;
      }

      // ── Story block ─────────────────────────────────────────────────────────
      if (/^US-\d{4}\s*\(EPIC-/.test(trimmed)) {
        const m = trimmed.match(/^(US-\d{4})\s*\((EPIC-\d{4})\):/);
        if (!m) continue;
        const [, oldStoryId, oldEpicId] = m;
        if (storyMap.has(oldStoryId)) continue; // dedup

        const newEpicId = epicMap.get(oldEpicId);
        if (!newEpicId) continue; // no epic parent — skip (e.g. malformed entry)

        const epicNum = newEpicId.slice(5); // "001" from "EPIC-001"
        epicStoryCounters[epicNum] = (epicStoryCounters[epicNum] || 0) + 1;
        const storyNum = pad(epicStoryCounters[epicNum], 3);
        const newStoryId = `US-${epicNum}-${storyNum}`;
        const storyKey = `${epicNum}-${storyNum}`;

        storyMap.set(oldStoryId, { newId: newStoryId, epicNum, storyNum, storyKey });
        if (!(storyKey in storyAcCounters)) storyAcCounters[storyKey] = 0;

        // Map ACs embedded in this story block (document order = AC order)
        const acRe = /- \[[ x]\] (AC-\d{4}):/g;
        let acM;
        while ((acM = acRe.exec(trimmed)) !== null) {
          const oldAcId = acM[1];
          if (!acMap.has(oldAcId)) {
            storyAcCounters[storyKey]++;
            const acNum = pad(storyAcCounters[storyKey], 3);
            acMap.set(oldAcId, `AC-${epicNum}-${storyNum}-${acNum}`);
          }
        }
        continue;
      }

      // ── Task block ──────────────────────────────────────────────────────────
      if (/^TASK-\d{4}\s*\(US-/.test(trimmed)) {
        const m = trimmed.match(/^(TASK-\d{4})\s*\((US-\d{4})\):/);
        if (!m) continue;
        const [, oldTaskId, oldParentId] = m;
        if (taskMap.has(oldTaskId)) continue; // dedup

        const storyInfo = storyMap.get(oldParentId);
        if (!storyInfo) continue;

        const { epicNum, storyNum, storyKey } = storyInfo;
        storyTaskCounters[storyKey] = (storyTaskCounters[storyKey] || 0) + 1;
        const taskNum = pad(storyTaskCounters[storyKey], 3);
        taskMap.set(oldTaskId, `TASK-${epicNum}-${storyNum}-${taskNum}`);
        continue;
      }
    }
  }

  return { epicMap, storyMap, acMap, taskMap };
}

// ─── Step 2: Parse TEST_CASES.md → build TC mappings ─────────────────────────

function buildTcMappings(md, storyMap) {
  const tcMap = new Map();
  const storyTcCounters = {};

  const re = /^(TC-\d{4}):\s*/gm;
  let match;
  while ((match = re.exec(md)) !== null) {
    const oldTcId = match[1];
    if (tcMap.has(oldTcId)) continue;

    // Extract the block for this TC entry
    const startIdx = match.index;
    const nextRe = /^TC-\d{4}:/gm;
    nextRe.lastIndex = startIdx + 1;
    const next = nextRe.exec(md);
    const block = md.slice(startIdx, next ? next.index : undefined);

    const storyMatch = block.match(/^Related Story:\s*(US-\d{4})/m);
    if (!storyMatch) continue;

    const storyInfo = storyMap.get(storyMatch[1]);
    if (!storyInfo) continue;

    const { epicNum, storyNum, storyKey } = storyInfo;
    storyTcCounters[storyKey] = (storyTcCounters[storyKey] || 0) + 1;
    const tcNum = pad(storyTcCounters[storyKey], 3);
    tcMap.set(oldTcId, `TC-${epicNum}-${storyNum}-${tcNum}`);
  }

  return tcMap;
}

// ─── Step 3: Flat BUG and L mappings (scan all content for existing IDs) ─────

function buildFlatMappings(allContent, prefix) {
  const map = new Map();
  const re = new RegExp(`(?<![A-Za-z0-9])${prefix}-\\d{4}(?!\\d)`, 'g');
  const found = new Set(allContent.match(re) || []);
  for (const id of found) {
    const num = parseInt(id.slice(prefix.length + 1), 10);
    map.set(id, `${prefix}-${pad(num, 3)}`);
  }
  return map;
}

// ─── Step 4: Discover target files ───────────────────────────────────────────

function findFiles(dir, exts, ignore = []) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(full, exts, ignore));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function getTargetFiles() {
  const IGNORE = ['node_modules', 'ios', 'android', '.git', 'Pods'];
  const files = new Set();

  // Docs (all .md, recursive)
  for (const f of findFiles(path.join(ROOT, 'docs'), ['.md'], IGNORE)) files.add(f);

  // Root .md files
  for (const name of ['progress.md', 'AGENTS.md', 'plan_visualizer.md', 'task_plan.md', 'README.md', 'CLAUDE.md']) {
    const fp = path.join(ROOT, name);
    if (fs.existsSync(fp)) files.add(fp);
  }

  // Source code
  for (const dir of ['app', 'services', 'types', 'components', 'hooks', 'contexts', 'utils']) {
    for (const f of findFiles(path.join(ROOT, dir), ['.ts', '.tsx'], IGNORE)) files.add(f);
  }

  // Tests (including fixtures)
  for (const f of findFiles(path.join(ROOT, 'tests'), ['.ts', '.tsx', '.js', '.md'], IGNORE)) files.add(f);

  return [...files];
}

// ─── Step 5: Apply all mappings to file content ───────────────────────────────

function buildCombinedMap(epicMap, storyMap, acMap, taskMap, tcMap, bugMap, lMap) {
  const combined = new Map();
  for (const [k, v] of epicMap) combined.set(k, v);
  for (const [k, v] of storyMap) combined.set(k, v.newId);
  for (const [k, v] of acMap) combined.set(k, v);
  for (const [k, v] of taskMap) combined.set(k, v);
  for (const [k, v] of tcMap) combined.set(k, v);
  for (const [k, v] of bugMap) combined.set(k, v);
  for (const [k, v] of lMap) combined.set(k, v);
  return combined;
}

function applyMappings(content, combined) {
  // Sort longest key first to avoid prefix collisions (e.g. TASK-0001 before US-0001)
  const entries = [...combined.entries()].sort((a, b) => b[0].length - a[0].length);
  let result = content;
  for (const [oldId, newId] of entries) {
    // Match exact ID: not preceded by alphanumeric, not followed by a digit
    const re = new RegExp(`(?<![A-Za-z0-9])${oldId}(?!\\d)`, 'g');
    result = result.replace(re, newId);
  }
  return result;
}

// ─── Step 6: Update ID_REGISTRY.md ───────────────────────────────────────────

function updateIdRegistry(storyMap, acMap, taskMap, tcMap, bugMap, lMap) {
  const regPath = path.join(ROOT, 'docs', 'ID_REGISTRY.md');
  if (!fs.existsSync(regPath)) return;

  // Find last-assigned values
  const lastEpic = 'EPIC-008';
  const nextEpic = 'EPIC-009';

  const lastUs = [...storyMap.values()].reduce((acc, v) => (v.newId > acc ? v.newId : acc), '');
  const nextUs = lastUs ? lastUs.replace(/\d+$/, (n) => pad(parseInt(n) + 1, 3)) : 'US-001-001';

  const lastAc = [...acMap.values()].reduce((acc, v) => (v > acc ? v : acc), '');
  const nextAc = lastAc ? lastAc.replace(/\d+$/, (n) => pad(parseInt(n) + 1, 3)) : 'AC-001-001-001';

  const lastTask = [...taskMap.values()].reduce((acc, v) => (v > acc ? v : acc), '');
  const nextTask = lastTask ? lastTask.replace(/\d+$/, (n) => pad(parseInt(n) + 1, 3)) : 'TASK-001-001-001';

  const lastTc = [...tcMap.values()].reduce((acc, v) => (v > acc ? v : acc), '');
  const nextTc = lastTc ? lastTc.replace(/\d+$/, (n) => pad(parseInt(n) + 1, 3)) : 'TC-001-001-001';

  const bugNums = [...bugMap.keys()].map((k) => parseInt(k.slice(4)));
  const maxBug = bugNums.length > 0 ? Math.max(...bugNums) : 0;
  const lastBug = `BUG-${pad(maxBug, 3)}`;
  const nextBug = `BUG-${pad(maxBug + 1, 3)}`;

  const lNums = [...lMap.keys()].map((k) => parseInt(k.slice(2)));
  const maxL = lNums.length > 0 ? Math.max(...lNums) : 0;
  const lastL = `L-${pad(maxL, 3)}`;
  const nextL = `L-${pad(maxL + 1, 3)}`;

  const newContent = `# ID Registry

| Sequence | Next Available ID | Last Assigned |
| -------- | ----------------- | ------------- |
| EPIC     | ${nextEpic.padEnd(17)} | ${lastEpic} |
| US       | ${nextUs.padEnd(17)} | ${lastUs} |
| AC       | ${nextAc.padEnd(17)} | ${lastAc} |
| TASK     | ${nextTask.padEnd(17)} | ${lastTask} |
| TC       | ${nextTc.padEnd(17)} | ${lastTc} |
| BUG      | ${nextBug.padEnd(17)} | ${lastBug} |
| L        | ${nextL.padEnd(17)} | ${lastL} |
`;

  if (APPLY) {
    fs.writeFileSync(regPath, newContent, 'utf8');
    console.log('  Updated: docs/ID_REGISTRY.md');
  } else {
    console.log('\n=== ID_REGISTRY.md (would be written) ===');
    console.log(newContent);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const releasePlanPath = path.join(ROOT, 'docs', 'RELEASE_PLAN.md');
const testCasesPath = path.join(ROOT, 'docs', 'TEST_CASES.md');

if (!fs.existsSync(releasePlanPath)) {
  console.error(`ERROR: ${releasePlanPath} not found`);
  process.exit(1);
}

const releasePlanMd = fs.readFileSync(releasePlanPath, 'utf8');
const testCasesMd = fs.existsSync(testCasesPath) ? fs.readFileSync(testCasesPath, 'utf8') : '';

// Read all target files for BUG/L scanning
const targetFiles = getTargetFiles();
let allContent = releasePlanMd + '\n' + testCasesMd + '\n';
for (const f of targetFiles) {
  try {
    allContent += fs.readFileSync(f, 'utf8') + '\n';
  } catch (e) {
    console.warn(`[renumber] Could not read ${f}:`, e.message);
  }
}

// Build mappings
const { epicMap, storyMap, acMap, taskMap } = buildReleasePlanMappings(releasePlanMd);
const tcMap = buildTcMappings(testCasesMd, storyMap);
const bugMap = buildFlatMappings(allContent, 'BUG');
const lMap = buildFlatMappings(allContent, 'L');

// Print summary
console.log('\n=== ID MAPPING TABLE ===\n');

console.log(`EPICs (${epicMap.size}):`);
for (const [k, v] of epicMap) console.log(`  ${k} → ${v}`);

console.log(`\nUser Stories (${storyMap.size}):`);
for (const [k, v] of storyMap) console.log(`  ${k} → ${v.newId}`);

console.log(`\nAcceptance Criteria (${acMap.size}):`);
for (const [k, v] of acMap) console.log(`  ${k} → ${v}`);

console.log(`\nTasks (${taskMap.size}):`);
for (const [k, v] of taskMap) console.log(`  ${k} → ${v}`);

console.log(`\nTest Cases (${tcMap.size}):`);
for (const [k, v] of tcMap) console.log(`  ${k} → ${v}`);

console.log(`\nBugs (${bugMap.size}):`);
const bugNums = [...bugMap.keys()].map((k) => parseInt(k.slice(4))).sort((a, b) => a - b);
if (bugNums.length)
  console.log(
    `  BUG-${pad(bugNums[0], 4)}→BUG-${pad(bugNums[0], 3)} ... BUG-${pad(bugNums.at(-1), 4)}→BUG-${pad(bugNums.at(-1), 3)}`,
  );

console.log(`\nLessons (${lMap.size}):`);
const lNums = [...lMap.keys()].map((k) => parseInt(k.slice(2))).sort((a, b) => a - b);
if (lNums.length)
  console.log(`  L-${pad(lNums[0], 4)}→L-${pad(lNums[0], 3)} ... L-${pad(lNums.at(-1), 4)}→L-${pad(lNums.at(-1), 3)}`);

console.log(
  `\nTotal mappings: ${epicMap.size + storyMap.size + acMap.size + taskMap.size + tcMap.size + bugMap.size + lMap.size}`,
);
console.log(`Target files: ${targetFiles.length}`);

// Update ID_REGISTRY
updateIdRegistry(storyMap, acMap, taskMap, tcMap, bugMap, lMap);

if (DRY_RUN) {
  console.log('\n[DRY RUN] No files modified. Run with --apply to execute.\n');
  process.exit(0);
}

// Apply mappings to all target files
const combined = buildCombinedMap(epicMap, storyMap, acMap, taskMap, tcMap, bugMap, lMap);
let changedCount = 0;

for (const filePath of targetFiles) {
  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const updated = applyMappings(original, combined);
    if (updated !== original) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`  Updated: ${path.relative(ROOT, filePath)}`);
      changedCount++;
    }
  } catch (e) {
    console.error(`  Error processing ${path.relative(ROOT, filePath)}: ${e.message}`);
  }
}

console.log(`\nDone. ${changedCount} of ${targetFiles.length} files updated.\n`);
