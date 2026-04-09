'use strict';
const path = require('path');
const fs = require('fs');
const { parseReleasePlan } = require('../../tools/lib/parse-release-plan');

const fixture = fs.readFileSync(path.join(__dirname, '../fixtures/RELEASE_PLAN.md'), 'utf8');

describe('parseReleasePlan', () => {
  let result;
  beforeAll(() => {
    result = parseReleasePlan(fixture);
  });

  describe('epics', () => {
    it('extracts two epics', () => expect(result.epics).toHaveLength(2));
    it('parses epic ID', () => expect(result.epics[0].id).toBe('EPIC-001'));
    it('parses epic title', () => expect(result.epics[0].title).toBe('Code Editing'));
    it('parses epic status', () => expect(result.epics[0].status).toBe('In Progress'));
    it('parses epic releaseTarget', () => expect(result.epics[0].releaseTarget).toBe('MVP (v0.1)'));
    it('parses epic dependencies as array', () => expect(result.epics[0].dependencies).toEqual([]));
    it('parses EPIC-002 dependencies', () => expect(result.epics[1].dependencies).toEqual(['EPIC-001']));
  });

  describe('stories', () => {
    it('extracts two stories', () => expect(result.stories).toHaveLength(2));
    it('parses story ID', () => expect(result.stories[0].id).toBe('US-001-001'));
    it('parses story epicId', () => expect(result.stories[0].epicId).toBe('EPIC-001'));
    it('parses story title', () => expect(result.stories[0].title).toMatch(/open a file/));
    it('parses story priority', () => expect(result.stories[0].priority).toBe('P0'));
    it('parses story estimate', () => expect(result.stories[0].estimate).toBe('M'));
    it('parses story status', () => expect(result.stories[0].status).toBe('In Progress'));
    it('parses story branch', () => expect(result.stories[0].branch).toBe('feature/US-001-001-open-file'));
    it('parses ACs', () => expect(result.stories[0].acs).toHaveLength(2));
    it('parses AC id', () => expect(result.stories[0].acs[0].id).toBe('AC-001-001-001'));
    it('parses AC text', () => expect(result.stories[0].acs[0].text).toBe('File picker opens'));
    it('parses AC done=false', () => expect(result.stories[0].acs[0].done).toBe(false));
    it('parses AC done=true', () => expect(result.stories[0].acs[1].done).toBe(true));
    it('empty branch is empty string', () => expect(result.stories[1].branch).toBe(''));
  });

  describe('tasks', () => {
    it('extracts one task', () => expect(result.tasks).toHaveLength(1));
    it('parses task ID', () => expect(result.tasks[0].id).toBe('TASK-001-001-001'));
    it('parses task storyId', () => expect(result.tasks[0].storyId).toBe('US-001-001'));
    it('parses task status', () => expect(result.tasks[0].status).toBe('To Do'));
    it('parses task branch', () => expect(result.tasks[0].branch).toBe('feature/US-001-001-open-file'));
  });
});

describe('parseReleasePlan — edge cases', () => {
  it('returns empty arrays for empty input', () => {
    const result = parseReleasePlan('');
    expect(result.epics).toHaveLength(0);
    expect(result.stories).toHaveLength(0);
    expect(result.tasks).toHaveLength(0);
  });

  it('skips malformed blocks that have no recognised header', () => {
    const md = '```\nNOT-AN-ID: something\n```';
    const result = parseReleasePlan(md);
    expect(result.epics).toHaveLength(0);
  });

  it('parses comma-separated dependencies', () => {
    const md =
      '```\nEPIC-010: Multi-dep\nDescription: Test\nRelease Target: v1\nStatus: Planned\nDependencies: EPIC-001, EPIC-002\n```';
    const result = parseReleasePlan(md);
    expect(result.epics[0].dependencies).toEqual(['EPIC-001', 'EPIC-002']);
  });

  it('handles empty dependency string', () => {
    const md = '```\nEPIC-011: No-dep\nDescription: Test\nRelease Target: v1\nStatus: Planned\nDependencies:\n```';
    const result = parseReleasePlan(md);
    expect(result.epics[0].dependencies).toEqual([]);
  });

  it('uses raw priority string when no (Px) wrapper', () => {
    const md =
      '```\nUS-001-001 (EPIC-001): As a user, I want something.\nPriority: P1\nEstimate: S\nStatus: Planned\nBranch:\nAcceptance Criteria:\nDependencies: None\n```';
    const result = parseReleasePlan(md);
    expect(result.stories[0].priority).toBe('P1');
  });

  it('parses AC-TBD placeholder format', () => {
    const md = `\`\`\`
EPIC-001: My Epic
Status: In Progress

US-001-001 (EPIC-001): My Story
Status: Planned
Priority: P2 (P2)
Estimate: M
Branch: None
Dependencies: None
  - [ ] AC-TBD: Placeholder acceptance criterion
\`\`\``;
    const { stories } = parseReleasePlan(md);
    expect(stories).toHaveLength(1);
    expect(stories[0].acs).toHaveLength(1);
    expect(stories[0].acs[0].id).toBe('AC-TBD');
    expect(stories[0].acs[0].done).toBe(false);
  });

  it('ignores blocks with no code-fence markers', () => {
    const result = parseReleasePlan('No fences here at all');
    expect(result.epics).toHaveLength(0);
  });

  it('handles multiple separate fenced blocks', () => {
    const md =
      '```\nEPIC-020: Alpha\nDescription: A\nRelease Target: v1\nStatus: Planned\nDependencies: None\n```\n\n```\nEPIC-021: Beta\nDescription: B\nRelease Target: v1\nStatus: Planned\nDependencies: None\n```';
    const result = parseReleasePlan(md);
    expect(result.epics).toHaveLength(2);
  });
});
