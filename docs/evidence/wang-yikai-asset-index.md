# Campus Reef: Campus Asset and Process Evidence Index

- Document owner: Wang Yikai
- Prepared: 26 September 2026 (Asia/Shanghai)
- Review method: **Source review** with AI assistance

## Scope

This document covers Wang Yikai's assigned campus-asset and process-evidence indexing task for ICE Week 5. It indexes the six existing public campus images, their recorded origins, their source-defined game uses and the evidence still needed. It also links the existing fish and font credits.

The contribution is limited to `docs/evidence/wang-yikai-asset-index.md`. Images are linked in place, without re-uploading originals or creating new assets. Qin Tian remains responsible for implementation, integration, terminal evidence and final acceptance.

## Baseline commit

- Repository: [hansu650/campus-water-forest-ice5week](https://github.com/hansu650/campus-water-forest-ice5week).
- Branch reviewed: `main`.
- Verified baseline: [`55a560ff97e0e494825047d94072c2ac99715258`](https://github.com/hansu650/campus-water-forest-ice5week/commit/55a560ff97e0e494825047d94072c2ac99715258), obtained from the upstream `main` reference on 26 September 2026 and matched to the local checkout before editing.
- Sources read at that commit: [README.md][readme], [CONTRIBUTING.md][contributing], [ASSET_CREDITS.md][credits], [assets/manifest.json][manifest], [src/app.js][app], [scripts/build.cjs][build] and the two bundled font licence files linked below.

All source-evidence links below are pinned to this baseline. Asset links are repository-relative so reviewers can open the existing files. The [online game](https://hansu650.github.io/campus-water-forest-ice5week/) was not interactively tested in this task; its deployed revision was not verified. No game code, build or game test suite was executed.

## Campus asset index

The five photograph-to-original mappings below come from [ASSET_CREDITS.md][credits]. The private course originals were not supplied for this review, so this is a check of the published provenance record, not an independent comparison with those originals. Their numeric filenames are identifiers only; they are not public download links. No campus photograph is attributed to Wang Yikai as photographer.

| ID / manifest key | Existing file | Use in the game, from source | Recorded source | Processing / evidence type | What it can support | Fields still to verify |
| --- | --- | --- | --- | --- | --- | --- |
| C01 / `aerial` | [Campus night display](../../assets/images/team-campus-night-display-v3.webp) | Challenge-card image; night-photo puzzle tiles and reference; campus album. | Team-supplied campus photograph, course original `6.jpg`. | Compressed WebP display copy of a team photograph. | A campus scenery reference and the source-defined photo-puzzle theme. | Photographer, capture date, exact location and original-file comparison: **To be verified**. The key `aerial` does not establish a drone or aerial capture method. |
| C02 / `walkway` | [Campus walkway display](../../assets/images/team-campus-walk-display-v3.webp) | Second photo choice for the puzzle, used for tiles and reference. | Team-supplied campus photograph, course original `7.jpg`. | Compressed WebP display copy of a team photograph. | A campus walkway reference and an alternative puzzle image. | Photographer, capture date, exact location and original-file comparison: **To be verified**. |
| C03 / `treeA01` | [A01 photograph display](../../assets/images/team-tree-a01-display-v3.webp) | Campus album's A01 image, labelled as having no added plaque. | Team-supplied campus photograph, course original `13.jpg`. | Compressed WebP display copy; distinct from the virtual-plaque composite C06. | The recorded photographic starting point for the A01 concept. | Photographer, capture date, tree species, exact location and original-file comparison: **To be verified**. |
| C04 / `treeA02` | [A02 photograph display](../../assets/images/team-tree-a02-display-v3.webp) | Campus album's A02 tree image. | Team-supplied campus photograph, course original `10.jpg`. | Compressed WebP display copy of a team photograph. | A second campus-tree reference for the album. | Photographer, capture date, tree species, exact location and original-file comparison: **To be verified**. |
| C05 / `treeA03` | [A03 photograph display](../../assets/images/team-tree-a03-display-v3.webp) | Campus album's A03 image, labelled as an existing Friendship Tree. | Team-supplied campus photograph, course original `5.jpg`. | Compressed WebP display copy; the existing memorial plaque predates this project, according to the credits. | A campus-tree reference containing a pre-existing plaque; it does not demonstrate installation by this team. | Photographer, capture date, tree species, exact location, plaque history and original-file comparison: **To be verified**. |
| C06 / `treePlaque` | [A01 virtual-plaque composite](../../assets/images/team-tree-a01-blank-plaque-v4.webp) | Main guardian-preview image; a clickable hotspot reveals names and demonstration points rendered by the game. | Derived from the A01 photograph, associated with course original `13.jpg`; virtual wooden plaque added with AI assistance. | AI-assisted composite concept image. Names are rendered dynamically in the interface, not recorded by a camera on a physical plaque. | The proposed appearance and interaction of a virtual guardian plaque. | Original photographer, capture date, tree species and exact location: **To be verified**. Composite operator, tool/version and creation date: **To be verified**. |

Compression is the processing stated for C01-C05. Exact export settings and any additional editing history are **To be verified**. The README describes the published scenery as approved for this project, but underlying permission records and the scope of any wider reuse are **To be verified**. Public availability alone does not establish a general reuse licence.

### Source-use cross-check

The [manifest][manifest] maps all six keys to the filenames above, and all six files exist in the baseline repository. [Challenge rendering][challenges] uses `aerial`; [puzzle rendering][puzzle] switches between `aerial` and `walkway` for both tiles and the reference image. [Guardian rendering][guardians] uses `treePlaque` as the main image and renders `treeA01`, `treeA02`, `treeA03` and `aerial` through the album's dynamic `A[key]` lookup. All six therefore have source-defined display uses; none is merely an unused manifest entry.

The [build script][build] reads manifest entries from `assets/images` and embeds their data into the generated page. This implementation was read, not run. The album also contains conditional entries for `discussion` and `demoReview`, but these keys are absent from the baseline manifest and are filtered out. They do not establish that classroom or process photographs are publicly available.

### Interpretation limits

The five photograph display copies provide campus context according to the team's published credits; their photographer, date and tree identification cannot be established from this source review. C06 is an AI-assisted virtual preview. C05's older plaque is a separate, pre-existing feature. Neither supports a claim that this team installed a plaque, completed formal tree adoption or obtained school approval.

Water durations, fees and green points are demonstration values. They do not measure actual water savings, and a guardian-preview threshold is not a real adoption entitlement. Guardian names are stored in the current browser; a displayed name list does not establish cross-device participation or verified participants. These boundaries follow the [README][readme] and [guardian implementation][guardians].

## Existing fish and font sources

These are supporting game assets, not additional campus photographic evidence. The following preserves the project's [existing attribution record][credits]; it does not assign their authorship to this document's owner.

| Asset group | Existing source / author | Recorded licence and processing |
| --- | --- | --- |
| `fish-clown-*` | Brown-and-white fish photograph supplied by the project user; see [fish credits][fish-credits]. | AI-assisted background removal, poses and virtual outfits, with possible reconstructed details. Photographer, capture date and reuse permission terms: **To be verified**. No Creative Commons licence is stated for this group. |
| `fish-gold-*` | [Goldfish photograph by Raul654](https://commons.wikimedia.org/wiki/File:Goldfish.jpg). | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), as recorded for the project's derivatives; background removal, crop/resize and AI-assisted outfits. |
| `fish-blue-*` | [Blue Betta splendens photograph by Eric Savage](https://commons.wikimedia.org/wiki/File:Betta_splendens_%28blue%29.jpg). | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), as recorded for the project's derivatives; background removal, crop/resize and AI-assisted outfits. |
| Nunito | [Official Google Fonts directory](https://github.com/google/fonts/tree/main/ofl/nunito). | SIL Open Font License 1.1; [bundled complete notice][nunito-licence]. |
| Fredoka | [Official Google Fonts directory](https://github.com/google/fonts/tree/main/ofl/fredoka). | SIL Open Font License 1.1; [bundled complete notice][fredoka-licence]. |

The two Wikimedia source pages and linked Creative Commons licence pages were retrieved during this review; the stated photographer names and licence versions match the project's credits. The Google Fonts source directories were reachable, and both bundled notices identify SIL Open Font License 1.1. Attribution does not imply endorsement. No additional project-wide licence is asserted here.

## Process evidence archive

No process screenshots or participant records were received for this task. The rows below define pending archive entries, not completed activities. Record the real capture date, version, executor and method when material arrives. Retain an existing approved evidence link rather than re-uploading private originals.

| Evidence ID | Material to index | Intended evidence purpose | Requested provider / coordinator | Capture date / version | Executor / method | Existing approved link | Receipt status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E01 | Original-to-display mapping confirmation and source metadata | Resolve C01-C05 provenance and missing fields | Qin Tian to coordinate with the original material holder | To be verified | To be verified | Awaiting material | Awaiting material |
| E02 | A01 original/composite comparison and generation record | Document the virtual plaque's processing history | Qin Tian to coordinate with the composite creator | To be verified | To be verified | Awaiting material | Awaiting material |
| E03 | English game views of the two puzzle photos, campus album and guardian preview | Document rendered asset use while retaining sample-data and virtual-preview explanations | Arranged by Qin Tian | To be verified | To be verified; distinguish human capture from AI-assisted browser capture | Awaiting material | Awaiting material |
| E04 | Code and terminal-test screenshots | Link actual implementation and test evidence prepared by the team leader | Qin Tian | To be verified | To be verified; record the actual commands and executor | Awaiting material | Awaiting material |

Wang Yikai's task is to organise references and unresolved fields in this index. No manual gameplay, photography, participant feedback or test execution by Wang Yikai is claimed. Classroom portraits, private bills and personal course materials remain outside this public contribution.

## Pending asset-display checks

These narrowly scoped checks can support later evidence collection arranged by Qin Tian. They are a plan, not a replacement for another member's functional test work. Set the interface to English before any future execution and record the actual deployed or local revision separately from this source baseline.

| ID | Feature | Preconditions | Steps | Expected result | Actual result | Status | Executor / method | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V01 | Campus puzzle image mapping | Record browser and revision; select English. | Open Challenges and the photo puzzle; select Campus at night, then Campus walkway; compare tiles and reference with C01/C02. | Both choices render the corresponding existing image in the tiles and reference. | Not run | Not run | Unassigned; future executor must record manual or AI-assisted browser method | Awaiting material |
| V02 | Campus album mapping | Record browser and revision; select English; open the guardian view. | Expand Campus album; compare the A01, A02, A03 and night images with C03, C04, C05 and C01. | The four source-defined album images and their English captions match the index. | Not run | Not run | Unassigned; future executor must record manual or AI-assisted browser method | Awaiting material |
| V03 | Virtual-plaque evidence labelling | Record browser and revision; select English; use an approved non-sensitive example name. | Open the guardian view and plaque hotspot; inspect the main image, name overlay and preview explanation. | C06 supplies the main image; the overlay displays the locally saved name; the composite and concept-preview explanation remains available. | Not run | Not run | Unassigned; future executor must record manual or AI-assisted browser method | Awaiting material |

## Limitations / Next steps

1. Ask the material holders to resolve each **To be verified** field using original files or explicit source records. Do not infer the photographer, date, species or exact location from a filename or appearance.
2. Obtain the missing process materials through Qin Tian and update their existing links, dates, revisions and executor/method fields. Keep **Awaiting material** until material is actually received.
3. If later browser checks are performed, select English, preserve the sample-data and virtual-plaque explanations, and replace **Not run** only with actual observations and attributable evidence. This review made no browser-rendering, accessibility or mobile-layout pass claims.
4. Recheck mappings if the manifest, assets or rendering code changes after the baseline. Report any implementation issue to Qin Tian; this contribution does not change code, assets, dependencies or deployment.
5. Treat any PR automation results as GitHub Actions results for the relevant commit. They are separate from Wang Yikai's personal actions, these pending browser checks and independent user-study evidence. Final review and integration remain with Qin Tian.

## AI assistance

Codex assisted with repository and source retrieval, filename/provenance cross-checking, source-use analysis, public source-link checks, English drafting and documentation validation. Wang Yikai confirmed the GitHub account and authorised submission; the source analysis and document preparation in this session were AI-assisted. No independent human gameplay observations, new photographs, screenshots, participant feedback or measured environmental outcomes were supplied. No such activities or results have been invented.

[readme]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/README.md
[contributing]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/CONTRIBUTING.md
[credits]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/ASSET_CREDITS.md
[manifest]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/assets/manifest.json#L13-L18
[app]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/src/app.js
[build]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/scripts/build.cjs#L5-L9
[challenges]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/src/app.js#L95
[puzzle]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/src/app.js#L98
[guardians]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/src/app.js#L111
[fish-credits]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/ASSET_CREDITS.md#L11-L19
[nunito-licence]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/assets/fonts/Nunito-OFL.txt
[fredoka-licence]: https://github.com/hansu650/campus-water-forest-ice5week/blob/55a560ff97e0e494825047d94072c2ac99715258/assets/fonts/Fredoka-OFL.txt
