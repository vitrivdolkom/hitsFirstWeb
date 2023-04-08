import { distanceBetweenTwoVertexes, getAngle, getCellIndexes, getNextPoint, getRandom } from './helpers.js'

export class Ant {
    constructor(colony, id, x, y, row, column, maxRow, maxColumn, angle) {
        this.colony = colony
        this.id = id
        this.x = x
        this.y = y
        this.row = row
        this.column = column
        this.radius = 2
        this.angle = angle
        this.alfa = 1
        this.beta = 1
        this.maxRow = maxRow
        this.maxColumn = maxColumn
        this.food = 0
        this.home = 10000
        this.nextPoint = { row: this.row, column: this.column, x: this.x, y: this.y }
        this.prev = { row: this.row, column: this.column }
        this.goHome = false
    }

    draw(context, cells, pxPerCell) {
        const color = cells[this.row][this.column].color
        context.beginPath()
        context.save()
        context.fillStyle = color
        context.arc(this.x, this.y, this.radius + 0.2, 0, Math.PI * 2)
        context.fill()
        context.restore()
        this.x = this.nextPoint.x
        this.y = this.nextPoint.y
        this.row = this.nextPoint.row
        this.column = this.nextPoint.column
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    checkCell(cell) {
        return (
            cell.row >= 0 &&
            cell.column >= 0 &&
            cell.row < this.maxRow &&
            cell.column < this.maxColumn &&
            !(cell.row === this.prev.row && cell.column === this.prev.column)
        )
    }

    getNeighbours(distance) {
        const arr = []

        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                const toRow = this.row + i
                const toColumn = this.column + j
                if (!this.checkCell({ row: toRow, column: toColumn }) || (i === 0 && j === 0)) continue

                const neighbour = {
                    row: toRow,
                    column: toColumn,
                    x: getRandom(toColumn * distance, (toColumn + 1) * distance),
                    y: getRandom(toRow * distance, (toRow + 1) * distance),
                }

                const angle = getAngle(
                    this.x,
                    this.y,
                    this.angle,
                    neighbour.x,
                    neighbour.y,
                    distanceBetweenTwoVertexes(this.x, this.y, neighbour.x, neighbour.y)
                )

                neighbour.angle = angle ? angle : 0.1

                arr.push(neighbour)
            }
        }

        return arr
    }

    update(cells, pxPerCell, context) {
        if (this.goHome) this.food = Math.max(1, this.food * 0.998)
        else this.home = Math.max(1, this.home * 0.998)

        const neighbours = this.getNeighbours(pxPerCell)

        const variants = []
        let fullP = 0

        // fill variants
        for (let i = 0; i < neighbours.length; i++) {
            const coordinate = neighbours[i]
            const row = coordinate.row
            const column = coordinate.column

            cells[row][column].update(context)
            const cell = cells[row][column]

            let pheromone = this.goHome ? cell.homeMarker : cell.foodMarker

            let p = Math.pow(pheromone, this.beta) * Math.pow(1 / Math.abs(coordinate.angle), this.alfa)

            if (pheromone === 1) {
                p = Math.pow(pheromone, this.beta) * Math.pow(1 / Math.abs(coordinate.angle), this.alfa + 2)
            } else {
                p = Math.pow(pheromone, this.beta) * Math.pow(1 / Math.abs(coordinate.angle), this.alfa + 1)
            }

            const variant = { ...cell, pheromone: pheromone, p: p, ...coordinate }
            variants.push(variant)

            fullP += p
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
        let idx = -1
        const rand = Math.random()

        for (let i = 0; i < probabilities.length; i++) {
            const prob = probabilities[i]

            if (prob.from <= rand && prob.to > rand) {
                idx = i
                break
            }
        }

        // update ant
        const variant = variants[idx]

        // update food
        if (variant.isFood) {
            variant.row = this.row
            variant.column = this.column
            variant.x = this.x
            variant.y = this.y
            variant.angle = 180
            this.food = variant.foodBlock.amount
            this.goHome = true
        }

        if (variant.isHome) {
            this.colony.food += this.food
            this.food = 0
            this.home = 10000
            this.goHome = false
            variant.row = this.row
            variant.column = this.column
            variant.x = this.x
            variant.y = this.y
            variant.angle = 180
        }

        this.angle += variant.angle
        const row = variant.row
        const column = variant.column

        cells[row][column].visit(this)

        // update next point

        this.prev.column = this.column
        this.prev.row = this.row
        this.nextPoint.row = variant.row
        this.nextPoint.column = variant.column
        this.nextPoint.x = variant.x
        this.nextPoint.y = variant.y
    }
}
