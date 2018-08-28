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
              <span>Cloud Detil</span>
            </div>



            <div style="margin-top: 20px">
                需要添加的 列表
                <el-button @click="_handlerNeedAdd">获取需要添加的sql</el-button>
              </div>

            <el-table
              ref="multipleTable1"
              :data="needAddAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedaddSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="checkType"
                label="checkType"
                >
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="className"
                label="className"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="description"
                label="description"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="httpMethod"
                label="httpMethod"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="method"
                label="method"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="url"
                label="url"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>



            <div style="margin-top: 20px">
                需要修改的 列表
                <el-button @click="_handlerNeedUpdate">获取需要 修改 的sql</el-button>
              </div>

            <el-table
              ref="multipleTable22"
              :data="needUpdateAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedUpdateSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="checkType"
                label="checkType"
                >
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="className"
                label="className"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="description"
                label="description"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="httpMethod"
                label="httpMethod"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="method"
                label="method"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="url"
                label="url"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>

            <div style="margin-top: 20px">
                需要 删除 的 列表
                <el-button @click="_handlerNeedDel">获取需要 删除 的sql</el-button>
            </div>


            <el-table
              ref="multipleTable3"
              :data="needDelAccessCheck"
              style="width: 100%"
              max-height="250"
              @selection-change="_handlerNeedDelSelectionChange"
              >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="checkType"
                label="checkType"
                >
              </el-table-column>
              <el-table-column
                prop="applicationName"
                label="applicationName"
                >
              </el-table-column>
              <el-table-column
                prop="className"
                label="className"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="description"
                label="description"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="httpMethod"
                label="httpMethod"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="method"
                label="method"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="url"
                label="url"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>



          </el-card>


        </div>
      </el-col>

    </el-row>

    <el-dialog
      title="请复制下面的sql 交由开发执行"
      :visible.sync="needAddSelectedDialog"
      >
        <span class="devSelectedDialog" v-for="needAddSelected of needAddSelectedArr">
          INSERT INTO `YW_ACCESS_CHECK`
          (
          `APPLICATION_NAME`,
          `CHECK_TYPE`,
          `CLASS_NAME`,
          `METHOD`,
          `HTTP_METHOD`,
          `DESCRIPTION`,
          `URL`,
          `ENABLE`,
          `CREATED_TIME`,
          `CREATED_USER`
          )VALUES(
          '{{needAddSelected.applicationName}}',
          '{{needAddSelected.checkType}}',
          '{{needAddSelected.className}}',
          '{{needAddSelected.method}}',
          '{{needAddSelected.httpMethod}}',
          '{{needAddSelected.description}}',
          '{{needAddSelected.url}}',
          1,
          '{{new Date().getTime()}}',
          'admin'
          );
        </span>
    </el-dialog>

    <el-dialog
      title="请复制下面的sql 交由开发执行"
      :visible.sync="needDelSelectedDialog"
      >
        <span class="devSelectedDialog" v-for="needDelSelected of needDelSelectedArr">
          DELETE FROM `YW_ACCESS_CHECK`
          WHERE `ID` ='{{needDelSelected.id}}';
        </span>
    </el-dialog>

    <el-dialog
      title="请复制下面的sql 交由开发执行"
      :visible.sync="needUpdateSelectedDialog"
      >
        <span class="devSelectedDialog" v-for="needUpdateSelected of needUpdateSelectedArr">
          UPDATE `YW_ACCESS_CHECK`
          SET
          `ID` = '{{needUpdateSelected.id}}',
          `APPLICATION_NAME` = '{{needUpdateSelected.applicationName}}',
          `CHECK_TYPE` = '{{needUpdateSelected.checkType}}',
          `CLASS_NAME` = '{{needUpdateSelected.className}}',
          `METHOD` ='{{needUpdateSelected.method}}',
          `HTTP_METHOD` = '{{needUpdateSelected.httpMethod}}',
          `DESCRIPTION` = '{{needUpdateSelected.description}}',
          `URL` = '{{needUpdateSelected.url}}',
          `ENABLE` =1,
          `UPDATED_TIME` = '{{new Date().getTime()}}',
          `UPDATED_USER` = 'admin'
          WHERE `ID` ='{{needUpdateSelected.id}}';

        </span>
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
            proxyHost: '',
            proxyPort: '',
            currentRouteUrl: '',
            needAddAccessCheck: [],
            needAddSelectedArr: [],
            needAddSelectedDialog: false,

            needDelAccessCheck: [],
            needDelSelectedArr: [],
            needDelSelectedDialog: false,

            needUpdateAccessCheck: [],
            needUpdateSelectedArr: [],
            needUpdateSelectedDialog: false,

            multipleSelection: []
        }
    },
    mounted () {
        this.proxyHost = this.$route.params.host
        this.proxyPort = this.$route.params.port

        this.currentRouteUrl = '_dev'
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

            // let promiseArr = [];
            // let urlMappings = this.reFlushUrlMappings();
            // let accessCheckList = this.getDBaccessCheckList();
            // promiseArr.push(urlMappings);
            // promiseArr.push(accessCheckList);

            let mappingObj = {}
            mappingObj.host = this.proxyHost
            mappingObj.port = this.proxyPort
            let urlMappingsRes = await _devApi.reFlushUrlMappings(mappingObj)
            let applicationName = urlMappingsRes.data.applicationName

            let urlMappings = urlMappingsRes.data.accessReportList
            _.forEach(urlMappings, (y) => {
                y.applicationName = applicationName
            })

            let obj = {}
            obj.applicationName = urlMappingsRes.data.applicationName
            let accessCheckRes = await _devApi.getDBaccessCheckList(obj)

            let _urlMappings = urlMappings
            let _accessCheckList = accessCheckRes.data

            let needAddAccessCheckArr = []
            _.forEach(_urlMappings, (x) => {
                let needAdd = _.find(_accessCheckList, (y) => {
                    return x.className == y.className && x.method == y.method
                })
                if (_.isEmpty(needAdd)) {
                    needAddAccessCheckArr.push(x)
                }
            })
            _self.needAddAccessCheck = needAddAccessCheckArr

            let needUpdateAccessCheckArr = []
            _.forEach(_accessCheckList, (x) => {
                let needAdd = _.find(_urlMappings, (y) => {
                    return x.className == y.className && x.method == y.method
                })
                needAdd = needAdd || {}
                if (!_.isEmpty(needAdd) && (x.checkType != needAdd.checkType || x.description != needAdd.description || x.httpMethod != needAdd.httpMethod || x.url != needAdd.url)) {
                    needAdd.id = x.id
                    needUpdateAccessCheckArr.push(needAdd)
                }
            })
            _self.needUpdateAccessCheck = needUpdateAccessCheckArr

            let needDelAccessCheckArr = []
            _.forEach(_accessCheckList, (x) => {
                let needAdd = _.find(_urlMappings, (y) => {
                    return x.className == y.className && x.method == y.method
                })
                if (_.isEmpty(needAdd)) {
                    needDelAccessCheckArr.push(x)
                }
            })
            _self.needDelAccessCheck = needDelAccessCheckArr

        },
        async reFlushUrlMappings () {
            let obj = {}
            obj.host = this.proxyHost
            obj.port = this.proxyPort
            const {data} = await _devApi.reFlushUrlMappings(obj)
            return data
        },
        async getDBaccessCheckList () {
            let obj = {}
            const {data} = await _devApi.getDBaccessCheckList(obj)
            return data
        },
        _handlerNeedaddSelectionChange (obj) {
            this.needAddSelectedArr = obj
        },
        _handlerNeedUpdateSelectionChange (obj) {
            this.needUpdateSelectedArr = obj
        },
        _handlerNeedDelSelectionChange (obj) {
            this.needDelSelectedArr = obj
        },
        _handlerNeedAdd () {
            this.needAddSelectedArr = this.needAddSelectedArr || []
            if (this.needAddSelectedArr.length == 0) {
                return
            }
            this.needAddSelectedDialog = true
        },
        _handlerNeedDel () {
            this.needDelSelectedArr = this.needDelSelectedArr || []
            if (this.needDelSelectedArr.length == 0) {
                return
            }
            this.needDelSelectedDialog = true
        },
        _handlerNeedUpdate () {
            this.needUpdateSelectedArr = this.needUpdateSelectedArr || []
            if (this.needUpdateSelectedArr.length == 0) {
                return
            }
            this.needUpdateSelectedDialog = true
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
