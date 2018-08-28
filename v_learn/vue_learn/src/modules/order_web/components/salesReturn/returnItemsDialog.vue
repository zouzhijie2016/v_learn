<template>
    <div>
        <!--Add Items Dialog-->
        <el-dialog title="Select Items" :visible.sync="dataItemsVisible" custom-class="selectDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :inline="true" :model="itemsForm" onsubmit="return false;">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-form-item label="Order ID:">
                            <label>{{itemsForm.orderId}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="IMEI:">
                            <input ref="imei" type="text" class="imei"  @keyup.enter="scanQRCode" v-model.trim="itemsForm.imei" style="width: 300px"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" :loading="itemsForm.searchLoading"  @click="searchIMEI">Search</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="errorMessage">{{errMsg}}</div>
            <el-table :data="itemsData" @selection-change="handleSelectionChange" min-height="450" max-height="450"  style="font-size: 12px">
                <el-table-column type="selection" width="55" :selectable="isSelectTableEvt"></el-table-column>
                <el-table-column prop="ean" label="EAN"></el-table-column>
                <el-table-column prop="productDesc" label="Product Description"></el-table-column>
                <el-table-column prop="imei" label="IMEI"></el-table-column>
                <el-table-column label="Refundable/Ordered Qty">
                    <template slot-scope="scope">
                        {{ scope.row.canReturnQuantity }} / {{ +scope.row.quantity }}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialogItemsForm">Cancel</el-button>
                <el-button type="primary" :loading="addLoading" :disabled="isClick" @click="submitDialogItemsForm">Add</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import orderApi from '~api/orderapi'
import _ from 'lodash'
export default {
    props: ['itemsVisible', 'returnItemsId'],
    data () {
        return {
            dataItemsVisible: true,
            itemsForm: {
                orderId: '',
                imei: '',
                searchLoading: false
            },
            errMsg: '',
            itemsData: [],
            selectDataList: [],
            addLoading: false,
            isClick: true,
            timer: null
        }
    },
    created () {
        this.itemsForm.orderId = this.returnItemsId
        this.scanQRCode = _.debounce(this.searchIMEI, 500)
        this.searchIMEI()
    },
    watch: {
        dataItemsVisible () {
            this.$emit('update:itemsVisible', this.dataItemsVisible)
        },
        selectDataList () {
            if (this.selectDataList.length > 0) {
                this.isClick = false
            } else {
                this.isClick = true
            }
        }
    },
    methods: {
        getRealIMEIArr (target) {
            var curImei = this.itemsForm.imei
            var imeiArr = []
            if (!curImei) {
                return imeiArr
            }
            if (curImei.indexOf('|') != -1) {
                curImei = curImei.replace(/[|]/g, '')
            }
            if (curImei.length > 15 && curImei.length % 15 == 0) {
                var reg = new RegExp('^[0-9]*$')
                if (!reg.test(curImei)) {
                    this.errMsg = 'Please enter correct IMEI code'
                    target.focus()
                    return false
                }

                let str = ''
                for (let i = 0, len = curImei.length; i < len; i++) {
                    str += curImei[i]
                    if ((i + 1) % 15 == 0) {
                        if (imeiArr.indexOf(str) < 0) {
                            imeiArr.push(str)
                        }
                        str = ''
                    }
                }
            } else {
                var regExp = new RegExp('^([0-9]{15})$')
                if (!regExp.test(curImei)) {
                    this.errMsg = 'Please enter correct IMEI code'
                    target.focus()
                    return false
                }
                if (curImei.indexOf('012345678912456') > -1) {
                    this.search.imei = ''
                    return false
                }
                imeiArr.push(curImei)
            }
            return imeiArr
        },
        delayAjaxEvt (fn, wait) {
            clearTimeout(this.timer)
            this.timer = setTimeout(function () {
                typeof fn === 'function' && fn()
            }, wait)
        },
        searchIMEI () {
            var t = this
            var target = this.$refs.imei
            var imeiArr = this.getRealIMEIArr(target)
            this.itemsForm.searchLoading = true

            if (!imeiArr) {
                this.itemsForm.searchLoading = false
                return false
            } else {
                this.errMsg = ''
            }

            this.delayAjaxEvt(function () {
                orderApi.selectReturnItems({
                    'imei': imeiArr.join(','),
                    'orderId': t.itemsForm.orderId
                }).then(d => {
                    t.itemsForm.searchLoading = false
                    if (d.success == true) {
                        t.itemsForm.imei = ''
                        t.errMsg = ''
                        if (d.data && d.data.pageInfo && d.data.pageInfo.list && d.data.pageInfo.list.length) {
                            t.itemsData = d.data.pageInfo.list
                        } else {
                            t.itemsData = []
                        }
                        if (d.data && d.data.errorInfo) {
                            var message = ''
                            if (d.data.errorInfo[0].notExistImei != '') {
                                message += 'IMEI not in this order:' + d.data.errorInfo[0].notExistImei

                                if (d.data.errorInfo[1].hasReturnedImei != '') {
                                    message += ', IMEI has return:' + d.data.errorInfo[1].hasReturnedImei
                                }
                            } else if (d.data.errorInfo[1].hasReturnedImei != '') {
                                message += 'IMEI has return:' + d.data.errorInfo[1].hasReturnedImei
                            }
                            t.errMsg = t.errMsg + message
                        }
                    } else {
                        t.$message({
                            showClose: true,
                            message: d.message || 'Service exceptions！',
                            type: 'error'
                        })
                    }
                }).catch(err => {
                    t.itemsForm.searchLoading = false
                    t.$message({
                        showClose: true,
                        message: err.message || 'Service exceptions！',
                        type: 'error'
                    })
                })
            }, 1000)
        },
        hideDialogItemsForm () {
            this.dataItemsVisible = false
        },
        submitDialogItemsForm () {
            if (this.selectDataList.length > 0) {
                this.addLoading = true
                this.$emit('click', this.selectDataList)
                this.$emit('update:itemsVisible', false)
            } else {
                this.$message({
                    showClose: true,
                    message: 'Return items no selected',
                    type: 'error'
                })
            }
        },
        handleSelectionChange (data) {
            this.selectDataList = data
        },
        isSelectTableEvt (row) {
            if (row.canReturnQuantity == 0) {
                return false
            } else {
                return true
            }
        }
    }
}
</script>
<style>
    .selectDialog {
        width: 1050px !important;
    }
</style>
<style scoped>
    .errorMessage{
        margin-bottom: 10px;
        color: #e50038;
    }
    .gridDataTable tr{
        cursor: pointer;
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