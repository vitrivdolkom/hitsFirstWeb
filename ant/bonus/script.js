import { PHERO_EVAPORATION } from './Ant.js'
import { Colony } from './Colony.js'
import { Food } from './Food.js'

window.addEventListener('load', function () {
    const canvasWrapper = document.querySelector('.canvasWrapper')
    const locateColonyInput = document.querySelector('input[name=locateColony]')
    const locateFood = document.querySelector('input[name=locateFood]')
    const foodAmount = document.querySelector('input[type=range]')
    const executeBtn = document.querySelector('.execute')
    const ANTS_NUM = 100

    // todo canvas
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvasWrapper.clientWidth
    canvas.height = canvasWrapper.clientHeight

    ctx.fillStyle = `rgb(255, 0, 0)`

    class Map {
        constructor(canvas, colonyX, colonyY) {
            this.canvas = canvas
            this.width = this.canvas.width
            this.height = this.canvas.height
            this.pxPerCell = 2
            this.colors = new Array(Math.floor(this.height / this.pxPerCell))
            for (let i = 0; i < this.colors.length; i++) {
                this.colors[i] = new Array(Math.floor(this.width / this.pxPerCell))
            }

            for (let i = 0; i < this.colors.length; i++) {
                for (let j = 0; j < this.colors[i].length; j++) {
                    this.colors[i][j] = {
                        red: 0,
                        green: 0,
                        blue: 0,
                        isWall: false,
                        isFood: false,
                        food: 1,
                        distanceToHome: 100000,
                        distanceToFood: 100000,
                        isColony: false,
                        visit: 1,
                    }
                }
            }
            this.colony = new Colony(colonyX, colonyY, ANTS_NUM, this.canvas, this.colors, this.pxPerCell)
            this.foods = []

            canvas.addEventListener('click', (e) => {
                const x = e.offsetX
                const y = e.offsetY
                const amount = +foodAmount.value
                const food = new Food(amount, x, y, this)

                this.foods.push(food)
            })
        }

        render(context) {
            for (let i = 0; i < this.foods.length; i++) {
                this.foods[i].draw(context)
            }

            this.colony.drawAnts(context, this.colors, this.pxPerCell)
            this.colony.update(this.colors, this.pxPerCell, context)
            this.colony.draw(context)
        }
    }

    const map = new Map(canvas, 100, 200)
    let i = 0
    function animate() {
        // setTimeout(() => {
        //     requestAnimationFrame(animate)
        // }, 1000 / 10)

        // if (!(i % 100)) {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height)

        //     for (let i = 0; i < map.colors.length; i++) {
        //         for (let j = 0; j < map.colors[i].length; j++) {
        //             map.colors[i][j].visit *= PHERO_EVAPORATION
        //             map.colors[i][j].food *= PHERO_EVAPORATION
        //         }
        //     }
        // }

        map.render(ctx)
        ++i
        requestAnimationFrame(animate)
        // console.log(i)
    }

    animate()
})
