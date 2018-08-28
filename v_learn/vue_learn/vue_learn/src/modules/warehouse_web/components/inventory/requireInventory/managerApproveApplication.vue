<template>
    <div>
        <div class="operatorApplicationBox" v-loading="contentLoading">
            <div class="baseInfo">
                <div class="baseInfoTitle">
                    <div class="baseInfoTitle_content">Inventory-Requirement Form</div>
                    <div class="baseInfoTitle_List"><span><em class="blueColor">Application ID:</em> [ {{ baseInfo.applicationId }} ]</span><span><em class="blueColor">Status:</em> [ {{ baseInfo.status | formatStatus }} ]</span></div>
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
                    <el-table-column label="Model" prop="model" align="left"></el-table-column>
                    <el-table-column label="Required Quantity" prop="requireQuantity" align="right"></el-table-column>
                </el-table>
            </div>
            <div class="opinionList">
                <el-form ref="form" :model="form" label-width="80px" :label-position="labelPosition">
                    <el-row>
                        <el-form-item label="Opinion:">
                            <el-radio-group v-model="form.opinion">
                                <el-radio label="Agree"></el-radio>
                                <el-radio label="Reject"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Note:">
                            <el-input  :maxlength="maxSize" v-model="form.mgrNote"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <div class="operatorList">
                <el-button type="primary" @click="submitItems" :loading="submitLoading">Submit</el-button>
            </div>
            <div class="storyInfo">
                <div class="storyInfoTitle">Status History</div>
                <div class="storyInfoContent" v-for="(item, index) in historyData" :key="index">
                    <el-row>
                        <el-col :span="12"><div class="storyInfoList fontWeightList">{{ item.name }}</div></el-col>
                        <el-col :span="12"><div class="storyInfoList storyInfoListContent">{{ item.status }}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12"><div class="storyInfoList">{{ item.role }}</div></el-col>
                        <el-col :span="12"><div class="storyInfoList storyInfoListContent">{{ item.createdTime | formatFullDate }}</div></el-col>
                    </el-row>
                    <el-row v-if="item.note">
                        <el-col :span="24"><div class="storyInfoList">{{ item.note }}</div></el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Utils from '~utils/index'
  import warehouseApi from '~api/warehouseapi'
  export default {
      data(){
          return {
              contentLoading : false,
              submitLoading : false,
              tableData : [],
              historyData : [],
              form : {
                  opinion : 'Agree',
                  mgrNote : ''
              },
              maxSize : 100,
              baseInfo : {
                  currentCreator : '',
                  currentTime : '',
                  currentWarehouse : '',
                  applicationId : '',
                  status : ''
              },
              labelPosition : 'left'
          }
      },
      mixins: [{
          created () {
              let params = this.$route.query;
              document.title = 'Approve Application'

              if(params.id){
                  this.contentLoading = true;
                  this.getInfoByApplicationId({
                      "id": params.id
                  });
              }else{
                  this.$message.error('Approve Id is null.');
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
          submitItems(){
              let t = this;
              let params = t.$route.query;

              if(!params.id){
                  t.$message.error('Approve Id is null.');
                  return false
              }

              let paramsContent = Object.assign({}, t.form, {
                  id : params.id,
                  status : t.form.opinion == 'Agree' ? 3 : 7
              });

              t.submitLoading = true;
              warehouseApi.auditAppByMgr(paramsContent).then(d => {
                  t.submitLoading = false;
                  if (d.success == true) {
                      t.$showSuccessMessage('Approve successfully!');
                      if(d.data){
                          t.$router.push({
                              path: '/viewOperatorApplication',
                              query : {
                                  type : 'manage',
                                  id : d.data.id
                              }
                          });
                      }
                  } else {
                      t.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  t.submitLoading = false;
                  t.$showErrorMessage(err)
              })
          },
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
  .operatorList{
      margin-top: 20px;
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
      text-align: right;
  }
  .storyInfoContent{
      margin: 5px 0 15px 0;
  }
  .storyInfoList{
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
