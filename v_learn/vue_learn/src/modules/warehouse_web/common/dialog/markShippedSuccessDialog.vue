<template>
  <div>
    <el-dialog title="Message" custom-class="markShippedDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="shipped_title">The following packages will be delivered by</div>
      <div class="shipped_desc">
        <div class="shipped_desc_group"><label>Driver:</label><span>{{ markShippedCompleteDatas.driverName }}</span>
        </div>
        <div class="shipped_desc_group"><label>Tel:</label><span>{{markShippedCompleteDatas.telephone}}</span></div>
        <div class="shipped_desc_group"><label>License No.:</label><span>{{ markShippedCompleteDatas.licenseNo }}</span>
        </div>
        <div class="shipped_desc_group"><label>Note:</label><span>{{ markShippedCompleteDatas.note ? markShippedCompleteDatas.note : '----' }}</span>
        </div>
      </div>
      <div class="shipped_table"  v-loading="loading" element-loading-text="Loading...">
        <template v-for="(item,index) in shipmentList">
          <div class="shipped_table_tit">
            <div class="shipped_table_name"><label>Shipment ID:</label> {{ item.shipmentId }}</div>
            <div class="shipped_table_name"><label>Package ID:</label> {{ item.packageId }}</div>
            <div class="shipped_table_name"><label>From:</label> {{ item.fromWarehouse }}</div>
            <div class="shipped_table_name"><label>To:</label> {{ item.toAddress }}</div>
          </div>
          <el-table :data="item.shipmentPackageItemList" style="width: 100%;" class="list_table">
            <el-table-column type="index" width="55" label="No." align="center"></el-table-column>
            <el-table-column label="Product" width="200" class-name="tab_break" align="center">
              <template slot-scope="props">
                <span>{{ props.row.productName }}&nbsp;&nbsp;{{ props.row.productFeature }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="Quantity" align="center" class-name="tab_break"></el-table-column>
            <el-table-column label="IMEI" class-name="tab_break">
              <template slot-scope="props">
                <span v-for="val in props.row.imeiList" class="list_table_imei">{{ val }},</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="shipped_btn">
        <el-button type="primary" @click="printShipping">Print Shipping List</el-button>
        <el-button @click="cancelPrint">Cancel</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import shippingApi from '~api/warehouse/shippingApi'
import _ from 'lodash'
export default {
    props: ['dataSuccessVisible', 'shippmentIDs', 'ids', 'closeDialogAndRefresh'],
    data () {
        return {
            dataCloseVisible: true,
            loading: false,
            isPrint: false,
            markShippedCompleteDatas: {
                driverName: '',
                telephone: '',
                licenseNo: '',
                note: ''
            },
            shipmentList: []
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataSuccessVisible', this.dataCloseVisible)
        }
    },
    created () {
        this.getMarkShippedSuccessData()
    },
    methods: {
        getMarkShippedSuccessData () {
            var _self = this
            _self.loading = true
            shippingApi.getShipmentPackageListDetail({
                shipmentIdList: _self.ids
            }).then(d => {
                _self.loading = false
                if (d.success) {
                    if (d.data) {
                        _self.shipmentList.splice(0)
                        _self.shipmentList = _self.shipmentList.concat(d.data)
                        _self.setParmersShipmentData()
                    }
                } else {
                    _self.loading = false
                    _self.$showErrorMessage(d.message)
                }
            })
                .catch(e => {
                    _self.$showErrorMessage(e.message)
                })
        },
        setParmersShipmentData () {
            var _self = this
            _self.shipmentList.forEach(function (item) {
                _self.markShippedCompleteDatas.driverName = item.driverName
                _self.markShippedCompleteDatas.telephone = item.telephone
                _self.markShippedCompleteDatas.licenseNo = item.licenseNo
                _self.markShippedCompleteDatas.note = item.note
            })
        },
        printShipping () {
            var newIds = this.shippmentIDs.join(',')
            window.open('#/printShipmentData/listShipmentId:' + newIds)
        },
        cancelPrint () {
            this.$emit('update:dataSuccessVisible', false)
            this.$emit('closeDialogAndRefresh', false)
        }
    }
}
</script>
<style>
  .markShippedDialog {
    width: 1000px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #dbdbdb;
    padding-bottom: 10px;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
</style>
<style scoped>
  .shipped_title {
    font-weight: bold;
    line-height: 40px;
  }

  .shipped_desc {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .shipped_desc .shipped_desc_group {
    float: left;
    margin-right: 100px;
    margin-bottom: 10px;
  }

  .shipped_desc_group > label {
    margin-right: 10px;
  }

  .shipped_table_tit {
    overflow: hidden;
  }

  .shipped_table_name {
    float: left;
    margin-right: 20px;
  }

  .shipped_table_name > label {
    margin-right: 10px;
  }

  .list_table {
    margin-bottom: 20px;
  }

  .list_table_imei {
    margin-right: 20px;
  }

  .shipped_btn {
    text-align: center;
  }


</style>
