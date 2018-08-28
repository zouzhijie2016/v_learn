<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="search_box shipping_order_form">
        <div class="search_box_tit">Packages Pending to Ship</div>
        <el-row class="search_row">
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Order ID</label>
            <el-input v-model.trim="search.orderId" size="small"></el-input>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Shipment ID</label>
            <el-input v-model.trim="search.shipmentId" size="small"></el-input>
          </el-col>
          <el-col :span="2" :offset="2" class="col_box">
            <el-button class="button" size="small" :loading="loading" @click="queryPackageToShip(1)" type="primary"
                       icon="el-icon-search">Search
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="list_box" v-loading="loading" element-loading-text="Loading...">
        <div class="list_box_result">
          <span class="result_nums">{{packageShipOrderList.total}}</span>&nbsp;&nbsp;Results as following :&nbsp;&nbsp;
        </div>
        <el-table ref="multipleTable" :data="packageShipOrderList.list" border style="width: 100%;" class="list_table"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="orderId" sortable width="85" label="Order ID" align="center">
            <template slot-scope="props">
              <a href="javascript:void(0)" @click="showOrderDetail(props.row.orderId)">{{props.row.orderId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="shipmentId" label="Shipment ID" width="90" class-name="tab_break"
                           align="center"></el-table-column>
          <el-table-column prop="soldByShop" label="Sold by Shop" width="90" class-name="tab_break"></el-table-column>
          <el-table-column prop="shipmentWarehouse" label="Shipment Warehouse" class-name="tab_break"></el-table-column>
          <el-table-column prop="toAddress" label="To" class-name="tab_break"></el-table-column>
          <el-table-column label="Package Items" class-name="tab_break">
            <template slot-scope="props">
              <span v-for="val in props.row.packageItems" class="pack_table_items">{{val}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="packedTime" sortable label="Time Packed" width="110" class-name="tab_break"
                           align="center"></el-table-column>
          <el-table-column label="Operation" width="120" align="center">
            <template slot-scope="props">
              <el-button @click="markAsShipped(props.row)">Mark as Shipped</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="shipping_batch_btn">
          <el-button @click="markAsShippedLists">Ship Selected Packages</el-button>
          <span class="ship_items">Selected <span class="ship_items_nums">{{ selectedToShipLists.length }}</span> items</span>
        </div>
        <div class="page_box" v-if="packageShipOrderList.list && packageShipOrderList.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="packageShipOrderList.total"
            :page-size="packageShipOrderList.pageSize"
            :current-page.sync="packageShipOrderList.pageNum"
            @current-change="queryPackageToShip">
          </el-pagination>
        </div>
      </div>

    </div>
    <mark-shipped-dialog v-if="markDialogVisible" :dataVisible.sync="markDialogVisible"
                         :shippmentIds.sync="selectedToShipLists" :ids.sync="selectedShipmentIdList"
                         v-on:refreshItems="queryPackageToShip"></mark-shipped-dialog>
  </div>
</template>
<script>
import leftShippingMenu from '~warehouse-common/comp/leftShippingMenu.vue'
import markShippedDialog from '~warehouse-common/dialog/markShippedDialog.vue'
import shippingApi from '~api/warehouse/shippingApi'
import Utils from '~utils/index'
import {myShippingMixin} from '~warehouse-common/comp/warehouseMixins'
export default {
    data () {
        return {
            loading: false,
            markDialogVisible: false,
            currentRouteUrl: '',
            search: {
                orderId: '',
                shipmentId: ''
            },
            packageShipOrderList: {
                list: [],
                pageNum: 1,
                pageSize: 10
            },
            selectedToShipLists: [],
            selectedShipmentIdList: []
        }
    },
    mixins: [myShippingMixin],
    mounted () {
        document.title = 'Shipping | Warehouse | OCMS-BIM'
        this.currentRouteUrl = this.$route.path
        this.queryPackageToShip(1)
    },
    components: {
        leftShippingMenu,
        markShippedDialog
    },
    methods: {
        queryPackageToShip (num) {
            var _self = this
            _self.loading = true
            shippingApi.getPackedShipOrder({
                orderId: _self.search.orderId,
                shipmentId: _self.search.shipmentId,
                pageNum: num || _self.packageShipOrderList.pageNum
            }).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data && d.data.list) {
                        d.data.list.forEach(function (val) {
                            let items = val.packageItems.split('####')
                            val.packageItems = items
                            val.packedTime = _self.formatTimeForTimestamp(val.packedTime)
                        })
                    }
                    _self.packageShipOrderList = d.data
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
            _self.selectedToShipLists.splice(0)
            _self.selectedShipmentIdList.splice(0)
            val.map(function (item) {
                _self.selectedToShipLists.push(item.shipmentId)
                _self.selectedShipmentIdList.push(item.id)
            })
        },
        showOrderDetail (orderId) {
            window.open('/order_web/index.html#/orderDetail?orderId=' + orderId)
        },
        markAsShipped (item) {
            this.$refs.multipleTable.clearSelection()
            this.$refs.multipleTable.toggleRowSelection(item)
            this.selectedToShipLists.splice(0)
            this.selectedShipmentIdList.splice(0)
            this.selectedToShipLists.push(item.shipmentId)
            this.selectedShipmentIdList.push(item.id)
            this.markDialogVisible = true
        },
        markAsShippedLists () {
            if (this.selectedToShipLists.length == 0) {
                this.$showErrorMessage('Please select items')
                return
            }
            this.markDialogVisible = true
        },
        formatTimeForTimestamp (time) {
            return Utils.getServerDateStrByLocal(time, 'dd/MM/yyyy hh:mm:ss')
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
</style>
<style scoped>
  .shipping_order_form .shipping_order_form_label {
    font-size: 12px;
  }

  .search_box {
    margin-bottom: 15px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 10px 24px 24px;
    background-color: #fff;
  }

  .search_box_tit {
    font-size: 14px;
    font-weight: bold;
    line-height: 40px;
  }

  .list_box_result {
    font-size: 12px;
    font-weight: bold;
    line-height: 30px;
  }

  .center_main {
    padding-bottom: 100px;
  }

  .ship_items_nums, .result_nums {
    color: #1FBCD2;
  }

  .ship_items {
    margin-left: 10px;
  }

  .table_row > div {
    font-size: 12px;
  }

  .col_box {
    display: flex;
    align-items: center;
  }

  .pack_table_items {
    display: block;
  }

  .col_box label {
    min-width: 96px;
    text-align: right;
    margin-right: 10px;
    margin-bottom: 0px;
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

  .page_box {
    text-align: right;
    margin-top: 10px;
  }
</style>
