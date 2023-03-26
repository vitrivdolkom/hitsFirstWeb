import { Ant } from "./Ant.js"
import { canvas, canvasRect, withPixel } from "./canvas.js"
import { drawAnt, drawColony, drawFood } from "./drawing.js"
import { getRandomArbitrary } from "./helpers.js"
import { Point } from "./Point.js"

// todo DOM

const locateColonyInput = document.querySelector('input[name=locateColony]')
const locateFood = document.querySelector('input[name=locateFood]')
const foodAmount = document.querySelector('input[type=range]')
const executeBtn = document.querySelector('.execute')

// todo init vars
let points
let colonyCoord
const Q = 1

// todo helpers


export const distanceBetweenTwoPoints = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// todo draw functions

canvas.addEventListener('click', (e) => {
  const x = e.clientX - canvasRect.left
  const y = e.clientY - canvasRect.top

  if (locateColonyInput.checked) {
    colonyCoord = { x: Math.floor(x), y: Math.floor(y) }
    drawColony(e)
    fillPoints()
    locateColonyInput.checked = false
    locateColonyInput.disabled = true
    return
  }

  if (locateFood.checked) {
    drawFood(e, foodAmount.value)
  }
})

const fillPoints = () => {
  points = new Array(canvas.clientHeight)

  for (let i = 0; i < canvas.clientHeight; i++) {
    points[i] = new Array(canvas.clientWidth)
  }

  for (let i = 0; i < canvas.clientHeight; i++) {
    for (let j = 0; j < canvas.clientWidth; j++) {
      points[i][j] = new Point(i, j)
    }
  }
}

executeBtn.addEventListener('click', algorithm)

const chooseCoordinates = (coord) => {
  const colony = document.querySelector('.colony')
  const rand = getRandomArbitrary(0, 1)

  if (rand <= 0.25) {
    coord.x -= Math.floor(colony.clientWidth / 2)
    coord.y -= Math.floor(colony.clientWidth / 2)
    return
  }
  if (rand <= 0.5) {
    coord.x -= Math.floor(colony.clientWidth / 2)
    coord.y += Math.floor(colony.clientWidth / 2)
    return
  }
  if (rand <= 0.75) {
    coord.x += Math.floor(colony.clientWidth / 2)
    coord.y -= Math.floor(colony.clientWidth / 2)
    return
  }

  coord.x += Math.floor(colony.clientWidth / 2)
  coord.y += Math.floor(colony.clientWidth / 2)
}

async function algorithm() {

  let ants = new Array(100)
  for (let i = 0; i < 100; i++) {
    debugger
    const coord = { ...colonyCoord }
    chooseCoordinates(coord)

    ants[i] = new Ant(i, coord.x, coord.y)
    drawAnt(i, coord.x, coord.y)
  }

  let count = 0
  while (count < 1000) {
    for (let i = 0; i < 100; i++) {
      const antDiv = document.querySelector(`div[data-ant-id="${i}"]`)

      ants[i].makeChoice(points)
      await new Promise((res, rej) => {
        setTimeout(() => res(), 40);
      })

      const toPoint = ants[i].location

      points[toPoint.y][toPoint.x].phero += 0.1
      points[toPoint.y][toPoint.x].visit += 1

      antDiv.style.top = withPixel(toPoint.y)
      antDiv.style.left = withPixel(toPoint.x)
    }

    count++
  }
}

