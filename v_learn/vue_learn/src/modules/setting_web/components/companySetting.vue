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
                              <el-autocomplete
                                 size="small"
                                 :trigger-on-focus="suggestion.triggerOnFocus"
                                 v-model.trim="search.companyName"
                                 :fetch-suggestions="querySuggestionDebounce"
                                 placeholder="Input Company Name"
                                 @select="selectSuggession">
                                  <template slot-scope="scope">
                                      <div v-for="item in scope" :valueKey="item" class="suggestionList">{{item}}</div>
                                  </template>
                              </el-autocomplete>
                          </el-col>
                          <el-col :span="6" :offset="2" class="col_box">
                              <el-select  v-model="search.isAvailable">
                                  <el-option
                                      v-for="item in openOptions"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                                  </el-option>
                              </el-select>
                          </el-col>
                          <el-col :span="2" :offset="2" class="col_box col_box_btn">
                              <el-button class="button" size="small" :loading="loading" type="primary" @click="getCompanySetting" icon="el-icon-search">Search</el-button>
                          </el-col>
                      </el-row>
                  </div>
                  <div class="list_box" v-loading="loading" element-loading-text="Loading...">
                      <el-row class="list_box_new">
                          <el-col v-security='{permission:"companySettingNew"}' :span="2" :offset="22">
                              <el-button type="primary" icon="el-icon-plus" @click="newOrEditCompanySetting('','create')">New</el-button>
                          </el-col>
                      </el-row>
                      <el-table :data="companyList" border style="width: 100%;" class="list_table">
                          <el-table-column type="index" label="No." align="center"></el-table-column>
                          <el-table-column prop="companyName" label="Company Name" class-name="tab_break" align="center"></el-table-column>
                          <el-table-column label="Last Update Time" class-name="tab_break">
                              <template slot-scope="props">
                                  {{ props.row.updateTime | setTime }}
                              </template>
                          </el-table-column>
                          <el-table-column prop="updateUser" label="Last Update Operator" class-name="tab_break" align="center"></el-table-column>
                          <el-table-column prop="isAvailable" label="Enable or Not" class-name="tab_break" align="center">
                              <template slot-scope="props">
                                  {{ props.row.enAble | getOpen }}
                              </template>
                          </el-table-column>
                          <el-table-column label="Operation" align="center">
                              <template slot-scope="props">
                                  <a href="javascript:void(0)" class="company_setting_operate" @click="showCompanySettingInfo(props.row.id)">View</a>
                                  <a href="javascript:void(0)" v-security='{permission:"companySettingEdit"}' class="company_setting_operate" @click="newOrEditCompanySetting(props.row.id,'edit')">Edit</a>
                              </template>
                          </el-table-column>
                      </el-table>
                      <div class="page_box" v-if="companyList && companyList.length">
                          <el-pagination
                              layout="prev, pager, next, jumper"
                              :total="companyPageInfo.total"
                              :page-size="companyPageInfo.pageSize"
                              :current-page.sync="companyPageInfo.pageNum"
                              @current-change="getCompanySettingPage">
                          </el-pagination>
                      </div>
                  </div>
              </div>
          </el-col>
      </el-row>
      <company-setting-dialog v-if="companySettingDialogVisible" :dataVisible.sync="companySettingDialogVisible" :dataType.sync="type" :dataCompanyId.sync="companyId" v-on:refreshCompany="getCompanySetting"></company-setting-dialog>
      <company-info-dialog v-if="companyInfoDialogVisible" :dataVisible.sync="companyInfoDialogVisible" :dataCompanyId.sync="companyId"></company-info-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import companySettingApi from '~api/setting/companySettingApi'
import companySettingDialog from '~setting-common/dialog/companySettingDialog.vue'
import companyInfoDialog from '~setting-common/dialog/companyInfoDialog.vue'
import ProSuggest from '~setting-common/dialog/productseggest.vue'

Vue.component('ProductSuggest', ProSuggest)
export default {
    data () {
        return {
            currentRouteUrl: '',
            loading: false,
            companyId: '',
            type: '',
            openOptions: [{
                id: '', value: 'All status'
            }, {
                id: '1', value: 'Enable'
            }, {
                id: '0', value: 'Disable'
            }],
            search: {
                companyName: '',
                isAvailable: '1'
            },
            companyList: [],
            companyPageInfo: {
                pageNum: 1,
                total: 2,
                pageSize: 10
            },
            suggestion: {
                triggerOnFocus: false,
                sgprops: {
                    value: ''
                }
            },
            companySettingDialogVisible: false,
            companyInfoDialogVisible: false
        }
    },
    created () {
        this.querySuggestionDebounce = Utils.debounce(this.querySuggession, 500)
    },
    mounted () {
        this.currentRouteUrl = 'companySetting'
        this.getCompanySetting()
    },
    filters: {
        setTime: function (value) {
            return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
        },
        getOpen (value) {
            if(value == 0){
                return 'N'
            }else if(value == 1){
                return 'Y'
            }
            return ''
        }
    },
    components: {
        settingMenu,
        companySettingDialog,
        companyInfoDialog
    },
    methods: {
        querySuggession (querystring, cb) {
            if (!querystring) {
                cb([])
                return false
            }

            companySettingApi.findCompanyName({
                companyName: querystring.trim()
            }).then(d => {
                if (d.success == true) {
                    if (d.data && d.data.length) {
                        cb(d.data)
                    } else {
                        cb([])
                    }
                } else {
                    this.$showErrorMessage(d.message)
                    cb([])
                }
            }).catch(err => {
                this.$showErrorMessage(err)
                cb([])
            })
        },
        selectSuggession (item) {
            this.search.companyName = item
        },
        getCompanySetting () {
            this.companyPageInfo.pageNum = 1
            this.queryStoreSetting()
        },
        getCompanySettingPage () {
            this.queryStoreSetting(true)
        },
        queryStoreSetting (isOnlyList = false) {
            this.loading = true
            this.$getCommonPageListApi(companySettingApi.findCompaniesByConditions, {
                companyName: this.search.companyName,
                enAble: this.search.isAvailable,
                pageNum: this.companyPageInfo.pageNum,
                isOnlyList: isOnlyList
            }, d => {
                if (d.data && d.data.list) {
                    this.companyList = d.data.list
                } else {
                    this.companyList = []
                }
            }).then((results) => {
                this.loading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.companyPageInfo.total = results[1].data.total
                        this.companyPageInfo.pageSize = results[1].data.pageSize
                        this.companyPageInfo.pageNum = results[1].data.pageNum
                    } else {
                        this.companyPageInfo.total = this.companyPageInfo.pageSize * (this.companyPageInfo.pageNum + 1)
                    }
                }
            })
        },
        newOrEditCompanySetting (companyId, type) {
            if (companyId) {
                this.companyId = companyId
            } else {
                this.companyId = ''
            }
            this.type = type
            this.companySettingDialogVisible = true
        },
        showCompanySettingInfo (companyId) {
            if (companyId) {
                this.companyId = companyId
            }
            this.companyInfoDialogVisible = true
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
  .company_setting_operate{
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
  .suggestionList{
      text-overflow: ellipsis;
      overflow: hidden;
      width:100%;
  }
</style>
