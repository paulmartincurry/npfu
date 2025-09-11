// ui.js — HUD bindings and hitstop/screen shake hooks
export class UI{
  constructor(refs){
    this.refs = refs;
    this.hitstopT = 0;
    this.shakeT = 0;
  }
  setHP(r){ r=Math.max(0,Math.min(1,r)); this.refs.hpFill.style.width = (r*100).toFixed(0)+'%'; this.refs.hpLabel.textContent = (r*100).toFixed(0); }
  setRebel(r,active){ r=Math.max(0,Math.min(1,r)); this.refs.rebelFill.style.width = (r*100).toFixed(0)+'%'; this.refs.rebelLabel.textContent = (r*100).toFixed(0)+(active?'★':''); }
  setWave(w){ this.refs.waveLabel.textContent = w; }
  setScore(s){ this.refs.scoreLabel.textContent = s; }
  setFPS(f){ this.refs.fpsLabel.textContent = f; }

  hitstop(ms){ this.hitstopT = ms/1000; this.shakeT = 0.2; }

  // future: apply shake to rendering; in this minimal build we keep it simple
}
