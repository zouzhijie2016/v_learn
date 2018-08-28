<template>
    <div>
        <leftMenu :urlPermiss.sync="urlPermissData"></leftMenu>
        <div class="center_main">
            <el-tabs class="tab_box" v-model="activeName" type="border-card">
                <el-tab-pane v-if="wrhsReqCon" label="Require" name="first">
                    <requireContent></requireContent>
                </el-tab-pane>
                <el-tab-pane v-if="wrhsRegApp" label="Regional Approve" name="second">
                    <regionalApproveContent></regionalApproveContent>
                </el-tab-pane>
                <el-tab-pane v-if="wrhsWarApp" label="Warehouse Approve" name="three">
                    <warehouseApproveContent></warehouseApproveContent>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
  import {myInventoryMixin} from '~warehouse-common/comp/warehouseMixins'
  import leftMenu from '~warehouse-common/comp/leftmenu.vue'
  import requireContent from './requireContent.vue'
  import regionalApproveContent from './regionalApproveContent.vue'
  import warehouseApproveContent from './warehouseApproveContent.vue'
  import warehouseApi from '~api/warehouseapi'
  export default {
      data () {
          return {
              activeName: '',
              urlPermissData: '/warehouse_web/index.html#/requireInventory',
              wrhsRegApp: false,
              wrhsReqCon: false,
              wrhsWarApp: false
          }
      },
      mixins: [myInventoryMixin],
      methods: {},
      mounted () {
          document.title = 'Inventory | Warehouse | OCMS-BIM'

          warehouseApi.getRequirePermission().then(d => {
              if (d.resultCode == 1) {
                  if(d.resultData && d.resultData.wrhsReqCon){
                      this.activeName = 'first';
                      this.wrhsReqCon = true;

                      if(d.resultData && d.resultData.wrhsRegApp){
                          this.wrhsRegApp = true;
                      }

                      if(d.resultData && d.resultData.wrhsWarApp){
                          this.wrhsWarApp = true;
                      }
                  }else if(d.resultData && d.resultData.wrhsRegApp){
                      this.wrhsRegApp = true;
                      this.activeName = 'second';

                      if(d.resultData && d.resultData.wrhsWarApp){
                          this.wrhsWarApp = true;
                      }
                  }else if(d.resultData && d.resultData.wrhsWarApp){
                      this.wrhsWarApp = true;
                      this.activeName = 'three';
                  }
              } else {
                  this.$showErrorMessage(d.message)
              }
          }).catch(err => {
              this.$showErrorMessage(err)
          })
      },
      updated () {
      },
      components: {
          leftMenu,
          requireContent,
          regionalApproveContent,
          warehouseApproveContent
      }
  }
</script>
<style scoped>
    .tab_box{
        background: #fff;
    }
    .center_main {
        overflow-y: auto;
        zoom: 1;
        width: 100%;
        transition: margin-right 0.3s ease-in-out;
        padding-left: 188px;
        min-height: 300px;
    }
</style>
