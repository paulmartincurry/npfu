// audio.js — tiny bleeps so it feels alive (using WebAudio)
let ctx;
function getCtx(){ if(!ctx){ ctx = new (window.AudioContext||window.webkitAudioContext)(); } return ctx; }

function beep(freq=440, dur=0.06, type='square', vol=0.02){
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.value = vol;
  o.connect(g); g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
}

export function playSwing(){ beep(220, 0.05, 'sawtooth', 0.02); }
export function playHit(){ beep(140, 0.04, 'square', 0.03); }
export function playKO(){ beep(90, 0.20, 'triangle', 0.04); }
export function playChant(){ beep(660, 0.10, 'square', 0.03); beep(330, 0.12, 'square',0.03); }
export function playDash(){ beep(500, 0.06, 'sine', 0.02); }
