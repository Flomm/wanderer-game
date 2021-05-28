const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const canvas2 = document.querySelector('.upper-layer') as HTMLCanvasElement;

const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
import Tilemap from '../mapEl/map';
import Tile from '../mapEl/tiles';
import Floor from '../mapEl/floor';
import Hero from '../char/hero';
import Monster from '../char/monster';
import Boss from '../char/boss';
import d6 from '../../functions/d6';
import CanSaveHero from '../../interfaces/canSaveInterface';
const messages: HTMLElement = document.getElementById('messages');
const continueButton: HTMLElement = document.getElementById('continue');
const restartButton: HTMLElement = document.getElementById('restart');

export default class Level implements CanSaveHero {
  protected _d6: number;
  protected _nr: number;
  protected _map: Tilemap;
  protected _hero: Hero;
  protected _isOn: boolean;
  monsters: Monster[];
  heroSave: number[];

  constructor(map: Tilemap, nr: number, d6: number) {
    this._d6 = d6;
    this._map = map;
    this._nr = nr;
    this.monsters = [];
    this._isOn = false;
  }

  addHero(hero: Hero) {
    this._hero = hero;
  }

  saveHero(): void {
    this.heroSave = [];
    this.heroSave.push(this.hero.hp);
    this.heroSave.push(this.hero.sp);
    this.heroSave.push(this.hero.dp);
    this.heroSave.push(this.hero.level);
  }

  get nr(): number {
    return this._nr;
  }

  get d6(): number {
    return this._d6;
  }
  get map(): Tilemap {
    return this._map;
  }

  get hero(): Hero {
    return this._hero;
  }

  findOkTile(): number[] {
    let okTile: number[] = [];
    let tile: Tile = this._map.getTile(0, 0);
    do {
      let randomx: number = Math.floor(Math.random() * (this._map.columns - 1) + 1);
      let randomy: number = Math.floor(Math.random() * (this._map.rows - 1) + 1);
      if (randomx !== 1 && randomy !== 1) {
        tile = this._map.getTile(randomx, randomy);
        okTile = [randomx, randomy];
      }
    } while (!(tile instanceof Floor) || tile.chars.length !== 0);
    return okTile;
  }

  generateMonsters(): Monster[] {
    let monsters: Monster[] = [];
    const numOfMonst: number = Math.floor(Math.random() * (4 - 2) + 2);
    for (let i: number = 1; i <= numOfMonst; i++) {
      let tile: number[] = this.findOkTile();
      if (i === 1) {
        let newMonster = new Monster(this.nr, this, tile[0], tile[1], this.d6, true);
        monsters.push(newMonster);
      } else {
        let newMonster = new Monster(this.nr, this, tile[0], tile[1], this.d6, false);
        monsters.push(newMonster);
      }
    }
    let tile: number[] = this.findOkTile();
    let boss = new Boss(this.nr, this, tile[0], tile[1], this.d6);
    monsters.push(boss);
    return monsters;
  }

  buildMap(): void {
    messages.innerHTML += `&nbsp&nbspLevel ${this._nr} has started` + '<br />';
    this.map.draw();
    this.monsters = this.generateMonsters();
    this.hero.draw();
    this.saveHero();
    for (let monster of this.monsters) {
      monster.draw();
    }
    this._isOn = true;
  }

  moveMonsters() {
    this.monsters.forEach((monster) => {
      if (monster.isAlive) {
        monster.move();
      }
    });
  }

  killMonsters(): void {
    this.monsters.forEach((monster) => {
      monster.die();
      monster = null;
    });
    this.monsters = [];
  }

  finishLevel() {
    let numOfLevels: number = 10;
    if (this.hero.hasKey && this.hero.killedBoss) {
      this._isOn = false;
      if (this._nr === numOfLevels) {
        ctx2.clearRect(0, 0, 840, 560);
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0, 0, 840, 560);
        ctx2.font = '20px MedievalSharp';
        ctx2.fillStyle = '#fbd968';
        ctx2.textAlign = 'center';
        ctx2.fillText(
          `You have completed all levels and won the game! Congratulations!`,
          canvas.width / 2,
          canvas.height / 2
        );
      } else {
        ctx2.clearRect(0, 0, 840, 560);
        ctx.fillStyle = 'maroon';
        ctx.fillRect(0, 0, 840, 560);
        ctx2.font = '20px MedievalSharp';
        ctx2.fillStyle = '#fbd968';
        ctx2.textAlign = 'center';
        ctx2.fillText(
          `You have completed level ${this._nr}! Press the 'Continue' button to move on to the next level!`,
          canvas.width / 2,
          canvas.height / 2
        );
        continueButton.removeAttribute('class');
      }
    }
  }

  get isOn(): boolean {
    return this._isOn;
  }

  heroDies() {
    this._hero.resetStepCount();
    this._isOn = false;
    ctx2.clearRect(0, 0, 840, 560);
    ctx.fillStyle = 'maroon';
    ctx.fillRect(0, 0, 840, 560);
    ctx2.font = '20px MedievalSharp';
    ctx2.fillStyle = '#fbd968';
    ctx2.textAlign = 'center';
    ctx2.fillText(
      `You have been defeated! Press the 'Restart' button to try again on this level!`,
      canvas.width / 2,
      canvas.height / 2
    );
    restartButton.removeAttribute('class');
  }

  restartLevel() {
    ctx.clearRect(0, 0, 840, 560);
    ctx2.clearRect(0, 0, 840, 560);
    this.killMonsters();
    const newD6 = d6();
    this._d6 = newD6;
    this._hero.resurrect();
    this.hero.loadSave(this.heroSave);
    this.buildMap();
    this._isOn = true;
  }
}
