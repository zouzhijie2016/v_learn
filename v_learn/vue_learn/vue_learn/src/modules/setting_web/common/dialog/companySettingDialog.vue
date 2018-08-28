<template>
  <div>
      <el-dialog :title="title" custom-class="companySettingDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
              <el-form :model="form" :rules="rules" ref="form" label-width="160px" class="demo-ruleForm" v-loading="loading" element-loading-text="Loading...">
                  <el-form-item label="Company Name" prop="company" class="company_setting_item">
                      <el-input v-model="form.company" placeholder="Input company name"></el-input>
                  </el-form-item>
                  <el-form-item label="Country" prop="country" class="company_setting_item">
                      <el-select style="width: 100%" v-model="form.country" clearable placeholder="Select country">
                          <el-option v-for="item in countryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="" class="company_setting_item">
                      <el-switch v-model="form.isAvailable"  active-value="Y" :width="80" active-text="open" inactive-text="close" inactive-value="N"></el-switch>
                  </el-form-item>
                  <el-form-item label="Company Telphone" prop="telephone" class="company_setting_item">
                      <el-input v-model="form.telephone" placeholder="Input company telephone"></el-input>
                  </el-form-item>
                  <el-form-item label="Company address" prop="address" class="company_setting_item">
                      <el-input v-model="form.address" placeholder="Input company address"></el-input>
                  </el-form-item>
                  <el-form-item label="TAX" prop="tax" class="company_setting_item">
                      <el-input v-model="form.tax" placeholder="Input tax"></el-input>
                  </el-form-item>
                  <el-form-item label="Bank Name" prop="bankName" class="company_setting_item">
                      <el-select style="width: 100%" v-model="form.bankName" placeholder="Select bank name">
                          <el-option v-for="item in bankNameOptions" :key="item.bankNameId" :label="item.bankNameName" :value="item.bankNameId"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="Bank No." prop="bankNo" class="company_setting_item">
                      <el-input v-model="form.bankNo" placeholder="Input bank no."></el-input>
                  </el-form-item>
                  <el-form-item class="company_setting_operate" style="text-align: center;">
                      <el-button type="primary" @click="saveCompanySetting('form')" :loading="saveLoading" class="operate_button">Save</el-button>
                      <el-button  @click="cancelCompanySetting('form')" class="operate_button">Cancel</el-button>
                  </el-form-item>
              </el-form>
          </div>
      </el-dialog>
      <el-dialog title="message" :visible.sync="cancelDialogVisible" custom-class="tipDialog" center>
          <span>Information has been modify,</span>
          <span>are you sure to discard these changes?</span>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmCancel('form')">discard</el-button>
              <el-button @click="cancel">No</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import companySettingApi from '~api/setting/companySettingApi'

