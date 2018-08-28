<template>
  <div>
      <el-dialog :title="title" custom-class="operatorDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
              <el-form :model="form" :rules="rules" ref="form" label-width="160px" class="demo-ruleForm" v-loading="loading"
                       element-loading-text="Loading...">
                  <el-form-item v-if="extendOptions.dataType == 'Edit'" label="Status" class="store_setting_item">
                      {{ extendOptions.dataStatus }}
                  </el-form-item>
                  <el-form-item label="Store" prop="store" class="store_setting_item">
                      <el-select v-model="form.store" style="width: 200px" v-if="extendOptions.dataType == 'Create'">
                          <el-option v-for="item in storeData" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
                      </el-select>
                      <div v-else-if="extendOptions.dataType == 'Edit'">{{ form.store }}</div>
                  </el-form-item>
                  <el-form-item label="Date of Sales" prop="salesDate" class="store_setting_item">
                      <el-date-picker type="date"
                                      style="width: 200px"
                                      :editable="false"
                                      :clearable="true"
                                      v-model.trim="form.salesDate"
                                      :picker-options="form.salesDateOptions"
                                      format="dd/MM/yyyy"
                                      size="small"
                                      placeholder="DD/MM/YYYY">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="Date of Deposit" prop="depositDate" class="store_setting_item">
                      <el-date-picker type="date"
                                      style="width: 200px"
                                      :editable="false"
                                      :clearable="true"
                                      v-model.trim="form.depositDate"
                                      :picker-options="form.depositDateOptions"
                                      format="dd/MM/yyyy"
                                      size="small"
                                      placeholder="DD/MM/YYYY">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="Deposit Amount" prop="depositAmount" class="store_setting_item">
                      <el-input v-model="form.depositAmount" style="width: 200px">
                          <template slot="append">{{ systemSettingsUomid }}</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="To Bank Name" prop="bankName" class="store_setting_item">
                      <el-input v-model="form.bankName" style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="To Bank Account" prop="bankAmount">
                      <el-input v-model="form.bankAmount" style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="Upload Voucher (.ipg/.png/.doc/.xls are accepted)">
                      <el-upload
                          class="upload-demo"
                          ref="upload"
                          action="/api/workflow/v1/file/upload"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :on-change="handleChange"
                          :before-upload="beforeUploadEvt"
                          :auto-upload="true"
                          :on-success="handleSuccess"
                          :file-list="form.fileList">
                          <el-button size="small" type="primary">Click to upload file</el-button>
                      </el-upload>
                      <label style="display: none"><a :href="fileUrl" ref="fileUrl">download</a></label>
                  </el-form-item>
                  <el-form-item label="Bill No." prop="billNo">
                      <el-input v-model="form.billNo" style="width: 200px"></el-input>
                  </el-form-item>
                  <el-form-item label="Note" prop="note">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="maxSize" v-model="form.note"></el-input>
                  </el-form-item>
                  <el-form-item label="Audit Note" prop="auditNote">
                      <div style="word-break: break-all;width: 100%;line-height: 20px">{{ form.auditNote }}</div>
                  </el-form-item>
              </el-form>
              <div class="operationBtns">
                  <el-button type="primary" @click="submitOperationDialog('form')" :loading="submitLoading">Submit</el-button>
                  <el-button type="primary" @click="saveOperationDialog('form')" :loading="saveLoading">Save</el-button>
                  <el-button type="default" @click="cancelOperationDialog">Cancel</el-button>
              </div>
          </div>
      </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import ReportApi from '~api/reportapi'
import {mapState} from 'vuex'
import * as types from '~store/mutation-types'

