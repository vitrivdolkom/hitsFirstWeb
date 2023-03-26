import { ctx } from "./global.js"

export const drawPath = (path, vertexes, color) => {
  const len = path.length


  for (let i = 0; i < len - 1; i++) {
    const from = { x: vertexes[path[i]].x, y: vertexes[path[i]].y }
    const to = { x: vertexes[path[i + 1]].x, y: vertexes[path[i + 1]].y }

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'white'
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = color
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'white'
  ctx.moveTo(vertexes[path[len - 1]].x, vertexes[path[len - 1]].y)
  ctx.lineTo(vertexes[path[0]].x, vertexes[path[0]].y)
  ctx.stroke()

  ctx.beginPath()
  ctx.lineWidth = 2
  ctx.strokeStyle = color
  ctx.moveTo(vertexes[path[len - 1]].x, vertexes[path[len - 1]].y)
  ctx.lineTo(vertexes[path[0]].x, vertexes[path[0]].y)
  ctx.stroke()
}