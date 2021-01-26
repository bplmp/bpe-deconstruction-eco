import * as L from 'leaflet'
import * as Sidebar from './sidebar.js'

const MAPBOX_LINK = 'https://api.mapbox.com/styles/v1/bernardosp/ck3r9ne5k21bj1dpdgl67vzyu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmVybmFyZG9zcCIsImEiOiJjamkyMmhqdjAwZ284M2txcHpqYjUwam91In0.RiploEl5Mm6bjXhPZbN6XQ'
const LAT_COL = 'LAT'
const LON_COL = 'LON'
const INITIAL_COORDS = [37.76496739271615, -122.39985495803376]
const INITIAL_ZOOM = 8

const roleColors = {
  'Consulting': '#ff7f0e',
  'Deconstruction': '#2ca02c',
  'Government / Public Agency': '#aec7e8',
  'Reuse': '#9467bd',
  'Waste Management & Recycling': '#bcbd22',
}

export {
  init,
  roleColors,
  mapLegend,
}

function init(data) {
  const geoJSON = buildGeoJSON(data)
  console.log(data)
  console.log(geoJSON)
  console.log(data.length, 'rows received')
  console.log(geoJSON.features.length, 'rows parsed')
  setTimeout(function(){
    document.getElementById('spinner').style.display = 'none'
  }, 350)
  const map = loadMap(geoJSON)
  return map
}

function buildFeature(feature) {
  let featureObject = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": []
    }
  }
  for (let variable in feature) {
    if (feature.hasOwnProperty(variable)) {
      featureObject.properties[variable.trim()] = feature[variable].trim()
    }
  }
  featureObject.geometry.coordinates.push(parseFloat(feature[LON_COL]))
  featureObject.geometry.coordinates.push(parseFloat(feature[LAT_COL]))
  return featureObject
}

function buildGeoJSON(data) {
  let featureCollection = {
    "type": "FeatureCollection",
    "features": []
  }
  for (var i = 0; i < data.length; i++) {
    let feature = data[i]
    feature[LON_COL] = feature[LON_COL].replace(',', '.')
    feature[LAT_COL] = feature[LAT_COL].replace(',', '.')
    let lon = feature[LON_COL]
    let lat = feature[LAT_COL]
    if (lon.match(/[a-z]/i) && lat.match(/[a-z]/i)) {
      feature[LON_COL] = parseDMS(feature[LON_COL])
      feature[LAT_COL] = parseDMS(feature[LAT_COL])
    }
    try {
      if (isNaN(parseFloat(lon)) == false && isNaN(parseFloat(lat)) == false) {
        let built = buildFeature(feature)
        featureCollection['features'].push(built)
      }
    } catch (e) {
        console.log('error parsing row', i, e)
    }
  }
  return featureCollection
}

function loadMap(geoJSON) {
  const map = L.map('map', {
    center: INITIAL_COORDS,
    zoom: INITIAL_ZOOM,
    scrollWheelZoom: false
  })

  L.tileLayer(MAPBOX_LINK, {
    maxZoom: 18,
    attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
  }).addTo(map)

  function popup(feature, layer) {
    layer.bindPopup(`
      <div class="popup">
        <h3>${feature.properties['ENTITY']}</h3>
        ${feature.properties['LOCATION'] ? `<h4>${feature.properties['LOCATION']}</h4>` : ''}
      </div>
    `)

    layer.on('click', function (e) {
      const prop = e.target.feature.properties
      const id = `sidebar-${prop['ID']}`
      Sidebar.showSidebar()
      setTimeout(function(){ location.hash = "#" + id }, 300)

    })
  }

  const pointsLayers = L.geoJSON(geoJSON, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 9,
        fillColor: roleColors[feature.properties['GENERAL ROLE']],
        color: "#fff",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9,
      })
    },
    onEachFeature: popup
  }).addTo(map)


  map.on('dragend', function(event) {
    Sidebar.hideSidebar()
  })

  return map
}

// https://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values
function parseDMS(input) {
    let parts = input.split(/[^\d\w\.]+/)
    return convertDMSToDD(parts[0], parts[1], parts[2], parts[3])
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = parseInt(degrees) + parseInt(minutes)/60 + parseInt(seconds)/(60*60)

    if (direction == "S" || direction == "W") {
        dd = dd * -1
    }
    return dd
}

function mapLegend(colors) {
  const colorsHTML = [`
    <div id="map-legend-show" class="map-legend-row map-legend-icon flex visible">
      <span>See Legend</span>
    </div>
    <div id="map-legend-hide" class="map-legend-row map-legend-icon flex invisible">
      <span>Hide Legend</span>
    </div>
  `]
  for (let variable in colors) {
    if (colors.hasOwnProperty(variable)) {
      colorsHTML.push(`
        <div class="map-legend-row map-legend-content flex invisible">
          <div class="map-legend-color" style="background: ${colors[variable]}"></div>
          <span>${variable}</span>
        </div>
      `)
    }
  }
  return `<div class="map-legend flex flex-column">${colorsHTML.join('\n')}</div>`
}
