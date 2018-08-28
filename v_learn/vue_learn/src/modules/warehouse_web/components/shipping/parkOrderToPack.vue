<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="detail_box">
        <div class="detail_box_tit">
          <div>Packing Orders</div>
        </div>
        <div class="detail_box_text">
          <div class="detail_box_group"><label>Order ID:</label><span>{{ allItems.orderId }}</span></div>
          <div class="detail_box_group"><label>Date Ordered:</label><span>{{allItems.dateOrder | setTime}}</span></div>
        </div>
        <div class="detail_box_text">
          <div class="detail_box_group"><label>Shipment
            Warehouse:</label><span>{{ allItems.originFacilityName }}</span>
          </div>
          <div class="detail_box_group"><label>To:</label><span>{{ allItems.destinationContactAddress }}</span>
          </div>
        </div>
      </div>
      <div class="list_box" v-loading="initLoading" element-loading-text="Loading...">
        <div class="list_box_tit">
          <div>Order Items</div>
        </div>
        <el-table :data="parkOrderItemsList" border style="width: 100%;" class="list_table">
          <el-table-column type="index" width="55" label="No." align="center"></el-table-column>
          <el-table-column label="Product" class-name="tab_break" align="center">
            <template slot-scope="props">
              <span>{{props.row.productName}}&nbsp;&nbsp;{{props.row.productFeatureDescription}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productType" label="IMEI" class-name="tab_break" align="center">
            <template slot-scope="props">
              <span v-if="props.row.productType == 'SERIALIZED_INV_ITEM'">Y</span>
              <span v-if="props.row.productType == 'NON_SERIAL_INV_ITEM'">N</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="Order Quantity" class-name="tab_break"></el-table-column>
          <el-table-column prop="quantity" label="Quantity To Park" class-name="tab_break"></el-table-column>
        </el-table>
        <div class="package_lists">
          <template v-for="(item,index) in allItems.packageList">
            <div class="list_box_tit">
              <div class="list_box_name">Package {{ index+1 }}</div>
              <div class="list_box_close" v-if="index > 0"><i class="el-icon-mydel2"></i></div>
            </div>
            <el-table :data="item.packageItemList" border style="width: 100%;" class="list_table">
              <el-table-column type="index" width="55" label="No." align="center"></el-table-column>
              <el-table-column label="Product" width="200" class-name="tab_break" align="center">
                <template slot-scope="props">
                  <el-select v-model.trim="props.row.productName+'  '+props.row.productFeatureDescription" size="small"
                             placeholder="Please select..." disabled>
                    <el-option v-for="item in productGroupOptions" :key="item.productId" :label="item.productName"
                               :value="item.productId"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="IMEI" align="center" class-name="tab_break">
                <template slot-scope="props">
                  <span v-if="props.row.productType == 'SERIALIZED_INV_ITEM'">Y</span>
                  <span v-if="props.row.productType == 'NON_SERIAL_INV_ITEM'">N</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" align="center" label="Quantity Pending to Pack"
                               class-name="tab_break"></el-table-column>
              <el-table-column label="Pack Quantity" align="center" width="200" class-name="tab_break">
                <template slot-scope="props">
                  <el-input-number v-model="props.row.quantity" :min="+props.row.quantity"
                                   :max="+props.row.quantity"
                                   :step="1" :disabled="true"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="Scan Quantity" align="center" width="100" class-name="tab_break">
                <template slot-scope="props">
                  <span v-if="props.row.productType == 'NON_SERIAL_INV_ITEM'">----</span>
                  <span v-if="props.row.productType == 'SERIALIZED_INV_ITEM' && !props.row.scanQuantity"
                        class="redScan">0</span>
                  <span v-if="props.row.productType == 'SERIALIZED_INV_ITEM' && props.row.scanQuantity > 0"
                        v-bind:class="{redScan : (props.row.scanQuantity < props.row.quantity || props.row.scanQuantity > props.row.quantity)}">{{props.row.scanQuantity}}</span>
                </template>
              </el-table-column>
              <el-table-column label="Operation" align="center" class-name="tab_break">
                <template slot-scope="props">
                  <a href="javascript:void(0)" @click="scanCode(props.row)"
                     v-if="props.row.productType == 'SERIALIZED_INV_ITEM'">Scan</a>
                </template>
              </el-table-column>
              <!--<el-table-column label="" align="center" class-name="tab_break">
                <template slot-scope="props">
                  <span @click="delPack(item,index)" class="el-icon-mydel"></span>
                </template>
              </el-table-column>-->
            </el-table>
            <!--<el-button icon="plus" @click="plusNewLinePackage(item.list)"></el-button>-->
          </template>
          <div class="package_list_btn" style="display:none"><a href="javascript:void(0)" class="package_list_add"
                                                                @click="addPackage">+Add Package</a></div>
        </div>
        <div class="package_btns">
          <el-button type="primary" @click="confirmPackageList" :loading="loading">Confirm</el-button>
          <el-button @click="cancelPackage">Cancel</el-button>
        </div>
      </div>
    </div>
    <scan-imei-code-dialog v-if="scanCodeDialogVisible" :dataVisible.sync="scanCodeDialogVisible"
                           :productDatas.sync="productDatas"></scan-imei-code-dialog>
  </div>
</template>
<script>
import Util from '~utils/index'
import leftShippingMenu from '~warehouse-common/comp/leftShippingMenu.vue'
import scanImeiCodeDialog from '~warehouse-common/dialog/scanImeiCodeDialog.vue'
import shippingApi from '~api/warehouse/shippingApi'
import {myShippingMixin} from '~warehouse-common/comp/warehouseMixins'
export default {
    data () {
        return {
            loading: false,
            initLoading: false,
            scanCodeDialogVisible: false,
            productDatas: {},
            currentRouteUrl: '',
            pageNum: '',
            routeId: '',
            productGroupOptions: [],
            allItems: {
                orderId: '',
                shipmentOrderId: '',
                warehouseId: '',
                packageList: [],
                dateOrder: '',
                originFacilityName: '',
                destinationContactAddress: ''
            },
            parkOrderItemsList: []
        }
    },
    mixins: [myShippingMixin],
    watch: {
        'productDatas': {
            handler: function (newVal) {
                this.allItems.packageList.some(x => {
                    let index = Util.findIndex(x.packageItemList, item => item.orderItemId === newVal.orderItemId)
                    if (index > -1) {
                        x.packageItemList.splice(index, 1, newVal)
                        return true
                    }
                    return false
                })
            }
        }
    },
    mounted () {
        this.initParamsValid()
    },
    filters: {
        setTime: function (value) {
            return Util.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss')
        }
    },
    components: {
        leftShippingMenu,
        scanImeiCodeDialog
    },
    methods: {
        initParamsValid () {
            this.currentRouteUrl = this.$route.path
            this.routeId = this.$route.query.id
            this.pageNum = this.$route.query.pageNum
            if (!this.routeId) {
                this.$showErrorMessage('The parameter id can not empty!')
                return false
            }
            let reg = new RegExp('^([a-zA-Z0-9])+$')
            if (!reg.test(this.routeId) || (this.pageNum && !reg.test(this.pageNum))) {
                this.$showErrorMessage('The parameter has an illegal character!')
                return false
            }
            this.getOrderAndDefaultPackageList()
        },
        getOrderAndDefaultPackageList () {
            var _self = this
            _self.initLoading = true
            shippingApi.getInitPackedOrder({
                id: _self.routeId
            }).then(d => {
                _self.initLoading = false
                if (d.success) {
                    if (d.data) {
                        _self.getParmersDatas(d.data)
                    }
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.initLoading = false
                _self.$showErrorMessage(e)
            })
        },
        handleOrderQtyChange (value) {
            console.dir(value)
        },
        delPack (item, index) {
            item.list.splice(index, 1)
        },
        addPackage () {
            var addNewPackage = {
                packageItemList: [{
                    orderId: 1,
                    product: 'syinix 50 inch',
                    imei: '',
                    quantityPendingToPack: '',
                    packQuantity: ''
                }]
            }
            this.allItems.packageList.push(addNewPackage)
        },
        plusNewLinePackage (list) {
            list.push({orderId: 1, product: 'syinix 50 inch', imei: '', quantityPendingToPack: '', packQuantity: ''})
        },
        confirmPackageList () {
            var _self = this
            if (!_self.allItems.orderId || _self.allItems.packageList.length == 0) {
                _self.$showErrorMessage('package can not empty!')
                return false
            }
            let index = -1
            _self.allItems.packageList.some(x => {
                index = Util.findIndex(x.packageItemList, item => item.productType == 'SERIALIZED_INV_ITEM' && (!item.scanQuantity || item.scanQuantity < item.quantity || item.scanQuantity > item.quantity))
                if (index > -1) {
                    return true
                }
                return false
            })
            if (index > -1) {
                _self.$showErrorMessage('The scan quantity must match the pack quantity.')
                return false
            }
            _self.loading = true
            shippingApi.insertPack(_self.allItems).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data) {
                        _self.$router.push({path: '/parkOrderToComplete', query: {orderId: _self.allItems.orderId}})
                    }
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e)
            })
        },
        cancelPackage () {
            this.$router.push({name: 'parkOrder', params: {pageNum: this.pageNum}})
        },
        scanCode (product) {
            this.productDatas = product
            this.scanCodeDialogVisible = true
        },
        getParmersDatas (data) {
            var _self = this
            _self.parkOrderItemsList.splice(0)
            _self.parkOrderItemsList = _self.parkOrderItemsList.concat(data.shipmentItemList)
            _self.parkOrderItemsList.forEach(function (val) {
                val.productFeature = val.productFeatureDescription
            })
            _self.allItems.orderId = data.orderId
            _self.allItems.warehouseId = data.originFacilityId
            _self.allItems.shipmentOrderId = data.id
            _self.allItems.dateOrder = data.dateOrder
            _self.allItems.originFacilityName = data.originFacilityName
            _self.allItems.destinationContactAddress = data.destinationContactAddress
            _self.allItems.packageList.push({packageId: 1, packageItemList: _self.parkOrderItemsList})
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
  .center_main {
    padding-bottom: 100px;
  }

  .detail_box {
    background-color: #fff;
    padding: 10px 24px;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;
  }

  .detail_box .detail_box_tit {
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .detail_box .detail_box_text {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .detail_box_group {
    font-size: 12px;
    float: left;
    margin-right: 100px;
  }

  .detail_box_group > label {
    margin-right: 10px;
  }

  .table_row > div {
    font-size: 12px;
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

  .list_box .list_box_tit {
    font-weight: bold;
    line-height: 30px;
    overflow: hidden;
  }

  .list_box_name {
    float: left;
  }

  .list_box_close {
    float: right;
  }

  .list_box .result_store > span {
    color: red;
  }

  .list_table {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .package_list_btn {
    margin-top: 10px;
  }

  .package_list_add {
    color: #1FBCD2;
  }

  .package_lists {
    margin-bottom: 20px;
  }

  .redScan {
    color: red;
  }


</style>
