<template>
    <div>
        <div class="item_upload">
            <div class="item_upload_file">
                <el-row>
                    <el-col :span="2" class="upload_file_label">
                        <label class="upload_file_text">Choose File</label>
                    </el-col>
                    <el-col :span="8">
                        <input type="file" ref="fileVal" @change="getUploadFile" class="file_hide" style="display:none"/>
                        <div class="file_input"><input class="file_input_text" v-model="itemFileName" @input="setUploadFile"/><i @click="uploadFile" class="el-icon-upload2"></i></div>
                    </el-col>
                    <el-col :span="3" :offset="1"><el-button type="primary" @click="extractFile">Extract</el-button></el-col>
                </el-row>
            </div>
            <div class="item_upload_result" v-if="resultList.length>0">
                <div class="upload_result_total">
                    Total : <span style="color:#409eff">{{successProducts.successModelQTY ? successProducts.successModelQTY : ''}}</span>&nbsp;&nbsp;models,<span style="color:#409eff"> {{successProducts.successProductQTY ? successProducts.successProductQTY : ''}}</span>&nbsp;&nbsp;products
                </div>
                <div class="upload_result_content" v-loading="receiveLoading" element-loading-text="Loading">
                    <div v-for="(result,index) in resultList" :key="index">
                        <div v-bind:class="[ 'upload-result_group' , { 'actived' : result.isActived } ]" v-on:mouseenter.stop="enterProductGroup(result,index)" v-on:mouseleave.stop="leaveProductGroup(result,index)">
                            <div class="group_close" v-show="result.isActived"><i class="el-icon-close" @click="openDelProductDialog(index)"></i></div>
                            <el-row>
                                <el-col :span="6" :offset="0.5">
                                    <div class="group_name">Product</div>
                                    <el-input v-if="result.description" v-model="result.productId+' '+result.description" :disabled="true"></el-input>
                                    <el-input v-else v-model="result.productId" :disabled="true"></el-input>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <div class="group_name">Type</div>
                                    <el-input v-model="result.type" :disabled="true"></el-input>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <div class="group_name">Quantity</div>
                                    <el-input-number  v-model="result.quantityLong" @change="changeNumberList" v-number.undigit :min="minNumber" :disabled="result.type == 'IMEI'"></el-input-number>
                                </el-col>
                            </el-row>
                            <div v-if="result.type == 'IMEI' && result.imeiLists.length > 0">
                                <div class="group_name">IMEI</div>
                                <div class="group_tags">
                                    <div class="group_tags_list" :loading="showImeiLoading">
                                        <template v-if="result.imeiLists.length < 10"><el-tag v-for="(imei,no) in result.imeiLists" :key="imei" closable @close="delImei(index,no)">{{imei}}</el-tag></template>
                                        <template v-else><el-tag v-for="(imei,no) in result.imeiLists" v-if="result.isShowImei || no <= 10"  :key="imei" closable @close="delImei(index,no)">{{imei}}</el-tag><span v-if="!result.isShowImei" style="margin-left: 15px">......</span></template>
                                        <div v-show="result.imeiLists.length > 10" class="imei_close">
                                            <span class="el-icon-arrow-up" v-if="result.isShowImei" @click="showAllImei(result)"></span>
                                            <span class="el-icon-arrow-down" v-else @click="showAllImei(result)"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="group_num">
                                <span class="group_num_trangle"></span>
                                <span class="group_num_text">{{index+1}}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="item_upload-receive" v-if="resultList.length>0">
                <el-button type="primary" :loading="receiveLoading" @click="receiveItemProducts">Receive</el-button>
            </div>
        </div>
        <el-dialog title="Message" :visible.sync="delDialogVisible" custom-class="productDelDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <div>Are you sure to remove this model of product from the list?</div>
            <div style="margin-bottom:10px;">Note: Once removed,you cannot add it back this time.</div>
            <div>Model: <span style="color:#1fbcd2">{{removeProduct.productId}}&nbsp;&nbsp;{{removeProduct.description}}</span></div>
            <div>Quantity: <span style="color:#1fbcd2">{{removeProduct.quantity}}</span></div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="delProduct(removeProduct.index)">Remove</el-button>
                <el-button @click="delDialogVisible = false">Cancel</el-button>
            </div>
        </el-dialog>
        <item-product-check-dialog v-if="productCheckDialogVisible" :identify.sync="identify"
                                   :dataVisible.sync="productCheckDialogVisible"
                                   :dataProducts.sync="beforeResultLists"
                                   :successProduct.sync="successProducts"
                                   v-on:filterProductMethod="filterProduct"
                                   :dataReceiveResult.sync="receiveResults"
                                   v-on:refreshReceive="refreshReceive">
        </item-product-check-dialog>
    </div>
