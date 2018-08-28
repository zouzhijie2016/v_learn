<template>
  <div>
    <div id="daily_statistics">
      <div class="statistics_search">
        <el-row>
          <el-col :span="4">
            <div class="search_time" style="position:relative">
              <div v-loading="allLoading" element-loading-spinner="el-icon-loading" style="overflow: hidden">
                <a v-bind:class="[ 'search_time_span' , { 'selected' : isTodaySelected } ]" href="javascript:void(0)"
                   @click="showByDate('today')">Today</a>
                <a v-bind:class="[ 'search_time_span' , {'selected' : isYesterdaySelected }]" href="javascript:void(0)"
                   @click="showByDate('yesterday')">Yesterday</a>
              </div>
            </div>
          </el-col>
          <el-col :span="6" :offset="14">
            <div class="search_store">
              <label>Store</label>
              <el-select v-model="search.store" @change="!initStore && setInitDatas()" v-loading="allLoading" element-loading-spinner="el-icon-loading">
                <el-option v-for="item in storeListOptions" :key="item.storeId" :value="item.storeId"
                           :label="item.storeName"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <div class="statistics_datas" v-loading="datasLoading">
          <el-row>
            <el-col :span="5">
              <el-card class="box-card">
                <div class="card_desc">
                  <div class="card_title"><span>Sales of <span class="card_time">{{currentTime}}</span></span><span><i
                    class="el-icon-info"></i></span></div>
                  <div class="card_total"><span
                    class="card_total_data">{{singleSalesData.saleMoney ? singleSalesData.saleMoney : '----'}}</span><span>{{unitName}}</span></div>
                  <hr class="statistics_hr"/>
                  <div class="card_month">
                    <span>Monthly</span><span>{{singleSalesData.monthlySaleMoney}} {{unitName}}</span></div>
                  <div class="card_average">
                    <span>Average</span><span>{{singleSalesData.saleMoneyAverage ? singleSalesData.saleMoneyAverage : '----'}} {{unitName}}/day</span></div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-card class="box-card">
                <div class="card_desc">
                  <div class="card_title"><span>Sales Volume of <span
                    class="card_time">{{currentTime}}</span></span><span><i class="el-icon-info"></i></span>
                  </div>
                  <div class="card_total"><span
                    class="card_total_data">{{singleSalesData.saleVolumes ? singleSalesData.saleVolumes : '----'}}</span><span>pcs</span></div>
                  <hr class="statistics_hr"/>
                  <div class="card_month"><span>Monthly</span><span>{{singleSalesData.monthlySaleVolumes}} pcs</span>
                  </div>
                  <div class="card_average">
                    <span>Average</span><span>{{singleSalesData.saleVolumesAverage ? singleSalesData.saleVolumesAverage : '----'}} pcs/day</span></div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-card class="box-card">
                <div class="card_desc">
                  <div class="card_title"><span>Order Count of <span
                    class="card_time">{{currentTime}}</span></span><span><i class="el-icon-info"></i></span>
                  </div>
                  <div class="card_total"><span class="card_total_data">{{singleSalesData.orderCount ? singleSalesData.orderCount : '----'}}</span><span>orders</span>
                  </div>
                  <hr class="statistics_hr"/>
                  <div class="card_month">
                    <span>Monthly</span><span>{{singleSalesData.monthlyOrderCount}} orders</span></div>
                  <div class="card_average">
                    <span>Average</span><span>{{singleSalesData.orderCountAverage ? singleSalesData.orderCountAverage : '----'}} orders/day</span></div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="5" :offset="1">
              <el-card class="box-card">
                <div class="card_desc">
                  <div class="card_title"><span>Stock until <span
                    class="card_time">{{currentTime}}</span></span><span><i class="el-icon-info"></i></span>
                  </div>
                  <div class="card_total"><span
                    class="card_total_data">{{singleSalesData.stockCount ? singleSalesData.stockCount : '----'}}</span><span>pcs</span></div>
                  <hr class="statistics_hr"/>
                  <div class="card_month" v-show="singleSalesData.firstCategoryName">
                      <span>{{singleSalesData.firstCategoryName}}</span>
                      <span>{{singleSalesData.firstCategoryStockRate}},{{singleSalesData.firstCategoryStockCount}}pcs</span>
                  </div>
                  <div class="card_average" v-show="singleSalesData.secondCategoryName">
                      <span>{{singleSalesData.secondCategoryName}}</span>
                      <span>{{singleSalesData.secondCategoryStockRate}},{{singleSalesData.secondCategoryStockCount}}pcs</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="statistics_tips"><i class="el-icon-info"></i>&nbsp;&nbsp;
          1.The monthly data is the accumulation data from the 1st to yesterday.
          2.The Average data equals to the monthly data divided by days count from 1st to yesterday
        </div>
        <div class="statistics_extrude">
          <el-row>
            <el-col :span="11">
              <span class="extrude_title">Top5 Best Selling of&nbsp;&nbsp;</span><span class="extrude_time">{{currentTime}}</span>
              <hr class="statistics_hr"/>
            </el-col>
            <el-col :span="11" :offset="2">
              <span class="extrude_title">Proportion of sales&nbsp;&nbsp;</span><span class="extrude_time">{{currentTime}}</span>
              <hr class="statistics_hr"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-table :data="top5BestSellData" style="width: 100%;" v-loading="top5BestLoading"
                        class="best_table">
                <el-table-column type="index" label="No."></el-table-column>
                <el-table-column label="Model" class-name="tab_break">
                  <template slot-scope="scope">
                    <div style="color:#3ea2ff;">{{scope.row.model}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="saleVolumes" label="Sales Volume" align="center" class-name="tab_break"></el-table-column>
                <el-table-column prop="saleMoney" label="Sales" class-name="tab_break"></el-table-column>
                <el-table-column prop="stockCount" label="Current Stock" align="center" class-name="tab_break"></el-table-column>
              </el-table>
            </el-col>
            <el-col :span="11" :offset="2" v-loading="proportionLoading">
              <el-row>
                  <el-col :span="10">
                    <div id="bestSell"></div>
                  </el-col>
                  <el-col :span="14" class="best_group_col">
                    <div class="best_group"   v-if="proportionSalesInfo && proportionSalesInfo.length>0">
                      <div class="best_group_desc" v-for="(item,index) in proportionSalesInfo"><span
                        class="best_group_desc_icon"
                        v-bind:style="{backgroundColor: setColorByIndex(index)}"></span><span>{{item.categoryName}}  </span><span
                        class="group_desc_veg">| {{item.saleRate}}</span> <span class="best_group_desc_ugx">{{unitName}} {{item.saleMoney}}</span>
                      </div>
                    </div>
                    <div class="proportion_nodata" v-if="proportionSalesInfo.length == 0">no sales for this period</div>
                  </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <hr class="statistics_hr"/>
        <div class="statistics_trend" style="position:relative">
            <div id="salesTrend" v-loading="saleTrendLoading"></div>
            <div v-show="yAxisValue.length == 0 || seriesValue.length == 0 || xAxisValue.length == 0" class="sales_trend_no">
                <div style="line-height: 30px;font-weight:bold;">Sales Trend</div>
                <div style="text-align: center;line-height: 470px">no sales  in the last 30 days</div>
            </div>
        </div>
        <div class="statistics_store">
          <el-row>
            <el-col :span="24">
              <div class="store_title">
                <div class="store_title_salesperson"><span class="store_title_bold">Salesperson Ranking</span>&nbsp;&nbsp;<span
                  class="store_title_time">of {{intervalTime}}</span></div>
              </div>
              <hr class="statistics_hr"/>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="8">
              <div style="overflow: hidden">
                <div class="store_control">
                  <a v-bind:class="[ 'store_control_span' , { 'selected' : isSalesSelected } ]" href="javascript:void(0)" @click="setInitStoreRankDatas('Sales')">Sales</a>
                  <a v-bind:class="[ 'store_control_span' , { 'selected' : isVolumeSelected } ]" href="javascript:void(0)" @click="setInitStoreRankDatas('Volume')">Volume</a>
                </div>
                <div class="store_rank" v-loading="storeRankLoading">
                  <ul>
                    <li v-for="(item,index) in storeRankList">
                      <div class="store_rank_group">
                        <div v-bind:class="[ 'rank_group' , { 'active' : index < 3 } ]" ><span class="rank_group_bg"></span><span
                          class="rank_group_num">{{index+1}}</span></div>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.storeName}}</span></div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-col> -->
            <el-col v-loading="salesPersonRankLoading">
              <el-row >
                <el-col :span="5">
                  <div id="personRank"></div>
                </el-col>
                <el-col :span="7" class="best_group_col">
                  <div class="best_group"   v-if="salesPersonRankInfo && salesPersonRankInfo.length>0">
                    <div class="best_group_desc" v-for="(item,index) in salesPersonRankInfo"><span
                      class="best_group_desc_icon" v-bind:style="{backgroundColor: setColorByIndex(index)}"></span><span>{{item.salesName}}  </span><span class="group_desc_veg">| {{item.salesRate}},{{item.saleCount}},{{unitName}} {{item.saleMoney}}</span>
                    </div>
                  </div>
                  <div class="proportion_nodata" v-if="salesPersonRankInfo.length == 0">no sales for this period</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import Utils from '~utils/index'
