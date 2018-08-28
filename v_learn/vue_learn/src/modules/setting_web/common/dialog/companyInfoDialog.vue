<template>
  <div>
      <el-dialog title="Company setting info" custom-class="companyInfoDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
          <div>
              <el-form :model="form" ref="form" label-width="200px" class="demo-ruleForm" v-loading="loading" element-loading-text="Loading...">
                  <el-form-item label="Company : " class="company_setting_item">{{form.companyName}}</el-form-item>
                  <el-form-item label="Country : " class="company_setting_item">{{form.country | getCountryName }}</el-form-item>
                  <el-form-item label="" class="company_setting_item">
                      <el-switch disabled v-model="form.isOpen"  active-value="Y" :width="80" active-text="open" inactive-text="close" inactive-value="N"></el-switch>
                  </el-form-item>
                  <el-form-item label="Company Telphone : " class="company_setting_item">{{form.telphone}}</el-form-item>
                  <el-form-item label="Company Address : " class="company_setting_item">{{form.address}}</el-form-item>
                  <el-form-item label="Tax : " class="company_setting_item">{{form.tax}}</el-form-item>
                  <el-form-item label="Bank Name : " class="company_setting_item">{{form.bankName}}</el-form-item>
                  <el-form-item label="Bank No. : " class="company_setting_item">{{form.bankNo}}</el-form-item>
              </el-form>
              <div class="company_info_btns">
                  <el-button @click="dataCloseVisible = false">Close</el-button>
              </div>
          </div>
      </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import companySettingApi from '~api/setting/companySettingApi'
export default {
    props: ['dataVisible', 'dataCompanyId'],
    data () {
        return {
            dataCloseVisible: true,
            loading: false,
            form: {
                companyName: '',
                country: '',
                telphone: '',
                address: '',
                tax: '',
                bankName: '',
                bankNo: '',
                isOpen: ''
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    created () {
        this.loading = true
        companySettingApi.findCompanyByGinvenId({
            id: this.dataCompanyId
        }).then(d => {
            this.loading = false
            if (d.success) {
                this.setParmarsData(d.data)
            } else {
                this.$showErrorMessage(d.message)
            }
        }).catch(function (e) {
            this.loading = false
            this.$showErrorMessage(e)
        })
    },
    methods: {
        setParmarsData (data) {
            this.form.companyName = data.companyName
            this.form.country = data.country
            this.form.telphone = data.telephoneNumber
            this.form.address = data.address
            this.form.tax = data.tax
            this.form.bankName = data.bankName
            this.form.bankNo = data.bankNumber
            this.form.isOpen = data.enAble == 1 ? 'Y' : 'N'
        }
    },
    filters: {
        getCountryName (value) {
            return value ? value == 'ET' ? 'Ethiopia' : (value == 'GH' ? 'Ghana' : 'Uganda') : ''
        }
    }
}
</script>
<style>
  .companyInfoDialog {
      width: 600px;
      padding-right: 20px;
  }
</style>
<style scoped>
  .demo-ruleForm{
      margin-bottom:10px;
  }
  .store_setting_item {
      margin-bottom: 18px;
      height: 30px;
  }
  .company_info_btns {
      text-align: center;
  }
</style>
