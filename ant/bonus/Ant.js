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
        this.nextPoint = { row: this.row, column: this.column, x: this.x, y: this.y }
        this.distanceToFood = 0
        this.distanceToHome = 0
        this.pathFromHome = []
        this.goHome = false
        this.isHero = false
    }

    draw(context, cells, pxPerCell) {
        // const color = cells[this.row][this.column].color
        // context.beginPath()
        // context.save()
        // context.fillStyle = color
        // context.arc(this.x, this.y, this.radius + 0.2, 0, Math.PI * 2)
        // context.fill()
        // context.restore()
        this.x = this.nextPoint.x
        this.y = this.nextPoint.y
        this.row = this.nextPoint.row
        this.column = this.nextPoint.column
        // context.beginPath()
        // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // context.fill()
    }

    comeBackHome(cells, pxPerCell, context) {
        if (this.pathFromHome.length <= 1) {
            this.colony.food += this.food
            this.food = 0
            this.pathFromHome = []
            this.goHome = false
            this.isHero = false
            this.distanceToFood = 0
            this.distanceToHome = 0
            return
        }

        const a = this.pathFromHome.pop()
        cells[a.row][a.column].distanceToFood = this.distanceToFood
            ? Math.min(this.distanceToFood, cells[a.row][a.column].distanceToFood)
            : cells[a.row][a.column].distanceToFood

        cells[a.row][a.column].update(context)
        cells[a.row][a.column].visit(this)

        this.nextPoint.x = a.x
        this.nextPoint.y = a.y
        this.nextPoint.row = a.row
        this.nextPoint.column = a.column

        const addDistance = distanceBetweenTwoVertexes(this.x, this.y, this.nextPoint.x, this.nextPoint.y)

        this.distanceToFood += addDistance
    }

    updateDistances(variant) {
        const addDistance = distanceBetweenTwoVertexes(this.x, this.y, variant.x, variant.y)

        if (this.goHome) {
            this.distanceToFood += addDistance
        } else {
            this.distanceToHome += addDistance
        }
    }

    checkCoordinates(point, dis) {
        return point.x >= 0 && point.y >= 0 && point.x < this.maxColumn * dis && point.y < this.maxRow * dis
    }

    checkCell(cell) {
        return cell.row >= 0 && cell.column >= 0 && cell.row < this.maxRow && cell.column < this.maxColumn
    }

    getNeighbours(distance) {
        const arr = []
        const toWatch = distance + 2

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

                const angle = getAngle(this.x, this.y, this.angle, neighbour.x, neighbour.y, toWatch)

                if (angle > 70 && angle < 290) continue

                neighbour.angle = angle

                arr.push(neighbour)
            }
        }

        return arr
    }

    update(cells, pxPerCell, context) {
        if (this.isHero) this.comeBackHome(cells, pxPerCell, context)
        this.pathFromHome.push({ x: this.x, y: this.y, row: this.row, column: this.column })

        const neighbours = this.getNeighbours(pxPerCell)

        const turn = getNextPoint(this.x, this.y, pxPerCell, this.angle, 180)

        const turnCell = getCellIndexes(turn.x, turn.y, pxPerCell)

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
            let distance = this.goHome ? cell.distanceToHome : cell.distanceToFood

            let p = Math.pow(1 / distance, this.alfa) * Math.pow(pheromone, this.beta)
            if (this.goHome && cell.isFood) p = 0
            if (!this.goHome && cell.isHome) p = 0
            const variant = { ...cell, pheromone: pheromone, distance: distance, p: p, ...coordinate }

            if (p) variants.push(variant)
            fullP += p
        }

        // none variants, add turn 180 degres
        let idx = -1
        if (!variants.length) {
            const cell = cells[turnCell.row][turnCell.column]

            variants.push({ ...cell, ...turn, ...turnCell, angle: 180 })
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

        // update ant
        const variant = variants[idx]

        // update food
        if (variant.isFood) {
            this.isHero = cells[variant.row][variant.column].visitFood()
            variant.row = this.row
            variant.column = this.column
            variant.x = this.x
            variant.y = this.y
            variant.angle = 180
            this.food = variant.foodBlock.amount
            this.goHome = true
        }

        // if (variant.isHome) {
        //     this.colony.food += this.food
        //     this.food = 0
        //     this.goHome = false
        //     variant.row = this.row
        //     variant.column = this.column
        //     variant.x = this.x
        //     variant.y = this.y
        //     variant.angle = 180
        //     this.pathFromHome = []
        //     this.distanceToFood = 0
        //     this.distanceToHome = 0
        // }

        this.updateDistances(variant)

        this.angle += variant.angle
        const row = variant.row
        const column = variant.column
        const toCell = cells[row][column]

        const prevDistanceToHome = toCell.distanceToHome
        const prevDistanceToFood = toCell.distanceToFood
        cells[row][column].distanceToHome =
            !this.goHome && this.distanceToHome ? Math.min(prevDistanceToHome, this.distanceToHome) : prevDistanceToHome
        cells[row][column].distanceToFood =
            this.goHome && this.distanceToFood ? Math.min(prevDistanceToFood, this.distanceToFood) : prevDistanceToFood

        cells[row][column].visit(this)

        // update next point
        this.nextPoint.row = variant.row
        this.nextPoint.column = variant.column
        this.nextPoint.x = variant.x
        this.nextPoint.y = variant.y
    }
}
