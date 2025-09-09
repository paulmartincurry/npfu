export class Animator {
  constructor(sheet){ this.s = sheet; this.t = 0; this.frame = 0; this.rate = sheet?.rate || 120; }
  set(sheet){ if(!sheet) return; this.s = sheet; this.t = 0; this.frame = 0; this.rate = sheet.rate || 120; }
  tick(dt){ if(!this.s?.img) return; this.t += dt; if(this.t >= this.rate){ this.t = 0; this.frame = (this.frame + 1) % (this.s.frames || 1); } }
  draw(c, x, y, w, h, face = 1){ if(!this.s?.img) return false;
    const f = this.frame; const sx = f * this.s.w; const sy = 0;
    c.save(); if(face === -1){ c.translate(x + w, y); c.scale(-1, 1); x = 0; y = 0; }
    c.drawImage(this.s.img, sx, sy, this.s.w, this.s.h, x, y, w, h);
    c.restore(); return true;
  }
}

export function drawActor(c, actor, rebel = false){
  if(actor.anim){
    const drawn = actor.anim.draw(c, actor.x, actor.y, actor.w, actor.h, actor.face);
    if(drawn){
      if(actor.flash > 0){
        c.save(); c.globalAlpha = 0.35; c.fillStyle = "#ffffff";
        c.fillRect(actor.x, actor.y, actor.w, actor.h);
        c.restore();
      }
      return;
    }
  }
  c.fillStyle = actor.tint || (actor.type === "cop" ? "#4f5b66" : actor.type === "riot" ? "#6b7b8c" : "#dddddd");
  if(rebel) c.fillStyle = "#b6ff00";
  c.fillRect(actor.x, actor.y, actor.w, actor.h);
  if(actor.kind === "player"){
    c.fillStyle = "#e63946";
    c.fillRect(actor.x + 4, actor.y + 8, actor.w - 8, 6);
  }
}
