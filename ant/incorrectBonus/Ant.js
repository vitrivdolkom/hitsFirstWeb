import { getRandomArbitrary } from './helpers.js'

export class Ant {
    constructor(id, x, y) {
        this.id = id
        this.location = { x, y }
        this.alfa = 1
        this.beta = 1
        this.pheroPerAnt = 10
        this.path = []
        this.isHero = false
        this.foodAmount = 0
    }

    comeBackHome() {
        const len = this.path.length
        const toPoint = this.path[len - 1]

        const a = this.path.pop()

        this.location = toPoint

        if (!(len - 1)) {
            this.isHero = false
            this.foodAmount = 0
        }
    }

    checkStep(variant, points) {
        if (variant.y < 0 || variant.x < 0 || variant.y >= points.length || variant.x >= points.length) {
            return false
        }

        const point = points[variant.y][variant.x]

        const prevPoint = this.path.length > 1 ? this.path[this.path.length - 2] : undefined

        if (prevPoint && prevPoint.x === point.x && prevPoint.y === point.y) {
            return false
        }

        if (point.isHome) {
            return false
        }

        return true
    }

    makeChoice(points) {
        if (this.isHero) {
            this.comeBackHome(points)
            return
        }

        this.path.push(this.location)
        const alfa = this.alfa
        const beta = this.beta
        const x = this.location.x
        const y = this.location.y
        let allVariations = [
            { x: x + 10, y: y },
            { x: x + 10, y: y + 10 },
            { x: x - 10, y: y - 10 },
            { x: x - 10, y: y + 10 },
            { x: x, y: y - 10 },
            { x: x, y: y + 10 },
            { x: x - 10, y: y },
            { x: x + 10, y: y - 10 },
        ]
        let variations = []

        let sum = 0

        for (let i = 0; i < allVariations.length; i++) {
            const variant = allVariations[i]
            if (!this.checkStep(variant, points)) {
                continue
            }

            variations.push(variant)
            const point = points[variant.y][variant.x]

            const a = Math.pow(point.visit, alfa)
            const b = Math.pow(point.phero, beta)
            sum += a * b
        }

        // todo: calculate probabilities

        const probabilities = []

        for (let i = 0; i < variations.length; ++i) {
            const variant = variations[i]
            const p =
                sum === 0
                    ? 0
                    : (Math.pow(1 / points[variant.y][variant.x].visit, alfa) * Math.pow(points[variant.y][variant.x].phero, beta)) / sum

            probabilities.push(p)
        }

        // todo: choose vertex
        probabilities.sort((a, b) => a - b)

        const probabilitiesSum = probabilities.reduce((sum, el) => (sum += el), 0)
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
            const segment = probabilitiesSegment[i]

            if (segment.from <= rand && segment.to > rand) {
                toPoint = { x: variations[i].x, y: variations[i].y }
                break
            }
        }

        if (points[toPoint.y][toPoint.x].isFood) {
            this.isHero = true
            this.foodAmount = points[toPoint.y][toPoint.x].food
        }

        this.location = toPoint
    }
}
