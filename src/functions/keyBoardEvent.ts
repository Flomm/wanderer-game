import Game from '../classes/gameEl/Game';
import Monster from '../classes/char/Monster';
const fightBox: HTMLElement = document.querySelector('.fight-info');
const messages: HTMLElement = document.getElementById('messages');

function moveMons(game: Game): void {
  if (game.hero.stepCount === 2) {
    game.actualLevel.moveMonsters();
    game.hero.resetStepCount();
  }
}

export default function onKeyUp(event: KeyboardEvent, game: Game): void {
  try {
    if (game.actualLevel.isOn) {
      switch (event.code) {
        case 'KeyA':
          game.hero.moveLeft();
          moveMons(game);
          break;
        case 'KeyW':
          game.hero.moveUp();
          moveMons(game);
          break;
        case 'KeyD':
          game.hero.moveRight();
          moveMons(game);
          break;
        case 'KeyS':
          game.hero.moveDown();
          moveMons(game);
          break;
        case 'Space':
          if (game.hero.stepCount === 0) {
            const monster: Monster = game.hero.map.getTile(game.hero.x, game.hero.y).chars[1] as Monster;
            monster.attack(game.hero, game.hero.d6);
          } else {
            game.hero.attack(game.hero.map.getTile(game.hero.x, game.hero.y).chars[0] as Monster, game.hero.d6);
          }
          fightBox.innerHTML = '';
          break;
      }
    }
  } catch (err) {
    messages.innerHTML += '&nbsp&nbspThere is nobody to fight with here.' + '<br />';
  }
}
