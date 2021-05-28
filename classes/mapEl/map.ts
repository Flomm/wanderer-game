import { Drawable } from '../../interfaces/drawInterface';
import { Tile } from './tiles';

export class Tilemap implements Drawable {
  columns: number;
  rows: number;
  tiles: Tile[][];

  constructor(tiles: Tile[][]) {
    this.columns = 14;
    this.rows = 10;
    this.tiles = tiles;
  }

  getTile(col: number, row: number): Tile {
    return this.tiles[row][col];
  }

  draw(): void {
    for (let column = 1; column < this.columns - 1; column++) {
      for (let row = 1; row < this.rows - 1; row++) {
        const tile: Tile = this.getTile(column, row);
        let x: number = -tile.size + column * tile.size;
        let y: number = -tile.size + row * tile.size;
        tile.x = x;
        tile.y = y;
        tile.draw(x, y);
      }
    }
  }
}
