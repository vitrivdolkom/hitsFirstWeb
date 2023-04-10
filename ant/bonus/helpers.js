export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min
}

export const getCellIndexes = (x, y, per) => {
    let row = Math.floor(y / per)
    let column = Math.floor(x / per)

    return { row: row, column: column }
}

export const getBlendedColors = (R1, G1, B1, R2, G2, B2) => {
    let Blend = 127
    const R = R1 + ((R2 - R1) * Blend) / 255
    const G = Math.max(G1, G2)
    const B = B1 + ((B2 - B1) * Blend) / 255
    return { R, G, B }
}

export const drawCell = (colors, row, column, per, context) => {
    const R = colors[row][column].red
    const G = colors[row][column].green
    const B = colors[row][column].blue

    context.beginPath()
    context.save()
    context.fillStyle = `rgb(${R}, ${G}, ${B})`
    context.fillRect(column * per, row * per, per, per)
    context.restore()
}

export const distanceBetweenTwoVertexes = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export const withPixel = (num) => {
    return `${num}px`
}

export const getNextPoint = (startX, startY, distance, angle, toAngle) => {
    const endAngle = ((angle + toAngle) * Math.PI) / 180
    const x = startX + distance * Math.cos(endAngle)
    const y = startY + distance * Math.sin(endAngle)

    return { x: x, y: y }
}

export const inRange = (num, from, to, newFrom, newTo) => {
    const old_range = to - newFrom
    const new_range = newTo - newFrom
    const converted = ((num - from) * new_range) / old_range + newFrom

    return converted
}

export const getAngle = (x1, y1, angle, x2, y2, distance) => {
    const endX = getNextPoint(x1, y1, distance, angle, 0).x
    const endY = getNextPoint(x1, y1, distance, angle, 0).y

    const v1 = { x: endX - x1, y: endY - y1 }
    const v2 = { x: x2 - x1, y: y2 - y1 }
    const dotProduct = v1.x * v2.x + v1.y * v2.y
    const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
    const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
    const cosTheta = dotProduct / (magnitudeV1 * magnitudeV2)
    const theta = Math.acos(cosTheta)
    const crossProduct = v1.x * v2.y - v1.y * v2.x
    const resultAngle = (theta * 180) / Math.PI

    return crossProduct < 0 ? -resultAngle : resultAngle
}
