import * as Papa from 'papaparse'
import * as Map from './map.js'
import * as Table from './table.js'

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZ_aRgmKOVqj1Ch4zy8zzjkQREuYo0xXzPlJUKv4-7ULfWNNQdJbOFJgVFayS4zbT7vvkIaJ5JZaBa/pub?output=csv'

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
      Table.init(data, '#table')
    }
  })
}
