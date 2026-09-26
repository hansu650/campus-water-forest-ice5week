'use strict';
// Original campus-game logic. No Reefy source or assets are included.
const PondCore = (() => {
  const initialTiles = [1,0,2,3,5,4,8,7,6];
  const shapes = ['c','c','c','s','c','s','c','s','s'];
  const fresh = () => ({version:5,lang:'en',started:false,food:3,feeds:0,collected:false,photoWon:false,waterWon:false,gift:false,certificate:false,muted:false,keeper:'Qin Tian',partners:'',name:'Xiaoman',fishType:'clown',fishSize:'normal',fishWear:'none',petChosen:false,tiles:[...initialTiles],moves:0,rot:[1,1,0,0,2,1,2,0,1],photo:'aerial'});
  function sanitize(raw) {
    const s=fresh(); if (!raw || typeof raw!=='object') return s;
    for (const key of ['started','collected','photoWon','waterWon','gift','certificate','muted','petChosen']) if (typeof raw[key]==='boolean') s[key]=raw[key];
    for (const key of ['food','feeds','moves']) if (Number.isSafeInteger(raw[key])&&raw[key]>=0&&raw[key]<=100000) s[key]=raw[key];
    for (const [key,values] of Object.entries({lang:['zh','en'],fishType:['clown','gold','blue'],fishSize:['small','normal','large'],fishWear:['none','sailor','scarf'],photo:['aerial','walkway']})) if(values.includes(raw[key])) s[key]=raw[key];
    for (const [key,length] of [['keeper',12],['partners',80],['name',8]]) if(typeof raw[key]==='string'&&raw[key].trim()) s[key]=raw[key].trim().slice(0,length);
    if(raw.fishWear==='bow') s.fishWear='sailor';
    if(Array.isArray(raw.tiles)&&raw.tiles.length===9&&new Set(raw.tiles).size===9&&raw.tiles.every(x=>Number.isInteger(x)&&x>=0&&x<9)) s.tiles=[...raw.tiles];
    if(Array.isArray(raw.rot)&&raw.rot.length===9&&raw.rot.every(x=>Number.isInteger(x)&&x>=0&&x<4)) s.rot=[...raw.rot];
    s.partners=normalizePartners(s.partners,s.keeper); return s;
  }
  const normalizePartners = (names,keeper) => [...new Set(String(names).split(/[，,、;；\n]+/).map(x=>x.trim().slice(0,12)).filter(x=>x&&x!==keeper))].slice(0,5).join('、');
  const points = s => s.collected?100:80;
  const level = s => Math.floor((40+s.feeds*20)/100)+1;
  const xp = s => (40+s.feeds*20)%100;
  function feed(s) {if(s.food<=0)return false;s.food--;s.feeds++;return true;}
  function collect(s) {if(s.collected)return false;s.collected=true;return true;}
  function claimFood(s) {if(s.gift)return false;s.gift=true;s.food+=2;return true;}
  function award(s,kind) {const key=kind==='photo'?'photoWon':'waterWon';if(s[key])return false;s[key]=true;s.food+=2;return true;}
  const ports = (s,i) => (shapes[i]==='s'?[0,2]:[0,1]).map(n=>(n+s.rot[i])%4);
  function trace(s) {let i=3,entry=3;const seen=[];while(!seen.includes(i)){const ends=ports(s,i);if(!ends.includes(entry))return{ok:false,seen};seen.push(i);const out=ends.find(x=>x!==entry);if(i===8&&out===2)return{ok:true,seen};const r=Math.floor(i/3)+[-1,0,1,0][out],c=i%3+[0,1,0,-1][out];if(r<0||r>2||c<0||c>2)return{ok:false,seen};i=r*3+c;entry=(out+2)%4;}return{ok:false,seen};}
  function swap(s,a,b){if(a===b||a<0||a>8||b<0||b>8)return false;[s.tiles[a],s.tiles[b]]=[s.tiles[b],s.tiles[a]];s.moves++;return s.tiles.every((v,i)=>v===i);}
  function reset(s,all){const n=fresh();n.started=true;if(!all)for(const key of ['lang','muted','keeper','partners','name','fishType','fishSize','fishWear','petChosen'])n[key]=s[key];else n.lang=s.lang;return n;}
  return{fresh,sanitize,normalizePartners,points,level,xp,feed,collect,claimFood,award,ports,trace,swap,reset};
})();
if(typeof module!=='undefined')module.exports=PondCore;
