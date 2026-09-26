# Contributing to Campus Reef

## Submission language

Assessment screenshots, submitted documents, code comments, commit messages and pull request descriptions must be in English. Code identifiers use English. Chinese interface translations remain available for local testing and are language data, not code comments. Personal names in saved games may use either language.

Capture assessment screenshots with the interface set to English. Retain the visible sample-data and virtual-plaque explanations. Do not present demonstration data as measured water savings.

## Team responsibilities

The following allocation was arranged by the team leader on 26 September 2026. It describes responsibilities; completed work must be supported by actual files, observations or commits.

| Member | Responsibility | Planned contribution |
| --- | --- | --- |
| **Qin Tian — Team Leader** | Core concept, project planning, main implementation, integration and deployment, terminal checks, final acceptance and evidence coordination | Design decisions, source changes, test and code screenshots, version records and presentation |
| Tao Jiacheng | Functional testing and selected gameplay planning | `docs/testing/tao-jiacheng-test-plan.md`: test cases, actual findings when available, gameplay suggestions and retest records |
| Wang Yikai | Campus assets and process-evidence organisation | `docs/evidence/wang-yikai-asset-index.md`: asset references, provenance and evidence indexing |
| Song Peitong | Sustainability content and interface copy | `docs/content/song-peitong-copy-review.md`: English copy review, terminology and proposed improvements |
| Jiang Yuchen | Playtest organisation and presentation support | Actual participant feedback, demonstration flow and Week 6 peer-review records |

The three planned documentation files are not claims that those contributions have already been completed. Qin Tian coordinates code and terminal screenshots. Game-interface screenshots may be collected with AI assistance and should be labelled accordingly.

## Branch and pull request workflow

1. Use your own GitHub account and commit identity. Read the current README and relevant files before editing.
2. If you have accepted a collaborator invitation, create a working branch in this repository. Otherwise, fork this public repository to your account and work on a branch in your fork. A fork-based PR does not require a collaborator invitation.
3. Commit a focused piece of work that matches your responsibility. Documentation tasks do not require changes to game code, assets or deployment settings.
4. Check the content, links and factual claims. Open a Ready for review PR against `hansu650/campus-water-forest-ice5week:main` when the deliverable is ready.
5. Describe the actual change and validation in English. State what remains untested and how AI assistance was used. Qin Tian reviews and integrates the work.

Use **Not run** for unexecuted tests and **To be verified** for unknown source information. A complete test plan may be submitted before its cases are executed, provided the PR clearly identifies it as a plan. Do not invent results, participants, feedback or earlier work.

Source changes use `npm test` and `npm run build` for verification. Documentation-only changes require content and link checks; the PR workflow also runs the project checks automatically.

See GitHub's documentation on [creating pull requests](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request) and [inviting collaborators](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository).
