<template>
    <div>
        <div class="hideHeadLeft" ref="headLeft"></div>
        <div id="receiveLeft"><leftMenu :urlPermiss.sync="urlPermissData"></leftMenu></div>
        <div class="receive_main" id="receiveMain">
            <div class="receive_tab">
                <div class="item_title">Receive Items</div>
                <el-tabs class="tab_box" v-model="activeName" type="card" @tab-click="tabCutClick">
                    <el-tab-pane label="IMEI/SN" name="first">

                    </el-tab-pane>
                    <el-tab-pane label="Non-Serialized" name="second">
                    </el-tab-pane>
                    <el-tab-pane label="Upload Excel" name="three">
                        <itemsExport></itemsExport>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </div>
    </div>
</template>
<script>
  import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
  import leftMenu from '~warehouse-common/comp/leftmenu.vue'
  import itemsExport from './itemsExport.vue'
  import warehouseApi from '~api/warehouseapi'
  export default {
      data () {
          return {
              activeName: 'three',
              urlPermissData: '/warehouse/control/receiveInventoryItem',
              offsetLeft: ''
          }
      },
    mixins: [myInventoryMixin],
	  watch: {
		  offsetLeft (val) {
			  if (!this.timer) {
				  this.offsetLeft = val
				  this.timer = true
				  let that = this
				  setTimeout(function () {
					  console.log(that.offsetLeft)
					  that.setLeft()
					  that.timer = false
				  }, 400)
			  }
		  }
	  },
      mounted () {
          var _self = this;
	      _self.setLeft();
	      window.onresize = () => {
		      return (() => {
			      _self.offsetLeft = _self.$refs.headLeft.offsetLeft;
		      })()
	      }

      },
      methods:{
	      tabCutClick(){
	      	switch(this.activeName){
                case"first":
                	window.open('/warehouse/control/receiveInventoryItem','_self')
                  window.sessionStorage.setItem('type', 'SERIALIZED_INV_ITEM')
                	break;
                case"second":
	                window.open('/warehouse/control/receiveInventoryItem','_self')
                  window.sessionStorage.setItem('type', 'NON_SERIAL_INV_ITEM')
                	break;
            }
	      	console.dir(this.activeName)
          },
	      setLeft(){
		      this.offsetLeft = this.$refs.headLeft.offsetLeft;
		      document.getElementById('receiveLeft').style.left=this.offsetLeft+'px';
		      document.getElementById('receiveMain').style.paddingLeft=188+parseInt(this.offsetLeft)+'px';
	      }
      },
      components: {
          leftMenu,
	        itemsExport,
      }
  }
</script>
<style scoped>
    .tab_box{
        background: #fff;
    }
    .hideHeadLeft{
        width:1280px;
        height: 1px;
        margin:0 auto;
    }
    #receiveLeft{
        position:absolute;
    }
    .receive_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        min-height: 300px;
    }
    .receive_tab{
        background-color:#fff;
    }
    .item_title{
        height:40px;
        line-height:40px;
        padding-left:10px;
        font-size:16px;
        font-weight:bold;
    }
</style>
