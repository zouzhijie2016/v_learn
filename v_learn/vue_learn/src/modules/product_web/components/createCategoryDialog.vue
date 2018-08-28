<template>
  <div>
    <el-dialog title="Create A New Category" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false"   custom-class="createDialog">
     <div class="new_category">
         <el-form ref="form" label-width="120px" class="new_category_form">
           <el-form-item label="Category Level">
             <el-select size="small" v-model="categoryLevel" class="new_category_text" @change="selectLevel" placeholder="Please select...">
               <el-option v-for="item in categoryLevelOptions" :key="item.id" :label="item.levelName"
                          :value="item.id"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label=" New Category">
             <el-input v-model="categoryName"  class="new_category_text"></el-input>
           </el-form-item>
           <el-form-item label="Parent Category"  v-show="isShowParentCategory">
             <el-select size="small" v-model="parentCategoryId"  class="new_category_text" @change="selectParent" placeholder="Please select...">
               <el-option v-for="item in parentCategoryList" :key="item.categoryId" :label="item.categoryName"
                          :value="item.categoryId"></el-option>
             </el-select>
             <el-select size="small" v-model="secondCategory" v-show="isShowSecondCategory"  class="new_category_text" placeholder="Please select...">
               <el-option v-for="item in secondCategoryOpions" :key="item.categoryId" :label="item.categoryName"
                          :value="item.categoryId"></el-option>
             </el-select>
           </el-form-item>
         </el-form>
       <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmToCreate">Confirm to Create</el-button>
          <el-button @click="cancel">Cancel</el-button>
        </span>
     </div>
    </el-dialog>
  </div>
</template>
<script>
import productApi from '~api/productapi'
import Utils from '~utils/index'
export default {
    props: ['createDataVisible', 'parentCategoryList'],
    data () {
        return {
            dataCloseVisible: true,
            isShowParentCategory: false,
            isShowSecondCategory: false,
            categoryName: '',
            categoryLevel: '',
            parentCategoryId: '',
            secondCategory: '',
            categoryLevelOptions: [
                {id: 1, levelName: 'First-Level'}, {id: 2, levelName: 'Second-Level'}, {id: 3, levelName: 'Third-Level'}
            ],
            secondCategoryOpions: []
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:createDataVisible', this.dataCloseVisible)
        }
    },
    mounted () {
        console.dir(this.parentCategoryList)
    },
    methods: {
        selectLevel () {
            switch (this.categoryLevel) {
                case 1:
                    this.isShowParentCategory = false
                    this.isShowSecondCategory = false
                    break
                case 2:
                    this.isShowParentCategory = true
                    this.parentCategoryId = ''
                    this.isShowSecondCategory = false
                    break
                case 3:
                    this.isShowParentCategory = true
                    this.parentCategoryId = ''
                    this.isShowSecondCategory = true
                    break
            }
        },
        selectParent () {
            var _self = this
            if (_self.isShowSecondCategory) {
                var second = _self.parentCategoryList.filter(function (item) {
                    return item.categoryId === _self.parentCategoryId
                })
                if (second[0]) {
                    _self.secondCategoryOpions = second[0].children ? second[0].children : []
                }
            }
        },
        cancel () {
            this.$emit('update:createDataVisible', false)
        },
        confirmToCreate () {
            var parentId = ''
            if (!this.categoryLevel) {
                this.showErroMessage('Category level Can not empty！')
                return
            }
            if (!this.categoryName.trim()) {
                this.showErroMessage('Category name Can not empty！')
                return
            }
            if (this.secondCategory) {
                parentId = this.secondCategory
            } else {
                parentId = this.parentCategoryId
            }
            if (this.categoryLevel > 1 && !parentId) {
                this.showErroMessage('Parent Category Can not empty！')
                return
            }
            var createTime = Utils.getServerTimestampByServerDate(new Date())
            var obj = {categoryLevel: this.categoryLevel, createTime: createTime, categoryName: this.categoryName.trim(), parentCategoryId: parentId}
            productApi.createProductCategory(obj).then(d => {
                if (d.success) {
                    this.$message({
                        message: 'create success',
                        type: 'success'
                    })
                    this.$emit('update:createDataVisible', false)
                    this.$emit('refreshList')
                } else {
                    this.showErroMessage(d.message)
                }
            }).catch(e => {
                this.showErroMessage(e)
            })
        },
        showErroMessage (err) {
            this.$showErrorMessage(err)
        }
    }
}
</script>
<style>
  .createDialog {
    width: 600px !important;
  }
</style>
<style scoped>
  .new_category_form{
    margin-bottom:10px;
  }
  .new_category_text{
    width:200px;
  }
</style>
