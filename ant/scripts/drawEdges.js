import { ctx, vertexes } from "./global.js"

export function drawEdges(e, full = false) {
  if (full) {
    const rows = document.querySelectorAll('tr')

    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows[i].childNodes.length; j++) {
        if (i === j) {
          continue
        }

        rows[i].childNodes[j].firstChild.value = 1
        rows[j].childNodes[i].firstChild.value = 1

        const to = j
        const from = i

        vertexes[from].addAdjacency(to)
        vertexes[to].addAdjacency(from)

        ctx.beginPath()
        ctx.arc(vertexes[from].x, vertexes[from].y, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#000000'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(vertexes[to].x, vertexes[to].y, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#000000'
        ctx.fill()

        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = 'white'
        ctx.moveTo(vertexes[from].x, vertexes[from].y)
        ctx.lineTo(vertexes[to].x, vertexes[to].y)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineWidth = 0.4
        ctx.strokeStyle = '#000000'
        ctx.moveTo(vertexes[from].x, vertexes[from].y)
        ctx.lineTo(vertexes[to].x, vertexes[to].y)
        ctx.stroke()
      }
    }

    return
  }

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
  ctx.lineWidth = 2
  ctx.strokeStyle = 'white'
  ctx.moveTo(vertexes[from].x, vertexes[from].y)
  ctx.lineTo(vertexes[to].x, vertexes[to].y)
  ctx.stroke()

  ctx.beginPath()
  ctx.lineWidth = 0.4
  ctx.strokeStyle = '#000000'
  ctx.moveTo(vertexes[from].x, vertexes[from].y)
  ctx.lineTo(vertexes[to].x, vertexes[to].y)
  ctx.stroke()
}
