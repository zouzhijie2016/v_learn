<template>
    <div>
        <div class="operatorApplicationBox" v-loading="contentLoading">
            <div class="baseInfo">
                <div class="baseInfoTitle">
                    <div class="baseInfoTitle_content">Inventory-Requirement Form</div>
                    <div class="baseInfoTitle_List" v-if="showBaseInfo"><span><em class="blueColor">Application ID:</em> [ {{ baseInfo.applicationId }} ]</span><span><em class="blueColor">Status:</em> [ {{ baseInfo.status | formatStatus }} ]</span></div>
                </div>
                <div class="baseInfoContent">
                    <span>Applicant: {{ baseInfo.currentCreator }}</span>
                    <span>Time: {{ baseInfo.currentTime }}</span>
                    <span>Require Warehouse: {{ baseInfo.currentWarehouse }}</span>
                </div>
            </div>
            <div class="contentInfo">
                <el-table :data="tableData" border style="width:100%;font-size: 12px;" tooltip-effect="dark" empty-text="No data.">
                    <el-table-column type="index" label="No." align="center"></el-table-column>
                    <el-table-column label="Product ID" prop="productId" align="left"></el-table-column>
                    <el-table-column label="Model" align="left">
                        <template slot-scope="scope">
                            <div v-if="scope.row.productAttributes">{{ scope.row.internalName || scope.row.model }} {{ scope.row.productAttributes }}</div>
                            <div v-else>{{ scope.row.internalName || scope.row.model }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Required Quantity" align="right">
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.requireQuantity" :min="1" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operator" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-delete" type="default" @click="handleDelete(scope.row)">Delete</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="operatorItem">
                    <el-button icon="el-icon-plus" type="primary" @click="addItems">Add</el-button>
                </div>
            </div>
            <div class="operatorList">
                <el-button type="primary" @click="submitItems" :loading="submitLoading">Submit</el-button>
                <el-button type="success" @click="saveItems" :loading="saveLoading">Save</el-button>
                <el-button @click="cancelItems">Cancel</el-button>
            </div>
            <div class="storyInfo" v-if="historyData && historyData.length">
                <div class="storyInfoTitle">Status History</div>
                <div class="storyInfoContent" v-for="(item, index) in historyData" :key="index">
                    <div>
                        <div class="storyInfoList fontWeightList">{{ item.name }}</div>
                        <div class="storyInfoListContent">{{ item.status }}</div>
                        <div style="clear: both;"></div>
                    </div>
                    <div>
                        <div class="storyInfoList">{{ item.role }}</div>
                        <div class="storyInfoListContent">{{ item.createdTime | formatFullDate }}</div>
                        <div style="clear: both;"></div>
                    </div>
                    <div v-if="item.note">
                        <div class="storyInfoList">{{ item.note }}</div>
                        <div style="clear: both;"></div>
                    </div>
                </div>
            </div>
        </div>
        <showProductDialog v-if="showProductDialogValue" :dataVisible.sync="showProductDialogValue" @click="updateItemsEvt"></showProductDialog>
    </div>
</template>
<script>
  import Utils from '~utils/index'
  import showProductDialog from '~warehouse-common/dialog/showProductDialog.vue'
  import warehouseApi from '~api/warehouseapi'
  export default {
      data(){
          return {
              contentLoading : false,
              tableData : [],
              historyData : [],
              showBaseInfo : false,
              showProductDialogValue : false,
              submitLoading : false,
              saveLoading : false,
              initData : [],
              baseInfo : {
                  currentCreator : '',
                  currentTime : '',
                  currentWarehouse : '',
                  applicationId : '',
                  status : ''
              }
          }
      },
      components : {
          showProductDialog
      },
      mixins: [{
          created () {
              let params = this.$route.query;
              if(!params.id){
                  this.showBaseInfo = false;
                  this.contentLoading = true;
                  document.title = 'New Application'

                  this.getCurrentUser();
              }else{
                  this.showBaseInfo = true;
                  this.contentLoading = true;
                  document.title = 'Edit Application'

                  this.getInfoByApplicationId({
                      "id": params.id
                  })
              }
          }
      }],
      filters : {
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
          },
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
              return Utils.getServerDateStrByLocal((val-0), 'dd/MM/yyyy hh:mm:ss')
          }
      },
      methods : {
          getInfoByApplicationId(dataContent){
              warehouseApi.findInventoryRequieApplication(dataContent).then(d => {
                  this.contentLoading = false;
                  if (d.success == true) {
                      if(d.data){
                          this.baseInfo.currentCreator = d.data.createdUser;
                          this.baseInfo.currentTime = this.formatDate(new Date(d.data.createdTime), true);
                          this.baseInfo.currentWarehouse = d.data.requireWarehouse;
                          this.baseInfo.applicationId = d.data.applicationId;
                          this.baseInfo.status = d.data.status;

                          if(d.data.list && d.data.list.length){
                              this.tableData.splice(0);
                              this.tableData = this.tableData.concat(d.data.list);
                          }

                          if(d.data.statusHistories && d.data.statusHistories.length){
                              this.historyData.splice(0);
                              this.historyData = this.historyData.concat(d.data.statusHistories);
                          }
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.contentLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          getCurrentUser(){
              warehouseApi.currentUser().then(d => {
                  this.contentLoading = false;
                  if (d.success == true) {
                      if(d.data){
                          this.baseInfo.currentCreator = d.data.userLoginId;
                          this.baseInfo.currentTime = this.formatDate(new Date(), false);
                          this.baseInfo.currentWarehouse = d.data.currentWarehouseName;
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.contentLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          handleDelete(data){
              this.tableData.forEach((item, index) =>{
                  if(item.productId == data.productId){
                      this.tableData.splice(index, 1)
                  }
              })
          },
          updateItemsEvt(data){
              if (this.tableData.length == 0) {
                  data.forEach((item) => {
                      this.$set(item, 'requireQuantity', 1)
                      this.$set(item, 'model', item.internalName)
                  })
                  this.tableData = this.tableData.concat(data);
              } else {
                  var productIdFilterData = this.tableData.map(function (elem) {
                      return elem.productId
                  })
                  for (var i = 0; i < data.length; i++) {
                      if (productIdFilterData.indexOf(data[i].productId) == -1) {
                          this.$set(data[i], 'requireQuantity', 1)
                          this.$set(data[i], 'model', data[i].internalName)
                          this.tableData = this.tableData.concat(data[i])
                      }
                  }
              }
          },
          addItems(){
              this.showProductDialogValue = true
          },
          submitItems(){
              let t = this;
              let params = this.$route.query;
              let status = 2;

              if(params.id){
                  this.editSubmitEvt({
                      status : status,
                      id : params.id
                  }, function (d) {
                      if(d.success){
                          t.$showSuccessMessage('Submit successfully!');
                          t.$router.push({
                              path: '/viewOperatorApplication',
                              query : {
                                  type : 'operator',
                                  id : d.data.id
                              }
                          });
                      }else{
                          t.$showErrorMessage(d.message)
                      }
                  });
              }else{
                  this.submitEvt(status, function (d) {
                      if(d.success){
                          t.$showSuccessMessage('Submit successfully!');
                          t.$router.push({
                              path: '/viewOperatorApplication',
                              query : {
                                  type : 'operator',
                                  id : d.data.id
                              }
                          });
                      }else{
                          t.$showErrorMessage(d.message)
                      }
                  });
              }
          },
          saveItems(){
              let t = this;
              let params = this.$route.query;
              let status = 1;

              if(params.id){
                  this.editSubmitEvt({
                      status : status,
                      id : params.id
                  }, function (d) {
                      if(d.success){
                          t.$showSuccessMessage('Save successfully!');
                          if(d.data){
                              location.href = '/warehouse_web/index.html#/operatorApplication?id=' + d.data.id;
                              location.reload();
                          }
                      }else{
                          t.$showErrorMessage(d.message)
                      }
                  });
              }else{
                  this.submitEvt(status, function (d) {
                      if(d.success){
                          t.$showSuccessMessage('Save successfully!');
                          if(d.data){
                              location.href = '/warehouse_web/index.html#/operatorApplication?id=' +d.data.id;
                              location.reload();
                          }
                      }else{
                          t.$showErrorMessage(d.message)
                      }
                  });
              }
          },
          submitEvt(paramsContent, callback){
              let t = this;

              if(t.tableData.length == 0){
                  t.$message.error('Please add product at first.');
                  return false;
              }
              paramsContent == 2 ? t.submitLoading = true : t.saveLoading = true;

              let params = Object.assign({}, {
                  status : paramsContent,
                  list: t.tableData
              })

              warehouseApi.createInventoryRequieApplication(params).then(d => {
                  paramsContent == 2 ? t.submitLoading = false : t.saveLoading = false;
                  if (d.success == true) {
                      callback && callback(d)
                  }else{
                      t.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  paramsContent == 2 ? t.submitLoading = false : t.saveLoading = false;
                  t.$showErrorMessage(err)
              })

          },
          editSubmitEvt(paramsContent, callback){
              let t = this;

              if(t.tableData.length == 0){
                  t.$message.error('Please add product at first.');
                  return false;
              }
              paramsContent.status == 2 ? t.submitLoading = true : t.saveLoading = true;

              let params = Object.assign({}, {
                  status : paramsContent.status,
                  id : paramsContent.id,
                  list: t.tableData
              })

              warehouseApi.updateInventoryRequieApplication(params).then(d => {
                  paramsContent.status == 2 ? t.submitLoading = false : t.saveLoading = false;
                  if (d.success == true) {
                      callback && callback(d)
                  }else{
                      t.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  paramsContent.status == 2 ? t.submitLoading = false : t.saveLoading = false;
                  t.$showErrorMessage(err)
              })

          },
          cancelItems(){
              let params = this.$route.query;
              if(!params.id){
                  if(this.tableData.length == 0){
                      window.close();
                  }else{
                      this.showTipsEvt({
                          message : 'The information filled will be discarded, are you sure to leave the page?'
                      })
                  }
              }else{
                  if(this.initData.length != this.tableData.length){
                      this.showTipsEvt({
                          message : 'The information have been modified, are you sure to discard these changes and leave?'
                      })
                  }else{
                      let flag = false;
                      for (let i = 0; i < this.initData.length; i++){
                          if(!(this.initData[i].productId == this.tableData[i].productId && this.initData[i].quantity == this.tableData[i].quantity)){
                              flag = true
                          }
                      }

                      if(flag){
                          this.showTipsEvt({
                              message : 'The information have been modified, are you sure to discard these changes and leave?'
                          })
                      }else{
                          window.close();
                      }
                  }
              }
          },
          showTipsEvt(options){
              this.$confirm(options.message, 'Tips', {
                  cancelButtonText: 'Stay',
                  confirmButtonText: 'Leave',
                  closeOnClickModal : false,
                  cancelButtonClass : 'cancelOperatorApplicationClass',
                  confirmButtonClass : 'confirmOperatorApplicationClass',
                  customClass : 'deleteOperatorApplicationClass',
                  type: 'warning'
              }).then(() => {
                  window.close()
              }).catch(()=>{});
          },
          formatDate (val, flag) {
              if (!val) {
                  return val
              }
              if(flag){
                  return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy hh:mm:ss')
              }else{
                  return Utils.getServerDateStrByLocal(val, 'dd/MM/yyyy')
              }
          }
      }
  }
</script>
<style>
  .cancelOperatorApplicationClass{
      float: right;
      margin-left: 20px;
  }
  .confirmOperatorApplicationClass{
      float: right;
  }
  .deleteOperatorApplicationClass .el-message-box__btns{
      clear: both;
      float: right;
  }
</style>
<style scoped>
  .baseInfoTitle{
      height: 40px;
      line-height: 40px;
  }
  .baseInfoTitle_content{
      float: left;
      font-weight: bold;
      font-size: 20px;
  }
  .baseInfoTitle_List{
      float: left;
      margin-left: 20px;
  }
  .baseInfoTitle_List span{
      margin-right: 15px;
      font-size: 14px;
  }
  .baseInfoContent{
      height: 40px;
      line-height: 40px;
  }
  .baseInfoContent span{
      float: left;
      margin-right: 50px;
  }
  .operatorItem{
      margin-top: 10px;
  }
  .operatorList{
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #dbdbdb;
      text-align: center;
  }
  .operatorApplicationBox{
      background-color: #ffffff;
      padding: 20px ;
      margin: 0 40px;
  }
  .storyInfo{
      margin-top: 15px;
  }
  .storyInfoTitle{
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #dbdbdb;
  }
  .storyInfoListContent{
      width: 50%;
      line-height: 25px;
      float: right;
      text-align: right;
  }
  .storyInfoContent{
      margin: 5px 0 15px 0;
  }
  .storyInfoList{
      width: 50%;
      float: left;
      line-height: 25px;
      font-size: 13px;
  }
  .fontWeightList{
      font-weight: bold;
      font-size: 14px;
  }
  .blueColor{
      color: #337ab7;
      font-style: normal;
  }
</style>
