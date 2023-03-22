import { Vertex } from "./Vertex.js"
import { addCell } from "./adjacency.js"
import { drawEdges } from "./drawEdges.js"
import { canvas, ctx, vertexes } from "./global.js"

// DOM
const drawEdgesBtn = document.querySelector('button[data-draw-edges]')
const executeBtn = document.querySelector('button[data-execute]')

// determine size
const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
ctx.canvas.width = CANVAS_WIDTH
ctx.canvas.height = CANVAS_HEIGHT

// event listeners

canvas.addEventListener('click', onCanvasClick)
drawEdgesBtn.addEventListener('click', drawEdges)
executeBtn.addEventListener('click', antAlgorithm)

// draw vertex

function onCanvasClick(e) {
  addCell()
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const vertex = new Vertex(x, y)
  vertexes.push(vertex)

  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#000000'
  ctx.fill()
}

function distanceBetweenTwoVertexes(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function fullDistance(q) {
  let sum = 0

  for (let i = 0; i < q.length - 1; i++) {
    const element = q[i];

    sum += distanceBetweenTwoVertexes(q[i], q[i + 1])
  }

  sum += distanceBetweenTwoVertexes(q[q.length - 1], q[0])

  return sum
}


// main
function antAlgorithm() {
  const len = vertexes.length
  let bestAnt = []

  let q = []

  for (let i = 0; i < len; ++i) {
    q.push(vertexes[i])
  }

  bestAnt.push([q, fullDistance(q)])


  let pheromones = new Array(len)
  let distances = new Array(len)

  for (let i = 0; i < len; ++i) {
    pheromones[i] = new Array(len)
    distances[i] = new Array(len)
  }



}