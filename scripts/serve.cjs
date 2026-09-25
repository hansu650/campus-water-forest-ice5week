'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),port=Number(process.argv[2]||57863);
if(!fs.existsSync(path.join(root,'index.html'))) throw new Error('Run npm run build first.');
http.createServer((req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1');
    if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
    const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
    const file=path.resolve(root,name);
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  } catch {res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log('Campus Reef preview: http://127.0.0.1:'+port));
