import { Enemy, Boss } from "./enemy.js";
import { Pickup } from "./items.js";

export class Level {
  constructor(worldWidth, groundY) {
    this.W = worldWidth;
    this.G = groundY;
    this.wave = 1;
    this.enemies = [];
    this.spawnCD = 0;
    this.toSpawn = 4;
    this.hasBoss = false;
  }

  update(dt, player, world) {
    this.spawnCD -= dt;
    if (this.spawnCD <= 0 && this.toSpawn > 0 && this.enemies.length < 5) {
      const side = Math.random() < 0.5 ? 40 : this.W - 80;
      this.enemies.push(new Enemy(side, this.G, this.wave));
      this.toSpawn--;
      this.spawnCD = 900 - Math.min(500, this.wave * 40);
    }

    // remove dead enemies
    this.enemies = this.enemies.filter(e => e.hp > 0);

    // handle wave progression or boss
    if (this.toSpawn <= 0 && this.enemies.length === 0) {
      this.wave++;
      // spawn boss every 5th wave
      if (this.wave % 5 === 0 && !this.hasBoss) {
        this.enemies.push(new Boss(this.W / 2 - 24, this.G));
        this.hasBoss = true;
      } else {
        this.hasBoss = false;
        this.toSpawn = 4 + Math.floor(this.wave * 0.6);
        player.heal(10);
      }
    }
  }

  maybeDrop(e, drops) {
    if (Math.random() < 0.35) {
      drops.push(new Pickup(e.x, e.y, Math.random() < 0.5 ? "health" : "molotov"));
    }
  }
}
