export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const hit=(A,B)=>A.x<B.x+B.w && A.x+A.w>B.x && A.y<B.y+B.h && A.y+A.h>B.y;
export const r=(a,b)=>Math.random()*(b-a)+a;

export class Timer {
  constructor(){ this.t=0; }
  tick(dt,ms){ this.t+=dt; if(this.t>=ms){ this.t-=ms; return true; } return false; }
}

export class Camera {
  constructor(){ this.shake=0; }
  kick(ms=80){ this.shake=Math.max(this.shake,ms); }
  offset(){ const ox=this.shake>0?(Math.random()*6-3):0, oy=this.shake>0?(Math.random()*6-3):0; this.shake=Math.max(0,this.shake-2); return {ox,oy}; }
}
