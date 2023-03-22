import { ctx, vertexes } from "./global.js"

export function drawEdges() {
  if (!vertexes.length) {
    alert("Add vertexes")
    return
  }

  const rows = document.querySelectorAll('tr')

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let j = 0; j < row.childNodes.length; j++) {
      const value = row.childNodes[j].firstChild.value;

      if (!value || i === j) {
        continue
      }
      debugger

      const to = j
      const from = i

      rows[to].childNodes[from].firstChild.value = '1'

      vertexes[from].addAdjacency(to)
      vertexes[to].addAdjacency(from)

      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#000000'
      ctx.moveTo(vertexes[from].x, vertexes[from].y)
      ctx.lineTo(vertexes[to].x, vertexes[to].y)
      ctx.stroke()

    }
  }
}
