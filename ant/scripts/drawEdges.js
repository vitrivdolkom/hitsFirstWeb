import { ctx, vertexes } from "./global.js"

export function drawEdges(e) {
  const row = e.target.dataset.row
  const column = e.target.dataset.column

  const rows = document.querySelectorAll('tr')

  if (!rows[row].childNodes[column].firstChild.value) {
    return
  }

  const to = column
  const from = row

  rows[to].childNodes[from].firstChild.value = '1'

  vertexes[from].addAdjacency(to)
  vertexes[to].addAdjacency(from)

  ctx.beginPath()
  ctx.lineWidth = 0.4
  ctx.strokeStyle = '#000000'
  ctx.moveTo(vertexes[from].x, vertexes[from].y)
  ctx.lineTo(vertexes[to].x, vertexes[to].y)
  ctx.stroke()
}
