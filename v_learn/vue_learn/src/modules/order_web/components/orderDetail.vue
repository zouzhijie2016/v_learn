<template>
    <div class="orderDetail">
        <div class="orderDetailTitle">Order Detail of Order#{{ orderId }}</div>
        <div class="orderDetailContent">
            <el-form size="mini">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="orderBasicInformation">
                            <div class="orderBasicInformationTitle">Order Basic Information</div>
                            <div class="orderBasicInformationContent">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <span class="labelTitle">OrderID:</span> <span>{{ orderId }}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="labelTitle">Egatee No.:</span> <span>{{ baseInfoVo.egateeNo }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <span class="labelTitle">Store:</span> <span>{{ productStore.storeName }}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="labelTitle">Fix Order:</span> <span>{{ baseInfoVo.isFixOrder }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <span class="labelTitle">Sales Channel:</span> <span>{{ baseInfoVo.productStoreGroupId }}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span class="labelTitle">Sales Person:</span> <span>{{ salesPerson.firstName }} {{ salesPerson.lastName }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="24">
                                        <span class="labelTitle">Date Ordered:</span> <span>Created by [{{ productStore.storeName }}] {{ baseInfoVo.orderDate | formatDate }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Last Updated:</span> <span>{{ baseInfoVo.statusId }} by [{{ baseInfoVo.updatedUser }}] {{ baseInfoVo.updatedTime | formatDate }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Refund History:</span> <span>{{ baseInfoVo.hasReturn }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" v-if="isShowCancel">
                                    <el-col :span="24">
                                        <span class="btnTitle"><el-button @click="cancelOrderEvt" :loading="cancelOrderLoading" :disabled="isUseCancel" type="default">Cancel Order</el-button></span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="paymentInformation">
                            <div class="paymentInformationTitle">Payment Information</div>
                            <div class="paymentInformationContent">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Payment Way:</span> <span>{{ paymentVo.paymentMethodTypeId }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Order Total:</span> <span>{{ baseInfoVo.currencyUom }} {{ baseInfoVo.grandTotal | formatNumber }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Paid:</span> <span>{{ baseInfoVo.currencyUom }} {{ paymentVo.maxAmount | formatNumber }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Change:</span> <span>{{ baseInfoVo.currencyUom }} {{ (paymentVo.maxAmount - baseInfoVo.grandTotal) | formatNumber }}</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 15px">
                    <el-col :span="12">
                        <div class="customerInformation">
                            <div class="customerInformationTitle">Customer Information</div>
                            <div class="customerInformationContent">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Customer Name:</span> <span>{{ customerVo.firstName }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Customer Phone:</span> <span>{{ customerVo.contactNumber }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Customer Address:</span> <span>{{ findPersonAddress.countryGeo }} {{ findPersonAddress.stateProvince }} {{ findPersonAddress.city }} {{ findPersonAddress.countyGeo }} {{ findPersonAddress.address1 }} {{ findPersonAddress.address2 }}</span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12" v-if="!isShowPayment">
                        <div class="shippingInformation">
                            <div class="shippingInformationTitle">Shipping Information</div>
                            <div class="shippingInformationContent">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">From Warehouse:</span> <span>{{ facilityVo.facilityName }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="labelTitle">Shipped To:</span> <span>{{ findPersonAddress.countryGeo }} {{ findPersonAddress.stateProvince }} {{ findPersonAddress.city }} {{ findPersonAddress.countyGeo }} {{ findPersonAddress.address1 }} {{ findPersonAddress.address2 }}</span>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <span class="btnTitle"><a href="javascript:void(0);" @click="jumpShipmentDetails">View Shipment Details>></a></span>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="tableHeader">
                            <span class="tableListTitle">Order Items</span>
                            <div class="operatorList">
                                <el-button type="primary" size="small" icon="el-icon-download" :disabled="!exportStatus" @click="exportOrderDetailEvt">Export</el-button>
                            </div>
                        </div>
                        <el-table class="tableList" :data="tableData" style="width: 100%;font-size: 12px" :default-sort="{ prop: 'productId',order: 'descending' }">
                            <el-table-column type="expand" width="50">
                                <template slot-scope="props">
                                    <div v-for="item in props.row.orderItemShipGrpInvResList" :key="item.orderId">
                                        <div style="text-align: center;width: 100%;">Inventory Item: {{ item.inventoryItemId }}    Reserved To: {{ facilityVo.facilityName }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" width="50" label="No."></el-table-column>
                            <el-table-column prop="productId" label="Product" align="left" width="270">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.productName">
                                        <div v-if="scope.row.productFeatureDescription">{{ scope.row.productId }} - {{ scope.row.productName }} {{ scope.row.productFeatureDescription }}</div>
                                        <div v-else>{{ scope.row.productId }} - {{ scope.row.productName }}</div>
                                    </div>
                                    <div v-else>{{ scope.row.productId }} - {{ scope.row.itemDescription }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="quantity" label="Quantity" align="right"></el-table-column>
                            <el-table-column label="IMEI" align="center">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.imei">
                                        <div style="width:100%">{{ scope.row.imei }}</div>
                                    </div>
                                    <div v-else-if="scope.row.imeiList && scope.row.imeiList.length">
                                        <div v-for="list in scope.row.imeiList" :key="list" style="width:100%">{{ list }}</div>
                                    </div>
                                    <div v-else>----</div>
                                </template>
                            </el-table-column>
                            <el-table-column :label="unitPrice" align="right">
                                <template slot-scope="scope">
                                    {{ scope.row.currentPrice | formatNumber }}
                                </template>
                            </el-table-column>
                            <el-table-column :label="AdjustmentPerUnit" align="right">
                                <template slot-scope="scope">
                                    {{ (scope.row.unitPrice - scope.row.currentPrice) | formatNumber }}
                                </template>
                            </el-table-column>
                            <el-table-column :label="subTotal" align="right">
                                <template slot-scope="scope">
                                    {{ (scope.row.quantity * scope.row.unitPrice) | formatNumber }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tableTotal">
                            <el-row :gutter="5">
                                <el-col :span="21">
                                    <span class="labelTitle">Items Count:</span>
                                </el-col>
                                <el-col :span="3">
                                    <span class="labelContent">{{ totalData.itemsCount }} pcs</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="5">
                                <el-col :span="21">
                                    <span class="labelTitle">Items Total:</span>
                                </el-col>
                                <el-col :span="3">
                                    <span class="labelContent">{{ baseInfoVo.currencyUom }} {{ totalData.itemsTotal | formatNumber }}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="5">
                                <el-col :span="21">
                                    <span class="labelTitle">Total Adjustment:</span>
                                </el-col>
                                <el-col :span="3">
                                    <span class="labelContent">{{ baseInfoVo.currencyUom }} {{ totalData.totalAdjustment | formatNumber }}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="5">
                                <el-col :span="21">
                                    <span class="labelTitle">Order Total:</span>
                                </el-col>
                                <el-col :span="3">
                                    <span class="labelContent">{{ baseInfoVo.currencyUom }} {{ totalData.orderTotal | formatNumber }}</span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
import orderApi from '~api/orderapi'
import Utils from '~utils/index'
import {mapState} from 'vuex'
export default {
    data () {
        return {
            orderId: '',
            unitPrice: 'Unit Price',
            AdjustmentPerUnit: 'Adjustment Per Unit',
            subTotal: 'Sub Total',
            exportStatus: true,
            isShowCancel: true,
            isUseCancel: false,
            isShowPayment: false,
            cancelOrderLoading: false,
            baseInfoVo: {
                egateeNo: '',
                currencyUom: '',
                productStoreId: '',
                isFixOrder: '',
                productStoreGroupId: '',
                salesId: '',
                grandTotal: 0,
                updatedUser: '',
                statusId: '',
                orderDate: '',
                updatedTime: '',
                hasReturn: ''
            },
            paymentVo: {
                paymentMethodTypeId: '',
                maxAmount: 0
            },
            customerVo: {
                firstName: '',
                contactNumber: ''
            },
            facilityVo: {
                facilityName: ''
            },
            productStore: {
                storeName: ''
            },
            salesPerson: {
                firstName: '',
                lastName: ''
            },
            totalData: {
                itemsCount: 0,
                itemsTotal: 0,
                totalAdjustment: 0,
                orderTotal: 0
            },
            findPersonAddress: {
                address1: '',
                address2: '',
                city: '',
                countryGeo: '',
                countyGeo: '',
                stateProvince: ''
            },
            tableData: []
        }
    },
    created () {
        this.orderId = this.$route.params.orderId || this.$route.query.orderId

        orderApi.findYWShopCartByOrderId({
            orderId: this.orderId
        }).then(d => {
            if (d.success == true) {
                if (d.data) {
                    if (d.data.orderHeaderRO) {
                        this.baseInfoVo = d.data.orderHeaderRO

                        if (d.data.orderHeaderRO.currencyUom) {
                            this.unitPrice = 'Unit Price' + '(' + d.data.orderHeaderRO.currencyUom + ')'
                            this.AdjustmentPerUnit = 'Adjustment Per Unit' + '(' + d.data.orderHeaderRO.currencyUom + ')'
                            this.subTotal = 'Sub Total' + '(' + d.data.orderHeaderRO.currencyUom + ')'
                        }

                        if (!d.data.orderHeaderRO.egateeNo) {
                            d.data.orderHeaderRO.egateeNo = '---'
                        }

                        if (d.data.orderHeaderRO.hasReturn == 'Y') {
                            d.data.orderHeaderRO.hasReturn = 'Y'
                        } else {
                            d.data.orderHeaderRO.hasReturn = 'None'
                        }

                        if (d.data.orderHeaderRO.isNeedShip == 'N') {
                            this.isShowPayment = true
                        }
                    }
                    if (d.data.orderPaymentPreferenceList) {
                        this.paymentVo = d.data.orderPaymentPreferenceList[0]
                    }
                    if (d.data.orderItemList) {
                        let t = this
                        this.tableData.splice(0)
                        if (d.data.orderItemShipGrpInvResList) {
                            d.data.orderItemList.forEach(function (itemList) {
                                let orderItemDetail = []
                                d.data.orderItemShipGrpInvResList.forEach(function (item) {
                                    if (item.orderItemSeqId == itemList.orderItemSeqId) {
                                        orderItemDetail.push(item)
                                    }
                                })
                                t.$set(itemList, 'orderItemShipGrpInvResList', orderItemDetail)
                            })
                        }
                        this.tableData = this.tableData.concat(d.data.orderItemList)

                        if (d.data.orderItemList.length) {
                            let t = this
                            d.data.orderItemList.forEach(function (item) {
                                t.totalData.itemsCount += parseInt(item.quantity)
                                t.totalData.itemsTotal += (parseInt(item.quantity) * parseInt(item.currentPrice))
                                t.totalData.totalAdjustment += (parseInt(item.quantity) * ((parseInt(item.unitPrice) - parseInt(item.currentPrice))))
                                t.totalData.orderTotal += (parseInt(item.quantity) * parseInt(item.unitPrice))
                            })
                        }
                    }
                    if (d.data.facility) {
                        this.facilityVo = d.data.facility
                    }
                    if (d.data.buyerPerson) {
                        this.customerVo = d.data.buyerPerson
                    }
                    if (d.data.productStore) {
                        this.productStore = d.data.productStore
                    }
                    if (d.data.salesPerson) {
                        this.salesPerson = d.data.salesPerson
                    }
                    if (d.data.findPersonAddress) {
                        this.findPersonAddress = d.data.findPersonAddress
                    }
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })

        orderApi.checkCancelOrderPremission({
            orderId: this.orderId
        }).then(d => {
            if (d.success == true) {
                if (d.data) {
                    this.isShowCancel = d.data.isShow
                    this.isUseCancel = !d.data.isAvailable
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    methods: {
        jumpShipmentDetails () {
            this.$router.push({
                path: '/shippingDetail',
                query: {
                    orderId: this.orderId
                }
            })
        },
        cancelOrderEvt () {
            this.cancelOrderLoading = true

            orderApi.cancelOrder({
                orderId: this.orderId
            }).then(d => {
                this.cancelOrderLoading = false
                if (d.success == true) {
                    this.$alert('Cancel Order Success', 'Title', {
                        confirmButtonText: 'Confirm',
                        callback: () => {
                            location.reload()
                        }
                    })
                } else {
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.cancelOrderLoading = false
                this.$showErrorMessage(err)
            })
        },
        exportOrderDetailEvt () {
            if (!this.exportStatus) {
                this.$message({
                    showClose: true,
                    message: 'Export is processing, please wait for a moment. If you feel hold too long and want export again, refresh the web browser.',
                    type: 'warning',
                    duration: '5000'
                })

                return false
            }

            location.href = '/api/order/v1/order/exportYWShopCartByOrderId?orderId=' + this.orderId + '&zoneOffset=' + this.zoneOffset

            this.exportStatus = false
        }
    },
    filters: {
        formatDate (val) {
            if (!val) {
                return val
            }
            return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy hh:mm:ss')
        },
        formatNumber (value) {
            if (value) {
                value = value.toFixed(2)
                return Utils.formatToThousands(value)
            } else {
                return value
            }
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
    .orderDetail{
        background: #ffffff;
        padding: 0 10px 10px 10px;
    }
    .orderDetailContent{
      padding: 10px 15px;
    }
    .orderDetailTitle{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .paymentInformationTitle,
    .customerInformationTitle,
    .shippingInformationTitle,
    .orderBasicInformationTitle{
        font-size: 16px;
        font-weight: bold;
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
    .paymentInformationContent,
    .customerInformationContent,
    .shippingInformationContent,
    .orderBasicInformationContent{
        font-size: 12px;
    }
    .labelTitle{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding-right: 10px;
        font-weight: bold;
        font-size: 12px;
    }
    .labelContent{
        text-align: right;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        font-size: 12px;
    }
    .btnTitle{
        display: inline-block;
        height: 35px;
        line-height: 35px;
    }
    .tableHeader{
        width: 100%;
        height: 35px;
    }
    .tableListTitle{
        display: inline-block;
        height: 35px;
        line-height: 35px;
        font-weight: bold;
        font-size: 14px;
    }
    .operatorList{
        float: right;
        height: 35px;
    }
    .tableList{
        width:100%;
    }
    .tableTotal{
        text-align: right;
        margin-top: 15px;
    }
    .el-table__expanded-cell{
        padding: 10px 30px;
    }
</style>
