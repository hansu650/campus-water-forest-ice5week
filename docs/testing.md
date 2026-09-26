# Testing Campus Reef

The tests assert game behaviour, not package installation. Node's built-in test runner reports every case and exits with a non-zero status when an assertion fails. `npm test` is simply an alias for the rule-test command below.

## Game-rule tests: 23 cases

Run from the repository root using Node.js 22 or later:

```sh
node --test --test-reporter=spec tests/core.test.cjs
```

These tests import the real `src/core.js`. They check food consumption and XP thresholds; single-use points, supply and challenge rewards; photo swaps and invalid indices; connected and broken pipe routes; damaged saves, valid JSON round-trips, legacy outfits, guardian-name normalization, and both reset modes.

RULE-18 through RULE-23 cover all six species, bounded size growth, the reachable level-3 nursery, one-time birth, saved offspring identity, reset behaviour and migration of earlier saves. The UI-12 scenario reaches the milestone through actual feeding and earned challenge food rather than injecting a completed save.

The older regression cases cover defects observed while extending the tests:

- `RULE-06`: `NaN`, fractional or string indices must not corrupt the puzzle or increase its move count.
- `RULE-08`: an unknown challenge identifier must not unlock a water-challenge reward.

The existing normal interface supplied valid values, but the game-rule boundary previously accepted these invalid calls. The tests now require safe rejection with no state change.

## Real-browser tests: 15 scenarios

This suite uses an existing Playwright installation and browser. It does not install anything. If `playwright` is already resolvable in your environment, run:

```sh
node --test --test-reporter=spec tests/browser.test.cjs
```

Otherwise, set `CAMPUS_PLAYWRIGHT_MODULE` to the absolute path of an existing `playwright` package directory. Optionally set `CAMPUS_BROWSER_EXECUTABLE` to an existing browser executable. On Windows, the default browser channel is Edge. A missing runtime or browser is a failure, not a skipped or passing check.

The suite first builds the current source, serves the resulting HTML on a temporary local port, and opens isolated browser contexts. It uses real controls to feed fish, change species and outfits, swap tiles, rotate pipes, claim rewards, open plaques, and reset progress. It checks visible results and reload behaviour. Separate contexts verify that browser saves are independent. Corrupt and blocked storage are deliberately injected only into disposable test contexts.

| Case | Behaviour checked |
| --- | --- |
| UI-01 | Feeding to zero and claiming trial food only once |
| UI-02 | Six species, eighteen outfit combinations, three size settings and loaded images |
| UI-03 | Completing and replaying the photo puzzle without duplicate rewards |
| UI-04 | Broken pipe feedback, a solved route and replay protection |
| UI-05 | One-time sample points and the guardian plaque |
| UI-06 | Reload persistence, literal user text, language choice and separate saves |
| UI-07 | Playability when local storage is corrupt or blocked |
| UI-08 | Soft and full reset through the actual interface |
| UI-09 | Reachable controls at 320px, 390px and 1280px viewport widths |
| UI-10 | Modal keyboard focus and Escape behaviour |
| UI-11 | Labelled demo companions, show/hide preferences and independent guardian names |
| UI-12 | Eight real feeds, growth, the one-time baby milestone, reload and reset |
| UI-13 | Hover discovery and keyboard access to both retractable toolbars |
| UI-14 | Touchscreen toolbar handles and working actions at 390px |
| UI-15 | Stationary companions with reduced motion and 320px bounds |

Most functional scenarios pin the toolbars through the real interface so their actions remain visible. UI-13 and UI-14 leave auto-hide enabled and specifically test its mouse, keyboard and touch behaviour. A regression found during development required restoring a closing dialog's focus after making its toolbar reachable again; UI-10 and UI-13 cover that return path.

Every scenario also checks for uncaught browser JavaScript errors and unintended external runtime requests. Contexts, the browser and the temporary server are closed after the run. The suite does not connect to or modify a player's existing browser save. It does not take screenshots.

## Evidence and limits

For terminal evidence, capture the command, scenario names and final pass/fail summary from your own run. Include the actual date and code version in your evidence notes. These are developer regression checks; they are not independent teammate testing or a usability study. Passing them does not prove all possible devices, accessibility requirements or long-term water-saving outcomes.

The current GitHub workflow runs the 23 rule tests and the build. The browser suite is a separate local check unless a browser runtime is explicitly configured in CI. Do not describe local browser results as GitHub Actions results.
