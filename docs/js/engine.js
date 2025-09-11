// engine.js — main loop, timing, world container
import { Player } from './player.js';
import { Enemy, ShieldCop } from './enemy.js';
import { Level } from './level.js';
import { UI } from './ui.js';
import { playHit, playKO, playChant, playDash, playSwing } from './audio.js';

export class Game {
  constructor(canvas, hud, overlays){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hud = new UI(hud);
    this.overlays = overlays;

    this.running = false;
    this.paused = false;
    this.last = 0; this.acc = 0;
    this.dt = 1/60;
    this.fpsSamp = 0; this.fpsFrames = 0;

    this.level = new Level(canvas.width, canvas.height);
    this.player = new Player(80, this.level.groundY-32);

    this.entities = [];
    this.pickups = [];
    this.wave = 0;
    this.score = 0;

    this.rebel = 0;        // 0..1
    this.rebelActive = 0;  // seconds left

    this.bindOverlays();
    this.toTitle();
  }

  bindOverlays(){
    const o = this.overlays;
    o.startBtn.onclick = () => this.startGame();
    o.controlsBtn.onclick = () => this.showOverlay('controls', true);
    o.goBtn.onclick = () => this.hideOverlay('stageIntro');
    o.resumeBtn.onclick = () => this.togglePause(false);
    o.resetBtn.onclick = () => this.resetToStage();
    o.backToTitle.onclick = () => this.toTitle();
    o.controls.querySelector('[data-close]').onclick = () => this.showOverlay('controls', false);

    window.addEventListener('keydown', (e)=>{
      if(e.key.toLowerCase() === 'p' && this.running) this.togglePause(!this.paused);
    });
  }

  toTitle(){
    this.running = false;
    this.showOverlay('title', true);
    this.hideOverlay('pause'); this.hideOverlay('results'); this.hideOverlay('controls');
    this.renderTitle();
  }

  startGame(){
    // reset state
    this.entities.length = 0; this.pickups.length = 0; this.wave = 0; this.score = 0;
    this.player.reset(80, this.level.groundY-32);
    this.rebel = 0; this.rebelActive = 0;
    this.showOverlay('title', false);
    this.showOverlay('stageIntro', true);
    // small delay before loop begins (press Go)
    if(!this.running){ this.running = true; this.loop(performance.now()); }
  }

  resetToStage(){
    this.hideOverlay('pause');
    this.entities.length = 0; this.pickups.length = 0;
    this.player.reset(80, this.level.groundY-32);
    this.rebelActive = 0;
  }

  togglePause(v){
    this.paused = v;
    this.showOverlay('pause', v);
  }

  showOverlay(name, show=true){
    const el = this.overlays[name];
    if(!el) return;
    el.classList.toggle('visible', show);
  }
  hideOverlay(name){ this.showOverlay(name, false); }

  loop(t){
    if(!this.running) return;
    const dtm = Math.min(0.25, (t - this.last)/1000 || 0); // clamp
    this.last = t; this.acc += dtm;
    // fps sampling
    this.fpsSamp += dtm; this.fpsFrames++;
    if(this.fpsSamp >= 0.5){ this.hud.setFPS(Math.round(this.fpsFrames/this.fpsSamp)); this.fpsSamp=0; this.fpsFrames=0; }

    while(this.acc >= this.dt){
      if(!this.paused) this.update(this.dt);
      this.acc -= this.dt;
    }
    this.draw();
    requestAnimationFrame((tt)=>this.loop(tt));
  }

  update(dt){
    // spawn logic
    if(this.entities.length < 5){
      if(Math.random() < 0.02 + this.wave*0.002){
        const side = Math.random()<0.5? -24 : this.canvas.width+24;
        const y = this.level.groundY-30;
        const type = (Math.random() < Math.min(0.2+this.wave*0.02, 0.65)) ? 'shield' : 'thug';
        if(type==='shield') this.entities.push(new ShieldCop(side, y));
        else this.entities.push(new Enemy(side, y));
      }
    }
    // increase difficulty slowly
    this.wave += dt*0.2;

    // update player & enemies
    this.player.update(dt, this);
    for(const e of this.entities) e.update(dt, this);
    // cull dead/outside
    this.entities = this.entities.filter(e=>!e.dead && e.x>-60 && e.x<this.canvas.width+60);

    // rebel drain
    if(this.rebelActive>0){ this.rebelActive -= dt; if(this.rebelActive<=0) this.rebelActive=0; }
    else this.rebel = Math.min(1, this.rebel + dt*0.05); // slow build when not active

    // UI
    this.hud.setHP(this.player.hp/this.player.maxHP);
    this.hud.setRebel(this.rebel, this.rebelActive>0);
    this.hud.setWave(Math.floor(this.wave));
    this.hud.setScore(this.score);
  }

  draw(){
    const ctx = this.ctx;
    const w = this.canvas.width, h = this.canvas.height;
    // bg
    ctx.fillStyle = '#111'; ctx.fillRect(0,0,w,h);
    // alley stripes
    ctx.fillStyle = '#1c1c1c';
    for(let i=0;i<10;i++){ ctx.fillRect(i*96, h-80, 60, 4); }
    // ground
    ctx.fillStyle = '#262626'; ctx.fillRect(0, this.level.groundY, w, h-this.level.groundY);

    // entities
    for(const e of this.entities) e.draw(ctx);
    this.player.draw(ctx, this.rebelActive>0);

    // rebel flash
    if(this.rebelActive>0){
      const p = (Math.sin(performance.now()*0.02)+1)/2;
      ctx.fillStyle = `rgba(255,0,90,${0.08+0.08*p})`;
      ctx.fillRect(0,0,w,h);
    }
  }

  // combat helpers
  dealDamage(target, dmg, knock=0){
    target.hp -= dmg;
    if(target.hp <= 0){ target.dead = true; this.score += 100; playKO(); this.hud.hitstop(90); }
    else { this.hud.hitstop(60); }
    if(knock) target.vx += knock;
  }

  triggerRebel(seconds=4){
    if(this.rebelActive>0) return;
    if(this.rebel < 1) return;
    this.rebel = 0;
    this.rebelActive = seconds;
    playChant();
  }
}
