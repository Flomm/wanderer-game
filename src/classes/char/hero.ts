import Character from './Character';
import Lava from '../mapEl/Lava';
import Monster from './Monster';
import Boss from './Boss';
import Level from '../gameEl/Level';
import addMessage from '../../functions/addMessage';
const canvas2 = document.querySelector('.upper-layer') as HTMLCanvasElement;
const ctx2 = canvas2.getContext('2d');
const fightBox: HTMLElement = document.querySelector('.fight-info');

export default class Hero extends Character {
  protected basicHealth: number;
  protected basicSP: number;
  protected basicDP: number;
  protected _stepCount: number;
  protected _statSheet: string;
  protected _killedBoss: boolean;

  constructor(stage: Level, d6: number) {
    super();
    //stats
    this._name = 'the Hero';
    this.basicHealth = 30 + 3 * d6;
    this.basicDP = 2;
    this.basicSP = 5;
    this._level = 1;
    this._d6 = d6;
    this._hp = 30 + 3 * d6;
    this._dp = this.basicDP * d6;
    this._sp = this.basicSP + d6;
    this._x = 1;
    this._y = 1;
    this._hasKey = false;
    this._isAlive = true;
    this._stepCount = 0;
    this.refreshStats();
    this._killedBoss = false;
    //Location
    this._stage = stage;
    this._map = this._stage.map;
    this.location = this.map.getTile(this.x, this.y);
    this.location.addChar(this);
    this.image = document.getElementById('hero-down') as HTMLImageElement;
  }

  get killedBoss(): boolean {
    return this._killedBoss;
  }

  get stepCount(): number {
    return this._stepCount;
  }

  killBoss(): void {
    this._killedBoss = true;
  }

  obtainKey(): void {
    this._hasKey = true;
  }

  refreshStats(): void {
    this._statSheet =
      `Health points: ${this._hp}` +
      '&nbsp&nbsp&nbsp&nbsp&nbsp' +
      `Defense points: ${this._dp}` +
      '<br />' +
      `Strike points: ${this._sp}` +
      '&nbsp&nbsp&nbsp&nbsp&nbsp' +
      `Diceroll: ${this._d6}` +
      '<br />' +
      `Level: ${this._level}` +
      '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' +
      `Obtained key: ${this.hasKey ? 'yes' : 'no'}`;
    document.querySelector('.stats').innerHTML = this._statSheet;
  }

  resetStepCount(): void {
    this._stepCount = 0;
  }

  strike(monster: Monster, d6: number): void {
    if (this._sp + 2 * d6 > monster.dp) {
      monster.takeDamage(this._sp + 2 * d6 - monster.dp);
    }
  }

  attack(monster: Monster, d6: number): boolean {
    if (!(monster instanceof Hero)) {
      if (this._sp + 2 * d6 === monster.dp && monster.sp + 2 * d6 === this.dp) {
        return false;
      }
      while (this.hp > 0 && monster.hp > 0) {
        this.strike(monster, d6);
        monster.strike(this, d6);
      }
      if (!this.isAlive) {
        addMessage('You have been defeated!', 'bad');
        this.refreshStats();
        return false;
      }
      if (!monster.isAlive) {
        if (monster instanceof Boss) {
          this.killBoss();
        }
        if (monster.hasKey) {
          this._hasKey = true;
          addMessage('You obtained the key!', 'good');
        }
        this.levelUp();
        addMessage(`You defeated the ${monster.name} and leveled up!`, 'good');
        this.refreshStats();
      }
      this._stage.finishLevel();
      return true;
    }
  }

  levelUp() {
    this.basicHealth += this.d6;
    this.basicSP += this.d6;
    this.basicDP += this.d6;
    this._dp += this.d6;
    this._sp += this.d6;
    this._hp += 1;
    this._level++;
  }

  stageUpdate(): void {
    const randomize: number = Math.round(Math.random() * 10);
    if (randomize < 1) {
      this._hp = this.basicHealth;
    } else if (randomize > 5) {
      if (this._hp + this.basicHealth * 0.33 >= this.basicHealth) {
        this._hp = this.basicHealth;
      } else {
        this._hp += Math.floor(this.basicHealth * 0.33);
      }
    } else {
      if (this._hp + this.basicHealth * 0.1 >= this.basicHealth) {
        this._hp = this.basicHealth;
      } else {
        this._hp += Math.floor(this.basicHealth * 0.1);
      }
    }
    this.refreshStats();
  }

  move(x: number, y: number, img?: string): void {
    fightBox.innerHTML = '';
    this._stepCount++;
    if (this.map.getTile(this.x + x, this.y + y).chars.length !== 0) {
      this.drawFightBox(this.map.getTile(this.x + x, this.y + y).chars[0] as Monster);
      if (this.stepCount === 2) {
        this._stepCount--;
      }
    }
    this.location.rmChar(this);
    ctx2.clearRect(this.location.x, this.location.y, 70, 70);
    this.location.reset();
    this.image = document.getElementById(img) as HTMLImageElement;
    if (this.map.getTile(this.x + x, this.y + y).walkable) {
      this._x += x;
      this._y += y;
      this.location = this.map.getTile(this.x, this.y);
    }
    this.location.addChar(this);
    this.draw();
    if (this.map.getTile(this.x, this.y) instanceof Lava) {
      this.takeDamage(5);
      this.refreshStats();
      addMessage('Ouch! The lava is hot!', 'bad');
    }
  }

  drawFightBox(monster: Monster): void {
    const toWrite: string =
      `Your opponent is a level ${monster.level} ${monster.name}` +
      '<br />' +
      `If you want to fight, press the SPACE button.` +
      '<br />' +
      `If you want to flee, move forward.`;
    fightBox.innerHTML = toWrite;
  }

  moveRight(): void {
    this.move(1, 0, 'hero-right');
  }

  moveUp(): void {
    this.move(0, -1, 'hero-up');
  }

  moveLeft(): void {
    this.move(-1, 0, 'hero-left');
  }

  moveDown(): void {
    this.move(0, 1, 'hero-down');
  }

  resurrect(): void {
    this._isAlive = true;
    this._x = 1;
    this._y = 1;
    this.location = this.map.getTile(this.x, this.y);
    this.location.addChar(this);
  }

  loadSave(save: number[]): void {
    this._hp = save[0];
    this._sp = save[1];
    this._dp = save[2];
    this._level = save[3];
    this.refreshStats();
  }

  die(): void {
    this.location.rmChar(this);
    ctx2.clearRect(this.location.x, this.location.y, 70, 70);
    this.location.reset();
    this._isAlive = false;
    this._hasKey = false;
    this._killedBoss = false;
    this._stage.heroDies();
  }
}
