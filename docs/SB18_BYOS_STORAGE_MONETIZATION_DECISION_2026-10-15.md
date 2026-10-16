# SB-18 — Local-first and optional cloud storage monetization
Decision date: 2026-10-15. Owner: Designs by F&A. Status: product/design direction APPROVED; price, launch phase, billing, backend, provider access, and security implementation NOT authorized.

## Owner decision and intent
CasitaDex continues to work offline and stores its essential answers locally. Give users an **optional online storage / backup upgrade** as a way to monetize convenience, not access to their own information. "Bring Your Own Storage" (BYOS) is the preferred initial model: users choose a compatible provider, e.g. OneDrive, Google Drive, iCloud Drive or an Android/iOS document provider. This is a cloud *management* feature, not a promise that Designs by F&A supplies cloud disk space.

## Fair feature boundary
**Free / core:** offline-first card create/edit/search; local photos and voice clips when released, subject to device and file safety limits; full accessibility; on-device search; media-size reporting; manual complete export and restore, including images/audio when supported; recovery access; manual save to any document provider the OS exposes. No account, ads, mandatory cloud, artificial record limit or paywall on retrieving user-owned data. If encrypted portable export is available, manual security must also be available in Free.

**Optional premium cloud convenience:** direct-provider account connection using scoped consent; automatic or user-triggered encrypted BYOS backup; scheduled/verified backup status, smart upload retry where OS permits, version retention, restore history, multi-device transfer helper and optional large-file offloading after independently verified restoration. The provider's own capacity limits and charges remain the user's responsibility. Pro access NEVER means guaranteed background delivery: OS background-execution limits must be tested and represented honestly.

**Out of immediate V1:** F&A-hosted file storage and cloud synchronization, live household collaboration, unlimited provider storage, guaranteed background uploads, cross-platform purchase portability, cloud-only critical household facts, and automatic deletion of the sole on-device copy. These require separate approved scope/security/cost/release gates.

## Security and data-lifecycle requirements
- Always use authenticated encryption for premium remote backups, with keys controlled and recoverable by the user; do not store raw provider credentials, audio, or key material in F&A systems.
- Versioned, integrity-checked exports: immutable manifest, authenticated hashes, safe stream/chunk handling (existing Android media backup is limited to 20MB). No partial archive reported as protected; no local deletion without a verified remote and restore path.
- Backup and sync are different: backups restore snapshots; sync requires conflict handling and deletion propagation. Do not advertise sync until it is built and accepted.
- Record states in plain language: Saved on device; Backing up; Waiting for connection; Last backup verified; Needs attention; Stored only online (explicitly opted in).
- Subscription cancellation or premium expiry cannot disable offline content, manual export/import or restoration of already-owned compatible backups. No data hostage, forced migration, or surprise network use.
- Allow user to disconnect provider, delete cloud backups when technically supported, and export/restore without F&A account. Explain third-party storage terms, separate pricing and whether an internet connection is required.

## UX and commercial research gates
1. Test Free/Complete lifetime entitlement consistency with `PRODUCT_CHARTER.md` V1 one-time purchase hypothesis. Choose later whether BYOS automation belongs in lifetime Complete, a separate premium purchase, or optional subscription; make no pricing promise today.
2. Research willingness-to-pay and subscription avoidance with at least six moderated users, including people already paying for OneDrive/Drive/iCloud. Test comprehensible difference between "storage provider" and "CasitaDex backup management".
3. Validate Android SAF and iOS Files manual export first; then direct OneDrive/Google Drive OAuth, permission scopes, retries, token security and large-file resume separately. Check iOS/Android background constraints before advertising scheduled backups.
4. Track cloud provider operating costs, support economics, billing/store entitlement requirements, and security review. Explicit owner approval is needed for any paid integration, auth infrastructure, subscription, Production deployment or store release.

## Execution boundary
This document approves the monetization *direction and SB-18 design exploration only*. It does not override Charter V1 local-only implementation/non-cloud/no-subscription gates or authorize cloud credentials, billing, paid APIs, provider connections, Production or app-store work. Capture UI variants and technical ADRs for subsequent owner decision.
