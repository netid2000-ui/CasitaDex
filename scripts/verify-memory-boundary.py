"""Read-only verification after native boundary UI test; uses retained fixture manifest."""
import json
import sqlite3
import subprocess
import sys
from pathlib import Path

folder = Path(sys.argv[1])
fixture = json.loads((folder / "fixture.json").read_text())
assert "/" + fixture["simulator"] + "/" in fixture["database"], "Fixture path does not belong to requested simulator"
container=Path(subprocess.check_output(['xcrun','simctl','get_app_container',fixture['simulator'],'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip())
assert '/' + fixture['simulator'] + '/' in str(container)
current=container/'Documents/SQLite/casitadex-development-v1.db'
with sqlite3.connect("file:" + str(current) + "?mode=ro", uri=True) as db:
    snapshot = json.loads(db.execute("SELECT payload FROM eng_state_v2 WHERE slot=1").fetchone()[0])
memories = snapshot["data"]["memories"]
assert len(memories) == 20, len(memories)
assert sum(m["id"] == "boundary_memory20" for m in memories) == 1
assert not any(m["title"] == "Boundary twenty first memory" for m in memories)
draft = snapshot["draft"]
assert draft["title"] == "Boundary twenty first memory"
assert draft["answer"] == "Preserve this native draft"
assert snapshot["attempts"]["boundary_attempt20"] == "boundary_memory20"
assert draft["attempt"] not in snapshot["attempts"]
print(json.dumps({"result":"PASS", "savedCount":len(memories), "twentiethSavedOnce":True,
 "twentyFirstNotCommitted":True, "draftTitleAndDescriptionPreserved":True,
 "blockedAttemptNotConsumed":True}, indent=2))
