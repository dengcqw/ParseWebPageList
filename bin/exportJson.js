
const models = require('../server/models')
const fs = require('fs')

var args = process.argv.slice(2)
var date = args.length == 1 ? args[0] : models.createDateKey()

models.exportData(date)
.then(data => {
  let outputPath = process.cwd() + '/exportData.json'
  fs.writeFile(outputPath, JSON.stringify(data), err => {
    if (err) throw err
      console.log('export data to ', outputPath)
  })
})
.catch(err => console.log(err))

