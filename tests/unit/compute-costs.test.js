'use strict';
const { computeProjectedCost, attributeAICosts, attributeBugCosts } = require('../../tools/lib/compute-costs');

const HOURS = { S: 4, M: 8, L: 16, XL: 32 };
const RATE = 100;

describe('computeProjectedCost', () => {
  it('S = $400', () => expect(computeProjectedCost('S', HOURS, RATE)).toBe(400));
  it('M = $800', () => expect(computeProjectedCost('M', HOURS, RATE)).toBe(800));
  it('L = $1600', () => expect(computeProjectedCost('L', HOURS, RATE)).toBe(1600));
  it('XL = $3200', () => expect(computeProjectedCost('XL', HOURS, RATE)).toBe(3200));
  it('unknown size returns 0', () => expect(computeProjectedCost('XXL', HOURS, RATE)).toBe(0));
  it('empty estimate returns 0', () => expect(computeProjectedCost('', HOURS, RATE)).toBe(0));
});

describe('attributeAICosts', () => {
  const stories = [
    { id: 'US-001-001', branch: 'feature/US-001-001-open-file' },
    { id: 'US-001-002', branch: '' },
  ];
  const costByBranch = {
    'feature/US-001-001-open-file': { costUsd: 0.47, inputTokens: 50000, outputTokens: 14000, sessions: 2 },
    main: { costUsd: 0.42, inputTokens: 45000, outputTokens: 12000, sessions: 1 },
  };

  it('attributes cost to matching story by branch', () => {
    const result = attributeAICosts(stories, costByBranch);
    expect(result['US-001-001'].costUsd).toBeCloseTo(0.68);
  });

  it('story with no branch gets share of unattributed cost', () => {
    const result = attributeAICosts(stories, costByBranch);
    expect(result['US-001-002'].costUsd).toBeCloseTo(0.21);
  });

  it('returns totalAiCost across all branches', () => {
    const result = attributeAICosts(stories, costByBranch);
    expect(result._totals.costUsd).toBeCloseTo(0.89);
  });
});

describe('attributeBugCosts', () => {
  const bugs = [
    { id: 'BUG-001', fixBranch: 'bugfix/BUG-001-crash' },
    { id: 'BUG-002', fixBranch: '' },
    { id: 'BUG-003', fixBranch: 'bugfix/BUG-003-no-match' },
  ];
  const costByBranch = {
    'bugfix/BUG-001-crash': { costUsd: 0.25, inputTokens: 30000, outputTokens: 8000, sessions: 3 },
    main: { costUsd: 0.1, inputTokens: 10000, outputTokens: 3000, sessions: 1 },
  };

  it('attributes cost to bug by fixBranch', () => {
    const result = attributeBugCosts(bugs, costByBranch);
    expect(result['BUG-001'].costUsd).toBeCloseTo(0.25);
    expect(result['BUG-001'].inputTokens).toBe(30000);
    expect(result['BUG-001'].outputTokens).toBe(8000);
    expect(result['BUG-001'].sessions).toBe(3);
    expect(result['BUG-001'].isEstimated).toBe(false);
  });

  it('returns zero cost for bug with no fixBranch', () => {
    const result = attributeBugCosts(bugs, costByBranch);
    expect(result['BUG-002'].costUsd).toBe(0);
    expect(result['BUG-002'].inputTokens).toBe(0);
    expect(result['BUG-002'].outputTokens).toBe(0);
    expect(result['BUG-002'].sessions).toBe(0);
    expect(result['BUG-002'].isEstimated).toBe(false);
  });

  it('returns zero cost for bug whose fixBranch is not in costByBranch', () => {
    const result = attributeBugCosts(bugs, costByBranch);
    expect(result['BUG-003'].costUsd).toBe(0);
    expect(result['BUG-003'].sessions).toBe(0);
  });

  it('returns _totals summing only matched bug branches', () => {
    const result = attributeBugCosts(bugs, costByBranch);
    expect(result._totals.costUsd).toBeCloseTo(0.25);
    expect(result._totals.inputTokens).toBe(30000);
    expect(result._totals.outputTokens).toBe(8000);
  });

  it('handles empty bugs array', () => {
    const result = attributeBugCosts([], costByBranch);
    expect(result._totals).toEqual({ costUsd: 0, inputTokens: 0, outputTokens: 0 });
  });

  it('uses estimatedCostUsd fallback when branch has no cost log entry', () => {
    const bugsWithEstimate = [{ id: 'BUG-003', fixBranch: 'bugfix/BUG-003-no-match', estimatedCostUsd: 0.3 }];
    const result = attributeBugCosts(bugsWithEstimate, costByBranch);
    expect(result['BUG-003'].costUsd).toBeCloseTo(0.3);
    expect(result['BUG-003'].isEstimated).toBe(true);
    expect(result._totals.costUsd).toBeCloseTo(0.3);
  });

  it('does not set isEstimated when estimatedCostUsd is 0', () => {
    const bugsNoEstimate = [{ id: 'BUG-004', fixBranch: 'bugfix/BUG-004-no-match' }];
    const result = attributeBugCosts(bugsNoEstimate, costByBranch);
    expect(result['BUG-004'].isEstimated).toBe(false);
    expect(result['BUG-004'].costUsd).toBe(0);
  });
});
