import Level from '../gameEl/level';
import Monster from './monster';

export default class Boss extends Monster {
  constructor(level: number, stage: Level, x: number, y: number, d6: number) {
    //Stats
    super(level, stage, x, y, d6);
    this._name = 'boss';
    this._level = this.setLevel(level);
    this._hp = 2 * this.level * d6 + d6;
    this._dp = (this.level / 2) * d6 + d6 / 2;
    this._sp = this.level * d6 + this.level;
    //Location and visual
    this.image = document.getElementById('boss') as HTMLImageElement;
  }
}
