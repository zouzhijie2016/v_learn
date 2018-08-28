<template>
    <div>
        <input type="hidden" id="timeZones" v-model="currentTime">
        <input type="hidden" id="timeNow" v-model="timeNow">
        <input type="hidden" id="rawOffset" v-model="zoneOffset">
        <input type="hidden" id="userName" v-model="userName">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
import '~assets/css/base.css'
import {mapState} from 'vuex'
export default {
    data () {
        return {

        }
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
<style>

</style>
