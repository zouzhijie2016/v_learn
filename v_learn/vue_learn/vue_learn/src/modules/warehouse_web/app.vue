<template>
    <div>
        <input type="hidden" id="timeZones" v-model="currentTime">
        <input type="hidden" id="timeNow" v-model="timeNow">
        <input type="hidden" id="rawOffset" v-model="zoneOffset">
        <input type="hidden" id="userName" v-model="userName">
        <g-header-v2 v-if="!$route.meta.isHeaderHide"></g-header-v2>
        <div id="item_contentarea" v-bind:class="{'receive_content' : $route.meta.isContentSelf}">
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
import './assets/private.css'
import {mapState} from 'vuex'
export default {
    data () {
        return {}
    },
    mounted () {
        window.NProgress.done()
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow', 'currentTime', 'userName'
        ])
    }
}
</script>
<style scoped>
    #item_contentarea {
        position:relative;
        width: 1280px;
        margin: 0 auto;
        min-height:680px;
        padding:16px 0 50px 0;
    }
    .receive_content{
        position:static !important;
        width:100% !important;
        min-width:1280px;
    }
</style>
