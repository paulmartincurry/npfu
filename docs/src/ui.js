export class UI{
  constructor(){
    this.hp=document.querySelector("#hpBar .fill");
    this.rb=document.querySelector("#rebelBar .fill");
    this.wave=document.querySelector("#waveNum");
    this.score=document.querySelector("#scoreNum");
    this.item=document.querySelector("#itemTxt");
    this.canvas=document.getElementById("game");
    this.title=document.getElementById("menu-title");
    this.pause=document.getElementById("menu-pause");
    this.over=document.getElementById("menu-over");
    this.vol=document.getElementById("vol");
    this.btnStart=document.getElementById("btnStart");
  }
  setHP(v,m){ this.hp.style.width=(100*v/m)+"%"; }
  setRB(v,m){ this.rb.style.width=(100*v/m)+"%"; }
  setWave(n){ this.wave.textContent=n; }
  setScore(s){ this.score.textContent=s; }
  setItem(t){ this.item.textContent=t||"—"; }
  rebelFx(on){ this.canvas.classList.toggle("rebel",!!on); }
  show(el){ el.classList.add("show"); }
  hide(el){ el.classList.remove("show"); }
}
