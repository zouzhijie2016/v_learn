/**
 * Created by zhijie.zou on 2018/3/30.
 */
define(['jquery', 'underscore', 'backbone', 'router'], function ($, _, Backbone, router) {
    var App = {
        initialize : function () {
            console.log('welcome');
            Backbone.history.start();
        }
    }

    return App
});