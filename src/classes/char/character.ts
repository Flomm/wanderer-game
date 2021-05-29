const canvas2 = document.querySelector('.upper-layer') as HTMLCanvasElement;
const ctx2 = canvas2.getContext('2d');

import Tilemap from '../mapEl/Map';
import Tile from '../mapEl/Tile';
import Level from '../gameEl/Level';
import Drawable from '../../interfaces/Drawable';

export default abstract class Character implements Drawable {
  protected _name: string;
  protected image: HTMLImageElement;
  protected _hp: number;
  protected _dp: number;
  protected _sp: number;
  protected _x: number;
  protected _y: number;
  protected _d6: number;
  protected _stage: Level;
  protected _map: Tilemap;
  protected location: Tile;
  protected _level: number;
  protected _hasKey: boolean;
  protected _isAlive: boolean;
  //methods
  abstract attack(char: Character, d6: number): boolean;
  abstract move(x: number, y: number, img?: string): void;
  abstract die(): void;

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get map(): Tilemap {
    return this._map;
  }

  get name(): string {
    return this._name;
  }

  get level(): number {
    return this._level;
  }

  get hasKey(): boolean {
    return this._hasKey;
  }

  get isAlive(): boolean {
    return this._isAlive;
  }

  setd6(newD6: number): void {
    this._d6 = newD6;
  }

  get d6(): number {
    return this._d6;
  }

  get hp(): number {
    return this._hp;
  }

  get sp(): number {
    return this._sp;
  }

  get dp(): number {
    return this._dp;
  }

  takeDamage(dam: number): void {
    this._hp -= dam;
    if (this._hp <= 0) {
      this.die();
    }
  }

  draw(): void {
    ctx2.drawImage(this.image, this.location.x, this.location.y);
  }
}