</template>
<script>
	import Utils from '~utils/index'
	import _ from 'lodash'
	import Papa from 'papaparse'
	import itemProductCheckDialog from '~warehouse-components/inventory/receiveItem/itemProductCheckDialog.vue'
	import receiveItemApi from '~api/warehouse/receiveItemApi'
	export default {
		data(){
			return {
				itemFileName:'',
				itemFile:null,
				identify:'',
				totalNum:3,
				totalProduct:40,
				successProducts:{},
				receiveLoading:false,
                resultObj:[],
                //resultObj:['number','productId','description','imei','warehouse','quantity','unitPrice','adjustments','subtotal'],
				resultList:[],
                beforeResultLists:[],
				receiveResults:{},
				productCheckDialogVisible:false,
				delDialogVisible:false,
				removeProduct:{},
				showImeiLoading:false,
        minNumber : 1
			}
		},
		components: {
			itemProductCheckDialog
		},
		methods:{
			changeNumberList(){
				let t = this;
				t.$nextTick(function () {
					let totalQuantity = 0;
					t.resultList.forEach(item => {
						totalQuantity += item.quantityLong;
					})
					t.successProducts.successProductQTY = totalQuantity;
				});
			},
			getProductModel(product,model){
				return product+model;
            },
			uploadFile(){
                this.$refs.fileVal.click();
            },
			setUploadFile(){
				if(this.itemFileName == ''){
					this.itemFile = null;
				}
            },
			refreshReceive(){
				location.reload();
            },
			showAllImei(result){
				this.showImeiLoading = true;
				result.isShowImei = !result.isShowImei;
				this.showImeiLoading = false;
            },
			getUploadFile(){
				let reg = new RegExp('.csv$');
				if(!this.$refs.fileVal.value){
				    return false;
                }
				if(!reg.test(this.$refs.fileVal.value)){
					this.$showErrorMessage('You can only upload CSV files.');
					return false;
                }
				let index = this.$refs.fileVal.value.lastIndexOf('\\');
				let val = this.$refs.fileVal.value.substring(index + 1, this.$refs.fileVal.value .length);
				this.itemFile = this.$refs.fileVal.files[0];
				this.itemFileName = val;
            },
			filterProduct(products){
				var _self = this;
				_self.resultList = products.filter(function(e){
                if(!e.imei){
                    e['type'] = 'Non-Serialized'
                    e['inventoryItemTypeId'] = 'NON_SERIAL_INV_ITEM';
                }else{
                    e['inventoryItemTypeId'] = 'SERIALIZED_INV_ITEM';
                    e['imeiLists'] = (e.imei).split(',');
                    e['type'] = 'IMEI';
                }
                e['isActived'] = false;
                e['isShowImei'] = false;
                        return true;
                })
            },
			enterProductGroup(result,index){
				var _self = this;
				result.isActived = true;
				this.$set(_self.resultList,index,result)
            },
			leaveProductGroup(result,index){
				var _self = this;
				result.isActived = false;
				this.$set(_self.resultList,index,result)
			},
			openDelProductDialog(index){
				this.removeProduct.productId = this.resultList[index].productId;
				this.removeProduct.description = this.resultList[index].description;
				this.removeProduct.quantity = this.resultList[index].quantityLong;
				this.removeProduct.index = index;
				this.delDialogVisible = true;
            },
            delProduct(index){
                let deleteProductArr = this.resultList[index];
                this.successProducts.successProductQTY = this.successProducts.successProductQTY - deleteProductArr.quantityLong;
                this.successProducts.successModelQTY -= 1;
                this.resultList.splice(index,1);
                this.delDialogVisible = false;
            },
			delImei(pIndex,cIndex){
				if(this.resultList[pIndex].imeiLists.length == 1){
					this.removeProduct.productId = this.resultList[pIndex].productId;
					this.removeProduct.description = this.resultList[pIndex].description;
					this.removeProduct.quantity = this.resultList[pIndex].quantityLong;
					this.removeProduct.index = pIndex;
					this.delDialogVisible = true;
					return false;
                }
				let resultListArr = this.resultList[pIndex]
				resultListArr.imeiLists.splice(cIndex,1);

				this.resultList[pIndex] = resultListArr;
				this.successProducts.successProductQTY -= 1;
				this.resultList[pIndex].quantityLong -= 1;

				if(this.resultList[pIndex].imeiLists.length == 0){
					this.successProducts.successModelQTY -= 1;
					this.resultList.splice(pIndex, 1)
				}
            },
			extractFile(){
				var _self = this;
				_self.beforeResultLists.splice(0)
				if(!_self.itemFile){
					this.$showErrorMessage('Please choose a file to upload.');
					return false
				}
				Papa.parse(_self.itemFile, {
					download: true,
					complete: function(results){
						console.dir(results)
						results.data.forEach(function(item,key){
                            let objContent = {};
                            if(key == 5 && item.length >= 8 && (item[0].trim() != '') && item[0].trim() != '?'){
                                _self.resultObj.splice(0)
                                item.forEach((itemList, index) => {
                                    if(index == 0){
                                        _self.resultObj.push('number');
                                    }else{
                                        _self.resultObj.push((itemList.toLowerCase()).split(' ').join(''))
                                    }
                                })
                            }
                            if(key > 5 && item.length >= 8 && (item[0].trim() != '') && item[0].trim() != '?'){
	                            _self.resultObj.forEach(function(itemVal,no){
                                  if(item[no].indexOf('?') > -1){
                                      item[no] = item[no].slice(item[no].indexOf('?') + 1)
                                  }
		                              item[no].trim() != '' ? objContent[_self.resultObj[no]] = item[no] : '';
                                })
	                            _self.beforeResultLists.push(objContent)
                            }
						})
						_self.identify = 'check';
						_self.productCheckDialogVisible = true;
					}
				})
            },
			receiveItemProducts(){
            	var _self = this;
            	let paramesList = [];
				_self.resultList.forEach(function(e){
					let obj ={};
					if(e.type == 'IMEI'){
						let imeis = e.imeiLists.join(',');
						obj.imei = imeis;
                    }
					paramesList.push(Object.assign({}, obj ,{
					    productId: e.productId,
              description: e.description,
              quantityStr: (e.quantityLong).toString(),
              type: e.inventoryItemTypeId
					}));
                })
				_self.receiveLoading = true;
				receiveItemApi.receiveInventoryProduct(JSON.stringify(paramesList)).then(d=>{
					_self.receiveLoading = false;
					if(!d.success){
						_self.$showErrorMessage(d);
						return;
                    }
                    if(d.data){
	                    _self.receiveResults = d.data;
		                _self.identify = 'receive';
	                    _self.productCheckDialogVisible = true;
                    }
                }).catch(e=>{
					_self.receiveLoading = false;
					_self.$showErrorMessage(e)
                })

            }


		}
	}
