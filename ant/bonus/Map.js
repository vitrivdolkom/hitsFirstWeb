import { checkCell, distanceBetweenTwoVertexes, getCellIndexes } from './helpers.js'
import { PX_PER_CELL } from './constants.js'
import { Colony } from './Colony.js'
import { Cell } from './Cell.js'
import { Food } from './Food.js'

export class WorldMap {
    constructor(canvas, ctx, colonyX, colonyY, locateFoodInput, setWall, antsNum) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.pxPerCell = PX_PER_CELL
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

        canvas.addEventListener('click', (e) => {
            const x = e.offsetX
            const y = e.offsetY

            if (locateFoodInput.checked) {
                const amount = +foodAmount.value
                const food = new Food(amount, x, y, this, this.pxPerCell)

                this.foods.push(food)

                return
            }
        })

        this.mouse = { x: 0, y: 0, pressed: false }

        // todo draw wall
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.mouse.pressed = true
        })

        canvas.addEventListener('mousemove', (e) => {
            if (!this.mouse.pressed || !setWall.checked) return

            const currentX = e.offsetX
            const currentY = e.offsetY

            if (distanceBetweenTwoVertexes(this.mouse.x, this.mouse.y, currentX, currentY) > PX_PER_CELL / 2) {
                const cell = getCellIndexes(this.mouse.x, this.mouse.y, PX_PER_CELL)

                for (let i = -4; i < 5; i++) {
                    for (let j = -4; j < 5; j++) {
                        const toRow = cell.row + i
                        const toColumn = cell.column + j

                        if (checkCell({ row: toRow, column: toColumn }, this.rows, this.columns)) this.cells[toRow][toColumn].setIsWall()
                    }
                }

                ctx.save()
                ctx.fillStyle = 'grey'
                ctx.fillRect(this.mouse.x - PX_PER_CELL * 4, this.mouse.y - PX_PER_CELL * 4, PX_PER_CELL * 10, PX_PER_CELL * 10)
                ctx.restore()
            }

            this.mouse.x = currentX
            this.mouse.y = currentY
        })

        canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false
        })

        canvas.addEventListener('mouseleave', () => {
            this.mouse.pressed = false
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
        context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.cells[i][j].draw(context)
            }
        }
    }

    render(context) {
        this.colony.update(this.cells, this.pxPerCell, context)
        this.colony.drawAnts(context, this.cells)
    }
}
