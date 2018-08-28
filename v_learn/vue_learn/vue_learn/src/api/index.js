import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

import Util from './core/request'
import * as Base from './core/base'

Vue.use(VueAxios, Axios)

export default {
    ...Util,
    ...Base
}

