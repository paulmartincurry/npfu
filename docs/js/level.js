// level.js — ground & bounds only for now
export class Level{
  constructor(w,h){
    this.w = w; this.h = h;
    this.groundY = Math.floor(h*0.78);
  }
}