export default {
    props: ['dataVisible', 'dataCompanyId', 'refreshCompany', 'dataType'],
    data () {
        var checkCompanyName = (rule, value, callback) => {
            if (this.form.company === '') {
                callback(new Error('Please fill in company name.'))
            } else {
                companySettingApi.checkCompanyName({
                    companyName: value,
                    operator: this.dataType,
                    id: this.dataCompanyId
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
        var checkTelephone = (rule, value, callback) => {
            let reg = new RegExp('^[0-9]+$')
            if (value == '') {
                callback(); return
            }
            if (!reg.test(value)) {
                callback(new Error('Telephone can only be numbers'))
                return
            } else if (value.length > 20) {
                callback(new Error('Length of telephone cannot exceed 20.'))
                return
            } else {
                callback(); return
            }
        }
        var checkTax = (rule, value, callback) => {
            let reg = new RegExp('^[0-9a-zA-Z]+$')
            if (value == '') {
                callback(); return
            }
            if (!reg.test(value)) {
                callback(new Error('Tax format error'))
                return
            } else if (value.length > 20) {
                callback(new Error('Length of tax cannot exceed 20.'))
                return
            } else {
                callback(); return
            }
        }
        var checkBankNo = (rule, value, callback) => {
            let reg = new RegExp('^[0-9]+$')
            if (value == '') {
                callback(); return
            }
            if (!reg.test(value)) {
                callback(new Error('Bank no can only be numbers'))
                return
            } else if (value.length > 30) {
                callback(new Error('Length of tax cannot exceed 30.'))
                return
            } else {
                callback(); return
            }
        }
        return {
            title: 'company setting',
            dataCloseVisible: true,
            cancelDialogVisible: false,
            loading: false,
            saveLoading: false,
            countryOptions: [{
                id: 'ET',
                name: 'Ethiopia'
            }, {
                id: 'GH',
                name: 'Ghana'
            }, {
                id: 'UGA',
                name: 'Uganda'
            }],
            bankNameOptions: [],
            form: {
                company: '',
                country: '',
                telephone: '',
                address: '',
                tax: '',
                bankName: '',
                bankNo: '',
                isAvailable: 'Y'
            },
            fieldDatas: {},
            isModifyCompany: true,
            rules: {
                country: [
                    { required: true, message: 'Please select country!', trigger: 'change' }],
                company: [
                    { required: true, message: 'Please select company!', trigger: 'blur' },
                    { validator: checkCompanyName, trigger: 'blur,change' }],
                telephone: [
                    { validator: checkTelephone, trigger: 'blur' }],
                tax: [
                    { validator: checkTax, trigger: 'blur' }],
                bankNo: [
                    { validator: checkBankNo, trigger: 'blur' }]
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    mounted () {
        if (this.dataCompanyId) {
            this.loading = true
            this.getInitCompanyInfo()
        }
        this.initTitle()
    },
    methods: {
        getInitCompanyInfo () {
            let t = this
            companySettingApi.findCompanyByGinvenId({
                id: this.dataCompanyId
            }).then(d => {
                t.loading = false
                if (d.success) {
                    t.setParmarsData(d.data)
                } else {
                    t.$showErrorMessage(d.message)
                }
            }).catch(function (e) {
                t.loading = false
                t.$showErrorMessage(e)
            })
        },
        initTitle () {
            var _self = this
            switch (_self.dataType) {
                case 'edit':
                    _self.title = 'Edit ' + _self.title
                    break
                default:
                    _self.title = 'New ' + _self.title
                    break
            }
        },
        saveCompanySetting (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveLoading = true
                    if (!this.dataCompanyId) {
                        let params = Object.assign({}, this.getParamsData(), {
                            operator: this.dataType
                        })
                        companySettingApi.createCompany(params).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Save company setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshCompany')
                            } else {
                                this.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            this.saveLoading = false
                            this.$showErrorMessage(e)
                        })
                    } else {
                        let params = Object.assign({}, this.getParamsData(), {
                            operator: this.dataType,
                            id: this.dataCompanyId
                        })
                        companySettingApi.updateCompany(params).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Update company setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshCompany')
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
        getParamsData () {
            return {
                companyName: this.form.company,
                country: this.form.country,
                telephoneNumber: this.form.telephone,
                address: this.form.address,
                tax: this.form.tax,
                bankName: this.form.bankName,
                bankNumber: this.form.bankNo,
                enAble: this.form.isAvailable == 'Y' ? 1 : 0
            }
        },
        setParmarsData (data) {
            this.form.company = data.companyName ? data.companyName : ''
            this.form.country = data.country ? data.country : ''
            this.form.telephone = data.telephoneNumber ? data.telephoneNumber : ''
            this.form.address = data.address ? data.address : ''
            this.form.tax = data.tax ? data.tax : ''
            this.form.bankName = ''
            this.form.bankNo = data.bankNumber ? data.bankNumber : ''
            this.form.isAvailable = data.enAble ? (data.enAble == 1 ? 'Y' : 'N') : ''
            this.fieldDatas = Object.assign({}, this.form)
        },
        cancelCompanySetting () {
            var t = this;
            for (let name in t.form) {
                if (t.fieldDatas[name] != t.form[name]) {
                    t.isModifyCompany = false
                    break
                }
            }
            if (!this.isModifyCompany) {
                this.cancelDialogVisible = true
            }else{
                this.$emit('update:dataVisible', false)
            }
        },
        confirmCancel (formName) {
            this.$refs[formName].resetFields()
            this.$emit('update:dataVisible', false)
        },
        cancel () {
            this.cancelDialogVisible = false
        }
    }
}
</script>
<style>
  .companySettingDialog{
      width:650px;
      padding-right:20px;
  }
  .tipDialog{
      width: 440px;
  }
  .el-form-item__error{
      padding-top:0px;
  }
</style>
<style scoped>
  .company_setting_item{
      margin-bottom:18px;
      height: 30px;
  }
  .company_setting_operate .operate_button{
      margin-right:50px;
  }

</style>
