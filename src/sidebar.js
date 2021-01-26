export {
  init,
  showSidebar,
  hideSidebar
}

function init(data, elementId, map) {
  const rows = []
  for (var i = 0; i < data.length; i++) {
    let row = data[i]
    let rowHTML = `<div class="sidebar-row" id="sidebar-${row['ID']}">
      <h3 id="header-${row['ID']}">${row['ENTITY']} ${row['LOCATION'] ? `- <span>${row['LOCATION']}</span>` : ''}</h3>
      <table class="sidebar-table">
        <tbody>
          <tr><td><strong>Role(s)</strong></td><td>${row['ROLE(S)']}</td></tr>
          <tr><td><strong>Address</strong></td><td>${row['FULL ADDRESS']}</td></tr>
          <tr><td><strong>Contact</strong></td><td>${row['CONTACT']}</td></tr>
          <tr><td><strong>Email</strong></td><td>${row['EMAIL']}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${row['PHONE']}</td></tr>
          <tr><td><strong>Website</strong></td><td><a href="${row['WEBSITE']}" target="_blank">${row['WEBSITE']}</a></td></tr>
        </tbody>
      </table>
      <p class="sidebar-p"><strong>Collaboration Opportunities: </strong>${row['COLLABORATION OPPORTUNITIES']}</p>
    </div>`
    rows.push(rowHTML)
  }
  const content = (`
    <div id="sidebar-header">
      <a href="#" id="sidebar-collapse">
        <svg width="30" height="30" fill="#fff" viewBox="0 0 638 1030" aria-labelledby="besi-ant-caret-right-title" id="si-ant-caret-right"><title id="besi-ant-caret-right-title">icon caret-right</title><path d="M68 13l558 476q12 11 12 26t-12 26L68 1017q-19 16-43.5 7T0 991V39Q0 15 24.5 6T68 13z"></path></svg>
      </a>
      <a href="#" id="sidebar-show" class="invisible">
        <svg width="30" height="30" fill="#fff" viewBox="0 0 638 1030" aria-labelledby="bdsi-ant-caret-left-title" id="si-ant-caret-left"><title id="bdsi-ant-caret-left-title">icon caret-left</title><path d="M570 13L12 489Q0 500 0 515t12 26l558 476q19 16 43.5 7t24.5-33V39q0-24-24.5-33T570 13z"></path></svg>
      </a>
    </div>
    <div id="sidebar">${rows.join('\n')}</div>
  `)
  const sidebar = document.querySelector(elementId)
  sidebar.innerHTML = content

  const sidebarCollapse = document.querySelector('#sidebar-collapse')
  const sidebarShow = document.querySelector('#sidebar-show')
  sidebarCollapse.onclick = function () {
    hideSidebar()
  }
  sidebarShow.onclick = function () {
    showSidebar()
  }

  // // go to map location when clicking on row header
  // for (var i = 0; i < data.length; i++) {
  //   let row = data[i]
  //   let headerId = `#header-${row['ID']}`
  //   let rowHeader = document.querySelector(headerId)
  //   rowHeader.onclick = function () {
  //     if (Number(row['LAT']) !== 0) {
  //       map.flyTo([Number(row['LAT']), Number(row['LON'])], 12)
  //     }
  //   }
  // }
}

function showSidebar() {
  const sidebar = document.querySelector('#sidebar-wrapper')
  const sidebarCollapse = document.querySelector('#sidebar-collapse')
  const sidebarShow = document.querySelector('#sidebar-show')
  sidebar.classList.remove('sidebar-collapse')
  sidebarCollapse.classList.add('visible')
  sidebarCollapse.classList.remove('invisible')
  sidebarShow.classList.add('invisible')
  sidebarShow.classList.remove('visible')
}

function hideSidebar() {
  const sidebar = document.querySelector('#sidebar-wrapper')
  const sidebarCollapse = document.querySelector('#sidebar-collapse')
  const sidebarShow = document.querySelector('#sidebar-show')
  sidebar.classList.add('sidebar-collapse')
  sidebarCollapse.classList.add('invisible')
  sidebarCollapse.classList.remove('visible')
  sidebarShow.classList.add('visible')
  sidebarShow.classList.remove('invisible')
}
