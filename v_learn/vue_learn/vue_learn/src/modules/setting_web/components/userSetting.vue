<template>
  <div>
    <el-row>
      <el-col :span="4">
        <setting-menu :urlPermiss="currentRouteUrl"></setting-menu>
      </el-col>
      <el-col :span="20">
        <div class="center_main">
          <div class="search_box setting_form">
            <el-row class="search_row">
              <el-col :span="6" class="col_box">
                <el-input size="small" v-model.trim="search.userLoginId"  style="width:200px;" placeholder="Input User Name"></el-input>
              </el-col>
              <el-col :span="6" :offset="2" class="col_box">
                <el-select v-model="search.isEnabled" placeholder="Enable or disable">
                  <el-option v-for="item in openOptions" :key="item.id" :value="item.id" :label="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2" :offset="2" class="col_box col_box_btn">
                <el-button class="button" size="small" :loading="loading" type="primary" @click="getUserSetting"
                           icon="el-icon-search">Search
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list_box" v-loading="loading" element-loading-text="Loading...">
            <el-row class="list_box_new">
              <el-col v-security='{permission:"userSettingNew"}' :span="2" :offset="22">
                <el-button type="primary" icon="el-icon-plus" @click="newOrEditUserSetting('','create')">New</el-button>
              </el-col>
            </el-row>
            <el-table :data="userList" border style="width: 100%;" class="list_table">
              <el-table-column type="index" label="No." align="center"></el-table-column>
              <el-table-column prop="userLoginId" label="User Name" class-name="tab_break" align="center"></el-table-column>
              <el-table-column label="Last Update Time" class-name="tab_break">
                <template slot-scope="props">
                  {{props.row.updateTime | setTime}}
                </template>
              </el-table-column>
              <el-table-column label="Last Update Operator" class-name="tab_break" align="center">
                <template slot-scope="props">
                  {{props.row.updateUser}}
                </template>
              </el-table-column>
              <el-table-column prop="isEnabled" label="Enable or Not" class-name="tab_break" align="center"></el-table-column>
              <el-table-column label="Operation" align="center">
                <template slot-scope="props">
                  <a href="javascript:void(0)" class="store_setting_operate" @click="showUserSettingInfo(props.row.userId)">View</a>
                  <a href="javascript:void(0)"  v-security='{permission:"userSettingEdit"}' class="store_setting_operate" @click="newOrEditUserSetting(props.row.userId,'edit')">Edit</a>
                  <a href="javascript:void(0)" v-security='{permission:"userSettingCopy"}' class="store_setting_operate" @click="newOrEditUserSetting(props.row.userId,'copy')">Copy</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="page_box" v-if="userList && userList.length">
              <el-pagination
                layout="prev, pager, next, jumper"
                :total="userPageInfo.total"
                :page-size="userPageInfo.pageSize"
                :current-page.sync="userPageInfo.pageNum"
                @current-change="getUserSettingPage">
              </el-pagination>
            </div>
          </div>

        </div>
      </el-col>

    </el-row>
    <user-setting-dialog v-if="userSettingDialogVisible" :dataVisible.sync="userSettingDialogVisible" :dataType.sync="type" :dataUserId.sync="userId" v-on:refreshUser="getUserSetting"></user-setting-dialog>
    <user-info-dialog v-if="userInfoDialogVisible" :dataVisible.sync="userInfoDialogVisible" :dataUserId.sync="userId"></user-info-dialog>

  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import userSettingApi from '~api/setting/userSettingApi'
import userSettingDialog from '~setting-common/dialog/userSettingDialog.vue'
import userInfoDialog from '~setting-common/dialog/userInfoDialog.vue'
export default {
    data () {
        return {
            currentRouteUrl: '',
            loading: false,
            userId: '',
            type: '',
            openOptions: [{id: 'Y', value: 'enable'}, {id: 'N', value: 'disable'}],
            search: {userLoginId: '', isAvailable: ''},
            userList: [{userID: '111', userName: 'ADMIN'}],
            userPageInfo: {
                pageNum: 1,
                total: 2,
                pageSize: 10 },
            userSettingDialogVisible: false,
            userInfoDialogVisible: false
        }
    },
    mounted () {
        this.currentRouteUrl = 'userSetting'
        this.getUserSetting()
    },
    filters: {
        setTime: function (value) {
            return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
        }
    },
    components: {
        settingMenu,
        userSettingDialog,
        userInfoDialog
    },
    methods: {
        getUserSetting () {
            this.userPageInfo.pageNum = 1
            this.queryUserSetting()
        },
        getUserSettingPage () {
            this.queryUserSetting(true)
        },
        queryUserSetting (isOnlyList = false) {
            this.loading = true
            this.$getCommonPageListApi(userSettingApi.findUserByConditions, {
                userLoginId: this.search.userLoginId,
                isEnabled: this.search.isEnabled,
                pageNum: this.userPageInfo.pageNum,
                isOnlyList: isOnlyList
            }, d => {
                if (d.data && d.data.list) {
                    this.userList = d.data.list
                } else {
                    this.userList = []
                }
            }).then((results) => {
                this.loading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.userPageInfo.total = results[1].data.total
                        this.userPageInfo.pageSize = results[1].data.pageSize
                        this.userPageInfo.pageNum = results[1].data.pageNum
                    } else {
                        this.userPageInfo.total = this.userPageInfo.pageSize * (this.userPageInfo.pageNum + 1)
                    }
                }
            })
        },
        newOrEditUserSetting (userId, type) {
            if (userId) {
                this.userId = userId
            }
            this.type = type
            this.userSettingDialogVisible = true
        },
        showUserSettingInfo (userId) {
            if (userId) {
                this.userId = userId
            }
            this.userInfoDialogVisible = true
        }

    }

}
</script>
<style>
  .list_box .tab_break > div {
    word-break: break-word;
  }
</style>
<style scoped>
  .center_main{
    margin-left:20px;
  }
  .setting_form .setting_form_label {
    font-size: 12px;
  }
  .search_box {
    margin-bottom: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 24px;
    background-color: #fff;
  }
  .store_setting_operate{
    margin-right:10px;
  }
  .list_box {
    background-color: #fff;
    padding: 10px 24px 24px;
    border: 1px solid #dbdbdb;
  }
  .list_box_new{
    margin-bottom:10px;
  }
  .page_box {
    text-align: right;
    margin-top: 10px;
  }
  .list_table {
    font-size: 12px;
  }
</style>
