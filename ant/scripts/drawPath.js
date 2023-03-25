import { ctx } from "./global.js"

export const drawPath = (path, vertexes, color) => {
  const len = path.length

  for (let i = 0; i < len - 1; i++) {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.moveTo(vertexes[path[i]].x, vertexes[path[i]].y)
    ctx.lineTo(vertexes[path[i + 1]].x, vertexes[path[i + 1]].y)
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = color
  ctx.moveTo(vertexes[path[len - 1]].x, vertexes[path[len - 1]].y)
  ctx.lineTo(vertexes[path[0]].x, vertexes[path[0]].y)
  ctx.stroke()
}