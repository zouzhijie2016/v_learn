
<template>
  <div>
    <el-row>
      <el-col :span="4">
        <setting-menu :urlPermiss="currentRouteUrl"></setting-menu>
      </el-col>
      <el-col :span="20">
        <div class="center_main">

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>App Config

              </span>



            </div>
<el-col>
    <!-- <el-form ref="permissionTreeNodeClickForm" :model="appConfigData" label-width="100px">
        <el-form-item label="systemSettingsNewReceived">
           <el-input v-model="appConfigData.systemSettingsNewReceived" ></el-input>
        </el-form-item>
        <el-form-item label="piwikHost">
           <el-input v-model="appConfigData.piwikHost" ></el-input>
        </el-form-item>
        <el-form-item label="piwikPort">
           <el-input v-model="appConfigData.piwikPort" ></el-input>
        </el-form-item>
        <el-form-item label="piwikSiteId">
           <el-input v-model="appConfigData.piwikSiteId"></el-input>
        </el-form-item>
      </el-form> -->



      <el-table
         :data="appConfigData"
         style="width: 100%"
         max-height="250">
         <el-table-column
           fixed
           prop="id"
           label="id"
           width="150">
         </el-table-column>
         <el-table-column
           prop="appKey"
           label="appKey"
           width="120">
         </el-table-column>
         <el-table-column
           prop="appVal"
           label="appVal"
           width="120">
         </el-table-column>
         <el-table-column
           prop="description"
           label="description"
           width="120">
         </el-table-column>
         <el-table-column
           fixed="right"
           label="操作"
           width="120">
           <template slot-scope="scope">
             <el-button
               @click.native.prevent="editRow(scope.row)"
               type="text"
               size="small">
               编辑
             </el-button>
           </template>
         </el-table-column>
       </el-table>




</el-col>


          </el-card>
        </div>
      </el-col>
    </el-row>




<el-dialog title="Edit App Config" :visible.sync="editAppConfigDialog">
      <el-form :model="editAppConfigData" label-width="100px">
        <el-form-item label="id">
           <el-input v-model="editAppConfigData.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="appKey">
           <el-input v-model="editAppConfigData.appKey" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="appVal">
           <el-input v-model="editAppConfigData.appVal" ></el-input>
        </el-form-item>
        <el-form-item label="description">
           <el-input v-model="editAppConfigData.description" ></el-input>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="handlerUpdate">Update</el-button>
         </el-form-item>
      </el-form>
      </el-dialog>
  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import _devApi from '~api/setting/_dev'
import _ from 'lodash'
export default {
    data () {
        return {
            currentRouteUrl: '',
            editAppConfigDialog: false,
            editAppConfigData: {},
            appConfigData: []
        }
    },
    mounted () {
        this.currentRouteUrl = '_devAppConfig'
        this.loading()
    },
    filters: {
    },
    components: {
        settingMenu
    },
    methods: {
        async loading () {
            let _self = this

            _self.editAppConfigData = {}
            _self.editAppConfigDialog = false
            let promiseArr = []

            const obj = {}
            const {data} = await _devApi.getDBAppConfigList(obj)

            if (data) {
                _self.appConfigData = data
            }
        },
        editRow (row) {
            this.editAppConfigData = row
            this.editAppConfigDialog = true
        },
        async handlerUpdate () {
            let _self = this
            const { data } = await _devApi.updateAppConfiguration(this.editAppConfigData)
            if (data) {
                _self.$showSuccessMessage('Save App config success!')
                _self.loading()
            } else {
                _self.$showErrorMessage('Save App config error!')
            }
        }
    }
}
</script>
<style scoped>
  .center_main{
    margin-left:20px;
  }
  .devSelectedDialog{
    display: inline-block;
    width: 100%;
  }

</style>
