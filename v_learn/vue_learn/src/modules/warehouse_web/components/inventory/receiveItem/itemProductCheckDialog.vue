<template>
  <div>
    <el-dialog title="Message" custom-class="productCheckDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <div>
            <div class="product_check" v-loading="checkLoading">
                <template v-if="identify == 'check' && (!allResultProduct.falseResult || allResultProduct.falseResult && allResultProduct.falseResult.length == 0)">
                    <div><span class="product_check_suc">Successfully Extracted:</span><span class="product_check_blue">{{allResultProduct.successProductQTY}}</span>&nbsp;&nbsp;products with <span class="product_check_model">{{allResultProduct.successModelQTY}}</span> models</div>
                </template>
                <template v-if="identify == 'check' && allResultProduct.falseResult.length > 0">
                    <div class="product_check_group">
                        <div><span class="product_check_suc">Successfully Extracted :</span></div>
                        <div><span class="product_check_blue">{{allResultProduct.successProductQTY}}</span>&nbsp;&nbsp;products with <span class="product_check_model">{{allResultProduct.successModelQTY}}</span> models</div>
                    </div>
                    <div class="product_check_group">
                        <div><span class="product_check_fail">Failed Extracted :</span></div>
                        <div><span>{{allResultProduct.falseProductQTY}}</span>&nbsp;&nbsp;products with <span class="product_check_model">{{allResultProduct.falseModelQTY}}</span> models</div>
                    </div>
                    <div class="product_check_content">
                        <div class="content_group" v-for="item in allResultProduct.falseResult" :key="item.number">
                            <span class="content_text">Product ID:<span class="product_check_blue">{{item.productId}}</span></span>
                            <span class="content_text">Model:<span class="product_check_blue">{{item.description}}</span></span>
                            <template v-if="item.imei"><span class="content_text">IMEI:<span class="product_check_blue">{{item.imei}}</span></span></template>
                            <span class="content_text">Quantity:<span class="product_check_blue">{{item.qty ? item.qty : 'null'}}</span></span>
                            <div><span class="content_text">Reason:<span class="product_check_red">{{item.falseReason}}</span></span></div>
                        </div>
                    </div>
                    <p class="product_check_tips">Please check the failed product ID/Model in the file</p>
                </template>
                <template v-if="identify == 'receive' && (!dataReceiveResult.falseResult || (dataReceiveResult.falseResult && dataReceiveResult.falseResult.length == 0))">
                    <div><span class="product_check_suc">Successfully Received : </span><span class="product_check_blue"> {{dataReceiveResult.successIMEIQTY}} </span>IMEI ; <span class="product_check_model">{{dataReceiveResult.successNonIMEIQTY}}</span> Non-Serialized</div>
                </template>
                <template v-if="identify == 'receive' && dataReceiveResult.falseResult && dataReceiveResult.falseResult.length > 0">
                    <div v-if="dataReceiveResult.successIMEIQTY != 0  || dataReceiveResult.successNonIMEIQTY != 0">
                        <span class="product_check_suc">Successfully Received : </span>
                        <template v-if="dataReceiveResult.successIMEIQTY != 0">
                            <span class="product_check_blue"> {{dataReceiveResult.successIMEIQTY}} </span>IMEI ;
                        </template>
                        <template v-if="dataReceiveResult.successNonIMEIQTY != 0">
                            <span class="product_check_model">{{dataReceiveResult.successNonIMEIQTY}}</span> Non-Serialized
                        </template>
                    </div>
                    <div class="product_check_group">
                        <span class="product_check_fail">Failed Received : </span>
                        <span class="product_check_blue"> {{dataReceiveResult.falseIMEIQTY}} </span>IMEI ; </div>
                    <div class="product_check_content">
                        <div class="content_group" v-for="(item,index) in dataReceiveResult.falseResult" :key="index">
                            <span class="content_text">{{index+1}}&nbsp;.&nbsp;IMEI:<span class="product_check_blue">{{item.imei}}</span></span>
                            <span class="content_text">Model:<span class="product_check_blue">{{item.productId}}&nbsp;&nbsp;{{item.description}}</span></span>
                            <div><span class="content_text">Reason:<span class="product_check_red">{{item.falseReason}}</span></span></div>
                        </div>
                    </div>
                </template>
                <div slot="footer" v-if="identify == 'check'" class="dialog-footer" style="text-align: center">
                    <el-button type="primary" @click="closeCheckProduct">OK</el-button>
                </div>
                <div slot="footer" v-if="identify == 'receive'" class="dialog-footer" style="text-align: center">
                    <el-button type="primary" @click="closeReceiveProduct">OK</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
    import Utils from '~utils/index'
    import receiveItemApi from '~api/warehouse/receiveItemApi'
    import _ from 'lodash'
    export default {
        props: ['dataVisible', 'dataProducts','successProduct','filterProductMethod','identify','dataReceiveResult','refreshReceive'],
        data () {
            return {
                dataCloseVisible: true,
                checkLoading: false,
                successProducts: {},
                allResultProduct: {
                    successProductQTY: '',
                    successModelQTY: '',
                    falseProductQTY: '',
                    falseModelQTY: '',
                    falseResult: [],
                    mergeList: []
                }
            }
        },
        mounted () {
            if (this.identify == 'check') {
                this.init();
            }
        },
        watch: {
            dataCloseVisible () {
                this.$emit('update:dataVisible', this.dataCloseVisible)
            }
        },
        methods:{
            init(){
                var _self = this;
                _self.checkProductLists();
            },
            checkProductLists(){//校验（product和description之间的校验）
            var _self = this;
                let products = _self.dataProducts.map(function(e){
                    let obj = {};
                    obj.number = parseInt(e.number, 10);
                    obj.productId = e.productid ? (e.productid).trim() : '';
                    obj.description = e.model ? (e.model).trim() : '';
                    obj.imei = e.imei ? (e.imei).trim() : '';
                    obj.quantityStr = e.quantity ? (e.quantity).trim() : '';

                    return obj;
                })
                _self.checkLoading = true;
                receiveItemApi.checkReceiveProduct(JSON.stringify(products)).then(d=>{
                    _self.checkLoading = false;
                    if(d.success){
                        if(d.data){
                            _self.envelopedDatas(d.data);
                        }
                    }else{
                        _self.dataCloseVisible = false
                        _self.$showErrorMessage(d.message)
                    }
                }).catch(e=>{
                    _self.checkLoading = false;
                    _self.$showErrorMessage(e.message)
                })
            },
            envelopedDatas(data){//product和description以及IMEI的校验，错误结果封装、过滤错误数据
                let _self = this;
                let indexSrc = 0;

                if(data.successImeiList && data.successImeiList.length){
                    let objCommon = {};
                    data.successImeiList.forEach(item => {
                        if(!objCommon[item.productId]){
                            objCommon[item.productId] = item
                        }else{
                            objCommon[item.productId].imei = objCommon[item.productId].imei + ',' + item.imei
                            objCommon[item.productId].quantityLong += 1;
                        }
                    })
                    for (let key in objCommon){
                        indexSrc ++;
                        _self.allResultProduct.mergeList.push(objCommon[key]);
                    }
                }

                for (let key in data.successNonImeiMap) {
                    indexSrc++;
                    _self.allResultProduct.mergeList.push(data.successNonImeiMap[key]);
                }

                _self.allResultProduct.falseResult = data.falseResult ? data.falseResult : [];
                _self.allResultProduct.falseProductQTY  = data.falseProductQTY;
                _self.allResultProduct.falseModelQTY = data.falseModelQTY;
                _self.allResultProduct.successModelQTY = indexSrc;
                _self.allResultProduct.successProductQTY = data.successProductQTY;
            },
            closeCheckProduct(){//关闭
                let _self = this;

                _self.successProduct.successProductQTY = _self.allResultProduct.successProductQTY;
                _self.successProduct.successModelQTY = _self.allResultProduct.successModelQTY;
                _self.$emit('update:successProducts', _self.allResultProduct.mergeList);
                _self.$emit('filterProductMethod', _self.allResultProduct.mergeList);
                _self.dataCloseVisible = false;
            },
            closeReceiveProduct(){
                this.$emit('refreshReceive')
                this.dataCloseVisible = false;
            }
        }
    }
</script>
<style>
  .productCheckDialog {
    width: 750px;
  }

</style>
<style scoped>
    .product_check{
        padding-left:20px;
        padding-right:20px;
    }
    .product_check_group,.product_check_content{
        margin-bottom:20px;
    }
    .product_check_tips{
        margin-bottom:30px;
    }
    .product_check_blue{
        word-break:break-word;
        color:#1fbcd2;
    }
    .product_check_red{
        color:red;
    }
    .product_check_model{
        color:#409eff;
    }
    .product_check_suc{
        color:#008000;
        font-size:14px;
    }
    .product_check_fail{
        color:red;
        font-size:14px;
    }
    .content_text{
        margin-right:10px;
    }
    .dialog-footer{
        margin-top: 15px;
    }
</style>
