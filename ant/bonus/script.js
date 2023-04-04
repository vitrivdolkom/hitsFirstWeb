import { Cell } from './Cell.js'
import { Colony } from './Colony.js'
import { Food } from './Food.js'
import { getCellIndexes } from './helpers.js'

window.addEventListener('load', function () {
    const canvasWrapper = document.querySelector('.canvasWrapper')
    const locateColonyInput = document.querySelector('input[name=locateColony]')
    const locateFood = document.querySelector('input[name=locateFood]')
    const foodAmount = document.querySelector('input[type=range]')
    const executeBtn = document.querySelector('.execute')
    const ANTS_NUM = 300

    // todo canvas
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvasWrapper.clientWidth
    canvas.height = canvasWrapper.clientHeight

    // canvas.width = 1000
    // canvas.height = 600

    ctx.fillStyle = `rgb(255, 0, 0)`

    class Map {
        constructor(canvas, colonyX, colonyY) {
            this.canvas = canvas
            this.width = this.canvas.width
            this.height = this.canvas.height
            this.pxPerCell = 4
            this.rows = Math.floor(this.height / this.pxPerCell)
            this.columns = Math.floor(this.width / this.pxPerCell)
            this.cells = new Array(this.rows)

            for (let i = 0; i < this.rows; i++) {
                this.cells[i] = new Array(this.columns)

                for (let j = 0; j < this.columns; j++) {
                    this.cells[i][j] = new Cell(j * this.pxPerCell, i * this.pxPerCell, i, j, this.pxPerCell)
                }
            }

            const { row, column } = getCellIndexes(colonyX, colonyY, this.pxPerCell)
            colonyX = column * this.pxPerCell + this.pxPerCell / 2
            colonyY = row * this.pxPerCell + this.pxPerCell / 2

            this.colony = new Colony(colonyX, colonyY, ANTS_NUM, this.canvas, this.cells, this.pxPerCell, this.rows, this.columns)
            this.foods = []

            canvas.addEventListener('click', (e) => {
                const x = e.offsetX
                const y = e.offsetY

                if (locateFood.checked) {
                    const amount = +foodAmount.value
                    const food = new Food(amount, x, y, this, this.pxPerCell)

                    this.foods.push(food)
                }
            })
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

    const map = new Map(canvas, canvas.width / 2, canvas.height / 2)

    map.firstDraw(ctx)

    let i = 0
    function animate() {
        if (!(i % 1000000) && i !== 0) map.firstDraw(ctx)
        map.render(ctx)
        requestAnimationFrame(animate)

        // setTimeout(() => {
        //     requestAnimationFrame(animate)
        // }, 1000 / 60)

        ++i
    }

    // animate()
})
