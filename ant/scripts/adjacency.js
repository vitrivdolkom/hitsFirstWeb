const inputTemplate = '<input type="text" id="" placeholder="0" data-adjacency-input />'


export const addCell = () => {
  const table = document.querySelector('table')
  const rows = document.querySelectorAll('tr')

  const size = rows.length

  if (size > 10) {
    alert('Too much vertexes')
    return
  }

  if (!size) {
    const row = document.createElement('tr')
    const cell = document.createElement('td')
    cell.innerHTML = inputTemplate

    row.appendChild(cell)
    table.appendChild(row)
    return
  }

  const row = document.createElement('tr')

  for (let i = 0; i <= size; i++) {
    const cell = document.createElement('td')
    cell.innerHTML = inputTemplate

    row.appendChild(cell)
  }

  table.appendChild(row)

  rows.forEach(row => {
    const cell = document.createElement('td')
    cell.innerHTML = inputTemplate

    row.appendChild(cell)
  })
}