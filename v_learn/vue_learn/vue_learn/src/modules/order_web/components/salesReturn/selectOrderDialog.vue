<!--suppress ALL -->
<template>
    <div>
        <el-dialog title="Select Order in Lastest 48h" :visible.sync="dataCloseVisible" custom-class="editOrderDialog" :close-on-click-modal="false" :close-on-press-escape="false" >
            <el-form :inline="true" :model="dialogForm">
                <el-form-item label="Store">
                    <el-select v-model="dialogForm.store" style="width: 100%" filterable clearable placeholder="Select Store">
                        <el-option  v-for="item in storeData" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="IMEI">
                    <input type="text" class="imei" @keyup.enter="onSubmit" v-model.trim="dialogForm.imei" maxlength="15" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="dialogForm.searchLoading"  @click="onSubmit">Search</el-button>
                </el-form-item>
            </el-form>
            <el-table class="gridDataTable" min-height="450" max-height="450" :data="orderList.list" :default-sort = "{prop: 'orderedDate', order: 'descending'}" @row-dblclick="rowClickEvt"  style="font-size: 12px;cursor:pointer;"  empty-text="No order data.">
                <el-table-column prop="orderDate" sortable label="Ordered Date" width="160"></el-table-column>
                <el-table-column prop="orderId" sortable label="Ordered ID" width="150"></el-table-column>
                <el-table-column prop="productDesc" label="Purchased Goods" width="300">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.orderItemDetailList">
                            <div v-if="item.quantity != -1 "> {{ item.quantity }} * {{  item.productDesc }} </div>
                            <div v-else> {{  item.productDesc }} </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="customerName" sortable label="Customer"></el-table-column>
                <el-table-column :label="currencyAmount" sortable prop="total" width="150"></el-table-column>
                <el-table-column prop="storeName" sortable label="Store" width="160"></el-table-column>
            </el-table>
            <div class="page_box" v-if="orderData.list && orderData.list.length">
                <el-pagination
                        layout="prev, pager, next, jumper"
                        :total="orderData.total"
                        :page-size="orderData.pageSize"
                        :current-page.sync="orderData.pageNum"
                        @current-change="onSubmit">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Utils from '~utils/index'
import orderApi from '~api/orderapi'
export default {
    props: ['dataVisible', 'currencyUom'],
    data () {
        return {
            dataCloseVisible: true,
            storeData: [],
            dialogForm: {
                store: '',
                imei: '',
                searchLoading: false
            },
            currencyAmount: 'Amount',
            orderData: {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                list: [],
                total: 0,
                size: 0
            }
        }
    },
    mounted () {
        if (this.currencyUom) {
            this.currencyAmount = this.currencyAmount + '(' + this.currencyUom + ')'
        }
        // return reason
        orderApi.getStoreData().then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    this.storeData = (d.data).sort(function (first, last) {
                        if (first.storeName > last.storeName) {
                            return 1
                        } else if (first.storeName < last.storeName) {
                            return -1
                        } else {
                            return 0
                        }
                    })
                    this.dialogForm.store = this.storeData[0].storeId
                } else {
                    this.storeData = []
                }
            } else {
                this.$message({
                    type: 'error',
                    message: 'Store query failed',
                    showClose: true
                })
            }
        }).catch(err => {
            this.$message({
                showClose: true,
                message: err.message || 'Service exceptions！',
                type: 'error'
            })
        })
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    computed: {
        orderList: function () {
            var list = this.orderData.list
            list && list.length && list.forEach(function (value, index, array) {
                value.orderDate = Utils.getServerDateStrByLocal(+value.orderDate, 'dd/MM/yyyy hh:mm:ss')
                if (value.orderItemDetailList.length > 3) {
                    value.orderItemDetailList = value.orderItemDetailList.slice(0, 3)
                    value.orderItemDetailList.push({
                        quantity: '-1',
                        productDesc: '...'
                    })
                }
            })
            return this.orderData
        }
    },
    methods: {
        onSubmit () {
            let exp = /^([0-9]{15})$/
            if (!exp.test(this.dialogForm.imei) && this.dialogForm.imei != '') {
                this.$message({
                    type: 'error',
                    message: 'Please enter correct IMEI code',
                    showClose: true
                })
                return false
            }

            this.dialogForm.searchLoading = true
            orderApi.findOrderByImei({
                'imei': this.dialogForm.imei,
                'storeId': this.dialogForm.store,
                'pageSize': this.orderData.pageSize,
                'pageNum': this.orderData.pageNum
            }).then(d => {
                this.dialogForm.searchLoading = false
                if (d.success == true) {
                    if (d.data && d.data.list && d.data.list.length) {
                        this.orderData = d.data
                    } else {
                        this.orderData = []
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: d.message || 'Service exceptions！',
                        showClose: true
                    })
                }
            }).catch(err => {
                this.dialogForm.searchLoading = false
                this.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        },
        rowClickEvt (data) {
            this.$emit('click', data)
            this.$emit('update:dataVisible', false)
        }
    }
}
</script>
<style>
    .editOrderDialog {
        width: 1100px !important;
    }
</style>
<style scoped>
    .page_box {
        margin: 15px 0;
        float: right;
        margin-right: -5px;
    }
    .imei {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid rgb(191, 211, 217);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: rgb(31, 54, 61);
        display: inline-block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: none;
        padding: 3px 10px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 200px;
    }

    .imei:hover {
        border-color: rgb(131, 155, 165);
    }

    .imei:focus {
        outline: none;
        border-color: #1FBCD2;
    }
</style>
