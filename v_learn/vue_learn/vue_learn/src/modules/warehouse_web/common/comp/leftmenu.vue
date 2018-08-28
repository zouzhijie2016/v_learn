<template>
    <div>
        <div v-if="$route.meta.isContentSelf && userInfo && userInfo.facility" class="warehouse_receive_box">
            <div>
                <span class="warehouse_text">Warehouse:</span>
                <span class="warehouse_name">{{userInfo.facility}}</span>
                <a href="/warehouse/control/selectFacilityForm">(Change)</a>
            </div>
        </div>
        <div class="warehouse_box" v-if="!$route.meta.isContentSelf && userInfo && userInfo.facility">
            <span class="warehouse_text">Warehouse:</span>
            <span class="warehouse_name">{{userInfo.facility}}</span>
            <a href="/warehouse/control/selectFacilityForm">(Change)</a>
        </div>
        <div class="left_content_column" v-if="userInfo.result && userInfo.result.length" style="left: 10px;">
            <div class="left_section">
                <div class="left_section_titlebar">
                    <div class="titlebar_name">Shortcuts</div>
                </div>
                <div class="left_section_catalog">
                    <ul>
                        <li :class="{menu_active:!!item.selected}"  v-for="item in userInfo.result">
                            <a  @click="handle(item,$event)" :href="item.url">{{item.text}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import WareHouseApi from '~api/warehouseapi'

export default {
    props: ['urlPermiss'],
    data () {
        return {
            userInfo: {}
        }
    },
    beforeCreate () {
    },
    created () {
        this.getUserPermission()
    },
    mounted () {
    },
    methods: {
        handle (item, e) {
            if (/\/warehouse_web\/[^#]*#\/?/.test(item.url)) {
                e.preventDefault()
                e.stopImmediatePropagation()
                window.location.href = item.url
                window.location.reload()
                return true
            }
            return false
        },
        getUserPermission () {
            var _self = this
            WareHouseApi.getUserPermission().then(d => {
                if (d.resultCode == 1) {
                    if (d.result && d.result.length) {
                        this.getNewPremissionMenu(d.result)

                      let routePathReg;
                      if(_self.$route.path.substr(1) == 'receiveItem'){
                          routePathReg = new RegExp('/warehouse/control/receiveInventoryItem');
                      }else{
                          routePathReg = new RegExp('/warehouse_web/[^#]*' + '#/?' + _self.$route.path.substr(1))
                      }
	                    let routePathRegOther = new RegExp('/warehouse_web/[^#]*' + '#/?(newFindInventoryItemLog\/*|stockLogDetail\/*|receiveItem\/*)' )
	                    var authChecked = d.result.some((item) => {
                            if (routePathReg.test(item.url)) {
                                item.selected = true
                                return true
                            }
                            return false
                        })
//                        if(process.env.NODE_ENV === 'development') {
//                            d.result = d.result.concat([{
//                                text: "IMEI Managerment",
//                                url: "/warehouse_web/index.html#/IMEIManagerment"
//                            }])
//                        }
                        let urlPath = location.pathname+'#'+_self.$route.path;
                    	  if(routePathRegOther.test(urlPath)){
		                        authChecked = true;
                        }
                        var isHasPermiss = d.result.filter(function (item) {
                            return item.url == _self.urlPermiss
                        })
                        if (isHasPermiss && isHasPermiss.length > 0) {
                            authChecked = true
                        }
                        if (!authChecked) {
                            _self.userInfo = d
                            _self.showNoPermissionMessage('There is no access permission')
                            return
                        }
                        _self.userInfo = d
                    } else {
                        _self.showNoPermissionMessage('There is no access permission')
                    }
                } else {
                    _self.showNoPermissionMessage(d.errorMessage || 'There is no access')
                }
            }).catch(err => {
                _self.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        },
        showNoPermissionMessage (msg) {
            this.$message({
                showClose: true,
                message: msg || 'There is no access',
                type: 'error',
                onClose: () => {
                    if (process.env.NODE_ENV !== 'development') {
                        location.href = '/warehouse/control/selectFacilityForm'
                    } else {
                        location.href = '/user_web/index.html#/login'
                    }
                }
            })
        },
        getNewPremissionMenu(navList) {
            let currentModuleNavList = this.$store.state.navTrees;
            if(currentModuleNavList && currentModuleNavList.length) {
                let imeimanagerment = currentModuleNavList.filter(item=>{
                    return item.applicationName === 'warehouse_web' && item.shortName === 'imeiManagerment'
                })
                //TODO：删除当前IMEI Managerment数据, 解决opentaps数据权限与当前新权限重复的问题
                //TODO：Opentaps 功能全部迁移过来后可删除
                for (var i = navList.length-1; i >-1; i--) {
                    let obj = navList[i];
                    if(obj.url.indexOf('#/IMEIManagerment')>-1){
                        navList.splice(i, 1);
                        break;
                    }
                }

                if(imeimanagerment && imeimanagerment.length) {
                    navList.push({
                        text: imeimanagerment[0].description,
                        url: imeimanagerment[0].linkUrl
                    });
                }
            }
            return navList;
        }
    }
}
</script>
<style scoped>
    .warehouse_box{
        top: -40px;
        right: 20px;
        position: absolute;
    }
    .warehouse_receive_box{
        position: relative;
        width: 1280px;
        margin: 0 auto;
    }
    .warehouse_receive_box>div{
        position: absolute;
        top: -40px;
        right: 55px;
    }

    .warehouse_box .warehouse_text {
        font-weight: bold;
    }
    .warehouse_box span, .warehouse_box a {
        font-size: 12px;
    }

    .left_content_column {
        position: absolute;
        left: 10px;
        width: 168px;
    }

    .left_content_column .left_section {
        width: 100%;
        background-color: #fff;
        padding-bottom: 20px;
    }

    .left_content_column .titlebar_name {
        text-align: left;
        height: 45px;
        padding-left:10px;
        line-height: 45px;
        font-weight: bold;
        font-size: 18px;
    }

    .left_content_column .left_section_catalog {
        background-color: #fff;
    }

    .left_content_column .left_section_catalog li {
        height: 30px;
        line-height: 30px;
        margin: 3px;
        font-size: 12px;
        text-align: left;
        padding-left:10px;
    }

    .menu_active {
        background: #F7F7F7;
        border-left: 3px solid #1FBCD2;
    }

    .left_content_column .left_section_catalog li a {
        color: #333;
        display: block;
        width: 100%;
    }
</style>
