# Project-Specific Rules

> Universal workflow rules are inherited from the global Lotus rules file.
> This file contains constraints for this pure HTML/JS project.
> See: https://github.com/Bronc-X/Lotus

## Tech Stack

- Core: HTML5, CSS3, ES6+ JavaScript
- No build tools, no bundlers. Raw files only.
- Libraries loaded via CDN.

## Development Constraints

- Ensure JavaScript stays in standalone `.js` files, not inline.
- Use CSS variables (`:root`) for color theming when adding or changing shared colors.
- Keep the app operable locally via plain `file://` protocol or a simple static server.
- Make surgical changes only; do not refactor unrelated UI or server code.

## Lotus Skills Available In This Project

The current Codex global skill set has been synced from Lotus main. Codex-compatible Lotus skills available here:

- `/auto-build`
- `/debugging-strategies`
- `/feynman`
- `/frontend-design`
- `/image-2`
- `/insights`
- `/polanyi-tacit`
- `/powerup`
- `/security-auditor`
- `/subagent`
- `/taste-skill`
- `/test-driven-development`
- `/web-to-design-md`

Notes:

- `/btw` and `/loop` are session-level Lotus behaviors and are not installed as Codex slash skills.
- `/gstack` remains managed by the official gstack installation to avoid duplicate skill entries.
- The old `/taste` alias is intentionally not used; use `/taste-skill`.
