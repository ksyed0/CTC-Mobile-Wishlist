#!/usr/bin/env node
/**
 * SDLC Live Dashboard Generator
 * Reads sdlc-status.json and project files, generates a self-contained HTML dashboard.
 *
 * Usage:
 *   node tools/generate-dashboard.js          # Generate once
 *   node tools/generate-dashboard.js --watch   # Watch and regenerate on changes
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATUS_PATH = path.join(ROOT, 'docs', 'sdlc-status.json');
const OUTPUT_PATH = path.join(ROOT, 'docs', 'dashboard.html');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function generateHTML(status) {
  const now = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const agents = status.agents;
  const phases = status.phases;
  const metrics = status.metrics;
  const stories = status.stories;
  const log = status.log || [];

  const agentColors = {
    Conductor: '#D52B1E',
    Compass: '#1565C0',
    Keystone: '#6A1B9A',
    Lens: '#F57C00',
    Palette: '#00897B',
    Forge: '#C62828',
    Pixel: '#283593',
    Sentinel: '#2E7D32',
    Circuit: '#4527A0'
  };

  const agentIcons = {
    Conductor: '🎯',
    Compass: '🧭',
    Keystone: '🏛️',
    Lens: '🔍',
    Palette: '🎨',
    Forge: '⚒️',
    Pixel: '✨',
    Sentinel: '🛡️',
    Circuit: '⚡'
  };

  const statusColors = {
    idle: '#888',
    active: '#34A853',
    complete: '#1565C0',
    blocked: '#D52B1E',
    pending: '#888',
    'in-progress': '#F57C00'
  };

  const phasePercent = phases.length > 0
    ? Math.round((phases.filter(p => p.status === 'complete').length / phases.length) * 100)
    : 0;

  const storyPercent = metrics.storiesTotal > 0
    ? Math.round((metrics.storiesCompleted / metrics.storiesTotal) * 100)
    : 0;

  const testPercent = metrics.testsTotal > 0
    ? Math.round((metrics.testsPassed / metrics.testsTotal) * 100)
    : 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CTC Mobile Wishlist — SDLC Live Dashboard</title>
<meta http-equiv="refresh" content="5">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #e0e0e0; min-height: 100vh; }

  .header { background: linear-gradient(135deg, #D52B1E 0%, #8B1A12 100%); padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; }
  .header h1 { font-size: 22px; color: white; font-weight: 700; }
  .header .subtitle { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 2px; }
  .header .clock { text-align: right; }
  .header .clock .time { font-size: 28px; font-weight: 700; color: white; font-variant-numeric: tabular-nums; }
  .header .clock .label { font-size: 11px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }

  .container { max-width: 1400px; margin: 0 auto; padding: 24px; }

  /* Phase Pipeline */
  .pipeline { display: flex; gap: 4px; margin-bottom: 24px; }
  .phase-block { flex: 1; border-radius: 8px; padding: 16px; position: relative; overflow: hidden; transition: all 0.3s; }
  .phase-block.pending { background: #2a2a4a; border: 1px solid #3a3a5a; }
  .phase-block.in-progress { background: #2a2a4a; border: 2px solid #F57C00; animation: pulse 2s infinite; }
  .phase-block.complete { background: #1a3a2a; border: 1px solid #2E7D32; }
  .phase-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .phase-agents { font-size: 11px; color: #888; }
  .phase-status { position: absolute; top: 8px; right: 12px; font-size: 18px; }
  .phase-deliverables { font-size: 10px; color: #666; margin-top: 8px; }

  @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(245, 124, 0, 0.4); } 50% { box-shadow: 0 0 20px 4px rgba(245, 124, 0, 0.2); } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

  .card { background: #16213e; border-radius: 12px; padding: 20px; border: 1px solid #1a1a3e; }
  .card h2 { font-size: 15px; font-weight: 700; margin-bottom: 16px; color: #D52B1E; text-transform: uppercase; letter-spacing: 1px; }

  /* Metrics */
  .metric-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1a1a3e; }
  .metric-row:last-child { border-bottom: none; }
  .metric-label { font-size: 13px; color: #aaa; }
  .metric-value { font-size: 20px; font-weight: 700; }
  .metric-value.green { color: #34A853; }
  .metric-value.red { color: #D52B1E; }
  .metric-value.blue { color: #1565C0; }
  .metric-value.orange { color: #F57C00; }

  /* Progress bars */
  .progress-bar { height: 8px; background: #2a2a4a; border-radius: 4px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
  .progress-fill.red { background: linear-gradient(90deg, #D52B1E, #F44336); }
  .progress-fill.green { background: linear-gradient(90deg, #2E7D32, #4CAF50); }
  .progress-fill.blue { background: linear-gradient(90deg, #1565C0, #42A5F5); }

  /* Agent grid */
  .agent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .agent-card { background: #1a1a3e; border-radius: 8px; padding: 12px; border-left: 4px solid; transition: all 0.3s; }
  .agent-card.active { animation: pulse-agent 1.5s infinite; }
  @keyframes pulse-agent { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
  .agent-icon { font-size: 20px; margin-bottom: 4px; }
  .agent-name { font-size: 13px; font-weight: 700; }
  .agent-role { font-size: 10px; color: #888; margin-bottom: 6px; }
  .agent-status { font-size: 11px; padding: 2px 8px; border-radius: 10px; display: inline-block; }
  .agent-task { font-size: 10px; color: #aaa; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Story table */
  .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .story-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: #1a1a3e; border-radius: 6px; font-size: 12px; }
  .story-id { font-weight: 700; color: #D52B1E; width: 65px; }
  .story-title { flex: 1; color: #ccc; margin: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .story-status { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
  .story-status.Planned { background: #2a2a4a; color: #888; }
  .story-status.InProgress { background: #3a2a0a; color: #F57C00; }
  .story-status.Complete { background: #1a3a2a; color: #34A853; }

  /* Activity log */
  .log-entry { padding: 8px 0; border-bottom: 1px solid #1a1a3e; font-size: 12px; }
  .log-entry:last-child { border-bottom: none; }
  .log-time { color: #666; font-variant-numeric: tabular-nums; margin-right: 8px; }
  .log-agent { font-weight: 700; margin-right: 4px; }
  .log-scroll { max-height: 240px; overflow-y: auto; }

  /* Footer */
  .footer { text-align: center; padding: 16px; color: #444; font-size: 11px; }
  .footer span { color: #D52B1E; }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>CTC Mobile Wishlist — Agentic AI SDLC</h1>
    <div class="subtitle">EPAM EliteA | 9 Specialized Agents | Hackathon Live Dashboard</div>
  </div>
  <div class="clock">
    <div class="time">${now}</div>
    <div class="label">Last Updated</div>
  </div>
</div>

<div class="container">

<!-- Phase Pipeline -->
<div class="pipeline">
${phases.map(p => {
  const icon = p.status === 'complete' ? '✅' : p.status === 'in-progress' ? '🔄' : '⏳';
  return `  <div class="phase-block ${p.status}">
    <div class="phase-status">${icon}</div>
    <div class="phase-name">${p.name}</div>
    <div class="phase-agents">${p.agents.join(' · ')}</div>
    <div class="phase-deliverables">${p.deliverables.join(' · ')}</div>
  </div>`;
}).join('\n')}
</div>

<!-- Metrics Row -->
<div class="grid">
  <div class="card">
    <h2>Phase Progress</h2>
    <div class="metric-row">
      <span class="metric-label">Phases Complete</span>
      <span class="metric-value blue">${phases.filter(p => p.status === 'complete').length} / ${phases.length}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill blue" style="width: ${phasePercent}%"></div></div>
    <div class="metric-row" style="margin-top: 12px">
      <span class="metric-label">Stories Done</span>
      <span class="metric-value green">${metrics.storiesCompleted} / ${metrics.storiesTotal}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill green" style="width: ${storyPercent}%"></div></div>
    <div class="metric-row" style="margin-top: 12px">
      <span class="metric-label">Tasks Done</span>
      <span class="metric-value orange">${metrics.tasksCompleted} / ${metrics.tasksTotal}</span>
    </div>
    <div class="progress-bar"><div class="progress-fill red" style="width: ${metrics.tasksTotal > 0 ? Math.round((metrics.tasksCompleted / metrics.tasksTotal) * 100) : 0}%"></div></div>
  </div>

  <div class="card">
    <h2>Quality</h2>
    <div class="metric-row">
      <span class="metric-label">Tests Passed</span>
      <span class="metric-value green">${metrics.testsPassed}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Tests Failed</span>
      <span class="metric-value red">${metrics.testsFailed}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Code Coverage</span>
      <span class="metric-value ${metrics.coveragePercent >= 60 ? 'green' : 'orange'}">${metrics.coveragePercent}%</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Bugs Open</span>
      <span class="metric-value ${metrics.bugsOpen > 0 ? 'red' : 'green'}">${metrics.bugsOpen}</span>
    </div>
  </div>

  <div class="card">
    <h2>Reviews</h2>
    <div class="metric-row">
      <span class="metric-label">Reviews Approved</span>
      <span class="metric-value green">${metrics.reviewsApproved}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Reviews Blocked</span>
      <span class="metric-value red">${metrics.reviewsBlocked}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Bugs Fixed</span>
      <span class="metric-value blue">${metrics.bugsFixed}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Tests Total</span>
      <span class="metric-value">${metrics.testsTotal}</span>
    </div>
  </div>
</div>

<!-- Agents + Stories -->
<div class="grid-2">
  <div class="card">
    <h2>Agent Status</h2>
    <div class="agent-grid">
${Object.entries(agents).map(([name, agent]) => {
  const color = agentColors[name] || '#888';
  const icon = agentIcons[name] || '🤖';
  const statusBg = agent.status === 'active' ? 'rgba(52,168,83,0.2)' : 'rgba(136,136,136,0.15)';
  const statusColor = agent.status === 'active' ? '#34A853' : agent.status === 'complete' ? '#1565C0' : '#888';
  const roles = { Conductor: 'Delivery Manager', Compass: 'Product Owner', Keystone: 'Architect', Lens: 'Code Reviewer', Palette: 'UI Designer', Forge: 'Backend Dev', Pixel: 'Frontend Dev', Sentinel: 'Functional Tester', Circuit: 'Automation Tester' };
  return `      <div class="agent-card ${agent.status === 'active' ? 'active' : ''}" style="border-left-color: ${color}">
        <div class="agent-icon">${icon}</div>
        <div class="agent-name" style="color: ${color}">${name}</div>
        <div class="agent-role">${roles[name] || name}</div>
        <div class="agent-status" style="background: ${statusBg}; color: ${statusColor}">${agent.status}</div>
        ${agent.currentTask ? `<div class="agent-task">${agent.currentTask}</div>` : ''}
      </div>`;
}).join('\n')}
    </div>
  </div>

  <div class="card">
    <h2>User Stories</h2>
    <div class="story-grid">
${Object.entries(stories).map(([id, story]) => {
  const statusClass = story.status === 'In Progress' ? 'InProgress' : story.status;
  return `      <div class="story-row">
        <span class="story-id">${id}</span>
        <span class="story-title">${story.title}</span>
        <span class="story-status ${statusClass}">${story.status}</span>
      </div>`;
}).join('\n')}
    </div>
  </div>
</div>

<!-- Activity Log -->
<div class="card" style="margin-top: 24px">
  <h2>Activity Log</h2>
  <div class="log-scroll">
${log.length > 0 ? log.slice(-20).reverse().map(entry => {
  const agentColor = agentColors[entry.agent] || '#888';
  return `    <div class="log-entry">
      <span class="log-time">${entry.time || ''}</span>
      <span class="log-agent" style="color: ${agentColor}">${entry.agent || 'System'}</span>
      ${entry.message || ''}
    </div>`;
}).join('\n') : '    <div class="log-entry" style="color: #666">Waiting for Conductor to begin orchestration...</div>'}
  </div>
</div>

</div>

<div class="footer">
  EPAM EliteA Agentic AI SDLC | <span>Canadian Tire Corporation</span> | Auto-refreshes every 5 seconds
</div>

</body>
</html>`;
}

function generate() {
  const status = readJSON(STATUS_PATH);
  if (!status) {
    console.error('Could not read', STATUS_PATH);
    process.exit(1);
  }
  const html = generateHTML(status);
  fs.writeFileSync(OUTPUT_PATH, html, 'utf8');
  console.log(`Dashboard generated: ${OUTPUT_PATH}`);
}

// Main
generate();

if (process.argv.includes('--watch')) {
  console.log('Watching for changes...');
  let debounce = null;
  fs.watch(STATUS_PATH, () => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      console.log(`[${new Date().toLocaleTimeString()}] Status changed, regenerating...`);
      generate();
    }, 500);
  });
}
