# WORK-SB47 — CasitaDex source control inventory

Static audit on FA-MAC-DEV-01 via AI Commander. No app code changed; no native acceptance. Full handler expressions, disabled/selected/accessibility attributes, named-function validation/data calls and route source are in WORK_SB47_SOURCE_INVENTORY.json. This generated inventory covers all syntactic matching controls including legacy and shared templates; it does not establish that every branch is reachable or matches Figma. Dynamic lists expand at runtime. Every row requires paired native/state evidence before parity PASS.

| ID | Source | Owner | Component | Label or accessible name | Action | State |
| --- | --- | --- | --- | --- | --- | --- |
| SRC-1 | src/app/_layout.tsx:38 | Shell | View | "Primary navigation" | (semantic / nested) | see JSON |
| SRC-2 | src/app/_layout.tsx:43 | Shell | Pressable | {label} | {() => guardedNavigate(() => router.navigate(route))} | {{ selected: active }} |
| SRC-3 | src/brand.tsx:14 | BrandLogo | Image | "CasitaDex" | (semantic / nested) | see JSON |
| SRC-4 | src/brand.tsx:26 | LocalDate | View | {now.toLocaleDateString(undefined, { dateStyle: "full" })} | (semantic / nested) | see JSON |
| SRC-5 | src/brand.web.tsx:15 | BrandLogo | Image | "CasitaDex" | (semantic / nested) | see JSON |
| SRC-6 | src/brand.web.tsx:27 | LocalDate | View | {now.toLocaleDateString(undefined, { dateStyle: "full" })} | (semantic / nested) | see JSON |
| SRC-7 | src/draft-add.tsx:143 | DraftAdd | Image | "House and trees" | (semantic / nested) | see JSON |
| SRC-8 | src/draft-add.tsx:148 | DraftAdd | Button | "Continue draft" | {() => { setMode("edit"); setStatus("Continue editing your saved draft."); }} | {disabled} |
| SRC-9 | src/draft-add.tsx:150 | DraftAdd | Button | "Discard draft" | {() => setConfirmDiscard(true)} | {disabled} |
| SRC-10 | src/draft-add.tsx:153 | DraftAdd | Field | "What do you want to remember?" | {title => change({ title })} | see JSON |
| SRC-11 | src/draft-add.tsx:154 | DraftAdd | Field | "The answer" | {answer => change({ answer })} | see JSON |
| SRC-12 | src/draft-add.tsx:155 | DraftAdd | Field | "Where it is (optional)" | {location => change({ location })} | see JSON |
| SRC-13 | src/draft-add.tsx:159 | DraftAdd | Button | {space.name} | {() => change({ spaceId: space.id })} | {disabled} |
| SRC-14 | src/draft-add.tsx:165 | DraftAdd | Button | {context} | {() => change({ context })} | {disabled} |
| SRC-15 | src/draft-add.tsx:168 | DraftAdd | Button | {disabled ? "Saving..." : "Save memory"} | {() => void submit()} | {disabled} |
| SRC-16 | src/draft-add.tsx:169 | DraftAdd | Button | "Discard draft" | {() => setConfirmDiscard(true)} | {disabled} |
| SRC-17 | src/draft-add.tsx:173 | DraftAdd | Button | "Keep draft" | {() => setConfirmDiscard(false)} | {disabled} |
| SRC-18 | src/draft-add.tsx:174 | DraftAdd | Button | "Confirm discard draft" | {() => void discard()} | {disabled} |
| SRC-19 | src/draft-add.tsx:178 | DraftAdd | Button | "Keep draft and leave" | {() => void leave()} | {disabled \|\| mode === "loading"} |
| SRC-20 | src/editorial-intro.tsx:10 | EditorialIntro | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-21 | src/eng-screens.tsx:44 | MemoryLink | Pressable | {`Open ${memory.title}: ${memory.answer\|\|"Photo memory"}`} | {()=>router.push({pathname:"/card",params:{id:memory.id}})} | see JSON |
| SRC-22 | src/eng-screens.tsx:46 | MemoryLink | Image | {`Photo for ${memory.title}`} | (semantic / nested) | see JSON |
| SRC-23 | src/eng-screens.tsx:52 | PhotoViewer | Modal | (child content or shared prop) | {onClose} | see JSON |
| SRC-24 | src/eng-screens.tsx:54 | PhotoViewer | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-25 | src/eng-screens.tsx:55 | PhotoViewer | Button | "Close photo" | {onClose} | see JSON |
| SRC-26 | src/eng-screens.tsx:57 | PhotoViewer | Button | "Zoom in" | {()=>setZoom(v=>Math.min(v+1,4))} | {zoom>=4} |
| SRC-27 | src/eng-screens.tsx:58 | PhotoViewer | Button | "Zoom out" | {()=>setZoom(v=>Math.max(v-1,1))} | {zoom<=1} |
| SRC-28 | src/eng-screens.tsx:62 | PhotoViewer | Image | {label} | (semantic / nested) | see JSON |
| SRC-29 | src/eng-screens.tsx:76 | commands | Button | {item.label} | {item.action} | {item.disabled\|\|e.busy} |
| SRC-30 | src/eng-screens.tsx:91 | EngHome | HomeAction | (child content or shared prop) | {()=>router.push("/add")} | {!!draft\|\|!e.snapshot} |
| SRC-31 | src/eng-screens.tsx:92 | EngHome | HomeAction | (child content or shared prop) | {()=>router.push("/add?mode=photo")} | {!!draft\|\|!e.snapshot} |
| SRC-32 | src/eng-screens.tsx:93 | EngHome | HomeAction | (child content or shared prop) | {()=>router.push("/reminders?mode=new")} | see JSON |
| SRC-33 | src/eng-screens.tsx:95 | EngHome | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-34 | src/eng-screens.tsx:96 | EngHome | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-35 | src/eng-screens.tsx:96 | EngHome | Button | "View all reminders" | {()=>router.push("/reminders")} | see JSON |
| SRC-36 | src/eng-screens.tsx:107 | EngPhotos | PhotoViewer | {preview.label} | (semantic / nested) | see JSON |
| SRC-37 | src/eng-screens.tsx:110 | EngPhotos | Pressable | {`Open ${x.title} photo memory`} | {()=>setSelected(x.id)} | see JSON |
| SRC-38 | src/eng-screens.tsx:112 | EngPhotos | Image | {`Photo for ${x.title}`} | (semantic / nested) | see JSON |
| SRC-39 | src/eng-screens.tsx:116 | EngPhotos | Button | "Back to photo memories" | {()=>setSelected(null)} | see JSON |
| SRC-40 | src/eng-screens.tsx:119 | EngPhotos | Image | {"Saved photo "+(i+1)} | (semantic / nested) | see JSON |
| SRC-41 | src/eng-screens.tsx:120 | EngPhotos | Button | {"View photo "+(i+1)} | {()=>setPreview({path:p.path,label:"Photo "+(i+1)+" of "+m.title})} | see JSON |
| SRC-42 | src/eng-screens.tsx:121 | EngPhotos | Button | {"Replace photo "+(i+1)} | {()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.replaceMemoryPhoto(m.id,p.id,bytes);},"Photo replacement saved. Previous snapshot retained.")} | {e.busy} |
| SRC-43 | src/eng-screens.tsx:122 | EngPhotos | Button | {"Remove photo "+(i+1)} | {()=>Alert.alert("Remove saved photo?","Remove this photo from the memory? Previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:"Remove photo",style:"destructive",onPress:()=>void e.run(store=>store.removeMemoryPhoto(m.id,p.id))}])} | {e.busy} |
| SRC-44 | src/eng-screens.tsx:124 | EngPhotos | Button | "Add Photo" | {()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.addMemoryPhoto(m.id,bytes);},"Photo added to saved memory.")} | {e.busy\|\|m.mediaIds.length>=5} |
| SRC-45 | src/eng-screens.tsx:155 | EngReminders | Field | "Reminder title" | {setTitle} | see JSON |
| SRC-46 | src/eng-screens.tsx:156 | EngReminders | Field | "Notes (optional)" | {setNotes} | see JSON |
| SRC-47 | src/eng-screens.tsx:157 | EngReminders | Button | "Select Date" | {()=>choosePicker("date")} | see JSON |
| SRC-48 | src/eng-screens.tsx:157 | EngReminders | Button | "Select Time" | {()=>choosePicker("time")} | see JSON |
| SRC-49 | src/eng-screens.tsx:157 | EngReminders | DateTimePicker | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-50 | src/eng-screens.tsx:157 | EngReminders | Button | "Done Selecting" | {()=>setIosPicker(null)} | see JSON |
| SRC-51 | src/eng-screens.tsx:158 | EngReminders | Button | {option==="once"?"Once":option[0].toUpperCase()+option.slice(1)} | {()=>setRepeat(option)} | {repeat===option} |
| SRC-52 | src/eng-screens.tsx:158 | EngReminders | Button | "Save Reminder" | {()=>void act(()=>saveStandaloneReminder({id:editing==="new"?undefined:editing,title,notes,dueDate,dueTime,repeat}),"Reminder saved on this device.")} | {busy\|\|!title.trim()} |
| SRC-53 | src/eng-screens.tsx:159 | EngReminders | Button | "Cancel" | {leaveReminder} | see JSON |
| SRC-54 | src/eng-screens.tsx:160 | EngReminders | Button | "Create Reminder" | {()=>edit()} | see JSON |
| SRC-55 | src/eng-screens.tsx:164 | EngReminders | Button | {expandedReminder===r.id?"Close actions":"Manage reminder"} | {()=>setExpandedReminder(old=>old===r.id?null:r.id)} | see JSON |
| SRC-56 | src/eng-screens.tsx:165 | EngReminders | Button | "Edit" | {()=>edit(r)} | {busy} |
| SRC-57 | src/eng-screens.tsx:166 | EngReminders | Button | {r.completed?"Mark Incomplete":"Mark Complete"} | {()=>void act(()=>completeStandaloneReminder(r.id,!r.completed),"Reminder updated.")} | {busy} |
| SRC-58 | src/eng-screens.tsx:167 | EngReminders | Button | "Delete Reminder" | {()=>Alert.alert("Delete reminder?","This standalone reminder will be permanently deleted. Saved memories are not affected.",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>void act(()=>deleteStandaloneReminder(r.id),"Reminder deleted.")}])} | {busy} |
| SRC-59 | src/eng-screens.tsx:180 | EngMemories | Button | "Add Memory" | {()=>router.push("/add")} | see JSON |
| SRC-60 | src/eng-screens.tsx:181 | EngMemories | Button | "Add 90 fictional QA sample memories" | {()=>Alert.alert("Add 90 sample memories?","Adds clearly labeled fictional household records and 15 categories on this Development device. Existing memories, draft, and photos are preserved. This action is idempotent; sample records are not real facts.",[{text:"Cancel",style:"cancel"},{text:"Add samples",onPress:()=>void e.run(store=>store.seedSyntheticQa(),"90 fictional sample memories added. Existing draft preserved.")}])} | {e.busy} |
| SRC-61 | src/eng-screens.tsx:184 | EngMemories | Button | "All categories" | {()=>{setCategory("all");setLimit(50);}} | {category==="all"} |
| SRC-62 | src/eng-screens.tsx:185 | EngMemories | Button | {c.name} | {()=>{setCategory(c.id);setLimit(50);}} | {category===c.id} |
| SRC-63 | src/eng-screens.tsx:187 | EngMemories | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-64 | src/eng-screens.tsx:188 | EngMemories | Button | {`Show more (${memories.length-limit} remaining)`} | {()=>setLimit(n=>n+50)} | see JSON |
| SRC-65 | src/eng-screens.tsx:189 | EngMemories | Button | "Find a specific answer" | {()=>router.push("/answers")} | see JSON |
| SRC-66 | src/eng-screens.tsx:190 | EngMemories | Button | "Settings, backup and recovery" | {()=>router.push("/more")} | see JSON |
| SRC-67 | src/eng-screens.tsx:204 | EngFind | Page | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-68 | src/eng-screens.tsx:207 | EngFind | Field | "Search your memories" | {q=>{setQuery(q);setPage(0);}} | see JSON |
| SRC-69 | src/eng-screens.tsx:208 | EngFind | Button | {value==="active"?"Active":value==="archived"?"Archived":"Recently Deleted"} | {()=>filter({lifecycle:value,reminder:"all"})} | {f.lifecycle===value} |
| SRC-70 | src/eng-screens.tsx:209 | EngFind | Button | "All spaces" | {()=>filter({space:"all"})} | {f.space==="all"} |
| SRC-71 | src/eng-screens.tsx:209 | EngFind | Button | "Unassigned" | {()=>filter({space:null})} | {f.space===null} |
| SRC-72 | src/eng-screens.tsx:209 | EngFind | Button | {x.name} | {()=>filter({space:x.id})} | {f.space===x.id} |
| SRC-73 | src/eng-screens.tsx:210 | EngFind | Button | "All categories" | {()=>filter({categories:[],uncategorized:false})} | {!f.categories.length&&!f.uncategorized} |
| SRC-74 | src/eng-screens.tsx:210 | EngFind | Button | "Uncategorized" | {()=>filter({categories:[],uncategorized:true})} | {f.uncategorized} |
| SRC-75 | src/eng-screens.tsx:210 | EngFind | Button | {x.name} | {()=>filter({uncategorized:false,categories:f.categories.includes(x.id)?f.categories.filter(id=>id!==x.id):[...f.categories,x.id]})} | {f.categories.includes(x.id)} |
| SRC-76 | src/eng-screens.tsx:211 | EngFind | Button | {filters?"Hide more filters":"More filters"} | {()=>setFilters(!filters)} | see JSON |
| SRC-77 | src/eng-screens.tsx:212 | EngFind | Button | {value==="all"?"Any verification":value} | {()=>filter({confidence:value})} | {f.confidence===value} |
| SRC-78 | src/eng-screens.tsx:213 | EngFind | Button | {value==="all"?"Any reminder":value} | {()=>filter({reminder:value})} | {f.reminder===value} |
| SRC-79 | src/eng-screens.tsx:214 | EngFind | Button | {value==="all"?"Any attachment":value==="text"?"Without photos":"With photos"} | {()=>filter({attachment:value})} | {f.attachment===value} |
| SRC-80 | src/eng-screens.tsx:216 | EngFind | Button | "Remove Space filter" | {()=>filter({space:"all"})} | see JSON |
| SRC-81 | src/eng-screens.tsx:216 | EngFind | Button | "Remove Uncategorized filter" | {()=>filter({uncategorized:false})} | see JSON |
| SRC-82 | src/eng-screens.tsx:216 | EngFind | Button | {`Remove ${e.snapshot?.data.categories.find(c=>c.id===id)?.name??"Category"} filter`} | {()=>filter({categories:f.categories.filter(c=>c!==id)})} | see JSON |
| SRC-83 | src/eng-screens.tsx:216 | EngFind | Button | {`Remove ${f[key]} filter`} | {()=>filter({[key]:"all"})} | see JSON |
| SRC-84 | src/eng-screens.tsx:218 | EngFind | Button | "Clear filters" | {()=>{setF({...defaultFilter(),lifecycle:f.lifecycle});setPage(0);}} | see JSON |
| SRC-85 | src/eng-screens.tsx:219 | EngFind | Button | {selecting?"Cancel selection":"Select memories"} | {()=>{setSelecting(!selecting);setSelected([]);}} | see JSON |
| SRC-86 | src/eng-screens.tsx:219 | EngFind | Button | {state==="active"?"Restore selected":state==="archived"?"Archive selected":"Delete selected"} | {()=>bulk(state)} | {e.busy\|\|!selected.length} |
| SRC-87 | src/eng-screens.tsx:219 | EngFind | Button | {`Select ${m.title}`} | {()=>setSelected(old=>old.includes(m.id)?old.filter(id=>id!==m.id):[...old,m.id])} | {e.busy} |
| SRC-88 | src/eng-screens.tsx:219 | EngFind | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-89 | src/eng-screens.tsx:221 | EngFind | Button | "Previous 50 results" | {()=>setPage(currentPage-1)} | {!currentPage} |
| SRC-90 | src/eng-screens.tsx:221 | EngFind | Button | "Next 50 results" | {()=>setPage(currentPage+1)} | {(currentPage+1)*50>=records.length} |
| SRC-91 | src/eng-screens.tsx:281 | EngAdd | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-92 | src/eng-screens.tsx:285 | EngAdd | Button | "Continue Editing" | {()=>setMode("edit")} | {disabled} |
| SRC-93 | src/eng-screens.tsx:286 | EngAdd | Button | "Draft options" | {()=>setDiscard(true)} | {disabled} |
| SRC-94 | src/eng-screens.tsx:289 | EngAdd | Button | "Take photo" | {()=>void photo(true)} | {disabled} |
| SRC-95 | src/eng-screens.tsx:289 | EngAdd | Button | "Choose photo" | {()=>void photo(false)} | {disabled} |
| SRC-96 | src/eng-screens.tsx:290 | EngAdd | Field | "What do you want to remember?" | {title=>change({title})} | see JSON |
| SRC-97 | src/eng-screens.tsx:291 | EngAdd | Field | "The answer (or add a photo)" | {answer=>change({answer})} | see JSON |
| SRC-98 | src/eng-screens.tsx:294 | EngAdd | Button | {managePhotos?"Hide saved photos":"View saved photos"} | {()=>setManagePhotos(!managePhotos)} | see JSON |
| SRC-99 | src/eng-screens.tsx:294 | EngAdd | PhotoViewer | {zoomPhoto.label} | (semantic / nested) | see JSON |
| SRC-100 | src/eng-screens.tsx:295 | EngAdd | Image | {`Draft photo ${index+1}`} | (semantic / nested) | see JSON |
| SRC-101 | src/eng-screens.tsx:296 | EngAdd | Button | {`Open draft photo ${index+1} to zoom`} | {()=>setZoomPhoto({path:p.path,label:`Draft photo ${index+1}`})} | see JSON |
| SRC-102 | src/eng-screens.tsx:296 | EngAdd | Button | {`Replace draft photo ${index+1}`} | {()=>void action(async store=>{const bytes=await chooseEngPhoto(false);if(!bytes){setStatus("Replacement canceled. Original photo kept.");return;}const next=await store.replacePhoto(form.id,p.id,bytes);update(next.draft!);setStatus("Draft photo replaced and verified.");})} | {disabled} |
| SRC-103 | src/eng-screens.tsx:296 | EngAdd | Button | {`Remove draft photo ${index+1}`} | {()=>void action(async store=>{const next=await store.removePhoto(form.id,p.id);update(next.draft!);setStatus("Photo removed from draft. Previous save remains recoverable.");})} | {disabled} |
| SRC-104 | src/eng-screens.tsx:298 | EngAdd | Button | "Take photo" | {()=>void photo(true)} | {disabled\|\|(form?.photos.length??0)>=5} |
| SRC-105 | src/eng-screens.tsx:299 | EngAdd | Button | "Browse image files" | {()=>void photo("files")} | {disabled\|\|(form?.photos.length??0)>=5} |
| SRC-106 | src/eng-screens.tsx:299 | EngAdd | Button | "Choose photo" | {()=>void photo(false)} | {disabled\|\|(form?.photos.length??0)>=5} |
| SRC-107 | src/eng-screens.tsx:300 | EngAdd | Button | {organize?"Hide organization":"Organize (optional)"} | {()=>setOrganize(!organize)} | see JSON |
| SRC-108 | src/eng-screens.tsx:301 | EngAdd | Button | "Unassigned" | {()=>change({spaceId:null})} | {disabled} |
| SRC-109 | src/eng-screens.tsx:302 | EngAdd | Button | {x.name} | {()=>change({spaceId:x.id})} | {disabled} |
| SRC-110 | src/eng-screens.tsx:304 | EngAdd | Field | "New Space name" | {setNewSpace} | see JSON |
| SRC-111 | src/eng-screens.tsx:305 | EngAdd | Button | "Create Space here" | {()=>void action(async store=>{         const next=await store.taxonomy("space",newSpace);const space=next.data.spaces.at(-1)!;         const d=current.current??newEngDraft();const updated={...d,spaceId:space.id,checkpoint:d.checkpoint+1};await store.checkpoint(updated);update(updated);setNewSpace("");setStatus("Space created and selected.");       })} | {disabled} |
| SRC-112 | src/eng-screens.tsx:309 | EngAdd | Button | "Rename selected Space using new Space name" | {()=>void action(async store=>{const snapshot=await store.load();await store.renameTaxonomy("space",form.spaceId!,newSpace,snapshot.revision);setNewSpace("");setStatus("Space renamed. Draft kept.");})} | {disabled} |
| SRC-113 | src/eng-screens.tsx:311 | EngAdd | Button | {x.name} | {()=>change({categoryIds:form?.categoryIds.includes(x.id)?form.categoryIds.filter(id=>id!==x.id):[...(form?.categoryIds??[]),x.id]})} | {disabled} |
| SRC-114 | src/eng-screens.tsx:313 | EngAdd | Field | "New Category name" | {setNewCategory} | see JSON |
| SRC-115 | src/eng-screens.tsx:314 | EngAdd | Button | {`Rename ${e.snapshot?.data.categories.find(c=>c.id===id)?.name} using new Category name`} | {()=>void action(async store=>{const snapshot=await store.load();await store.renameTaxonomy("category",id,newCategory,snapshot.revision);setNewCategory("");setStatus("Category renamed. Draft kept.");})} | {disabled} |
| SRC-116 | src/eng-screens.tsx:315 | EngAdd | Button | "Create Category" | {()=>void action(async store=>{await store.taxonomy("category",newCategory);setNewCategory("");setStatus("Category created. Select it to add it to your memory.");})} | {disabled} |
| SRC-117 | src/eng-screens.tsx:316 | EngAdd | Button | {details?"Hide more details":"More details (optional)"} | {()=>setDetails(!details)} | see JSON |
| SRC-118 | src/eng-screens.tsx:316 | EngAdd | Field | "Where it is (optional)" | {location=>change({location})} | see JSON |
| SRC-119 | src/eng-screens.tsx:316 | EngAdd | Field | "Notes (optional)" | {notes=>change({notes})} | see JSON |
| SRC-120 | src/eng-screens.tsx:316 | EngAdd | Field | "Source (optional)" | {source=>change({source})} | see JSON |
| SRC-121 | src/eng-screens.tsx:316 | EngAdd | Field | "Reminder date (YYYY-MM-DD, optional)" | {due=>change({due:due\|\|undefined})} | see JSON |
| SRC-122 | src/eng-screens.tsx:318 | EngAdd | Button | {working?"Saving…":"Save memory"} | {()=>void save()} | {disabled} |
| SRC-123 | src/eng-screens.tsx:319 | EngAdd | Button | "Draft options" | {()=>setDiscard(true)} | {disabled} |
| SRC-124 | src/eng-screens.tsx:321 | EngAdd | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-125 | src/eng-screens.tsx:322 | EngAdd | Button | "Return to editing" | {()=>setDuplicate(false)} | see JSON |
| SRC-126 | src/eng-screens.tsx:323 | EngAdd | Button | "Save as separate memory" | {()=>void save(true)} | {disabled} |
| SRC-127 | src/eng-screens.tsx:326 | EngAdd | Button | "Keep draft" | {()=>setDiscard(false)} | {disabled} |
| SRC-128 | src/eng-screens.tsx:327 | EngAdd | Button | "Confirm discard draft" | {()=>void action(async store=>{const d=current.current;if(d)await store.discard(d.id,d.checkpoint);current.current=null;setForm(null);setDiscard(false);setMode("edit");setStatus("Draft discarded. Your saved memories are kept.");})} | {disabled} |
| SRC-129 | src/eng-screens.tsx:330 | EngAdd | Button | "Keep draft and leave" | {()=>void action(async()=>{router.replace("/");})} | {disabled\|\|mode==="loading"} |
| SRC-130 | src/eng-screens.tsx:346 | EngDetail | PhotoViewer | {photo.label} | (semantic / nested) | see JSON |
| SRC-131 | src/eng-screens.tsx:349 | EngDetail | Field | "Memory name" | {title=>setEdit({...edit,title})} | {e.busy} |
| SRC-132 | src/eng-screens.tsx:350 | EngDetail | Field | "Written answer (optional with a photo)" | {answer=>setEdit({...edit,answer})} | {e.busy} |
| SRC-133 | src/eng-screens.tsx:351 | EngDetail | Field | "Location" | {location=>setEdit({...edit,location})} | {e.busy} |
| SRC-134 | src/eng-screens.tsx:352 | EngDetail | Field | "Notes" | {notes=>setEdit({...edit,notes})} | {e.busy} |
| SRC-135 | src/eng-screens.tsx:353 | EngDetail | Field | "Source" | {source=>setEdit({...edit,source})} | {e.busy} |
| SRC-136 | src/eng-screens.tsx:354 | EngDetail | Field | "Reminder date (YYYY-MM-DD)" | {value=>setEdit({...edit,due:value\|\|undefined})} | {e.busy} |
| SRC-137 | src/eng-screens.tsx:356 | EngDetail | Button | "Unassigned" | {()=>setEdit({...edit,spaceId:null})} | {edit.spaceId===null} |
| SRC-138 | src/eng-screens.tsx:357 | EngDetail | Button | {x.name} | {()=>setEdit({...edit,spaceId:x.id})} | {edit.spaceId===x.id} |
| SRC-139 | src/eng-screens.tsx:358 | EngDetail | Button | {x.name} | {()=>setEdit({...edit,categoryIds:edit.categoryIds.includes(x.id)?edit.categoryIds.filter(id=>id!==x.id):[...edit.categoryIds,x.id]})} | {edit.categoryIds.includes(x.id)} |
| SRC-140 | src/eng-screens.tsx:359 | EngDetail | Field | "Create a Space or Category without leaving edits" | {setLabelName} | {e.busy} |
| SRC-141 | src/eng-screens.tsx:360 | EngDetail | Button | {kind==="space"?"Create and select Space":"Create and select Category"} | {()=>void e.run(async store=>{const next=await store.taxonomy(kind,labelName,revision);const label=(kind==="space"?next.data.spaces:next.data.categories).at(-1)!;setEdit({...edit,...(kind==="space"?{spaceId:label.id}:{categoryIds:[...edit.categoryIds,label.id]})});setRevision(next.revision);setLabelName("");})} | {e.busy} |
| SRC-142 | src/eng-screens.tsx:361 | EngDetail | Button | "Rename selected Space using label name" | {()=>void e.run(async store=>{const next=await store.renameTaxonomy("space",edit.spaceId!,labelName,revision);setRevision(next.revision);setLabelName("");})} | {e.busy} |
| SRC-143 | src/eng-screens.tsx:361 | EngDetail | Button | {`Rename ${e.snapshot?.data.categories.find(c=>c.id===id)?.name} using label name`} | {()=>void e.run(async store=>{const next=await store.renameTaxonomy("category",id,labelName,revision);setRevision(next.revision);setLabelName("");})} | {e.busy} |
| SRC-144 | src/eng-screens.tsx:362 | EngDetail | Button | "Save changes" | {()=>void e.run(async store=>{await store.updateMemory(edit,revision);setEdit(null);})} | {e.busy} |
| SRC-145 | src/eng-screens.tsx:363 | EngDetail | Button | "Cancel edits" | {()=>setEdit(null)} | {e.busy} |
| SRC-146 | src/eng-screens.tsx:367 | EngDetail | Button | {review?"Close review":"Review answer"} | {()=>{setSource(m.source);setReview(!review);}} | see JSON |
| SRC-147 | src/eng-screens.tsx:367 | EngDetail | Field | "Source checked" | {setSource} | {e.busy} |
| SRC-148 | src/eng-screens.tsx:367 | EngDetail | Button | {confidence==="Verified"?"Confirm Verified":`Set ${confidence}`} | {()=>void e.run(async store=>{await store.reviewMemory(m.id,{source,confidence},e.snapshot!.revision);setReview(false);})} | {e.busy} |
| SRC-149 | src/eng-screens.tsx:371 | EngDetail | Field | "Next reminder (optional YYYY-MM-DD)" | {setNextDue} | {e.busy} |
| SRC-150 | src/eng-screens.tsx:371 | EngDetail | Button | {nextDue?"Complete and reschedule reminder":"Complete reminder"} | {()=>void e.run(async store=>{await store.completeReminder(m.id,e.snapshot!.revision,nextDue\|\|undefined);setNextDue("");})} | {e.busy} |
| SRC-151 | src/eng-screens.tsx:373 | EngDetail | Image | {`Saved photo ${index+1} of ${m.title}`} | (semantic / nested) | see JSON |
| SRC-152 | src/eng-screens.tsx:374 | EngDetail | Button | {`Open photo ${index+1} to zoom`} | {()=>setPhoto({path:p.path,label:`Photo ${index+1} of ${m.title}`})} | see JSON |
| SRC-153 | src/eng-screens.tsx:375 | EngDetail | Button | {`Remove saved photo ${index+1}`} | {()=>confirm("Remove photo",store=>store.removeMemoryPhoto(m.id,p.id))} | {e.busy} |
| SRC-154 | src/eng-screens.tsx:378 | EngDetail | Button | "Add a photo" | {()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(!bytes){e.setStatus("Photo selection canceled. Your memory is kept.");return;}await store.addMemoryPhoto(m.id,bytes);e.setStatus("Photo saved with this memory.");},"")} | {e.busy} |
| SRC-155 | src/eng-screens.tsx:379 | EngDetail | Button | "Take another photo" | {()=>void e.run(async store=>{const bytes=await chooseEngPhoto(true);if(!bytes){e.setStatus("Camera canceled. Your memory is kept.");return;}await store.addMemoryPhoto(m.id,bytes);e.setStatus("Photo saved with this memory.");},"")} | {e.busy} |
| SRC-156 | src/eng-screens.tsx:380 | EngDetail | Button | "Edit memory" | {()=>{setEdit(JSON.parse(JSON.stringify(m)));setRevision(e.snapshot!.revision);}} | {e.busy} |
| SRC-157 | src/eng-screens.tsx:381 | EngDetail | Button | {m.lifecycle==="active"?"Archive memory":"Return to Active"} | {()=>void e.run(store=>store.lifecycle(m.id,m.lifecycle==="active"?"archived":"active",day()))} | {e.busy} |
| SRC-158 | src/eng-screens.tsx:382 | EngDetail | Button | "Move to Recently Deleted" | {()=>confirm("Move to Recently Deleted",store=>store.lifecycle(m.id,"recently_deleted",day()))} | {e.busy} |
| SRC-159 | src/eng-screens.tsx:385 | EngDetail | Button | "Restore memory" | {()=>void e.run(store=>store.lifecycle(m.id,"active",day()))} | {e.busy} |
| SRC-160 | src/eng-screens.tsx:388 | EngDetail | Button | {review?"Hide history":"Show history"} | {()=>setReview(!review)} | see JSON |
| SRC-161 | src/eng-screens.tsx:390 | EngDetail | Field | "History note" | {setHistory} | {e.busy} |
| SRC-162 | src/eng-screens.tsx:391 | EngDetail | Button | "Record history" | {()=>void e.run(async store=>{if(!history.trim())throw Error("Add a history note first");await store.recordHistory(m.id,history.trim(),e.snapshot!.revision);setHistory("");})} | {e.busy} |
| SRC-163 | src/eng-screens.tsx:393 | EngDetail | Button | "Share memory" | {()=>{setFields([]);setPhotoIds([]);setSharing(true);}} | {e.busy} |
| SRC-164 | src/eng-screens.tsx:394 | EngDetail | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-165 | src/eng-screens.tsx:394 | EngDetail | Button | {`Include ${field}`} | {()=>setFields(old=>old.includes(field)?old.filter(x=>x!==field):[...old,field])} | {e.busy} |
| SRC-166 | src/eng-screens.tsx:394 | EngDetail | Button | {`Include photo ${i+1}`} | {()=>setPhotoIds(old=>old.includes(p.id)?old.filter(id=>id!==p.id):[...old,p.id])} | {e.busy} |
| SRC-167 | src/eng-screens.tsx:394 | EngDetail | Image | "Selected photo in share preview" | (semantic / nested) | see JSON |
| SRC-168 | src/eng-screens.tsx:394 | EngDetail | Button | "Open share sheet with reviewed details" | {()=>void e.run(async()=>{const preview=sharePreview(m,e.snapshot!.data,{fields,photoIds});if(photoIds.length)e.setStatus(await shareEngPhotos(preview));else{const result=await Share.share({message:preview.text});e.setStatus(result.action===Share.dismissedAction?"Sharing canceled.":"Share sheet opened. Delivery is handled by the selected app.");}setSharing(false);},"")} | {e.busy} |
| SRC-169 | src/eng-screens.tsx:394 | EngDetail | Button | "Cancel sharing" | {()=>setSharing(false)} | {e.busy} |
| SRC-170 | src/eng-screens.tsx:404 | LabelManager | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-171 | src/eng-screens.tsx:404 | LabelManager | Button | {k==="space"?"Spaces":"Categories"} | {()=>{setKind(k);setSelected("");setImpact(null);setName("");}} | {e.busy} |
| SRC-172 | src/eng-screens.tsx:405 | LabelManager | Button | {x.name} | {()=>{setSelected(x.id);setName(x.name);setImpact(null);}} | {e.busy} |
| SRC-173 | src/eng-screens.tsx:406 | LabelManager | Field | "Label name" | {setName} | {e.busy} |
| SRC-174 | src/eng-screens.tsx:407 | LabelManager | Button | "Create new label" | {()=>void e.run(store=>store.taxonomy(kind,name))} | {e.busy} |
| SRC-175 | src/eng-screens.tsx:408 | LabelManager | Button | "Rename selected label" | {()=>void e.run(async store=>{await store.renameTaxonomy(kind,selected,name,e.snapshot!.revision);setImpact(null);})} | {e.busy} |
| SRC-176 | src/eng-screens.tsx:409 | LabelManager | Button | "Review label removal" | {()=>void e.run(async store=>{setImpact(await store.taxonomyImpact(kind,selected));},"")} | {e.busy} |
| SRC-177 | src/eng-screens.tsx:410 | LabelManager | Button | "Confirm remove label only" | {()=>void e.run(async store=>{await store.removeTaxonomy(impact.kind,impact.id,impact.revision);setSelected("");setImpact(null);setName("");})} | {e.busy} |
| SRC-178 | src/eng-screens.tsx:410 | LabelManager | Button | "Cancel label removal" | {()=>setImpact(null)} | see JSON |
| SRC-179 | src/eng-screens.tsx:417 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-180 | src/eng-screens.tsx:420 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-181 | src/eng-screens.tsx:420 | EngMore | Button | "Storage & Cleanup" | {()=>setSection("storage")} | see JSON |
| SRC-182 | src/eng-screens.tsx:421 | EngMore | Button | "Archived memories" | {()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"archived"},page:0,y:0,expanded:false};router.push("/answers");}} | see JSON |
| SRC-183 | src/eng-screens.tsx:422 | EngMore | Button | "Recently Deleted memories" | {()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"recently_deleted"},page:0,y:0,expanded:false};router.push("/answers");}} | see JSON |
| SRC-184 | src/eng-screens.tsx:423 | EngMore | Button | "Manage Spaces & Categories" | {()=>setSection("labels")} | see JSON |
| SRC-185 | src/eng-screens.tsx:424 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-186 | src/eng-screens.tsx:424 | EngMore | Button | "Backup & Restore" | {()=>setSection("backup")} | see JSON |
| SRC-187 | src/eng-screens.tsx:425 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-188 | src/eng-screens.tsx:425 | EngMore | Button | "Appearance & Accessibility" | {()=>setSection("preferences")} | see JSON |
| SRC-189 | src/eng-screens.tsx:425 | EngMore | Button | "Help & About" | {()=>setSection("help")} | see JSON |
| SRC-190 | src/eng-screens.tsx:425 | EngMore | Button | "Optional premium information" | {()=>setSection("premium")} | see JSON |
| SRC-191 | src/eng-screens.tsx:426 | EngMore | Button | "Back to More" | {()=>setSection(null)} | see JSON |
| SRC-192 | src/eng-screens.tsx:427 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-193 | src/eng-screens.tsx:428 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-194 | src/eng-screens.tsx:428 | EngMore | Button | "Measure device storage" | {()=>void e.run(async()=>{       const storage=await getEngStorage();       const free=Number.isFinite(storage.free)?`${storage.free} bytes`:"Unavailable";       e.setStatus(`App-available device storage: ${free}. Verified protected photo content: ${storage.protectedBytes} bytes. Referenced photo content: ${storage.referencedBytes} bytes. Unreadable files: ${storage.unreadable}. Photos kept for: ${Object.entries(storage.ownerCounts).map(([owner,count])=>({active:"Active",archived:"Archived",recently_deleted:"Recently Deleted",draft:"Draft",recovery:"Previous save","legacy-v1":"Earlier collection","legacy-recovery":"Earlier previous save",journal:"Retained photo operations"} as Record<string,string>)[owner]+" "+count).join(", ")}. Groups can overlap. Photo content sizes exclude database, cache, filesystem allocation and unindexed files. Archive and Recently Deleted reclaim no bytes. Automatic cleanup and permanent purge remain disabled. Space is checked before saving or restoring. Automatic low-space alerts are not enabled.`);     },"")} | {e.busy} |
| SRC-195 | src/eng-screens.tsx:433 | EngMore | Button | "Check photo integrity and protected owners" | {()=>void e.run(async store=>{const result=await store.audit();const bad=result.filter(x=>x.verdict!=="verified");e.setStatus(`${result.length} protected photo references checked. ${bad.length} need attention.`+(bad.length?" "+bad.map(x=>x.owner+": "+x.verdict).join("; "):" No files removed."));},"")} | {e.busy} |
| SRC-196 | src/eng-screens.tsx:435 | EngMore | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-197 | src/eng-screens.tsx:436 | EngMore | MemoryLink | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-198 | src/eng-screens.tsx:437 | EngMore | Button | "Review unfinished draft and its photos" | {()=>router.push("/add")} | see JSON |
| SRC-199 | src/eng-screens.tsx:440 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-200 | src/eng-screens.tsx:441 | EngMore | Button | "Save full backup (with draft and photos)" | {()=>void e.run(async store=>{const b=await store.backup();e.setStatus(await writeEngBackup(b));},"")} | {e.busy} |
| SRC-201 | src/eng-screens.tsx:442 | EngMore | Button | "Review limited text backup (photos excluded)" | {()=>void e.run(async store=>{const b=await store.backup();setTextReview({snapshot:b.snapshot,token:await store.restoreToken()});},"")} | {e.busy} |
| SRC-202 | src/eng-screens.tsx:443 | EngMore | Button | "Confirm save limited text backup" | {()=>void e.run(async store=>{if(await store.restoreToken()!==textReview.token)throw Error("Collection changed. Review the text backup again.");e.setStatus(await writeEngText(createTextBackup(textReview.snapshot),true));setTextReview(null);},"")} | {e.busy} |
| SRC-203 | src/eng-screens.tsx:443 | EngMore | Button | "Cancel text backup" | {()=>setTextReview(null)} | see JSON |
| SRC-204 | src/eng-screens.tsx:445 | EngMore | Button | "Save text report (no photos; not a backup)" | {()=>void e.run(async store=>{const b=await store.backup();const text=JSON.stringify({format:"CasitaDex readable text report — not restorable",exportedAt:new Date().toISOString(),memories:b.snapshot.data.memories,spaces:b.snapshot.data.spaces,categories:b.snapshot.data.categories,draft:b.snapshot.draft?{...b.snapshot.draft,photos:b.snapshot.draft.photos.map(p=>({id:p.id,note:"Photo bytes excluded"}))}:null},null,2);e.setStatus(await writeEngText(text));},"")} | {e.busy} |
| SRC-205 | src/eng-screens.tsx:446 | EngMore | Button | "Choose backup to review" | {()=>void e.run(async store=>{const backup=await pickEngBackup();setIncoming(backup);setRestoreToken(backup?await store.restoreToken():null);setReminderRestoreToken(backup?.reminders?await store.reminderRestoreToken():null);setConflict(null);e.setStatus(backup?"Backup checked. Review before replacing your collection.":"Backup selection canceled. Current data kept.");},"")} | {e.busy} |
| SRC-206 | src/eng-screens.tsx:453 | EngMore | Button | "Keep current draft" | {()=>setConflict("keep")} | {e.busy} |
| SRC-207 | src/eng-screens.tsx:454 | EngMore | Button | "Use backed-up draft (previous state recoverable)" | {()=>setConflict("incoming")} | {e.busy} |
| SRC-208 | src/eng-screens.tsx:456 | EngMore | Button | "Confirm replace with reviewed backup" | {()=>void e.run(async store=>{if(!restoreToken)throw Error("Review this backup again");await store.stageRestore(incoming.snapshot,incoming.read,restoreToken);if(incoming.reminders)await store.restoreV4(incoming.snapshot,incoming.reminders,conflict??"incoming",restoreToken,reminderRestoreToken??undefined);else await store.restore(incoming.snapshot,conflict??"incoming",restoreToken);setIncoming(null);},"Full collection restored and verified.")} | {e.busy\|\|!!(e.snapshot?.draft&&!conflict)} |
| SRC-209 | src/eng-screens.tsx:457 | EngMore | Button | "Cancel restore" | {()=>{setIncoming(null);e.setStatus("Restore canceled. Your collection and draft are kept.");}} | {e.busy} |
| SRC-210 | src/eng-screens.tsx:459 | EngMore | Button | "Recover previous full save" | {()=>setConfirmRecovery(true)} | {e.busy} |
| SRC-211 | src/eng-screens.tsx:461 | EngMore | Button | "Confirm full recovery" | {()=>void e.run(async store=>{if(await store.hasV4Recovery())await store.recoverV4();else await store.recover();setConfirmRecovery(false);},"Previous full save recovered and verified.")} | {e.busy} |
| SRC-212 | src/eng-screens.tsx:462 | EngMore | Button | "Cancel recovery" | {()=>setConfirmRecovery(false)} | see JSON |
| SRC-213 | src/eng-screens.tsx:465 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-214 | src/eng-screens.tsx:466 | EngMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-215 | src/eng-screens.tsx:466 | EngMore | Button | "Large text" | {()=>preferences.setLarge(!preferences.large)} | {preferences.large} |
| SRC-216 | src/eng-screens.tsx:467 | EngMore | Button | {value+" appearance"} | {()=>preferences.setAppearance(value)} | {preferences.appearance===value} |
| SRC-217 | src/eng-screens.tsx:469 | EngMore | Button | "Reload full collection" | {()=>void e.refresh()} | {e.busy} |
| SRC-218 | src/home-action.tsx:10 | HomeAction | Pressable | {title} | {onPress} | {disabled} |
| SRC-219 | src/screens.tsx:49 | Tile | Pressable | {"Open " + card.title} | {() => router.push({ pathname: "/card", params: { id: card.id } })} | see JSON |
| SRC-220 | src/screens.tsx:81 | Today | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-221 | src/screens.tsx:88 | Today | Button | "+ Save a memory" | {() => router.push("/add")} | see JSON |
| SRC-222 | src/screens.tsx:93 | Today | Button | "Explore example home" | {() => void save(examples())} | {busy} |
| SRC-223 | src/screens.tsx:102 | Today | Button | "Find an answer" | {() => router.push("/answers")} | see JSON |
| SRC-224 | src/screens.tsx:106 | Today | Button | "Add an answer" | {() => router.push("/add")} | see JSON |
| SRC-225 | src/screens.tsx:108 | Today | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-226 | src/screens.tsx:163 | LegacyAnswers | Field | "Search your memories" | {setQuery} | see JSON |
| SRC-227 | src/screens.tsx:166 | LegacyAnswers | Button | {m} | {() => {               setMode(m);               setPreview(false);               setMessage("");             }} | {mode === m} |
| SRC-228 | src/screens.tsx:193 | LegacyAnswers | Button | "Add an answer" | {() => router.push("/add")} | see JSON |
| SRC-229 | src/screens.tsx:201 | LegacyAnswers | Button | {(ids.includes(c.id) ? "Selected: " : "Select: ") + c.title} | {() => {                 setIds(                   ids.includes(c.id)                     ? ids.filter((id) => id !== c.id)                     : [...ids, c.id],                 );                 setPreview(false);               }} | {ids.includes(c.id)} |
| SRC-230 | src/screens.tsx:220 | LegacyAnswers | Button | {               details                 ? "Include location, notes and history: On"                 : "Include location, notes and history: Off"             } | {() => {               setDetails(!details);               setPreview(false);             }} | {details} |
| SRC-231 | src/screens.tsx:236 | LegacyAnswers | Button | {"Preview " + ids.length + " selected cards"} | {() => setPreview(true)} | {!ids.length} |
| SRC-232 | src/screens.tsx:243 | LegacyAnswers | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-233 | src/screens.tsx:247 | LegacyAnswers | Button | {                   Platform.OS === "web"                     ? "Copy this snapshot"                     : "Open device share sheet"                 } | {() => void share()} | see JSON |
| SRC-234 | src/screens.tsx:311 | LegacyAdd | Field | "What do you want to remember?" | {setTitle} | see JSON |
| SRC-235 | src/screens.tsx:316 | LegacyAdd | Field | "The answer" | {setAnswer} | see JSON |
| SRC-236 | src/screens.tsx:317 | LegacyAdd | Field | "Where it is (optional)" | {setLocation} | see JSON |
| SRC-237 | src/screens.tsx:325 | LegacyAdd | Button | {c} | {() => setContext(c)} | {context === c} |
| SRC-238 | src/screens.tsx:337 | LegacyAdd | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-239 | src/screens.tsx:338 | LegacyAdd | Button | {busy ? "Saving..." : "Save memory"} | {() => void submit()} | {busy} |
| SRC-240 | src/screens.tsx:344 | LegacyAdd | Button | "Cancel" | {() => router.replace("/")} | see JSON |
| SRC-241 | src/screens.tsx:438 | LegacyDetail | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-242 | src/screens.tsx:444 | LegacyDetail | Image | "Attached image" | (semantic / nested) | see JSON |
| SRC-243 | src/screens.tsx:450 | LegacyDetail | Button | "Remove attached image" | {() => {                       if (!card) return;                       Alert.alert(                         "Remove this image?",                         "The image will be detached from this card.",                         [                           { text: "Cancel", style: "cancel" },                           {                             text: "Remove",                             style: "destructive",                             onPress: () => {                               void removeCardImage(                                 mediaEnvironment,                                 card.id,                                 image.id,                               )                                 .then(() =>                                   listCardImages(mediaEnvironment, card.id),                                 )                                 .then(setImages)                                 .catch((e) =>                                   setMessage(                                     e instanceof Error                                       ? e.message                                       : "Image removal failed",                                   ),                                 );                             },                           },                         ],                       );                     }} | {busy} |
| SRC-244 | src/screens.tsx:488 | LegacyDetail | Button | "Attach an image" | {() => {                   if (!card) return;                   void pickAndAttachImage(mediaEnvironment, card.id)                     .then(() => listCardImages(mediaEnvironment, card.id))                     .then(setImages)                     .catch((e) =>                       setMessage(                         e instanceof Error ? e.message : "Image import failed",                       ),                     );                 }} | {busy} |
| SRC-245 | src/screens.tsx:505 | LegacyDetail | Button | "Edit answer" | {() => {               setNewAnswer(card.answer);               setEditing(true);             }} | {busy} |
| SRC-246 | src/screens.tsx:515 | LegacyDetail | Field | "Updated answer" | {setNewAnswer} | see JSON |
| SRC-247 | src/screens.tsx:523 | LegacyDetail | Button | "Cancel edit" | {() => setEditing(false)} | see JSON |
| SRC-248 | src/screens.tsx:524 | LegacyDetail | Button | "Save edited answer" | {() =>                   void update({                     answer: newAnswer.trim(),                     confidence: "Needs checking",                     verifiedAt: undefined,                   }).then((ok) => {                     if (ok) setEditing(false);                   })                 } | {busy \|\| !newAnswer.trim()} |
| SRC-249 | src/screens.tsx:539 | LegacyDetail | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-250 | src/screens.tsx:543 | LegacyDetail | Field | "Source you checked" | {setSource} | see JSON |
| SRC-251 | src/screens.tsx:550 | LegacyDetail | Button | {"Mark " + c} | {() => void verify(c)} | {busy} |
| SRC-252 | src/screens.tsx:558 | LegacyDetail | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-253 | src/screens.tsx:562 | LegacyDetail | Field | "New due date (YYYY-MM-DD, blank to remove)" | {setDue} | see JSON |
| SRC-254 | src/screens.tsx:567 | LegacyDetail | Button | "Save due date" | {() => void reminder()} | {busy} |
| SRC-255 | src/screens.tsx:572 | LegacyDetail | Button | "Record maintenance done today" | {() =>               void update({                 due: undefined,                 history: [                   ...card.history,                   { id: uid(), date: today(), action: "Maintenance completed" },                 ],               }).then(                 (ok) =>                   ok && setMessage("Recorded. Set a new due date when needed."),               )             } | {busy} |
| SRC-256 | src/screens.tsx:588 | LegacyDetail | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-257 | src/screens.tsx:600 | LegacyDetail | Button | "Choose cards to share" | {() =>               router.push({ pathname: "/answers", params: { mode: "Share" } })             } | see JSON |
| SRC-258 | src/screens.tsx:606 | LegacyDetail | Button | "Delete this answer" | {() => setConfirm(true)} | {busy} |
| SRC-259 | src/screens.tsx:616 | LegacyDetail | Button | "Keep answer" | {() => setConfirm(false)} | see JSON |
| SRC-260 | src/screens.tsx:617 | LegacyDetail | Button | "Confirm delete" | {() =>                   void save({                     ...data,                     cards: data.cards.filter((c) => c.id !== id),                   }).then((ok) => ok && router.replace("/answers"))                 } | {busy} |
| SRC-261 | src/screens.tsx:632 | LegacyDetail | Button | "Back to Answers" | {() => router.replace("/answers")} | see JSON |
| SRC-262 | src/screens.tsx:690 | LegacyMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-263 | src/screens.tsx:693 | LegacyMore | Button | {large ? "Extra-large text: On" : "Extra-large text: Off"} | {() => setLarge(!large)} | {large} |
| SRC-264 | src/screens.tsx:701 | LegacyMore | Button | {value} | {() => setAppearance(value)} | {appearance === value} |
| SRC-265 | src/screens.tsx:710 | LegacyMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-266 | src/screens.tsx:718 | LegacyMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-267 | src/screens.tsx:730 | LegacyMore | Button | "Save full backup (with images)" | {() => {                 if (fileOperation.current) return;                 fileOperation.current = true;                 setFileBusy(true);                 void saveMediaBackup(mediaEnvironment, data)                   .then(setMessage)                   .catch((e) =>                     setMessage(                       e instanceof Error ? e.message : "Full backup failed",                     ),                   )                   .finally(() => {                     fileOperation.current = false;                     setFileBusy(false);                   });               }} | {busy \|\| fileBusy} |
| SRC-268 | src/screens.tsx:750 | LegacyMore | Button | "Choose full backup to check" | {() => {                 if (fileOperation.current) return;                 fileOperation.current = true;                 setFileBusy(true);                 setMediaCandidate(null);                 void pickMediaBackup()                   .then((result) => {                     if (result) {                       setMediaCandidate(result);                       setMediaSnapshot(exportData(data));                       setMessage(                         "Full backup checked. Confirm replacement below.",                       );                     } else                       setMessage(                         "Full backup selection canceled; nothing changed.",                       );                   })                   .catch((e) =>                     setMessage(                       e instanceof Error ? e.message : "Invalid media backup",                     ),                   )                   .finally(() => {                     fileOperation.current = false;                     setFileBusy(false);                   });               }} | {busy \|\| fileBusy} |
| SRC-269 | src/screens.tsx:790 | LegacyMore | Button | "Cancel full restore" | {() => setMediaCandidate(null)} | see JSON |
| SRC-270 | src/screens.tsx:794 | LegacyMore | Button | "Confirm full restore" | {() => {                     if (fileOperation.current) return;                     if (exportData(data) !== mediaSnapshot) {                       setMediaCandidate(null);                       setMessage("Answers changed; check the backup again.");                       return;                     }                     fileOperation.current = true;                     setFileBusy(true);                     void restoreMediaBackup(                       mediaEnvironment,                       mediaCandidate.raw,                     )                       .then(() => reload())                       .then(() => {                         setMediaCandidate(null);                         setMessage("Full backup restored and verified.");                       })                       .catch((e) =>                         setMessage(                           e instanceof Error                             ? e.message                             : "Full restore failed; current answers preserved",                         ),                       )                       .finally(() => {                         fileOperation.current = false;                         setFileBusy(false);                       });                   }} | {busy \|\| fileBusy} |
| SRC-271 | src/screens.tsx:830 | LegacyMore | Button | "Recover previous full save" | {() => setConfirmMediaRecovery(true)} | {busy \|\| fileBusy} |
| SRC-272 | src/screens.tsx:841 | LegacyMore | Button | "Cancel full recovery" | {() => setConfirmMediaRecovery(false)} | see JSON |
| SRC-273 | src/screens.tsx:845 | LegacyMore | Button | "Confirm full recovery" | {() => {                     if (fileOperation.current) return;                     fileOperation.current = true;                     setFileBusy(true);                     void recoverMediaPrevious(mediaEnvironment)                       .then(() => reload())                       .then(() => {                         setConfirmMediaRecovery(false);                         setMessage("Previous full save recovered.");                       })                       .catch((e) =>                         setMessage(                           e instanceof Error                             ? e.message                             : "Full recovery failed",                         ),                       )                       .finally(() => {                         fileOperation.current = false;                         setFileBusy(false);                       });                   }} | {busy \|\| fileBusy} |
| SRC-274 | src/screens.tsx:873 | LegacyMore | Button | "Save backup file" | {() => {                 if (fileOperation.current) return;                 fileOperation.current = true;                 setFileBusy(true);                 setMessage("Choose a folder for your backup.");                 void saveBackupFile(data)                   .then(setMessage)                   .catch((e) =>                     setMessage(                       e instanceof Error ? e.message : "Backup failed.",                     ),                   )                   .finally(() => {                     fileOperation.current = false;                     setFileBusy(false);                   });               }} | {busy \|\| fileBusy} |
| SRC-275 | src/screens.tsx:894 | LegacyMore | Button | "Choose backup file to restore" | {() => {                 if (fileOperation.current) return;                 fileOperation.current = true;                 setFileBusy(true);                 setCandidate(null);                 setPreviewSource("");                 setMessage("Choose a CasitaDex backup file to check.");                 void pickBackupFile()                   .then((raw) => {                     if (raw === null) {                       setMessage(                         "File selection canceled. Your answers were not changed.",                       );                       return;                     }                     setInput(raw);                     setCandidate(parseData(raw));                     setPreviewSource(exportData(data));                     setMessage(                       "Backup checked. Review the counts before replacing your collection.",                     );                   })                   .catch((e) => {                     setCandidate(null);                     setPreviewSource("");                     setMessage(                       e instanceof Error ? e.message : "Invalid backup file.",                     );                   })                   .finally(() => {                     fileOperation.current = false;                     setFileBusy(false);                   });               }} | {busy \|\| fileBusy} |
| SRC-276 | src/screens.tsx:934 | LegacyMore | Button | "Prepare text backup" | {() => setOutput(exportData(data))} | see JSON |
| SRC-277 | src/screens.tsx:941 | LegacyMore | Field | "Complete backup text" | {setOutput} | see JSON |
| SRC-278 | src/screens.tsx:949 | LegacyMore | Button | "Recover the previous save" | {() => setRecoveryConfirm(true)} | {busy} |
| SRC-279 | src/screens.tsx:960 | LegacyMore | Button | "Cancel recovery" | {() => setRecoveryConfirm(false)} | see JSON |
| SRC-280 | src/screens.tsx:964 | LegacyMore | Button | "Confirm recovery" | {() =>                 void recover().then(() => setRecoveryConfirm(false))               } | {busy} |
| SRC-281 | src/screens.tsx:973 | LegacyMore | Field | "Paste a CasitaDex backup to restore" | {(v) => {             setInput(v);             setCandidate(null);             setPreviewSource("");           }} | see JSON |
| SRC-282 | src/screens.tsx:983 | LegacyMore | Button | "Check backup" | {validate} | see JSON |
| SRC-283 | src/screens.tsx:991 | LegacyMore | Button | "Cancel restore" | {() => {                 setCandidate(null);                 setPreviewSource("");               }} | see JSON |
| SRC-284 | src/screens.tsx:998 | LegacyMore | Button | "Confirm replace from backup" | {() => {                 if (fileOperation.current) return;                 if (exportData(data) !== previewSource) {                   setCandidate(null);                   setPreviewSource("");                   setMessage(                     "Answers changed since the backup check. Recheck before restoring.",                   );                   return;                 }                 fileOperation.current = true;                 setFileBusy(true);                 void save(candidate)                   .then((ok) => {                     if (ok) {                       setCandidate(null);                       setPreviewSource("");                       setInput("");                       setMessage("Backup restored.");                     } else {                       setMessage(                         "Restore was not completed. Current answers were not replaced.",                       );                     }                   })                   .catch((e) => {                     setMessage(                       e instanceof Error ? e.message : "Restore failed.",                     );                   })                   .finally(() => {                     fileOperation.current = false;                     setFileBusy(false);                   });               }} | {busy \|\| fileBusy} |
| SRC-285 | src/screens.tsx:1042 | LegacyMore | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-286 | src/screens.tsx:1084 | LegacyHome | TextInput | "Search your memories" | {setQuick} | see JSON |
| SRC-287 | src/screens.tsx:1085 | LegacyHome | Pressable | "Search memories" | {() => router.push({ pathname: "/answers", params: { q: quick } })} | see JSON |
| SRC-288 | src/screens.tsx:1089 | LegacyHome | Button | "+ Save a memory" | {() => router.push("/add")} | see JSON |
| SRC-289 | src/screens.tsx:1100 | LegacyHome | Button | "Explore example home" | {() => void save(examples())} | {busy} |
| SRC-290 | src/screens.tsx:1108 | LegacyHome | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-291 | src/screens.tsx:1116 | LegacyHome | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-292 | src/screens.tsx:1122 | LegacyHome | Button | "See all answers" | {() => router.push("/answers")} | see JSON |
| SRC-293 | src/screens.tsx:1157 | LegacyFindHome | Field | "Search your memories" | {setQuery} | see JSON |
| SRC-294 | src/screens.tsx:1159 | LegacyFindHome | Button | "All" | {() => {             setMode("All");             setSpaceId(null);           }} | {mode === "All" && !spaceId} |
| SRC-295 | src/screens.tsx:1167 | LegacyFindHome | Button | "Browse spaces" | {() => setBrowse(!browse)} | {browse} |
| SRC-296 | src/screens.tsx:1172 | LegacyFindHome | Button | "Refine results" | {() => setRefine(!refine)} | {refine} |
| SRC-297 | src/screens.tsx:1177 | LegacyFindHome | Button | "Share selected" | {() =>             router.push({ pathname: "/answers", params: { mode: "Share" } })           } | see JSON |
| SRC-298 | src/screens.tsx:1187 | LegacyFindHome | Button | {choice} | {() => {                 setMode(choice);                 setSpaceId(null);               }} | {mode === choice} |
| SRC-299 | src/screens.tsx:1201 | LegacyFindHome | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-300 | src/screens.tsx:1207 | LegacyFindHome | Button | {space.name} | {() => {                 setSpaceId(space.id);                 setMode("All");                 setBrowse(false);               }} | {spaceId === space.id} |
| SRC-301 | src/screens.tsx:1232 | LegacyFindHome | Button | "Save a memory" | {() => router.push("/add")} | see JSON |
| SRC-302 | src/screens.tsx:1236 | LegacyFindHome | Button | "Show every space" | {() => setSpaceId(null)} | see JSON |
| SRC-303 | src/screens.tsx:1239 | LegacyFindHome | Button | "Clear filters" | {() => setMode("All")} | see JSON |
| SRC-304 | src/ui.tsx:73 | Button | Pressable | (child content or shared prop) | {onPress} | {disabled} |
| SRC-305 | src/ui.tsx:123 | Field | TextInput | {label} | {onChangeText} | {{disabled}} |
| SRC-306 | src/ui.tsx:173 | Page | ScrollView | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-307 | src/ui.tsx:190 | Page | Copy | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-308 | src/ui.tsx:195 | Page | View | (child content or shared prop) | (semantic / nested) | see JSON |
| SRC-309 | src/ui.tsx:197 | Page | Button | "Retry loading" | {() => void reload()} | {busy} |
| SRC-310 | src/ui.tsx:202 | Page | Button | "Recover previous save" | {() => void recover()} | {busy} |
