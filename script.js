"use strict";
const $=s=>document.querySelector(s);
const Z=s=>s.split(",").map(x=>{const[a,b]=x.split(":");return{w:a,z:b||""}});
const STAGES=[
{id:0,n:"新手村",t:"基本指法 ASDF JKL;",hp:10,sp:34,gap:2400,w:Z("ask:問,sad:難過的,dad:爸爸,fall:秋天;落下,flask:燒瓶,lass:少女,salad:沙拉,all:全部,add:加,lads:小伙子,flaks:砲火,alas:唉")},
{id:1,n:"上排山谷",t:"加入 QWERTYUIOP",hp:12,sp:38,gap:2200,w:Z("type:打字,write:寫,power:力量,tree:樹,quiet:安靜,route:路線,pretty:漂亮,your:你的,they:他們,photo:照片,true:真的,quote:引用")},
{id:2,n:"下排礦坑",t:"加入 ZXCVBNM",hp:12,sp:40,gap:2100,w:Z("zoom:縮放,next:下一個,move:移動,brain:大腦,cabin:小屋,number:數字,class:班級,black:黑色,voice:聲音,combine:結合,exam:考試,bank:銀行")},
{id:3,n:"校園廣場",t:"國中小核心單字",hp:14,sp:42,gap:2000,w:Z("apple:蘋果,school:學校,friend:朋友,water:水,family:家庭,happy:快樂的,teacher:老師,window:窗戶,market:市場,library:圖書館,breakfast:早餐,weather:天氣,mountain:山,holiday:假期")},
{id:4,n:"商務大樓",t:"職場必備單字",hp:14,sp:46,gap:1900,w:Z("meeting:會議,deadline:截止日,project:專案,report:報告,budget:預算,client:客戶,manager:經理,schedule:時程,invoice:發票,email:電子郵件,contract:合約,proposal:提案,feedback:回饋,priority:優先")},
{id:5,n:"未來賽博都市",boss:1,t:"最終魔王：長句輸入",hp:3,time:70,s:["Hackers type fast and never look at the keys.","A strong password keeps the virus out of the city.","Practice every day and your fingers will fly."]}
];
const ZONES=[
{g:["#d6ecd9","#a3d1ab"],c:"#6fe08f"},
{g:["#d8e6f6","#a9c7e8"],c:"#8ec5ff"},
{g:["#ebd9c6","#cdac8b"],c:"#e0a36a"},
{g:["#d2f0f1","#a3dcdf"],c:"#7fe3e8"},
{g:["#e0e3ee","#b9bfd6"],c:"#b7c0e6"},
{g:["#ecd0f4","#cca0e4"],c:"#ff3d9a"},
{g:["#ffd6e8","#e4b4f2"],c:"#ff3d9a"}];
const SOUNDS=[["柔和 (Lv1)",1],["雷射 (Lv2)",2],["機械 (Lv3)",3],["電子琴 (Lv5)",5]];
const THEMES=[["電光青 (Lv1)",1,"#3df0ff"],["霓虹粉 (Lv2)",2,"#ff3d9a"],["琥珀金 (Lv4)",4,"#ffc23d"],["病毒紫 (Lv6)",6,"#b58cff"]];
const BADGES=[["閃電手指","單場 WPM 達 30","指尖閃電"],["零失誤大師","正確率 100% 通關","完美編譯者"],["連續登入 7 天","連續登入 7 天","不眠守護者"],["魔王殺手","擊敗未來賽博都市魔王","賽博終結者"],["弱點克服","完成錯題特訓","補丁工程師"],["疾風之手","單場 WPM 達 50","疾風駭客"],["連擊達人","單場連擊 50","連鎖反應"],["滿星收藏家","前五關全部三星","星光收藏家"],["單字獵人","累計擊破 200 個單字","詞彙獵人"],["初次入侵","第一次通關","見習駭客"],["連續登入 3 天","連續登入 3 天","常駐駭客"]];
const AVS=[["🧑‍💻","新手",1],["🦊","狐面客",2],["🤖","機械體",3],["👾","像素魔",5],["🐉","賽博龍",7]];
const BGS=[["暗黑格線","grid",1],["數據雨","rain",3],["霓虹脈衝","pulse",5],["掃描光束","scan",7]];
function check(win,wpm,acc){const nw=[],B=(i,c)=>{if(c&&!S.badges[i]){S.badges[i]=1;nw.push(BADGES[i][0])}};
 if(win){B(0,wpm>=30);B(5,wpm>=50);B(1,acc===100&&G.hits>10);B(3,!!G.st.boss);B(4,G.i===-1);B(9,true)}
 B(6,G.best>=50);B(7,[0,1,2,3,4].every(i=>S.stars[i]===3));B(8,(S.words||0)>=200);B(10,S.streak>=3);B(2,S.streak>=7);return nw}
