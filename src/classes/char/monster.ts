const canvas2 = document.querySelector('.upper-layer') as HTMLCanvasElement;
const ctx2 = canvas2.getContext('2d');
import Character from './Character';
import Tile from '../mapEl/Tile';
import Floor from '../mapEl/Floor';
import Hero from './Hero';
import Boss from './Boss';
import Level from '../gameEl/Level';
const messages: HTMLElement = document.getElementById('messages');

export default class Monster extends Character {
  constructor(level: number, stage: Level, x: number, y: number, d6: number, hasKey?: boolean) {
    super();
    //stats
    this._name = 'skeleton';
    this._d6 = d6;
    this._level = this.setLevel(level);
    this._hp = 3 * this.level * d6;
    this._dp = this.level * d6;
    this._sp = this.level * d6;
    this._hasKey = hasKey;
    this._isAlive = true;
    //location and visual
    this._x = x;
    this._y = y;
    this._stage = stage;
    this._map = this._stage.map;
    this.location = this.map.getTile(this.x, this.y);
    this.location.addChar(this);
    this.image = document.getElementById('skeleton') as HTMLImageElement;
  }

  strike(hero: Hero, d6: number): void {
    if (this.sp + 2 * d6 > hero.dp) {
      hero.takeDamage(this.sp + 2 * d6 - hero.dp);
    }
  }

  attack(hero: Hero, d6: number): boolean {
    if (this._sp + 2 * d6 === hero.dp && hero.sp + 2 * d6 === this.dp) {
      return false;
    }
    while (this.hp > 0 && hero.hp > 0) {
      this.strike(hero, d6);
      hero.strike(this, d6);
    }
    if (!hero.isAlive) {
      const newDefeatP: HTMLParagraphElement = document.createElement('p');
      newDefeatP.textContent = 'You have been defeated';
      newDefeatP.classList.add('msg--bad');
      messages.appendChild(newDefeatP);
      hero.refreshStats();
      return false;
    }
    if (!this.isAlive) {
      if (this instanceof Boss) {
        hero.killBoss();
      }
      if (this.hasKey) {
        hero.obtainKey();
        const newKeyP: HTMLParagraphElement = document.createElement('p');
        newKeyP.textContent = 'You obtained the key';
        newKeyP.classList.add('msg--good');
        messages.appendChild(newKeyP);
      }
      hero.levelUp();
      const newLevelUpP: HTMLParagraphElement = document.createElement('p');
      newLevelUpP.textContent = `You defeated the ${this.name} and leveled up!`;
      newLevelUpP.classList.add('msg--good');
      messages.appendChild(newLevelUpP);
      hero.refreshStats();
    }
    this._stage.finishLevel();
    return true;
  }

  chooseNewTile(): number[] {
    let nextTile: number[] = [0, 0];
    const options: number[][] = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    let breakPointArr: number[] = [];
    while (true) {
      const random: number = Math.round(Math.random() * (options.length - 1));
      const tryTile: Tile = this.map.getTile(this.x + options[random][0], this.y + options[random][1]);
      if (tryTile instanceof Floor && !tryTile.chars.some((char) => char instanceof Monster)) {
        nextTile = [options[random][0], options[random][1]];
        break;
      }
      if (!breakPointArr.includes(random)) {
        breakPointArr.push(random);
      }
      if (breakPointArr.length >= 4) {
        break;
      }
      nextTile = [0, 0];
    }
    return nextTile;
  }

  move(): void {
    const nextTileCoord: number[] = this.chooseNewTile();
    const nextTile: Tile = this.map.getTile(this.x + nextTileCoord[0], this.y + nextTileCoord[1]);
    if (nextTile !== this.location) {
      this.location.rmChar(this);
      ctx2.clearRect(this.location.x, this.location.y, 70, 70);
      this.location.reset();
      this._x += nextTileCoord[0];
      this._y += nextTileCoord[1];
      if (this.map.getTile(this.x, this.y).chars.length !== 0) {
        const hero: Hero = this.map.getTile(this.x, this.y).chars[0] as Hero;
        hero.drawFightBox(this);
      }
      this.location = nextTile;
      this.location.addChar(this);
      this.draw();
    }
  }

  setLevel(level: number): number {
    const randomInt: number = Math.round(Math.random() * 9 + 1);
    if (randomInt <= 5) {
      return level;
    }
    if (randomInt <= 9) {
      return level + 1;
    }
    return level + 2;
  }

  die(): void {
    this.location.rmChar(this);
    ctx2.clearRect(this.location.x, this.location.y, 70, 70);
    this.location.reset();
    this._x = 0;
    this._y = 0;
    this.location = this.map.getTile(this.x, this.y);
    this._isAlive = false;
  }
}
