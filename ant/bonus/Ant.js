import { getRandomArbitrary } from "./helpers.js"

export class Ant {
  constructor(id, x, y) {
    this.id = id
    this.location = { x, y }
    this.alfa = 1
    this.beta = 1
    this.pheroPerAnt = 5
    this.path = []
  }

  makeChoice(points) {
    const alfa = this.alfa
    const beta = this.beta
    const x = this.location.x
    const y = this.location.y
    let variations = [{ x: x + 1, y: y }, { x: x + 1, y: y + 1 }, { x: x - 1, y: y - 1 }]

    let sum = 0
    // debugger

    variations.forEach(variant => {
      const point = points[variant.y][variant.x]
      const a = Math.pow(point.visit, alfa)
      const b = Math.pow(point.phero, beta)
      sum += a * b
    })

    // todo: calculate probabilities

    const probabilities = []

    for (let i = 0; i < variations.length; ++i) {
      const variant = variations[i]
      const p = sum === 0 ? 0 : (Math.pow(1 / points[variant.y][variant.x].visit, alfa) * Math.pow(points[variant.y][variant.x].phero, beta)) / sum

      probabilities.push(p)
    }
    // debugger

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
    let toPoint

    for (let i = 0; i < probabilitiesSegment.length; i++) {
      const segment = probabilitiesSegment[i];

      if (segment.from <= rand && segment.to > rand) {
        toPoint = { x: variations[i].x, y: variations[i].y }
        break
      }
    }

    this.location = toPoint
    this.path.push(this.location)

  }
}