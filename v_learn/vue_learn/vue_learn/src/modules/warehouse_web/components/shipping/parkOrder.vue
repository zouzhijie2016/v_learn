<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="search_box shipping_order_form">
        <div class="search_box_tit">Order Pending to Pack</div>
        <el-row class="search_row">
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Order ID</label>
            <el-input v-model.trim="search.orderId" size="small"></el-input>
          </el-col>
          <el-col :span="2" :offset="4" class="col_box col_box_btn">
            <el-button class="button" size="small" :loading="loading" @click="queryParkOrder(1)" type="primary"
                       icon="el-icon-search">Search
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="list_box" v-loading="loading" element-loading-text="Loading...">
        <el-table :data="parkOrderList.list" border style="width: 100%;" class="list_table">
          <el-table-column type="index" width="55" label="No." align="center"></el-table-column>
          <el-table-column prop="orderId" width="85" sortable label="Order ID" align="center">
            <template slot-scope="props">
              <a href="javascript:void(0)" @click="showOrderDetail(props.row.orderId)">{{props.row.orderId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="soldByShopName" label="Sold by Shop" class-name="tab_break"></el-table-column>
          <el-table-column prop="originFacilityName" label="Shipment Warehouse"
                           class-name="tab_break"></el-table-column>
          <el-table-column prop="destinationContactAddress" label="To" class-name="tab_break"></el-table-column>
          <el-table-column label="Order Items" class-name="tab_break">
            <template slot-scope="props">
              <span v-for="val in props.row.shipmentItems" class="pack_table_items">{{val}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dateOrder" sortable label="Date Ordered" class-name="tab_break"
                           align="center"></el-table-column>
          <el-table-column label="Operation" width="80" align="center">
            <template slot-scope="props">
              <el-button @click="packOrder(props.row.id)">Pack</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page_box" v-if="parkOrderList.list && parkOrderList.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="parkOrderList.total"
            :page-size="parkOrderList.pageSize"
            :current-page.sync="parkOrderList.pageNum"
            @current-change="queryParkOrder">
          </el-pagination>
        </div>
      </div>

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
            currentRouteUrl: '',
            search: {
                orderId: ''
            },
            parkOrderList: {
                list: [],
                pageNum: 1,
                pageSize: 10,
                total: 2
            }
        }
    },
    mixins: [myShippingMixin],
    mounted () {
        this.initParamsValid()
    },
    components: {
        leftShippingMenu
    },
    methods: {
        initParamsValid () {
            this.currentRouteUrl = this.$route.path
            let reg = new RegExp('^([1-9])+$')
            if (this.$route.params.pageNum && !reg.test(this.$route.params.pageNum)) {
                this.parkOrderList.pageNum = 1
            } else {
                this.parkOrderList.pageNum = this.$route.params.pageNum
            }
            this.queryParkOrder(this.parkOrderList.pageNum)
        },
        queryParkOrder (num) {
            var _self = this
            _self.loading = true
            shippingApi.getPendingPack({
                orderId: _self.search.orderId,
                pageNum: num || _self.parkOrderList.pageNum
            }).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data && d.data.list) {
                        d.data.list.map(function (val) {
                            let items = val.shipmentItems.split('####')
                            val.shipmentItems = items
                            val.dateOrder = _self.formatTimeForTimestamp(val.dateOrder)
                        })
                    }
                    _self.parkOrderList = d.data
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e)
            })
        },
        showOrderDetail (orderId) {
            window.open('/order_web/index.html#/orderDetail?orderId=' + orderId)
        },
        formatTimeForTimestamp (time) {
            return Utils.getServerDateStrByLocal(time, 'dd/MM/yyyy hh:mm:ss')
        },
        packOrder (id) {
            var _self = this
            var arrList = _self.parkOrderList.list.filter(function (val) {
                return val.id == id
            })
            localStorage.setItem('parkOrderList', JSON.stringify(arrList))
            _self.$router.push({path: '/parkOrderToPack', query: {pageNum: _self.parkOrderList.pageNum, id: id}})
        }

    }

}
</script>
<style>
  .tab_box {
    background: #fff;
  }

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
    margin-bottom: 10px;
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

  .pack_table_items {
    display: block;
  }

  .list_box_result {
    font-size: 12px;
    font-weight: bold;
    line-height: 30px;
  }

  .center_main {
    padding-bottom: 100px;
  }

  .table_row > div {
    font-size: 12px;
  }

  .col_box {
    display: flex;
    align-items: center;
  }

  .col_box label.col_datepicker_label {
    margin-left: 10px;
    min-width: 10px;
  }

  .col_box label {
    min-width: 96px;
    text-align: right;
    margin-right: 10px;
    margin-bottom: 0px;
  }

  .col_box_btn {
    margin-left: 10px;
  }

  .col_datepicker label {
    margin-left: 0px;
  }

  .list_box {
    background-color: #fff;
    padding: 10px 24px 24px;
    border: 1px solid #dbdbdb;
  }

  .list_box .list_box_tit {
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .list_box .result_store > span {
    color: red;
  }

  .list_table {
    font-size: 12px;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }


</style>
