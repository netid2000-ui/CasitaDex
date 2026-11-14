# Local-only application; user-selected backup destination

Owner explicitly agreed: all application data and photos stay on the phone. Cloud is only an optional location for a separate backup file selected using phone system file/share controls. No in-app cloud account connection, sync, cloud-dependent app operation, photo offloading or automatic local deletion.

Changed full-backup action to Save backup… in 18 current backup/exception review frames and clarified full-backup contents and system destination selection. Existing reactions retained. Figma board 1006:17 records decision. Native implementation remains pending; cloud-provider behavior is not guaranteed. Share-sheet dismissal must never be presented as proof that a remote copy finished uploading.

This supersedes earlier discussion of an in-app cloud destination option. Restore imports a selected backup file into local storage. No cloud account, service, upload, app source edit or native test performed. Scalability remains mandatory and independent of backup location.
