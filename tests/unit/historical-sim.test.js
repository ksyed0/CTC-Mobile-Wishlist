'use strict';

const { calculateAvgTokensPerEstimate, estimateStoryCost, backfillHistory } = require('../../tools/lib/historical-sim');
const path = require('path');
const fs = require('fs');

describe('historical-sim', () => {
  describe('calculateAvgTokensPerEstimate', () => {
    it('returns empty object for no done stories', () => {
      const result = calculateAvgTokensPerEstimate({ stories: [], costs: {} });
      expect(result).toEqual({});
    });

    it('calculates average tokens per estimate from done stories', () => {
      const data = {
        stories: [
          { id: 'US-001-001', status: 'Done', estimate: 'M' },
          { id: 'US-001-002', status: 'Done', estimate: 'M' },
        ],
        costs: {
          'US-001-001': { inputTokens: 10000, outputTokens: 5000 },
          'US-001-002': { inputTokens: 20000, outputTokens: 10000 },
        },
      };
      const result = calculateAvgTokensPerEstimate(data);
      expect(result.M).toBe(22500);
    });

    it('ignores stories without costs', () => {
      const data = {
        stories: [
          { id: 'US-001-001', status: 'Done', estimate: 'S' },
          { id: 'US-001-002', status: 'Done', estimate: 'S' },
        ],
        costs: {
          'US-001-001': { inputTokens: 5000, outputTokens: 2500 },
        },
      };
      const result = calculateAvgTokensPerEstimate(data);
      expect(result.S).toBe(3750);
    });
  });

  describe('estimateStoryCost', () => {
    it('estimates cost using average tokens', () => {
      const avgTokens = { M: 30000, S: 15000 };
      const cost = estimateStoryCost('M', avgTokens, 3, 15);
      expect(cost).toBeGreaterThan(0);
    });

    it('uses default tokens when estimate not found', () => {
      const avgTokens = { M: 30000 };
      const cost = estimateStoryCost('L', avgTokens, 3, 15);
      expect(cost).toBeGreaterThan(0);
    });
  });

  describe('backfillHistory', () => {
    const testRoot = path.join(__dirname, '..', '..', '.tmp-history-test');
    const docsDir = path.join(testRoot, 'docs');
    const historyDir = path.join(testRoot, '.history');

    beforeAll(() => {
      if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
      const testData = {
        stories: [
          { id: 'US-001-001', status: 'Done', estimate: 'M', epicId: 'EPIC-001' },
          { id: 'US-001-002', status: 'Done', estimate: 'S', epicId: 'EPIC-001' },
          {
            id: 'US-002-001',
            status: 'Planned',
            estimate: 'M',
            epicId: 'EPIC-002',
          },
        ],
        costs: {
          _totals: { costUsd: 100, inputTokens: 50000, outputTokens: 25000 },
          'US-001-001': { costUsd: 60, inputTokens: 30000, outputTokens: 15000 },
          'US-001-002': { costUsd: 40, inputTokens: 20000, outputTokens: 10000 },
        },
        bugs: [
          { id: 'BUG-001', status: 'Fixed', relatedStory: 'US-001-001' },
          { id: 'BUG-002', status: 'Open', relatedStory: 'US-001-002' },
        ],
        coverage: { overall: 85, available: true },
        epics: [
          { id: 'EPIC-001', title: 'Epic 1' },
          { id: 'EPIC-002', title: 'Epic 2' },
        ],
        lessons: [],
        testCases: [],
      };
      fs.writeFileSync(path.join(docsDir, 'plan-status.json'), JSON.stringify(testData, null, 2));
      if (fs.existsSync(historyDir)) {
        fs.rmSync(historyDir, { recursive: true, force: true });
      }
    });

    afterAll(() => {
      if (fs.existsSync(testRoot)) {
        fs.rmSync(testRoot, { recursive: true, force: true });
      }
    });

    it('generates historical snapshots', () => {
      const result = backfillHistory({ root: testRoot, days: 5 });
      expect(result.skipped).toBe(false);
      expect(result.generated).toHaveLength(5);
    });

    it('skips when enough snapshots exist', () => {
      const result = backfillHistory({ root: testRoot, days: 5 });
      expect(result.skipped).toBe(true);
      expect(result.reason).toBe('existing_snapshots');
    });
  });
});
