import Tile from './tiles';

export default class Floor extends Tile {
  constructor() {
    super();
    this._walkable = true;
    this.image = document.getElementById('floor') as HTMLImageElement;
  }
}
