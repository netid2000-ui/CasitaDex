# Owner correction: persistent top action bars
Memory Details appearance approved; owner requested sticky top actions and correction during review.
Applied to 32 related Details and Add/Edit review states. Overall owner approval remains pending.

Implementation: retain existing frame IDs and navigation; 390x844 viewport; action bar outside scroll body; solid page background and subtle divider; 47 pt top inset, 44 pt controls, 34 pt content bottom inset. Large title stays in scrolling body. Original fonts preserved.

Live Safari: Details, Edit Memory, Add Memory and Add Photo Memory scrolled to bottom. Enabled header controls retained y=135 while body controls moved. Edit Cancel/Save and Details Find/Edit measured. Empty Add forms have Save disabled; Cancel measured, entire header structurally outside scroll. Earlier attempts were rejected due to wrong control grouping and unloaded page; final evidence waits for loaded UI and verifies named controls.

No app source/build changes and no native photo retests.
Frames:
975:171, 975:217, 987:2, 987:74, 994:2, 994:49, 1000:7, 1000:55, 1000:103, 1000:151, 1001:2, 1005:2, 1066:2, 1079:2, 1079:434, 1079:496, 1079:558, 1079:620, 1079:682, 1079:963, 1079:1058, 1079:1132, 1079:1196, 1079:1249, 1079:1372, 1079:1425, 1079:1478, 1079:1540, 1079:1654, 1079:1790, 1079:1883, 1079:1938
