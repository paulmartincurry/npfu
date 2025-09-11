// scenes.js — handles overlay flow and binds 'V' Rebel to game
export function buildScenes(game){
  const o = game.overlays;
  // title is visible on load; 'Start' sets running in engine.startGame
  // stageIntro waits for 'Go' click to start spawning
  o.goBtn.addEventListener('click', ()=>{
    game.hideOverlay('stageIntro');
  });

  // results overlay from engine (not used yet)
  // Pause handled in engine with P
}
