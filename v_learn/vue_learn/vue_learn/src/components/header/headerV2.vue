<template>
    <div id="yiwill_header">
        <div class="yiwill_header_wap">
            <div class="yiwill_header_list">
                <div class="yiwill_header_header">
                    <div class="yiwill_header_login">
            <span @click="toggleFeature">
                Welcome,<em class="userLoginId">{{userName}}<i></i></em>
                <em :class="{'receiveNum': true, 'receiveContent': (totalMessageContent == 0) }">{{ totalMessageContent }}</em>
            </span>
                        <div class="menuList" ref="menulist" v-show="layerToggle" tabindex="10" @blur="hideFeature">
                            <a href="/warehouse/control/newTransferInventory?type=Receive" class="receiveTransfer" data-type="receive" v-if="transferPartyRole == 'Y'">
                                <em v-if="isStoreManage == 'Y' && totalTransferMessage > 0" class="receiveNumList">{{ totalTransferMessage }}</em>
                                Transfer Item To Receive
                            </a>
                            <a href="/report_web/index.html#/incomeDeposit" data-type="incomeDeposit" v-if="partyRole == 'StoreManager' || partyRole == 'ALL'">
                                <em v-if="totalIncomeMessage > 0" class="receiveNumList">{{ totalIncomeMessage }}</em>
                                Income Deposit Status Updated
                            </a>
                            <a href="/report_web/index.html#/auditIncomeDeposit" data-type="auditIncomeDeposit" v-if="partyRole == 'Auditor' || partyRole == 'ALL'">
                                <em v-if="totalAuditMessage > 0" class="receiveNumList">{{ totalAuditMessage }}</em>
                                Process to audit
                            </a>
                            <a href="javascript:void(0)" class="updatePassword" data-type="password" @click="updatePassword">Change Password</a>
                        </div>
                        <a href="javascript:void(0)" class="login_out" @click="logout">Logout</a>
                    </div>
                    <div class="yiwill_header_logo"><a href="/opentaps"></a></div>
                    <div class="yiwill_header_box">
                        <ul class="yiwill_header_ul" id="yiwill_header_ul">
                            <li v-for="item in firstNode"
                                :key="item.id"
                                :class="selectUrl == item.applicationName ? 'selected' : ''">
                                <a v-bind:href="item.linkUrl" class="order_management">
                                    {{item.description}}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="yiwill_header_second_header" id="yiwill_header_second_header">
                    <template v-if="secondNode.length > 0 ">
                        <ul class="yiwill_header_second_ul">
                            <li v-for="item in secondNode" :class="{selected:selectedNode.indexOf(item.id)>-1}"
                                :key="item.id">
                                <a v-bind:href="item.linkUrl">{{item.description}}</a>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
        <g-changepwddialog v-if="changePwdVisible" :visible.sync="changePwdVisible"></g-changepwddialog>
    </div>
