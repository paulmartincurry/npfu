// input.js — key state & bindings
export function setupInput(game){
  const state = { left:false, right:false, up:false, jab:false, heavy:false, dash:false, rebel:false };
  const map = {
    'ArrowLeft':'left','ArrowRight':'right','ArrowUp':'up',
    'z':'jab','x':'heavy','c':'dash','v':'rebel'
  };
  const down = (k)=>{ const m=map[k.toLowerCase()]; if(!m) return; state[m]=true; };
  const up = (k)=>{ const m=map[k.toLowerCase()]; if(!m) return; state[m]=false; };

  window.addEventListener('keydown', (e)=>{ down(e.key); });
  window.addEventListener('keyup',   (e)=>{ up(e.key); });

  game.input = state;
}
