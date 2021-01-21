import * as Data from './data.js'
import * as Map from './map.js'
import style from './style/main.scss'

const app = document.querySelector('#app')

app.innerHTML = `
<div id="spinner">
  <div class="spinner-grow text-secondary" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
<div id="map"></div>
<div id="mapLegend"></div>
<div class="table-wrapper">
  <table id="table" class="stripe display responsive" width="100%"></table>
</div>
`

window.addEventListener('DOMContentLoaded', init)

function init() {
  Data.getSpreadsheetData()

  const mapLegend = document.querySelector('#mapLegend')
  mapLegend.innerHTML = Map.mapLegend(Map.roleColors)
}
