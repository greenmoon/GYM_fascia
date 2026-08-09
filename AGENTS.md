# AGENTS.md

## Project instruction

This file gives Codex project-level guidance. For every user request, the first step is to read and follow this file before discussing, analyzing, running commands, editing files, or generating code.

## Working-directory alignment

This repository is the active FASCIA project:

```text
/Users/kevinwei/Dropbox/0DownLoad/codex_on_FASCIA_project
```

For every FASCIA-project shell command:

1. Set `workdir` to `/Users/kevinwei/Dropbox/0DownLoad/codex_on_FASCIA_project` when supported.
2. Verify the working directory with `pwd` when starting or resuming work.
3. If a shell ignores its requested `workdir`, explicitly change to the FASCIA path first.
4. Keep source-code paths relative to the repository after alignment.
5. Do not read, edit, generate, or test files in other projects unless explicitly requested.

## Temporary Dropbox sync alert rule

1. Before CCS imports, creates, migrates, cleans, or repeatedly builds this project, tell the user to temporarily pause Dropbox sync.
2. Do not request a pause for read-only discussion, CCS installation outside Dropbox, or simple low-frequency text edits.
3. Treat pausing and resuming Dropbox as physical user actions; never claim they occurred without confirmation or verified state.
4. After CCS stops writing and closes, remind the user to resume Dropbox sync.
5. Recommend excluding generated folders such as `Debug/` and `Release/` where practical.
6. Ask the user to confirm synchronization completed without conflicted copies.
7. Isolate every reminder with a blank line and the exact prefix `ALERT> `.

## Title naming rule

- Use app titles in the form `FASCIA Vnn YYYY.MM.DD HH:mm.ss`.
- For a meaningful release, increment `Vnn` by one and refresh the timestamp.
- Keep the local folder and GitHub repository name identical: `codex_on_FASCIA_project`.

### LI/GI title alignment

1. Read the full title from the actual current local or published `index.html`.
2. The project name must be `FASCIA`.
3. The version and timestamp must exactly match the current `index.html` title.
4. Use `LI> [full current index title] completed` for local previews.
5. Use `GI> [full current index title] completed` for published global previews.

## Auto UKK progress record rule

Use `doc/UKK_FASCIA_PROGRESS_TC.html` as the Unknown → Known progress record. Create the directory or file automatically if missing when an entry is required.

After a meaningful investigation, implementation, test, or engineering decision:

1. Add one concise UKK entry automatically.
2. Record the unknown question, verified conclusion, and evidence or next verification step.
3. Assign a stable three-digit index, starting at `001`; never renumber older entries.
4. Format the timetag as `(NNN YYYY-MM-DD HH:mm)`.
5. Display entries newest first.
6. Keep entry details collapsed by default.
7. Increment the UKK HTML `Vnn` and refresh its title/footer timestamp.
8. Do not duplicate completed actions or mark assumptions as known facts.

## User abbreviation rules

Interpret these short commands as task modifiers.

| Abbrev | Meaning |
|---|---|
| `go` | Read `AGENTS.md`, then perform the requested work using the current project rules. |
| `autorun` | Implement and run the discussed solution, verify it, and open the completed HTML in Google Chrome. Continue autonomously except for physical user actions. |
| `tc` | Reply in Traditional Chinese. |
| `en` | Reply in English. |
| `dd` | Deep dive with a detailed explanation. |
| `di` | Discuss only; do not implement, run changes, or modify files. |
| `kk` | Add a concise entry to `doc/UKK_FASCIA_PROGRESS_TC.html` with the unknown, verified known conclusion, and evidence or next verification step. |
| `gg` | Generate a graphic, diagram, call tree, flowchart, or visual explanation when useful. |
| `nu` | Explain the principle numerically, step by step. |
| `ss` | Significantly summarize the provided video, paper, source, screenshot, transcript, PDF, or text. |
| `ee` | Show the command verbatim under `raw>`, improved English under `betterEng>`, and Traditional Chinese under `tc>`, then answer the request. |
| `li` | Build the local HTML workflow, open `index.html` for checking, then report `LI> [full current index title] completed`. |
| `gi` | Build HTML, push the repository, publish the worldwide URL, open the published page, then report `GI> [full published index title] completed`. |

## Interpretation examples

- `in tc` → Reply in Traditional Chinese.
- `gg` → Provide a call tree or flow diagram in picture form.

## Coding style preference

1. Prefer practical, minimal, easy-to-modify code.
2. Do not rewrite the whole project unless requested.
3. Preserve existing function names and data flow when possible.
4. Prefer small patches with clear insertion locations.
5. Explain why a change fixes the issue.
6. Avoid breaking existing behavior.
7. Add debug prints only when useful and removable.
8. Keep compatibility with Windows and Linux paths when possible.
9. Prefer relative paths over hard-coded absolute paths.
10. Warn if the PC folder and GitHub repository names differ.
11. Do not copy GYM bicycle-specific rules unless explicitly requested.

## Project path style

Prefer cross-platform path handling:

```python
from pathlib import Path

ROOT = Path(__file__).resolve().parent
data_path = ROOT / "data" / "file.csv"
```

## Debug / analysis style

Report bugs in this order:

1. Most likely root cause.
2. Evidence in code or logs.
3. Minimal fix.
4. Safer long-term fix if needed.
5. Test method.

## Planning / status style

For development planning, use numbered steps and include a checklist/status table with a concrete check method. When working on UART/data/dashboard architecture, state which process owns UART and which parts only read HTTP/MQTT data.

## Response style

- Be direct and engineering-focused.
- Use tables for mappings and call trees for flows when useful.
- Use concise code comments.
- If the user writes `tc`, reply in Traditional Chinese.
- If the user writes `dd`, provide deeper detail.
