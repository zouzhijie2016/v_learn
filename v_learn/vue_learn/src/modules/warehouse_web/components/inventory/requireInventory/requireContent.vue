<template>
    <div>
        <div class="searchList">
            <el-form :model="searchForm" :inline="true">
                <el-row>
                    <el-col :span="12">
                        <el-form-item>
                            <label class="form_label">Date of Created</label>
                            <el-date-picker type="date"
                                            :editable="false"
                                            :clearable="false"
                                            :picker-options="searchForm.createdBeginPickerOptions"
                                            v-model.trim="searchForm.createdBeginToTime"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%;">
                            </el-date-picker>
                            <label class="col_datepicker_label" style="width:5%;text-align:center;">-</label>
                            <el-date-picker type="date"
                                            :editable="false"
                                            :clearable="false"
                                            :picker-options="searchForm.createdEndPickerOptions"
                                            v-model.trim="searchForm.createdEndToTime"
                                            format="dd/MM/yyyy"
                                            size="small"
                                            placeholder="DD/MM/YYYY" style="width:33%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Status">
                            <el-select size="small" v-model="searchForm.status" placeholder="Select Status">
                                <el-option
                                    v-for="item in statusData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-button type="primary" size="small" icon="el-icon-search" :loading="searchForm.searchLoading" @click="searchRequireList('1')">Search</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                  <el-row>
                      <el-button @click="createApplicationEvt" type="default" size="small" icon="el-icon-plus">Create a New Application</el-button>
                  </el-row>
            </el-form>
        </div>
        <div class="contentList" v-loading="searchForm.searchLoading" element-loading-text="Loading">
            <el-table :data="requireListData.list" style="width: 100%;font-size: 12px;" :default-sort="{ prop: 'updatedTime', order: 'descending' }" empty-text="No data." class="require_list_table">
                <el-table-column type="index" label="No." align="center"></el-table-column>
                <el-table-column label="Date of Created" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.createdTime | formatDate }}
                    </template>
                </el-table-column>
                <el-table-column prop="applicationId" label="Application ID" align="center"></el-table-column>
                <el-table-column prop="requireWarehouse" label="Require Warehouse" align="left"></el-table-column>
                <el-table-column label="Status" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.status | formatStatus }}
                    </template>
                </el-table-column>
                <el-table-column prop="updatedTime" label="Last Update" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updatedTime | formatFullDate }}
                    </template>
                </el-table-column>
                <el-table-column prop="updatedUser" label="Last Update Operator" align="left"></el-table-column>
                <el-table-column label="Operation" align="left">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">
                            <el-button type="text" @click="editDialogEvt(scope.row)" size="small">Edit</el-button>
                            <el-button type="text" @click="deleteDialogEvt(scope.row)" size="small">Delete</el-button>
                        </div>
                        <div v-else-if="scope.row.status == 2">
                            <el-button type="text" @click="viewDialogEvt(scope.row)" size="small">View</el-button>
                            <el-button type="text" @click="withDrewDialogEvt(scope.row)" size="small">WithDraw</el-button>
                        </div>
                        <div v-else>
                            <el-button type="text" @click="viewDialogEvt(scope.row)" size="small">View</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page_list_box" v-if="requireListData.list && requireListData.list.length">
                <el-pagination class="pageList"
                    layout="prev, pager, next, jumper"
                    :total="requireListData.pageMap.total"
                    :page-size="requireListData.pageMap.pageSize"
                    :current-page.sync="searchForm.curpage"
                    @current-change="searchRequireListPage">
                </el-pagination>
                <span class="pageInfoList">Display {{ requireListData.pageMap.startRow }} - {{ requireListData.pageMap.endRow }} item, {{ requireListData.pageMap.total }} results in total</span>
            </div>
            <div style="clear: both;"></div>
        </div>
    </div>
