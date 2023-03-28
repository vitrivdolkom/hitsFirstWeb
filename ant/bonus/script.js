import { Ant } from './Ant.js'
import { canvas, canvasRect, withPixel } from './canvas.js'
import { drawColony, drawFood } from './drawing.js'
import { getRandomArbitrary } from './helpers.js'

const locateColonyInput = document.querySelector('input[name=locateColony]')
const locateFood = document.querySelector('input[name=locateFood]')
const foodAmount = document.querySelector('input[type=range]')
const executeBtn = document.querySelector('.execute')
const canvasWrapper = document.querySelector('.canvasWrapper')

let colonyCoord
const ANTS_NUM = 200
let ants = new Array(ANTS_NUM)

canvas.addEventListener('click', onCanvasClick)
executeBtn.addEventListener('click', startAnts)

function onCanvasClick(e) {
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    if (locateColonyInput.checked) {
        colonyCoord = { x: Math.floor(x), y: Math.floor(y) }
        drawColony(colonyCoord)

        locateColonyInput.checked = false
        locateColonyInput.disabled = true
        return
    }

    if (locateFood.checked) {
        const foodX = e.clientX - canvasRect.left
        const foodY = e.clientY - canvasRect.top
        const foodCoord = { x: Math.floor(foodX), y: Math.floor(foodY) }

        drawFood(e, +foodAmount.value, foodCoord)
    }
}

function startAnts(e) {
    for (let i = 0; i < ANTS_NUM; i++) {
        const ant = document.createElement('div')
        ant.classList.add('ant')
        ant.style.top = withPixel(colonyCoord.y)
        ant.style.left = withPixel(colonyCoord.x)
        document.querySelector('.ants').appendChild(ant)

        ants[i] = new Ant(i, ant, colonyCoord, canvasWrapper.clientWidth, canvasWrapper.clientHeight)
        ants[i].angle = getRandomArbitrary(0, 360)
        ants[i].startWalk()
    }
}
