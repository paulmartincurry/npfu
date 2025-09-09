export class Input {
  constructor(){
    this.k=new Set; this.down=new Set; this.up=new Set;
    addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp"," ","Tab"].includes(e.key)) e.preventDefault();
      if(!this.k.has(e.key)) this.down.add(e.key); this.k.add(e.key)}, {passive:false});
    addEventListener("keyup",e=>{this.k.delete(e.key); this.up.add(e.key)});
  }
  held(k){return this.k.has(k)}
  press(k){const p=this.down.has(k); this.down.delete(k); return p}
  release(k){const p=this.up.has(k); this.up.delete(k); return p}
}
