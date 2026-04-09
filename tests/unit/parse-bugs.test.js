'use strict';
const path = require('path');
const fs = require('fs');
const { parseBugs } = require('../../tools/lib/parse-bugs');

const fixture = fs.readFileSync(path.join(__dirname, '../fixtures/BUGS.md'), 'utf8');

describe('parseBugs', () => {
  let result;
  beforeAll(() => {
    result = parseBugs(fixture);
  });

  it('extracts one bug', () => expect(result).toHaveLength(1));
  it('parses id', () => expect(result[0].id).toBe('BUG-001'));
  it('parses title', () => expect(result[0].title).toMatch(/empty file/));
  it('parses severity', () => expect(result[0].severity).toBe('High'));
  it('parses relatedStory', () => expect(result[0].relatedStory).toBe('US-001-001'));
  it('parses status', () => expect(result[0].status).toBe('Open'));
  it('parses fixBranch', () => expect(result[0].fixBranch).toBe('bugfix/BUG-001-empty-file-crash'));
  it('parses lessonEncoded', () => expect(result[0].lessonEncoded).toBe('No'));
  it('parses estimatedCostUsd', () => expect(result[0].estimatedCostUsd).toBeCloseTo(0.35));
  it('returns 0 for estimatedCostUsd when field absent', () => {
    const md = `BUG-099: A bug\nSeverity: Low\nStatus: Open\nFix Branch:\nLesson Encoded: No\n`;
    expect(parseBugs(md)[0].estimatedCostUsd).toBe(0);
  });
});

describe('parseBugs — empty input', () => {
  it('returns empty array for empty input', () => {
    expect(parseBugs('')).toEqual([]);
  });
});

describe('parseBugs — multiple bugs', () => {
  it('slices correctly between two bugs', () => {
    const md = `BUG-002: First bug\nSeverity: Medium\nRelated Story: US-001-001\nRelated Task:\nStatus: Open\nFix Branch: bugfix/BUG-002\nLesson Encoded: No\n\nBUG-003: Second bug\nSeverity: Low\nRelated Story: US-002-001\nRelated Task:\nStatus: Fixed\nFix Branch: bugfix/BUG-003\nLesson Encoded: Yes\n`;
    const result = parseBugs(md);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('BUG-002');
    expect(result[0].relatedStory).toBe('US-001-001');
    expect(result[1].id).toBe('BUG-003');
    expect(result[1].status).toBe('Fixed');
  });
});
