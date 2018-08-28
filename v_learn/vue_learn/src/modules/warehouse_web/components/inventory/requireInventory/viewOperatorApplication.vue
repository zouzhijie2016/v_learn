<template>
    <div>
        <div class="operatorApplicationBox" v-loading="contentLoading">
            <div id="printContentList">
                <div class="baseInfo">
                    <div class="baseInfoTitle" style="height: 40px;line-height: 40px;">
                        <div class="baseInfoTitle_content" style="float: left;font-weight: bold;font-size: 20px;">Inventory-Requirement Form</div>
                        <div class="baseInfoTitle_List" style="float: left;margin-left: 20px;"><span style="margin-right: 15px;"><em class="blueColor" style="color: #337ab7;font-style: normal;">Application ID:</em> [ {{ baseInfo.applicationId }} ]</span><span style="margin-right: 15px;"><em class="blueColor" style="color: #337ab7;font-style: normal;">Status:</em> [ {{ baseInfo.status | formatStatus }} ]</span></div>
                    </div>
                    <div class="baseInfoContent" style="height: 40px;line-height: 40px;font-size: 14px">
                        <span style="float: left;margin-right: 50px;">Applicant: {{ baseInfo.currentCreator }}</span>
                        <span style="float: left;margin-right: 50px;">Time: {{ baseInfo.currentTime }}</span>
                        <span style="float: left;margin-right: 50px;">Require Warehouse: {{ baseInfo.currentWarehouse }}</span>
                    </div>
                </div>
                <div class="warehouseInfo" v-if="showContentList">Rationing Warehouse : {{ baseInfo.rationingWarehouse }}</div>
                <div class="contentInfo">
                    <table style="width: 100%;font-size: 12px">
                        <thead>
                            <tr style="background: rgb(238, 244, 246);height: 36px;">
                                <th style="border-top: 1px solid rgb(223, 234, 236);border-left: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: center;line-height: 15px;font-weight: bold;padding-left: 5px;padding-right: 5px;">
                                  No. </th>
                                <th style="border-top: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: left;line-height: 15px;font-weight: bold;padding-left: 5px;padding-right: 5px;">
                                  Product ID </th>
                                <th style="border-top: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: left;line-height: 15px;font-weight: bold;padding-left: 5px;padding-right: 5px;">
                                  Model </th>
                                <th style="border-top: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: right;;line-height: 15px;font-weight: bold;padding-left: 5px;padding-right: 5px;">
                                  Required Quantity </th>
                                <th v-if="showContentList" style="border-top: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: right;line-height: 15px;font-weight: bold;padding-left: 5px;padding-right: 5px;">
                                  Rationing Quantity </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(itemData, index) in tableData" :key="index" style="background-color: #fff;height:40px;font-size: 12px;">
                                <td style="border-left: 1px solid rgb(223, 234, 236);border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: center;font-size: 12px;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                  {{ index + 1 }} </td>
                                <td style="border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: left;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                  {{ itemData.productId }}
                                </td>
                                <td style="border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: left;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                   {{ itemData.model }}
                                </td>
                                <td style="border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: right;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                    {{itemData.requireQuantity}}
                                </td>
                                <td v-if="showContentList" style="border-right: 1px solid rgb(223, 234, 236);border-bottom: 1px solid rgb(223, 234, 236);text-align: right;line-height: 15px;font-weight: normal;padding-left: 5px;padding-right: 5px;">
                                    {{itemData.rationingQuantity}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="storyInfo" style="margin-top: 15px;">
                    <div class="storyInfoTitle" style="height: 40px;line-height: 40px;font-size: 18px;font-weight: bold;border-bottom: 1px solid #dbdbdb;">Status History</div>
                    <div class="storyInfoContent" v-for="(item, index) in historyData" :key="index" style="margin: 5px 0 15px 0;">
                        <div>
                            <div class="storyInfoList fontWeightList" style="font-weight: bold;line-height: 25px;width: 50%;float: left;font-size: 14px;">{{ item.name }}</div>
                            <div class="storyInfoList storyInfoListContent" style="line-height: 25px;text-align: right;width: 50%;float: right;font-size: 13px;">{{ item.status }}</div>
                            <div style="clear: both;"></div>
                        </div>
                        <div>
                            <div class="storyInfoList" style="line-height: 25px;width: 50%;float: left;font-size: 13px;">{{ item.role }}</div>
                            <div class="storyInfoList storyInfoListContent" style="line-height: 25px;text-align: right;width: 50%;float: right;font-size: 13px;">{{ item.createdTime | formatFullDate }}</div>
                            <div style="clear: both;"></div>
                        </div>
                        <div v-if="item.note">
                            <div class="storyInfoList" style="line-height: 25px;font-size: 13px;">{{ item.note }}</div>
                            <div style="clear: both;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="printContent" v-if="showContentList">
                <el-button type="default" @click="printItemsEvt">Print</el-button>
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
              tableData : [],
              historyData : [],
              showContentList : false,
              baseInfo : {
                  currentCreator : '',
                  currentTime : '',
                  currentWarehouse : '',
                  rationingWarehouse : '',
                  applicationId : '',
                  status : ''
              }
          }
      },
      mixins: [{
          created(){
              let params = this.$route.query;
              document.title = 'View Application';

              if (params && (params.type == 'operator' || params.type == 'manage')) {
                  this.showContentList = false
                  this.contentLoading = true

                  this.getOperatorInfo(params);
              } else if (params && params.type == 'warehouse'){
                  this.showContentList = true
                  this.contentLoading = true

                  this.getOperatorInfo(params);
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
          printItemsEvt(){
              let myWindow = window.open('');
              let pElem = '<div style="width: 800px;margin: 0 auto;">' + document.getElementById('printContentList').innerHTML + '</div>';
              myWindow.document.write(pElem);
              myWindow.print();
              myWindow.close();
          },
          getOperatorInfo(data){
              warehouseApi.findInventoryRequieApplication({
                  id : data.id
              }).then(d => {
                  this.contentLoading = false
                  if (d.success == true) {
                      if(d.data){
                          this.baseInfo.currentCreator = d.data.createdUser;
                          this.baseInfo.currentTime = this.formatDate(new Date(d.data.createdTime), true);
                          this.baseInfo.currentWarehouse = d.data.requireWarehouse;
                          this.baseInfo.rationingWarehouse = d.data.relationWarehouse;
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
                  this.contentLoading = false
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
  .blueColor{
      color: #337ab7;
      font-style: normal;
  }
  .fontWeightList{
      font-weight: bold;
      font-size: 14px;
  }
  .warehouseInfo{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      margin-top: 15px;
  }
  .printContent{
      text-align: center;
      margin-top: 25px;
  }
</style>
