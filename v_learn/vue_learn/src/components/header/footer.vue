<template>
    <div id="yiwill_footer">
        <div class="copyright_content">
            <a href="/warehouse/control/ListTimezones" class="time_zones">
                <span>{{currentTime}}</span> -
                <span>{{timeZoneArea}}</span> </a>
            <p>All Right Reserved(c) 2016-2017 YIWILL - www.yiwill.com</p>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import * as types from '~store/mutation-types'
export default {
    data () {
        return {}
    },
    computed: {
        ...mapState([
            'timeNow',
            'zoneOffset',
            'currentTime',
            'timeZoneArea',
            'userName',
            'commonInfo',
            'hideHeaderAndFooter'
        ])
    }

}
</script>
<style scoped>
    #yiwill_footer {
        width: 100%;
        position: absolute;
        bottom: 0;
    }
    #yiwill_footer .copyright_content {
        width: 1280px;
        margin: 0 auto;
        text-align: center;
    }

    #yiwill_footer .copyright_content p, #yiwill_footer .copyright_content a {
        width: 100%;
        height: 25px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #424242;
        margin: 0;
    }

    #yiwill_footer .copyright_content p, #yiwill_footer .copyright_content a {
        width: 100%;
        height: 25px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        color: #424242;
        margin: 0;
    }

    #yiwill_footer .copyright_content span:nth-of-type(2) {
        color: #110099;
    }
</style>
