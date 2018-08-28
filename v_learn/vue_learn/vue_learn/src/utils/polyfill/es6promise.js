/**
 * Created by lin.qiu on 2017/8/17.
 * The solution to WebPack internal needs is Promise,But you can't be polyfill by babel-loader
 */
if (!window.Promise) {
    window.Promise = Promise
}
