export {
  init
}

function init(data, elementId) {
  const rows = []
  for (var i = 0; i < data.length; i++) {
    let row = data[i]
    let rowHTML = `<div class="sidebar-row" id="sidebar-row-${i}">
      <h3>${row['ENTITY']} ${row['LOCATION'] ? `- <span>${row['LOCATION']}</span>` : ''}</h3>
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
  const content = rows.join('\n')
  document.querySelector(elementId).innerHTML = content
}