</template>
<script>
  import Utils from '~utils/index'
  import warehouseApi from '~api/warehouseapi'
  export default {
      data(){
          var _this = this
          var compareFormat = 'yyyy/MM/dd'
          return {
              statusData : [{
                  id : '',
                  name : 'ALL'
              },{
                id : '1',
                name : 'Draft'
              },{
                id : '2',
                name : 'In Applying'
              },{
                id : '3',
                name : 'Regional Approved'
              },{
                id : '4',
                name : 'Warehouse Approved'
              },{
                id : '5',
                name : 'Picking Completed'
              },{
                id : '6',
                name : 'Picking Cancelled'
              },{
                id : '7',
                name : 'Rejected'
              }],
              searchForm : {
                  status : '',
                  createdBeginToTime : '',
                  createdEndToTime : '',
                  pageSize : 10,
                  curpage : 1,
                  createdBeginPickerOptions : {
                      disabledDate (date) {
                          return date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getLessSixMonth(new Date(), compareFormat)
                      }
                  },
                  createdEndPickerOptions : {
                      disabledDate (date) {
                          return date > _this.getCompareDate(new Date(), compareFormat) || date < _this.getLessSixMonth(new Date(), compareFormat)
                      }
                  },
                  searchLoading : false
              },
              isManual : false,
              requireListData : {
                  list : [],
                  pageMap : {
                      total : 0,
                      pageSize : 10,
                      pageNum : 1,
                      startRow: 0,
                      endRow: 0
                  }
              }
          }
      },
      mounted(){
          this.searchRequireList(1);
      },
      methods:{
          getCompareDate (d) {
              return new Date(d.getFullYear(), d.getMonth(), d.getDate())
          },
          setFromDateEvt(beginDate){
              beginDate.setHours(0)
              beginDate.setMinutes(0)
              beginDate.setSeconds(0)
              beginDate.setMilliseconds(0)

              return beginDate
          },
          setEndDateEvt(endDate){
              endDate.setHours(23)
              endDate.setMinutes(59)
              endDate.setSeconds(59)
              endDate.setMilliseconds(0)

              return endDate
          },
          beginDateChangeEvt (newVal) {
              return newVal ? Utils.getServerTimestamp(newVal) : ''
          },
          searchRequireListPage(){
              if (!this.isManual) {
                  this.searchRequireList(this.searchForm.curpage, true)
              } else {
                  this.isManual = false
              }
          },
          searchRequireList(params, isOnlyList = false){
              let t = this;
              let getParams = this.getParams();

              if(getParams.start > getParams.end){
                  this.$message.error("start date can't be greater than end date.");
                  return false;
              }

              var paramsContent = Object.assign({}, this.getParams(), {
                  pageNum: params || this.searchForm.curpage,
                  isOnlyList: isOnlyList
              })

              this.searchForm.searchLoading = true
              this.$getCommonPageListApi(warehouseApi.listShopMgr, paramsContent, d => {
                  if (d.data && d.data.list && d.data.list.length) {
                      t.requireListData.list.splice(0)
                      t.requireListData.list = t.requireListData.list.concat(d.data.list)
                  } else {
                      t.requireListData.list.splice(0)
                  }
                  if (t.searchForm.curpage != d.data.pageNum) {
                      t.isManual = true
                      t.searchForm.curpage = d.data.pageNum
                  }
              }).then((results) => {
                  this.searchForm.searchLoading = false
                  if (results.length > 1) {
                      if (results[1].success) {
                          t.requireListData.pageMap.total = results[1].data.total
                          t.requireListData.pageMap.pageSize = results[1].data.pageSize
                          t.requireListData.pageMap.startRow = (results[1].data.pageNum - 1) * results[1].data.pageSize + 1
                          t.requireListData.pageMap.endRow = results[1].data.pageSize * results[1].data.pageNum > results[1].data.total ? results[1].data.total : results[1].data.pageSize * results[1].data.pageNum
                      } else {
                          t.requireListData.pageMap.total = t.requireListData.pageMap.pageSize * t.searchForm.curpage
                      }
                  } else {
                      t.requireListData.pageMap.startRow = (t.searchForm.curpage - 1) * t.searchForm.pageSize + 1
                      t.requireListData.pageMap.endRow = t.requireListData.pageMap.pageSize * t.searchForm.curpage > t.requireListData.pageMap.total ? t.requireListData.pageMap.total : t.requireListData.pageMap.pageSize * t.searchForm.curpage
                  }
              })
          },
          getParams () {
              return {
                  start: this.searchForm.createdBeginToTime ? this.beginDateChangeEvt(this.setFromDateEvt(this.searchForm.createdBeginToTime)) : 0,
                  end: this.searchForm.createdEndToTime ? this.beginDateChangeEvt(this.setEndDateEvt(this.searchForm.createdEndToTime)) : 0,
                  status: this.searchForm.status,
                  pageSize : this.searchForm.pageSize
              }
          },
          createApplicationEvt(){
              window.open('/warehouse_web/index.html#/operatorApplication');
          },
          editDialogEvt(data){
              if(!data.id){
                  return false;
              }
              warehouseApi.findInventoryRequieApplication({
                  'id' : data.id
              }).then(d => {
                  if (d.success == true) {
                      if(d.data && d.data.status == 1){
                          window.open('/warehouse_web/index.html#/operatorApplication?id=' + data.id);
                      }else{
                          this.searchRequireList(1);
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.$showErrorMessage(err)
              })
          },
          deleteDialogEvt(data){
              let t = this;

              if(!data.id){
                  return false
              }
              this.$confirm('The form deleted cannot be recovered. Are you sure to delete this inventory-requirement form?', 'Delete Application', {
                  cancelButtonText: 'Cancel',
                  confirmButtonText: 'Delete',
                  closeOnClickModal : false,
                  cancelButtonClass : 'cancelApplicationClass',
                  confirmButtonClass : 'confirmApplicationClass',
                  customClass : 'deleteApplicationClass',
                  type: 'warning'
              }).then(() => {
                  warehouseApi.deleteInventoryRequieApplication({
                      id : data.id
                  }).then(d => {
                      if (d.success == true) {
                          t.searchRequireList(1);
                      } else {
                          this.$showErrorMessage(d.message)
                      }
                  }).catch(err => {
                      this.$showErrorMessage(err)
                  })
              }).catch(()=>{});
          },
          viewDialogEvt(data){
              if(!data.id){
                return false;
              }
              window.open('/warehouse_web/index.html#/viewOperatorApplication?type=operator&id=' + data.id);
          },
          withDrewDialogEvt(data){
              let t = this;

              if(!data.id){
                  return false;
              }
              this.$confirm('The application will be recalled and will not go to the next step if you withdraw it. Are you sure to withdraw this inventory-requirement form?', 'Withdraw Application', {
                  cancelButtonText: 'Cancel',
                  confirmButtonText: 'Withdraw',
                  closeOnClickModal : false,
                  cancelButtonClass : 'cancelApplicationClass',
                  confirmButtonClass : 'confirmApplicationClass',
                  customClass : 'deleteApplicationClass',
                  type: 'warning'
              }).then(() => {
                  warehouseApi.withdrawApplication({
                      id : data.id
                  }).then(d => {
                      if (d.success == true) {
                          t.searchRequireList(1);
                      } else {
                          this.$showErrorMessage(d.message)
                      }
                  }).catch(err => {
                      this.$showErrorMessage(err)
                  })
              }).catch(()=>{});
          },
          getLessSixMonth (d) {
              var month = d.getMonth();

              if (month <= 6) {
                  return new Date((d.getFullYear() - 1), (6 + month), d.getDate())
              } else {
                  return new Date(d.getFullYear(), month - 6, d.getDate())
              }
          }
      },
      filters: {
          formatDate (val) {
              if (!val) {
                  return val
              }
              return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy')
          },
          formatFullDate(val) {
              if (!val) {
                  return val
              }
              return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy hh:mm:ss')
          },
          formatStatus(val){
              let content = '';

              if(!val){
                  return val
              }
              switch (val){
                  case 1 :
                      content = 'Draft';
                      break;
                  case 2 :
                      content ='In Applying'
                      break;
                  case 3 :
                      content ='Regional Approved'
                      break;
                  case 4 :
                      content ='Warehouse Approved';
                      break;
                  case 5 :
                      content ='Picking Completed'
                      break;
                  case 6 :
                      content ='Picking Cancelled'
                      break;
                  case 7 :
                      content ='Rejected';
                      break;
              }

              return content
          }
      }
  }
</script>
<style>
  .cancelApplicationClass{
      float: right;
      margin-left: 20px;
  }
  .confirmApplicationClass{
      float: right;
  }
  .deleteApplicationClass .el-message-box__btns{
      clear: both;
      float: right;
  }
</style>
<style scoped>
  .searchList .form_label{
      font-size: 12px;
      text-align: center;
      width: 100px;
      color: #48616A;
  }
  .contentList{
      margin-top: 15px;
  }
  .page_list_box{
      margin-top: 15px;
  }
  .pageInfoList{
      float: right;
      display: inline-block;
      height: 32px;
      line-height: 32px;
  }
  .pageList{
      float: right;
  }
</style>
