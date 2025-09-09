export function drawActor(c, actor, rebel = false) {
  if (actor.sprite && actor.sprite.img) {
    // TODO: draw from spritesheet (when you drop art)
  } else {
    // placeholder rectangles
    c.fillStyle = actor.tint || (actor.type === "cop" ? "#4f5b66" : actor.type === "riot" ? "#6b7b8c" : "#dddddd");
    if (rebel) c.fillStyle = "#b6ff00";
    c.fillRect(actor.x, actor.y, actor.w, actor.h);
    c.fillStyle = "#e63946";
    if (actor.kind === "player") {
      c.fillRect(actor.x + 4, actor.y + 8, actor.w - 8, 6);
    }
  }
}
