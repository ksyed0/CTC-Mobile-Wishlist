'use strict';
const path = require('path');
const fs = require('fs');
const { parseTestCases } = require('../../tools/lib/parse-test-cases');

const fixture = fs.readFileSync(path.join(__dirname, '../fixtures/TEST_CASES.md'), 'utf8');

describe('parseTestCases', () => {
  let result;
  beforeAll(() => {
    result = parseTestCases(fixture);
  });

  it('extracts one test case', () => expect(result).toHaveLength(1));
  it('parses TC id', () => expect(result[0].id).toBe('TC-001-001-001'));
  it('parses title', () => expect(result[0].title).toMatch(/File picker/));
  it('parses relatedStory', () => expect(result[0].relatedStory).toBe('US-001-001'));
  it('parses relatedTask', () => expect(result[0].relatedTask).toBe('TASK-001-001-001'));
  it('parses relatedAC', () => expect(result[0].relatedAC).toBe('AC-001-001-001'));
  it('parses type', () => expect(result[0].type).toBe('Functional'));
  it('parses status as Not Run', () => expect(result[0].status).toBe('Not Run'));
  it('parses defect as None', () => expect(result[0].defect).toBe('None'));
});

describe('parseTestCases — status branches', () => {
  it('parses [x] Pass status', () => {
    const md = `TC-001-001-002: Some test\nRelated Story: US-001-001\nRelated Task:\nRelated AC:\nType: Functional\nStatus: [x] Pass\nDefect Raised: None\n`;
    const result = parseTestCases(md);
    expect(result[0].status).toBe('Pass');
  });

  it('parses [x] Fail status', () => {
    const md = `TC-001-001-003: Another test\nRelated Story: US-001-001\nRelated Task:\nRelated AC:\nType: Functional\nStatus: [x] Fail\nDefect Raised: BUG-001\n`;
    const result = parseTestCases(md);
    expect(result[0].status).toBe('Fail');
    expect(result[0].defect).toBe('BUG-001');
  });

  it('defaults defect to None when Defect Raised field is absent', () => {
    const md = `TC-001-001-009: No defect field\nRelated Story: US-001-001\nRelated Task:\nRelated AC:\nType: Functional\nStatus: [ ] Not Run\n`;
    const result = parseTestCases(md);
    expect(result[0].defect).toBe('None');
  });

  it('handles multiple TCs, slicing correctly', () => {
    const md = `TC-001-001-004: First\nRelated Story: US-001-001\nRelated Task:\nRelated AC:\nType: Unit\nStatus: [ ] Not Run\nDefect Raised: None\n\nTC-001-002-001: Second\nRelated Story: US-001-002\nRelated Task:\nRelated AC:\nType: Unit\nStatus: [ ] Not Run\nDefect Raised: None\n`;
    const result = parseTestCases(md);
    expect(result).toHaveLength(2);
    expect(result[0].relatedStory).toBe('US-001-001');
    expect(result[1].relatedStory).toBe('US-001-002');
  });
});
