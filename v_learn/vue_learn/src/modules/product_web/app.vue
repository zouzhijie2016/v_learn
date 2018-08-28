<template>
    <div>
      <input type="hidden" id="timeZones" v-model="currentTime">
      <input type="hidden" id="timeNow" v-model="timeNow">
      <input type="hidden" id="rawOffset" v-model="zoneOffset">
      <input type="hidden" id="userName" v-model="userName">
      <g-header v-if="!$route.meta.isHeaderHide"></g-header>
        <div id="order_contentarea">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <div style="clear:both;"></div>
        </div>
      <g-footer v-if="!$route.meta.isFooterHide"></g-footer>
    </div>
</template>
<script>
import '~assets/css/base.css'
import {mapState} from 'vuex'
export default {
    data () {
        return {}
    },
    mounted () {
        window.NProgress.done()
        console.log('product web mounted executed!!')
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow', 'currentTime', 'userName'
        ])
    }
}
</script>
<style scoped>
    #order_contentarea {
        width: 1280px;
        margin: 16px auto 0px auto;
        min-height:680px;
        padding-bottom: 64px;

    }
</style>
