<template>
    <div class="salesReturn-box">
        <div class="salesReturn-title">Create Sales Return</div>
        <div class="salesReturn-content">
            <el-form :model="searchForm" label-width="150px" class="salesReturn-form">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="Return No.">
                            <el-input size="small" v-model="searchForm.returnNo" placeholder="Return No." :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Order ID" required>
                            <el-input size="small" placeholder="Order ID" v-model="searchForm.orderId" @blur="changeOrderIdEvt">
                                <el-button slot="append" icon="el-icon-more" @click="chooseOrderIdEvt"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Store" required>
                            <el-input size="small" v-model="searchForm.store" placeholder="Store" :disabled="true"></el-input>
                            <el-input size="small" v-model="searchForm.storeId" style="display: none;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="Customer Name" required>
                            <el-input size="small" v-model="searchForm.customerName" placeholder="Customer Name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Customer Mobile" required>
                            <el-input size="small" v-model="searchForm.customerMobile" placeholder="Customer Mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Customer Address">
                            <el-input size="small" v-model="searchForm.customerAddress" placeholder="Customer Address"></el-input>
                            <el-input size="small" v-model="searchForm.contactMathId" style="display: none;"></el-input>
                            <el-input size="small" v-model="searchForm.partyId" style="display: none;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="Return Reason" required>
                            <el-select size="small" v-model="searchForm.returnReasonId" style="width:100%" clearable  placeholder="Select Return Reason">
                                <el-option v-for="item in returnReasonData" :key="item.returnReasonId" :label="item.description" :value="item.returnReasonId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Responsible Party" required>
                            <el-select size="small" v-model="searchForm.responsiblePartyId" style="width:100%"  placeholder="Select Responsible Party">
                                <el-option v-for="item in responsiblePartyData" :key="item.returnResponsiblePartyId" :label="item.responsiblePartyDesc" :value="item.returnResponsiblePartyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="salesReturn-table">
            <div class="salesReturn-table_title">Return Items</div>
            <el-table :data="tableData" :summary-method="getSummaries" show-summary border style="width:100%;font-size: 12px;" @selection-change="handleSelectionChange" tooltip-effect="dark" empty-text="No return items data.">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column label="Product ID" prop="productId"></el-table-column>
                <el-table-column label="EAN" prop="ean"></el-table-column>
                <el-table-column label="Product Desc" prop="productDesc"></el-table-column>
                <el-table-column label="IMEI" prop="imei"></el-table-column>
                <el-table-column :label="currencyUnit">
                    <template slot-scope="scope">
                        {{ scope.row.unit | formatNumber }}
                    </template>
                </el-table-column>
                <el-table-column label="Quantity" width="160">
                    <template slot-scope="scope">
                        <el-input-number v-if="!scope.row.imei" size="small" v-model="scope.row.num" :max="-1" :min="-scope.row.canReturnQuantity" :step="1"></el-input-number>
                        <label v-else="scope.row.imei">{{scope.row.num}}</label>
                    </template>
                </el-table-column>
                <el-table-column label="Available / Ordered Qty">
                    <template slot-scope="scope">
                        {{scope.row.canReturnQuantity}} / {{+scope.row.quantity}}
                    </template>
                </el-table-column>
                <el-table-column :label="currencySubtotal" width="140">
                    <template slot-scope="scope">
                        {{ (scope.row.num * scope.row.unit).toFixed(2) | formatNumber }}
                    </template>
                </el-table-column>
                <el-table-column label="Return Type" width="140">
                    <template slot-scope="scope">
                        <el-select v-model.trim="scope.row.returnType">
                            <el-option
                                    v-for="item in returnTypeData"
                                    :key="item.returnTypeId"
                                    :label="item.returnTypeName"
                                    :value="item.returnTypeId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <div class="salesReturn-operator">
                <i class="el-icon-plus iconList" @click="addReturnItems"></i>
                <i class="el-icon-minus iconList" @click="deleteReturnItems"></i>
            </div>
        </div>
        <div class="salesReturn-notes">
            <div class="salesReturn-notes_title">Notes</div>
            <el-input type="textarea" :rows="4"  placeholder="Please enter" v-model="searchForm.comments"></el-input>
        </div>
        <div class="salesReturn-submit">
            <el-button type="primary" :loading="searchForm.submitLoading"  @click="createReturnSaleOrder">Submit</el-button>
        </div>

        <!-- dialog list -->
        <select-order-dialog v-if="dialogFormVisible" :currencyUom="currencyUom" :dataVisible.sync="dialogFormVisible"  @click="updateOrderIdEvt"></select-order-dialog>
        <return-items-dialog v-if="dialogItemsVisible" :returnItemsId="returnItemsId" :itemsVisible.sync="dialogItemsVisible"  @click="updateReturnItemsEvt"></return-items-dialog>
    </div>
