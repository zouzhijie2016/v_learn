<template>
  <div>
    <left-menu :urlPermiss.sync="urlPermissData"></left-menu>
    <div class="center_main">
        <div class="main_content" v-loading="allLogLoading" element-loading-text="Loading...">
            <div class="list_desc clearfix">
                <div><span class="desc_bold">Time&nbsp;&nbsp;:&nbsp;&nbsp;</span><span class="desc_time">{{results.time}}</span></div>
                <div><span class="desc_bold">Warehouse&nbsp;&nbsp;:&nbsp;&nbsp;</span><span class="desc_warehouse">{{results.facilityName}}</span></div>
                <div><span class="desc_bold">Product Type&nbsp;&nbsp;:&nbsp;&nbsp;</span><span class="desc_type">{{results.type}}</span></div>
                <div><span class="desc_bold">Target Model&nbsp;&nbsp;:&nbsp;&nbsp;</span><span class="desc_desciption">{{results.description}}</span></div>
                <div><span class="desc_bold">Operator&nbsp;&nbsp;:&nbsp;&nbsp;</span><span class="desc_operator">{{results.operator}}</span></div>
            </div>
            <div class="list_check">
                <div class="list_check_tit">
                    Input of Checking
                </div>
                <div class="list_check_results" v-if="productType == 'IMEI'">
                    <el-row>
                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                        <el-col :span="2"><div class="list_group">NO.</div></el-col>
                        <el-col :span="5"><div class="list_group">IMEI</div></el-col>
                    </el-row>
                    <el-row v-for="(item,index) in imeiCheckList" :key="index" v-if="(index+1) % 3 == 0">
                        <el-col :span="2"><div class="list_group">{{index-1}}</div></el-col>
                        <el-col :span="5"><div class="list_group">{{imeiCheckList[index-2].imeiOrEan}}</div></el-col>
                        <el-col :span="2"><div class="list_group">{{index-0}}</div></el-col>
                        <el-col :span="5"><div class="list_group">{{imeiCheckList[index-1].imeiOrEan}}</div></el-col>
                        <el-col :span="2"><div class="list_group">{{index+1}}</div></el-col>
                        <el-col :span="5"><div class="list_group">{{imeiCheckList[index-0].imeiOrEan}}</div></el-col>
                    </el-row>
                </div>
                <div class="list_check_results clearfix" v-else="productType == 'EAN'">
                    <div class="ean_list_title clearfix">
                        <div class="operate_ean_group">
                            <div class="ean_list_div ean_group_num"><span>NO.</span></div>
                            <div class="ean_list_div ean_group_product"><span>Product</span></div>
                            <div class="ean_list_div ean_group_quantity"><span>Quantity</span></div>
                        </div>
                        <div class="operate_ean_group">
                            <div class="ean_list_div ean_group_num"><span>NO.</span></div>
                            <div class="ean_list_div ean_group_product"><span>Product</span></div>
                            <div class="ean_list_div ean_group_quantity"><span>Quantity</span></div>
                        </div>
                        <div class="operate_ean_group">
                            <div class="ean_list_div ean_group_num"><span>NO.</span></div>
                            <div class="ean_list_div ean_group_product"><span>Product</span></div>
                            <div class="ean_list_div ean_group_quantity"><span>Quantity</span></div>
                        </div>
                    </div>
                    <div class="ean_list_group" v-for="(value,index) in eanCheckList" :key="index" >
                        <div v-if="(index+1) % 3 == 0">
                            <div  class="operate_ean_group">
                                <div class="ean_list_div ean_group_num"><span>{{index-1}}</span></div>
                                <div class="ean_list_div ean_group_product"><span>{{eanCheckList[index-2].imeiOrEan}}</span></div>
                                <div class="ean_list_div ean_group_quantity"><span>{{eanCheckList[index-2].quantity}}</span></div>
                            </div>
                            <div  class="operate_ean_group">
                                <div class="ean_list_div ean_group_num"><span>{{index-0}}</span></div>
                                <div class="ean_list_div ean_group_product"><span>{{eanCheckList[index-1].imeiOrEan}}</span></div>
                                <div class="ean_list_div ean_group_quantity"><span>{{eanCheckList[index-1].quantity}}</span></div>
                            </div>
                            <div  class="operate_ean_group">
                                <div class="ean_list_div ean_group_num"><span>{{index+1}}</span></div>
                                <div class="ean_list_div ean_group_product"><span>{{eanCheckList[index-0].imeiOrEan}}</span></div>
                                <div class="ean_list_div ean_group_quantity"><span>{{eanCheckList[index-0].quantity}}</span></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="list_box">
                <div class="list_box_tit">
                    <span>Result of Checking</span>
                </div>
                <div class="results_nums clearfix">
                    <div class="results_nums_group"><span>Total input:</span>&nbsp;&nbsp;<span style="color:#1fbcd2">{{results.total}}</span></div>
                    <div class="results_nums_group"><span>Match:</span>&nbsp;&nbsp;<span style="color:#4DCB73">{{results.match}}</span></div>
                    <div class="results_nums_group"><span>Inventory profit:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{results.inventoryProfit}}</span></div>
                    <div class="results_nums_group"><span>Inventory loss:</span>&nbsp;&nbsp;<span style="color:#F2637B">{{results.inventoryLoss}}</span></div>
                    <div class="results_nums_export"><el-button type="primary" :loading="exportLogDetailoading"  @click="exportStockLogList">export</el-button></div>
                </div>
                <el-table :data="ImeiStockLogDetailData" border style="width: 100%;" class="list_table" v-if="productType == 'IMEI'" empty-text="Well done,the checked products perfectly match with those in the system.">
                    <el-table-column type="index" label="NO." class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="imeiOrEan" label="IMEI" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="description" label="Product Description" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="reason" label="Reason" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="status" label="status" class-name="list_table_column" align="center"></el-table-column>
                </el-table>
                <el-table :data="EanStockLogDetailData" border style="width: 100%;" class="list_table" v-if="productType == 'EAN'" empty-text="Well done,the checked products perfectly match with those in the system.">
                    <el-table-column type="index" label="NO." class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="imeiOrEan" label="Product ID" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="description" label="Description" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="inventoryQuantity" label="Inventory quantity" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="difQuantity" label="Dif quantity" class-name="list_table_column" align="center"></el-table-column>
                    <el-table-column prop="reason" label="Reason" class-name="list_table_column" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import leftMenu from '~warehouse-common/comp/leftmenu.vue'
