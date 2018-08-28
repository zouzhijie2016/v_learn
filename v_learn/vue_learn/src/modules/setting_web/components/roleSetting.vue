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
                <el-input size="small" v-model.trim="search.roleName" style="width:200px;"
                          placeholder="Input Role Name"></el-input>
              </el-col>
              <el-col :span="2" :offset="2" class="col_box col_box_btn">
                <el-button class="button" size="small" :loading="loading" type="primary" @click="getRoleSetting"
                           icon="el-icon-search">Search
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list_box" v-loading="loading" element-loading-text="Loading...">
            <el-row class="list_box_new">
              <el-col v-security='{permission:"roleSettingNew"}' :span="2" :offset="22">
                <el-button type="primary" icon="el-icon-plus" @click="newOrEditRoleSetting('','create')">New</el-button>
              </el-col>
            </el-row>
            <el-table :data="roleList" border style="width: 100%;" class="list_table">
              <el-table-column type="index" label="No." align="center"></el-table-column>
              <el-table-column prop="roleName" label="Role Name" class-name="tab_break"
                               align="center"></el-table-column>
              <el-table-column label="Last Update Time" class-name="tab_break">
                <template slot-scope="props">
                  {{props.row.updatedTime | setTime}}
                </template>
              </el-table-column>
              <el-table-column prop="updatedUser" label="Last Update Operator" class-name="tab_break" align="center">
                <template slot-scope="props">
                  {{props.row.updatedUser}}
                </template>
              </el-table-column>
              <el-table-column label="Operation" align="center">
                <template slot-scope="props">
                  <a href="javascript:void(0)" class="store_setting_operate" @click="showRoleSettingInfo(props.row.id)">View</a>
                  <a href="javascript:void(0)" class="store_setting_operate"
                      v-security='{permission:"roleSettingEdit"}'
                     @click="newOrEditRoleSetting(props.row.id,'edit')">Edit</a>
                  <a href="javascript:void(0)" class="store_setting_operate"
                      v-security='{permission:"roleSettingCopy"}'
                     @click="newOrEditRoleSetting(props.row.id,'copy')">Copy</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="page_box" v-if="roleList && roleList.length">
              <el-pagination
                layout="prev, pager, next, jumper"
                :total="rolePageInfo.total"
                :page-size="rolePageInfo.pageSize"
                :current-page.sync="rolePageInfo.pageNum"
                @current-change="getRoleSettingPage">
              </el-pagination>
            </div>
          </div>

        </div>
      </el-col>

    </el-row>
    <role-setting-dialog v-if="roleSettingDialogVisible" :dataVisible.sync="roleSettingDialogVisible"
                         :dataType.sync="type" :dataRoleId.sync="roleId"
                         v-on:refreshRole="getRoleSetting"></role-setting-dialog>
    <role-info-dialog v-if="roleInfoDialogVisible" :dataVisible.sync="roleInfoDialogVisible"
                      :dataRoleId.sync="roleId"></role-info-dialog>

  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import roleSettingApi from '~api/setting/roleSettingApi'
import roleSettingDialog from '~setting-common/dialog/roleSettingDialog.vue'
import roleInfoDialog from '~setting-common/dialog/roleInfoDialog.vue'
import {mapState} from 'vuex'
export default {
    data () {
        return {
            currentRouteUrl: '',
            loading: false,
            roleId: '',
            type: '',
            openOptions: [{id: 'Y', value: 'enable'}, {id: 'N', value: 'disable'}],
            search: {roleName: '', isAvailable: ''},
            roleList: [],
            rolePageInfo: {
                pageNum: 1,
                total: 2,
                pageSize: 10
            },
            roleSettingDialogVisible: false,
            roleInfoDialogVisible: false
        }
    },
    mounted () {
        this.currentRouteUrl = 'roleSetting'
        this.getRoleSetting()
    },
    filters: {
        setTime: function (value) {
            return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
        }
    },
    computed: {
        ...mapState([
            'zoneOffset', 'timeNow'
        ])
    },
    components: {
        settingMenu,
        roleSettingDialog,
        roleInfoDialog
    },
    methods: {
        getRoleSetting () {
            this.rolePageInfo.pageNum = 1
            this.queryRoleSetting()
        },
        getRoleSettingPage () {
            this.queryRoleSetting(true)
        },
        queryRoleSetting (isOnlyList = false) {
            this.loading = true
            this.$getCommonPageListApi(roleSettingApi.queryRoleList, {
                roleName: this.search.roleName,
                isAvailable: this.search.isAvailable,
                pageNum: this.rolePageInfo.pageNum,
                isOnlyList: isOnlyList
            }, d => {
                if (d.data && d.data.list) {
                    this.roleList = d.data.list
                } else {
                    this.roleList = []
                }
            }).then((results) => {
                this.loading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.rolePageInfo.total = results[1].data.total
                        this.rolePageInfo.pageSize = results[1].data.pageSize
                        this.rolePageInfo.pageNum = results[1].data.pageNum
                    } else {
                        this.rolePageInfo.total = this.rolePageInfo.pageSize * (this.rolePageInfo.pageNum + 1)
                    }
                }
            })
        },
        newOrEditRoleSetting (roleId, type) {
            if (roleId) {
                this.roleId = roleId
            }
            this.type = type
            this.roleSettingDialogVisible = true
        },
        showRoleSettingInfo (roleId) {
            if (roleId) {
                this.roleId = roleId
            }
            this.roleInfoDialogVisible = true
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
  .center_main {
    margin-left: 20px;
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

  .store_setting_operate {
    margin-right: 10px;
  }

  .list_box {
    background-color: #fff;
    padding: 10px 24px 24px;
    border: 1px solid #dbdbdb;
  }

  .list_box_new {
    margin-bottom: 10px;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }

  .list_table {
    font-size: 12px;
  }
</style>
