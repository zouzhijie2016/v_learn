import Vue from 'vue'
import numberDirective from './v-number'
export default {
    install () {
        Vue.directive('number', numberDirective)
    }
}
