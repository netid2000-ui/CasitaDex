import subprocess,json,time
from pathlib import Path
out=Path("docs/qa/evidence/samsung-full-sweep-20261115")
results=[]
for name in ["detail-controls","large-text"]:
 start=time.time()
 with (out/(name+".log")).open("w") as log:
  try:
   r=subprocess.run(["python3","-u","scripts/samsung-sweep-20261115/"+name+".py"],stdout=log,stderr=subprocess.STDOUT,timeout=600)
   result={"suite":name,"exitCode":r.returncode,"seconds":round(time.time()-start,1)}
  except subprocess.TimeoutExpired:
   result={"suite":name,"result":"TIMEOUT","seconds":round(time.time()-start,1)}
 results.append(result);(out/"core-results.json").write_text(json.dumps(results,indent=2)+"\n");print(result,flush=True)
 if result.get("exitCode")!=0:break