import checkStockApi from '~api/warehouse/checkStockApi'
import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
import {download} from '~utils/custom/downloadHelper'
import Utils from '~utils/index'
export default{
    data () {
        return {
	        exportLogDetailoading: false,
	        allLogLoading: false,
            oPara: {name: '', value: ''},
            urlPermissData: '/warehouse_web/index.html#/stockLogDetail',
	        stockId: '',
	        productType: '',
	        results: {time: '',facilityName: '',type: '',description: '',operator: '',total: '',match: '',inventoryProfit: '',inventoryLoss: ''},
	        imeiCheckList: [],
	        eanCheckList: [],
	        EanStockLogDetailData: [],
	        ImeiStockLogDetailData: [],
        }
    },
    components: {
        leftMenu
    },
    mixins: [myInventoryMixin],
    mounted () {
        this.setOptions(this.$route.params)
        if (this.oPara.name != 'stockId') {
            return false
        }
        let reg = new RegExp('^([a-zA-Z0-9])+$')
        if (!reg.test(this.oPara.value)) {
            this.$showErrorMessage('The parameter has an illegal character!')
            return false
        }
        var stockId = this.oPara.value
        localStorage.setItem('stockId', stockId)
        this.stockId = stockId || localStorage.getItem('stockId')
        this.getLogDetailDatas()
    },
    methods: {
        setOptions (val) {
            var _self = this
            val = val.sParams
            if (val && val.indexOf(':') > -1) {
                val.replace(/(\w+)\s*:\s*([\w-]+)/g, function (a, b, c) {
                    b && (_self.oPara.name = b) && (_self.oPara.value = c)
                })
            }
        },
	    exportStockLogList(){
        	this.exportLogDetailoading = true;
		    checkStockApi.exportStockData(this.getExportParams(), {
			    progress: (progressEvent) => {}
		    }).then(res => {
			    this.exportLogDetailoading = false;
			    download(res.data, res.headers['x-filename'] || 'TakeStock.csv')
		    }).catch(err => {
			    this.exportLogDetailoading = false;
			    this.$showErrorMessage(err)
		    })
        },
	    getLogDetailDatas () {
            var _this = this;
		    _this.ImeiStockLogDetailData.splice(0);
		    _this.imeiCheckList.splice(0);
		    _this.EanStockLogDetailData.splice(0);
		    _this.eanCheckList.splice(0);
		    _this.allLogLoading = true;
		    checkStockApi.getStockLogDetailById(this.stockId).then(d => {
                if (d.success) {
                    if (d.data) {
	                    if(d.data.takeStockVo){
		                    _this.results.time = Utils.getServerDateStrByLocal(d.data.takeStockVo.createTime, 'dd/MM/yyyy hh:mm:ss');
		                    _this.results.facilityName = d.data.takeStockVo.facilityName;
		                    _this.productType = d.data.takeStockVo.isIMEI == 'Y' ? 'IMEI' : 'EAN';
		                    _this.results.type = d.data.takeStockVo.isIMEI == 'Y' ? 'IMEI' : 'EAN';
		                    _this.results.description = d.data.takeStockVo.description;
		                    _this.results.operator = d.data.takeStockVo.operator;
		                    _this.results.total = d.data.takeStockVo.totalInputQuantity;
		                    _this.results.match = d.data.takeStockVo.matchQuantity;
		                    _this.results.inventoryProfit = d.data.takeStockVo.inventoryProfitQuantity;
		                    _this.results.inventoryLoss = d.data.takeStockVo.inventoryLossQuantity;
	                    }
                		if(d.data.takeStockCategoryRos){
			                if(_this.productType == 'IMEI'){
			                	if(d.data.takeStockDetailRos){
					                _this.ImeiStockLogDetailData = _this.ImeiStockLogDetailData.concat(d.data.takeStockDetailRos)
                                }
				                _this.imeiCheckList = _this.imeiCheckList.concat(d.data.takeStockCategoryRos);
				                let len = _this.imeiCheckList.length;
				                if(len%3 != 0){
					                for(let i=0;i <3-(len%3);i++){
						                _this.imeiCheckList.push({imeiOrEan:'',takeStockId:''});
					                }
				                }
			                }else{
			                	if(d.data.takeStockDetailRos){
					                _this.EanStockLogDetailData = _this.EanStockLogDetailData.concat(d.data.takeStockDetailRos);
                                }
				                _this.eanCheckList = _this.eanCheckList.concat(d.data.takeStockCategoryRos);
				                let len = _this.eanCheckList.length;
				                if(len%3 != 0){
					                for(let i=0;i <3-(len%3);i++) {
						                _this.eanCheckList.push({imeiOrEan: '', takeStockId: '', quantity: ''});
					                }
				                }
			                }
                        }

                    }
                } else {
	                _this.$showErrorMessage(d)
                }
			    _this.allLogLoading = false;
            }).catch(e => {
			    _this.allLogLoading = false;
                _this.$showErrorMessage(e)
            })
        },
	    getExportParams(){
		    return {
			    takeStockId : this.stockId,
			    isImei : this.productType == 'IMEI' ? 'Y' : 'N'
		    }
	    },

    }
}
</script>
<style>
  .list_table .list_table_column > div {
    padding-right: 5px;
    padding-left: 5px;
  }
