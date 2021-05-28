import { mapList } from '../tilemaps/tileMaps';
import { Game } from '../classes/gameEl/game';
const continueButton: HTMLElement = document.getElementById('continue');
const restartButton: HTMLElement = document.getElementById('restart');
import { onKeyUp } from '../functions/keyBoardEvent';
import { newLevel } from '../functions/newLevel';
import { restartLevel } from '../functions/restartFunction';

const theGame: Game = new Game(mapList);

window.onload = () => {
  theGame.startGame();
};

document.body.addEventListener('keyup', (e: KeyboardEvent) => {
  onKeyUp(e, theGame);
});

continueButton.addEventListener('click', () => {
  newLevel(theGame, continueButton);
});

restartButton.addEventListener('click', () => {
  restartLevel(theGame, restartButton);
});
