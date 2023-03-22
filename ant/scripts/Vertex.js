export class Vertex {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.adjacency = []
  }

  addAdjacency(index) {
    if (!this.adjacency.includes(index)) {
      this.adjacency.push(index)
    }
  }
}
