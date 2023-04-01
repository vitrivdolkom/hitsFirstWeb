import { Ant } from './Ant.js'
import { getCellIndexes, getRandom } from './helpers.js'

export class Colony {
    constructor(x, y, antsNum, canvas, colors, pxPerCell) {
        this.food = 0
        this.x = x
        this.y = y
        this.radius = 20
        this.isLocated = false
        this.antsNum = antsNum
        this.ants = new Array(this.antsNum)
        this.canvas = canvas
        this.noFood = true

        for (let i = 0; i < this.antsNum; i++) {
            const angle = getRandom(0, 360)

            const antCoordinates = {
                x: Math.round(this.x + this.radius * Math.cos((angle * Math.PI) / 180)),
                y: Math.round(this.y + this.radius * Math.sin((angle * Math.PI) / 180)),
            }

            this.ants[i] = new Ant(this, i, antCoordinates.x, antCoordinates.y, canvas.width, canvas.height, angle)
        }

        const shift = Math.floor(this.radius / 1.5)
        for (let i = -shift; i <= shift; i++) {
            for (let j = -shift; j <= shift; j++) {
                const shiftX = this.x + i
                const shiftY = this.y + j
                const { row, column } = getCellIndexes(shiftX, shiftY, pxPerCell)
                colors[row][column].isColony = true
                colors[row][column].visit = 100
            }
        }
    }

    drawAnts(context, colors, pxPerCell) {
        for (let i = 0; i < this.antsNum; i++) {
            this.ants[i].draw(context, colors, pxPerCell)
        }
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    update(colors, pxPerCell, colony) {
        for (let i = 0; i < this.antsNum; i++) {
            if (this.ants[i].food && this.noFood) {
                this.ants[i].isHero = true
                this.noFood = false
            }

            this.ants[i].update(colors, pxPerCell, colony)
        }
    }
}
