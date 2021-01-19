import * as Map from './map.js'
import style from './style/main.scss'

const app = document.querySelector('#app')

app.innerHTML = `
<div id="spinner">
  <div class="spinner-grow text-secondary" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div id='map'></div>
<div id='mapLegend'></div>
`

window.addEventListener('DOMContentLoaded', Map.init)

const mapLegend = document.querySelector('#mapLegend')
mapLegend.innerHTML = Map.mapLegend(Map.roleColors)
