import { Input } from "./input.js";
import { Player } from "./player.js";
import { Level } from "./level.js";
import { UI } from "./ui.js";
import { drawActor } from "./sprites.js";
import { hit, clamp, Camera } from "./engine.js";
import { Pickup, Fire } from "./items.js";
import { Scene } from "./scenes.js";
import { AudioBus } from "./audio.js";

export function boot(canvas){
  const c=canvas.getContext("2d");
  const I=new Input();
  const ui=new UI();
  const bus=new AudioBus(()=> parseFloat(ui.vol.value||"0.6"));
  const cam=new Camera();

  const W=canvas.width, H=canvas.height, G=H-64;
  let scene=Scene.MENU;

  const world = {
    W, H, G,
    rebelT:0,
    p:null, lvl:null, pickups:[], fires:[], score:0,
    pAtk(hb,dmg,kb,dir,heavy){ for(const e of world.lvl.enemies){ if(hit(hb,e.bb)){ const dead=e.hit(world.rebelT>0?Math.floor(dmg*1.7):dmg, kb, dir); cam.kick(); world.score+=dead? (e.kind==="boss"? 300:50) : 10; if(dead) world.lvl.maybeDrop(e, world.pickups); } } bus.play(heavy?"heavy":"punch"); },
    eAtk(hb,d,k,dir){ if(hit(hb, world.p.bb)){ world.p.hurt(world.rebelT>0?Math.floor(d*0.6):d, k, dir); cam.kick(); bus.play("hit"); } },
    spawnMolotov(x,y,dir){ world.fires.push( new Fire(x+dir*18,y+28) ); },
    rebel(ms){ world.rebelT=Math.max(world.rebelT,ms); bus.play("rebel"); }
  };

  function toMenu(){
    scene=Scene.MENU; ui.show(ui.title); ui.hide(ui.pause); ui.hide(ui.over);
  }
  function startRun(){
    world.p = new Player(80, G-48, G);
    world.lvl = new Level(W, G);
    world.pickups=[]; world.fires=[]; world.score=0; world.rebelT=0;
    scene=Scene.PLAY; ui.hide(ui.title); ui.hide(ui.pause); ui.hide(ui.over);
  }
  function restart(){ if(scene!==Scene.MENU){ startRun(); } }

  // UI events
  ui.btnStart.onclick=()=>{ startRun(); bus.play("uiConfirm"); };
  addEventListener("keydown",(e)=>{
    if(e.key==="p"||e.key==="P"){
      if(scene===Scene.PLAY){ scene=Scene.PAUSE; ui.show(ui.pause); }
      else if(scene===Scene.PAUSE){ scene=Scene.PLAY; ui.hide(ui.pause); }
    }
    if(e.key==="r"||e.key==="R") restart();
    if(e.key==="m"||e.key==="M") toMenu();
  });

  function update(dt){
    if(scene!==Scene.PLAY) return;

    world.p.upd(dt, I, world);
    for(const e of world.lvl.enemies) e.upd(dt, world.p, world);
    for(const p of world.pickups) p.upd(dt, world);
    for(const f of world.fires) f.upd(dt);
    world.fires=world.fires.filter(f=>f.t>0);

    // collect pickups
    world.pickups = world.pickups.filter(p=>{
      if(hit(p.bb, world.p.bb)){
        if(p.kind==="health") world.p.heal(20); else world.p.item="molotov";
        return false;
      }
      return true;
    });

    world.lvl.update(dt, world.p, world);
    if(world.rebelT>0) world.rebelT-=dt;

    // UI
    ui.setHP(world.p.hp, world.p.hpM);
    ui.setRB(world.p.reb, world.p.rebM);
    ui.setWave(world.lvl.wave);
    ui.setScore(world.score);
    ui.setItem(world.p.item);
    ui.rebelFx(world.rebelT>0);

    if(world.p.hp<=0){ scene=Scene.OVER; ui.show(ui.over); }
  }

  function draw(){
    const {ox,oy}=cam.offset(); c.save(); c.translate(ox,oy);

    // parallax wall
    c.fillStyle="#111"; c.fillRect(0,0,W,G-6);
    c.fillStyle="#0f1620"; for(let i=0;i<12;i++){ c.fillRect(40+i*72,70,48,26); c.fillRect(40+i*72,120,48,26); }
    // grime banners
    c.fillStyle="#b6ff00"; c.fillRect(60,180,140,18);
    c.fillStyle="#e63946"; c.fillRect(240,155,130,16);
    c.fillStyle="#f2a900"; c.fillRect(420,195,160,16);

    // ground
    c.fillStyle="#1a1a1a"; c.fillRect(0,G,W,H-G);
import { Input } from "./input.js";
import { Player } from "./player.js";
import { Level } from "./level.js";
import { UI } from "./ui.js";
import { drawActor } from "./sprites.js";
import { hit, clamp, Camera } from "./engine.js";
import { Pickup, Fire } from "./items.js";
import { Scene } from "./scenes.js";
import { AudioBus } from "./audio.js";

export function boot(canvas){
  const c=canvas.getContext("2d");
  const I=new Input();
  const ui=new UI();
  const bus=new AudioBus(()=> parseFloat(ui.vol.value||"0.6"));
  const cam=new Camera();

  const W=canvas.width, H=canvas.height, G=H-64;
  let scene=Scene.MENU;

  const world = {
    W, H, G,
    rebelT:0,
    p:null, lvl:null, pickups:[], fires:[], score:0,
    pAtk(hb,dmg,kb,dir,heavy){ for(const e of world.lvl.enemies){ if(hit(hb,e.bb)){ const dead=e.hit(world.rebelT>0?Math.floor(dmg*1.7):dmg, kb, dir); cam.kick(); world.score+=dead? (e.kind==="boss"? 300:50) : 10; if(dead) world.lvl.maybeDrop(e, world.pickups); } } bus.play(heavy?"heavy":"punch"); },
    eAtk(hb,d,k,dir){ if(hit(hb, world.p.bb)){ world.p.hurt(world.rebelT>0?Math.floor(d*0.6):d, k, dir); cam.kick(); bus.play("hit"); } },
    spawnMolotov(x,y,dir){ world.fires.push( new Fire(x+dir*18,y+28) ); },
    rebel(ms){ world.rebelT=Math.max(world.rebelT,ms); bus.play("rebel"); }
  };

  function toMenu(){
    scene=Scene.MENU; ui.show(ui.title); ui.hide(ui.pause); ui.hide(ui.over);
  }
  function startRun(){
    world.p = new Player(80, G-48, G);
    world.lvl = new Level(W, G);
    world.pickups=[]; world.fires=[]; world.score=0; world.rebelT=0;
    scene=Scene.PLAY; ui.hide(ui.title); ui.hide(ui.pause); ui.hide(ui.over);
  }
  function restart(){ if(scene!==Scene.MENU){ startRun(); } }

  // UI events
  ui.btnStart.onclick=()=>{ startRun(); bus.play("uiConfirm"); };
  addEventListener("keydown",(e)=>{
    if(e.key==="p"||e.key==="P"){
      if(scene===Scene.PLAY){ scene=Scene.PAUSE; ui.show(ui.pause); }
      else if(scene===Scene.PAUSE){ scene=Scene.PLAY; ui.hide(ui.pause); }
    }
    if(e.key==="r"||e.key==="R") restart();
    if(e.key==="m"||e.key==="M") toMenu();
  });

  function update(dt){
    if(scene!==Scene.PLAY) return;

    world.p.upd(dt, I, world);
    for(const e of world.lvl.enemies) e.upd(dt, world.p, world);
    for(const p of world.pickups) p.upd(dt, world);
    for(const f of world.fires) f.upd(dt);
    world.fires=world.fires.filter(f=>f.t>0);

    // collect pickups
    world.pickups = world.pickups.filter(p=>{
      if(hit(p.bb, world.p.bb)){
        if(p.kind==="health") world.p.heal(20); else world.p.item="molotov";
        return false;
      }
      return true;
    });

    world.lvl.update(dt, world.p, world);
    if(world.rebelT>0) world.rebelT-=dt;

    // UI
    ui.setHP(world.p.hp, world.p.hpM);
    ui.setRB(world.p.reb, world.p.rebM);
    ui.setWave(world.lvl.wave);
    ui.setScore(world.score);
    ui.setItem(world.p.item);
    ui.rebelFx(world.rebelT>0);

    if(world.p.hp<=0){ scene=Scene.OVER; ui.show(ui.over); }
  }

  function draw(){
    const {ox,oy}=cam.offset(); c.save(); c.translate(ox,oy);

    // parallax wall
    c.fillStyle="#111"; c.fillRect(0,0,W,G-6);
    c.fillStyle="#0f1620"; for(let i=0;i<12;i++){ c.fillRect(40+i*72,70,48,26); c.fillRect(40+i*72,120,48,26); }
    // grime banners
    c.fillStyle="#b6ff00"; c.fillRect(60,180,140,18);
    c.fillStyle="#e63946"; c.fillRect(240,155,130,16);
    c.fillStyle="#f2a900"; c.fillRect(420,195,160,16);

    // ground
    c.fillStyle="#1a1a1a"; c.fillRect(0,G,W,H-G);
    c.fillStyle="#2a2a2a"; c.fillRect(0,G-6,W,6);

    // fires
    for(const f of world.fires) f.draw(c);

    // enemies
    for(const e of world.lvl.enemies) drawActor(c, e);

    // player
    drawActor(c, world.p, world.rebelT>0);

    // attack tell box (player)
    if(world.p.cd>0){ const hb=world.p.hb; c.globalAlpha=.22; c.fillStyle=world.rebelT>0?"#b6ff00":"#ffffff"; c.fillRect(hb.x,hb.y,hb.w,hb.h); c.globalAlpha=1; }

    // grime overlay
    c.globalAlpha=.06; for(let i=0;i<40;i++){ c.fillStyle="#fff"; c.fillRect(Math.random()*W, Math.random()*H, 2, 2) } c.globalAlpha=1;

    c.restore();
  }

  let last=0, acc=0, step=1000/60;
  function loop(t){
    const dt=Math.min(50, t-last||16.666); last=t; acc+=dt;
    while(acc>=step){ update(step); acc-=step; }
    if(scene===Scene.PLAY) draw(); else draw(); // keep background visible under menus
    requestAnimationFrame(loop);
  }
  toMenu(); loop(0);
}
    c.fillStyle="#2a2a2a"; c.fillRect(0,G-6,W,6);

    // fires
    for(const f of world.fires) f.draw(c);

    // enemies
    for(const e of world.lvl.enemies) drawActor(c, e);

    // player
    drawActor(c, world.p, world.rebelT>0);

    // attack tell box (player)
    if(world.p.cd>0){ const hb=world.p.hb; c.globalAlpha=.22; c.fillStyle=world.rebelT>0?"#b6ff00":"#ffffff"; c.fillRect(hb.x,hb.y,hb.w,hb.h); c.globalAlpha=1; }

    // grime overlay
    c.globalAlpha=.06; for(let i=0;i<40;i++){ c.fillStyle="#fff"; c.fillRect(Math.random()*W, Math.random()*H, 2, 2) } c.globalAlpha=1;

    c.restore();
  }

  let last=0, acc=0, step=1000/60;
  function loop(t){
    const dt=Math.min(50, t-last||16.666); last=t; acc+=dt;
    while(acc>=step){ update(step); acc-=step; }
    if(scene===Scene.PLAY) draw(); else draw(); // keep background visible under menus
    requestAnimationFrame(loop);
  }
  toMenu(); loop(0);
}
