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
                <el-input size="small" v-model.trim="search.storeName" style="width:200px;"
                          placeholder="Input Store Name"></el-input>
              </el-col>
              <el-col :span="6" :offset="2" class="col_box">
                <el-select v-model="search.isAvailable" placeholder="open or close">
                  <el-option
                    v-for="item in openOptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2" :offset="2" class="col_box col_box_btn">
                <el-button class="button" size="small" :loading="loading" type="primary" @click="getStoreSetting"
                           icon="el-icon-search">Search
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="list_box" v-loading="loading" element-loading-text="Loading...">
            <el-row class="list_box_new">
              <el-col v-security='{permission:"storeSettingNew"}' :span="2" :offset="22">
                <el-button type="primary" icon="el-icon-plus" @click="newOrEditStoreSetting('','create')">New</el-button>
              </el-col>
            </el-row>
            <el-table :data="storeList" border style="width: 100%;" class="list_table">
              <el-table-column type="index" label="No." align="center"></el-table-column>
              <el-table-column prop="storeName" label="Store Name" class-name="tab_break"
                               align="left"></el-table-column>
              <el-table-column label="Modify Time" class-name="tab_break" align="center">
                <template slot-scope="props">
                  {{props.row.updateTime | setTime}}
                </template>
              </el-table-column>
              <el-table-column prop="updateUser" label="Operator" class-name="tab_break" align="left"></el-table-column>
              <el-table-column prop="isAvailable" label="Open" class-name="tab_break" align="center"></el-table-column>
              <el-table-column label="Operation" align="center">
                <template slot-scope="props">
                  <a href="javascript:void(0)" class="store_setting_operate"
                     @click="showStoreSettingInfo(props.row.storeID)">View</a>
                  <a href="javascript:void(0)" class="store_setting_operate"
                      v-security='{permission:"storeSettingEdit"}'
                     @click="newOrEditStoreSetting(props.row.storeID,'edit')">Edit</a>
                  <a href="javascript:void(0)" class="store_setting_operate"
                      v-security='{permission:"storeSettingCopy"}'
                     @click="newOrEditStoreSetting(props.row.storeID,'copy')">Copy</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="page_box" v-if="storeList && storeList.length">
              <el-pagination
                layout="prev, pager, next, jumper"
                :total="storePageInfo.total"
                :page-size="storePageInfo.pageSize"
                :current-page.sync="search.pageNum"
                @current-change="getStoreSettingPage">
              </el-pagination>
            </div>
          </div>

        </div>
      </el-col>

    </el-row>
    <store-setting-dialog v-if="storeSettingDialogVisible" :dataVisible.sync="storeSettingDialogVisible"
                          :dataType.sync="type" :dataStoreId.sync="storeId"
                          v-on:refreshStore="getStoreSetting"></store-setting-dialog>
    <store-info-dialog v-if="storeInfoDialogVisible" :dataVisible.sync="storeInfoDialogVisible"
                       :dataStoreId.sync="storeId"></store-info-dialog>

  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import storeSettingApi from '~api/setting/storeSettingApi'
import storeSettingDialog from '~setting-common/dialog/storeSettingDialog.vue'
import storeInfoDialog from '~setting-common/dialog/storeInfoDialog.vue'
export default {
    data () {
        return {
            currentRouteUrl: '',
            loading: false,
            storeId: '',
            type: '',
            openOptions: [{id: 'Y', value: 'Open'}, {id: 'N', value: 'Close'}],
            search: {storeName: '', isAvailable: '', pageNum: 1},
            storeList: [],
            storePageInfo: {
                pageNum: 1,
                total: 2,
                pageSize: 10
            },
            isManual: false,
            storeSettingDialogVisible: false,
            storeInfoDialogVisible: false
        }
    },
    mounted () {
        this.currentRouteUrl = 'storeSetting'
        this.getStoreSetting()
    },
    filters: {
        setTime: function (value) {
            return value ? Utils.getServerDateStrByLocal(value, 'dd/MM/yyyy hh:mm:ss') : '----'
        }
    },
    components: {
        settingMenu,
        storeSettingDialog,
        storeInfoDialog
    },
    methods: {
        getStoreSetting () {
            this.queryStoreSetting(false, 1)
        },
        getStoreSettingPage () {
            if (!this.isManual) {
                this.queryStoreSetting(true)
            } else {
                this.isManual = false
            }
        },
        queryStoreSetting (isOnlyList = false, pageIndex) {
            this.loading = true
            this.$getCommonPageListApi(storeSettingApi.queryAllStoresByConditions, {
                storeName: this.search.storeName,
                isAvailable: this.search.isAvailable,
                pageNum: pageIndex || this.search.pageNum,
                isOnlyList: isOnlyList
            }, d => {
                if (d.data && d.data.list) {
                    this.storeList = d.data.list
                } else {
                    this.storeList = []
                }
                if (this.search.pageNum != d.data.pageNum) {
                    this.isManual = true
                    this.search.pageNum = d.data.pageNum
                }
            }).then((results) => {
                this.loading = false
                if (results.length > 1) {
                    if (results[1].success) {
                        this.storePageInfo.total = results[1].data.total
                        this.storePageInfo.pageSize = results[1].data.pageSize
                    } else {
                        this.storePageInfo.total = this.storePageInfo.pageSize * (this.search.pageNum + 1)
                    }
                }
            })
        },
        newOrEditStoreSetting (storeId, type) {
            if (storeId) {
                this.storeId = storeId
            }
            this.type = type
            this.storeSettingDialogVisible = true
        },
        showStoreSettingInfo (storeId) {
            if (storeId) {
                this.storeId = storeId
            }
            this.storeInfoDialogVisible = true
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