</template>
<script>
import Utils from '~utils/index'
import orderApi from '~api/orderapi'
import returnItemsDialog from './returnItemsDialog.vue'
import selectOrderDialog from './selectOrderDialog.vue'
export default {
    data () {
        return {
            dialogFormVisible: false,
            dialogItemsVisible: false,
            searchForm: {
                returnNo: '',
                orderId: '',
                store: '',
                storeId: '',
                customerName: '',
                customerMobile: '',
                customerAddress: '',
                returnReasonId: '',
                responsiblePartyId: '',
                contactMathId: '',
                partyId: '',
                submitLoading: false,
                comments: ''
            },
            tableData: [],
            responsiblePartyData: [],
            returnReasonData: [],
            multipleSelection: [],
            returnTypeData: [{
                returnTypeId: 'RE-SALE',
                returnTypeName: 'Re-Sale'
            }],
            oldData: '',
            currencyUnit: 'Unit',
            currencySubtotal: 'Subtotal',
            currencyUom: '',
            returnItemsId: ''
        }
    },
    components: {
        selectOrderDialog,
        returnItemsDialog
    },
    mounted () {
        // return reason
        orderApi.getReturnReasonList().then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    this.returnReasonData = d.data
                } else {
                    this.returnReasonData = []
                }
            } else {
                this.$message({
                    type: 'error',
                    message: 'Return reason query failed',
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

        // return responsible party
        orderApi.getReturnResponsiblePartyList().then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    this.responsiblePartyData = d.data
                } else {
                    this.responsiblePartyData = []
                }
            } else {
                this.$message({
                    type: 'error',
                    message: 'Return responsible party query failed',
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

        // currency
        orderApi.findOrderCurrency().then(d => {
            if (d.success == true) {
                if (d.data) {
                    this.currencyUom = d.data
                    this.currencyUnit = (this.currencyUnit + '(' + d.data + ')')
                    this.currencySubtotal = (this.currencySubtotal + '(' + d.data + ')')
                }
            } else {
                this.$message({
                    type: 'error',
                    message: 'Currency query failed',
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
    methods: {
        createReturnSaleOrder () {
            var newExp = /^[0-1]\d{9}$/
            if (this.searchForm.orderId == '' || this.searchForm.customerName == '' || this.searchForm.customerMobile == '' || this.searchForm.returnReasonId == '' || this.searchForm.returnReasonId == '') {
                this.$message({
                    type: 'warning',
                    message: 'Sales Return condition no fill',
                    showClose: true,
                    duration: 5000
                })
                return false
            }
            if (!newExp.test(this.searchForm.customerMobile)) {
                this.$message({
                    type: 'warning',
                    message: 'Please enter a 10-digit phone number that starts with 0 or 1',
                    showClose: true,
                    duration: 5000
                })
                return false
            }
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: 'Return items no selected',
                    showClose: true,
                    duration: 5000
                })
                return false
            } else {
                this.multipleSelection.forEach(function (item) {
                    item.wantReturnQuantity = Math.abs(item.num)
                })
            }
            this.searchForm.submitLoading = true
            orderApi.createReturnSaleOrder({
                'returnItemList': this.multipleSelection,
                'returnReasonId': this.searchForm.returnReasonId,
                'storeId': this.searchForm.storeId,
                'comments': this.searchForm.comments,
                'contactMathId': this.searchForm.contactMathId || '',
                'customerAddress': this.searchForm.customerAddress || '',
                'customerMobile': this.searchForm.customerMobile,
                'customerName': this.searchForm.customerName,
                'orderId': this.searchForm.orderId,
                'partyId': this.searchForm.partyId,
                'responsiblePartyId': this.searchForm.responsiblePartyId
            }).then(d => {
                this.searchForm.submitLoading = false
                if (d.success == true) {
                    this.$alert('Sales return create success', 'Sales return', {
                        confirmButtonText: 'Confirm',
                        callback: () => {
                            this.$router.push({
                                path: '/salesReturnList',
                                query: {
                                    orderId: this.searchForm.orderId
                                }
                            })
                        }
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: d.message || 'Service exceptions！',
                        showClose: true
                    })
                }
            }).catch(err => {
                this.searchForm.submitLoading = false
                this.$message({
                    showClose: true,
                    message: err.message || 'Service exceptions！',
                    type: 'error'
                })
            })
        },
        chooseOrderIdEvt () {
            this.dialogFormVisible = true
        },
        changeOrderIdEvt () {
            if (this.searchForm.orderId == '') {
                return false
            }
            this.$confirm('Do you want to modify Order ID ?', 'Tips', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                orderApi.findOrderByOrderId({
                    'orderId': this.searchForm.orderId
                }).then(d => {
                    if (d.success == true) {
                        if (d.data && d.data.length) {
                            this.updateOrderIdEvt(d.data[0])
                            this.comments = ''
                            this.tableData = []
                        } else {
                            this.searchForm.orderId = this.oldData
                            this.$message({
                                type: 'error',
                                message: 'Modify error！',
                                showClose: true
                            })
                        }
                    } else {
                        this.searchForm.orderId = this.oldData
                        this.$message({
                            type: 'error',
                            message: d.message || 'Service exceptions！',
                            showClose: true
                        })
                    }
                }).catch(err => {
                    this.searchForm.orderId = this.oldData
                    this.$message({
                        type: 'error',
                        message: err.message || 'Service exceptions！',
                        showClose: true
                    })
                })
            }).catch(() => {
                this.searchForm.orderId = this.oldData
            })
        },
        updateOrderIdEvt (data) {
            this.oldData = data.orderId
            this.searchForm.orderId = data.orderId
            this.searchForm.store = data.storeName
            this.searchForm.storeId = data.productStoreId
            this.searchForm.customerName = data.customerName
            this.searchForm.customerMobile = data.customerMobile
            this.searchForm.customerAddress = data.customerAddress
            this.searchForm.contactMathId = data.contactId
            this.searchForm.partyId = data.buyerId

            this.searchForm.comments = ''
            this.tableData = []
        },
        updateReturnItemsEvt (data) {
            if (this.tableData.length == 0) {
                data.forEach((item) => {
                    this.$set(item, 'num', -1)
                    item.returnType = 'RE-SALE'
                })
                this.tableData = data
            } else {
                var imeiFilterData = this.tableData.map(function (elem) {
                    return elem.imei
                })
                var productIdFilterData = this.tableData.map(function (elem) {
                    return elem.productId
                })
                for (var i = 0; i < data.length; i++) {
                    if (!(imeiFilterData.indexOf(data[i].imei) != -1 && productIdFilterData.indexOf(data[i].productId) != -1)) {
                        this.$set(data[i], 'num', -1)
                        data[i].returnType = 'RE-SALE'
                        this.tableData = this.tableData.concat(data[i])
                    }
                }
            }
        },
        handleSelectionChange (data) {
            this.multipleSelection = data
        },
        addReturnItems () {
            if (!this.searchForm.orderId) {
                this.$message.error('Please fill in order id. ')
                return false
            }
            this.returnItemsId = this.searchForm.orderId
            this.dialogItemsVisible = true
        },
        deleteReturnItems () {
            let length = this.multipleSelection.length
            if (length == 0) {
                this.$message.error('Please select return items.')
                return false
            }

            var listId = (this.multipleSelection).map(function (item) {
                return item.productId
            })
            for (let j = 0; j < this.tableData.length; j++) {
                if (listId.indexOf(this.tableData[j].productId) != -1) {
                    this.tableData.splice(j, 1)
                    j = j - 1
                }
            }
        },
        getSummaries (param) {
            const { data } = param
            var unitTotal = 0, quantityTotal = 0, subTotal = 0
            for (var i = 0; i < data.length; i++) {
                unitTotal += (+data[i]['unit'])
                quantityTotal += (+data[i]['num'])
                subTotal += ((+data[i]['unit']) * (+data[i]['num']))
            }
            return ['Total', '', '', '', '', Utils.formatToThousands(unitTotal.toFixed(2)), quantityTotal, '', Utils.formatToThousands(subTotal.toFixed(2)), '']
        }
    },
    filters: {
        formatNumber (value) {
            return Utils.formatToThousands(value)
        }
    }
}
</script>
<style>
    .salesReturn-box{
        background-color: #ffffff;padding-bottom: 20px;
    }
    .el-form-item{
        margin-bottom: 10px;
    }
    .salesReturn-title{
        height: 40px;
        margin:0 10px;
        line-height: 40px;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #dbdbdb;
    }
    .salesReturn-content .el-form-item__label{
        font-size: 12px;
    }
    .salesReturn-content{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .salesReturn-table{
        border: 1px solid #dbdbdb;
        padding: 10px;
        margin: 10px 10px 0 10px;
    }
    .salesReturn-table_title{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
    }
    .salesReturn-operator{
        width: 100%;
        margin: 10px 0 0 0;
    }
    .salesReturn-notes{
        margin: 10px 10px 0 10px;
        border: 1px solid #dbdbdb;
        padding: 10px;
    }
    .salesReturn-notes_title{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
    }
    .salesReturn-submit{
        margin: 10px 10px 0 10px;
        text-align: right;
    }
    .iconList{
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
    }
    .gridDataTable tr{
        cursor: pointer;
    }
</style>