import statisticsApi from '~api/statisticsApi'
export default {
    data () {
        return {
            search: {store: ''},
            allLoading: true,
            datasLoading: false,
            proportionLoading: false,
            top5BestLoading: false,
            saleTrendLoading: false,
            storeRankLoading: false,
            salesPersonRankLoading: false,
            isTodaySelected: true,
            isYesterdaySelected: false,
            isSalesSelected: true,
            isVolumeSelected: false,
            type: '',
            startTime: '',
            endTime: '',
            currentTime: '',
            intervalTime: '',
            unitName: '',
            storeListOptions: [],
            singleSalesData: {
                saleMoney: '',
                monthlySaleMoney: '',
                saleMoneyAverage: '',
                saleVolumes: '',
                monthlySaleVolumes: '',
                saleVolumesAverage: '',
                orderCount: '',
                monthlyOrderCount: '',
                orderCountAverage: '',
                stockCount: '',
                firstCategoryName: '',
                firstCategoryStockCount: '',
                firstCategoryStockRate: '',
                secondCategoryName: '',
                secondCategoryStockCount: '',
                secondCategoryStockRate: ''
            },
            top5BestSellData: [],
            proportionSalesInfo: [],
            storeRankList: [],
            salesPersonRankInfo: [],
            yAxisValue: [],
            seriesValue: [],
            xAxisValue: [],
            initStore: false,
	        bestSellChart: null,
	        salesTrendChart: null,
	        personRankChart: null,
        }
    },
    created () {
        document.title = 'Report Management | Daily Statistics | OCMS-BIM'
        var _self = this
        statisticsApi.queryStoreByGroup().then(d => {
            if (d.success && d.data) {
                _self.storeListOptions = d.data
                _self.search.store = _self.storeListOptions && _self.storeListOptions[0].storeId
                _self.initStore = true
                _self.unitName = _self.storeListOptions[0].defaultCurrencyUom;
	            _self.bestSellChart = echarts.init(document.getElementById('bestSell'));
	            _self.salesTrendChart = echarts.init(document.getElementById('salesTrend'));
	            _self.personRankChart = echarts.init(document.getElementById('personRank'))
                _self.showByDate('today', false)
            }
        })
    },
    methods: {
        showByDate (type, isInitCall = true) {
            var _self = this
            let isTrue = _self.packStartAndEndTime(type, isInitCall)
            if (!isTrue) {
                return false
            }
            _self.type = type;
            this.setInitDatas()
        },
        setInitDatas () {
            var _self = this;
	        let selectStore = _self.storeListOptions.filter(function(e){
	        	return e.storeId == _self.search.store;
            })
            if(selectStore && selectStore.length > 0){
            	_self.unitName = selectStore[0].defaultCurrencyUom;
            }
            _self.allLoading = true
            var showDatasByTimePromise = new Promise(function (resolve) {
                _self.showDatasByTime(function (data) {
                    resolve(data)
                })
            })
            var setInitProportionOfSaleChartsPromise = new Promise(function (resolve) {
                _self.setInitProportionOfSaleCharts(function (data) {
                    resolve(data)
                })
            })
            var setInitTop5BestDatasPromise = new Promise(function (resolve) {
                _self.setInitTop5BestDatas(function (data) {
                    resolve(data)
                })
            })
            var setInitSaleTrendInfoChartsPromise = new Promise(function (resolve) {
                _self.setInitSaleTrendInfoCharts(function (data) {
                    resolve(data)
                })
            })
            // var setInitStoreRankDatasPromise = new Promise(function (resolve) {
            //     _self.setInitStoreRankDatas('Sales', false, function (data) {
            //         resolve(data)
            //     })
            // })
            var setInitSalespersonRankChartsPromise = new Promise(function (resolve) {
                _self.setInitSalespersonRankCharts(function (data) {
                    resolve(data)
                })
            })
            Promise.all([showDatasByTimePromise, setInitProportionOfSaleChartsPromise, setInitTop5BestDatasPromise, setInitSaleTrendInfoChartsPromise,
                setInitSalespersonRankChartsPromise]).then(function (arr) {
                _self.allLoading = false
                _self.initStore = false
            }, function (err) {
                _self.allLoading = false
                _self.initStore = false
            })
        },
        setInitProportionOfSaleCharts (cb) {
            var _self = this
            _self.proportionLoading = true
            statisticsApi.queryProportionOfSale(_self.setParames()).then(d => {
                typeof cb === 'function' && cb.apply(_self, arguments)
	            _self.bestSellChart.clear();
                if (d.success) {
                	if(d.data){
		                _self.proportionSalesInfo && _self.proportionSalesInfo.splice(0)
		                _self.proportionSalesInfo = d.data.categorySaleRateList || []
		                let chartsData = []
		                _self.proportionSalesInfo && _self.proportionSalesInfo.forEach(function (item, index) {
			                let sale = item.saleMoney
			                chartsData.push({
				                value: sale,
				                name: item.categoryName,
				                itemStyle: {normal: {color: _self.setColorByIndex(index)}}
			                })
			                item.saleMoney = _self.setMoney(sale)
		                })
		                if (_self.proportionSalesInfo.length == 0) {
			                _self.proportionLoading = false
			                return false
		                }
		                _self.bestSellChart.setOption({
			                tooltip: {
				                trigger: 'item',
				                show: false,
				                alwaysShowContent: true,

				                backgroundColor: 'transparent',
				                textStyle: {
					                color: '#333'
				                }
			                },
			                series: [
				                {
					                name: '',
					                type: 'pie',
					                radius: ['40%', '55%'],
					                avoidLabelOverlap: false,
					                label: {
						                normal: {
							                show: true,
							                formatter: function () {
								                let totalMoney = d.data.totalSaleMoney
								                let unitName = _self.unitName
								                totalMoney = totalMoney.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
								                return 'Sales\r\n' + totalMoney + '\r\n' + unitName
							                },
							                fontFamily: 'Microsoft YaHei',
							                position: 'center',
							                textStyle: {
								                fontSize: 12,
								                color: '#939393'
							                }
						                }
					                },
					                data: chartsData
				                }
			                ]
		                }, true)
                    }
                }else{
	                _self.$showErrorMessage(d)
                }
                _self.proportionLoading = false
            }).catch(e => {
	            _self.bestSellChart.clear();
                _self.proportionLoading = false
                _self.$showErrorMessage(e)
                typeof cb === 'function' && cb.apply(_self, arguments)
            })
        },
        setInitTop5BestDatas (cb) {
            var _self = this
            _self.top5BestLoading = true
	        let params = Object.assign({}, this.setParames(), {
		        type: this.type
	        })
            statisticsApi.queryTop5BestSelling(params).then(d => {
                typeof cb === 'function' && cb.apply(_self, arguments)
	            _self.top5BestSellData.splice(0);
                if (d.success) {
                	if(d.data){
		                _self.top5BestSellData = d.data
		                _self.top5BestSellData && _self.top5BestSellData.forEach(function (item) {
			                item.saleMoney = _self.setMoney(item.saleMoney)
		                })
                    }
                }else{
	                _self.$showErrorMessage(d)
                }
                _self.top5BestLoading = false
            }).catch(e => {
	            _self.top5BestSellData.splice(0);
                _self.top5BestLoading = false
                _self.$showErrorMessage(e)
                typeof cb === 'function' && cb.apply(_self, arguments)
            })
        },
        setInitSaleTrendInfoCharts (cb) {
            var _self = this
            _self.saleTrendLoading = true
            statisticsApi.querySaleTrendInfo(_self.setParames()).then(d => {
                typeof cb === 'function' && cb.apply(_self, arguments)
	            _self.salesTrendChart.clear();
                if (d.success) {
                	if(d.data){
		                _self.yAxisValue && _self.yAxisValue.splice(0)
                        _self.xAxisValue && _self.xAxisValue.splice(0)
		                d.data.titleName && d.data.titleName.forEach(function (item, index) {
			                let obj = _self.setTrendData(index, 'yAxis')
			                obj.name = item
			                if (index > 1) {
				                obj.offset = 80
			                }
			                _self.yAxisValue.push(obj)
			            })
		                d.data.dates ? _self.xAxisValue = _self.xAxisValue.concat(d.data.dates) : '';
		                _self.seriesValue && _self.seriesValue.splice(0)
		                d.data.lineChartDataList && d.data.lineChartDataList.forEach(function (item, index) {
			                let obj = _self.setTrendData(index, 'series')
			                obj.name = item.titleName
			                obj.data = item.value
			                if (index > 0) {
				                obj.yAxisIndex = index
			                }
			                _self.seriesValue.push(obj)
		                })
		                if (_self.yAxisValue.length == 0 || _self.seriesValue.length == 0 || !d.data.dates) {
			               _self.saleTrendLoading = false
			                return false
		                }
		                _self.salesTrendChart.setOption({
			                title: {
				                show: true,
				                text: 'Sales Trend',
				                formatter: '',
				                textStyle: {
					                fontSize: '14',
					                lineHeight: 55
				                }
			                },
			                tooltip: {
				                trigger: 'axis'
			                },
			                legend: {
				                data: d.data.titleName
			                },
			                grid: {
				                left: '10%',
				                right: '10%'
			                },
			                calculable: true,
			                xAxis: [
				                {
					                axisLabel: {
						                interval:0,
						                rotate:40
					                },
					                axisLine: {
						                lineStyle: {
							                color: '#CECECE'
						                }
					                },
					                type: 'category',
					                boundaryGap: false,
					                data: d.data.dates ? d.data.dates : []
				                }
			                ],
			                yAxis: _self.yAxisValue,
			                series: _self.seriesValue
		                })
                    }
                }else{
	                _self.$showErrorMessage(d)
                }
                _self.saleTrendLoading = false
            }).catch(e => {
	            _self.salesTrendChart.clear();
                _self.saleTrendLoading = false
                _self.$showErrorMessage(e)
                typeof cb === 'function' && cb.apply(_self, arguments)
            })
        },
        setInitStoreRankDatas (type, isInitSale = true, cb) {
            var _self = this
            if (type == 'Sales') {
                if (_self.isSalesSelected && isInitSale) {
                    return
                }
                _self.isSalesSelected = true
                _self.isVolumeSelected = false
            }
            if (type == 'Volume') {
                if (_self.isVolumeSelected && isInitSale) {
                    return
                }
                _self.isSalesSelected = false
                _self.isVolumeSelected = true
            }
            var paramsContent = Object.assign({}, this.setParames(), {
                type: type
            })
            _self.storeRankLoading = true
            statisticsApi.queryStoreRank(paramsContent).then(d => {
                typeof cb === 'function' && cb.apply(_self, arguments)
	            _self.storeRankList.splice(0);
                if (d.success) {
	                if(d.data){
		                _self.storeRankList = d.data;
                    }
                }else{
	                _self.$showErrorMessage(d)
                }
                _self.storeRankLoading = false
            }).catch(e => {
	            _self.storeRankList.splice(0);
                _self.storeRankLoading = false
                _self.$showErrorMessage(e)
                typeof cb === 'function' && cb.apply(_self, arguments)
            })
        },
        setInitSalespersonRankCharts (cb) {
            var _self = this
            _self.salesPersonRankLoading = true

            statisticsApi.querySalespersonRank(_self.setParames()).then(d => {
                typeof cb === 'function' && cb.apply(_self, arguments)
	            _self.salesPersonRankInfo.splice(0);
	            _self.personRankChart.clear()
                if (d.success) {
                	if(d.data && d.data.salespersonInfoList){
		                _self.salesPersonRankInfo.splice(0);
		                _self.salesPersonRankInfo = d.data.salespersonInfoList;
		                let chartsData = []
		                _self.salesPersonRankInfo && _self.salesPersonRankInfo.forEach(function (item, index) {
			                let saleCount = item.saleCount
			                chartsData.push({
				                value: saleCount,
				                name: item.salesName,
				                itemStyle: {normal: {color: _self.setColorByIndex(index)}}
			                })
			                item.saleMoney = _self.setMoney(item.saleMoney)
		                })
		                if (!_self.salesPersonRankInfo.length) {
			                _self.salesPersonRankLoading = false
			                return false
		                }
		                _self.personRankChart.setOption({
			                tooltip: {
				                trigger: 'item',
				                show: false,
				                alwaysShowContent: true,
				                backgroundColor: 'transparent',
				                textStyle: {
					                color: '#333'
				                }
			                },
			                series: [
				                {
					                name: '',
					                type: 'pie',
					                radius: ['40%', '55%'],
					                avoidLabelOverlap: false,
					                label: {
						                normal: {
							                show: true,
							                formatter: function () {
								                let totalOrder = d.data.orderCount
								                return 'Total\r\n' + totalOrder + '\r\norders'
							                },
							                fontFamily: 'Microsoft YaHei',
							                position: 'center',
							                textStyle: {
								                fontSize: 12,
								                color: '#939393'
							                }
						                }
					                },
					                data: chartsData
				                }
			                ]
		                })
                    }
                }else{
	                _self.$showErrorMessage(d)
                }
                _self.salesPersonRankLoading = false
            }).catch(e => {
	            _self.salesPersonRankInfo.splice(0);
	            _self.personRankChart.clear();
                _self.salesPersonRankLoading = false
                _self.$showErrorMessage(e)
                typeof cb === 'function' && cb.apply(_self, arguments)
            })
        },
        showDatasByTime (cb) {
            this.datasLoading = true;
	        let params = Object.assign({}, this.setParames(), {
		        type: this.type
	        })
            statisticsApi.queryIndexInfo(params).then(d => {
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success) {
                    d.data ? this.formatSingleDayData(d.data) : '';
                }else{
	                this.formatSingleDayData({})
	                this.$showErrorMessage(d)
                }
                this.datasLoading = false
            }).catch(e => {
	            this.formatSingleDayData({})
	            this.datasLoading = false
	            this.$showErrorMessage(e)
	            typeof cb === 'function' && cb.apply(this, arguments)

            })
        },
        packStartAndEndTime (type, isInitCall) {
            let start = ''
            let end = ''
            if (type == 'today') {
                if (this.isTodaySelected && isInitCall) {
                    return false
                }
                this.isTodaySelected = true
                this.isYesterdaySelected = false
                start = new Date(new Date(new Date().toLocaleDateString()).getTime())
                this.startTime = Utils.getServerTimestamp(start)
                end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
                this.endTime = Utils.getServerTimestamp(end)
            }
            if (type == 'yesterday') {
                if (this.isYesterdaySelected) {
                    return false
                }
                this.loading = true
                this.isTodaySelected = false
                this.isYesterdaySelected = true
                start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000)
                this.startTime = Utils.getServerTimestamp(start)
                end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)
                this.endTime = Utils.getServerTimestamp(end)
                this.loading = false
            }
            let date = start.getDate() <= 9 ? '0' + start.getDate() : start.getDate()
            let month = (start.getMonth() + 1) <= 9 ? '0' + (start.getMonth() + 1) : (start.getMonth() + 1)
            this.currentTime = date + '/' + month + '/' + start.getFullYear()
            this.intervalTime = date == '01' ? this.currentTime : '01/' + month + '/' + start.getFullYear() + '-' + this.currentTime
            return true
        },
        formatSingleDayData (data) {
            this.singleSalesData.saleMoney = data.saleMoney ? this.setMoney(data.saleMoney) : ''
	        this.singleSalesData.monthlySaleMoney = data.monthlySaleMoney ? this.setMoney(data.monthlySaleMoney) : ''
            this.singleSalesData.saleVolumes = data.saleVolumes
            this.singleSalesData.monthlySaleVolumes = data.monthlySaleVolumes
            this.singleSalesData.orderCount = data.orderCount
	        this.singleSalesData.monthlyOrderCount = data.monthlyOrderCount
            this.singleSalesData.stockCount = data.stockCount
            this.singleSalesData.firstCategoryName = data.firstCategoryName
            this.singleSalesData.firstCategoryStockCount = data.firstCategoryStockCount
            this.singleSalesData.firstCategoryStockRate = data.firstCategoryStockRate
            this.singleSalesData.secondCategoryName = data.secondCategoryName
            this.singleSalesData.secondCategoryStockCount = data.secondCategoryStockCount
            this.singleSalesData.secondCategoryStockRate = data.secondCategoryStockRate
            if(this.type == 'yesterday'){
	            let yearNum = new Date(this.startTime).getDate();
                this.singleSalesData.saleMoneyAverage = data.monthlySaleMoney ? this.setMoney(data.monthlySaleMoney / yearNum) : ''
	            this.singleSalesData.saleVolumesAverage = this.singleSalesData.monthlySaleVolumes ? (this.singleSalesData.monthlySaleVolumes / yearNum).toFixed(2) : ''
	            this.singleSalesData.orderCountAverage = this.singleSalesData.monthlyOrderCount ? (this.singleSalesData.monthlyOrderCount / yearNum).toFixed(2) : ''
            }else{
	            this.singleSalesData.saleMoneyAverage = '';
	            this.singleSalesData.saleVolumesAverage = '';
	            this.singleSalesData.orderCountAverage = '';
            }
        },
        setMoney (money) {
            return parseInt(money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        },
        setTrendData (index, type) {
            let color = ''; let position = index == 0 ? 'left' : 'right'; let unit = ''
            switch (index) {
                case 0:
                    unit = this.unitName
                    color = '#3BA0FF'
              break
                case 1:
                    unit = 'pcs'
                    color = '#4DCB73'
              break
                case 2:
                    color = '#F2637B'
              break
            }
            if (type == 'yAxis') {
                return {type: 'value', position: position, axisLabel: {formatter: '{value}' + unit + ''}, splitLine: {show: false}, axisLine: {show: true, lineStyle: {color: color, width: 1 }}}
            }
            if (type == 'series') {
                return {type: 'line', color: [color]}
            }
        },
        setColorByIndex (index) {
            let color = ''
            switch (index) {
                case 0:
                    color = '#3aa0ff'
            break
                case 1:
                    color = '#36cbcb'
            break
                case 2:
                    color = '#4dcb73'
            break
                case 3:
                    color = '#fad337'
            break
                case 4:
                    color = '#f2637b'
            break
                case 5:
                    color = '#975fe4'
            break
            }
            return color
        },
        setParames () {
            return {
                startTime: this.startTime,
                endTime:this.endTime,
                storeId: this.search.store
            }
        },
        mGetDate (year, month) {
            var d = new Date(year, month, 0)
            return d.getDate()
        }

    }
}
</script>
<style>
  .statistics_extrude .tab_break > div {
    word-break: break-word;
  }
  .search_time .el-loading-spinner,.search_store .el-loading-spinner{
      margin-top:-10px !important;
  }