</template>
<script>
    import commonApi from '~api/commonapi'
    import productApi from '~api/productapi'
    import reportApi from '~api/reportapi'
    import shippingApi from '~api/warehouse/shippingApi'
    import warehouseApi from '~api/warehouseapi'
    import Cookies from 'js-cookie'
    import { mapState } from 'vuex'
    import * as types from '~store/mutation-types'

    import _ from 'lodash'

    export default {
        data () {
            return {
                layerToggle: false,
                changePwdVisible: false,
                firstNode: [],
                secondNode: [],
                selectedNode: [],
                transferData: {
                    'type': 'receive',
                    'facilityId': '',
                    'productId': '',
                    'model': '',
                    'sendDate': '',
                    'statusId': 'IXF_REQUESTED',
                    'pageNum': '1'
                },
                partyRole: '',
                transferPartyRole: 'N',
                isStoreManage: 'N'
            }
        },
        created () {
            this.selectUrl = window.location.pathname.split('/')[1]
            // this.selectUrl = 'warehouse_web'
        },
        watch: {
            '$route.name': function (newVal, oldVal) {
                this.getTreeSelectedNode(newVal);
            }
        },
        computed: {
            ...mapState([
                'timeNow',
                'zoneOffset',
                'currentTime',
                'timeZoneArea',
                'userName',
                'commonInfo',
                'selectedUrl',
                'navTrees',
                'totalTransferMessage',
                'totalIncomeMessage',
                'totalAuditMessage'
            ]),
            totalMessageContent () {
                let baseTotal = 0;

                if(this.partyRole == 'ALL'){
                    baseTotal = this.totalIncomeMessage + this.totalAuditMessage;
                }else if(this.partyRole == 'StoreManager'){
                    baseTotal = this.totalIncomeMessage;
                }else if(this.partyRole == 'Auditor'){
                    baseTotal = this.totalAuditMessage;
                }

                if(this.transferPartyRole == 'Y' && this.isStoreManage == 'Y'){
                    return baseTotal + this.totalTransferMessage
                }else{
                    return baseTotal;
                }
            }
        },
        mounted () {
            let selectUrl = this.selectUrl

            this.getTreeSelectedNode(this.$route.name);
            let firstNode = _.filter(this.navTrees, (o) => { return o.parentId == 0 })
            firstNode = _.sortBy(firstNode, [(o) => { return o.seqId }])
            this.firstNode = firstNode

            if (_.indexOf(['product_web', 'order_web', 'report_web', 'warehouse_web'], selectUrl) > -1) {
                let rootNode = _.find(this.navTrees, function (o) { return o.applicationName == selectUrl && o.parentId == 0 })
                let sNode = _.filter(this.navTrees, (o) => { return o.parentId == rootNode.id });
                sNode = _.sortBy(sNode, [(a) => { return a.seqId }])

                this.secondNode = sNode
            }

            this.getRedPointerList()
            this.getAuditPermission()
            this.getTransferRolesList()
            this.getTranferRedPointerList()
            this.checkUserHasStoreManage()
        },
        methods: {
            toggleFeature (e) {
                this.layerToggle = !this.layerToggle
                this.layerToggle && this.focusMenuList()
            },
            hideFeature (e) {
                setTimeout(() => {
                    this.layerToggle = false
                }, 300)
            },
            focusMenuList () {
                this.$nextTick(() => {
                    this.$refs.menulist.focus()
                })
            },
            logout () {
                commonApi.loginOut().then(d => {
                    if (d.responseMessage == 'success') {
                        Cookies.remove()
                        location.href = process.env.NODE_ENV === 'development' ? '/user_web/index.html#/login' : '/opentaps'
                    }
                }).catch(err => {
                    this.$message({
                        showClose: true,
                        message: err.message || 'Service Exceptions！',
                        type: 'error'
                    })
                })
            },
            updatePassword () {
                this.changePwdVisible = !this.changePwdVisible
            },
            getRedPointerList () {
                reportApi.findNotices().then(d => {
                    if (d.success) {
                        if (d.data) {
                            this.$store.commit(types.TOTAL_INCOME_MESSAGE, d.data.StoreManager || 0)
                            this.$store.commit(types.TOTAL_AUDIT_MESSAGE, d.data.Auditor || 0)
                        }
                    }
                }).catch(err => {
                    this.$showErrorMessage(err.message)
                })
            },
            getTransferRolesList () {
                warehouseApi.whoseHavingInv().then(d => {
                    if (d.success) {
                        this.transferPartyRole = d.data;
                    }
                }).catch(err => {
                    this.$showErrorMessage(err.message)
                })
            },
            checkUserHasStoreManage(){
                warehouseApi.checkUserHasStoreManage().then(d => {
                    if (d.resultCode == 1) {
                        this.isStoreManage = d.isStoreManage;
                    }
                }).catch(err => {
                    this.$showErrorMessage(err.message)
                })
            },
            getTranferRedPointerList () {
                warehouseApi.queryTransferData(this.transferData).then(d => {
                    if (d.success) {
                        this.$store.commit(types.TOTAL_TRANSFER_MESSAGE, d.data.total || 0)
                    }
                }).catch(err => {
                    this.$showErrorMessage(err.message)
                })
            },
            getAuditPermission () {
                reportApi.whoseHavingRole().then(d => {
                    if (d.success == true) {
                        if (d.data) {
                            if (d.data.length == 1) {
                                if (d.data.indexOf('Auditor') > -1) {
                                    this.partyRole = d.data[0]
                                } else if (d.data.indexOf('StoreManager') > -1) {
                                    this.partyRole = d.data[0]
                                }
                            } else if (d.data.length == 2) {
                                this.partyRole = 'ALL'
                            }
                        }
                    } else {
                        this.$showErrorMessage(d.message)
                    }
                }).catch(err => {
                    this.$showErrorMessage(err)
                })
            },
            getTreeSelectedNode(pageName) {
                if(!pageName)return;
                var result = [];
                let currentNode = this.navTrees.filter(item => {return item.vueName == pageName})
                while(currentNode && currentNode.length) {
                    result.push(currentNode[0].id);
                    currentNode = this.navTrees.filter(item=>{return item.id == currentNode[0].parentId});
                    if(currentNode && currentNode.length) {
                        if(currentNode[0].parentId==0) {
                            result.push(currentNode[0].id);
                            currentNode = null;
                        }
                    }
                }
                this.selectedNode = result;
            }
        }
    }
