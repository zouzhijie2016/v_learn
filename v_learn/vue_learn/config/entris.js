var fs = require('fs')
// var path = require('path')
var glob = require('glob')
// var entryPath = path.resolve(__dirname, '../src/modules')
//
// var entris = fs.readdirSync(entryPath).reduce(function (o, dirname) {
//     o[dirname] = path.join(entryPath, dirname)
//     return o
// }, {})

const entries = {}
const chunks = []
glob.sync('./src/modules/**/index.js').forEach(path => {
    const chunk = path.split('./src/modules/')[1].split('.js')[0]
    entries[chunk] = path
    chunks.push(chunk)
})



console.log(entries)

module.exports = entries
