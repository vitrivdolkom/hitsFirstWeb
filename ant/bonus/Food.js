import { getCellIndexes } from './helpers.js'

export class Food {
    constructor(amount, x, y, map, pxPerCell) {
        this.amount = amount
        this.x = Math.round(x)
        this.y = Math.round(y)
        this.radius = pxPerCell * 5
        this.map = map
        this.isEaten = false

        for (let i = -this.radius; i <= this.radius; i++) {
            for (let j = -this.radius; j <= this.radius; j++) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)

                this.map.cells[row][column].setIsFood(this)
            }
        }
    }

    eatit() {
        this.isEaten = true
    }

    draw(context) {
        for (let i = -this.radius; i <= this.radius; i += this.map.pxPerCell) {
            for (let j = -this.radius; j <= this.radius; j += this.map.pxPerCell) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)

                this.map.cells[row][column].draw(context)
            }
        }

        context.beginPath()
        context.save()
        context.fillStyle = `rgb(26, 109, 1)`
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
    }
}
