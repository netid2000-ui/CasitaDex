# SB-28 Apple Figma library import error research — 2026-10-23

## Reproduction
UI master 39uzN0SZX8nlmcGDcHdQhr; resource page 143:2.
Apple iOS and iPadOS 26 component set `Button - Content Area` (aa1e2901a821ff24d484362e7e8e70378ee7d388): `Not permitted to upsert from library`.
Apple iOS and iPadOS 27 component set `Button - Content Area` (bba76d7e88d66c8704a07953ccc6056a185022b0): same error.
Material 3 `Button - outline` imported successfully; linked review instance 146:547.

## Documented Figma behavior
Figma Plugin API importComponentSetByKeyAsync loads published component sets and rejects unavailable or failed imports: https://developers.figma.com/docs/plugins/api/figma/
Figma libraries must be published, enabled and accessible to the user (at least view rights): https://help.figma.com/hc/en-us/articles/1500008731201-Enable-or-disable-a-library-in-a-design-file
Figma guidance for component-set key import: https://github.com/figma/mcp-server-guide/blob/main/skills/figma-use/references/working-with-design-systems/wwds-components--using.md

## Assessment and safe remediation
Both Apple libraries are searchable and subscribed, but their component-set import is denied. Material 3 succeeds via identical API. Strong evidence of Apple-library-specific access/upsert restriction; exact cause unconfirmed. In Figma Assets > Libraries check Apple kit enabled/source view access and manually insert one button on resource page. If manual insertion works but API fails, escalate connector/plugin import permission issue with library keys and exact error. If manual fails, inspect library source access, publication and account restrictions. No bypass, detach, paid upgrade or overwrite approved design.