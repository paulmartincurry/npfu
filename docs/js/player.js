// player.js — simple brawler player with jab/heavy/dash/rebel
import { playHit, playSwing, playDash } from './audio.js';

export class Player{
  constructor(x,y){
    this.maxHP = 100; this.hp = this.maxHP;
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.w = 22; this.h = 30;
    this.onGround = true;
    this.dir = 1;

    this.combo = 0; this.comboTimer = 0;
    this.invuln = 0;
    this.cool = 0;
  }

  reset(x,y){ this.x=x; this.y=y; this.hp=this.maxHP; this.vx=this.vy=0; this.combo=0; this.comboTimer=0; this.invuln=0; }

  update(dt, game){
    const inp = game.input;
    // move
    const speed = 120;
    if(inp.left) { this.vx = -speed; this.dir=-1; }
    else if(inp.right) { this.vx = speed; this.dir=1; }
    else this.vx = 0;

    // jump
    if(inp.up && this.onGround){ this.vy = -260; this.onGround=false; }

    // attacks
    this.cool = Math.max(0, this.cool-dt);
    if(this.cool<=0){
      if(inp.jab){ this.jab(game); }
      else if(inp.heavy){ this.heavy(game); }
      else if(inp.dash){ this.dash(game); }
      else if(inp.rebel){ game.triggerRebel(4); }
    }

    // physics
    this.vy += 640*dt;
    this.y += this.vy*dt;
    if(this.y > game.level.groundY-30){ this.y = game.level.groundY-30; this.vy=0; this.onGround=true; }
    this.x += this.vx*dt;

    // timers
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if(this.comboTimer<=0) this.combo = 0;
    this.invuln = Math.max(0, this.invuln - dt);
  }

  jab(game){
    // quick strike, chains up to 3
    this.cool = 0.15;
    this.combo = Math.min(3, this.combo+1);
    this.comboTimer = 0.6;
    playSwing();
    this._hitbox(game, 28, 12, 10 + this.combo*2, 80 + this.combo*20);
  }

  heavy(game){
    this.cool = 0.4;
    playSwing();
    this._hitbox(game, 34, 16, 24, 140);
  }

  dash(game){
    this.cool = 0.35;
    this.vx += this.dir*300;
    playDash();
  }

  _hitbox(game, rx, ry, dmg, knock){
    const hb = { x: this.x + this.dir*rx, y:this.y, w:ry, h:18 };
    for(const e of game.entities){
      if(e.dead) continue;
      if(overlap(hb, e)){
        let bonus = (game.rebelActive>0)? 1.5 : 1.0;
        game.dealDamage(e, Math.round(dmg*bonus), this.dir*knock);
        if(game.rebelActive<=0) game.rebel = Math.min(1, game.rebel + 0.08);
        playHit();
      }
    }
  }

  draw(ctx, rebel){
    // body
    ctx.fillStyle = rebel? '#ff4f9a' : '#7ef542';
    ctx.fillRect(this.x- this.w/2, this.y- this.h, this.w, this.h);
    // face stripe
    ctx.fillStyle = '#111';
    ctx.fillRect(this.x-4, this.y- this.h+6, 8, 6);
    // direction cue
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(this.x + (this.dir>0? 14:-18), this.y-18, 4, 6);
  }
}

function overlap(a,b){
  return Math.abs((a.x+a.w/2)-(b.x+b.w/2))< (a.w+b.w)/2 &&
         Math.abs((a.y+a.h/2)-(b.y+b.h/2))< (a.h+b.h)/2;
}
