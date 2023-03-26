import { route } from "./router.js"

const pageHrefs = document.querySelectorAll('a[data-page-href]')
debugger

pageHrefs.forEach(href => {
  href.addEventListener('click', route)
})