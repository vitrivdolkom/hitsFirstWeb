// import { antFn } from "./ant/scripts/script.js"

export const route = (e) => {
  e = e || window.event
  e.preventDefault()
  window.history.pushState({}, '', e.target.href)
  handleLocation()
}


const routes = {
  404: '<h1>404 error</h1>',
  '/': '/default.html',
  '/ant': '/ant/index.html',
}

const handleLocation = async () => {
  const path = window.location.pathname
  const route = routes[path]
  const html = await fetch(route).then(data => data.text())
  document.querySelector('div[data-algorithm-wrapper]').innerHTML = html
}

window.onpopstate = handleLocation
window.route = route

handleLocation()