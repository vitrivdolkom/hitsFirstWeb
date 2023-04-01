import { distanceBetweenTwoVertexes, getBlendedColors, getCellIndexes, getNextPoint, getRandom } from './helpers.js'

export const PHERO_EVAPORATION = 0.8
export const Q = 2000

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
        this.nextPoint = { x: this.x, y: this.y }
        this.path = []
        this.distance = 0
        this.distanceToFood = 0
        this.distanceToHome = 0
        this.pathFromHome = []
        this.goHome = false
        this.isHero = false
    }

    redrawCell(point, colors, pxPerCell, context, fullDelete = false) {
        const { row, column } = getCellIndexes(point.x, point.y, pxPerCell)
        const colorCell = colors[row][column]
        const multi = fullDelete ? 0 : PHERO_EVAPORATION

        colors[row][column].red *= multi
        colors[row][column].green *= multi
        colors[row][column].blue *= multi

        const R = colorCell.red
        const G = colorCell.green
        const B = colorCell.blue

        colors[row][column].visit *= this.goHome ? 1 : multi
        colors[row][column].food *= this.goHome ? multi : 1

        context.beginPath()
        context.save()
        context.fillStyle = 'black'
        context.fillRect(column * pxPerCell, row * pxPerCell, pxPerCell, pxPerCell)
        context.restore()

        context.beginPath()
        context.save()
        context.fillStyle = `rgb(${R}, ${G}, ${B})`
        context.fillRect(column * pxPerCell, row * pxPerCell, pxPerCell, pxPerCell)
        context.restore()
    }

    draw(context, colors, pxPerCell) {
        let { row, column } = getCellIndexes(this.x, this.y, pxPerCell)

        const cell = colors[row][column]

        const R1 = cell.red
        const G1 = cell.green
        const B1 = cell.blue

        const R2 = this.food ? 0 : 155
        const G2 = this.food ? this.food : 0
        const B2 = 0

        // const R = R2
        // const G = G2
        // const B = B2

        let { R, G, B } = getBlendedColors(R1, G1, B1, R2, G2, B2)

        colors[row][column].red = R
        colors[row][column].green = G
        colors[row][column].blue = B

        context.beginPath()
        context.save()
        context.fillStyle = 'black'
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()

        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.save()
        context.fillStyle = `rgb(${R}, ${G}, ${B})`
        context.fillRect(column * pxPerCell, row * pxPerCell, pxPerCell * 2, pxPerCell * 2)
        context.restore()

        this.x = this.nextPoint.x
        this.y = this.nextPoint.y

        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()

        const len = this.path.length
        if (!len || this.goHome) return

        for (let i = 0; i < len; i++) {
            const point = this.path[i]
            this.redrawCell(point, colors, pxPerCell, context)
        }

        if (this.path.length > 10 && !this.goHome) {
            for (let i = 0; i < len; i++) {
                const point = this.path[i]
                this.redrawCell(point, colors, pxPerCell, context, true)
            }

            this.path.splice(0, 10)
        }
    }

    checkStep(x, y) {
        return x >= 0 && y >= 0 && x < this.maxX && y < this.maxY
    }

    comeBackHome(colors, pxPerCell) {
        if (this.pathFromHome.length <= 1) {
            this.food = 0
            this.path = []
            this.distance = 0
            this.pathFromHome = []
            this.goHome = false
            this.isHero = false
            this.distanceToFood = 0
            this.distanceToHome = 0
            return
        }

        const a = this.pathFromHome.pop()
        const lastPoint = this.pathFromHome[this.pathFromHome.length - 1]
        const addDistance = distanceBetweenTwoVertexes(this.x, this.y, lastPoint.x, lastPoint.y)
        this.distance += addDistance

        const { row, column } = getCellIndexes(lastPoint.x, lastPoint.y, pxPerCell)
        colors[row][column].distanceToFood = Math.min(this.distance - this.distanceToFood, colors[row][column].distanceToFood)

        this.nextPoint.x = lastPoint.x
        this.nextPoint.y = lastPoint.y
    }

    checkCell(row, column, per) {
        return row >= 0 && column >= 0 && row < this.maxX / per && column < this.maxY / per
    }

    update(colors, pxPerCell, context) {
        // if (this.isHero) {
        //     this.comeBackHome(colors, pxPerCell)
        //     return
        // }

        this.pathFromHome.push({ x: this.x, y: this.y })

        const distanceToWatch = 5
        const distanceToGo = 5
        const turnCoordinates = getNextPoint(this.x, this.y, distanceToWatch, this.angle, 180)
        const angles = [getRandom(30, 60), getRandom(-5, 5), getRandom(-30, -60)]

        const coordinates = [
            getNextPoint(this.x, this.y, distanceToWatch, this.angle, angles[0]),
            getNextPoint(this.x, this.y, distanceToWatch, this.angle, angles[1]),
            getNextPoint(this.x, this.y, distanceToWatch, this.angle, angles[2]),
        ]

        const variants = []
        let fullP = 0

        // fill variants
        for (let i = 0; i < coordinates.length; i++) {
            const coordinate = coordinates[i]
            const { row, column } = getCellIndexes(coordinate.x, coordinate.y, pxPerCell)

            if (!this.checkStep(coordinate.x, coordinate.y, pxPerCell)) {
                continue
            }

            const cell = colors[row][column]

            let pheromone = this.goHome ? cell.visit : cell.food
            let distance = this.goHome ? cell.distanceToHome : cell.distanceToFood

            pheromone = pheromone ? pheromone : 0.00000001

            const p = Math.pow(1 / distance, this.alfa) * Math.pow(pheromone, this.beta)
            const variant = { ...cell, x: coordinate.x, y: coordinate.y, pheromone: pheromone, distance: distance, p: p }

            if (i === 0) variant.angle = angles[0]
            if (i === 1) variant.angle = angles[1]
            if (i === 2) variant.angle = angles[2]

            variants.push(variant)
            fullP += p
        }

        // none variants, add turn 180 degres
        let idx = -1
        if (!variants.length) {
            const { row, column } = getCellIndexes(turnCoordinates.x, turnCoordinates.y, pxPerCell)
            const cell = colors[row][column]

            variants.push({ ...cell, x: turnCoordinates.x, y: turnCoordinates.y, p: 1, angle: 180 })
            fullP = 1
            idx = 0
        }

        // fill probabilities of variants
        for (let i = 0; i < variants.length; i++) {
            variants[i].p = variants[i].p / fullP
        }

        // sort probabilities
        variants.sort((a, b) => a.p - b.p)

        // part on segments for random
        const probabilities = []
        let probabilitiesSum = variants[0].p

        probabilities.push({ from: 0, to: variants[0].p })

        for (let i = 0; i < variants.length - 1; i++) {
            const newP = variants[i + 1].p
            probabilities.push({ from: probabilitiesSum, to: probabilitiesSum + newP })
            probabilitiesSum += newP
        }

        // random 0 - 1
        const rand = Math.random()

        for (let i = 0; i < probabilities.length; i++) {
            const prob = probabilities[i]

            if (prob.from <= rand && prob.to > rand) {
                idx = i
                break
            }
        }

        if (this.goHome) {
            idx = variants.length - 1
        }

        // update ant
        const variant = variants[idx]

        // update food
        if (variant.isFood) {
            variant.x = turnCoordinates.x
            variant.y = turnCoordinates.y
            variant.angle = 180
            const { row, column } = getCellIndexes(variant.x, variant.y, pxPerCell)
            this.food = variant.food
            this.goHome = true

            this.isHero = colors[row][column].foodBlock === 0
            colors[row][column].foodBlock = 1
        }

        if (variant.isColony) {
            this.isHero = false
            this.colony.food += this.food
            this.food = 0
            this.goHome = false
            variant.x = turnCoordinates.x
            variant.y = turnCoordinates.y
            variant.angle = 180
            this.pathFromHome = []
            this.distanceToFood = 0
            this.distanceToHome = 0
            const len = this.path.length

            for (let i = 0; i < len; i++) {
                const point = this.path[i]
                this.redrawCell(point, colors, pxPerCell, context)
            }
            this.path.splice(0, len)

            this.distance = 0
        }
        this.angle += variant.angle
        const { row, column } = getCellIndexes(variant.x, variant.y, pxPerCell)

        // update distances
        const addDistance = distanceBetweenTwoVertexes(this.x, this.y, variant.x, variant.y)
        this.distance += addDistance
        this.distanceToHome += this.goHome ? 0 : addDistance
        this.distanceToFood += this.goHome ? 0 : addDistance

        const prevDistanceToHome = colors[row][column].distanceToHome
        const prevDistanceToFood = colors[row][column].distanceToFood
        colors[row][column].distanceToHome =
            this.distanceToHome && !this.goHome ? Math.min(prevDistanceToHome, this.distanceToHome) : prevDistanceToHome
        colors[row][column].distanceToFood =
            Math.floor(this.distance - this.distanceToFood) !== 0 && this.goHome
                ? Math.min(prevDistanceToFood, this.distance - this.distanceToFood)
                : prevDistanceToFood

        if (this.goHome) {
            colors[row][column].food += this.isHero ? (this.food * 100) / this.distanceToFood : this.food / this.distanceToFood
        }

        colors[row][column].visit += this.goHome ? 0 : Q / this.distanceToHome

        // update position and path
        this.nextPoint.x = variant.x
        this.nextPoint.y = variant.y
        this.path.push({ x: this.x, y: this.y })
    }
}
