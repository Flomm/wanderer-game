import Tile from './tiles';

export default class Lava extends Tile {
  constructor() {
    super();
    this._walkable = true;
    this.image = document.getElementById('lava') as HTMLImageElement;
  }
}
