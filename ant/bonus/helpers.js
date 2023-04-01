export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min
}

export const getCellIndexes = (x, y, per) => {
    let row = Math.floor(y / per)
    let column = Math.floor(x / per)

    row = row === 0 ? row : row - 1
    column = column === 0 ? column : column - 1

    return { row, column }
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
    const x = Math.round(startX + distance * Math.cos(endAngle))
    const y = Math.round(startY + distance * Math.sin(endAngle))

    return { x: x, y: y }
}
