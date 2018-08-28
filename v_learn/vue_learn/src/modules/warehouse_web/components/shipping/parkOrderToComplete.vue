<template>
  <div>
    <left-shipping-menu :urlPermiss.sync="currentRouteUrl"></left-shipping-menu>
    <div class="center_main">
      <div class="detail_box">
        <div class="detail_box_tit">
          <div>Packing Orders Success</div>
        </div>
        <div class="detail_box_text">
          <div class="detail_box_group"><label>Order ID:</label><span>{{ packageTables.orderId }}</span></div>
          <div class="detail_box_group"><label>Shipment Warehouse:</label><span>{{ packageTables.warehouseName }}</span>
          </div>
          <div class="detail_box_group"><label>To:</label><span>{{ packageTables.toAddress }}</span></div>
          <div class="detail_box_group"><label>Date Ordered:</label><span>{{packageTables.dateOrder | setTime}}</span>
          </div>
        </div>
      </div>
      <div class="list_box" v-loading="initLoading" element-loading-text="Loading...">
        <div class="package_lists">
          <template v-for="(item,index) in packageTables.packageList">
            <div class="list_box_tit">
              <div class="list_box_name">Package {{ index+1 }}</div>
              <div class="list_box_name">Package ID: {{ item.packageId }}</div>
              <div class="list_box_name">Shipment ID: {{ item.shipmentId }}</div>
            </div>
            <el-table :data="item.packageItemList" style="width: 100%;" class="list_table">
              <el-table-column type="index" width="55" label="No." align="center"></el-table-column>
              <el-table-column label="Product" width="200" class-name="tab_break" align="center">
                <template slot-scope="props">
                  <span>{{ props.row.productName+'  '+props.row.productFeature }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="Quantity" align="center" class-name="tab_break"></el-table-column>
              <el-table-column label="IMEI" class-name="tab_break">
                <template slot-scope="props">
                  <div v-if="props.row.imeiList">
                    <span v-for="val in props.row.imeiList">{{ val }},</span>
                  </div>
                  <div v-if="!props.row.imeiList">
                    <span>----</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="package_btns">
          <el-button type="primary" @click="printPackBill">Print Packing Bills</el-button>
          <el-button @click="backToPackOrder">Back to Pack Order</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Util from '~utils/index'
import leftShippingMenu from '~warehouse-common/comp/leftShippingMenu.vue'
import shippingApi from '~api/warehouse/shippingApi'
import {myShippingMixin} from '~warehouse-common/comp/warehouseMixins'
export default {
    data () {
        return {
            loading: false,
            initLoading: false,
            orderId: '',
            currentRouteUrl: '',
            packageTables: {}
        }
    },
    mixins: [myShippingMixin],
    mounted () {
        this.initParamsValid()
    },
    filters: {
        setTime: function (value) {
            return Util.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss')
        }
    },
    components: {
        leftShippingMenu
    },
    methods: {
        initParamsValid () {
            this.currentRouteUrl = this.$route.path
            this.orderId = this.$route.query.orderId
            let reg = new RegExp('^([a-zA-Z0-9])+$')
            if (!reg.test(this.orderId)) {
                this.$showErrorMessage('The parameter has an illegal character!')
                return false
            }
            this.$message({message: 'Order packed successfully.', type: 'success'})
            this.getPackageTableList()
        },
        printPackBill () {
            if (!this.packageTables.orderId) {
                this.$showErrorMessage('Package info can not empty!')
                return false
            }
            window.open('#/printPackageData/orderId:' + this.packageTables.orderId)
        },
        getPackageTableList () {
            var _self = this
            _self.initLoading = true
            shippingApi.getPackedCompleteOrder({
                orderId: _self.orderId
            }).then(d => {
                _self.initLoading = false
                if (d.success) {
                    if (d.data) {
                        this.packageTables = d.data
                    }
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.initLoading = false
                _self.$showErrorMessage(e)
            })
        },
        backToPackOrder () {
            this.$router.push({path: '/parkOrder'})
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
    float: left;
    font-size: 12px;
    margin-right: 100px;
    margin-bottom: 10px;
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
    margin-right: 100px;

  }

  .list_box .result_store > span {
    color: red;
  }

  .list_table {
    font-size: 12px;
    margin-bottom: 20px;
  }

  .package_lists {
    margin-bottom: 20px;
  }

  .package_btns {
    text-align: center;
  }


</style>
