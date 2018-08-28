<template>
    <div class="newInventoryBox">
        <left-menu :urlPermiss.sync="urlPermissData"></left-menu>
        <div class="newInventoryLog">
            <div class="newInventoryLog_list">
                <div class="newInventoryTitle">Inventory Log</div>
                <div class="newInventorySearch">
                    <el-form :model="searchForm" class="salesReport_form" :inline="true">
                        <el-row>
                            <el-form-item label="Warehouse">
                                <el-select v-model.trim="searchForm.facilityIdToFind" size="small" filterable placeholder="Please select">
                                    <el-option
                                        v-for="item in facilityOption"
                                        :key="item.facilityId"
                                        :label="item.facilityName"
                                        :value="item.facilityId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Product ID">
                                <el-input size="small" v-model.trim="searchForm.productId">
                                    <el-button slot="append" icon="el-icon-more" @click="moreProductIconClick"></el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="Effective Date" class="dateContent">
                                <el-date-picker type="date"
                                                :editable="false"
                                                :clearable="false"
                                                :picker-options="searchForm.fromPickerOptions"
                                                v-model.trim="searchForm.beginToTime"
                                                format="dd/MM/yyyy"
                                                size="small"
                                                placeholder="DD/MM/YYYY" style="width:44%;">
                                </el-date-picker>
                                <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                                <el-date-picker type="date"
                                                :editable="false"
                                                :clearable="false"
                                                :picker-options="searchForm.toPickerOptions"
                                                v-model.trim="searchForm.endToTime"
                                                format="dd/MM/yyyy"
                                                size="small"
                                                placeholder="DD/MM/YYYY" style="width:44%;">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading" @click="searchNewInventoryLog(1)">Search</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>
                <div class="newInventoryContent" v-loading="searchForm.searchLoading" style="margin: 10px 5px 0 5px">
                    <el-table :data="tableListData" style="width: 100%;font-size: 12px" border :default-sort="{ prop: 'effectiveDate',order: 'descending' }">
                        <el-table-column type="expand" width="20px">
                            <template slot-scope="prop">
                                <el-table :data="prop.row.quaryLogDetailVos" style="width: 100%;font-size: 12px" border>
                                    <el-table-column label="Inventory Item ID" prop="inventoryItemId" align="center" width="150px">
                                        <template slot-scope="scope">
                                            <a @click="goToLog(scope.row.inventoryItemId)" href="javascript:void(0)">{{ scope.row.inventoryItemId }}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="IMEI/Serial Number" prop="imei" align="left" width="160px"></el-table-column>
                                    <el-table-column label="QTY Diff" prop="qtyDiff" align="center" width="85px">
                                        <template slot-scope="scope">
                                            {{ scope.row.qtyDiff | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="ATP Diff" prop="atpDiff" align="center" width="85px">
                                        <template slot-scope="scope">
                                            {{ scope.row.atpDiff | formatNumber }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="Transfer ID" prop="transferId" align="center"></el-table-column>
                                    <el-table-column label="Adjust Reason" prop="adjustReason" align="center"></el-table-column>
                                    <el-table-column label="QTY" prop="qty" align="center" width="65px"></el-table-column>
                                    <el-table-column label="ATP" prop="atp" align="center" width="65px"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="effectiveDate" sortable label="Effective Date" align="left">
                            <template slot-scope="scope">
                                {{ scope.row.effectiveDate | formatFullDate }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="operator" sortable label="Operator" align="center"></el-table-column>
                        <el-table-column prop="totalQtyDiff" sortable label="QTY Diff" align="center" width="85px">
                            <template slot-scope="scope">
                                {{ scope.row.totalQtyDiff | formatNumber }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="totalAtpDiff" sortable label="ATP Diff" align="center" width="85px">
                            <template slot-scope="scope">
                                {{ scope.row.totalAtpDiff | formatNumber }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="usageType" sortable label="Usage Type" align="center"></el-table-column>
                        <el-table-column prop="orderId" sortable label="Order Id" align="center" width="90px"></el-table-column>
                        <el-table-column prop="fromWarehouse" sortable label="From Warehouse" align="center" width="140px"></el-table-column>
                        <el-table-column prop="toWarehouse" sortable label="To Warehouse" align="center"></el-table-column>
                        <el-table-column prop="totalQty" sortable label="QTY" align="center" width="65px"></el-table-column>
                        <el-table-column prop="totalAtp" sortable label="ATP" align="center" width="65px"></el-table-column>
                    </el-table>
                    <div style="clear: both;"></div>
                </div>
            </div>
        </div>
        <select-product-dialog v-if="productDialogFormVisible" :dataProductId.sync="searchForm.productId" :dataVisible.sync="productDialogFormVisible"></select-product-dialog>
    </div>
</template>
<script>
import leftMenu from '~warehouse-common/comp/leftmenu.vue'
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
import selectProductDialog from '~warehouse-common/dialog/productListDialog.vue'
import inventoryItemApi from '~api/warehouse/findInventoryItemApi'
import warehouseapi from '~api/warehouseapi'
import {mapState} from 'vuex'
import Utils from '~utils/index'
export default{
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            facilityOption: [],
            productDialogFormVisible: false,
            searchForm: {
                productId: '',
                facilityIdToFind: '',
                beginToTime: '',
                endToTime: '',
                searchLoading: false,
                fromPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                },
                toPickerOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date(), compareFormat)
                    }
                }
            },
            tableListData: [],
            urlPermissData: '/warehouse_web/index.html#/newInventoryLog'
        }
    },
    components: {
        leftMenu,
        selectProductDialog
    },
    filters: {
        formatFullDate (val) {
            if (!val) {
                return val
            }
            return Utils.getServerDateStrByLocal((val - 0), 'dd/MM/yyyy hh:mm:ss')
        },
        formatDate (val) {
            if (!val) {
                return val
            }
            return Utils.getServerDateStrByLocal((val - 0), 'dd/MM/yyyy')
        },
        formatNumber (value) {
            if (value) {
                value = (value - 0).toFixed(2)
                return Utils.formatToThousands(value)
            } else {
                return value
            }
        }
    },
    mounted () {
        this.searchForm.beginToTime = this.timeNow - 1 * 24 * 60 * 60 * 1000
        this.searchForm.endToTime = this.timeNow - 1 * 24 * 60 * 60 * 1000

        inventoryItemApi.getFacilityList().then(d => {
            if (d.success) {
                this.facilityOption = this.facilityOption.concat(d.data.inventoryFacilitys)
                this.searchForm.facilityIdToFind = d.data.defaultFacilityId
            }else{
                this.$showErrorMessage(d.message)
            }
        }).catch(e => {
            this.$showErrorMessage(e)
        })
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
    },
    mixins: [myInventoryMixin],
    methods: {
        goToLog(id){
            window.open('/warehouse_web/index.html#/newFindInventoryItemLog/inventoryId:' + id)
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        moreProductIconClick () {
            this.productDialogFormVisible = true
        },
        searchNewInventoryLog (params) {
            var t = this

            if (this.getParams().fromDate > this.getParams().toDate) {
                this.$message.error("Start date can't be greater than end date.")

                return false
            }
            var paramsContent = Object.assign({}, this.getParams())
            this.searchForm.searchLoading = true

            warehouseapi.quaryInvLog(paramsContent).then(d => {
                this.searchForm.searchLoading = false
                if (d.success) {
                    this.tableListData.splice(0);
                    if(d.data && d.data.length){
                      this.tableListData = this.tableListData.concat(d.data);
                    }
                }else{
                    this.$showErrorMessage(d.message)
                }
            }).catch(err => {
                this.searchForm.searchLoading = false
                this.$showErrorMessage(err)
            })
        },
        getParams () {
            return {
                productId: this.searchForm.productId,
                facilityId: this.searchForm.facilityIdToFind,
                startOperatorTime: this.setFromDateEvt(this.searchForm.beginToTime),
                endOperatorTime: this.setEndDateEvt(this.searchForm.endToTime)
            }
        },
        setFromDateEvt (beginDate) {
            let date = new Date(beginDate);
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)

            return date.getTime()
        },
        setEndDateEvt (endDate) {
            let date = new Date(endDate);
            date.setHours(23)
            date.setMinutes(59)
            date.setSeconds(59)
            date.setMilliseconds(0)

            return date.getTime()
        },
        setProductId (productId) {
            this.searchForm.productId = productId
            this.searchNewInventoryLog(1)
        }
    }
}
</script>
<style>
    .dateContent .el-form-item__content{
        width: 340px;
    }
</style>
<style scoped>
  .newInventoryLog {
      overflow-y: auto;
      zoom: 1;
      width: 100%;
      transition: margin-right 0.3s ease-in-out;
      padding-left: 188px;
      min-height: 300px;
      padding-bottom: 80px;
  }
  .newInventoryLog .newInventoryTitle {
      height: 40px;
      margin:0 5px;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid #dbdbdb;
  }
  .newInventorySearch{
    border: 1px solid #dbdbdb;
    padding: 5px;
    margin: 10px 5px 0 5px;
  }
  .newInventoryLog_list{
      padding-bottom: 15px;
      background-color: #ffffff;
  }
  .page_box{
      margin-top: 15px;
  }
</style>