const ROWS=["qwertyuiop","asdfghjkl;","zxcvbnm,."];
const FING={};
[["q a z","左小指"],["w s x","左無名指"],["e d c","左中指"],["r f v t g b","左食指"],["y h n u j m","右食指"],["i k ,","右中指"],["o l .","右無名指"],["p ; ","右小指"]].forEach(([k,n])=>k.trim().split(" ").forEach(c=>FING[c]=n));
const FC={"小指":"var(--f-pinky)","無名指":"var(--f-ring)","中指":"var(--f-mid)","食指":"var(--f-idx)"};
const fcol=k=>k===" "?"var(--f-th)":FC[(FING[k]||"").slice(1)]||"var(--f-th)";

let S={xp:0,stars:{},errs:{},badges:{},av:0,bg:0,title:-1,words:0,streak:0,last:"",daily:"",snd:1,thm:0};
try{Object.assign(S,JSON.parse(localStorage.getItem("tq")||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem("tq",JSON.stringify(S))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
const lvOf=xp=>Math.floor(Math.sqrt(xp/60))+1;
const lvBase=l=>(l-1)**2*60;

/* login streak */
(function(){const t=today();if(S.last!==t){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.streak=S.last===y?S.streak+1:1;S.last=t;if(S.streak>=7)S.badges[2]=1;if(S.streak>=3)S.badges[10]=1;save()}})();

/* audio */
let ac;
function beep(f,d,type){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.value=.05;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function sfx(kind){const m=S.snd;
 if(kind==="ok")return m===1?beep(520,.06,"sine"):m===2?beep(900,.1,"sawtooth"):m===3?beep(180,.04,"square"):beep(440+Math.random()*300,.12,"triangle");
 if(kind==="bad")return beep(110,.15,"square");
 if(kind==="kill"){beep(700,.1,"triangle");setTimeout(()=>beep(1000,.15,"triangle"),80)}}

/* menu */
function unlockedUpTo(){let u=0;STAGES.forEach((s,i)=>{if(S.stars[i]&&i<STAGES.length-1)u=i+1});return u}
function weakList(){return Object.entries(S.errs).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,4).map(e=>e[0])}
function renderMenu(){document.body.classList.add("mapbg");
 const l=lvOf(S.xp),a=lvBase(l),b=lvBase(l+1);
 $("#lv").innerHTML=AVS[S.av][0]+" Lv."+l+` <span id="me">${S.title>=0&&S.badges[S.title]?"「"+BADGES[S.title][2]+"」":"「新手駭客」"}</span>`;$("#xpb").style.width=(S.xp-a)/(b-a)*100+"%";$("#xpt").textContent=S.xp+" / "+b+" XP　連續登入 "+S.streak+" 天";
 const u=unlockedUpTo(),m=$("#map");m.innerHTML="";
 STAGES.forEach((s,i)=>{const e=document.createElement("button");e.className="st"+(s.boss?" boss":"")+(i===u&&!S.stars[i]?" cur":"");e.disabled=i>u;
  const st=S.stars[i]||0;
  e.innerHTML=`<h3 class="d">${i>u?"🔒 ":i===u&&!S.stars[i]?"▶ ":""}${s.n}</h3><small>${s.t}</small><span class="stars">${"★".repeat(st)}${"☆".repeat(3-st)}</span>`;
  e.onclick=()=>start(i);e.style.borderLeft="4px solid "+ZONES[i].c;
  const z=document.createElement("div");z.className="zn";z.appendChild(e);m.appendChild(z)});

 const w=weakList(),d=document.createElement("button");d.className="st";d.disabled=!w.length;
 d.innerHTML=`<h3 class="d">🎯 錯題特訓</h3><small>${w.length?"弱點鍵："+w.join(" ").toUpperCase():"尚無錯誤紀錄，先去闖關吧"}</small>`;d.onclick=()=>start(-1);$("#drillw").innerHTML="";$("#drillw").appendChild(d);
 const di=S.daily===today(),dsi=Math.min(u,new Date().getDate()%Math.max(1,Math.min(u,4)+1));
 $("#dtxt").textContent=di?"今日任務已完成，明天再來！":`挑戰「${STAGES[dsi].n}」，完成可獲得雙倍經驗值`;
 $("#dbtn").disabled=di;$("#dbtn").onclick=()=>start(dsi,true);
 $("#bds").innerHTML=BADGES.map((x,i)=>`<span class="bd${S.badges[i]?" on":""}" title="${x[1]}">${S.badges[i]?"🏅":"▫"} ${x[0]}<small style="margin-left:4px">${x[1]}</small></span>`).join("");
 $("#sndS").innerHTML=SOUNDS.map((x,i)=>`<option value="${i}" ${l<x[1]?"disabled":""}>${x[0]}</option>`).join("");$("#sndS").value=S.snd-1<0?0:SOUNDS.findIndex(x=>x[1]===S.snd);
 $("#thmS").innerHTML=THEMES.map((x,i)=>`<option value="${i}" ${l<x[1]?"disabled":""}>${x[0]}</option>`).join("");$("#thmS").value=S.thm;
 $("#avS").innerHTML=AVS.map((x,i)=>`<option value="${i}" ${l<x[2]?"disabled":""}>${x[0]} ${x[1]} (Lv${x[2]})</option>`).join("");$("#avS").value=S.av;
 $("#bgS").innerHTML=BGS.map((x,i)=>`<option value="${i}" ${l<x[2]?"disabled":""}>${x[0]} (Lv${x[2]})</option>`).join("");$("#bgS").value=S.bg;
 $("#ttS").innerHTML='<option value="-1">新手駭客</option>'+BADGES.map((x,i)=>S.badges[i]?`<option value="${i}">${x[2]}</option>`:"").join("");$("#ttS").value=S.title;
 $("#field").dataset.bg=BGS[S.bg][1];
 document.documentElement.style.setProperty("--ac",THEMES[S.thm][2]);
}
$("#sndS").onchange=e=>{S.snd=SOUNDS[e.target.value][1];save()};
$("#avS").onchange=e=>{S.av=+e.target.value;save();renderMenu()};
$("#bgS").onchange=e=>{S.bg=+e.target.value;save();renderMenu()};
$("#ttS").onchange=e=>{S.title=+e.target.value;save();renderMenu()};
$("#thmS").onchange=e=>{S.thm=+e.target.value;save();renderMenu()};

/* keyboard */
function buildKB(){const kb=$("#kb");kb.innerHTML="";
 ROWS.forEach((r,i)=>{const d=document.createElement("div");d.className="row";d.style.marginLeft=i*14+"px";
  [...r].forEach(c=>{const k=document.createElement("div");k.className="k";k.id="k-"+kn(c);k.style.setProperty("--kc",fcol(c));k.textContent=c;d.appendChild(k)});kb.appendChild(d)});
 const d=document.createElement("div");d.className="row";d.innerHTML='<div class="k sp" id="k-sp" style="--kc:var(--f-th)">space</div>';kb.appendChild(d)}
const kn=c=>c===" "?"sp":c===";"?"semi":c==="."?"dot":c===","?"comma":c;
const kid=c=>"#k-"+kn(c);
const FCOL={p:"var(--f-pinky)",r:"var(--f-ring)",m:"var(--f-mid)",i:"var(--f-idx)",t:"var(--f-th)"};
const HD={L:{pc:200,home:[128,176,224,272],th:[318,238],tb:[266,345],keys:["qaz","wsx","edc","rfvtgb"],c:"prmit",s:1},
 R:{pc:488,home:[560,512,464,416],th:[370,238],tb:[422,345],keys:["p;","ol.","ik,","yhnujm"],c:"prmit",s:-1}};
const BY=272,HT=[174,146,136,146],FW=[30,35,37,35,38],HW=34,HO=3;
let H=null;
const restTips=o=>[...o.home.map((x,i)=>({x,y:HT[i]})),{x:o.th[0],y:o.th[1]}];
function who(c){if(c===" ")return["R",4];for(const h in HD){const i=HD[h].keys.findIndex(q=>q.includes(c));if(i>=0)return[h,i]}return[]}
function keyPx(c){const e=document.getElementById("k-"+kn(c));if(!e)return null;const kr=$("#kb").getBoundingClientRect(),r=e.getBoundingClientRect();return{x:r.left-kr.left+r.width/2,y:r.top-kr.top+r.height/2}}
function buildHands(){const kb=$("#kb");if(H)cancelAnimationFrame(H.raf);
 const ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");svg.id="hands";svg.setAttribute("aria-hidden","true");
 const root=document.createElementNS(ns,"g");svg.appendChild(root);
 const mk=(t,a,p)=>{const e=document.createElementNS(ns,t);for(const k in a)e.setAttribute(k,a[k]);(p||root).appendChild(e);return e};
 H={o:{},root,k:null,tgt:null,fast:matchMedia("(prefers-reduced-motion:reduce)").matches};
 for(const h in HD){const o=H.o[h]=Object.assign({},HD[h]);
  o.b=o.home.map(x=>[x+(o.pc-x)*.1,BY]);o.b.push(o.tb);
  const b=o.b,pts=[b[0],b[1],b[2],b[3],[b[3][0],520],[b[0][0],520]].map(q=>q.join(",")).join(" ");
  o.g=mk("g",{});const op=mk("g",{opacity:.68},o.g),LN="#bbb",FL="#3a3d44";
  const out=mk("g",{stroke:LN,"stroke-width":HW+2*HO,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},op);
  const fil=mk("g",{stroke:FL,"stroke-width":HW,"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},op);
  mk("polygon",{points:pts,fill:LN},out);mk("polygon",{points:pts,fill:FL},fil);
  o.fo=[];o.ff=[];for(let i=0;i<5;i++){o.fo.push(mk("path",{"stroke-width":FW[i]+2*HO},out));o.ff.push(mk("path",{"stroke-width":FW[i]},fil))}
  o.dot=mk("circle",{r:11,opacity:0},o.g);
  o.off={x:0,y:0};o.offT={x:0,y:0};o.rot=0;o.rotT=0;o.tip=restTips(o);o.tipT=restTips(o);o.act=-1;o.fl=0}
 svg.style.overflow="hidden";kb.appendChild(svg);layout();
 const lp=(a,b)=>a+(b-a)*(H.fast?1:.2);
 const loop=()=>{if($("#game").classList.contains("hide"))return;const now=performance.now();
  for(const h in H.o){const o=H.o[h];o.off.x=lp(o.off.x,o.offT.x);o.off.y=lp(o.off.y,o.offT.y);o.rot=lp(o.rot,o.rotT);
   o.tip.forEach((t,i)=>{t.x=lp(t.x,o.tipT[i].x);t.y=lp(t.y,o.tipT[i].y)});
   o.g.setAttribute("transform",`translate(${o.off.x},${o.off.y}) rotate(${o.rot},${o.pc},400)`);
   for(let i=0;i<5;i++){const[bx,by]=o.b[i],t=o.tip[i],dx=t.x-bx,dy=t.y-by,L=Math.hypot(dx,dy)||1,px=-dy/L*o.s,py=dx/L*o.s,a=L*.07;
    const d=`M${bx},${by} C${bx+dx*.3+px*a},${by+dy*.3+py*a} ${bx+dx*.68-px*a*.9},${by+dy*.68-py*a*.9} ${t.x},${t.y}`;o.fo[i].setAttribute("d",d);o.ff[i].setAttribute("d",d)}
   if(o.act>=0){o.dot.setAttribute("cx",o.tip[o.act].x);o.dot.setAttribute("cy",o.tip[o.act].y);o.dot.setAttribute("opacity",.85);o.dot.style.fill=now<o.fl?"#fff":FCOL[o.c[o.act]]}else o.dot.setAttribute("opacity",0)}
  H.raf=requestAnimationFrame(loop)};
 H.raf=requestAnimationFrame(loop)}
function layout(){if(!H)return;const a=keyPx("a"),b=keyPx("s"),q=keyPx("q"),z=keyPx("z");if(!a||!b||!q||!z)return;
 const sx=(b.x-a.x)/48||1,sy=(z.y-q.y)/96||1,tx=a.x-128*sx,ty=a.y-140*sy;
 H.root.setAttribute("transform",`matrix(${sx} 0 0 ${sy} ${tx} ${ty})`);H.k={sx,sy,tx,ty};aimHands(H.tgt)}
function aimHands(c){if(!H||!H.k)return;
 for(const h in H.o){const o=H.o[h];o.act=-1;o.offT={x:0,y:0};o.rotT=0;o.tipT=restTips(o)}
 if(!c)return;const[hh,fi]=who(c),p=keyPx(c);if(!hh||!p)return;
 const k=H.k,kx=(p.x-k.tx)/k.sx,ky=(p.y-k.ty)/k.sy,o=H.o[hh];
 const hx=fi<4?o.home[fi]:o.th[0],hy=fi<4?HT[fi]:o.th[1],dx=kx-hx,dy=ky-hy;
 o.offT={x:dx*.5,y:dy*.75};o.rotT=Math.max(-7,Math.min(7,dx/30));
 const r=o.rotT*Math.PI/180,ax=kx-o.offT.x-o.pc,ay=ky-o.offT.y-400;
 o.tipT[fi]={x:o.pc+ax*Math.cos(r)+ay*Math.sin(r),y:400-ax*Math.sin(r)+ay*Math.cos(r)};
 o.tipT.forEach((t,i)=>{if(i!==fi&&i<4){t.x+=(kx-o.home[i])*.08;t.y+=dy*.1}});o.act=fi}
addEventListener("resize",layout);
function hintKey(c){if(H){H.tgt=c?c.toLowerCase():null;aimHands(H.tgt)}
 document.querySelectorAll(".k.on").forEach(k=>k.classList.remove("on"));
 if(!c){$("#hint").innerHTML="先看見單字，再用手指找鍵";return}
 const k=document.getElementById("k-"+kn(c.toLowerCase()));if(k)k.classList.add("on");
 $("#hint").innerHTML=c===" "?"用 <b>大拇指</b> 按空白鍵":`下一個鍵：<b>${c.toUpperCase()}</b>　用 <b>${FING[c.toLowerCase()]||""}</b>`}

/* game */
let G=null,raf=0;
function start(i,daily){
 let st;
 if(i===-1){const w=weakList(),all=STAGES.slice(0,5).flatMap(s=>s.w).filter(x=>w.some(k=>x.w.includes(k)));
  st={id:-1,n:"錯題特訓",hp:10,sp:36,gap:2200,w:all.length?all:STAGES[0].w}}
 else st=STAGES[i];
 G={st,daily,i,hp:st.hp,life:5,hits:0,miss:0,cmb:0,best:0,t0:0,active:null,ws:[],last:0,spawn:0,over:false,sidx:0,wd:0,pos:0,time:st.time||0};
 document.body.classList.remove("mapbg");$("#menu").classList.add("hide");$("#game").classList.remove("hide");$("#res").classList.add("hide");
 $("#gname").textContent=AVS[S.av][0]+" "+st.n;buildKB();if(H){cancelAnimationFrame(H.raf);H=null}
 const nk=st.id===5,nh=st.id===3||st.id===4||nk;
 $("#kb").classList.toggle("hide",nk);$("#hint").classList.toggle("hide",nk);
 if(!nh)buildHands();
 const f=$("#field");f.querySelectorAll(".w").forEach(n=>n.remove());
 $("#sent").classList.toggle("hide",!st.boss);
 if(st.boss){G.total=st.s.length;renderSent()}
 const zi=Math.max(0,st.id),zs=(q,z)=>{const e=$(q);e.style.background=`linear-gradient(180deg,${z.g[0]},${z.g[1]})`;e.innerHTML=""};
 zs("#scA",ZONES[zi]);zs("#scB",ZONES[Math.min(6,zi+1)]);$("#scB").style.opacity=0;
 const sa=$("#scA");sa.classList.remove("fi");void sa.offsetWidth;sa.classList.add("fi");
 hintKey(st.boss?st.s[0][0]:null);upd();
 cancelAnimationFrame(raf);G.last=performance.now();raf=requestAnimationFrame(loop)}
function renderSent(){const s=G.st.s[G.sidx],p=G.pos;
 $("#sent").innerHTML=`<div><span class="dn">${esc(s.slice(0,p))}</span><span class="nx">${esc(s[p]===" "?"␣":s[p]||"")}</span>${esc(s.slice(p+1))}</div>`}
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
function spawn(){const st=G.st,e=st.w[Math.random()*st.w.length|0],f=$("#field");
 if(G.ws.some(w=>w.w===e.w))return;
 const n=document.createElement("div");n.className="w";n.innerHTML=`<span></span>${e.z&&G.st.id>=3?`<small>${e.z}</small>`:""}`;
 f.appendChild(n);const x=Math.max(70+e.w.length*6,Math.min(f.clientWidth-70-e.w.length*6,Math.random()*f.clientWidth));
 const o={w:e.w,el:n,x,y:-30,i:0};n.style.left=x+"px";G.ws.push(o);paint(o)}
function paint(o){o.el.firstChild.innerHTML=`<span class="dn">${o.w.slice(0,o.i)}</span>${o.i<o.w.length?`<span class="${G.active===o?"nx":""}">${o.w[o.i]}</span>${o.w.slice(o.i+1)}`:""}`;o.el.style.top=o.y+"px"}
function loop(t){if(!G||G.over)return;const dt=Math.min(.05,(t-G.last)/1000);G.last=t;
 if(!G.t0&&G.hits+G.miss>0)G.t0=t;
 if(G.st.boss){if(G.t0){G.time-=dt;if(G.time<=0)return end(false)}}
 else{G.spawn-=dt*1000;if(G.spawn<=0&&G.hp>G.ws.length){spawn();G.spawn=G.st.gap}
  const h=$("#field").clientHeight;
  for(const o of [...G.ws]){o.y+=G.st.sp*dt;o.el.style.top=o.y+"px";
   if(o.y>h-36){kill(o,false);G.life--;G.cmb=0;sfx("bad");const f=$("#field");f.classList.remove("hurt");void f.offsetWidth;f.classList.add("hurt");if(G.life<=0)return end(false)}}}
 upd();aim();raf=requestAnimationFrame(loop)}
function aim(){if(G.st.boss||G.active)return;const o=[...G.ws].sort((a,b)=>b.y-a.y)[0],c=o?o.w[0]:null;if(c!==G.aimc){G.aimc=c;hintKey(c)}}
function kill(o,hit){G.aimc=undefined;G.ws=G.ws.filter(x=>x!==o);if(G.active===o){G.active=null;hintKey(null)}
 if(hit){G.wd++;o.el.classList.add("zap");setTimeout(()=>o.el.remove(),250)}else o.el.remove()}
function upd(){const el=G.t0?(performance.now()-G.t0)/60000:0,acc=G.hits+G.miss?Math.round(G.hits/(G.hits+G.miss)*100):100;
 G.wpm=el>.01?Math.round(G.hits/5/el):0;G.acc=acc;
 $("#wpm").firstChild.nodeValue=G.wpm;$("#acc").firstChild.nodeValue=acc;$("#cmb").firstChild.nodeValue=G.cmb;
 const tot=G.st.boss?G.total:G.st.hp,left=G.st.boss?G.total-G.sidx:G.hp;
 $("#ehp").style.width=left/tot*100+"%";$("#scB").style.opacity=((1-left/tot)*.9).toFixed(2);
 $("#php").textContent=G.st.boss?"":"防火牆 "+"♥".repeat(Math.max(0,G.life));
 $("#tmr").textContent=G.st.boss?"剩餘 "+Math.ceil(G.time)+" 秒":"敵方剩餘 "+G.hp}
function press(c){if(H){const[h]=who(c);if(h)H.o[h].fl=performance.now()+110}
 const kEl=document.getElementById("k-"+kn(c));if(kEl){kEl.classList.add("press");setTimeout(()=>kEl.classList.remove("press"),90)}}
function wrong(exp){G.miss++;G.cmb=0;S.errs[exp]=(S.errs[exp]||0)+1;sfx("bad")}
document.addEventListener("keydown",e=>{
 if(!G||G.over||$("#game").classList.contains("hide")||e.ctrlKey||e.metaKey||e.altKey)return;
 const c=e.key.length===1?e.key.toLowerCase():"";if(!c)return;
 if(c===" ")e.preventDefault();
 press(c);
 if(!G.t0)G.t0=performance.now();
 if(G.st.boss){const s=G.st.s[G.sidx],ex=s[G.pos];
  if(c===ex.toLowerCase()){G.hits++;G.cmb++;G.best=Math.max(G.best,G.cmb);sfx("ok");G.pos++;
   if(G.pos>=s.length){G.sidx++;G.pos=0;sfx("kill");if(G.sidx>=G.total)return end(true)}}
  else wrong(ex.toLowerCase());
  renderSent();hintKey(G.st.s[G.sidx][G.pos]);upd();return}
 if(!G.active){const cand=G.ws.filter(o=>o.w[0]===c).sort((a,b)=>b.y-a.y)[0];
  if(cand){G.active=cand;}
  else{const near=G.ws.sort((a,b)=>b.y-a.y)[0];if(near)wrong(near.w[0]);else G.miss++;return}
  document.querySelectorAll(".w.act").forEach(n=>n.classList.remove("act"));G.active.el.classList.add("act")}
 const o=G.active,ex=o.w[o.i];
 if(c===ex){G.hits++;G.cmb++;G.best=Math.max(G.best,G.cmb);sfx("ok");o.i++;
  if(o.i>=o.w.length){kill(o,true);G.hp--;sfx("kill");if(G.hp<=0)return end(true);}
  else hintKey(o.w[o.i]);paint(o)}
 else{wrong(ex);paint(o)}
 if(G.active)hintKey(G.active.w[G.active.i]);
 upd()});
$("#quit").onclick=()=>{if(G)G.over=true;cancelAnimationFrame(raf);G=null;back()};
function back(){$("#game").classList.add("hide");$("#res").classList.add("hide");$("#menu").classList.remove("hide");renderMenu()}

function end(win){G.over=true;upd();const acc=G.acc,wpm=G.wpm;let loot=0,stars=0,msgs=[];
 if(win){stars=acc>=95?3:acc>=85?2:1;loot=Math.round((30+wpm*2+G.best)*(1+stars*.25));
  if(G.daily){loot*=2;S.daily=today();msgs.push("今日任務完成：經驗值加倍！")}
  if(G.i>=0)S.stars[G.i]=Math.max(S.stars[G.i]||0,stars);
  S.words=(S.words||0)+G.wd;if(G.i===-1)Object.keys(S.errs).forEach(k=>S.errs[k]=Math.max(0,S.errs[k]-2));
  }
 else loot=Math.round(G.hits/4);
 const nw=check(win,wpm,acc);nw.forEach(n=>msgs.push("🏅 新徽章：「"+n+"」，可在主畫面裝備頭銜"));
 const l0=lvOf(S.xp);S.xp+=loot;const l1=lvOf(S.xp);if(l1>l0)msgs.push(`升級到 Lv.${l1}！可至主畫面查看新裝備`);
 save();sfx(win?"kill":"bad");
 const nx=win&&G.i>=0&&G.i<STAGES.length-1;
 $("#rbox").innerHTML=`<h2 class="d">${win?(G.st.boss?"魔王已被擊敗！":"入侵已擊退"):(G.st.boss?"時間到，防線失守":"防火牆被攻破")}</h2>
 <div class="stars" style="font-size:28px">${"★".repeat(stars)}${"☆".repeat(3-stars)}</div>
 <div class="rg"><div><b>${wpm}</b><small>WPM</small></div><div><b>${acc}%</b><small>正確率</small></div><div><b>${G.best}</b><small>最高連擊</small></div></div>
 <p>戰利品：+${loot} XP</p>${msgs.map(m=>`<p style="color:var(--am)">${m}</p>`).join("")}
 ${!win?"<p>再試一次：先看清楚單字，再慢慢敲，正確率比速度重要。</p>":""}
 <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap">${nx?`<button class="btn" id="next">下一關：${STAGES[G.i+1].n}</button>`:""}<button class="btn${nx?" g":""}" id="again">再玩一次</button><button class="btn g" id="home">回主畫面</button></div>`;
 $("#res").classList.remove("hide");const i=G.i,d=G.daily;
 $("#again").onclick=()=>start(i,false);if($("#next"))$("#next").onclick=()=>start(i+1,false);$("#home").onclick=()=>{G=null;back()}}
renderMenu();
