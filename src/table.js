// var $ = require( 'jquery' )
// var dt = require( 'datatables.net' )( window, $ )
import * as $ from 'jquery'
import * as dt from 'datatables.net'
import * as dtResponsive from 'datatables.net-responsive'

export {
  init
}

function init(data, elementId) {
  $(elementId).DataTable({
    data: data,
    responsive: true,
    columns: [{
        data: 'ENTITY',
        title: 'ENTITY',
      },
      {
        data: 'ROLE(S)',
        title: 'ROLE(S)',
      },
      {
        data: 'FULL ADDRESS',
        title: 'FULL ADDRESS',
      },
      {
        data: 'CONTACT',
        title: 'CONTACT',
      },
      {
        data: 'EMAIL',
        title: 'EMAIL',
        render: function(data, type, full, meta) {
          return `<a href="mailto:${data}">${data}</a>`
        }
      },
      {
        data: 'PHONE',
        title: 'PHONE',
        render: function(data, type, full, meta) {
          return `<a href="tel:${data}">${data}</a>`
        }
      },
      {
        data: 'WEBSITE',
        title: 'WEBSITE',
        render: function(data, type, full, meta) {
          return `<a href="${data}" target="_blank">${data}</a>`
        }
      }
    ]
  })
}
