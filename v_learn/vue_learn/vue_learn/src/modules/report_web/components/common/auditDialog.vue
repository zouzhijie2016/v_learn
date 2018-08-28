<template>
  <div>
      <el-dialog :title="title" custom-class="auditDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
              <el-form :model="form" label-position="left" ref="form" label-width="165px" v-loading="loading" element-loading-text="Loading...">
                  <div class="confirmTips">Are you sure to audit this following income process?</div>
                  <el-form-item label="Store : " class="submit_dialog_item">
                      {{ form.store }}
                  </el-form-item>
                  <el-form-item label="Date of Sales : " class="submit_dialog_item">
                      {{ form.salesDate }}
                  </el-form-item>
                  <el-form-item label="Date of Deposit : " class="submit_dialog_item">
                      {{ form.depositDate }}
                  </el-form-item>
                  <el-form-item label="Deposit Amount : " class="submit_dialog_item">
                      {{ form.depositAmount }} {{ systemSettingsUomid }}
                  </el-form-item>
                  <el-form-item label="To Bank Name : " class="submit_dialog_item">
                      {{ form.bankName }}
                  </el-form-item>
                  <el-form-item label="To Bank Account : " class="submit_dialog_item">
                      {{ form.bankAccount }}
                  </el-form-item>
                  <el-form-item label="Bill No. : " class="submit_dialog_item">
                      {{ form.billNo }}
                  </el-form-item>
                  <el-form-item label="Upload Voucher (.jpg/.png/.doc/.xls are accepted)  : " class="submit_dialog_item">
                    <div style="width: 100%;height: 25px" v-for="item in form.fileList" :key="item.fileName">
                        <a :href="item.path" :download="item.fileName" style="cursor: pointer;display: block;word-break: break-all;line-height: 20px;">{{ item.fileName }}</a>
                    </div>
                  </el-form-item>
                  <el-form-item label="Note : " class="submit_dialog_item">
                      <div style="word-break: break-all;width: 100%;line-height: 20px">{{ form.note }}</div>
                  </el-form-item>
                  <el-form-item label="Audit Advance">
                      <el-radio-group v-model="form.auditAdvance">
                          <el-radio label="Affirm"></el-radio>
                          <el-radio label="Contradict"></el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item v-if="form.auditAdvance == 'Contradict'" label="Audit Note : " class="submit_dialog_item">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="maxSize" v-model="form.auditNote"></el-input>
                  </el-form-item>
              </el-form>
              <div class="audit_dialog_btns" v-if="extendOptions.dataType == 'Audit'">
                  <el-button type="primary" @click="auditDialogEvt" :loading="submitLoading">Confirm</el-button>
                  <el-button type="default" @click="closeDialogEvt">Cancel</el-button>
              </div>
              <div class="submit_dialog_btns" v-if="extendOptions.dataType == 'View'">
                  <el-button type="default" @click="closeDialogEvt">Close</el-button>
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
        return {
            title: 'Process',
            dataCloseVisible: true,
            submitLoading: false,
            loading: false,
            maxSize: 100,
            form: {
                store: '',
                salesDate: '',
                depositDate: '',
                depositAmount: '',
                bankName: '',
                bankAccount: '',
                billNo: '',
                note: '',
                auditNote: '',
                fileList: [],
                auditAdvance: 'Affirm'
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    created () {
        var t = this
        this.title = this.extendOptions.dataType + ' ' + this.title

        this.loading = true
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
    methods: {
        auditDialogEvt () {
            var t = this

            t.submitLoading = true
            ReportApi.auditSheet({
                auditNote: this.form.auditNote,
                id: this.extendOptions.id,
                status: this.form.auditAdvance == 'Affirm' ? 1 : -1
            }).then(d => {
                t.submitLoading = false
                if (d.success) {
                    this.getRedPointerList()

                    t.$showSuccessMessage('Operator success!')
                    t.$emit('update:dataVisible', false)
                    t.$emit('refreshProcess')
                } else {
                    t.$showErrorMessage(d.message)
                }
            }).catch(e => {
                t.submitLoading = false
                t.$showErrorMessage(e)
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
        closeDialogEvt () {
            this.dataCloseVisible = false
        },
        setParmarsData (data) {
            this.form.billNo = data.billNo
            this.form.depositAmount = data.depositAmount + ''
            this.form.depositDate = this.getCompareDate(data.depositDate)
            this.form.depositDateData = data.depositDate
            this.form.note = data.note
            this.form.auditNote = data.auditNote
            this.form.salesDate = this.getCompareDate(data.salesDate)
            this.form.salesDateData = data.salesDate
            this.form.store = data.storeName
            this.form.storeId = data.storeId
            this.form.bankAccount = data.toBankAccount
            this.form.bankName = data.toBankName
            this.form.fileList = data.voucher || []
        },
        getCompareDate (date) {
            if (!date) return
            var d = new Date(date)
            var day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate()
            var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
            var year = d.getFullYear()
            return day + '/' + month + '/' + year
        }
    },
    computed: {
        ...mapState([
            'systemSettingsUomid'
        ])
    }
}
</script>
<style>
    .auditDialog {
        width: 530px;
    }
    .auditDialog .el-dialog__body{
        padding: 15px 20px 15px 35px;
    }
    .auditDialog .el-form-item{
        margin-bottom: 0;
    }
</style>
<style scoped>
    .confirmTips{
        display: block;
        text-align: left;
        font-size: 16px;
        width: 100%;
    }
    .store_setting_item {
        word-wrap:break-word;
    }
    .audit_dialog_btns {
        margin-top: 15px;
        text-align: center;
    }
</style>
