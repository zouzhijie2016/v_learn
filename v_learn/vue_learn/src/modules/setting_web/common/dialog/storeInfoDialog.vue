<template>
  <div>
    <el-dialog title="Store setting info" custom-class="storeInfoDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form :model="form" ref="form" label-width="200px" class="demo-ruleForm" v-loading="loading"
                 element-loading-text="Loading...">
          <el-form-item label="Company : " prop="company" class="store_setting_item">{{form.company}}</el-form-item>
          <el-form-item label="Currency : " prop="currency" class="store_setting_item">{{form.currency}}</el-form-item>
          <el-form-item label="Store name : " prop="storeName" class="store_setting_item">
            {{form.storeName}}
          </el-form-item>
          <el-form-item label="warehouse : " prop="warehouse" class="store_setting_item">
            {{form.warehouse}}
          </el-form-item>
          <el-form-item label="Group : " prop="group" class="store_setting_item">
            {{form.group}}
          </el-form-item>
          <el-form-item label="Sales Channel : " class="store_setting_item">
            <span v-for="val in form.saleChannels" class="store_setting_sales">{{val.storeGroupName}}</span>
          </el-form-item>
          <el-form-item label="Print invoice : " prop="printInvoice">
            {{form.isPrint}}
          </el-form-item>
          <el-form-item label="Tin No : " prop="tinNo">
            {{form.tinNo}}
          </el-form-item>
          <el-form-item label="Tel : " prop="tel" class="store_setting_item">
            {{form.telephone}}
          </el-form-item>
          <el-form-item label="Address(province,city,area) : ">
            <el-col :span="7">
              <el-form-item prop="province">
                <span class="store_info_text">{{form.province}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="city">
                <span class="store_info_text">{{form.city}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="area">
                <span class="store_info_text">{{form.area}}</span>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="Address info : " prop="address">
            {{form.productAddress}}
          </el-form-item>
          <el-form-item label="Shipment Warehouse  : ">
            <el-tag type="primary" class="store_setting_tag" v-for="item in form.shipmentWarehouses"
                    :key="item.facilityId" :value="item.facilityName">{{item.facilityName}}
            </el-tag>
          </el-form-item>
          <el-form-item label="Store Logo  : " style="overflow: hidden;">
              <div class="store_setting_logo" v-if="mainImageUrl">
                <div>main logo</div>
                <img v-if="mainImageUrl" :src="mainImageUrl" class="avatar" @error="setErrorImg('mainImageUrl')">
              </div>
              <div class="store_setting_logo" v-if="minorImageUrl">
                <div>minor logo</div>
                <img v-if="minorImageUrl" :src="minorImageUrl" class="avatar" @error="setErrorImg('minorImageUrl')">
              </div>
          </el-form-item>
        </el-form>
        <div class="store_info_btns">
          <el-button @click="dataCloseVisible = false" type="primary">Close</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import storeSettingApi from '~api/setting/storeSettingApi'
import storeSettingDialog from '~setting-common/dialog/storeSettingDialog.vue'
import shipmentWarehouseSettingDialog from '~setting-common/dialog/shipmentWarehouseSettingDialog.vue'
export default {
    props: ['dataVisible', 'dataStoreId'],
    data () {
        return {
            dataCloseVisible: true,
            loading: false,
            form: {
                storeName: '',
                warehouse: '',
                company: '',
                group: '',
                saleChannels: [],
                isPrint: 'Yes',
                tinNo: '',
                telephone: '',
                province: '',
                city: '',
                area: '',
                productAddress: '',
                shipmentWarehouses: [],
                mainLogo: null,
                secondaryLogo: null,
                isAvailable: 'Y'
            },
            mainImageUrl: '',
            minorImageUrl: ''

        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataStoreId', '')
            }
        }
    },
    created () {
        var _self = this
        _self.loading = true
        storeSettingApi.queryStoreInfoByID({
            storeID: _self.dataStoreId
        }).then(d => {
            _self.loading = false
            if (d.success) {
                _self.setParmarsData(d.data)
            } else {
                _self.$showErrorMessage(d.message)
            }
        }).catch(function (e) {
            _self.loading = false
            _self.$showErrorMessage(e.message)
        })
    },
    methods: {
        setErrorImg (img) {
            this[img] = ''
        },
        setParmarsData (data) {
            this.form.storeName = data.storeName
            this.form.warehouse = data.warehouseName
            this.form.company = data.company
	        this.form.currency = data.currency
            this.form.saleChannels = data.saleChannelList
            this.form.group = data.groupName
            this.form.tinNo = data.tinNo
            this.form.telephone = data.telephone
            this.form.isPrint = data.isPrint == 'Y' ? 'Yes' : 'No'
            this.form.province = data.provinceName
            this.form.city = data.cityName
            this.form.area = data.areaName
            this.form.productAddress = data.productAddress
            this.form.isAvailable = data.isAvailable
            data.isPrint == 'Y' ? this.form.isPrint = 'Yes' : 'No'
            this.form.shipmentWarehouses = data.shipmentWarehouseList
            this.mainImageUrl = '/api/store/v1/updateStoreMsg/loadLogo?' + new Date().getTime() + '&type=1&productStoreId=' + this.dataStoreId
            this.minorImageUrl = '/api/store/v1/updateStoreMsg/loadLogo?' + new Date().getTime() + '&type=2&productStoreId=' + this.dataStoreId
        }

    }
}
</script>
<style>
  .storeInfoDialog {
    width: 700px;
    padding-right: 20px;
  }
</style>
<style scoped>
  .demo-ruleForm{
    margin-bottom:10px;
  }
  .avatar {
    width:80px;
    height:80px;
    display: block;
    margin:0 auto;
  }
  .store_setting_logo {
    float:left;
    width:100px;
    margin-right:50px;
    text-align: center;
  }

  .store_setting_img {
    width: 80px;
    height: 80px;
  }

  .store_setting_item {
    margin-bottom: 18px;
    height: 30px;
  }

  .store_setting_tag {
    margin-right: 5px;
  }

  .store_info_btns {
    text-align: center;
  }

  .store_setting_sales{
    margin-right:10px;

  }


</style>
