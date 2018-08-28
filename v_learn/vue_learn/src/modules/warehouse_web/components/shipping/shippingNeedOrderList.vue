<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="search_box shipping_order_form">
        <div class="search_box_tit">Search Shipping-Needed Order</div>
        <el-row class="search_row">
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Sold by Shop</label>
            <el-select v-model.trim="search.soldByShopId" filterable size="small" placeholder="Please select...">
              <el-option
                v-for="item in shopGroupOptions"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Shipment Warehouse</label>
            <el-select v-model.trim="search.shipmentWarehouseId" filterable size="small" placeholder="Please select...">
              <el-option
                v-for="item in warehouseGroupOptions"
                :key="item.facilityId"
                :label="item.facilityName"
                :value="item.facilityId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Status</label>
            <el-select v-model.trim="search.status" size="small" placeholder="Please select...">
              <el-option
                v-for="item in statusGroupOptions"
                :key="item.statusGroupId"
                :label="item.statusGroupName"
                :value="item.statusGroupId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Order ID</label>
            <el-input v-model.trim="search.orderId" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row class="search_row">
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Shipment ID</label>
            <el-input v-model.trim="search.shipmentId" size="small"></el-input>
          </el-col>
          <el-col :span="12" class="col_box col_datepicker">
            <label class="shipping_order_form_label">Date Ordered</label>
            <el-date-picker type="date"
                            :picker-options="search.fromPickerOptions"
                            v-model="search.serverFromTime"
                            format="dd/MM/yyyy"
                            size="small"
                            placeholder="DD/MM/YYYY">
            </el-date-picker>
            <label class="col_datepicker_label">-</label>
            <el-date-picker type="date"
                            :picker-options="search.toPickerOptions"
                            v-model="search.serverToTime"
                            format="dd/MM/yyyy"
                            size="small"
                            placeholder="DD/MM/YYYY">
            </el-date-picker>
          </el-col>
          <el-col :span="6" class="col_box">
            <label class="shipping_order_form_label">Driver</label>
            <el-input v-model.trim="search.driver" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" :offset="22" class="col_box">
            <el-button class="button" size="small" :loading="loading" @click="getShipNeedOrder(1)" type="primary"
                       icon="el-icon-search">Search
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="list_box" v-loading="loading" element-loading-text="Loading...">
        <div class="list_box_tit">
          <div>Shipping-Needed Order List</div>
        </div>
        <div class="list_box_result">
          <span class="result_nums">{{shippingNeedOrderLists.total}}</span>&nbsp;&nbsp;Results as following :&nbsp;&nbsp;
        </div>
        <div v-if="isDataLoading">
          <el-table :data="shippingNeedOrderLists.list" border style="width: 100%;" class="list_table"
                    v-loading="loading" element-loading-text="Loading...">
            <el-table-column type="index" width="40" label="No." align="center"></el-table-column>
            <el-table-column width="85" label="Order ID" sortable :sort-method="sortOrderId" align="center">
              <template slot-scope="props">
                <a href="javascript:void(0)" @click="showOrderDetail(props.row.orderId)">{{props.row.orderId}}</a>
              </template>
            </el-table-column>
            <el-table-column label="Shipment ID" width="70" class-name="tab_break" align="center">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">
                    <a href="javascript:void(0)" @click="showDeliver(val.shipmentId)">{{val.shipmentId ? val.shipmentId
                      : '----'}}</a>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Sold Shop" width="90" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.soldByShop ?
                    val.soldByShop : '----'}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="From Warehouse" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.fromWareHouse ?
                    val.fromWareHouse : '----'}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="To" width="130" class-name="tab_break">
              <template slot-scope="props">
                <div v-if="props.row.shippingOrderList && props.row.shippingOrderList[0]">
                  {{props.row.shippingOrderList[0].toAddress ? props.row.shippingOrderList[0].toAddress : '----'}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Driver/Tel/License" width="120" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.desc ? val.desc :
                    '----'}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Date Ordered" width="90" class-name="tab_break" align="center">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.dateOrdered |
                    setTime}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Date Shipped" align="center" width="90" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.dateShipped |
                    setTime}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="Last Updated" width="110" align="center" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.lastUpdated ?
                    val.lastUpdated : '----'}}
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="status" width="85" align="center" class-name="tab_break">
              <template slot-scope="props">
                <template v-if="props.row.shippingOrderList">
                  <div v-for="val in props.row.shippingOrderList" class="table_split_row">{{val.status}}</div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page_box" v-if="shippingNeedOrderLists.list && shippingNeedOrderLists.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="shippingNeedOrderLists.total"
            :page-size="shippingNeedOrderLists.pageSize"
            :current-page.sync="shippingNeedOrderLists.pageNum"
            @current-change="getShipNeedOrder">
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
import _ from 'lodash'
export default {
    data () {
        var _this = this
        var compareFormat = 'yyyy/MM/dd'
        return {
            loading: false,
            currentRouteUrl: '',
            isDataLoading: false,
            search: {
                soldByShopId: '',
                shipmentWarehouseId: '',
                status: '',
                orderId: '',
                shipmentId: '',
                startDateOrder: '',
                endDateOrder: '',
                driver: '',
                serverFromTime: '',
                serverToTime: '',
                fromPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.serverToTime) {
                            return time > _this.getCompareDate(_this.search.serverToTime)
                        }
                        if (!_this.search.serverToTime) {
                            return time > _this.getCompareDate(new Date())
                        }
                        return false
                    }
                },
                toPickerOptions: {
                    disabledDate: (time) => {
                        if (_this.search.serverFromTime) {
                            return time < Utils.getPartialDate(_this.search.serverFromTime, compareFormat) || time > Utils.getPartialDate(new Date(), compareFormat)
                        }
                        return false
                    }
                }
            },
            shopGroupOptions: [],
            warehouseGroupOptions: [],
            statusGroupOptions: [
                {statusGroupId: '', statusGroupName: 'All'},
                {statusGroupId: 'Paid', statusGroupName: 'Paid'},
                {statusGroupId: 'Packed', statusGroupName: 'Packed'},
                {statusGroupId: 'Shipped', statusGroupName: 'Shipped'},
                {statusGroupId: 'Completed', statusGroupName: 'Completed'}
            ],
            shippingNeedOrderLists: {
                list: [],
                pageNum: 1,
                pageSize: 10,
                total: 2
            },
            formatData: {
                shipmentId: [],
                soldByShop: [],
                fromWareHouse: [],
                dateOrdered: [],
                dateShipped: [],
                toAddress: '',
                desc: [],
                lastUpdated: [],
                status: []
            },
            sortOrderId (pre, cur) {
                if (pre.orderId > cur.orderId) {
                    return true
                } else {
                    return false
                }
            }
        }
    },
    mixins: [myShippingMixin],
    watch: {
        'search.serverFromTime': function (newVal) {
            this.search.startDateOrder = newVal ? Utils.getServerTimestamp(newVal) || '' : ''
        },
        'search.serverToTime': function (newVal) {
            if (newVal) {
                var d = Utils.parseDate(newVal)
                var newD = new Date(d.setDate(d.getDate() + 1))
                this.search.endDateOrder = Utils.getServerTimestamp(newD) - 1 || ''
            } else {
                this.search.endDateOrder = ''
            }
        }
    },
    mounted () {
        this.currentRouteUrl = this.$route.path
        this.getInitShopAndWarehouse()
    },
    filters: {
        setTime: function (value) {
            return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
        }
    },
    components: {
        leftShippingMenu
    },
    methods: {
        getShipNeedOrder (num) {
            var _self = this
            _self.loading = true
            var paramsContent = Object.assign({}, this.getParams(), {pageNum: num})
            shippingApi.getShippingNeedOrder(paramsContent).then(d => {
                _self.loading = false
                if (d.success) {
                    _self.isDataLoading = true
                    _self.shippingNeedOrderLists = d.data
                    if (d.data.list) {
                        _self.setParmersData()
                    }
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e)
            })
        },
        getInitShopAndWarehouse () {
            var _self = this
            _self.loading = true
            var getSaleShopPromise = new Promise(function (resolve) {
                _self.getSaleShop(function (data) {
                    resolve(data)
                })
            })
            var getFacilityPromise = new Promise(function (resolve) {
                _self.getFacility(function (data) {
                    resolve(data)
                })
            })
            Promise.all([getSaleShopPromise, getFacilityPromise]).then(function (arr) {
                _self.getShipNeedOrder(1)
            }, function () {
            })
        },
        getSaleShop (cb) {
            shippingApi.getSaleShop().then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.shopGroupOptions = d.data
                    this.shopGroupOptions.unshift({'storeId': '', 'storeName': 'ALL'})
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        getFacility (cb) {
            shippingApi.getFacility().then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.warehouseGroupOptions = d.data.inventoryFacilitys
                    this.warehouseGroupOptions.unshift({'facilityId': '', 'facilityName': 'ALL'})
                    this.search.shipmentWarehouseId = ''
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        showOrderDetail (orderId) {
            window.open('/order_web/index.html#/orderDetail?orderId=' + orderId)
        },
        showDeliver (id) {
            window.open('#/printShipmentData/shipmentId:' + id)
        },
        getParams () {
            return {
                soldByShopId: this.search.soldByShopId,
                shipmentWarehouseId: this.search.shipmentWarehouseId,
                status: this.search.status,
                orderId: this.search.orderId,
                shipmentId: this.search.shipmentId,
                startDateOrder: this.search.startDateOrder,
                endDateOrder: this.search.endDateOrder,
                driver: this.search.driver,
                pageNum: this.shippingNeedOrderLists.pageNum
            }
        },
        setParmersData () {
            this.shippingNeedOrderLists.list.forEach(function (val) {
                if (!val.shippingOrderList || val.shippingOrderList.length == 0) {
                    return
                }
                val.shippingOrderList.forEach(function (item) {
                    var text = ''
                    var last = ''
                    for (let n in item) {
                        if (n == 'driver') {
                            text += item[n] + ','
                            continue
                        }
                        if (n == 'telephone') {
                            text += item[n] + ','
                            continue
                        }
                        if (n == 'license') {
                            text += item[n]
                            item.desc = text
                            continue
                        }
                        if (n == 'lastUpdatedTime') {
                            last += Utils.getServerDateStrByLocal(item[n], 'dd/MM/yyyy hh:mm:ss') + ','
                            continue
                        }
                        if (n == 'lastUpdatedUser') {
                            last += item[n],
                            item.lastUpdated = last
                            continue
                        }
                    }
                })
            })
        },
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        endDateChangeEvt (newVal) {
            if (newVal) {
                var d = Utils.parseDate(newVal)
                var newD = new Date(d.setDate(d.getDate() + 1))
                return Utils.getServerTimestamp(newD) - 1 || ''
            } else {
                return ''
            }
        },
        getParamsStr (params) {
            var paramStr = ''
            if (params) {
                for (var k in params) {
                    if (k && params[k] != null) {
                        var sParaVal = ''
                        if (typeof params[k] == 'string' || typeof params[k] == 'number') {
                            sParaVal = params[k]
                        } else if (typeof params[k] == 'object') {
                            sParaVal = JSON.stringify(params[k]).replace(/\"/g, "\\'")
                        }
                        paramStr += '&' + k + '=' + sParaVal
                    }
                }
            }
            if (paramStr) {
                paramStr = '?' + paramStr.substring(1)
            }
            return paramStr
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

  .search_row {
    margin-bottom: 10px;
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

  .table_split_row {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    /*white-space: normal;*/
    word-wrap: break-word;
    word-break: break-all;
    line-height: initial;
    padding: 5px 5px 8px;
    height: 50px;
    word-break: break-word;
  }


</style>
