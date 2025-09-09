// Drop sprites into /docs/img and register here when ready.
const sheetDefs = {
  // example: player: { url: "./img/player.png", w: 48, h: 48, frames: 6 }
};

export class Assets {
  constructor(){ this.images=new Map(); this.meta=sheetDefs; }
  async loadAll(){
    const entries=Object.entries(this.meta);
    await Promise.all(entries.map(async([key,def])=>{
      const img=new Image(); img.src=def.url; await img.decode();
      this.images.set(key,img);
    }));
  }
  getSheet(key){ return { img:this.images.get(key), ...this.meta[key] }; } // {img,w,h,frames}
}
