import { getCellIndexes } from './helpers.js'

export class Food {
    constructor(amount, x, y, map) {
        this.amount = amount
        this.x = Math.round(x)
        this.y = Math.round(y)
        this.size = 20
        this.map = map
        this.isEaten = false

        for (let i = -this.map.pxPerCell; i < this.size; i += this.map.pxPerCell) {
            for (let j = -this.map.pxPerCell; j < this.size; j += this.map.pxPerCell) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, this.map.pxPerCell)
                this.map.colors[row][column].isFood = true
                this.map.colors[row][column].food = this.amount * 1000
            }
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.save()
        ctx.fillStyle = `rgb(26, 109, 1)`
        ctx.fillRect(this.x, this.y, this.size, this.size)
        ctx.fill()
        ctx.restore()
    }
}
