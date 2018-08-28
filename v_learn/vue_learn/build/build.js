var path = require('path')
var ora = require('ora')
var webpack = require('webpack')
var rm = require('rimraf')
var webpackConfig = require('../config/webpack.prod.conf')

var spinner = ora('building for ...'+process.env.NODE_ENV);
spinner.start();
rm(path.join(__dirname, '../dist/'), err=>{
    if(err)throw err
    webpack(webpackConfig, function(err, stats) {
        spinner.stop()
        if (err) {
            throw err
        }
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n')
    })
});

