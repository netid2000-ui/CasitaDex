import type {SQL} from "./sqlite-repository.ts";
/** Preserve both the original failure and any rollback failure (SQLiteFull can auto-rollback). */
export async function sqliteWriteTransaction(db:SQL,task:(tx:SQL)=>Promise<void>){
 await db.execAsync("BEGIN IMMEDIATE");
 try{await task(db);await db.execAsync("COMMIT");}
 catch(cause){
  try{await db.execAsync("ROLLBACK");}
  catch(rollback){
   const reason=cause instanceof Error?cause.message:String(cause);
   throw new AggregateError([cause,rollback],"Database write did not complete: "+reason+". Rollback also reported an error. Reopen the app and verify saved data before retrying.",{cause});
  }
  throw cause;
 }
}
