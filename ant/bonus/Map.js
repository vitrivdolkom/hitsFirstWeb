import { Cell } from './Cell.js'
import { Colony } from './Colony.js'
import { Food } from './Food.js'
import { getCellIndexes } from './helpers.js'

export class WorldMap {
    constructor(canvas, colonyX, colonyY, locateFoodInput, foodCoordinates, antsNum) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.pxPerCell = 4
        this.rows = Math.floor(this.height / this.pxPerCell)
        this.columns = Math.floor(this.width / this.pxPerCell)
        this.cells = new Array(this.rows)
        this.antsNum = antsNum
        this.colonyX = colonyX
        this.colonyY = colonyY

        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = new Array(this.columns)

            for (let j = 0; j < this.columns; j++) {
                this.cells[i][j] = new Cell(j * this.pxPerCell, i * this.pxPerCell, i, j, this.pxPerCell)
            }
        }

        const { row, column } = getCellIndexes(colonyX, colonyY, this.pxPerCell)
        colonyX = column * this.pxPerCell + this.pxPerCell / 2
        colonyY = row * this.pxPerCell + this.pxPerCell / 2

        this.foods = []

        foodCoordinates.forEach((food) => {
            const newFood = new Food(food.amount, food.x, food.y, this, this.pxPerCell)
            this.foods.push(newFood)
        })

        canvas.addEventListener('click', (e) => {
            const x = e.offsetX
            const y = e.offsetY

            if (locateFoodInput.checked) {
                const amount = +foodAmount.value
                const food = new Food(amount, x, y, this, this.pxPerCell)

                this.foods.push(food)
            }
        })
    }

    updateColony(coord) {
        this.colonyX = coord.x
        this.colonyY = coord.y
    }

    first() {
        this.colony = new Colony(this.colonyX, this.colonyY, this.antsNum, this.canvas, this.cells, this.pxPerCell, this.rows, this.columns)
        this.colony.first(this.cells)
    }

    firstDraw(context) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.cells[i][j].draw(context)
            }
        }
    }

    render(context) {
        for (let i = 0; i < this.foods.length; i++) {
            this.foods[i].draw(context)
        }

        this.colony.drawAnts(context, this.cells)
        this.colony.update(this.cells, this.pxPerCell, context)
    }
}
