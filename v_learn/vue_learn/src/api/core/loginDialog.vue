<template>
  <div id="loginDialog" style="z-index: 999999;position: relative;">
      <el-dialog ref="dialog" :visible.sync="dataVisible" :show-close="false" custom-class="editDialog" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeDialog">
          <el-form :inline="true" :model="dialogForm" onsubmit="return false" style="font-size: 12px;">
              <el-row>
                  <el-form-item label="Tips: " label-width="100px">
                      <label>{{ dialogForm.message }}</label>
                  </el-form-item>
              </el-row>
              <el-row>
                  <el-form-item label="User ID: " label-width="100px">
                      <label v-if="dialogForm.userName">{{ dialogForm.userName }}</label>
                      <el-input v-else size="small" auto-complete="off" type="text" v-model="dialogForm.userName" style="width: 240px;" ></el-input>
                  </el-form-item>
              </el-row>
              <el-row>
                  <el-form-item label="Password: " label-width="100px">
                      <el-input size="small" type="password" auto-complete="off" v-model="dialogForm.userPassword" style="width: 240px;"></el-input>
                  </el-form-item>
              </el-row>
              <el-row>
                  <el-form-item style="width: 100%;">
                      <el-button style="width: 240px;margin-left: 100px;" type="primary" :loading="searchLoading"  @click="onSubmit">submit</el-button>
                  </el-form-item>
              </el-row>
          </el-form>
      </el-dialog>
  </div>
</template>
<script>
import Util from '~api/index'
export default {
    data () {
        return {
            dataVisible: true,
            searchLoading: false,
            dialogForm: {
                userName: '',
                userPassword: '',
                message: ''
            }
        }
    },
    created () {
    },
    methods: {
        closeDialog () {
            document.body.querySelector('#loginDialog').remove()
            this.$refs.dialog.close()
        },
        onSubmit () {
            this.searchLoading = true
            Util.post('/commondefine/control/login', this.dialogForm).then(d => {
                this.searchLoading = false
                if (d.responseMessage == 'success') {
                    this.closeDialog()
                } else {
                    this.$showErrorMessage(d.errorMessage)
                }
            }).catch(err => {
                this.searchLoading = false
                this.$showErrorMessage(err)
            })
        }
    }
}
</script>
<style>
  .editDialog {
    width: 510px !important;
  }
</style>
