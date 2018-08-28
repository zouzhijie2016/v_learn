<template>
  <div>
    <el-dialog title="Scan IMEI of productName" custom-class="ScanImeiDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="scan_input">
        <span class="scan_input_span">Input IMEI</span><input ref="imei" type="text" class="common_theme"
                                                              style="width: 300px;"
                                                              @keyup.enter.stop="scanImeiCode" v-model.trim="imei"/>
        <div class="err_msg">{{errmsg}}</div>
      </div>
      <div class="scan_list">
        <div class="code_group" v-for="val in imeiList">
          <div class="serial_number"><span>{{val}}</span><span class="el-icon-circle-close code_close"
                                                               @click="delImeiCode(val)"></span></div>
        </div>
      </div>
      <div class="scan_footer">
        <span class="scan_footer_total">Count: {{ imeiList.length }} pcs</span>
        <div class="scan_footer_btn">
          <el-button @click="clearAllImeis">Clear All</el-button>
          <el-button type="primary" @click="saveAllImeis">Save</el-button>
        </div>

      </div>

    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
export default {
    props: ['dataVisible', 'productDatas'],
    data () {
        return {
            dataCloseVisible: true,
            imei: '',
            imeiList: [],
            errmsg: '',
            productChildDatas: {}
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
        }
    },
    created () {
        this.scanImeiCode = Utils.debounce(this.checkIMEI, 500)
        if (this.productDatas.imeiList) {
            this.imeiList.splice(0)
            var lists = this.productDatas.imeiList
            this.imeiList = this.imeiList.concat(lists)
        }
        this.productChildDatas = Object.assign({}, this.productChildDatas, this.productDatas)
    },
    methods: {
        clearAllImeis () {
            this.imeiList.splice(0)
            this.productChildDatas.imeiList = this.imeiList
            this.productChildDatas.scanQuantity = this.imeiList.length
            this.$emit('update:productDatas', this.productChildDatas)
        },
        saveAllImeis () {
            this.productChildDatas.imeiList = this.imeiList
            this.productChildDatas.scanQuantity = this.imeiList.length
            this.$emit('update:productDatas', this.productChildDatas)
            this.$emit('update:dataVisible', false)
        },
        getRealIMEIArr (target) {
        	var _self = this;
            var curImei = this.imei
            var imeiArr = []
            if (!curImei) {
                this.errmsg = 'Please enter correct IMEI code'
                target.focus()
                return false
            }
            if (curImei.indexOf('|') != -1) {
                curImei = curImei.replace(/[|]/g, '')
            }

            if (curImei.length > 15 && curImei.length % 15 == 0) {
                let reg = new RegExp('^[0-9]*$')
                if (!reg.test(curImei)) {
                    this.errmsg = 'Please enter correct IMEI code'
                    target.focus()
                    return false
                }

                // 去重复
                let str = ''
                for (let i = 0, len = curImei.length; i < len; i++) {
                    str += curImei[i]
                    if ((i + 1) % 15 == 0) {
                        if (this.imeiList.indexOf(str) < 0) {
                            imeiArr.push(str)
                        }
                        str = ''
                    }
                }
	            if(this.isRepeat(imeiArr)){
		            this.errmsg = 'IMEI code is repeated'
		            target.focus()
		            return false
                }
	            let hasReapeat = imeiArr.filter(function(item){
	            	if(_self.imeiList.indexOf(item)>-1){
	            		return true;
                    }
                })
	            if(hasReapeat && hasReapeat.length > 0){
		            this.errmsg = 'IMEI code is repeated'
		            target.focus()
		            return false
                }
            } else {
                // 单个imei输入
                let reg = new RegExp('^([0-9]{15})$')
                if (!reg.test(curImei)) {
                    this.errmsg = 'Please enter correct IMEI code'
                    target.focus()
                    return
                }
                if (this.imeiList.indexOf(curImei) > -1) {
                    this.errmsg = 'IMEI code is repeated'
                    target.focus()
                    return
                }
                imeiArr.push(curImei)
            }
            return imeiArr
        },
	    isRepeat(arr){
		    var hash = {};
		    for(var i in arr) {
			    if(hash[arr[i]])
			    {
				    return true;
			    }
			    hash[arr[i]] = true;
		    }
		    return false;
	    },
        checkIMEI () {
            var target = this.$refs.imei
            var imeiArr = this.getRealIMEIArr(target)
            if (!(imeiArr && imeiArr.length)) {
                return false
            }
            if ((imeiArr.length + this.imeiList.length) > this.productDatas.packQuantity) {
                this.errmsg = 'IMEI code can not be more than pack QTY'
                target.focus()
                return false
            }
            this.imeiList = this.imeiList.concat(imeiArr)
            this.imei = ''
            this.errmsg = ''
        },
        delImeiCode (val) {
            let index = this.imeiList.indexOf(val)
            this.imeiList.splice(index, 1)
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
  .ScanImeiDialog {
    width: 700px;
  }

  .dialog_label {
    margin-bottom: 10px;
  }

  .dialog_label > label {
    width: 100px;
    font-size: 12px;
    text-align: right;
  }

  .mark_complete_dialog {
    width: 560px;
  }

  .el-dialog__body {
    padding: 30px 0px 0px;
  }
</style>
<style scoped>

  .scan_input {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }

  .scan_input_span {
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    margin-right: 10px;
  }

  .code_group {
    display: inline-block;
    position: relative;
    padding-right: 10px;
  }

  .scan_list {
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 20px;
  }

  .serial_number {
    display: inline-block;
    border: 1px dotted #1FBCD2;
    background-color: #CAEDF2;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  .code_close {
    padding-left: 10px;
    cursor: pointer;
  }

  .scan_footer {
    overflow: hidden;
    background-color: rgb(223, 234, 236);
    padding: 10px 20px;
  }

  .scan_footer .scan_footer_total {
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #c4c4c4;
    background-color: #fff;
    text-align: center;
    border-radius: 4px;
  }

  .scan_footer .scan_footer_btn {
    float: right;
  }

  .err_msg {
    height: 30px;
    color: red;
    font-size: 14px;
    text-align: center;
  }

</style>
