import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/eng-screens.tsx',import.meta.url),'utf8');
test('Add Memory uses approved editorial fields with photo-first variant',()=>{
 const add=source.slice(source.indexOf('export function EngAdd()'),source.indexOf('export function EngDetail()'));
 for(const section of ['label="Memory name (Required)"','>Photos · {form?.photos.length','label="Space"','label="Categories"','label="Description"','(["location","notes","source"] as const)'])assert.ok(add.includes(section),section);
 assert.ok(!add.includes('More options"'));
 assert.ok(!add.includes('>VERIFICATION STATUS</Copy>'), 'Simplicity A.3 keeps optional verification off the initial Add form');
 assert.ok(add.includes('"Browse Files"'));
 assert.ok(add.includes('"Choose from Library"'));
 assert.ok(add.includes('"Take Photo"'));
});
test('Edit Memory labels its content Description and exposes photo controls',()=>{
 const edit=source.slice(source.indexOf('export function EngDetail()'));
 assert.ok(edit.includes('label="Description"'));
 assert.ok(edit.includes('<DetailField label="Description"'));
 assert.ok(edit.includes('>Photos · {e.snapshot?.data.media.media.filter'));
 assert.ok(edit.includes('dirty?<Copy kind="small">Save or cancel your text changes'));
});

const optional=readFileSync(new URL("../src/memory-edit-optional-field.tsx",import.meta.url),"utf8");
test("optional field labels receive the full row at enlarged text sizes",()=>{
 assert.ok(optional.includes("const stacked=large||fontScale>=1.35"));
 assert.ok(optional.includes("flexDirection:stacked?\"column\":\"row\""));
 assert.ok(optional.includes("flex:stacked?undefined:1"));
});
