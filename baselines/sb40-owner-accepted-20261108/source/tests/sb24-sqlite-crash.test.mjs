import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {once} from "node:events";
import {DatabaseSync} from "node:sqlite";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
test("SQLite WAL rolls back uncommitted ENG and reminder writes after process termination",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"casitadex-sb24-crash-"));
 const dbfile=path.join(dir,"fixture.sqlite");
 try{
  const db=new DatabaseSync(dbfile);
  db.exec("PRAGMA journal_mode=WAL; CREATE TABLE eng_state_v2(slot INTEGER PRIMARY KEY,payload TEXT); CREATE TABLE standalone_reminders_v1(id TEXT PRIMARY KEY,title TEXT); INSERT INTO eng_state_v2 VALUES(1,'before'); INSERT INTO standalone_reminders_v1 VALUES('r1','before');");
  db.close();
  const code=`const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync(process.argv[1]);db.exec("PRAGMA journal_mode=WAL; BEGIN IMMEDIATE; UPDATE standalone_reminders_v1 SET title='after'; UPDATE eng_state_v2 SET payload='after';");process.stdout.write("IN_TRANSACTION\\n");setInterval(()=>{},1000);`;
  const child=spawn(process.execPath,["-e",code,dbfile],{stdio:["ignore","pipe","pipe"]});
  let output="";
  const ready=new Promise((resolve,reject)=>{child.stdout.on("data",b=>{output+=b.toString();if(output.includes("IN_TRANSACTION"))resolve();});child.on("error",reject);child.on("exit",(c)=>reject(Error("Child exited before transaction interruption: "+c)));});
  try{await Promise.race([ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("Child not ready")),10000).unref())]);}finally{child.kill("SIGKILL");await once(child,"close").catch(()=>{});}
  const reopened=new DatabaseSync(dbfile);
  try{assert.equal(reopened.prepare("SELECT payload FROM eng_state_v2 WHERE slot=1").get().payload,"before");assert.equal(reopened.prepare("SELECT title FROM standalone_reminders_v1 WHERE id='r1'").get().title,"before");assert.equal(reopened.prepare("PRAGMA integrity_check").get().integrity_check,"ok");}finally{reopened.close();}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test("SQLite WAL preserves both committed ENG and reminders after child termination",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"casitadex-sb24-committed-"));
 const dbfile=path.join(dir,"fixture.sqlite");
 try{
  const db=new DatabaseSync(dbfile);
  db.exec("PRAGMA journal_mode=WAL; CREATE TABLE eng_state_v2(slot INTEGER PRIMARY KEY,payload TEXT); CREATE TABLE standalone_reminders_v1(id TEXT PRIMARY KEY,title TEXT); INSERT INTO eng_state_v2 VALUES(1,'before'); INSERT INTO standalone_reminders_v1 VALUES('r1','before');");
  db.close();
  const code=`const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync(process.argv[1]);db.exec("PRAGMA journal_mode=WAL; BEGIN IMMEDIATE; UPDATE standalone_reminders_v1 SET title='after'; UPDATE eng_state_v2 SET payload='after'; COMMIT;");process.stdout.write("COMMITTED\\n");setInterval(()=>{},1000);`;
  const child=spawn(process.execPath,["-e",code,dbfile],{stdio:["ignore","pipe","pipe"]});
  let output="";
  const ready=new Promise((resolve,reject)=>{child.stdout.on("data",b=>{output+=b.toString();if(output.includes("COMMITTED"))resolve();});child.on("error",reject);child.on("exit",c=>reject(Error("Child exited before checkpoint: "+c)));});
  try{await Promise.race([ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("Child not ready")),10000).unref())]);}finally{child.kill("SIGKILL");await once(child,"close").catch(()=>{});}
  const reopened=new DatabaseSync(dbfile);
  try{assert.equal(reopened.prepare("SELECT payload FROM eng_state_v2 WHERE slot=1").get().payload,"after");assert.equal(reopened.prepare("SELECT title FROM standalone_reminders_v1 WHERE id='r1'").get().title,"after");assert.equal(reopened.prepare("PRAGMA integrity_check").get().integrity_check,"ok");}finally{reopened.close();}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
