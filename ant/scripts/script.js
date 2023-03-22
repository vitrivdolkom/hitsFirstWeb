import { Vertex } from "./Vertex.js"
import { addCell } from "./adjacencyMatrix.js"
import { canvas, ctx, resetVertexes, vertexes } from "./global.js"
import { drawEdges } from "./drawEdges.js"

// DOM
const executeBtn = document.querySelector('button[data-execute]')
const resetBtn = document.querySelector('button[data-reset]')

// determine size
ctx.canvas.width = 500
ctx.canvas.height = 500

// event listeners
canvas.addEventListener('click', onCanvasClick)
executeBtn.addEventListener('click', antAlgorithm)
resetBtn.addEventListener('click', () => {
  resetVertexes()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  document.querySelector('table').innerHTML = '<caption>Таблица смежности</caption>'
})


// draw vertex
function onCanvasClick(e) {
  if (vertexes.length > 10) {
    alert('Too much vertexes')
    return
  }

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