/**
 * Created by zhijie.zou on 2018/3/30.
 */
define(['jquery', 'underscore', 'backbone', 'requireText!indexTpl'], function($, _, Backbone, template){

    return Backbone.View.extend({
        el : '#app',
        events : {

        },
        initialize : function () {
            this.render();

            return this
        },
        render : function () {
            var t = this;

            t.$el.html(template)
        }
    });
});