import Tile from './Tile';

export default class Wall extends Tile {
  constructor() {
    super();
    this._walkable = false;
    this.image = document.getElementById('wall') as HTMLImageElement;
  }
}
