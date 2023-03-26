import { canvas, canvasRect, withPixel } from "./canvas.js";


export const drawColony = (e) => {
  const x = e.clientX - canvasRect.left
  const y = e.clientY - canvasRect.top
  const colony = document.createElement('div')
  colony.classList.add('colony')
  canvas.appendChild(colony)

  colony.style.top = withPixel(y - colony.clientHeight / 2)
  colony.style.left = withPixel(x - colony.clientWidth / 2)
}

export const drawFood = (e, amount) => {
  const x = e.clientX - canvasRect.left
  const y = e.clientY - canvasRect.top

  const colony = document.createElement('div')
  colony.classList.add('food')
  colony.style.width = withPixel(amount / 3)
  colony.style.height = withPixel(amount / 3)

  canvas.appendChild(colony)

  colony.style.top = withPixel(Math.floor(y - colony.clientHeight / 2))
  colony.style.left = withPixel(Math.floor(x - colony.clientWidth / 2))
}

export const drawAnt = (i, fromX, fromY) => {
  const colony = document.querySelector('.colony')
  const x = fromX
  const y = fromY

  const ant = document.createElement('div')
  ant.classList.add('ant')
  ant.setAttribute('data-ant-id', i)

  canvas.appendChild(ant)

  ant.style.top = withPixel(Math.floor(y))
  ant.style.left = withPixel(Math.floor(x))
}