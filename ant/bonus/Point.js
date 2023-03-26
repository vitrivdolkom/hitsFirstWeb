
export class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.visit = 1
    this.phero = 0.1
    this.isFood = false
    this.isHome = false
    this.isWall = false
  }
}