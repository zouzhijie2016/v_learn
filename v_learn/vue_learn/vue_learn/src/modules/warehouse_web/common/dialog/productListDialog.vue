<template>
  <div>
    <el-dialog title="Find Product" custom-class="editDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :inline="true" :model="dialogForm" class="dialog_form">
        <el-form-item label="Product Id" class="dialog_label">
          <el-select class="match_select" size="small" v-model="dialogForm.productIdNum">
            <el-option v-for="item in matchTypeOptions" :key="item.productIdStatu" :label="item.productStatu"
                       :value="item.productIdStatu"></el-option>
          </el-select>
          <input type="text" class="match_input" v-model="dialogForm.productId"/>
          <el-checkbox v-model="productIdStatuType" size="small" class="dialog_checkbox"
                       @change="changeStatus('productIdStatu',productIdStatuType)">Ignore Case
          </el-checkbox>
        </el-form-item>
        <el-form-item label="Brand Name" class="dialog_label">
          <el-select class="match_select" size="small" v-model="dialogForm.brandNameNum">
            <el-option v-for="item in matchTypeOptions" :key="item.productIdStatu" :label="item.productStatu"
                       :value="item.productIdStatu"></el-option>
          </el-select>
          <input type="text" class="match_input" v-model="dialogForm.brandName"/>
          <el-checkbox v-model="brandNameStatuType" size="small" class="dialog_checkbox"
                       @change="changeStatus('brandNameStatu',brandNameStatuType)">Ignore Case
          </el-checkbox>
        </el-form-item>
        <el-form-item label="Model" class="dialog_label">
          <el-select class="match_select" size="small" v-model="dialogForm.internalNameNum">
            <el-option v-for="item in matchTypeOptions" :key="item.productIdStatu" :label="item.productStatu"
                       :value="item.productIdStatu"></el-option>
          </el-select>
          <input type="text" class="match_input" v-model="dialogForm.internalName"/>
          <el-checkbox v-model="internalNameStatuType" size="small" class="dialog_checkbox"
                       @change="changeStatus('internalNameStatu',internalNameStatuType)">Ignore Case
          </el-checkbox>
        </el-form-item>
        <el-form-item label="Product Type" class="dialog_label">
          <el-select size="small" v-model="dialogForm.productTypeId">
            <el-option v-for="item in productTypeOptions" :key="item.productTypeId" :label="item.productTypeName"
                       :value="item.productTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="dialogForm.searchLoading" @click="onSubmit(1)" size="small" icon="el-icon-search">Search
          </el-button>
        </el-form-item>
      </el-form>
      <div v-loading="dialogForm.searchLoading" element-loading-text="Loading...">
        <el-table class="gridDataTable" min-height="450" max-height="450" :data="productData.list"
                  :default-sort="{prop: 'productId', order: 'descending'}" style="font-size: 12px;cursor:pointer;"
                  empty-text="No order data.">
          <el-table-column sortable label="Product ID" width="160">
            <template slot-scope="props">
              <a @click="selectProductIdTo(props.row.productId)">{{props.row.productId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="description" sortable label="Description" width="200" class-name="tab_break"></el-table-column>
          <el-table-column prop="productType" sortable label="Product Type"></el-table-column>
        </el-table>
        <div class="page_box" v-if="productData.list && productData.list.length">
          <el-pagination
            layout="prev, pager, next, jumper"
            :total="productData.total"
            :page-size="productData.pageSize"
            :current-page.sync="productData.pageNum"
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
    props: ['dataVisible', 'dataProductId'],
    data () {
        return {
            dataCloseVisible: true,
            productIdStatuType: true,
            brandNameStatuType: true,
            internalNameStatuType: true,
            matchTypeOptions: [
                {productIdStatu: '1', productStatu: 'Contain'},
                {productIdStatu: '2', productStatu: 'Beginning'},
                {productIdStatu: '3', productStatu: 'Equal'}
            ],
            productTypeOptions: [],
            dialogForm: {
                searchLoading: false,
                productIdNum: '1',
                productId: '',
                productIdStatu: '1',
                brandNameNum: '1',
                brandName: '',
                brandNameStatu: '1',
                internalNameNum: '1',
                internalName: '',
                internalNameStatu: '1',
                productTypeId: ''
            },
            productData: {
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
    mounted () {
        inventoryItemApi.getProductTypeList().then(d => {
            if (d.success) {
                var items = d.data.map(function (item) {
                    var obj = {}
                    obj.productTypeId = item
                    obj.productTypeName = item
                    return obj
                })
                this.productTypeOptions = items
                this.dialogForm.productTypeId = 'FINISHED_GOOD'
            }
        })
        this.onSubmit()
    },
    methods: {
        onSubmit (num) {
            if (num) {
                this.productData.pageNum = num
            }
            this.dialogForm.searchLoading = true
            inventoryItemApi.getProductList({
                productIdNum: this.dialogForm.productIdNum,
                productId: this.dialogForm.productId,
                productIdStatu: this.dialogForm.productIdStatu,
                brandNameNum: this.dialogForm.brandNameNum,
                brandName: this.dialogForm.brandName,
                brandNameStatu: this.dialogForm.brandNameStatu,
                internalNameNum: this.dialogForm.internalNameNum,
                internalName: this.dialogForm.internalName,
                internalNameStatu: this.dialogForm.internalNameStatu,
                productTypeId: this.dialogForm.productTypeId,
                pageNum: this.productData.pageNum,
                pageSize: this.productData.pageSize
            }).then(d => {
                this.dialogForm.searchLoading = false
                if (d.success) {
                    if (d.data && d.data.list) {
                        d.data.list.map(function (item) {
                            item.description = item.brandName + ' | ' + item.internalName + ' | ' + item.productAttributes
                        })
                    }
                    this.productData = d.data
                } else {
                    this.showErroMessage(d.message, 'Service exceptions！')
                }
            }).catch(e => {
                this.dialogForm.searchLoading = false
                this.showErroMessage(e.message, 'Service exceptions！')
            })
        },
        changeStatus (type, val) {
            var _self = this
            _self.dialogForm[type] = val ? '1' : '0'
        },
        selectProductIdTo (productId) {
            this.$emit('update:dataProductId', productId)
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
  .dialog_checkbox > span {
    font-size: 12px;
  }
  .dialog_label {
    margin-bottom: 10px;
  }
  .dialog_label > label {
    width: 100px;
    font-size: 12px;
    text-align: right;
  }
  .gridDataTable .tab_break>div{
    word-break: break-word;
  }
</style>
<style scoped>
  .match_select {
    width: 100px;
    display: inline-block;
  }
  .match_input {
    display: inline-block;
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
