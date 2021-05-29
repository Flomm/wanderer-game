import Game from '../classes/gameEl/Game';

export default function newLevel(game: Game, button: HTMLElement): void {
  game.setCounter();
  game.saveHero();
  game.nextLevel();
  button.classList.add('invisible');
}
