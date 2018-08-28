<template>
  <div>
    <el-dialog title="Find Product"  custom-class="editDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false" >
      <el-form :inline="true" :model="dialogForm" class="dialog_form">
        <el-form-item label="Lot Id" class="dialog_label">
          <el-input v-model="dialogForm.lotId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="dialogForm.searchLoading"  @click="onSubmit(1)" size="small" icon="el-icon-search">Search</el-button>
        </el-form-item>
      </el-form>
      <div v-loading="dialogForm.searchLoading" element-loading-text="Loading...">
        <el-table class="gridDataTable" min-height="450" max-height="450" :data="lotData.list" :default-sort = "{prop: 'lotId', order: 'descending'}"   style="font-size: 12px;cursor:pointer;"  empty-text="No order data.">
          <el-table-column sortable label="Lot ID" width="160">
            <template slot-scope="props">
              <a @click="selectLotIdTo(props.row.lotId)">{{props.row.lotId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" sortable label="Created Date" width="200"></el-table-column>
          <el-table-column prop="expireDate" sortable label="Expire Date"></el-table-column>
        </el-table>
        <div class="page_box" v-if="lotData.list && lotData.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="lotData.total"
            :page-size="lotData.pageSize"
            :current-page.sync="lotData.pageNum"
            @current-change="onSubmit">
          </el-pagination>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import inventoryItemApi from '~api/warehouse/findInventoryItemApi'
export default {
    props: ['dataVisible', 'dataLotId'],
    data () {
        return {
            dataCloseVisible: true,
            dialogForm: {searchLoading: false, lotId: ''},
            lotData: {
                pageNum: 1,
                pageSize: 10,
                pages: 1,
                list: [],
                total: 0,
                size: 0
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    beforeCreate () {
    },
    mounted () {
        this.onSubmit()
    },
    methods: {
        onSubmit (num) {
            if (num) {
                this.dialogForm.pageNum = num
            }
            this.dialogForm.searchLoading = true
            inventoryItemApi.getLotList({
                lotId: this.dialogForm.lotId,
                pageNum: this.lotData.pageNum,
                pageSize: this.lotData.pageSize
            }).then(d => {
                this.dialogForm.searchLoading = false
                if (d.success) {
                    this.lotData = d.data
                } else {
                    this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(e => {
                this.dialogForm.searchLoading = false
                this.showErroMessage(e.message, 'Service exceptions！')
            })
        },
        selectLotIdTo (lotId) {
            this.$emit('update:dataLotId', lotId)
            this.$emit('update:dataVisible', false)
        },
        showErroMessage (msg, type) {
            this.$message({
                showClose: true,
                message: msg || type,
                type: 'error'
            })
        }
    }
}
</script>
<style>
  .dialog_checkbox>span{
    font-size:12px;
  }
  .dialog_label{
    margin-bottom:10px;
  }
  .dialog_label>label{
    width:100px;
    font-size:12px;
    text-align: right;
  }
</style>
<style scoped>
  .match_select{
    width:100px;
    display:inline-block;
  }
  .match_input{
    display:inline-block;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid rgb(191, 211, 217);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: rgb(31, 54, 61);
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }
  .page_box{
    text-align:right;
    margin-top:10px;
  }
</style>
