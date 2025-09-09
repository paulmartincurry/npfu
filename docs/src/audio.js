const clips = {
  uiMove: null, uiConfirm: null, punch: null, heavy: null, hit: null, rebel: null,
  bossIntro: null
};

export class AudioBus{
  constructor(getVolume){ this.getVolume = getVolume; }
  play(name, detune = 0){
    const url = clips[name]; if(!url) return;
    const a = new Audio(url);
    a.volume = this.getVolume();
    a.playbackRate = detune ? 1 + detune : 1;
    a.play().catch(() => {});
  }
}
