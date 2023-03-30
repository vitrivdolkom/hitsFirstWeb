import { drawCell, getBlendedColors, getCellIndexes, getRandomArbitrary } from './helpers.js'

const PHERO_EVAPORATION = 0.8

export class Ant {
    constructor(colony, id, x, y, maxX, maxY, angle) {
        this.colony = colony
        this.id = id
        this.x = x
        this.y = y
        this.radius = 2
        this.angle = angle
        this.alfa = 1
        this.beta = 1
        this.maxX = maxX
        this.maxY = maxY
        this.food = 0
        this.prevPoint = { x: this.x, y: this.y }
        this.nextPoint = { x: this.x, y: this.y }
        this.under = { red: 0, green: 0, blue: 0 }
        this.path = []
        this.isFirst = true
    }

    draw(context, view, colors, pxPerCell) {
        let { row, column } = getCellIndexes(this.x, this.y, pxPerCell)

        const cell = colors[row][column]

        const R1 = cell.red
        const G1 = cell.green
        const B1 = cell.blue

        if (this.food) {
            colors[row][column].foodAmount += this.food
        }

        const R2 = this.food ? 0 : 200
        const G2 = this.food ? this.food % 255 : 0
        const B2 = 0

        const { R, G, B } = getBlendedColors(R1, G1, B1, R2, G2, B2)

        colors[row][column].red = R
        colors[row][column].green = G
        colors[row][column].blue = B
        colors[row][column].visit += 1

        this.prevPoint.x = this.x
        this.prevPoint.y = this.y

        context.beginPath()
        context.save()
        context.fillStyle = 'black'
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()

        this.x = this.nextPoint.x
        this.y = this.nextPoint.y

        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.save()
        context.fillStyle = `rgb(${R}, ${G}, ${B})`
        context.fillRect(column * pxPerCell, row * pxPerCell, pxPerCell * 2, pxPerCell * 2)
        context.restore()

        if (this.path.length > 100) {
            this.path.splice(0, 5)

            for (let i = 0; i < 5; i++) {
                const point = this.path[i]
                const { row, column } = getCellIndexes(point.x, point.y, pxPerCell)

                const R = (colors[row][column].red *= PHERO_EVAPORATION)
                const G = (colors[row][column].green *= PHERO_EVAPORATION)
                const B = (colors[row][column].blue *= PHERO_EVAPORATION)

                colors[row][column].visit *= PHERO_EVAPORATION
                colors[row][column].foodAmount *= PHERO_EVAPORATION

                context.beginPath()
                context.save()
                context.fillStyle = `rgb(${R}, ${G}, ${B})`
                context.fillRect(column * pxPerCell, row * pxPerCell, pxPerCell, pxPerCell)
                context.restore()
            }
        }
    }

    checkStep(x, y) {
        return x >= 0 && y >= 0 && x < this.maxX && y < this.maxY
    }

    update(view, colors, pxPerCell) {
        const alfa = this.alfa
        const beta = this.beta
        const radian = (this.angle * Math.PI) / 180
        const x = this.x
        const y = this.y
        const distanceToWatch = 5
        const distanceToGo = 5

        const coordinates = [
            {
                x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 4)),
                y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 4)),
            },
            {
                x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 12)),
                y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 12)),
            },
            {
                x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 12)),
                y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 12)),
            },
            {
                x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 4)),
                y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 4)),
            },
        ]

        const segments = new Array(3)

        let sumP = 0
        for (let i = 0; i < segments.length; i++) {
            const pixelFrom = {
                x: Math.min(coordinates[i].x, coordinates[i + 1].x),
                y: Math.max(coordinates[i].y, coordinates[i + 1].y),
            }
            const pixelTo = { x: Math.max(coordinates[i].x, coordinates[i + 1].x), y: Math.min(coordinates[i].y, coordinates[i + 1].y) }

            if (pixelFrom.x === pixelTo.x) {
                pixelFrom.x = x
            }

            if (pixelFrom.y === pixelTo.y) {
                pixelFrom.y = y
            }

            if (!this.checkStep(pixelFrom.x, pixelFrom.y)) {
                segments[i] = { visit: 0, pheromones: 0, probabilities: 0, isInvalid: true, angle: 0 }
                continue
            }
            const { row, column } = getCellIndexes(pixelFrom.x, pixelFrom.y, pxPerCell)
            let food = colors[row][column].foodAmount
            let visit = colors[row][column].visit

            visit = !visit ? 1 : visit
            food = !food ? 1 : food

            segments[i] = { visit: visit, pheromones: food, probabilities: 0, isInvalid: false, angle: 0 }
            sumP += Math.pow(visit, alfa) * Math.pow(food, beta)
        }

        if (!segments[0].isInvalid) segments[0].angle = -30
        if (!segments[1].isInvalid) segments[1].angle = 0
        if (!segments[2].isInvalid) segments[2].angle = 30

        for (let i = 0; i < segments.length; ++i) {
            const p = (Math.pow(segments[i].visit, alfa) * Math.pow(segments[i].pheromones, beta)) / sumP
            const toSegmentX = x + distanceToGo * Math.cos(radian + (segments[i].angle * Math.PI) / 180)
            const toSegmentY = y + distanceToGo * Math.sin(radian + (segments[i].angle * Math.PI) / 180)
            segments[i].probabilities = this.checkStep(toSegmentX, toSegmentY) ? p : 0
        }

        segments.sort((a, b) => a.probabilities - b.probabilities)

        const probabilitiesSum = segments.reduce((sum, el) => (sum += el.probabilities), 0)
        const probabilitiesSegment = []

        probabilitiesSegment.push({ from: 0, to: segments[0].probabilities })
        let currentSum = segments[0].probabilities

        for (let i = 0; i < 2; i++) {
            probabilitiesSegment.push({ from: currentSum, to: currentSum + segments[i + 1].probabilities })
            currentSum += segments[i + 1].probabilities
        }

        const rand = getRandomArbitrary(0, probabilitiesSum)
        let toSegment = { isFinded: false }

        for (let i = 0; i < probabilitiesSegment.length; i++) {
            const segment = probabilitiesSegment[i]

            if (segment.from <= rand && segment.to > rand) {
                toSegment.visit = segments[i].visit
                toSegment.pheromones = segments[i].pheromones
                toSegment.angle = segments[i].angle
                toSegment.isFinded = true
                break
            }
        }

        if (!toSegment.isFinded) {
            toSegment.x = x + distanceToGo * Math.cos(radian + Math.PI)
            toSegment.y = y + distanceToGo * Math.sin(radian + Math.PI)
            toSegment.angle = 180
        } else {
            toSegment.x = x + distanceToGo * Math.cos(radian + (toSegment.angle * Math.PI) / 180)
            toSegment.y = y + distanceToGo * Math.sin(radian + (toSegment.angle * Math.PI) / 180)
        }

        if (toSegment.pheromones >= 255) {
            this.food = toSegment.pheromones
        }

        toSegment.angle = getRandomArbitrary(0, toSegment.angle)

        this.angle = this.angle + toSegment.angle

        // this.x = toSegment.x
        // this.y = toSegment.y

        this.nextPoint.x = toSegment.x
        this.nextPoint.y = toSegment.y

        this.path = [...this.path, { x: this.x, y: this.y }]
        this.isFirst = false
    }
}
