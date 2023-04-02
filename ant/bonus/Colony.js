import { Ant } from './Ant.js'
import { getCellIndexes, getNextPoint, getRandom } from './helpers.js'

export class Colony {
    constructor(x, y, antsNum, canvas, cells, pxPerCell, maxRow, maxColumn) {
        this.food = 0
        this.x = x
        this.y = y
        this.radius = 20
        this.isLocated = false
        this.antsNum = antsNum
        this.ants = new Array(this.antsNum)
        this.canvas = canvas
        this.pxPerCell = pxPerCell
        this.maxRow = maxRow
        this.maxColumn = maxColumn

        for (let i = -this.radius; i < this.radius; i++) {
            for (let j = -this.radius; j < this.radius; j++) {
                const shiftX = this.x + i
                const shiftY = this.y + j
                const { row, column } = getCellIndexes(shiftX, shiftY, this.pxPerCell)

                cells[row][column].setIsHome(this.antsNum)
            }
        }

        for (let i = 0; i < this.antsNum; i++) {
            const angle = getRandom(0, 360)
            const antCoordinates = {
                x: Math.round(this.x + (this.radius + pxPerCell) * Math.cos((angle * Math.PI) / 180)),
                y: Math.round(this.y + (this.radius + pxPerCell) * Math.sin((angle * Math.PI) / 180)),
            }

            const { row, column } = getCellIndexes(antCoordinates.x, antCoordinates.y, this.pxPerCell)
            // antCoordinates.x = column * this.pxPerCell + this.pxPerCell / 2
            // antCoordinates.y = row * this.pxPerCell + this.pxPerCell / 2

            this.ants[i] = new Ant(this, i, antCoordinates.x, antCoordinates.y, row, column, this.maxRow, this.maxColumn, angle)
        }
    }

    drawAnts(context, cells) {
        for (let i = 0; i < this.antsNum; i++) {
            this.ants[i].draw(context, cells, this.pxPerCell)
        }
    }

    draw(context) {
        context.beginPath()
        context.save()
        context.fillStyle = 'rgb(255, 0, 0)'
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
    }

    update(cells, pxPerCell, context) {
        for (let i = 0; i < this.antsNum; i++) {
            this.ants[i].update(cells, pxPerCell, context)
        }
    }
}
