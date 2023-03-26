
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}


export class Ant {
  constructor(id) {
    this.id = id
    this.location = id
    this.taboo = []
    this.alfa = 1
    this.beta = 1
    this.pheroPerAnt = 5
  }

  canMove(vertexes) {
    if (!this.taboo.length) return true

    for (let i = 0; i < vertexes[this.location].adjacency.length; i++) {
      const index = vertexes[this.location].adjacency[i]

      if (!this.taboo.includes(index)) {
        return true
      }
    }

    return false
  }

  isOnStart() {
    return this.location === this.id && this.taboo.length
  }

  makeChoice(distances, pheromones, vertexes) {
    const alfa = this.alfa
    const beta = this.beta
    const from = this.location
    let dis = []

    // todo: check neighbours
    for (let i = 0; i < vertexes[from].adjacency.length; i++) {
      const index = +vertexes[from].adjacency[i]
      const len = this.taboo.length

      if (!this.taboo.includes(index) && (len === 1 && index !== this.id || len > 1 && index !== this.taboo[len - 1] || !this.taboo.length)) {
        dis.push({ index, distance: distances[from][index] })
      }
    }

    // todo: calculate probabilities
    let sum = 0;
    const probabilities = []

    for (let i = 0; i < dis.length; ++i) {
      const a = Math.pow(1 / dis[i].distance, alfa)
      const b = Math.pow(pheromones[from][dis[i].index], beta)
      sum += a * b
    }

    for (let i = 0; i < dis.length; ++i) {
      const to = dis[i].index
      const p = sum === 0 ? 0 : (Math.pow(1 / dis[i].distance, alfa) * Math.pow(pheromones[from][to], beta)) / sum

      probabilities.push(p)
    }

    // todo: choose vertex
    probabilities.sort((a, b) => a - b)

    const probabilitiesSum = probabilities.reduce((sum, el) => sum += el, 0)
    const probabilitiesSegment = []

    probabilitiesSegment.push({ from: 0, to: probabilities[0] })
    let currentSum = probabilities[0]

    for (let i = 0; i < probabilities.length - 1; i++) {
      probabilitiesSegment.push({ from: currentSum, to: currentSum + probabilities[i + 1] })
      currentSum += probabilities[i + 1]
    }

    const rand = getRandomArbitrary(0, probabilitiesSum)
    let toVertex

    for (let i = 0; i < probabilitiesSegment.length; i++) {
      const segment = probabilitiesSegment[i];

      if (segment.from <= rand && segment.to > rand) {
        toVertex = dis[i].index
        break
      }
    }

    this.location = toVertex
    this.taboo.push(toVertex)
    pheromones[from][toVertex] += this.pheroPerAnt / vertexes.length
  }
}