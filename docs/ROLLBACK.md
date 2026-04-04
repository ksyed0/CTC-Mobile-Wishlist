# Rollback Plan

_Created before each deployment per AGENTS.md._

## POC Rollback Strategy

Since this is a local-only POC with no deployed infrastructure:

1. **Code rollback:** `git log --oneline -10` to find the last known-good commit, then `git revert <commit>` for the bad commit(s).
2. **Data rollback:** Clear AsyncStorage via the app's debug menu or `AsyncStorage.clear()` in a console.
3. **Branch rollback:** If a feature branch is broken, switch back to `develop` branch.
4. **Nuclear option:** `git stash && git checkout develop` — abandon the broken branch entirely.

## During Hackathon

- Each phase produces work on a feature branch. Merges to develop only happen after Lens APPROVE.
- If a merge to develop breaks the app, revert the merge commit immediately.
- If AsyncStorage state is corrupted, clear it and restart — mock data reloads automatically.
