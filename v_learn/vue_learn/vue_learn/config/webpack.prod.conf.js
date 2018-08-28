/* global require, module, process */
var path = require("path")
var entris = require('./entris')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var commonStyle = new ExtractTextPlugin('assets/css/common.[contenthash:7].css');
var extractStyle = new ExtractTextPlugin('assets/css/[name].[contenthash:7].css');
const resolve = require('path').resolve;
// var stableChunkArr = ['axios','js-cookie','lodash','vue','vue-axios','vuex','vueg', 'vue-meta'];
// var stableChunkArr = ['vue', 'vue-router','vuex','axios','vue-axios','js-cookie','vueg', 'vue-meta']
// var entryPoints = baseWebpackConfig.entry;

// console.log( Object.keys(entryPoints).filter(key => key !== "vendor"));

baseWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: [
            //打包公共组件CSS样式为独立包，在各个项目中统一公用
            {
                test: /\.css$/,
                loader: commonStyle.extract(['css-loader', 'postcss-loader']),
                include: [resolve(__dirname, './../src/assets/el-theme'), resolve(__dirname, './../src/components'), resolve(__dirname, './../node_modules')]
            },
            //打包各个modules的css样式包
            {
                test: /\.css$/,
                loader: extractStyle.extract(['css-loader', 'postcss-loader']),
                exclude: [resolve(__dirname, './../src/assets/el-theme'), resolve(__dirname, './../src/components'), resolve(__dirname, './../node_modules')]
            }
        ]
    },
    devtool: false,
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'assets/js/[name].[chunkhash:7].js',
        chunkFilename: 'assets/js/[name].[chunkhash:7].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                // const preg = /\.js$/
                // && preg.test(module.resource)
                var filePath = module.resource;
                var modulesDir = path.join(__dirname, '../node_modules');
                var flag = (filePath && /\.js$/.test(filePath) && filePath.indexOf(modulesDir) === 0);
                // !stableChunkArr.some(x=>filePath.indexOf(x)>-1)
                // return module.resource && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
                // console.log(module.resource, flag);
                // if(flag) {
                // }
                return flag;
            },
            // chunks: Object.keys(entryPoints).filter(key => key !== "vendor")
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'stablevendor',
        //     minChunks(module) {
        //         var filePath = module.resource;
        //         var modulesDir = path.join(__dirname, '../node_modules');
        //         var flag = (filePath && /\.js$/.test(filePath) &&
        //             !stableChunkArr.some(x=>filePath.indexOf(x)>-1) && filePath.indexOf(modulesDir) === 0
        //         );
        //         return flag;
        //     }
        // }),
        new webpack.optimize.CommonsChunkPlugin({name: 'manifest', chunks: ['vendor']}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // new ExtractTextPlugin('assets/css/[name].[contenthash:7].css'),
        commonStyle,
        extractStyle,
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: 'static',
                ignore: ['.*']
            }
        ])
    ]
});

Object.keys(entris).forEach(function(entry) {
    baseWebpackConfig.plugins.push(new HtmlWebpackPlugin({
        chunks: [ 'manifest', 'vendor', entry ],
        filename: entry + '.html',
        template: 'src/template/index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS:true,
            minifyJS:true
        },
        chunksSortMode (chunk1, chunk2) {
            var orders = ['manifest', 'vendor', entry]
            var order1 = orders.indexOf(chunk1.names[0])
            var order2 = orders.indexOf(chunk2.names[0])
            return order1 - order2
        }
    }))
})
if (process.env.npm_config_report) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    baseWebpackConfig.plugins.push(new BundleAnalyzerPlugin({
// Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'server',
        // Host that will be used in `server` mode to start HTTP server.
        analyzerHost: '127.0.0.1',
        // Port that will be used in `server` mode to start HTTP server.
        analyzerPort: 7777,
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        // Module sizes to show in report by default.
        // Should be one of `stat`, `parsed` or `gzip`.
        // See "Definitions" section for more information.
        defaultSizes: 'parsed',
        // Automatically open report in default browser
        openAnalyzer: true,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: false,
        // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
        // Relative to bundles output directory.
        statsFilename: 'stats.json',
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules from stats file with `source: false` option.
        // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        logLevel: 'info'
    }))
}

module.exports = baseWebpackConfig
