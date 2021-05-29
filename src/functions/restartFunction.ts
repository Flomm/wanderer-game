import Game from '../classes/gameEl/Game';

export default function restartLevel(game: Game, button: HTMLElement): void {
  button.classList.add('invisible');
  game.actualLevel.restartLevel();
}