</style>
<style scoped>
  #daily_statistics {
    background-color: #fff;
    padding: 20px;
  }

  .statistics_search {
    margin-bottom: 23px;
  }

  .search_time {
    width: 148px;
    border: 1px solid #e1e3e4;
    border-radius: 4px;
  }


  .store_control {
    width: 148px;
    float: right;
    border: 1px solid #e1e3e4;
    border-radius: 4px;
  }

  .search_time_span, .store_control_span {
    display: block;
    text-align: center;
    float:left;
    line-height: 35px;
    color: #333;
  }

  .search_time_span:first-child, .store_control_span:first-child {
    width:72px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .search_time_span:nth-of-type(2), .store_control_span:nth-of-type(2) {
    width:74px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .search_time_span.selected, .store_control_span.selected {
    background-color: #4fa8f9;
    color: #fff;
  }

  .card_desc {
    color: #939393;
      min-height:150px;
  }

  .card_desc > div {
    line-height: 35px;
    overflow: hidden;
  }

  .card_desc > div > span:first-child {
    float: left;
  }

  .card_desc > div > span:last-child {
    float: right;
  }

  .card_time, .extrude_time, .store_title_time {
    color: #3ea2ff;
  }

  .card_total {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .card_total_data {
    color: #333;
  }

  .statistics_tips {
    line-height: 35px;
    font-size: 14px;
    margin-bottom: 30px;
  }

  .statistics_extrude {
    margin-bottom: 20px;
  }

  .extrude_title {
    line-height: 50px;
    font-weight: bold;
  }

  .best_table {
    margin-top: 10px;
  }

  #bestSell {
    width: 100%;
    height: 240px;
  }

  #personRank {
    width: 100%;
    height: 240px;
  }

  .best_group {
    width: 100%;
    margin-top: 14px;
  }

  .statistics_hr {
    background-color: #c9c9c9;
    height: 1px;
    border: none;
  }

  #salesTrend {
    width: 100%;
    height: 500px;
  }

  .statistics_trend {
    padding-top: 20px;
  }

  .best_group_desc {
    width: 100%;
    line-height: 35px;
    overflow: hidden;
  }

  .best_group_desc_ugx {
    display: inline-block;
    float: right;
  }

  .best_group_desc_icon {
    display: block;
    float: left;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 13px;
    margin-right: 5px;
  }

  .group_desc_veg {
    color: #979797;
  }
  .store_title_bold {
    font-weight: bold;
  }

  .store_title_tips {
    font-size: 12px;
  }

  .store_title_store {
    line-height: 30px;
  }

  .store_title_salesperson {
    line-height: 60px;
  }

  .store_rank {
    clear: both;
  }

  .store_rank_group {
    height: 50px;
  }

  .rank_group_bg {
    display: inline-block;
    position: absolute;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background-color: #f0f2f5;
  }

  .rank_group.active .rank_group_bg {
    background-color: #314659;
  }

  .rank_group.active .rank_group_num {
    color: #fff;
  }

  .rank_group {
    display: inline;
    position: relative;
    margin-right: 20px;
  }

  .rank_group_num {
    position: absolute;
    left: 7px;
    top: 2px;
    z-index: 99;
  }
  .best_group_col{
    display: table;
    height: 240px;
  }
  .best_group{
    display: table-cell;
    vertical-align: middle;
  }
  .trend_dot{
    display: inline-block;
    background-color: red;
    width:50px;
    height:50px;
    border-radius: 50%;
  }
  .proportion_nodata{
    height:250px;
    line-height: 250px;
    text-align: center;
    color:#939393;
    margin-left:-220px;
  }
  .sales_trend_no{
      position:absolute;
      top:0px;
      width:100%;
  }


</style>
