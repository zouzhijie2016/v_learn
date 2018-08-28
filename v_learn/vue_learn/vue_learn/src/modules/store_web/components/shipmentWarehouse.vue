<template>
  <div id="shipmentWarehouse">
    <template v-if="storeId">
      <left-store-menu :productStoreId.sync="storeId"></left-store-menu>
    </template>
    <div class="center_main">
      <div class="shipment_title"><h2>Current Warehouse Available for Shipment for Store:<span
        class="shipment_title_name">{{storeName}}[{{storeId}}]</span></h2></div>
      <div class="shipment_table">
        <el-table :data="warehouseItemData" border style="width: 70%;" class="list_table" v-loading="loading"
                  element-loading-text="Loading...">
          <el-table-column type="index" label="No." align="center"></el-table-column>
          <el-table-column prop="facilityName" label="Warehouse" align="center"
                           class-name="list_table_column"></el-table-column>
          <el-table-column label="Operable" align="center" class-name="list_table_btn">
            <template slot-scope="props">
              <span @click="delWarehouse(props.row)" class="el-icon-mydel"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="shipment_operate">
        <div class="operate_click" v-show="!isShowAdd"><span
          @click=" isShowAdd = true ">+Add New Shipment Warehouse</span></div>
        <div class="operate_add" v-show="isShowAdd">
          <el-select v-model="warehouseId" placeholder="Select a Warehouse">
            <el-option v-for="item in warehouseOptions" :key="item.facilityId" :label="item.facilityName"
                       :value="item.facilityId"></el-option>
          </el-select>
          <el-button type="primary" @click="addWarehouseToStore">Add</el-button>
          <el-button @click=" isShowAdd = false ">Cancel</el-button>
        </div>

      </div>

    </div>
    <el-dialog
      title="Remove Shipment Warehouse"
      :visible.sync="dialogVisible"
      size="tiny">
      <div style="text-align: center">
        <span>Are you sure to remove {{willDelfacilityName}}</span><br>
        <span>from the shipment warehouse list?</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogRemoveFacility">Remove</el-button>
        <el-button @click="dialogVisible = false">Cancel</el-button>
  </span>
    </el-dialog>


  </div>

</template>
<script>
import leftStoreMenu from '~store-common/leftstoremenu.vue'
import storeShippmentApi from '~api/storeShippmentApi'
import _ from 'lodash'
export default{
    data () {
        return {
            isShowAdd: false,
            dialogVisible: false,
            loading: false,
            isInit: true,
            storeName: '',
            storeId: '',
            facilityId: '',
            willDelfacilityName: '',
            willDelfacilityId: '',
            warehouseId: '',
            warehouseItemData: [],
            warehouseOptions: []
        }
    },
    components: {
        leftStoreMenu
    },
    created () {
        this.storeId = this.getUrlKey('productStoreId')
        this.getStoreShipInfo({storeId: this.storeId})
    },
    methods: {
        getStoreShipInfo (params) {
            var _self = this
            var selfStoreShipPromise = new Promise(function (resolve) {
                _self.getSelfStoreShipFacility(function (data) {
                    resolve(data)
                })
            })
            var allStoreShipPromise = new Promise(function (resolve) {
                _self.getAllStoreShipFacility(params, function (data) {
                    resolve(data)
                })
            })
            Promise.all([selfStoreShipPromise, allStoreShipPromise]).then(function (arr) {
                _self.getExceptFacility(params)
            }, function () {
            })
        },
        getAllStoreShipFacility (params, cb) {
            this.loading = true
            storeShippmentApi.getShipFacilityByStoreId(params).then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.warehouseItemData = d.data
                } else {
                    this.showErroMessage(d.message, 'Service exceptions！')
                }
                this.loading = false
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
                this.loading = false
                this.showErroMessage(e.message, 'Service exceptions！')
            })
        },
        getSelfStoreShipFacility (cb) {
            storeShippmentApi.getStoreMsgByStoreId(this.storeId).then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.storeName = d.data.storeName
                    this.storeId = d.data.productStoreId
                    this.inventoryFacilityId = d.data.inventoryFacilityId
                } else {
                    this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
                this.showErroMessage(e.message, 'Service exceptions！')
            })
        },
        getExceptFacility (params) {
            var _self = this
            storeShippmentApi.getAllFacility(params).then(d => {
                if (d.success) {
                    _self.warehouseOptions = d.data
                    _self.againSetFacility()
                }
            })
        },
        againSetFacility () {
            var _self = this
            if (_self.warehouseOptions.length > 0) {
                var options = _self.warehouseOptions.filter(function (item) {
                    var index = _.findIndex(_self.warehouseItemData, function (chr) {
                        return item.facilityId == chr.facilityId
                    })
                    return index == -1
                })
                _self.warehouseOptions.splice(0)
                _self.warehouseOptions = _self.warehouseOptions.concat(options)
            }
        },
        delWarehouse (item) {
            var _self = this
            _self.dialogVisible = true
            _self.willDelfacilityId = item.facilityId
            _self.willDelfacilityName = item.facilityName
        },
        dialogRemoveFacility () {
            var _self = this
            storeShippmentApi.delShipFacilityByFacilityId({
                facilityId: _self.willDelfacilityId,
                productStoreId: _self.storeId
            }).then(d => {
                console.dir(d)
                if (d.success) {
                    _self.$message({message: 'Delete facility success', type: 'success'})
                    _self.dialogVisible = false
                    _self.getStoreShipInfo({storeId: _self.storeId})
                } else {
                    this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(e => {
                this.showErroMessage(e.message, 'Service exceptions！')
            })
        },
        addWarehouseToStore () {
            console.dir(this.warehouseId)
            var _self = this
            var facilitys = _self.warehouseOptions.filter(function (item) {
                return item.facilityId === _self.warehouseId
            })
            storeShippmentApi.insertShipFacilityByBatch({
                productStoreId: this.storeId,
                facilitys: facilitys
            }).then(d => {
                console.dir(d)
                if (d.success) {
                    this.$message({
                        message: 'Successfully added!',
                        type: 'success'
                    })
                    this.warehouseId = ''
                    this.getStoreShipInfo({storeId: this.storeId})
                    this.isShowAdd = false
                }
            }).catch(e => {
                console.dir(e)
            })
        },
        getUrlKey: function (name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
        },
        showErroMessage (msg, type) {
            this.$message({
                showClose: true,
                message: msg || type,
                type: 'error'
            })
        }

    }

}

</script>
<style scope>
  .center_main {
    overflow-y: auto;
    zoom: 1;
    width: 100%;
    transition: margin-right 0.3s ease-in-out;
    padding-left: 188px;
    min-height: 300px;
    padding-bottom: 80px;
  }

  .shipment_title {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .shipment_title_name {
    color: #1FBCD2;
  }

  .shipment_operate .operate_click {
    margin: 10px 0px;
    color: #1FBCD2;
    cursor: pointer;
  }

  .operate_add {
    margin: 10px 0px;
  }


</style>
