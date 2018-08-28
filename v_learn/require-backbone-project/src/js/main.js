/**
 * Created by zhijie.zou on 2018/3/30.
 */
require.config({
    paths : {
        'jquery' : 'vendor/jquery',
        'underscore' : 'vendor/underscore',
        'backbone' : 'vendor/backbone',
        'requireText' : 'vendor/text',
        'indexTpl' : '../templates/index.html'
    },
    shim: {
        'jquery':{
            exports: 'jQuery'
        },
        'underscore':{
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        }
    }
});

require(['app'], function (App) {
    App.initialize()
});