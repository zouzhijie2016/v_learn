<template>
    <div>
        <el-dialog title="Add Category" custom-class="editDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="addCategoryDialog">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="Category Name">
                        <el-input v-model.trim="form.categoryName"></el-input>
                    </el-form-item>
                </el-form>
                <div class="addCategoryDialog_btns">
                    <el-button type="success" @click="addCategory" :loading="confirmLoading">Confirm</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import productApi from '~api/productapi'
export default {
    props: ['dataVisible', 'parentCategoryId', 'sequenceNum', 'type'],
    data () {
        return {
            dataCloseVisible: true,
            confirmLoading : false,
            form : {
                categoryName : ''
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    methods: {
        addCategory(){
            let t = this;
            if(this.form.categoryName == ''){
                this.$showErrorMessage('Category name cannot be empty!');
                return false;
            }
            if(/(<(.*)>)|(<\/(.*)>)/.test(this.form.categoryName)){
                this.$showErrorMessage('Cannot enter labels or scripts!')
                return false;
            }

            this.confirmLoading = true;
            productApi.createClassfication({
                "categoryName": this.form.categoryName,
                "parentCategoryId": this.parentCategoryId,
                "sequenceNum": this.sequenceNum
            }).then(d => {
                t.confirmLoading = false;
                if (d.success == true) {
                    if(d.data){
                        this.$emit('createProductSuccess', {
                            categoryId : d.data.newCategoryId,
                            categoryName : (d.data.categoryJSONArr)[0].categoryName,
                            sequenceNum : (d.data.categoryJSONArr)[0].sequenceNum,
                            type : this.type
                        });

                        this.dataCloseVisible = false;
                    }
                } else {
                    t.$showErrorMessage(d.message)
                }
            }).catch(err => {
                t.confirmLoading = false;
                t.$showErrorMessage(err)
            })
        }
    }
}
</script>
<style>
  .editDialog {
    width: 450px !important;
  }
</style>
<style scoped>
    .addCategoryDialog_btns{
        text-align: center;
        margin-top: 20px;
    }
</style>
