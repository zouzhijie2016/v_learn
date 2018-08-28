var path = require("path")
var webpack = require('webpack')
var merge = require('webpack-merge')
var entris = require('./entris')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var config = merge(baseWebpackConfig, {
    module: {
        rules: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader!postcss-loader'
        }]
    },
    output: {
        publicPath: '/'
    },
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({'process.env': {NODE_ENV: '"development"'}}),
        new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
})

console.log(entris)

Object.keys(entris).forEach(function(entry) {
    config.plugins.push(
        new HtmlWebpackPlugin({
            chunks: ['vendor', entry],
            filename: entry + '.html',
            template: 'src/template/index.html',
            inject: true
        })
    )
})

Object.keys(config.entry).forEach(function(name) {
    config.entry[name] = ['./config/dev-client'].concat(config.entry[name])
})

module.exports = config
