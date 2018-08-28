/* global require, module, __dirname */

var path = require('path')
var webpack = require('webpack')
var entris = require('./entris')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


var projectRoot = path.resolve(__dirname, '../src/')
var elementRoot = path.join(__dirname, '../node_modules/element-ui/src');
var env = process.env.NODE_ENV
// vendor: ['vue', 'vue-router','vuex','vueg', 'vue-meta','axios','vue-axios','js-cookie','lodash']

var baseWebpackConfig = {
    entry: {
        // vendor: ['vue']
        vendor: ['vue', 'vue-router','vuex','axios','vue-axios','js-cookie','vueg', 'vue-meta']
    },
    output: {
        path: "/",
        publicPath: "/",
        filename: '[name].js',
        chunkFilename: "[name].js"
    },
    externals: {
        // 'jquery': 'jQuery'
    },
    resolve: {
        extensions: [
            '.js', '.vue'
        ],
        modules: [
            path.join(__dirname, '../node_modules'),
        ],
        alias: {
            '~src': path.resolve(__dirname, '../src'),
            '~api': path.resolve(__dirname, '../src/api'),
            '~assets': path.resolve(__dirname, '../src/assets'),
            '~store': path.resolve(__dirname, '../src/store'),
            '~components': path.resolve(__dirname, '../src/components'),
            '~modules': path.resolve(__dirname, '../src/modules'),
            '~utils': path.resolve(__dirname, '../src/utils'),
            '~user-modules':path.resolve(__dirname, '../src/modules/user_web'),
            '~user-components':path.resolve(__dirname, '../src/modules/user_web/components'),
            '~report-modules':path.resolve(__dirname, '../src/modules/report_web'),
            '~report-components':path.resolve(__dirname, '../src/modules/report_web/components'),
            '~report-common':path.resolve(__dirname, '../src/modules/report_web/components/common'),
            '~store-modules':path.resolve(__dirname, '../src/modules/store_web'),
            '~store-components':path.resolve(__dirname, '../src/modules/store_web/components'),
            '~product-modules':path.resolve(__dirname, '../src/modules/product_web'),
            '~product-components':path.resolve(__dirname, '../src/modules/product_web/components'),
            '~order-modules':path.resolve(__dirname, '../src/modules/order_web'),
            '~store-common':path.resolve(__dirname, '../src/modules/store_web/common'),
            '~order-components':path.resolve(__dirname, '../src/modules/order_web/components'),
            '~warehouse-modules':path.resolve(__dirname, '../src/modules/warehouse_web'),
            '~warehouse-common':path.resolve(__dirname, '../src/modules/warehouse_web/common'),
            '~warehouse-components':path.resolve(__dirname, '../src/modules/warehouse_web/components'),
            '~setting-modules':path.resolve(__dirname, '../src/modules/setting_web'),
            '~setting-common':path.resolve(__dirname, '../src/modules/setting_web/common'),
            '~setting-components':path.resolve(__dirname, '../src/modules/setting_web/components'),
        }
    },
    resolveLoader: {
        modules: [path.join(__dirname, '../node_modules')]
    },
    module: {
        rules: [
            // {
            //     test: /\.vue$/,
            //     loader: 'eslint-loader',
            //     enforce: "pre",
            //     include: projectRoot,
            //     exclude: /node_modules/
            // }, {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     enforce: "pre",
            //     include: projectRoot,
            //     exclude: /node_modules/
            // },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [projectRoot],
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.html$/,
                loader: 'vue-html-loader'
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 2048,
                    name: 'assets/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: 'assets/media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 5000,
                    name: 'assets/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new LodashModuleReplacementPlugin(),
        // new webpack.ProvidePlugin({$: 'window.jQuery', jQuery: 'window.jQuery', jquery: 'window.jQuery'})
    ]
}
baseWebpackConfig.entry = Object.assign(baseWebpackConfig.entry, entris)
module.exports = baseWebpackConfig
