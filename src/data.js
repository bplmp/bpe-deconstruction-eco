import * as Papa from 'papaparse'
import * as Map from './map.js'
import * as Table from './table.js'
import * as Sidebar from './sidebar.js'

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/19ss6dmhb2B9qFWZQVODeYFJzMBCvyd5fPy8bjkA3CB8/pub?gid=1619676924&output=csv'

export {
  getSpreadsheetData
}

function getSpreadsheetData() {
  Papa.parse(publicSpreadsheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
      const data = results.data
      Map.init(data)
      // Table.init(data, '#table')
      Sidebar.init(data, '#sidebar')
    }
  })
}
