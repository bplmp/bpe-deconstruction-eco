const ghpages = require('gh-pages')

const DIST_FOLDER = 'dist'

console.log(`---> deploying from folder: ${DIST_FOLDER}`)

ghpages.publish(DIST_FOLDER, function(err) {
  console.log(`---> error: ${err}`)
})

console.log('---> all done')
