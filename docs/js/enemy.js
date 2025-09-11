// enemy.js — Thug and Shield Cop archetypes (rectangle stand-ins)
import { playHit, playKO, playSwing } from './audio.js';

export class Enemy{
  constructor(x,y){
    this.type = 'thug';
    this.x = x; this.y=y;
    this.vx = (x<0)? 40 : -40;
    this.vy = 0;
    this.w = 22; this.h = 28;
    this.dir = (this.vx>0)? 1:-1;
    this.maxHP = 40; this.hp = this.maxHP;
    this.dead = false;
    this.cool = 0; this.state='approach';
  }

  update(dt, game){
    const p = game.player;
    this.cool = Math.max(0, this.cool - dt);
    // approach
    const dx = p.x - this.x;
    this.dir = (dx>0)?1:-1;
    const dist = Math.abs(dx);
    if(this.state==='approach'){
      if(dist > 28) this.x += this.dir* 50*dt;
      else this.state='strike';
    }
    if(this.state==='strike' && this.cool<=0){
      this.cool = 0.6 + Math.random()*0.3;
      playSwing();
      // simple punch hb
      const hb = { x: this.x + this.dir*16, y:this.y-10, w:14, h:14 };
      if(overlap(hb, {x:p.x-10,y:p.y-16,w:20,h:30})){
        const dmg = 6;
        if(p.invuln<=0){ p.hp -= dmg; p.invuln = 0.2; }
      }
      this.state='approach';
    }
    // gravity
    this.vy += 640*dt;
    this.y += this.vy*dt;
    if(this.y > game.level.groundY-28){ this.y = game.level.groundY-28; this.vy=0; }
    this.x += this.vx*dt*0; // static unless approaching

    if(this.hp<=0) this.dead=true;
  }

  draw(ctx){
    ctx.fillStyle = '#8e2';
    ctx.fillRect(this.x-this.w/2, this.y-this.h, this.w, this.h);
  }
}

export class ShieldCop{
  constructor(x,y){
    this.type = 'shield';
    this.x=x; this.y=y; this.vy=0; this.w=24; this.h=30;
    this.dir = (x<0)? 1:-1;
    this.maxHP=70; this.hp=this.maxHP; this.dead=false;
    this.blockTimer=0; this.cool=0; this.state='advance';
  }

  update(dt, game){
    const p = game.player; const dx=p.x-this.x; const dist=Math.abs(dx);
    this.dir = (dx>0)?1:-1;
    this.blockTimer = Math.max(0, this.blockTimer - dt);
    this.cool = Math.max(0, this.cool - dt);

    if(this.state==='advance'){
      if(dist>34) this.x += this.dir*40*dt;
      else this.state='bash';
      // random block stances
      if(Math.random()<0.01) this.blockTimer = 0.8;
    }

    if(this.state==='bash' && this.cool<=0){
      this.cool = 1.2;
      // short rush
      this.x += this.dir*24;
      const hb = { x:this.x+this.dir*14, y:this.y-12, w:18, h:16 };
      if(overlap(hb, {x:p.x-10,y:p.y-16,w:20,h:30})){
        if(p.invuln<=0){ p.hp -= 10; p.invuln=0.3; }
      }
      this.state='advance';
    }

    // gravity
    this.vy += 640*dt;
    this.y += this.vy*dt;
    if(this.y > game.level.groundY-30){ this.y = game.level.groundY-30; this.vy=0; }

    if(this.hp<=0) this.dead=true;
  }

  draw(ctx){
    // body
    ctx.fillStyle = '#3db5ff';
    ctx.fillRect(this.x-this.w/2, this.y-this.h, this.w, this.h);
    // shield
    ctx.fillStyle = '#9ad1ff';
    ctx.fillRect(this.x + (this.dir>0? 10:-20), this.y-24, 10, 20);
  }
}

function overlap(a,b){
  return Math.abs((a.x+a.w/2)-(b.x+b.w/2))< (a.w+b.w)/2 &&
         Math.abs((a.y+a.h/2)-(b.y+b.h/2))< (a.h+b.h)/2;
}
