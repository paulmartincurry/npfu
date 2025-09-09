import { clamp } from "./engine.js";

export class Enemy {
  constructor(x, ground, wave, type) {
    this.kind = "enemy";
    this.type = type || (Math.random() < 0.5 ? "bonehead" : "cop");
    this.x = x;
    this.y = ground - 44;
    this.w = 34;
    this.h = 44;
    this.face = -1;
    this.spd = 1.1 + Math.min(1, wave * 0.12);
    this.hpM = 24 + Math.floor(wave * 4) + (this.type === "riot" ? 12 : 0);
    this.hp = this.hpM;
    this.cd = 0;
    this.inv = 0;
  }

  get hb() {
    return { x: this.x + (this.face === 1 ? this.w : -22), y: this.y + 8, w: 22, h: 24 };
  }
  get bb() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  upd(dt, p, world) {
    const dx = p.x - this.x;
    this.face = dx > 0 ? 1 : -1;
    const dist = Math.abs(dx);
    if (dist > 44) {
      this.x += Math.sign(dx) * this.spd;
    } else if (this.cd <= 0) {
      world.eAtk(this.hb, 6 + (this.type === "cop" ? 2 : 0), 180, this.face);
      this.cd = 620 + Math.random() * 260;
      this.x -= this.face * 0.6;
    }
    this.cd -= dt;
    if (this.inv > 0) this.inv -= dt;
    this.x = clamp(this.x, 0, world.W - this.w);
  }

  hit(n, kb, dir) {
    if (this.inv > 0) return false;
    this.hp = Math.max(0, this.hp - n);
    this.inv = 200;
    this.x += kb * 0.01 * dir;
    return this.hp <= 0;
  }
}

// Boss class
export class Boss {
  constructor(x, ground) {
    this.kind = "boss";
    this.type = "riot";
    this.x = x;
    this.y = ground - 64;
    this.w = 48;
    this.h = 64;
    this.face = -1;
    this.hpM = 400;
    this.hp = this.hpM;
    this.cd = 0;
    this.inv = 0;
    this.phase = 1;
  }
  get hb() {
    return { x: this.x + (this.face === 1 ? this.w : -28), y: this.y + 10, w: 28, h: 30 };
  }
  get bb() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  upd(dt, p, world) {
    const dx = p.x - this.x;
    this.face = dx > 0 ? 1 : -1;
    if (this.hp < this.hpM * 0.66) this.phase = 2;
    if (this.hp < this.hpM * 0.33) this.phase = 3;
    const base = this.phase === 1 ? 0.9 : (this.phase === 2 ? 1.4 : 1.9);
    const dist = Math.abs(dx);
    if (dist > 60) {
      this.x += Math.sign(dx) * base;
    }
    if (this.cd <= 0) {
      const dmg = this.phase === 3 ? 14 : 9;
      world.eAtk(this.hb, dmg, 280, this.face);
      this.cd = (this.phase === 3 ? 480 : 620) + Math.random() * 260;
    }
    this.cd -= dt;
    if (this.inv > 0) this.inv -= dt;
    this.x = Math.max(0, Math.min(world.W - this.w, this.x));
  }

  hit(n, kb, dir) {
    if (this.inv > 0) return false;
    this.hp = Math.max(0, this.hp - n);
    this.inv = 180;
    this.x += kb * 0.006 * dir;
    return this.hp <= 0;
  }
}
