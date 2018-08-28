<template>
  <div>
    <el-dialog :title="title" custom-class="storeSettingDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
            <el-form :model="form" :rules="rules" ref="form" label-width="160px" class="demo-ruleForm" v-loading="loading"
                     element-loading-text="Loading...">
              <el-form-item label="Company" prop="company" class="store_setting_item">
                  <el-row>
                      <el-col :span="8">
                          <el-select v-model="form.company" placeholder="Select" @change="selectCompany">
                              <el-option v-for="item in companyOptions" :key="item.companyId" :label="item.companyValue"
                                         :value="item.companyId"></el-option>
                          </el-select>
                      </el-col>
                      <el-col :span="8" :offset="2">
                          <!--<el-switch v-model="form.isAvailable"  active-value="Y" :width="80" active-text="open" inactive-text="close" inactive-value="N"></el-switch>-->
                      </el-col>
                  </el-row>
              </el-form-item>
              <el-form-item label="Currency" prop="currency" class="store_setting_item">
                    <el-select v-model="form.currency" placeholder="currency" >
                        <el-option value="UGX" label="UGX"></el-option>
                        <el-option value="RWF" label="RWF"></el-option>
                        <el-option value="ETB" label="ETB"></el-option>
                        <el-option value="GHS" label="GHS"></el-option>
                    </el-select>
                </el-form-item>
              <el-form-item label="Store name" prop="storeName" class="store_setting_item">
                <el-input v-model="form.storeName" placeholder="Input store name"></el-input>
              </el-form-item>
              <el-form-item label="Warehouse" prop="warehouseId" class="store_setting_item">
                <el-select v-model="form.warehouseId" @change="changeWarehouse" placeholder="Select">
                  <el-option v-for="item in warehouseOptions" :key="item.facilityId" :label="item.facilityName"
                             :value="item.facilityId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Group" prop="groupId" class="store_setting_item">
                <el-select v-model="form.groupId" placeholder="Select">
                  <el-option v-for="item in groupOptions" :key="item.storeGroupID" :label="item.storeGroupName"
                             :value="item.storeGroupID"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Sales Channel" prop="saleChannels" class="store_setting_item">
                <el-checkbox-group v-model="form.saleChannels">
                  <el-checkbox v-for="sale in saleChannelsListOptions" :label="sale.storeGroupID" :key="sale.storeGroupID">{{sale.storeGroupName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="Print invoice" prop="isPrint" class="store_setting_item">
                <el-radio-group v-model="form.isPrint">
                  <el-radio label="Yes"></el-radio>
                  <el-radio label="No"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Tin No." prop="tinNo" class="store_setting_item">
                <el-input v-model="form.tinNo" placeholder="Input store Tin No."></el-input>
              </el-form-item>
              <el-form-item label="Tel" prop="telephone" class="store_setting_item">
                <el-input v-model="form.telephone" placeholder="Input store Tel number"></el-input>
              </el-form-item>
              <el-form-item label="Address" class="store_setting_item">
                 <el-row>
                      <el-col :span="7">
                          <el-form-item prop="province">
                              <el-select v-model="form.provinceId" placeholder="Province" @change="selectCityInfo">
                                  <el-option v-for="item in provinceOptions" :key="item.provinceId" :label="item.provinceName"
                                             :value="item.provinceId"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" :offset="1">
                          <el-form-item prop="cityId">
                              <el-select v-model="form.cityId" placeholder="City" @change="selectAreaInfo">
                                  <el-option v-for="item in selectCityInfoOptions" :key="item.cityId" :label="item.cityName"
                                             :value="item.cityId"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="7" :offset="1">
                          <el-form-item prop="areaId">
                              <el-select v-model="form.areaId" placeholder="Area">
                                  <el-option v-for="item in selectAreaInfoOptions" :key="item.areaId" :label="item.areaName"
                                             :value="item.areaId"></el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                  </el-row>

              </el-form-item>
              <el-form-item label="" prop="productAddress">
                <el-input v-model="form.productAddress" placeholder="Detail address"></el-input>
              </el-form-item>
              <el-form-item label="Shipment Warehouse">
                <el-button @click="settingShipmentWarehouse">Add</el-button>
                <div class="setting_add_div"><el-tag type="primary" class="store_setting_tag" v-for="item in form.shipmentWarehouses" :key="item.facilityId"  :value="item.facilityName">{{item.facilityName}}</el-tag></div>
              </el-form-item>
              <el-form-item label="Store Logo" style="overflow: hidden;">
                  <div class="store_setting_logo">
                    <div>main logo</div>
                    <div class="store_setting_uploadAdd" @click="selectImage('main')">
                      <img v-if="mainImageUrl" :src="mainImageUrl" @error="setErrorImg('mainLogo','mainImageUrl')" class="mainImg avatar" ref="mainImg">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <input type="file" ref="mainFile" @change="previewFile($event,'main')" v-show="storeFile"/>
                    </div>
                    <div v-if="!mainImageUrl">
                      <el-button @click="selectImage('main')">Select image</el-button>
                    </div>
                    <div v-if="mainImageUrl">
                      <el-button @click="selectImage('main')">Change</el-button><el-button @click="removeImage('main')">Remove</el-button>
                    </div>
                  </div>
                  <div class="store_setting_logo">
                    <div>minor logo</div>
                    <div class="store_setting_uploadAdd" @click="selectImage('minor')">
                      <img v-if="minorImageUrl" :src="minorImageUrl" @error="setErrorImg('secondaryLogo','minorImageUrl')" class="minorImg avatar" ref="minorImg">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <input type="file" ref="minorFile" @change="previewFile($event,'minor')" v-show="storeFile"/>
                    </div>
                    <div v-if="!minorImageUrl">
                      <el-button @click="selectImage('minor')">Select image</el-button>
                    </div>
                    <div v-if="minorImageUrl">
                      <el-button @click="selectImage('minor')">Change</el-button><el-button @click="removeImage('minor')">Remove</el-button>
                    </div>
                  </div>

              </el-form-item>
            </el-form>
            <div class="store_setting_operate">
              <el-button type="primary" @click="saveStoreSetting('form')"  :disabled="storeId!='' && !isUpdateData" :loading="saveLoading" class="operate_button">Save</el-button>
              <el-button  @click="cancelStoreSetting('form')" class="operate_button">Cancel</el-button>
            </div>
          </div>
    </el-dialog>
    <shipment-warehouse-setting-dialog v-if="shipmentWarehouseSettingDialogVisible" :dataWarehouseVisible.sync="shipmentWarehouseSettingDialogVisible" :hasShipmentWarehouse.sync="form.shipmentWarehouses" :storeName.sync="form.storeName" :storeId.sync="storeId"></shipment-warehouse-setting-dialog>
    <el-dialog
      title="message"
      :visible.sync="cancelDialogVisible"
      width="30%"
      center>
      <span>Information has been modify,</span>
      <span>are you sure to discard these changes?</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmCancel('form')">discard</el-button><el-button @click="cancel">No</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import _ from 'lodash'
import storeSettingApi from '~api/setting/storeSettingApi'
import shipmentWarehouseSettingDialog from '~setting-common/dialog/shipmentWarehouseSettingDialog.vue'
export default {
    props: ['dataVisible', 'dataStoreId', 'refreshStore', 'dataType'],
    data () {
        let operateType = this.dataStoreId ? 'edit' : 'create'
        var checkStoreName = (rule, value, callback) => {
            if (!this.isModifyStore && this.dataType != 'create') { callback(); return }
            if (this.form.company === '') {
                callback(new Error('Please select company.'))
            } else {
                storeSettingApi.isExist({
                    company: this.form.company,
                    storeName: value,
                    operateType: operateType,
                    id: this.isExitId
                }).then(d => {
                    if (d.success) {
                        callback()
                    } else {
                        callback(new Error(d.message))
                    }
                }).catch(e => {
                    this.$showErrorMessage(e)
                })
            }
        }
        var checkTel = (rule, value, callback) => {
            if (!this.isModifyStore && this.dataType != 'create') {
                callback(); return
            }
            if (!value) {
                callback(); return
            }
            let reg = new RegExp('^([0-9])+$')
            if (!reg.test(value)) {
                callback(new Error('Tel can only be numbers.'))
                return
            }
            if (value.length > 20) {
                callback(new Error('Length of Tel cannot exceed 20.'))
                return
            }
            callback()
        }
        var checkStoreNameAndTel = (rule, value, callback) => {
            if (value != '' && this.isValidateCompany) {
                if (this.form.storeName != '') {
                    this.$refs.form.validateField('storeName')
                }
            }
            callback()
        }
        return {
            title: 'store setting',
            dataCloseVisible: true,
            cancelDialogVisible: false,
            shipmentWarehouseSettingDialogVisible: false,
            loading: false,
            saveLoading: false,
            storeId: '',
            isExitId: '',
            imageUrl: '',
            minorIsUpload: false,
            mainIsUpload: false,
            storeFile: false,
            mainImageUrl: '',
            minorImageUrl: '',
            companyOptions: [{companyId: 'company', companyValue: 'company'}],
            warehouseOptions: [],
            groupOptions: [],
            provinceOptions: [],
            selectCityInfoOptions: [],
            selectAreaInfoOptions: [],
            saleChannelsListOptions: [],
            form: {
                storeName: '',
	            currency: 'UGX',
                warehouseId: '',
                company: '',
                groupId: '',
                isPrint: 'Yes',
                telephone: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                productAddress: '',
                shipmentWarehouses: [],
                saleChannels: [],
                tinNo: '',
                mainLogo: null,
                secondaryLogo: null,
                isAvailable: 'Y'
            },
            fieldDatas: {},
            rules: {
                storeName: [
                    { required: true, message: 'Please select store name!', trigger: 'blur' }, { validator: checkStoreName, trigger: 'blur' }],
                warehouseId: [
                    { required: true, message: 'Please select warehouse!', trigger: 'change' }],
                company: [
                    { required: true, message: 'Please select company!', trigger: 'change' }, { validator: checkStoreNameAndTel, trigger: 'blur,change' }],
                groupId: [
                    { required: true, message: 'Please select group!', trigger: 'change' }],
                saleChannels: [
                    { type: 'array', required: true, message: 'Please select sales channel!', trigger: 'change' }],
                telephone: [
                    { validator: checkTel, trigger: 'blur' }]
            },
            isValidateCompany: true,
            isUpdateData: false,
            isRemoveMainImg: false,
            isRemoveSecondImg: false
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataStoreId', '')
            }
        },
        'form': {
            handler: function (curVal) {
                var _self = this
                for (let name in this.form) {
                    if (_self.fieldDatas[name] != curVal[name]) {
                        _self.isUpdateData = true
                        break
                    }
                }
            },
            deep: true
        },
        'form.mainLogo': function () {
            this.isUpdateData = true
        },
        'form.secondaryLogo': function () {
            this.isUpdateData = true
        }
    },
    components: {
        shipmentWarehouseSettingDialog
    },
    mounted () {
        this.storeId = this.dataStoreId
        this.initTitle()
        this.getInitStoreInfo()
    },
    methods: {
        initTitle () {
            var _self = this
            switch (_self.dataType) {
                case 'edit':
                    _self.title = 'Edit ' + _self.title
                    break
                case 'copy':
                    _self.title = 'Copy ' + _self.title
                    break
                default:
                    _self.title = 'New ' + _self.title
                    break
            }
        },
        getInitStoreInfo () {
            var _self = this
            if (_self.storeId) {
                _self.loading = true
            }
            var getAllFacilityPromise = new Promise(function (resolve) {
                _self.getAllFacility(function (data) {
                    resolve(data)
                })
            })
            var getAddressGroupPromise = new Promise(function (resolve) {
                _self.getAddressGroup(function (data) {
                    resolve(data)
                })
            })
            var getSalesChannelPromise = new Promise(function (resolve) {
                _self.getSalesChannel(function (data) {
                    resolve(data)
                })
            })
            Promise.all([getAllFacilityPromise, getAddressGroupPromise, getSalesChannelPromise]).then(function (arr) {
                if (_self.storeId) {
                    _self.getStoreInfoByID({storeId: _self.storeId})
                }
            }, function () {
                _self.loading = false
            })
        },
        getAllFacility (cb) {
            storeSettingApi.getAllFacility().then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.warehouseOptions = d.data
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        getSalesChannel (cb) {
            storeSettingApi.getAllSalesChannel().then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.saleChannelsListOptions.splice(0)
                    this.saleChannelsListOptions = this.saleChannelsListOptions.concat(d.data)
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        getAddressGroup (cb) {
            storeSettingApi.queryAddressInfo().then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    this.provinceOptions.splice(0)
                    this.provinceOptions = this.provinceOptions.concat(d.data)
                }
            }).catch(e => {
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        selectCityInfo () {
            let province = this.form.provinceId
            let lists = this.provinceOptions.filter(function (item) {
                return item.provinceId === province
            })
            this.selectCityInfoOptions = lists[0].cityList
        },
        selectAreaInfo () {
            let city = this.form.cityId
            let lists = this.selectCityInfoOptions.filter(function (item) {
                return item.cityId === city
            })
            this.selectAreaInfoOptions = lists[0].areaList
        },
        selectCompany () {
            storeSettingApi.queryStoreGroup({
                company: this.form.company
            }).then(d => {
                if (d.success) {
                    this.groupOptions = d.data
                }
            })
        },
        getStoreInfoByID () {
            var _self = this
            storeSettingApi.queryStoreInfoByID({
                storeID: _self.storeId
            }).then(d => {
                _self.loading = false
                if (d.success && d.data) {
                    this.setParmarsData(d.data);
                    this.selectCompany();
                } else {
                    _self.$showErrorMessage(d.message)
                }
                _self.$nextTick(() => {
                    _self.isModifyStore = true
                })
            }).catch(function (e) {
                _self.loading = false
                _self.$showErrorMessage(e.message)
            })
        },
        setParmarsData (data) {
            var _self = this
            _self.form.company = data.company ? data.company : ''
            _self.form.groupId = data.groupId ? data.groupId : ''
	        _self.form.currency = data.currency;
            _self.isExitId = data.id
            _self.form.shipmentWarehouses = data.shipmentWarehouseList ? data.shipmentWarehouseList : []
            data.saleChannelList && data.saleChannelList.forEach(function (item) {
                _self.form.saleChannels.push(item.storeGroupID)
            })
            _self.form.isAvailable = data.isAvailable ? data.isAvailable : 'Y';
            _self.mainImageUrl = '/api/store/v1/updateStoreMsg/loadLogo?' + new Date().getTime() + '&type=1&productStoreId=' + _self.storeId
            _self.minorImageUrl = '/api/store/v1/updateStoreMsg/loadLogo?' + new Date().getTime() + '&type=2&productStoreId=' + _self.storeId
            if (_self.dataType == 'copy') {
                _self.form.isPrint = 'Yes'
            } else {
                _self.form.storeName = data.storeName
                _self.form.tinNo = data.tinNo
                _self.form.warehouseId = data.warehouseId
                _self.form.telephone = data.telephone ? data.telephone : ''
                _self.form.provinceId = data.provinceId ? data.provinceId : ''
                _self.form.cityId = data.cityId ? data.cityId : ''
                _self.form.areaId = data.areaId ? data.areaId : ''
                _self.form.productAddress = data.productAddress ? data.productAddress : ''
                _self.form.isPrint = data.isPrint == 'Y' ? 'Yes' : 'No'
                _self.fieldDatas = Object.assign({}, _self.form)
            }
        },
        changeWarehouse (val) {
            if (val) {
                let index = _.findIndex(this.form.shipmentWarehouses, function (item) {
                    return item.facilityId == val
                })
                if (index > -1) {
                    this.form.shipmentWarehouses.splice(index, 1)
                }
            }
        },
        setErrorImg (type, img) {
            this.form[type] = null
            this[img] = ''
        },
        selectImage (type) {
            if (type == 'minor') {
                this.$refs.minorFile.click()
            }
            if (type == 'main') {
                this.$refs.mainFile.click()
            }
        },
        previewFile (e, type) {
            let file = e.target.files[0]
            let arrowSize = 500
            let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png']
            if (supportedTypes.indexOf(file.type) < 0) {
                this.$showErrorMessage('Store logo uploads support PNG, JPEG, GIF images!')
                return
            }
            var size = Math.floor(file.size / 1024)
            if (size > arrowSize) {
                this.$message.error('Upload store logo can not exceed 500k!')
                return
            }
            if (type == 'minor') {
                this.minorImageUrl = window.URL.createObjectURL(file)
                this.form.secondaryLogo = file
            }
            if (type == 'main') {
                this.mainImageUrl = window.URL.createObjectURL(file)
                this.form.mainLogo = file
            }
        },
        removeImage (type) {
            if (type == 'minor') {
                this.minorImageUrl = ''
                this.form.secondaryLogo = null
                this.isRemoveSecondImg = true
            }
            if (type == 'main') {
                this.mainImageUrl = ''
                this.form.mainLogo = null
                this.isRemoveMainImg = true
            }
            this.isUpdateData = true
        },
        saveStoreSetting (formName) {
            this.isValidateCompany = false
            if (this.storeId && !this.isUpdateData) {
                this.saveLoading = false
                this.$message('No changes have been made.')
                return false
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveLoading = true
                    let formatDatas = this.formatDatas()
                    if ((!this.storeId && this.dataType != 'edit') || (this.dataType == 'copy')) {
                        storeSettingApi.createStore(formatDatas).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Save store setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshStore')
                            } else {
                                this.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            this.saveLoading = false
                            this.$showErrorMessage(e)
                        })
                    } else {
                        storeSettingApi.updateStore(formatDatas).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Update store setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshStore')
                            } else {
                                this.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            this.saveLoading = false
                            this.$showErrorMessage(e)
                        })
                    }
                }
            })
        },
        formatDatas () {
            var formData = new FormData()
            formData.append('isAvailable', this.form.isAvailable)
            formData.append('storeName', this.form.storeName)
	        formData.append('currency', this.form.currency)
            formData.append('warehouseId', this.form.warehouseId)
            formData.append('company', this.form.company)
            formData.append('groupId', this.form.groupId)
            formData.append('saleChannels', this.form.saleChannels && this.form.saleChannels.length > 0 ? JSON.stringify(this.form.saleChannels) : '')
            formData.append('isPrint', this.form.isPrint == 'Yes' ? 'Y' : 'N')
            formData.append('tinNo', this.form.tinNo)
            formData.append('telephone', this.form.telephone)
            formData.append('provinceId', this.form.provinceId)
            formData.append('cityId', this.form.cityId)
            formData.append('areaId', this.form.areaId)
            formData.append('productAddress', this.form.productAddress)
            formData.append('shipmentWarehouses', this.form.shipmentWarehouses && this.form.shipmentWarehouses.length > 0 ? JSON.stringify(this.form.shipmentWarehouses) : null)
            if (this.storeId && (this.dataType == 'edit' || this.dataType == 'copy')) {
                formData.append('productStoreId', this.storeId)
            }
            if (this.form.mainLogo) {
                formData.append('mainLogo', this.form.mainLogo)
            }
            if (this.isRemoveMainImg) {
                formData.append('mainLogos', null)
            }
            if (this.form.secondaryLogo) {
                formData.append('secondaryLogo', this.form.secondaryLogo)
            }
            if (this.isRemoveSecondImg) {
                formData.append('secondaryLogos', null)
            }
            return formData
        },
        cancelStoreSetting () {
            if (!this.isUpdateData) {
                this.$emit('update:dataStoreId', '')
                this.$emit('update:dataVisible', false)
                return
            }
            this.cancelDialogVisible = true
        },
        confirmCancel (formName) {
            this.$refs[formName].resetFields()
            this.$emit('update:dataStoreId', '')
            this.$emit('update:dataVisible', false)
        },
        cancel () {
            this.$emit('update:dataStoreId', '')
            this.cancelDialogVisible = false
        },
        settingShipmentWarehouse () {
            this.shipmentWarehouseSettingDialogVisible = true
        }
    }
}
</script>
<style>
  .storeSettingDialog{
    width:700px;
    padding-right:20px;
  }
  .el-form-item__error{
    padding-top:0px;
  }
</style>
<style scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width:80px;
    height:80px;
    display: block;
    margin:0 auto;
  }
  .store_setting_logo{
    float:left;
    width:150px;
    margin-right:50px;
    text-align: center;
  }
  .store_setting_img{
    width:80px;
    height:80px;
  }
  .store-logo_add{
    display:inline-block;
    width:80px;
    height:80px;
    line-height: 80px;
    border:1px solid #dbdbdb;
    text-align: center;
  }
  .store_setting_item{
    margin-bottom:18px;
    height: 30px;
  }
  .store_setting_tag{
    margin-right:5px;
  }
  .store_setting_uploadAdd{
    width:93px;
    height:85px;
    border:1px solid #dbdbdb;
    border-radius:6px;
    margin: 0 auto 10px;
    cursor:pointer;
  }
  .store_setting_operate{
    width:400px;
    text-align: center;
    margin:0 auto;
  }
  .operate_button{
    margin:30px 30px 0px;
  }
  .setting_add_div{
    height:auto;
    display: inline-block;
  }

</style>
