import { FOOD_RADIUS } from './constants.js'
import { getCellIndexes } from './helpers.js'

export class Food {
    constructor(amount, x, y, map, pxPerCell) {
        this.amount = amount
        this.x = Math.round(x)
        this.y = Math.round(y)
        this.radius = FOOD_RADIUS
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
        for (let i = -this.radius; i <= this.radius; i++) {
            for (let j = -this.radius; j <= this.radius; j++) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)

                this.map.cells[row][column].draw(context)
            }
        }
    }
}
