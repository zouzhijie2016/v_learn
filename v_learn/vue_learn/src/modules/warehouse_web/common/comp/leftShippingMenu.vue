<template>
    <div>
        <div class="warehouse_box" v-if="userInfo && userInfo.facility">
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
                          <li v-for="item in userInfo.result" :class="{menu_active:item.routerUrl.indexOf(urlPermiss)>-1}">
                            <router-link v-bind:to="item.routerUrl">{{item.text}}</router-link>
                          </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import WareHouseApi from '~api/warehouseapi'
import shippingApi from '~api/warehouse/shippingApi'
export default {
    props: ['urlPermiss'],
    data () {
        return {
            userInfo: {
                facility: '',
                result: [
                    {text: 'Shipping Needed Order List', url: '/warehouse_web/index.html#/shippingNeedOrderList', selected: false, routerUrl: '/shippingNeedOrderList'},
                    {text: 'Pack Order', url: '/warehouse_web/index.html#/parkOrder', selected: false, routerUrl: '/parkOrder'},
                    {text: 'Schedule Shipment', url: '/warehouse_web/index.html#/scheduleShipment', selected: false, routerUrl: '/scheduleShipment'},
                    {text: 'Complete Shipment', url: '/warehouse_web/index.html#/completeShipment', selected: false, routerUrl: '/completeShipment'}
                ]
            }
        }
    },
    created () {
        this.getUserFacility()
    },
    methods: {
        handle (item, e) {
            if (/\/warehouse_web\/[^#]*#\/?/.test(item.url)) {
                e.preventDefault()
                return true
            }
            return false
        },
        getUserFacility () {
            var _self = this
            WareHouseApi.getUserPermission().then(d => {
                if (d.resultCode == 1) {
                    if (d.result && d.result.length) {
                        _self.userInfo.facility = d.facility
                    }
                }
            })
        },
        checkUserHasShipping () {
            var _self = this
            shippingApi.isExistShipPermission().then(d => {
                if (d.success) {
                    if (!d.data) {
                        _self.showNoPermissionMessage('There is no access permission')
                    }
                } else {
                    _self.showNoPermissionMessage('There is no access permission')
                }
            }).catch(e => {
                _self.$showErrorMessage(e.message)
            })
        },
        showNoPermissionMessage (msg) {
            this.$message({
                showClose: true,
                message: msg || 'There is no access',
                type: 'error',
                onClose: () => {
                    location.href = '/user_web/index.html#/login'
                }
            })
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

    .warehouse_box .warehouse_text {
        font-weight: bold;
    }
    .warehouse_box span, .warehouse_box a {
        font-size: 12px;
    }

    .left_content_column {
        position: absolute;
        left: 10px;
        width: 190px;
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
