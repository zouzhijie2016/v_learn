<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="search_box shipping_order_form">
        <div class="search_box_tit">Packages On the Way</div>
        <el-row class="search_row">
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Order ID</label>
            <el-input v-model.trim="search.orderId" size="small"></el-input>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Shipment ID</label>
            <el-input v-model.trim="search.shipmentId" size="small"></el-input>
          </el-col>
          <el-col :span="2" :offset="2">
            <el-button class="button" size="small" :loading="loading" @click="queryPackageShipping(1)" type="primary"
                       icon="el-icon-search">Search
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="list_box" v-loading="loading" element-loading-text="Loading...">
        <span class="ship_items el-icon-information">Selected <span
          class="ship_items_nums">{{ packageIdLists.length }}</span> items</span>
        <el-table ref="multipleTable" :data="packageShipOrderList.list" border style="width: 100%;" class="list_table"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="orderId" width="65" label="Order ID" align="center">
            <template slot-scope="props">
              <a href="javascript:void(0)" @click="showOrderDetail(props.row.orderId)">{{props.row.orderId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="shipmentId" label="Shipment ID" sortable width="110" class-name="tab_break"
                           align="center"></el-table-column>
          <el-table-column prop="soldByShop" label="Sold by Shop" width="90" class-name="tab_break"></el-table-column>
          <el-table-column prop="shipmentWarehouse" label="Shipment Warehouse" class-name="tab_break"></el-table-column>
          <el-table-column prop="toAddress" label="To" class-name="tab_break"></el-table-column>
          <el-table-column label="Package Items" class-name="tab_break">
            <template slot-scope="props">
              <span v-for="val in props.row.packageItems" class="pack_table_items">{{val}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Time Shipped" width="100" class-name="tab_break" align="center">
            <template slot-scope="props">
              <span>{{props.row.shippedTime | setTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Operation" width="140" align="center">
            <template slot-scope="props">
              <el-button @click="markAsShipped(props.row)">Mark as Completed</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="shipping_batch_btn">
          <el-button @click="completePackage">Complete Selected Packages</el-button>
        </div>
        <div class="page_box" v-if="packageShipOrderList.list && packageShipOrderList.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="packageShipOrderList.total"
            :page-size="packageShipOrderList.pageSize"
            :current-page.sync="packageShipOrderList.pageNum"
            @current-change="queryPackageShipping">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="" v-show="markCompleteVisible">
      <el-dialog
        custom-class="mark_complete_dialog"
        title="Mark as Completed"
        :visible.sync="markCompleteVisible">
        <div class="markComplete_dialog_text">
          <p>You will mark the following shipments as Completed, please make sure the goods have been shipped to the
            destination: </p>
        </div>
        <div class="markComplete_dialog_desc">
          <div v-for="val in packageShipmentIdLists">Shipment#{{val}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="markCompleteVisible = false">Cancel</el-button>
        <el-button type="primary" @click="markComplete" :loading="dialogLoading">Complete Shipment</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import leftShippingMenu from '~warehouse-common/comp/leftShippingMenu.vue'
import shippingApi from '~api/warehouse/shippingApi'
import Utils from '~utils/index'
import {myShippingMixin} from '~warehouse-common/comp/warehouseMixins'
export default {
    data () {
        return {
            loading: false,
            dialogLoading: false,
            markCompleteVisible: false,
            currentRouteUrl: '',
            packageShipmentIdLists: [],
            packageIdLists: [],
            search: {orderId: '', shipmentId: ''},
            packageShipOrderList: {
                pageNum: 1,
                pageSize: 10,
                total: 2
            }
        }
    },
    mixins: [myShippingMixin],
    mounted () {
        this.currentRouteUrl = this.$route.path
        this.queryPackageShipping(1)
    },
    components: {
        leftShippingMenu
    },
    filters: {
        setTime: function (value) {
            return Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss')
        }
    },
    methods: {
        queryPackageShipping (num) {
            var _self = this
            _self.loading = true
            shippingApi.getPackageOnTheWay({
                orderId: _self.search.orderId,
                shipmentId: _self.search.shipmentId,
                pageNum: num || _self.packageShipOrderList.pageNum
            }).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data && d.data.list) {
                        d.data.list.map(function (val) {
                            let items = val.packageItems.split('####')
                            val.packageItems = items
                        })
                    }
                    _self.packageShipOrderList = d.data
                    _self.packageIdLists.splice(0)
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e)
            })
        },
        handleSelectionChange (val) {
            var _self = this
            _self.packageShipmentIdLists.splice(0)
            _self.packageIdLists.splice(0)
            val.map(function (item) {
                _self.packageShipmentIdLists.push(item.shipmentId)
                _self.packageIdLists.push(item.id)
            })
        },
        completePackage () {
            if (this.packageIdLists.length == 0) {
                this.$showErrorMessage('Please select items')
                return
            }
            this.markCompleteVisible = true
        },
        showOrderDetail (orderId) {
            window.open('/order_web/index.html#/orderDetail?orderId=' + orderId)
        },
        markAsShipped (item) {
            this.$refs.multipleTable.clearSelection()
            this.$refs.multipleTable.toggleRowSelection(item)
            this.packageShipmentIdLists.splice(0)
            this.packageIdLists.splice(0)
            this.packageShipmentIdLists.push(item.shipmentId)
            this.packageIdLists.push(item.id)
            this.markCompleteVisible = true
        },
        markComplete () {
            var _self = this
            _self.dialogLoading = true
            shippingApi.markAsComplete({
                ids: _self.packageIdLists.join(',')
            }).then(d => {
                _self.dialogLoading = false
                if (d.success) {
                    this.markCompleteVisible = false
                    this.queryPackageShipping()
                    _self.$showSuccessMessage(d.message)
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.dialogLoading = false
                _self.$showErrorMessage(e)
            })
        }
    }

}
</script>
<style>
  .center_main {
    overflow-y: auto;
    zoom: 1;
    width: 100%;
    transition: margin-right 0.3s ease-in-out;
    padding-left: 218px;
    min-height: 300px;
  }

  .list_box .tab_break > div {
    word-break: break-word;
  }

  .mark_complete_dialog {
    width: 560px;
  }
</style>
<style scoped>
  .center_main {
    padding-bottom: 100px;
  }

  .shipping_order_form .shipping_order_form_label {
    font-size: 12px;
    min-width: 96px;
    text-align: right;
    margin-right: 10px;
    margin-bottom: 0px;
  }

  .search_box {
    margin-bottom: 15px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 10px 24px 24px;
    background-color: #fff;
  }

  .col_box {
    display: flex;
    align-items: center;
  }

  .search_box_tit {
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
  }

  .pack_table_items {
    display: block;
  }

  .table_row > div {
    font-size: 12px;
  }

  .list_box {
    background-color: #fff;
    padding: 10px 24px 24px;
    border: 1px solid #dbdbdb;
  }

  .list_box .result_store > span {
    color: red;
  }

  .list_table {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .ship_items {
    margin-left: 10px;
    line-height: 30px;
  }

  .ship_items_nums {
    color: #1FBCD2;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }

  .markComplete_dialog_text {
    padding: 20px 10px;
  }

  .markComplete_dialog_desc {
    padding-bottom: 20px;
    text-align: center;
  }


</style>
