import { ctx, withPixel } from './canvas.js'
import { getRandomArbitrary } from './helpers.js'

export class Ant {
    constructor(id, div, location, maxX, maxY, angle) {
        this.node = div
        this.id = id
        this.location = location
        this.angle = angle
        this.taboo = []
        this.alfa = 1
        this.beta = 1
        this.maxX = maxX
        this.maxY = maxY
        this.food = 0
    }

    drawVisit() {
        ctx.beginPath()
        ctx.arc(this.location.x, this.location.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 0, 0, 0.2)`
        ctx.fill()
    }

    checkStep(x, y) {
        return x >= 0 && y >= 0 && x < this.maxX && y < this.maxY
    }

    startWalk() {
        const alfa = this.alfa
        const beta = this.beta
        setInterval(() => {
            const radian = (this.angle * Math.PI) / 180
            const x = this.location.x
            const y = this.location.y
            const distanceToWatch = 5
            const distanceToGo = 20

            const coordinates = [
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 2)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 2)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 3)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 3)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 3)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 3)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 2)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 2)),
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

                const pixelData = ctx.getImageData(pixelFrom.x, pixelFrom.y, pixelTo.x - pixelFrom.x, pixelFrom.y - pixelTo.y).data
                let red = 0
                let green = 0
                let blue = 0
                for (let j = 0; j < pixelData.length; j += 4) {
                    const alpha = pixelData[j + 3] / 255
                    red += pixelData[j] * alpha
                    green += pixelData[j + 1] * alpha
                    blue += pixelData[j + 2] * alpha
                }

                red = !red ? 1 : red
                green = !green ? 1 : green

                segments[i] = { visit: red, pheromones: green, probabilities: 0, isInvalid: false, angle: 0 }
                sumP += Math.pow(red, alfa) * Math.pow(green, beta)
            }

            if (!segments[0].isInvalid) segments[0].angle = -45
            if (!segments[1].isInvalid) segments[1].angle = 0
            if (!segments[2].isInvalid) segments[2].angle = 45

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

            this.node.style.top = withPixel(parseFloat(toSegment.y))
            this.node.style.left = withPixel(parseFloat(toSegment.x))
            // this.node.style.transform = `rotate(${toSegment.angle}deg)`

            if (toSegment.pheromones >= 255) {
                debugger
                this.food = true
            }

            this.angle = this.angle + toSegment.angle
            this.location = toSegment

            if (!this.food) this.drawVisit()
        }, 0)
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
}
