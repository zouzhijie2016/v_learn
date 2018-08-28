<template>
  <div>
    <el-dialog title="Mark as Shipped" custom-class="shippedDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="mark_shipped">
        <p>You will mark the following package as Shipped:</p>
        <div class="mark_shipped_shipment">
          <span class="shipped_shipemnt_lists" v-for="(item,index) in shippmentIds">Shipment#<a href="javascript:void(0)">{{ item }}</a><span
            v-show="index < shippmentIds.length">,</span></span>
        </div>
      </div>
      <div class="mark_form">
        <div class="mark_form_text">
          <span>Please fill in the information of the driver:</span>
          <span class="mark_form_required">(contents mark with a '*' are required)</span>
        </div>
        <el-form :inline="true" :model="form" class="dialog_form" :rules="rules" ref="form" label-width="150px">
          <el-form-item label="Driver Name" prop="driverName">
            <!--<el-input v-model="form.driverName" placeholder="driver name"></el-input>-->
            <el-autocomplete style="width:250px"
                             placeholder="driver name"
                             :trigger-on-focus="suggestion.triggerOnFocus"
                             v-model.trim="form.driverName"
                             :fetch-suggestions="markSuggestionDebounce"
                             @select="selectSuggession">
                <template slot-scope="scope">
                    <div v-for="item in scope" :valueKey="item" class="suggestionList">{{item.driverName}}</div>
                </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="Tel" prop="driverTelephone">
            <el-input type="number" v-model.trim="form.driverTelephone" placeholder="driver contact" style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="License Plate No." prop="licenseNo">
            <el-input v-model.trim="form.licenseNo" placeholder="license plate no." style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="Note" prop="note">
            <el-input type="textarea" :rows="5" v-model.trim="form.note" placeholder="note" style="width:250px"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="mark_btn">
        <el-button type="primary" :loading="loading" @click="submitDriverDatas('form')">Confirm</el-button>
        <el-button @click="resetDriverDatas('form')">Cancel</el-button>
      </div>

    </el-dialog>
    <mark-shipped-success-dialog v-if="markSuccessDialogVisible" :dataSuccessVisible.sync="markSuccessDialogVisible"
                                 :shippmentIDs.sync="shippmentIDs" :ids.sync="ids" v-on:closeDialogAndRefresh="resetDriverDatas"></mark-shipped-success-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import Utils from '~utils/index'
import markShippedSuccessDialog from '~warehouse-common/dialog/markShippedSuccessDialog.vue'
import MarkSuggest from './markShippedSeggest.vue'
import shippingApi from '~api/warehouse/shippingApi'
Vue.component('MarkSuggest', MarkSuggest)
export default {
    props: ['dataVisible', 'shippmentIds', 'ids', 'refreshItems'],
    data () {
        return {
            dataCloseVisible: true,
            markSuccessDialogVisible: false,
            loading: false,
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            shippmentIDs: [],
            form: {driverName: '', driverTelephone: '', licenseNo: '', note: ''},
            rules: {
                driverName: [{required: true, message: 'Please enter driver name', trigger: 'blur'}],
                driverTelephone: [{required: true, message: 'Please enter tel', trigger: 'blur'}],
                licenseNo: [{required: true, message: 'Please enter license Plate No.', trigger: 'blur'}, {max: 15, message: 'license Plate No. no more than 15 bits'}],
                note: [{min: 0, max: 100, message: 'Cannot be greater than 100 characters', trigger: 'blur'}]
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            this.$emit('update:shippments', [])
        }
    },
    components: {
        markShippedSuccessDialog
    },
    created () {
        this.markSuggestionDebounce = Utils.debounce(this.querySuggestion, 500)
    },
    methods: {
        selectSuggession (item) {
            this.form.driverName = item.driverName
            this.form.driverTelephone = item.driverTelephone
            this.form.licenseNo = item.licenseNo
        },
        querySuggestion (queryString, cb) {
            if (!queryString) {
                cb([])
                return false
            }
            shippingApi.getDriver({
                driverName: queryString.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data) {
                        cb(d.data)
                    } else {
                        cb([])
                    }
                } else {
                    this.$message({
                        type: 'info',
                        message: 'Successfully operated',
                        showClose: true
                    })
                    cb([])
                }
            }).catch(e => {
                this.$showErrorMessage(e.message)
            })
        },
        submitDriverDatas (formName) {
            var _self = this
            _self.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                _self.loading = true
                _self.shippmentIDs = _self.ids
                shippingApi.markAsShipped({
                    driverName: _self.form.driverName,
                    ids: _self.shippmentIDs.join(','),
                    licenseNo: _self.form.licenseNo,
                    telephone: _self.form.driverTelephone,
                    note: _self.form.note
                }).then(d => {
                    _self.loading = false
                    if (d.success) {
                        _self.$showSuccessMessage(d.message)
                        _self.markSuccessDialogVisible = true
                        // _self.$emit('update:dataVisible', false);
                    } else {
                        _self.$showErrorMessage(d.message)
                    }
                }).catch(e => {
                    _self.loading = false
                    _self.$showErrorMessage(e.message)
                })
            })
        },
        resetDriverDatas (formName) {
            if (formName) {
                this.$refs[formName].resetFields()
            }
            this.$emit('update:dataVisible', false)
            this.$emit('refreshItems')
        }
    }
}
</script>
<style>
  .shippedDialog {
    width: 550px;
  }

  .el-form-item {
    margin-bottom: 15px;
  }
</style>
<style scoped>
  .mark_shipped {
    text-align: center;
  }

  .mark_form {
    margin-bottom: 10px;
  }

  .mark_form_text {
    text-align: center;
  }

  .shipped_shipemnt_lists {
    display: block;
  }

  .mark_form_text {
    margin-bottom: 10px;
  }

  .mark_form_required {
    display: block;
    font-size: 12px;
    color: red;
  }

  .mark_btn {
    text-align: center;
  }
  .suggestionList{
      text-overflow: ellipsis;
      overflow: hidden;
      width:100%;
  }

</style>
