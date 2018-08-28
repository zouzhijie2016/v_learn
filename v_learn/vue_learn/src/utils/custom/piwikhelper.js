/**
 * Created by lin.qiu on 2017/8/3.
 */
let pollfix = () => (window._paq = window._paq || [])
let pushPaq = (arr) => pollfix() && window._paq.push(arr)

function LoadPiwikScript (info) {
    var URL = `//${info.piwikHost}:${info.piwikPort}/`
    pushPaq(['setLinkTrackingTimer', 600])
    pushPaq(['setTrackerUrl', `${URL}piwik.php`])
    pushPaq(['setSiteId', info.piwikSiteId])
    if(info.userLogin && info.userLogin.userLoginId) {
        pushPaq(['setUserId', info.userLogin.userLoginId])
    }

    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0]
    g.type = 'text/javascript'
    g.async = true
    g.defer = true
    g.src = `${URL}piwik.js`
    s.parentNode.insertBefore(g, s)
}
function LoadPiwikScriptV2 (vueInfo) {
    var URL = `//${vueInfo.vueConfig.piwikHost}:${vueInfo.vueConfig.piwikPort}/`
    pushPaq(['setLinkTrackingTimer', 600])
    pushPaq(['setTrackerUrl', `${URL}piwik.php`])
    pushPaq(['setSiteId', vueInfo.vueConfig.piwikSiteId])
    pushPaq(['setUserId', vueInfo.userLoginId])

    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0]
    g.type = 'text/javascript'
    g.async = true
    g.defer = true
    g.src = `${URL}piwik.js`
    s.parentNode.insertBefore(g, s)
}

function TrackPageView (app) {
    let referenceURL = location.href
    if (window.Piwik && window.Piwik.getAsyncTracker) {
        let defaultAsyncTracker = window.Piwik.getAsyncTracker()
        referenceURL = defaultAsyncTracker.getCurrentUrl()
    }
    pushPaq(['deleteCustomVariables', 'page'])
    pushPaq(['setReferrerUrl', referenceURL])
    pushPaq(['setCustomUrl', location.href])
    pushPaq(['setDocumentTitle', document.title])
    pushPaq(['setGenerationTimeMs', 0])
    pushPaq(['MediaAnalytics::scanForMedia', app.$el])
    pushPaq(['FormAnalytics::scanForForms', app.$el])
    pushPaq(['trackContentImpressionsWithinNode', app.$el])
    pushPaq(['trackPageView'])
}

function trackEventPaq () {
    var arr = arguments
    if (!Array.isArray(arr)) {
        arr = Array.prototype.slice.call(arguments)
    }
    arr.unshift('trackEvent')
    if (arr.length < 2) {
        console.warn('track Event Arguments is not null')
        return
    }
    pushPaq(arr)
    return true
}

window.trackEventPaq = trackEventPaq
window.pushPaq = pushPaq

export {
    pushPaq,
    trackEventPaq,
    TrackPageView,
    LoadPiwikScript,
    LoadPiwikScriptV2
}
