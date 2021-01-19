import * as Papa from 'papaparse'
import * as L from 'leaflet'

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/19ss6dmhb2B9qFWZQVODeYFJzMBCvyd5fPy8bjkA3CB8/pub?gid=1619676924&output=csv'
const MAPBOX_LINK = 'https://api.mapbox.com/styles/v1/bernardosp/ck3r9ne5k21bj1dpdgl67vzyu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmVybmFyZG9zcCIsImEiOiJjamkyMmhqdjAwZ284M2txcHpqYjUwam91In0.RiploEl5Mm6bjXhPZbN6XQ'
const LAT_COL = 'LAT'
const LON_COL = 'LON'
const INITIAL_COORDS = [37.76496739271615, -122.39985495803376]
const INITIAL_ZOOM = 8

const roleColors = {
  'Architectural / Consulting Firm': '#ff7f0e',
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

function init() {
  Papa.parse(publicSpreadsheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
      const data = results.data
      const geoJSON = buildGeoJSON(data)
      console.log(data)
      console.log(geoJSON)
      console.log(data.length, 'rows received')
      console.log(geoJSON.features.length, 'rows parsed')
      loadMap(geoJSON)
      setTimeout(function(){
        document.getElementById('spinner').style.display = 'none'
      }, 350)
    }
  })
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
      featureObject.properties[variable] = feature[variable]
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
  const map = L.map('map').setView(INITIAL_COORDS, INITIAL_ZOOM)

  L.tileLayer(MAPBOX_LINK, {
    maxZoom: 18,
    attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
  }).addTo(map)

  function popup(feature, layer) {
    let prop = feature.properties
    let entityName = 'ENTITY'
    let address = 'FULL ADDRESS'
    let locationName = 'LOCATION NAME'
    let generalRole = 'GENERAL ROLE'
    let role = 'ROLE(S)'
    let link = 'WEBSITE'
    let contact = 'CONTACT'
    let email = 'EMAIL'
    let phone = 'PHONE'

    function generateLine(prop, propKey) {
      return (prop[propKey] ? `<tr><td><strong>${propKey}</strong></td><td>${prop[propKey]}</td></tr>` : '')
    }
    function generateLink(prop, propKey, linkText) {
      return (prop[propKey] ? `<tr><td colspan="2"><strong><a href="${prop[propKey]}" target="_blank">${linkText}</a></strong></td></tr>` : '')
    }

    let popupContent = `
      ${generateLine(prop, 'ENTITY')}
      ${generateLine(prop, 'GENERAL ROLE')}
      ${generateLine(prop, 'ROLE(S)')}
      ${generateLine(prop, 'LOCATION NAME')}
      ${generateLine(prop, 'FULL ADDRESS')}
      ${generateLine(prop, 'CONTACT')}
      ${generateLine(prop, 'EMAIL')}
      ${generateLine(prop, 'PHONE')}
      ${generateLink(prop, link, 'WEBSITE')}
    `

    layer.bindPopup(`
      <table class="table table-sm">
        <tbody>
          ${popupContent}
        </tbody>
      </table>`)
  }

  const pointsLayers = L.geoJSON(geoJSON, {
    pointToLayer: function(feature, latlng) {
      console.log(feature);
      return L.circleMarker(latlng, {
        radius: 9,
        fillColor: roleColors[feature.properties['GENERAL ROLE']],
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9,
      })
    },
    onEachFeature: popup
  }).addTo(map)

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
  const colorsHTML = []
  for (let variable in colors) {
    if (colors.hasOwnProperty(variable)) {
      colorsHTML.push(`
        <div class="map-legend-row flex">
          <div class="map-legend-color" style="background: ${colors[variable]}"></div>
          <span>${variable}</span>
        </div>
      `)
    }
  }
  return `<div class="map-legend flex flex-column">${colorsHTML.join('\n')}</div>`
}