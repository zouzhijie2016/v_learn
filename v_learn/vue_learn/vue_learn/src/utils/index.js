import Vue from 'vue'
import './polyfill/index'
import lodashApi from './thirdparty/lodash'
import timezoneApi from './custom/timezonehelper'
import formatNumber from './custom/formatNumberHelper'
import customDirective from './directive/index'
import projectDebug from './project'
import * as piwikHelper from './custom/piwikhelper'
import filters from './filters/index'
import autoBind from './thirdparty/autobind'

Vue.use(customDirective)
Vue.use(projectDebug)
Vue.use(filters)

export default {
    autoBind,
    ...lodashApi,
    ...timezoneApi,
    ...formatNumber,
    ...piwikHelper
}

