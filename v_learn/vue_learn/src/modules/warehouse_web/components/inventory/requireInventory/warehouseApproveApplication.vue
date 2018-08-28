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
            <el-form ref="form" :model="form" label-width="90px" :label-position="labelPosition">
                <el-row>
                    <el-form-item label="Opinion:">
                        <el-radio-group v-model="form.opinion" @change="changeOpinionEvt">
                            <el-radio label="Agree"></el-radio>
                            <el-radio label="Reject"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-row>
                <el-row v-if="showWarehouse">
                    <el-form-item label="Warehouse:">
                        <el-select v-model="form.requireWarehouseId" @change="changeWarehouseEvt" placeholder="Select a warehouse">
                            <el-option
                                v-for="item in warehouseData"
                                :key="item.facilityId"
                                :label="item.facilityName"
                                :value="item.facilityId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <div v-loading="tableLoading">
                    <el-table :data="tableData" border style="width:100%;font-size: 12px;" tooltip-effect="dark" empty-text="No data.">
                        <el-table-column type="index" label="No." align="center"></el-table-column>
                        <el-table-column label="Product ID" prop="productId" align="left"></el-table-column>
                        <el-table-column label="Model" prop="model" align="left"></el-table-column>
                        <el-table-column label="Required Quantity" prop="requireQuantity" align="right"></el-table-column>
                        <el-table-column label="Rationing Quantity" align="right">
                            <template slot-scope="scope">
                                <div v-if="showWarehouse">
                                    <div v-if="scope.row.availableQuantity">
                                        <el-input-number size="small" v-model="scope.row.rationingQuantity" :min="0" :max="+scope.row.availableQuantity" :controls="false"></el-input-number>
                                    </div>
                                    <div v-else>
                                        <el-input-number size="small" :disabled="initDisabled" v-model="initNumber" :controls="false"></el-input-number>
                                    </div>
                                </div>
                                <div v-else>
                                    <div style="color: #e50038;">0</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="showWarehouse" label="Available Quantity" align="right">
                            <template slot-scope="scope">
                                <div v-if="scope.row.availableQuantity">{{ scope.row.availableQuantity | formatNumber }}</div>
                                <div v-else>---</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-row style="margin-top: 15px">
                    <el-form-item label="Note:">
                        <el-input  :maxlength="maxSize" v-model="form.keeperNote"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="operatorList">
                <el-button type="primary" @click="submitItems" :loading="submitLoading">Submit</el-button>
                <el-button @click="cancelItems">Cancel</el-button>
            </div>
            <div class="storyInfo">
                <div class="storyInfoTitle">Status History</div>
                <div class="storyInfoContent" v-for="item in historyData" :key="item.status">
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
  import inventoryItemApi from '~api/warehouse/findInventoryItemApi'
  export default {
      data(){
          return {
              contentLoading : false,
              submitLoading : false,
              tableLoading : false,
              historyData : [],
              tableData : [],
              warehouseData : [],
              form : {
                  keeperNote : '',
                  opinion : 'Agree',
                  requireWarehouseId : ''
              },
              baseInfo : {
                  currentCreator : '',
                  currentTime : '',
                  currentWarehouse : '',
                  currentWarehouseId : '',
                  applicationId : '',
                  status : ''
              },
              maxSize: 100,
              labelPosition : 'left',
              initDisabled : true,
              initNumber : 0,
              showWarehouse : true
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
          formatNumber(val){
              if(!val){
                  return val
              }

              return parseInt((val - 0))
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
          getWarehouseList(){
              inventoryItemApi.getFacilityList().then(d => {
                  if (d.success) {
                      let dataList = [];
                      (d.data.inventoryFacilitys).forEach((item) => {
                          if(this.baseInfo.currentWarehouseId != item.facilityId){
                              dataList.push(item);
                          }
                      });
                      this.warehouseData = this.warehouseData.concat(dataList)
                      this.warehouseData.unshift({'facilityId': '', 'facilityName': 'Select a warehouse'})
                  }else{
                      this.$showErrorMessage(d.message)
                  }
              }).catch(e => {
                  this.$showErrorMessage(e)
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
                          this.baseInfo.currentWarehouseId = d.data.requireWarehouseId;
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

                      this.getWarehouseList();

                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.contentLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          changeOpinionEvt(data){
              if(data == 'Agree'){
                  this.showWarehouse = true;
              }else if(data == 'Reject'){
                  this.showWarehouse = false;
              }
          },
          changeWarehouseEvt(data){
              let t = this;
              let params = this.$route.query;

              this.tableLoading = true;
              warehouseApi.findInventoryRequieApplication({
                id : params.id,
                relationWarehouseId : this.form.requireWarehouseId
              }).then(d => {
                  this.tableLoading = false;
                  if (d.success == true) {
                      if(d.data){
                          if(d.data.list && d.data.list.length){
                            this.tableData.splice(0);
                            (d.data.list).forEach((item) => {
                                if((item.availableQuantity - 0) >= (item.requireQuantity - 0)){
                                    t.$set(item, 'rationingQuantity', item.requireQuantity - 0);
                                }else{
                                    t.$set(item, 'rationingQuantity', item.availableQuantity - 0);
                                }
                            })
                            this.tableData = this.tableData.concat(d.data.list);
                          }
                      }else{
                          this.tableData.splice(0);
                      }
                  } else {
                      this.$showErrorMessage(d.message)
                  }
              }).catch(err => {
                  this.tableLoading = false;
                  this.$showErrorMessage(err)
              })
          },
          submitItems(){
              let t = this;
              let sumTotal = 0;
              let params = t.$route.query;
              let paramsContent;

              if(!params.id){
                  t.$message.error('Approve Id is null.');
                  return false
              }

              if(t.form.opinion == 'Agree' && t.form.warehouse == ''){
                  t.$message.error('Warehouse is null.');
                  return false
              }

              for(let i = 0; i < t.tableData.length; i++){
                  sumTotal += parseInt((t.tableData)[i].rationingQuantity, 10);
              }

              if(t.form.opinion == 'Agree' && sumTotal == 0){
                  t.$message.error('Total rationing quantity should be larger than 0 when you choose "Agree".');
                  return false
              }

              if(t.form.opinion == 'Agree'){
                  paramsContent = Object.assign({}, t.form, {
                      id : params.id,
                      status : 4,
                      list : t.tableData
                  });
              }else if(t.form.opinion == 'Reject'){
                  paramsContent = Object.assign({}, t.form, {
                      id : params.id,
                      status : 7
                  });
              }

              t.submitLoading = true;
              warehouseApi.auditAppByKeeper(paramsContent).then(d => {
                  t.submitLoading = false;
                  if (d.success == true) {
                      t.$showSuccessMessage('Approve successfully!');
                      if(d.data){
                          t.$router.push({
                              path: '/viewOperatorApplication',
                              query : {
                                  type : 'warehouse',
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
          cancelItems(){
              window.close();
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
