const canvas2 = document.querySelector('.upper-layer') as HTMLCanvasElement;
const ctx2 = canvas2.getContext('2d');
import Tilemap from '../mapEl/Map';
import d6 from '../../functions/d6';
import Hero from '../char/Hero';
import Level from './Level';
import CanSaveHero from '../../interfaces/CanSaveInterface';

export default class Game implements CanSaveHero {
  mapList: Tilemap[];
  levelList: Level[];
  actualLevel: Level;
  protected counter: number;
  hero: Hero;
  heroSave: number[];

  constructor(mapList: Tilemap[]) {
    this.mapList = mapList;
    this.levelList = [];
    this.levelList = this.generateLevelList();
    this.actualLevel = this.levelList[0];
    this.counter = 0;
    this.hero = this.newHero();
  }

  setCounter(): void {
    this.counter++;
  }

  newHero(): Hero {
    return new Hero(this.actualLevel, this.actualLevel.d6);
  }

  generateLevelList(): Level[] {
    let levels: Level[] = [];
    for (let i: number = 0; i <= this.mapList.length - 1; i++) {
      const newLevel: Level = new Level(this.mapList[i], i + 1, d6());
      levels.push(newLevel);
    }
    return levels;
  }

  saveHero(): void {
    this.heroSave = [];
    this.heroSave.push(this.hero.hp);
    this.heroSave.push(this.hero.sp);
    this.heroSave.push(this.hero.dp);
    this.heroSave.push(this.hero.level);
  }

  startGame(): void {
    this.actualLevel.addHero(this.hero);
    this.actualLevel.buildMap();
  }

  nextLevel(): void {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    this.actualLevel = this.levelList[this.counter];
    this.hero = this.newHero();
    this.hero.loadSave(this.heroSave);
    this.hero.stageUpdate();
    this.actualLevel.addHero(this.hero);
    this.actualLevel.buildMap();
  }
}
