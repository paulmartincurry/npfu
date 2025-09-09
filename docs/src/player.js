import { clamp } from "./engine.js";

export class Player {
  constructor(x, y, ground) {
    this.kind = "player";
    this.x = x; this.y = y;
    this.w = 36; this.h = 48;
    this.g = ground;
    this.vx = 0; this.vy = 0;
    this.face = 1;
    this.spd = 2.2;
    this.jump = 6.6;
    this.hpM = 100;
    this.hp = this.hpM;
    this.rebM = 100;
    this.reb = 0;
    this.item = null;
    this.cd = 0;
    this.inv = 0;
    this.dash = 0;
    this.score = 0;
  }

  get hb() {
    return { x: this.x + (this.face === 1 ? this.w : -34), y: this.y + 8, w: 34, h: 28 };
  }

  get bb() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  upd(dt, I, world) {
    const L = I.held("ArrowLeft"), R = I.held("ArrowRight");
    this.vx = (L ^ R) ? (R ? this.spd : -this.spd) : 0;
    this.face = this.vx > 0 ? 1 : (this.vx < 0 ? -1 : this.face);

    if ((I.press("ArrowUp") || I.press(" ")) && this.y + this.h >= this.g) this.vy = -this.jump;
    if (I.press("c") || I.press("C")) this.dash = 180;
    if (this.dash > 0) {
      this.vx *= 2.4;
      this.dash -= dt;
    }

    // gravity and vertical movement
    this.vy += 0.45 * (dt / 16.666);
    this.y += this.vy;
    if (this.y + this.h >= this.g) {
      this.y = this.g - this.h;
      this.vy = 0;
    }

    // horizontal bounds
    this.x = clamp(this.x + this.vx, 0, world.W - this.w);

    // attack handling
    this.cd = Math.max(0, this.cd - dt);
    const jab = (I.press("z") || I.press("Z"));
    const heavy = (I.press("x") || I.press("X"));
    if ((jab || heavy) && this.cd === 0) {
      const dmg = heavy ? 16 : 9;
      const kb = heavy ? 360 : 220;
      world.pAtk(this.hb, dmg, kb, this.face, heavy);
      this.reb = Math.min(this.rebM, this.reb + (heavy ? 6 : 3));
      this.cd = heavy ? 240 : 160;
    }

    // throw item
    if ((I.press("g") || I.press("G")) && this.item === "molotov") {
      world.spawnMolotov(this.x + (this.face === 1 ? this.w : 0), this.y + 8, this.face);
      this.item = null;
    }

    // activate rebel mode
    if ((I.press("v") || I.press("V")) && this.reb >= this.rebM) {
      world.rebel(4200);
      this.reb = 0;
    }

    if (this.inv > 0) this.inv -= dt;
  }

  hurt(n, kb = 0, dir = 1) {
    if (this.inv > 0) return;
    this.hp = Math.max(0, this.hp - n);
    this.inv = 600;
    this.vx += kb * dir;
  }

  heal(n) {
    this.hp = Math.min(this.hpM, this.hp + n);
  }
}