</style>
<style scoped>
  .center_main {
    overflow-y: auto;
    zoom: 1;
    width: 100%;
    transition: margin-right 0.3s ease-in-out;
    padding-left: 188px;
    min-height: 300px;
    padding-bottom: 80px;
  }
  .main_content{
      background-color: #fff;
      padding: 10px 24px 24px;
  }
  .list_group{
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-top:1px #dbdbdb solid;
      border-left:1px #dbdbdb solid;
      font-size:12px;
  }
  .list_check_results .el-col:nth-of-type(6n+0) .list_group{
      border-right:1px #dbdbdb solid;
  }
  .list_check_results .el-row:nth-last-of-type(1) .list_group{
      border-bottom: 1px #dbdbdb solid;
  }

  .ean_list_title{
      border-top: 1px solid #dbdbdb;
  }
  .operate_ean_group{
      position: relative;
      float: left;
      font-size: 12px;
      border-bottom: 1px solid #dbdbdb;
  }
  .operate_ean_group>div{
      float: left;
      height: 32px;
      border-right: 1px solid #dbdbdb;
      text-align: center;
  }
  .ean_group_num{
      width: 50px;
  }
  .ean_group_product{
      width: 200px;
  }
  .ean_group_quantity{
      width: 97px;
  }
  .operate_ean_group>div>span{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .operate_ean_group:nth-of-type(3n+1){
      border-left: 1px solid rgb(238, 238, 238);
  }
  .list_desc>div{
      float: left;
      margin-right: 30px;
      line-height: 35px;
  }
  .desc_bold{
      font-weight: bold;
      line-height: 35px;
  }

  .list_box,.list_check {
    margin-bottom: 10px;
  }
  .list_box .list_box_tit,.list_check .list_check_tit{
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .results_nums{
      width: 720px;
      margin-left: 314px;
      margin-bottom:10px;
  }
  .results_nums_group{
      float:left;
      margin-right: 10px;
  }
  .results_nums_export{
      float:right;
  }

  .list_table {
    font-size: 12px;
  }

  .page_box {
    text-align: right;
    margin-top: 10px;
  }
</style>