export default {
    props: ['extendOptions', 'refreshProcess'],
    data () {
        var checkBillNo = (rule, value, callback) => {
            let reg = new RegExp('^([0-9])+$')
            if (!reg.test(value)) {
                callback(new Error('Bill no can only be numbers'))
                return
            } else {
                callback(); return
            }
        }
        var checkDepositAmount = (rule, value, callback) => {
            let reg = new RegExp('^([0-9])+$')
            if (!reg.test(value)) {
                callback(new Error('Deposit amount can only be numbers'))
                return
            } else {
                callback(); return
            }
        }
        var _this = this
        return {
            title: 'Process',
            dataCloseVisible: true,
            cancelDialogVisible: false,
            loading: false,
            saveLoading: false,
            submitLoading: false,
            storeData: [],
            maxSize: 100,
            fileUrl: '',
            form: {
                store: '',
                storeId: '',
                salesDate: '',
                depositDate: '',
                depositAmount: '',
                bankName: '',
                bankAmount: '',
                billNo: '',
                note: '',
                auditNote: '',
                fileList: [],
                salesDateOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date())
                    }
                },
                depositDateOptions: {
                    disabledDate (date) {
                        return date > _this.getCompareDate(new Date())
                    }
                }
            },
            rules: {
                store: [
                    { required: true, message: 'Please select store name!', trigger: 'blur,change' }],
                salesDate: [
                    { type: 'date', required: true, message: 'Please select date of sales!', trigger: 'blur,change' }],
                depositDate: [
                    { type: 'date', required: true, message: 'Please select date of deposit!', trigger: 'blur,change' }],
                bankName: [
                    { required: true, message: 'Please fill in bank name!', trigger: 'blur' }],
                billNo: [
                    { required: true, message: 'Please fill in bill no.!', trigger: 'blur' },
                    { validator: checkBillNo, trigger: 'blur' }],
                depositAmount: [
                    { required: true, message: 'Please fill in deposit amount!', trigger: 'blur' },
                    { validator: checkDepositAmount, trigger: 'blur' }]
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    created () {
        let t = this
        ReportApi.queryStoreGroupList({
            type: 'SALE'
        }).then(d => {
            if (d.success == true) {
                if (d.data && d.data.length) {
                    t.storeData.splice(0)
                    d.data.forEach(function (elem) {
                        t.storeData = t.storeData.concat(elem.storeList)
                    })
                } else {
                    t.storeData = []
                }
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(err => {
            this.$showErrorMessage(err)
        })
    },
    mounted () {
        this.initTitle()
        if (this.extendOptions && this.extendOptions.id) {
            this.loading = true
            this.getInitData()
        }
    },
    methods: {
        getCompareDate (d) {
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        getInitData () {
            let t = this
            ReportApi.findAccountCheckingSheet({
                id: this.extendOptions.id
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
            let _self = this
            switch (_self.extendOptions.dataType) {
                case 'Edit':
                    _self.title = 'Edit ' + _self.title
                    break
                default:
                    _self.title = 'Create ' + _self.title
                    break
            }
        },
        submitOperationDialog (formName) {
            var t = this
            var paramsData = null
            var type = 'Submit'
            this.submitLoading = true

            if (this.extendOptions.dataType == 'Edit') {
                paramsData = Object.assign({}, t.getParamsData(), {
                    isDrafted: -1,
                    id: t.extendOptions.id
                })
            } else {
                paramsData = Object.assign({}, t.getParamsData(), {
                    isDrafted: -1
                })
            }
            this.operationDialog(formName, paramsData, type)
        },
        saveOperationDialog (formName) {
            var t = this
            var paramsData = null
            var type = 'Save'
            this.saveLoading = true

            if (this.extendOptions.dataType == 'Edit') {
                paramsData = Object.assign({}, t.getParamsData(), {
                    isDrafted: 1,
                    id: t.extendOptions.id
                })
            } else {
                paramsData = Object.assign({}, t.getParamsData(), {
                    isDrafted: 1
                })
            }
            this.operationDialog(formName, paramsData, type)
        },
        operationDialog (formName, options, flag) {
            let t = this
            t.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!t.extendOptions.id) {
                        ReportApi.createOrEditSheet(options).then(d => {
                            flag == 'Save' ? t.saveLoading = false : t.submitLoading = false
                            if (d.success) {
                                flag == 'Submit' && this.getRedPointerList()
                                t.$showSuccessMessage('Operator success!')
                                t.$emit('update:dataVisible', false)
                                t.$emit('refreshProcess')
                            } else {
                                t.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            flag == 'Save' ? t.saveLoading = false : t.submitLoading = false
                            t.$showErrorMessage(e)
                        })
                    } else {
                        ReportApi.createOrEditSheet(options).then(d => {
                            flag == 'Save' ? t.saveLoading = false : t.submitLoading = false
                            if (d.success) {
                                flag == 'Submit' && this.getRedPointerList()
                                t.$showSuccessMessage('Operator success!')
                                t.$emit('update:dataVisible', false)
                                t.$emit('refreshProcess')
                            } else {
                                t.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            flag == 'Save' ? t.saveLoading = false : t.submitLoading = false
                            t.$showErrorMessage(e)
                        })
                    }
                } else {
                    flag == 'Save' ? t.saveLoading = false : t.submitLoading = false
                }
            })
        },
        getRedPointerList () {
            ReportApi.findNotices().then(d => {
                if (d.success) {
                    if (d.data) {
                        this.$store.commit(types.TOTAL_INCOME_MESSAGE, d.data.StoreManager || 0)
                        this.$store.commit(types.TOTAL_AUDIT_MESSAGE, d.data.Auditor || 0)
                    }
                }
            }).catch(err => {
                this.$showErrorMessage(err.message)
            })
        },
        cancelOperationDialog () {
            this.dataCloseVisible = false
        },
        dateChangeEvt (newVal) {
            return newVal ? Utils.getServerTimestamp(newVal) : ''
        },
        getParamsData () {
            let fileListArr = []
            this.form.fileList.forEach(function (item) {
                fileListArr.push({
                    fileName: item.name,
                    path: item.url
                })
            })

            return {
                'billNo': this.form.billNo,
                'currencySymbol': this.systemSettingsUomid,
                'depositAmount': this.form.depositAmount,
                'depositDate': this.dateChangeEvt(this.form.depositDate),
                'note': this.form.note,
                'salesDate': this.dateChangeEvt(this.form.salesDate),
                'storeId': this.extendOptions.dataType == 'Edit' ? this.form.storeId : this.form.store,
                'toBankAccount': this.form.bankAmount,
                'toBankName': this.form.bankName,
                'voucher': fileListArr
            }
        },
        setParmarsData (data) {
            let fileListArr = []
            if (data.voucher && data.voucher.length > 0) {
                data.voucher.forEach(function (item) {
                    fileListArr.push({
                        name: item.fileName,
                        url: item.path
                    })
                })
            }
            this.form.billNo = data.billNo
            this.form.depositAmount = data.depositAmount + ''
            this.form.depositDate = this.getCompareDate(data.depositDate)
            this.form.note = data.note
            this.form.auditNote = data.auditNote
            this.form.salesDate = this.getCompareDate(data.salesDate)
            this.form.store = data.storeName
            this.form.storeId = data.storeId
            this.form.bankAmount = data.toBankAccount
            this.form.bankName = data.toBankName
            this.form.fileList = fileListArr
        },
        getCompareDate (date) {
            if (!date) return
            let d = new Date(date)
            return new Date(d.getFullYear(), d.getMonth(), d.getDate())
        },
        handlePreview (file) {
            this.fileUrl = file.url
            this.$refs.fileUrl.download = file.name

            this.$nextTick(() => {
                this.$refs.fileUrl.click()
            })
        },
        handleChange (file) {
        },
        handleRemove (file, fileList) {
            for (let j = 0; j < this.form.fileList.length; j++) {
                if (file.name == this.form.fileList[j].name && file.status == this.form.fileList[j].status) {
                    this.form.fileList.splice(j, 1)
                    j = j - 1
                }
            }
        },
        beforeUploadEvt (file) {
            let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/msword']
            let flag = false
            let fileMaxSize = 5 * 1024 * 1024
            if (this.form.fileList.length >= 3) {
                this.$showErrorMessage('Upload file can not more than three!')
                return false
            }
            if (supportedTypes.indexOf(file.type) < 0) {
                this.$showErrorMessage('Support PNG, JPEG, DOC, XLS upload file formats !')
                return false
            }
            if (file.size > fileMaxSize) {
                this.$showErrorMessage('Upload file can not exceed 5M!')
                return false
            }
            for (let j = 0; j < this.form.fileList.length; j++) {
                if (this.form.fileList[j].name.indexOf(file.name) >= 0) {
                    flag = true
                }
            }
            if (flag) {
                this.$showErrorMessage('File already exist!')
                return false
            }

            return true
        },
        handleSuccess (response, file, fileList) {
            if (response.success) {
                this.form.fileList.push({
                    name: response.data.fileName,
                    url: response.data.path
                })
            }
        }
    },
    computed: {
        ...mapState([
            'systemSettingsUomid',
            'totalIncomeMessage',
            'totalAuditMessage'
        ])
    }
}
</script>
<style>
  .operatorDialog{
      width:550px;
  }
  .operatorDialog .el-form-item{
      margin-bottom: 15px;
  }
  .operatorDialog .el-form-item__error{
      padding-top: 0;
  }
  .operatorDialog .el-upload__input{
      display: none !important;
  }
</style>
<style scoped>
  .store_setting_item{
      margin-bottom:18px;
      height: 30px;
      word-wrap:break-word;
  }
  .operationBtns{
      text-align:center;
  }

</style>