</script>
<style scoped>
    #yiwill_header {
        background: #f7f7f7;
        min-width: 1280px;
    }

    .yiwill_header_wap {
        background: #ffffff;
        width: 100%;
        border-bottom: 1px solid #dbdbdb;
    }

    .yiwill_header_wap::after {
        content: '';
        clear: both;
        display: block;
    }

    .yiwill_header_list {
        width: 1280px;
        height: 100%;
        margin: 0 auto;
        background: #ffffff;
    }

    .yiwill_header_header {
        width: 1280px;
        height: 45px;
    }

    .yiwill_header_header .yiwill_header_login {
        float: right;
        padding: 0 30px 0 20px;
        height: 45px;
        position: relative;
    }

    .yiwill_header_login span {
        position: relative;
        display: inline-block;
        font-size: 14px;
        color: #424242;
        height: 30px;
        margin: 10px 5px 0 0;
        line-height: 30px;
    }

    .yiwill_header_login span em.userLoginId {
        font-style: normal;
        cursor: pointer;
        display: inline-block;
        margin: 0 8px;
    }

    .yiwill_header_login span em.userLoginId i {
        display: inline-block;
        background: url(/commondefine_img/create_product/arrow_down.png) no-repeat center center;
        width: 15px;
        height: 10px;
        margin-left: 6px;
    }

    .yiwill_header_login span em.receiveNum {
        position: absolute;
        top: -6px;
        right: 14px;
    }

    .yiwill_header_login span em.receiveNum, .yiwill_header_login em.receiveNumList {
        float: right;
        font-style: normal;
        cursor: pointer;
        width: 22px;
        height: 22px;
        display: inline-block;
        border-radius: 50%;
        background: #e50038;
        color: #fff;
        line-height: 22px;
        font-size: 12px;
        transform: scale(0.8);
        text-align: center;
        font-weight: bold;
    }
    .yiwill_header_login .menuList em.receiveNumList{
        margin: 5px 10px 0 0
    }

    .yiwill_header_login .receiveContent {
        display: none !important;
    }

    .yiwill_header_login .menuList {
        display: block;
        position: absolute;
        top: 38px;
        right: 95px;
        border: 1px solid rgba(0, 0, 0, .15);
        width: 240px;
        z-index: 99;
        box-shadow: 0 6px 10px rgba(0, 0, 0, .175);
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
        padding: 0;
        margin: 0;
        border-radius: 0;
        outline: none;
    }

    .yiwill_header_login .menuList a:hover {
        background: #8cc152;
        color: #fff;
    }

    .yiwill_header_login .menuList a {
        background: #ffffff;
        padding: 0 0 0 10px;
        display: inline-block;
        margin: 0;
        font-size: 12px;
        width: 100%;
        color: #141414;
    }

    .yiwill_header_login a {
        display: inline-block;
        color: #8cc152;
        height: 30px;
        margin-top: 10px;
        line-height: 30px;
        font-size: 14px;
    }

    .yiwill_header_header .yiwill_header_logo {
        float: left;
        height: 45px;
        padding: 5px 10px 5px 5px;
    }

    .yiwill_header_header .yiwill_header_logo a {
        display: block;
        height: 100%;
        background: url(/commondefine_img/create_product/yiwill_logo.png) no-repeat center center;
        width: 175px;
    }

    .yiwill_header_header .yiwill_header_box {
        float: left;
        height: 45px;
    }

    .yiwill_header_box .yiwill_header_ul {
        height: 45px;
        margin: 0;
        width: 100%;
    }

    .yiwill_header_ul li {
        height: 45px;
        float: left;
        margin: 0 !important;
    }

    .yiwill_header_ul li a {
        height: 45px;
        width: 100%;
        display: block;
        line-height: 45px;
        text-align: center;
        color: #9e9e9e;
        font-size: 14px;
        padding: 3px 10px 0 10px;
    }

    #yiwill_header .yiwill_header_ul li.selected a {
        background: #f7f7f7;
        color: #424242;
        border-top: 3px solid #8cc152;
        padding: 0 10px;
    }

    .yiwill_header_second_header {
        width: 100%;
    }

    .yiwill_header_second_ul {
        height: 40px;
    }

    .yiwill_header_second_ul li {
        height: 40px;
        float: left;
        margin: 0 !important;
    }

    .yiwill_header_second_ul li a {
        height: 40px;
        width: 100%;
        display: block;
        line-height: 40px;
        text-align: center;
        color: #9e9e9e;
        font-size: 14px;
        padding: 0 10px 1px 10px;
    }

    .yiwill_header_second_ul li.selected a {
        color: #424242;
        border-bottom: 1px solid #8cc152;
        padding: 0 10px;
    }


</style>
