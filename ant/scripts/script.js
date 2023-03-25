import { Vertex } from "./Vertex.js"
import { addCell } from "./adjacencyMatrix.js"
import { canvas, ctx, resetVertexes, vertexes } from "./global.js"
import { drawPath } from "./drawPath.js"
import { Ant } from "./Ant.js"
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

function fullDistance(q, vertexes) {
  let sum = 0

  for (let i = 0; i < q.length - 1; i++) {
    sum += distanceBetweenTwoVertexes(vertexes[q[i]], vertexes[q[i + 1]])
  }

  sum += distanceBetweenTwoVertexes(vertexes[q[q.length - 1]], vertexes[q[0]])

  return sum
}


// main

const EVAPORATION = 0.9
const DEFAULT_PHERO = 0.1

function antAlgorithm() {
  const len = vertexes.length
  let bestAnt = []

  let pheromones = new Array(len)
  let distances = new Array(len)

  for (let i = 0; i < len; ++i) {
    pheromones[i] = new Array(len)
    distances[i] = new Array(len)
  }

  // fill distances
  for (let i = 0; i < len; i++) {
    for (let j = i; j < len; j++) {
      let dis = !vertexes[i].adjacency.includes(j) || i === j ? Infinity : distanceBetweenTwoVertexes(vertexes[i], vertexes[j])

      distances[i][j] = dis
      distances[j][i] = dis

      pheromones[i][j] = DEFAULT_PHERO
      pheromones[j][i] = DEFAULT_PHERO
    }
  }

  let count = 0
  let minDis = Infinity
  while (count < 20) {
    let ants = []

    for (let i = 0; i < len; i++) {
      ants[i] = new Ant(i)

      while (ants[i].canMove(vertexes)) {
        // debugger
        ants[i].makeChoice(distances, pheromones, vertexes)
      }

      const path = ants[i].taboo

      if (!ants[i].isOnStart() || path.length !== vertexes.length) {
        continue
      }

      const dis = fullDistance(path, vertexes)

      if (dis < minDis) {
        bestAnt.push({ path, distance: dis })
        minDis = dis
        count = 0

        // drawEdges()
        // drawPath(bestAnt[bestAnt.length - 1].path, vertexes, 'red')
      }
    }

    ++count

    // todo: pheromones evapoation
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        pheromones[i][j] *= EVAPORATION
      }
    }
  }

  const bestPath = bestAnt[bestAnt.length - 1].path
  drawPath(bestPath, vertexes, 'green')
  ctx.beginPath()
  ctx.arc(vertexes[bestPath[vertexes.length - 1]].x, vertexes[bestPath[vertexes.length - 1]].y, 10, 0, Math.PI * 2)
  ctx.fillStyle = 'orange'
  ctx.fill()


  bestAnt.forEach(ant => {
    console.log(ant.distance)
    console.log(ant.path)
  });
}
