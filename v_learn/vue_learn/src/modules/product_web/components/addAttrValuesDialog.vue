<template>
    <div>
        <el-dialog :title="title" custom-class="editDialog" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="addCategoryDialog">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="Attribute Name">
                        <el-input v-model.trim="form.attributeName"></el-input>
                    </el-form-item>
                </el-form>
                <div class="addCategoryDialog_btns">
                    <el-button v-if="dataParams.currentName == ''" type="success" @click="addAttributeName" :loading="confirmLoading">Confirm</el-button>
                    <el-button v-else type="success" @click="editAttributeName" :loading="confirmLoading">Confirm</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import productApi from '~api/productapi'
export default {
    props: ['dataVisible', 'dataParams'],
    data () {
        return {
            dataCloseVisible: true,
            confirmLoading : false,
            form : {
                attributeName : ''
            },
            title : ''
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    created(){
        if(this.dataParams.currentName){
            this.title = 'Edit Attribute Name'
        }else{
            this.title = 'Add Attribute Name'
        }
        this.form.attributeName = this.dataParams.currentName;
    },
    methods: {
        addAttributeName(){
            let t = this;
            if(this.form.attributeName == ''){
                this.$showErrorMessage('Attribute name cannot be empty!');
                return false;
            }
            if(/(<(.*)>)|(<\/(.*)>)/.test(this.form.attributeName)){
                this.$showErrorMessage('Cannot enter labels or scripts!')
                return false;
            }

            this.confirmLoading = true;
            if(this.dataParams.type == 'child'){
                productApi.newAddProduceFeatur({
                    "description" : this.form.attributeName,
                    "productFeatureTypeId" : this.dataParams.parentId
                }).then(d => {
                    t.confirmLoading = false;
                    if (d.success == true) {
                        if(d.data){
                            this.$emit('createAttrValuesSuccess', Object.assign({}, d.data, {
                                type : this.dataParams.type
                            }));
                            this.dataCloseVisible = false;
                        }
                    } else {
                      t.$showErrorMessage(d.message)
                    }
                }).catch(err => {
                    t.confirmLoading = false;
                    t.$showErrorMessage(err)
                })
            }else if(this.dataParams.type == 'parent'){
                productApi.newCreateProductFeatureType({
                    "description" : this.form.attributeName,
                    "categoryId" : this.dataParams.categoryId
                }).then(d => {
                    t.confirmLoading = false;
                    if (d.success == true) {
                        if(d.data){
                            this.$emit('createAttrSuccess', Object.assign({}, d.data, {
                                type : this.dataParams.type
                            }));
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
        },
        editAttributeName(){
            let t = this;
            if(this.form.attributeName == ''){
                this.$showErrorMessage('Attribute name cannot be empty!');
                return false;
            }
            if(/(<(.*)>)|(<\/(.*)>)/.test(this.form.attributeName)){
                this.$showErrorMessage('Cannot enter labels or scripts!')
                return false;
            }

            this.confirmLoading = true;
            if(this.dataParams.type == 'child'){
                productApi.editProductFeature({
                    "description" : this.form.attributeName,
                    "productFeatureTypeId" : this.dataParams.parentId,
                    "productFeatureId" : this.dataParams.futureId
                }).then(d => {
                    t.confirmLoading = false;
                    if (d.success == true) {
                        if(d.data){
                            this.$emit('editAttrValuesSuccess', Object.assign({}, d.data, {
                                type : this.dataParams.type
                            }));
                            this.dataCloseVisible = false;
                        }
                    } else {
                      t.$showErrorMessage(d.message)
                    }
                }).catch(err => {
                    t.confirmLoading = false;
                    t.$showErrorMessage(err)
                })
            }else if(this.dataParams.type == 'parent'){
                productApi.editProductFeatureType({
                    "productFeatureTypeName" : this.form.attributeName,
                    "productFeatureTypeID" : this.dataParams.parentId
                }).then(d => {
                    t.confirmLoading = false;
                    if (d.success == true) {
                        if(d.data){
                            this.$emit('editAttrSuccess', Object.assign({}, d.data, {
                                type : this.dataParams.type
                            }));
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
