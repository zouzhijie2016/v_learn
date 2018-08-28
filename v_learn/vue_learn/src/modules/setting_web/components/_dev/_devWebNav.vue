
<template>
  <div>
    <el-row>
      <el-col :span="4">
        <setting-menu :urlPermiss="currentRouteUrl"></setting-menu>
      </el-col>
      <el-col :span="20">
        <div class="center_main">

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Cloud Binding</span>

              <el-button type="primary" @click="handleNewAdd" round>新增</el-button>

            </div>



<el-col :span="12">
            <el-tree
              :data="permissionTree"
              default-expand-all
              node-key="id"
              :render-content="renderPermissionTreeContent"
              @node-click="handlePermissionTreeClick"
              ref="permissionTreeRef">

            </el-tree>

</el-col>
<el-col :span="12">
    <el-form ref="permissionTreeNodeClickForm" :model="permissionTreeNodeClickData" label-width="100px">
      <el-form-item label="Id">
         <el-input v-model="permissionTreeNodeClickData.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="parentId">
         <el-input v-model="permissionTreeNodeClickData.parentId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="shortName">
         <el-input v-model="permissionTreeNodeClickData.shortName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="applicationName">
         <el-input v-model="permissionTreeNodeClickData.applicationName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="vueName">
         <el-input v-model="permissionTreeNodeClickData.vueName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="permission">
         <el-input v-model="permissionTreeNodeClickData.permissionName" :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="description">
         <el-input v-model="permissionTreeNodeClickData.description" :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="linkUrl">
         <el-input v-model="permissionTreeNodeClickData.linkUrl" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="seqId">
         <el-input v-model="permissionTreeNodeClickData.seqId" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item  label="isNav">
        <el-switch v-model="permissionTreeNodeClickData.isNav" :disabled="true"></el-switch>
      </el-form-item>
      <el-form-item  label="enable">
        <el-switch v-model="permissionTreeNodeClickData.enable" :disabled="true"></el-switch>
      </el-form-item>
    </el-form>
</el-col>
          </el-card>
        </div>
      </el-col>
    </el-row>


<el-dialog title="Web Nav Add" :visible.sync="webNavAddDialog">

      <el-form :model="webNavAddData" label-width="100px">
        <el-form-item label="parentId">
           <el-input v-model="webNavAddData.parentId" ></el-input>
        </el-form-item>
        <el-form-item label="shortName">
           <el-input v-model="webNavAddData.shortName" ></el-input>
        </el-form-item>
        <el-form-item label="applicationName">
           <el-input v-model="webNavAddData.applicationName"></el-input>
        </el-form-item>
        <el-form-item label="vueName">
           <el-input v-model="webNavAddData.vueName"></el-input>
        </el-form-item>
        <el-form-item label="permission">
           <el-input v-model="webNavAddData.permissionName" ></el-input>
        </el-form-item>
        <el-form-item label="description">
           <el-input v-model="webNavAddData.description" ></el-input>
        </el-form-item>
        <el-form-item label="linkUrl">
           <el-input v-model="webNavAddData.linkUrl" ></el-input>
        </el-form-item>
        <el-form-item label="seqId">
           <el-input v-model="webNavAddData.seqId" ></el-input>
        </el-form-item>
        <el-form-item  label="isNav">
          <el-input-number v-model="webNavAddData.isNav"  :min="0" :max="1"></el-input-number>
        </el-form-item>
        <el-form-item  label="enable">
           <el-input-number v-model="webNavAddData.enable"  :min="0" :max="1"></el-input-number>
        </el-form-item>

        <el-form-item  label="sql">
      <div>
        INSERT INTO `YW_WEB_NAV`
        (
        `PARENT_ID`,
        `SHORT_NAME`,
        `APPLICATION_NAME`,
        `VUE_NAME`,
        `LINK_URL`,
        `PERMISSION_NAME`,
        `DESCRIPTION`,
        `SEQ_ID`,
        `IS_NAV`,
        `ENABLE`,
        `CREATED_TIME`,
        `CREATED_USER`)
        VALUES
        (
        '{{webNavAddData.parentId}}',
        '{{webNavAddData.shortName}}',
        '{{webNavAddData.applicationName}}',
        '{{webNavAddData.vueName}}',
        '{{webNavAddData.linkUrl}}',
        '{{webNavAddData.permissionName}}',
        '{{webNavAddData.description}}',
        '{{webNavAddData.seqId}}',
        '{{webNavAddData.isNav}}',
        '{{webNavAddData.enable}}',
        '{{new Date().getTime()}}',
        'admin');
      </div>



        </el-form-item>

      </el-form>


