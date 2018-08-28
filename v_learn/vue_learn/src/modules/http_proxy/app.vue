<template>
<div>
<vue-progress-bar></vue-progress-bar>
<el-row>
 <el-col :span="24">
   <div>
     <input type="hidden" id="timeZones" v-model="currentTime">
     <input type="hidden" id="timeNow" v-model="timeNow">
     <input type="hidden" id="rawOffset" v-model="zoneOffset">
     <input type="hidden" id="userName" v-model="userName">
     <el-menu theme="dark" :default-active="activeIndex" :router=true mode="horizontal" @select="handleSelect">
       <el-menu-item index="/" >SB Monitor</el-menu-item>
         <el-submenu index="/">
           <template slot="title">WorkSpace</template>
           <el-menu-item index="/serviceList">Service List</el-menu-item>
           <el-menu-item index="/serverList">Server List</el-menu-item>
         </el-submenu>
          <el-menu-item index="/springAdminProxy" >Spring Admin</el-menu-item>
          <el-menu-item index="/consulProxy" >Consul</el-menu-item>
          <el-menu-item index="/securityList" >Security List</el-menu-item>
       <!-- <el-menu-item index="3">
       </el-menu-item> -->
     </el-menu>
   </div>
 </el-col>
</el-row>
<div class="line"></div>
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script lang="babel">
import nodeApi from '~api/nodeApi'
import {mapState} from 'vuex'
export default {
    name: 'index-app',
    data () {
        return {
            isCollapse: true,
            activeIndex: 'serverList'
        }
    },
    async created () {
        this.$Progress.start()
        const data = await nodeApi.getAuthenticatorVerify()
        if (!data.success) {
            this.$router.push({ name: 'login'})
        }
    },
    mounted () {
        window.NProgress.done()
        this.$Progress.finish()
        this.$router.beforeEach((to, from, next) => {
            if (to.meta.progress !== undefined) {
                const meta = to.meta.progress
                this.$Progress.parseMeta(meta)
            }
            this.$Progress.start()
            next()
        })
        this.$router.afterEach((to, from) => {
            this.$Progress.finish()
        })
    },
    methods: {
        handleSelect (key, keyPath) {
            console.log(key, keyPath)
        },
        handleOpen (key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose (key, keyPath) {
            console.log(key, keyPath)
        }
    },
    metaInfo: {

    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow', 'currentTime', 'userName'
        ])
    }
}
</script>