</script>
<style>
    .productDelDialog{
        width:500px;
    }
</style>
<style scoped>
    .item_upload{
        padding:10px 20px;
    }
    .upload_file_text{
        line-height:30px;
    }
    .file_input{
        position:relative;
        height:30px;
        line-height:30px;
        border:1px solid #dcdfe6;
        border-radius: 4px;
    }
    .file_input .file_input_text{
        padding-left:10px;
        height:24px;
        width:100%;
        border:none;
    }
    .file_input .el-icon-upload2{
        position:absolute;
        right:10px;
        font-size:18px;
        line-height:30px;
        cursor: pointer;
    }
    .upload_file_label{
        text-align: center;
    }
    .item_upload_file{
        margin-bottom:10px;
    }
    .upload_result_total{
        line-height:30px;
        font-size:14px;
    }
    .upload-result_group{
        position:relative;
        padding:10px 20px 20px;
        border:1px solid #dbdbdb;
        border-radius: 4px;
        margin-bottom:10px;
    }
    .group_name{
        line-height:30px;
    }
    .group_tags{
        width:955px;
        border:1px solid #dbdbdb;
        padding:10px 20px;
    }
    .group_close{
        width:20px;
        height:20px;
        position:absolute;
        right:5px;
        top:5px;
        color:#1FBCD2;
    }
    .group_close .el-icon-close{
        font-size:18px;
        cursor: pointer;
    }
    .group_tags .el-tag{
        margin-left:5px;
        margin-bottom:5px;
    }
    .group_num_trangle{
        display: inline-block;
        position: absolute;
        right: -4px;
        bottom: -16px;
        cursor: pointer;
        font-size: 0;
        line-height: 0;
        border-width: 30px;
        border-color: #1FBCD2;
        border-right-width: 0;
        border-style: dashed;
        border-left-style: solid;
        border-top-color: transparent;
        border-bottom-color: transparent;
        transform: rotate(45deg);
    }
    .group_num_text{
        display: inline-block;
        position: absolute;
        right: 3px;
        bottom: 5px;
        color: #fff;
    }
    .upload_result_content .actived{
        border:1px solid #1FBCD2;
    }
    .group_tags_list{
        width:770px;
        margin:0 auto;
    }
    .imei_close{
        width:18px;
        height:15px;
        margin:0 auto;
    }
    .imei_close .el-icon-arrow-up,
    .imei_close .el-icon-arrow-down{
        font-size:18px;
        cursor: pointer;
    }
</style>
