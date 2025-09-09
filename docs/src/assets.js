const sheetDefs = {
  player_punk:  { url: "./img/player_punk.png",  w: 48, h: 48, frames: 6, rate: 90 },
  bonehead:     { url: "./img/bonehead.png",     w: 48, h: 48, frames: 4, rate: 110 },
  cop_riot:     { url: "./img/cop_riot.png",     w: 48, h: 48, frames: 4, rate: 110 },
  flag_bearer:  { url: "./img/flag_bearer.png",  w: 56, h: 56, frames: 4, rate: 120 },
  boss_commander: { url: "./img/boss_commander.png", w: 64, h: 64, frames: 6, rate: 110 },
  horse:        { url: "./img/horse.png",        w: 72, h: 48, frames: 4, rate: 120 },
};

export class Assets {
  constructor(){
    this.images = new Map();
    this.meta = sheetDefs;
  }
  async loadAll(){
    const entries = Object.entries(this.meta);
    await Promise.all(entries.map(async([key, def]) => {
      try {
        const img = new Image();
        img.src = def.url;
        await img.decode();
        this.images.set(key, img);
      } catch (err) {
        // fail silently; image remains undefined
      }
    }));
  }
  getSheet(key){
    const meta = this.meta[key];
    const img = this.images.get(key);
    return meta ? { img, ...meta } : null;
  }
}
