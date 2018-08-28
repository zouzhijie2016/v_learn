<template>
    <div class="orderList_box">
        <div class="orderList_search">
            <el-form :model="searchForm" class="orderList_form" :inline="true">
                <el-row :gutter="5">
                    <el-form-item label="Store">
                        <el-select size="small" v-model="searchForm.store">
                            <el-option
                                v-for="item in storeData"
                                :key="item.storeId"
                                :label="item.storeName"
                                :value="item.storeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="searchDateList">
                        <label class="form_label">Ordered Date</label>
                        <el-date-picker type="date"
                                        :editable="false"
                                        :clearable="true"
                                        :picker-options="searchForm.fromPickerOptions"
                                        v-model.trim="searchForm.beginToTime"
                                        format="dd/MM/yyyy"
                                        size="small"
                                        placeholder="DD/MM/YYYY" style="width: 160px;">
                        </el-date-picker>
                        <label class="col_datepicker_label" style="width: 15px;">-</label>
                        <el-date-picker type="date"
                                        :editable="false"
                                        :clearable="true"
                                        :picker-options="searchForm.toPickerOptions"
                                        v-model.trim="searchForm.endToTime"
                                        format="dd/MM/yyyy"
                                        size="small"
                                        placeholder="DD/MM/YYYY" style="width: 160px;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="Order ID">
                        <el-input size="small" v-model.trim="searchForm.orderId"></el-input>
                    </el-form-item>
                    <el-form-item label="Status">
                        <el-select size="small" v-model="searchForm.status" style="width:172px">
                            <el-option
                                v-for="item in statusData"
                                :key="item.statusId"
                                :label="item.statusName"
                                :value="item.statusId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="Payment">
                        <el-select size="small" v-model="searchForm.paymentWay" style="width:172px">
                            <el-option
                                v-for="item in paymentData"
                                :key="item.paymentId"
                                :label="item.paymentName"
                                :value="item.paymentId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Product">
                        <el-autocomplete style="width: 340px;"
                                         :trigger-on-focus="suggestion.triggerOnFocus"
                                         @input="changeConditionEvt('product')"
                                         v-model.trim="searchForm.productId"
                                         :fetch-suggestions="queryProductSuggestionDebounce"
                                         @select="selectProductSuggession">
                            <template slot-scope="scope">
                                <div v-for="item in scope" :valueKey="item">
                                    <div class="suggestionList" v-if="item.description">{{item.productId}}:{{ item.brandName }} {{ item.internalName }} {{item.description}}</div>
                                    <div class="suggestionList" v-else>{{item.productId}}:{{ item.brandName }} {{ item.internalName }}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="Egatee No.">
                        <el-input size="small" v-model.trim="searchForm.egateeNo"></el-input>
                    </el-form-item>
                    <el-form-item label="Customer">
                        <el-autocomplete
                                         :trigger-on-focus="suggestion.triggerOnFocus"
                                         @input="changeConditionEvt('customer')"
                                         v-model.trim="searchForm.customer"
                                         :fetch-suggestions="queryCustomerSuggestionDebounce"
                                         @select="selectCustomerSuggession">
                            <template slot-scope="scope">
                                <div class="suggestionList" v-for="item in scope" :valueKey="item">{{item.firstName}}:{{item.contactNumber}}</div>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                </el-row>
                <el-row :gutter="5">
                    <el-form-item label="Fix Order">
                        <el-select size="small" v-model="searchForm.fixOrder" style="width:172px">
                            <el-option
                                v-for="item in fixOrderData"
                                :key="item.fixOrderId"
                                :label="item.fixOrderName"
                                :value="item.fixOrderId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Shipment Order">
                        <el-select size="small" v-model="searchForm.shipmentOrder" style="width:172px">
                            <el-option
                                v-for="item in shipmentOrderData"
                                :key="item.shipmentOrderId"
                                :label="item.shipmentOrderName"
                                :value="item.shipmentOrderId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading"  @click="searchOrderList('1')">Search</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="orderList_table" v-loading="searchForm.searchLoading">
            <el-table :data="tableListData.list" style="width: 100%;font-size: 12px" :default-sort="{ prop: 'orderedDate',order: 'descending' }">
                <el-table-column prop="orderDate" sortable label="Order Date" align="center" width="135"></el-table-column>
                <el-table-column prop="itemOrderId" sortable label="Order ID" align="center" width="85">
                    <template slot-scope="scope">
                        <a :href="'/order_web/index.html#/orderDetail?orderId='+scope.row.itemOrderId" target="_blank" size="small">{{ scope.row.itemOrderId }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="Egatee No." align="center">
                    <template slot-scope="scope">
                        {{ scope.row.egateeNo || '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="Purchased Goods" align="left" width="220">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.productInfoList">
                            <div v-if="item.quantity != -1 "> {{ item.productInfo.replace("null","") }} </div>
                            <div v-else> {{  item.productDesc }} </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="customer" sortable label="Customer" align="left"></el-table-column>
                <el-table-column sortable prop="grandTotal" :label="amountLabel" align="right" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.grandTotal | formatNumber }}
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" sortable label="Store" align="left" width="150" class-name="list_store"></el-table-column>
                <el-table-column label="Status" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.statusId | formatStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="Fix Order" align="center" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.isFixOrder | formatList }}
                    </template>
                </el-table-column>
                <el-table-column label="Shipment Order" align="center" width="80" class-name="list_shipmentOrder">
                    <template slot-scope="scope">
                        {{ scope.row.isNeedShip | formatList }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="page_box" v-if="tableListData.pageMap.total && tableListData.pageMap.total > 0">
                <el-pagination style="float: right"
                    layout="prev, pager, next, jumper"
                    :total="tableListData.pageMap.total"
                    :page-size="tableListData.pageMap.pageSize"
                    :current-page.sync="searchForm.curpage"
                    @current-change="searchOrderList(searchForm.curpage)">
                </el-pagination>
                <span style="float: right;display: inline-block;height: 32px;line-height: 32px;">Display {{ tableListData.pageMap.startRow }} - {{ tableListData.pageMap.endRow }} item, {{ tableListData.pageMap.total }} results in total</span>
            </div>
            <div style="clear: both;"></div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import OrderApi from '~api/orderapi'
import {mapState} from 'vuex'
import ProSuggest from './productseggest.vue'
import CutSuggest from './customerseggest.vue'

Vue.component('ProductSuggest', ProSuggest)
Vue.component('CustomerSuggest', CutSuggest)
export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            amountLabel: 'Amount',
            storeData: [{
                storeName: 'All',
                storeId: ''
            }],
            statusData: [{
                statusName: 'All',
                statusId: ''
            }, {
                statusName: 'Completed',
                statusId: 'ORDER_COMPLETED'
            }, {
                statusName: 'Cancelled',
                statusId: 'ORDER_CANCELLED'
            }, {
                statusName: 'Paid',
                statusId: 'ORDER_PAID'
            }],
            paymentData: [{
                paymentName: 'All',
                paymentId: ''
            }, {
                paymentName: 'Cash',
                paymentId: 'CASH'
            }, {
                paymentName: 'Credit',
                paymentId: 'CREDIT'
            }],
            shipmentOrderData: [{
                shipmentOrderName: 'All',
                shipmentOrderId: ''
            }, {
                shipmentOrderName: 'Y',
                shipmentOrderId: 'Y'
            }, {
                shipmentOrderName: 'N',
                shipmentOrderId: 'N'
            }],
            fixOrderData: [{
                fixOrderName: 'All',
                fixOrderId: ''
            }, {
                fixOrderName: 'Y',
                fixOrderId: 'Y'
            }, {
                fixOrderName: 'N',
                fixOrderId: 'N'
            }],
            searchForm: {
                productId: '',
                egateeNo: '',
                customer: '',
                orderId: '',
                beginToTime: '',
                endToTime: '',
                beginDate: '',
                endDate: '',
                fixOrder: '',
                paymentWay: '',
                store: '',
                status: 'ORDER_COMPLETED',
                shipmentOrder: '',
                productHiddenId: '',
                customerHiddenId: '',
                pageSize: 20,
                curpage: 1,
                searchLoading: false,
                fromPickerOptions: {
                    disabledDate (date) {
                        // return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                toPickerOptions: {
                    disabledDate (date) {
                        // return date > Utils.getPartialDate(new Date(), compareFormat)
                    }
                }
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            tableListData: {
                pageMap: {
                    pageNum: 1,
                    pageSize: 20,
                    pages: 1,
                    total: 0,
                    size: 0,
                    startRow: 0,
                    endRow: 0
                },
                list: []
            }
        }
    },
    watch: {
    },
    created () {
        OrderApi.findSaleStore().then(d => {
            if (d.success == true) {
                if (d.data && d.data.saleStores && d.data.saleStores) {
                    this.storeData.splice(1)
                    this.storeData = this.storeData.concat(d.data.saleStores)
                    this.amountLabel = this.amountLabel + '(' + d.data.scope + ')'
                } else {
                    this.storeData.splice(1)
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
        this.queryProductSuggestionDebounce = Utils.debounce(this.queryProductSuggession, 500)
        this.queryCustomerSuggestionDebounce = Utils.debounce(this.queryCustomerSuggession, 500)
    },
    mounted () {
        this.searchOrderList('1')
    },
    methods: {
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        setFromDateEvt (beginDate) {
            beginDate.setHours(0)
            beginDate.setMinutes(0)
            beginDate.setSeconds(0)
            beginDate.setMilliseconds(0)

            return beginDate
        },
        setEndDateEvt (endDate) {
            endDate.setHours(23)
            endDate.setMinutes(59)
            endDate.setSeconds(59)
            endDate.setMilliseconds(0)

            return endDate
        },
        changeConditionEvt (type) {
            if (type == 'product') {
                this.searchForm.productHiddenId = ''
            } else if (type == 'customer') {
                this.searchForm.customerHiddenId = ''
            }
        },
        beginDateChangeEvt (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : ''
        },
        getParams () {
            this.searchForm.beginDate = this.searchForm.beginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.beginToTime)) : 0
            this.searchForm.endDate = this.searchForm.endToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.endToTime)) : 0

            return {
                productId: this.searchForm.productHiddenId ? this.searchForm.productHiddenId : this.searchForm.productId,
                partyId: this.searchForm.customerHiddenId,
                fromDate: this.searchForm.beginDate,
                thruDate: this.searchForm.endDate,
                orderId: this.searchForm.orderId,
                egateeNo: this.searchForm.egateeNo,
                statusId: this.searchForm.status ? [this.searchForm.status] : [],
                paymentWay: this.searchForm.paymentWay,
                isFixOrder: this.searchForm.fixOrder,
                shipment: this.searchForm.shipmentOrder,
                productStoreId: this.searchForm.store,
                orderBy: 'orderDate DESC',
                pageSize: this.searchForm.pageSize,
                rawOffset: this.zoneOffset
            }
        },
        searchOrderList (params, isOnlyList = false) {
            let t = this
            let newExpEgateeNo = /^\d{4,10}$/

            if (this.getParams().fromDate > this.getParams().thruDate) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }
            if (this.getParams().egateeNo != '' && !newExpEgateeNo.test(this.getParams().egateeNo)) {
                this.$message.error('Please input 4-10 digits number for the Egatee No.')

                return false
            }
            var paramsContent = Object.assign({}, this.getParams(), {
                pageNum: params || this.searchForm.curpage,
                isOnlyList: isOnlyList
            })
            this.searchForm.searchLoading = true
            this.$getCommonPageListApi(OrderApi.findSaleOrderListV3, paramsContent, d => {
                if (d.data && d.data.list && d.data.list.length) {
                    t.tableListData.list.splice(0)
                    d.data.list.forEach(function (value) {
                        if (value.productInfoList.length > 3) {
                            value.productInfoList = value.productInfoList.slice(0, 3)
                            value.productInfoList.push({
                                quantity: '-1',
                                productDesc: '...'
                            })
                        }
                    })
                    t.tableListData.list = t.tableListData.list.concat(d.data.list)
                } else {
                    t.tableListData.list.splice(0)
                }
                t.searchForm.curpage = d.data.pageNum
            }).then((results) => {
                this.searchForm.searchLoading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.tableListData.pageMap.total = results[1].data.total
                        this.tableListData.pageMap.pageSize = results[1].data.pageSize
                        this.tableListData.pageMap.startRow = (this.searchForm.curpage - 1) * results[1].data.pageSize + 1
                        this.tableListData.pageMap.endRow = results[1].data.pageSize * this.searchForm.curpage > results[1].data.total ? results[1].data.total : results[1].data.pageSize * this.searchForm.curpage
                    } else {
                        this.tableListData.pageMap.total = this.tableListData.pageMap.pageSize * this.searchForm.curpage
                    }
                }
            })
        },
        queryProductSuggession (querystring, cb) {
            if (!querystring) {
                cb([])
                return false
            }

            OrderApi.findActiveProductBykeyWord({
                keyWord: querystring.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.productInfoBOList && d.data.productInfoBOList.length) {
                        cb(d.data.productInfoBOList)
                    } else {
                        cb([])
                    }
                } else {
                    this.$showErrorMessage(d.message)
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                cb([])
            })
        },
        queryCustomerSuggession (querystring, cb) {
            if (!querystring) {
                cb([])
                return false
            }

            OrderApi.findPersonByUserName({
                userName: querystring.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.length) {
                        cb(d.data)
                    } else {
                        cb([])
                    }
                } else {
                    this.$showErrorMessage(d.message)
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                cb([])
            })
        },
        selectProductSuggession (item) {
            this.searchForm.productHiddenId = item.productId
            if (item.description) {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName + ' ' + item.description
            } else {
                this.searchForm.productId = item.productId + ':' + item.brandName + ' ' + item.internalName
            }
        },
        selectCustomerSuggession (item) {
            this.searchForm.customerHiddenId = item.partyId
            this.searchForm.customer = item.firstName
        }
    },
    filters: {
        formatStatus (value) {
            return value == 'ORDER_COMPLETED' ? 'Completed' : (value == 'ORDER_CANCELLED' ? 'Cancelled' : (value == 'ORDER_PAID' ? 'Paid' : ''))
        },
        formatNumber (value) {
            if (!value) { return value }
            return Utils.formatToThousands(value)
        },
        formatList (value) {
            if (!value) { return value }
            return value == 'Y' ? 'Y' : '-'
        }
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
    }
}
</script>
<style>
    .orderList_box{
        background-color: #ffffff;
        padding-top:10px;
    }
    .orderList_search{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 0 10px;
    }
    .form_label{
        font-size: 12px;
        margin-right: 10px;
        color: #48616A;
    }
    .orderList_table{
        padding: 10px;
        position: relative;
    }
    .page_box {
        margin: 15px 0;
        float: right;
        margin-right: -5px;
    }
    .list_store{
        padding-left: 15px;
    }
    .list_shipmentOrder{
        padding-right: 5px;
        padding-left: 5px;
        word-wrap:break-word;
    }
    .suggestionList{
        text-overflow: ellipsis;
        overflow: hidden;
        width:100%;
    }
</style>
