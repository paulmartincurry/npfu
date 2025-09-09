export class Pickup {
  constructor(x, y, kind) {
    this.kind = kind;
    this.x = x;
    this.y = y;
    this.w = 16;
    this.h = 16;
    this.vy = -3;
  }
  get bb() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
  upd(dt, world) {
    this.vy += 0.35;
    this.y += this.vy;
    if (this.y + this.h >= world.G) {
      this.y = world.G - this.h;
      this.vy = 0;
    }
  }
  draw(c) {
    if (this.kind === "health") {
      c.fillStyle = "#4caf50";
    } else {
      c.fillStyle = "#ff6f00";
    }
    c.fillRect(this.x, this.y, this.w, this.h);
  }
}

export class Fire {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = 1200;
    this.w = 28;
    this.h = 10;
  }
  get hb() {
    return { x: this.x, y: this.y - 8, w: this.w, h: this.h };
  }
  upd(dt) {
    this.t -= dt;
  }
  draw(c) {
    c.globalAlpha = 0.8;
    c.fillStyle = "#ff9800";
    c.fillRect(this.x, this.y - 6, this.w, 6);
    c.globalAlpha = 1;
  }
}
