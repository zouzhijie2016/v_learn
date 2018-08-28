<template>
  <div class="editDialogBox">
      <el-dialog title="Search Model" :visible.sync="dataCloseVisible" custom-class="editDialog" :close-on-click-modal="false" :close-on-press-escape="false" >
          <el-form :inline="true" :model="dialogForm">
              <el-form-item label="Product">
                  <el-input size="small" v-model.trim="dialogForm.model" style="width: 300px"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" icon="el-icon-search" :loading="dialogForm.searchLoading"  @click="onSearch(1)">Search</el-button>
              </el-form-item>
          </el-form>
          <div class="itemList">{{ orderData.total }} results in total:</div>
          <div v-loading="dialogForm.searchLoading">
              <el-table ref="itemTable" min-height="450" max-height="450" @select="selectEvt" @select-all="selectAllEvt" :data="orderData.list" empty-text="No data.">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column type="index" label="No."></el-table-column>
                  <el-table-column prop="productId" label="Product ID" width="160"></el-table-column>
                  <el-table-column prop="model" label="Model">
                      <template slot-scope="scope">
                          <div v-if="scope.row.productAttributes">{{ scope.row.internalName }} {{ scope.row.productAttributes }}</div>
                          <div v-else>{{ scope.row.internalName }}</div>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="page_box" v-if="orderData.list && orderData.list.length">
                  <el-pagination class="pageInfo"
                      layout="prev, pager, next, jumper"
                      :total="orderData.total"
                      :page-size="orderData.pageSize"
                      :current-page.sync="dialogForm.curpage"
                      @current-change="onSearchList">
                  </el-pagination>
                  <div class="itemTotal">Selected <span class="itemNumber">{{ itemNumber }}</span> items</div>
              </div>
              <div style="clear: both;"></div>
          </div>
          <div class="addList">
              <el-button type="primary" icon="el-icon-plus" :loading="addLoading" :disabled="isClick" @click="addToList">Add To List</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
  import Utils from '~utils/index'
  import warehouseApi from '~api/warehouseapi'
  export default {
      props: ['dataVisible'],
      data () {
          return {
              dataCloseVisible: true,
              addLoading : false,
              isClick: true,
              isManual : false,
              itemNumber : 0,
              selectedAllItems : [],
              selectedCurrentItems : [],
              dialogForm: {
                  model: '',
                  searchLoading: false,
                  curpage : 1,
                  pageSize: 10
              },
              orderData: {
                  pageNum: 1,
                  pageSize: 10,
                  list: [],
                  total: 0
              }
          }
      },
      watch: {
          dataCloseVisible () {
              this.$emit('update:dataVisible', this.dataCloseVisible)
          },
          selectedAllItems () {
              if (this.selectedAllItems.length > 0) {
                  this.isClick = false
              } else {
                  this.isClick = true
              }
          }
      },
      mounted(){
          this.onSearch(1);
      },
      methods: {
          selectEvt(data, row){
              if(data.length){
                  if(this.selectedAllItems.length == 0){
                      this.selectedAllItems = this.selectedAllItems.concat(data)
                  }else{
                      let selectedAllItemsData = this.selectedAllItems.map(function (elem) {
                        return elem.productId
                      })
                      for(let k = 0; k < data.length; k++){
                          if(selectedAllItemsData.indexOf(data[k].productId) == -1){
                              this.selectedAllItems.push(data[k])
                          }
                      }
                  }
              }else{
                  for (let j = 0; j < this.selectedAllItems.length; j++) {
                      if (this.selectedAllItems[j].productId == row.productId) {
                          this.selectedAllItems.splice(j, 1)
                          j = j - 1
                      }
                  }
              }

              this.itemNumber = this.selectedAllItems.length;
          },
          selectAllEvt(data){
              if(data.length > 0){
                  if(this.selectedAllItems.length == 0){
                      this.selectedAllItems = this.selectedAllItems.concat(data)
                  }else{
                      let selectedAllItemsData = this.selectedAllItems.map(function (elem) {
                        return elem.productId
                      })
                      for(let k = 0; k < data.length; k++){
                          if(selectedAllItemsData.indexOf(data[k].productId) == -1){
                              this.selectedAllItems.push(data[k])
                          }
                      }
                  }
              }else{
                  let selectedCurItemsData = this.selectedCurrentItems.map(function (elem) {
                    return elem.productId
                  })
                  for (let j = 0; j < this.selectedAllItems.length; j++) {
                      if (selectedCurItemsData.indexOf(this.selectedAllItems[j].productId) != -1) {
                          this.selectedAllItems.splice(j, 1)
                          j = j - 1
                      }
                  }
              }

              this.itemNumber = this.selectedAllItems.length;
          },
          selectedItems(){
              let t = this;
              for(let i = 0; i < t.orderData.list.length; i++){
                  if((t.orderData.list)[i]['selected'] == true){
                      t.$refs.itemTable.toggleRowSelection((t.orderData.list)[i], true);
                  }
              }
          },
          addToList() {
              if (this.selectedAllItems.length > 0) {
                  this.addLoading = true
                  this.$emit('click', this.selectedAllItems)
                  this.$emit('update:dataVisible', false)
              } else {
                  this.$message({
                      showClose: true,
                      message: 'Return items no selected',
                      type: 'error'
                  })
              }
          },
          getParams(data) {
              return {
                  "brandName": "",
                  "brandNameNum": "1",
                  "brandNameStatu": "1",
                  "internalName": data,
                  "internalNameNum": "1",
                  "internalNameStatu": "1",
                  "pageSize": 10,
                  "productId": "",
                  "productIdNum": "1",
                  "productIdStatu": "1",
                  "productTypeId": ""
              }
          },
          onSearchList(){
              if (!this.isManual) {
                  this.onSearch(this.dialogForm.curpage, true)
              } else {
                  this.isManual = false
              }
          },
          onSearch (params, isOnlyList = false) {
              var t = this

              var paramsContent = Object.assign({}, this.getParams(t.dialogForm.model), {
                  pageNum: params || this.dialogForm.curpage,
                  isOnlyList: isOnlyList
              })

              this.dialogForm.searchLoading = true
              this.$getCommonPageListApi(warehouseApi.queryProduct, paramsContent, d => {
                  if (d.data && d.data.list && d.data.list.length) {
                      t.orderData.list.splice(0)
                      t.selectedCurrentItems = d.data.list;

                      let selectedList = t.selectedAllItems.map(function (elem) {
                        return elem.productId
                      })
                      for(let i = 0; i < d.data.list.length; i++){
                          if(selectedList.indexOf((d.data.list)[i].productId) != -1){
                              t.$set((d.data.list)[i], 'selected', true)
                          }
                      }
                      t.orderData.list = t.orderData.list.concat(d.data.list)

                      t.$nextTick(function(){
                          t.selectedItems();
                      });
                  } else {
                      t.orderData.list.splice(0)
                  }
                  if (t.dialogForm.curpage != d.data.pageNum) {
                      t.isManual = true
                      t.dialogForm.curpage = d.data.pageNum
                  }
              }).then((results) => {
                  this.dialogForm.searchLoading = false
                  if (results.length > 1) {
                      if (results[1].success) {
                          t.orderData.total = results[1].data.total
                          t.orderData.pageSize = results[1].data.pageSize
                      } else {
                          t.orderData.total = t.orderData.pageSize * t.dialogForm.curpage
                      }
                  }
              })
          }
      }
  }
</script>
<style>
  .editDialogBox .editDialog {
      width: 800px !important;
  }
</style>
<style scoped>
  .page_box {
      margin: 15px 0;
      float: right;
      margin-right: -5px;
  }
  .addList{
      margin-top: 10px;
      text-align: center;
  }
  .itemList{
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
  }
  .itemNumber{
     color: #e50038;
  }
  .page_box{
      display: inline-block;
      width: 100%;
      height: 32px;
      line-height: 32px;
  }
  .pageInfo{
      float: right;
  }
  .itemTotal{
      float: left;
  }
</style>
