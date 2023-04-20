import { FOOD_RADIUS } from './constants.js'
import { getCellIndexes } from './helpers.js'

export class Food {
    constructor(amount, x, y, map, pxPerCell) {
        this.amount = amount
        this.x = Math.round(x)
        this.y = Math.round(y)
        this.radius = FOOD_RADIUS
        this.map = map
        this.hp = 1000

        for (let i = -this.radius; i <= this.radius; i++) {
            for (let j = -this.radius; j <= this.radius; j++) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)

                this.map.cells[row][column].setIsFood(this)
            }
        }
    }

    minus() {
        this.hp -= 1
    }

    end(context) {
        for (let i = -this.radius; i <= this.radius; i++) {
            for (let j = -this.radius; j <= this.radius; j++) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)

                this.map.cells[row][column].setIsNormalCell()
                this.map.cells[row][column].draw(context)
            }
        }
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
