/**
 * Created by zhijie.zou on 2018/3/30.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var Router = Backbone.Router.extend({
        routes : {
            '' : 'index',
            'index' : 'index',
            'error' : 'error'
        },
        loadView : function (view) {
            this.view && this.view.$el.hide(500);
            this.view = view;
            var t = this;

            setTimeout(function () {
                t.view.$el.show()
            }, 500)

        },
        index : function () {
            var t = this;
            require(['../views/index'], function (view) {
                t.loadView(new view());
            })
        },
        error : function () {
            require(['../views/error'], function (view) {
                t.loadView(new view());
            })
        }
    })

    return new Router();
})