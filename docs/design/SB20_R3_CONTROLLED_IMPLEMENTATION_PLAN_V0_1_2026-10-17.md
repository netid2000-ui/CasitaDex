# CasitaDex SB-20 — R3 Controlled Implementation Plan v0.1
Date: 2026-10-17 | STATUS: PRE-IMPLEMENTATION PLAN, NOT AUTHORIZED WORK
Inputs: owner-signed SB-20 integrated design, R0 source recovery evidence, R1 safe defaults and migration review, owner-signed R2 media/draft/backup integrity.

## Boundary
This document is a sequence and acceptance plan only. No source/schema changes, builds, commits/pushes, remote/cloud costs, device installation, deployment, test-account mutation or database migration permitted without new express owner authorization. Existing dirty repo and untracked art/design work preserved.

## Proposed controlled phases (later authorization required)
P0 Snapshot refresh, protect dirty/untracked files, verify isolated source recovery; devise separate test-device data protection, stable fixture baseline and safe Development-only scope. STOP if recovery uncertain.
P1 Versioned domain/schema adapters: nullable/unassigned Space, separate custom Categories/legacy Context, content invariant (title AND answer-or-durable-photo), lifecycle and verification events. Existing data migrates without changed IDs, answers or evidence. STOP on unexpected format or lossy mapping.
P2 Durable one-draft store, photo staging with hashes, journal/recovery and idempotent Save; compatibility with current media_v2 and CDXM2 reader. STOP on orphan, missing bytes or uncertain commit state.
P3 Versioned backup/restore including archived/deleted and staged draft images, restore preview/conflict resolution and verified rollback. STOP if original dataset not fully recoverable.
P4 Find/Answer Detail filters, photo-only result, safe Archive/Recently Deleted, verification, reminders and labels; preserve old query behavior.
P5 Add photo-first entry, native Take Photo/Import photo+files, five-photo cap, single resumable draft, quick save and duplicate advisory.
P6 Home photo-only text cue and reminders; More grouped navigation, adaptive storage, management, backup and preferences.
P7 Emulator tests and synthetic restore evidence; separate permission and owner validation before physical Android/device-state modifications.

## Gate policy
Each phase needs documented before/after fixture comparisons, automated tests, Android evidence where relevant, identified rollback checkpoint, known defects and a go/no-go decision. Do not commit, push, deploy or overwrite authoritative user content without separately scoped approval. Production remains out of scope.

## Release and acceptance gates
A: project snapshots, hashes, recovery and change isolation reviewed BEFORE running any code.
B: legacy v1/C DXM2 migration and reversible fixture round trip, including source/verified history, IDs and original media references.
C: staged drafts and media survive kill/reboot/low storage; no phantom answer or missing photograph; five-photo new-memory cap.
D: backup manifest completeness and draft conflict; corrupt backup, unsupported version and interruption do not damage current collection.
E: query relevance, Spaces/Categories, Verified/Needs checking, due reminders, 30-day recovery, Archive and safe purge tested.
F: consistent Home/Find/Add/More UI, 130-200% text, TalkBack, dark/light, phone/landscape/foldable, offline and restart.
G: explicit owner review of emulator evidence before ANY separate physical Android acceptance or broader release.

## Open plan decisions
Exact future super-batch boundary and isolation directory; how to guard version-1 SQLite and app-private photo data in a disposable development environment; migration rollback cutover design; acceptable storage capacity threshold values; full backup version schema/size bounds; durable draft last-checkpoint semantics; media reference retention concurrency; test criteria/performance budgets; no-cost environment restrictions. Engineering cannot self-approve these policy decisions.

## Planned evidence bundle
Per phase: source HEAD/branch and diff inventory; preflight recovery evidence and source asset hashes; test commands and exit codes; synthetic fixture checks with data/media hashes; emulator screenshots if separately authorized; risk register; rollback command/process and restoration proof; owner gate outcome. Keep project command center in this chat.
