import { Game } from '../classes/gameEl/game';

export function newLevel(game: Game, button: HTMLElement): void {
  game.setCounter();
  game.saveHero();
  game.nextLevel();
  button.classList.add('continue-invisible');
}
