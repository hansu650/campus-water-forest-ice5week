'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),src=path.join(root,'src'),assetDir=path.join(root,'assets');
const read=file=>fs.readFileSync(file,'utf8');
const manifest=JSON.parse(read(path.join(assetDir,'manifest.json'))),assets={};
for(const [key,file] of Object.entries(manifest)) {
  if(path.basename(file)!==file || !file.endsWith('.webp')) throw new Error('Invalid image filename: '+key);
  assets[key]='data:image/webp;base64,'+fs.readFileSync(path.join(assetDir,'images',file)).toString('base64');
}
let fontCSS='',fontLicenses='';
for(const family of ['Nunito','Fredoka']) {
  const font=fs.readFileSync(path.join(assetDir,'fonts',family+'.ttf'));
  const license=read(path.join(assetDir,'fonts',family+'-OFL.txt'));
  fontCSS+='@font-face{font-family:"'+family+'";font-style:normal;font-weight:300 900;font-display:swap;src:url(data:font/ttf;base64,'+font.toString('base64')+') format("truetype");}\n';
  fontLicenses+='\n'+family+' — Google Fonts\n'+license;
}
const modules={INLINE_CORE:'core.js',INLINE_SCENERY:'scenery.js',INLINE_LIFE:'pond-life.js',INLINE_CONTROLS:'edge-controls.js',INLINE_APP:'app.js'};
const replacements={INLINE_STYLE:fontCSS+read(path.join(src,'style.css')),INLINE_ASSETS:JSON.stringify(assets)};
for(const [marker,file] of Object.entries(modules)) {
  const code=read(path.join(src,file));new Function(code);replacements[marker]=code;
}
let html=read(path.join(src,'index.template.html'));
for(const [marker,value] of Object.entries(replacements)) {
  const placeholder='/* '+marker+' */';
  if(!html.includes(placeholder)) throw new Error('Missing template marker: '+marker);
  html=html.replace(placeholder,()=>value);
}
html=html.replace('</body>','<!-- Font license notices\n'+fontLicenses.replace(/-->/g,'-- >')+'\n-->\n</body>');
if(/\/\* INLINE_/.test(html)) throw new Error('Unresolved template marker');
if(/<(?:script|img|iframe)[^>]*src=["']https?:/i.test(html)) throw new Error('External runtime resource');
if(/(?:url\(\s*["']?https?:|@import\s)/i.test(replacements.INLINE_STYLE)) throw new Error('External stylesheet resource');
const output=path.join(root,'dist');fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'index.html'),html);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(JSON.stringify({output:'dist/index.html',bytes:Buffer.byteLength(html),images:Object.keys(assets).length,externalRuntimeResources:0,sha256:crypto.createHash('sha256').update(html).digest('hex')}));
