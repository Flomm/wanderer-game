import Game from '../../classes/gameEl/game';

export default function restartLevel(game: Game, button: HTMLElement): void {
  button.classList.add('restart-invisible');
  game.actualLevel.restartLevel();
}
