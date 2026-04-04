# Project Entry Point

> **This file is auto-read by AI platforms via symlinks** (`CLAUDE.md`, `Gemini.md`, `Codex.md`, etc.).
> It is the single entry point for all agents to discover project-specific context.

## Project Constitution

Read `PROJECT.md` for the full project overview, tech stack, behavioral rules, and data schemas.

## Agent Framework

| Document                 | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `AGENTS.md`              | Operating standards for all agents (git workflow, testing, commit format, etc.) |
| `agents.config.json`     | Agent registry — names, roles, instruction files, orchestrator settings         |
| `docs/AGENT_PLAN.md`     | Generic orchestration framework, PR flow, BLOCK recovery, execution modes       |
| `docs/HACKATHON_PLAN.md` | Project-specific agent roster, timeline, prompt templates, scope                |

## Architecture Documents

| Document                              | Purpose                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| `architecture/SYSTEM_ARCHITECTURE.md` | Layer structure, screen hierarchy, service boundaries   |
| `architecture/DATA_FLOW.md`           | Type definitions, service interfaces, data contracts    |
| `architecture/DESIGN_SYSTEM.md`       | Brand colors, spacing grid, typography, component specs |
| `architecture/DIAGRAMS.md`            | Mermaid diagrams for architecture reference             |

## Project Management

| Document               | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `docs/RELEASE_PLAN.md` | User stories, tasks, acceptance criteria, status tracking |
| `docs/TEST_CASES.md`   | Test case definitions and execution results               |
| `docs/BUGS.md`         | Bug reports with IDs, repro steps, and status             |
| `docs/ID_REGISTRY.md`  | Artifact ID sequences (US, TASK, TC, BUG, AC)             |
| `progress.md`          | Session-by-session progress log                           |

## Tracking & Reporting

| Document                              | Purpose                                             |
| ------------------------------------- | --------------------------------------------------- |
| `docs/sdlc-status.json`               | Live SDLC dashboard state (phases, agents, metrics) |
| `docs/AI_COST_LOG.md`                 | AI session cost tracking                            |
| `docs/coverage/coverage-summary.json` | Jest test coverage report                           |
| `plan-visualizer.config.json`         | PlanVisualizer integration paths                    |

## Quick Start

```bash
npm install          # Install dependencies
npm run dashboard    # Generate SDLC dashboard
npm test             # Run all tests
npx expo start       # Start the app
```