</el-dialog>


  </div>
</template>
<script>
import settingMenu from '~setting-common/comp/settingMenu.vue'
import Utils from '~utils/index'
import _devApi from '~api/setting/_dev'
import _ from 'lodash'
export default {
    data () {
        return {
            currentRouteUrl: '',
            permissionTree: [],
            permissionTreeNodeClickData: {},
            webNavAddData: {
                isNav: '0',
                enable: '0'
            },
            webNavAddDialog: false
        }
    },
    mounted () {
        this.currentRouteUrl = '_devWebNav'
        this.loading()
    },
    filters: {
    },
    components: {
        settingMenu
    },
    methods: {
        async loading () {
            let _self = this
            let promiseArr = []

            const obj = {}
            const {data} = await _devApi.getDBWebNavList(obj)

            if (data) {
                _self.permissionTreeList = data
                _self.buildTree(data)
            }
        // let navPermission = await _devApi.getDBWebNavPermissionList(obj);
        // _self.navPermission = navPermission.data;

        // let accessCheckList = this.getDBaccessCheckList();
        // let permissionTreeList = this.getDBpermissionTreeList();
        //
        // promiseArr.push(webNavList);
        // promiseArr.push(accessCheckList);
        // promiseArr.push(permissionTreeList);
        // Promise.all(promiseArr).then((promiseRes)=>{
        //     let _webNavList = promiseRes[0];
        //
        //     let _accessCheckList = promiseRes[1];
        //     let _permissionTreeList = promiseRes[2];
        //     // _self.permissionAccessList = _permissionAccessList;
        //     // _self.accessCheckList = _accessCheckList;
        //     // _self.permissionTreeList = _permissionTreeList;
        //     // _self.buildTree(_permissionTreeList);
        // })
        },
        buildChildrenTree (x) {
            let _self = this
            let childrenNode = _.filter(this.permissionTreeList, (o) => { return x.id == o.parentId && x.id != o.id && o.parentId != 0 })
            x.children = childrenNode
            _.forEach(childrenNode, (y) => {
                _self.buildChildrenTree(y)
            })
        },
        buildTree (_permissionTreeList) {
            let _self = this

            let firstNode = _.filter(this.permissionTreeList, (o) => { return o.parentId == 0 })
            _.forEach(firstNode, (x) => {
                _self.buildChildrenTree(x)
            })
            this.permissionTree = firstNode

            // let _permissionTree =[];
        // console.log(firstNode);

            // let defaultCheckedKeys =[];
            // _.forEach(_permissionTreeList,(y)=>{
            //   _self.buildChildrenTree(y);
            //   y.enable && defaultCheckedKeys.push(y.id);
            // })
            // this.permissionTreeDefaultCheckedKeys =defaultCheckedKeys;
        },

        renderPermissionTreeContent (createElement, { node, data }) {

            if(data.isNav){
              return <span style="color: #999933;">
                  {data.description}
              </span>
            }else{
              return <span style="color: #006633;">
                  {data.description}
              </span>
            }


        },
        handlePermissionTreeClick (data, node, element) {
            this.permissionTreeNodeClickData = data

            let dynamicTags = _.filter(this.navPermission, (o) => { return o.webNavId == data.id })

            this.dynamicTags = dynamicTags || []

            // let accessCheckArr = [];
            // _.forEach(permissionTreeNodeClickTable,(x)=>{
            //   let checkObj = _.find(this.accessCheckList, (o)=> { return x.accessCheckId == o.id; });
            //   if(checkObj){
            //       accessCheckArr.push(checkObj);
            //   }
            // })
            // this.dynamicTags = accessCheckArr

        },
        handleNewAdd () {
            this.webNavAddDialog = true
        }

    }
}
</script>
<style scoped>
  .center_main{
    margin-left:20px;
  }
  .devSelectedDialog{
    display: inline-block;
    width: 100%;
  }

</style>
