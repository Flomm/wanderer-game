import Character from '../char/character';
import Drawable from '../../interfaces/drawInterface';

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export default abstract class Tile implements Drawable {
  protected _size: number;
  protected image: HTMLImageElement;
  protected _x: number;
  protected _y: number;
  protected _walkable: boolean;
  protected _chars: Character[];
  constructor() {
    this._size = 70;
    this._chars = [];
  }

  addChar(char: Character): void {
    this._chars.push(char);
  }

  rmChar(char: Character): void {
    this._chars.splice(this._chars.indexOf(char), 1);
  }

  reset(): void {
    for (let char of this._chars) {
      char.draw();
    }
  }

  get chars(): Character[] {
    return this._chars;
  }

  get size(): number {
    return this._size;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get walkable() {
    return this._walkable;
  }
  set x(x: number) {
    this._x = x;
  }

  set y(y: number) {
    this._y = y;
  }

  draw(x: number, y: number) {
    ctx.drawImage(this.image, x, y);
  }
}
