import { drawEdges } from "./drawEdges.js"

const createInput = () => {
  const input = document.createElement('input')
  input.placeholder = "0"
  input.type = "text"
  input.setAttribute("data-adjacency-input", "")
  input.classList.add("adjacencyCell")

  input.addEventListener('input', drawEdges)

  return input
}

const createCell = () => {
  const cell = document.createElement('td')
  cell.classList.add('cell')

  return cell
}

export const addCell = () => {
  const table = document.querySelector('table')
  const rows = document.querySelectorAll('tr')

  const size = rows.length

  if (!size) {
    const row = document.createElement('tr')
    const cell = createCell()

    cell.appendChild(createInput())
    row.appendChild(cell)
    table.appendChild(row)
    return
  }

  const row = document.createElement('tr')

  for (let i = 0; i <= size; i++) {
    const cell = createCell()

    cell.appendChild(createInput())
    row.appendChild(cell)
  }

  table.appendChild(row)

  rows.forEach(row => {
    const cell = createCell()

    cell.appendChild(createInput())
    row.appendChild(cell)
  })
}