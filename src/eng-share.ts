/** Standard ZIP, stored entries with data descriptors. One photo buffered at a time. */
export async function writeShareZip(text:string,photos:{path:string;mime:string;bytes:number;sha256:string}[],read:(path:string)=>Promise<Uint8Array>,hash:(bytes:Uint8Array)=>Promise<string>,write:(bytes:Uint8Array)=>Promise<void>){
 const encode=(s:string)=>new TextEncoder().encode(s);let offset=0;const central:Uint8Array[]=[];
 const header=(size:number)=>new Uint8Array(size);const u16=(b:Uint8Array,o:number,n:number)=>new DataView(b.buffer).setUint16(o,n,true);const u32=(b:Uint8Array,o:number,n:number)=>new DataView(b.buffer).setUint32(o,n>>>0,true);
 async function output(b:Uint8Array){await write(b);offset+=b.length;}
 async function entry(name:string,bytes:Uint8Array){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
  const filename=encode(name),start=offset,h=header(30);u32(h,0,0x04034b50);u16(h,4,20);u16(h,6,0x808);u16(h,12,33);u16(h,26,filename.length);await output(h);await output(filename);await output(bytes);
  const d=header(16);u32(d,0,0x08074b50);u32(d,4,crc);u32(d,8,bytes.length);u32(d,12,bytes.length);await output(d);
  const c=header(46+filename.length);u32(c,0,0x02014b50);u16(c,4,20);u16(c,6,20);u16(c,8,0x808);u16(c,14,33);u32(c,16,crc);u32(c,20,bytes.length);u32(c,24,bytes.length);u16(c,28,filename.length);u32(c,42,start);c.set(filename,46);central.push(c);
 }
 await entry('Details.txt',encode(text));let index=0;for(const photo of photos){const bytes=await read(photo.path);if(bytes.length!==photo.bytes||await hash(bytes)!==photo.sha256)throw Error('Selected photo is missing or damaged. Sharing has not opened.');await entry(`Photo-${++index}.${photo.mime==='image/png'?'png':photo.mime==='image/webp'?'webp':'jpg'}`,bytes);}
 const start=offset;for(const c of central)await output(c);const size=offset-start,end=header(22);u32(end,0,0x06054b50);u16(end,8,central.length);u16(end,10,central.length);u32(end,12,size);u32(end,16,start);await output(end);
}
