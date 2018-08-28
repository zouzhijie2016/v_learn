
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
            </div>



<el-col :span="12">
            <el-tree
              :data="permissionTree"
              default-expand-all
              show-checkbox
              :check-strictly="true"
              node-key="id"
              :default-checked-keys="permissionTreeDefaultCheckedKeys"
              :render-content="renderPermissionTreeContent"
              @node-click="handlePermissionTreeClick"
              ref="permissionTreeRef">

            </el-tree>

</el-col>
<el-col :span="12">





<el-form ref="permissionTreeNodeClickForm" :model="permissionTreeNodeClickData" label-width="100px">


  <el-form-item label="treeId">
     <el-input v-model="permissionTreeNodeClickData.id" :disabled="true"></el-input>
  </el-form-item>

  <el-form-item label="Name">
     <el-input v-model="permissionTreeNodeClickData.permissionName" :disabled="true"></el-input>
  </el-form-item>

  <el-form-item label="description">
    <el-input v-model="permissionTreeNodeClickData.description" :disabled="true"></el-input>
  </el-form-item>

  <el-form-item  label="enable">
    <el-switch v-model="permissionTreeNodeClickData.enable"></el-switch>
  </el-form-item>

  <el-form-item  label="Add Access">
    <el-button @click="handleAddNewAccessClick" round>Add</el-button>
  </el-form-item>

  <el-table :data="permissionTreeNodeClickTable" style="width: 100%">
    <el-table-column prop="url" label="url"  width="180"></el-table-column>
    <el-table-column prop="description" label="description"  width="180"></el-table-column>
    <el-table-column prop="applicationName" label="applicationName"  width="180"></el-table-column>
    <el-table-column prop="className" label="className"  width="180"></el-table-column>
    <el-table-column prop="method" label="method"  width="180"></el-table-column>
    <el-table-column prop="enable" label="enable"  width="180"></el-table-column>
    <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">Delete</el-button>
          </template>
    </el-table-column>
  </el-table>

  <el-form-item  label="Add Vue Nav">
    <el-button @click="handleAddNewVueNavClick" round>Add</el-button>
  </el-form-item>

  <el-table :data="webNavNodeClickTable" style="width: 100%">
    <el-table-column prop="id" label="id"  width="180"></el-table-column>
    <el-table-column prop="parentId" label="parentId"  width="180"></el-table-column>
    <el-table-column prop="shortName" label="shortName"  width="180"></el-table-column>
    <el-table-column prop="applicationName" label="applicationName"  width="180"></el-table-column>
    <el-table-column prop="permissionName" label="permissionName"  width="180"></el-table-column>
    <el-table-column prop="vueName" label="vueName"  width="180"></el-table-column>
    <el-table-column prop="linkUrl" label="linkUrl"  width="180"></el-table-column>
    <el-table-column prop="isNav" label="isNav"  width="180"></el-table-column>
    <el-table-column prop="enable" label="enable"  width="180"></el-table-column>
    <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleNavNodeDeleteClick(scope.row)" type="text" size="small">Delete</el-button>
          </template>
    </el-table-column>
  </el-table>

</el-form>
</el-col>
          </el-card>
        </div>
      </el-col>
    </el-row>


    <el-dialog title="Permission Access Add" :visible.sync="permissionAccessDialog">

      <el-select v-model="accessCheckSelect"
       :filter-method="filterMethod"
       filterable
       placeholder="请选择">
         <el-option
           v-for="item in accessCheckListFilter"
           :key="item.id"
           :label="item.className +' '+ item.method "
           :value="item">
         </el-option>
      </el-select>

<el-form :model="accessCheckSelect" label-width="100px">
  <el-form-item label="id">
     <el-input v-model="accessCheckSelect.id" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="url">
     <el-input v-model="accessCheckSelect.url" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="className">
     <el-input v-model="accessCheckSelect.className" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="method">
     <el-input v-model="accessCheckSelect.method" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="description">
     <el-input v-model="accessCheckSelect.description" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="checkType">
     <el-input v-model="accessCheckSelect.checkType" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item  label="enable">
    <el-switch v-model="accessCheckSelect.enable" :disabled="true"></el-switch>
  </el-form-item>
  <el-form-item  label="sql">

<div v-if="accessCheckSelect.id && permissionTreeNodeClickData.id">
  INSERT INTO YW_PERMISSION_ACCESS
  (PERMISSION_TREE_ID,
  ACCESS_CHECK_ID,
  CREATED_TIME,
  CREATED_USER)
  SELECT
  {{permissionTreeNodeClickData.id}},
  yac.id,
  '{{new Date().getTime()}}',
  'admin'
  FROM YW_ACCESS_CHECK yac
  where not exists (
  select * from YW_PERMISSION_ACCESS tpa
      where tpa.PERMISSION_TREE_ID = {{permissionTreeNodeClickData.id}}
      and tpa.ACCESS_CHECK_ID = (
      select id from YW_ACCESS_CHECK tac where tac.CLASS_NAME = '{{accessCheckSelect.className}}'
            and tac.METHOD='{{accessCheckSelect.method}}'
          )
  ) and yac.CLASS_NAME= '{{accessCheckSelect.className}}' and yac.METHOD = '{{accessCheckSelect.method}}';
</div>



  </el-form-item>

</el-form>


    </el-dialog>



    <el-dialog title="Web Nav Add" :visible.sync="webNavListDialog">

      <el-select v-model="webNavSelect"
       :filter-method="filterWebNavMethod"
       filterable
       placeholder="请选择">
         <el-option
           v-for="item in webNavListFilter"
           :key="item.id"
           :label="item.shortName +' '+ item.id "
           :value="item">
         </el-option>
      </el-select>

  <el-form :model="webNavSelect" label-width="100px">
  <el-form-item label="id">
     <el-input v-model="webNavSelect.id" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="parentId">
     <el-input v-model="webNavSelect.parentId" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="shortName">
     <el-input v-model="webNavSelect.shortName" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="applicationName">
     <el-input v-model="webNavSelect.applicationName" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="vueName">
     <el-input v-model="webNavSelect.vueName" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="linkUrl">
     <el-input v-model="webNavSelect.linkUrl" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="description">
     <el-input v-model="webNavSelect.description" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="permissionName">
     <el-input v-model="webNavSelect.permissionName" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="seqId">
     <el-input v-model="webNavSelect.seqId" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item  label="isNav">
    <el-switch v-model="webNavSelect.isNav" :disabled="true"></el-switch>
  </el-form-item>
  <el-form-item  label="enable">
    <el-switch v-model="webNavSelect.enable" :disabled="true"></el-switch>
  </el-form-item>
  <el-form-item  label="sql">

  <div v-if="webNavSelect.id && permissionTreeNodeClickData.id">
    INSERT INTO YW_WEB_NAV_PERMISSION
    (WEB_NAV_ID,
    PERMISSION_TREE_ID,
    CREATED_TIME,
    CREATED_USER)
    SELECT
    ywn.id,
    {{permissionTreeNodeClickData.id}},
    '{{new Date().getTime()}}',
    'admin'
    FROM YW_WEB_NAV ywn
    where not exists (
    select * from YW_WEB_NAV_PERMISSION ywnp
        where ywnp.PERMISSION_TREE_ID = {{permissionTreeNodeClickData.id}}
        and ywnp.WEB_NAV_ID = (
        select id from YW_WEB_NAV twn where twn.SHORT_NAME = '{{webNavSelect.shortName}}'
            )
    ) and ywn.SHORT_NAME= '{{webNavSelect.shortName}}';
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
        currentRouteUrl:"",
        filterText:"",
        accessCheckList:[],
        accessCheckListFilter:[],
        accessCheckSelect:{},
        permissionAccessList:[],
        permissionTreeList:[],
        permissionTree:[],
        permissionTreeNodeClickTable:[],
        permissionTreeDefaultCheckedKeys:[],
        accessCheckClickData :{},
        permissionTreeNodeClickData :{},
        accessCheckClickDialog:false,
        permissionAccessDialog:false,
        webNavListDialog :false,
        webNavSelect:{},
        webNavList:[],
        webNavListFilter:[],
        webNavNodeClickTable:[],
        webNavPermissionList:[]
      }
    },
    mounted () {
      this.currentRouteUrl = "_devTreeBinding";
      this.loading();
    },
    filters: {
    },
    components: {
      settingMenu
    },
    methods: {
      loading(){

        let _self = this;

        let promiseArr = [];
        let permissionAccessList = this.getDBpermissionAccessList();
        let accessCheckList = this.getDBaccessCheckList();
        let permissionTreeList = this.getDBpermissionTreeList();

        let getDBWebNavList = this.getDBWebNavList();
        let getDBWebNavPermissionList = this.getDBWebNavPermissionList();



        promiseArr.push(permissionAccessList);
        promiseArr.push(accessCheckList);
        promiseArr.push(permissionTreeList);
        promiseArr.push(getDBWebNavList);
        promiseArr.push(getDBWebNavPermissionList);

        Promise.all(promiseArr).then((promiseRes)=>{
            let _permissionAccessList = promiseRes[0];
            let _accessCheckList = promiseRes[1];
            let _permissionTreeList = promiseRes[2];

            let _DBWebNavList = promiseRes[3];
            let _DBWebNavPermissionList = promiseRes[4];

            _self.webNavList = _DBWebNavList;
            _self.webNavPermissionList = _DBWebNavPermissionList;

            _self.permissionAccessList = _permissionAccessList;
            _self.accessCheckList = _accessCheckList;
            _self.permissionTreeList = _permissionTreeList;
            _self.buildTree(_permissionTreeList);

        })

    },
    buildChildrenTree(x){
      let _self = this;
      let childrenNode = _.filter(this.permissionTreeList, (o)=> { return x.id == o.parentId && x.id != o.id && o.parentId != 0; });
      x.children = childrenNode;
      _.forEach(childrenNode,(y)=>{
        _self.buildChildrenTree(y);
      })
    },
    buildTree(_permissionTreeList){
      let _self = this;
      let _permissionTree =[];
      let firstNode = _.filter(this.permissionTreeList, (o)=> { return o.parentId == 0; });
      _.forEach(firstNode,(x)=>{
        _self.buildChildrenTree(x);
      })
      this.permissionTree = firstNode;

      let defaultCheckedKeys =[];
      _.forEach(_permissionTreeList,(y)=>{
        _self.buildChildrenTree(y);
        y.enable && defaultCheckedKeys.push(y.id);
      })
      this.permissionTreeDefaultCheckedKeys =defaultCheckedKeys;

    },
    async getDBpermissionAccessList(){
        const obj = {};
        const {data} = await _devApi.getDBpermissionAccessList(obj);
        return data;
    },
    async getDBaccessCheckList(){
        const obj = {};
        const {data} = await _devApi.getDBaccessCheckList(obj);
        return data;
    },
    async getDBpermissionTreeList(){
        let obj = {};
        const {data} = await _devApi.getDBpermissionTreeList(obj);
        return data;
    },

    async getDBWebNavList(){
        let obj = {};
        const {data} = await _devApi.getDBWebNavList(obj);
        return data;
    },

    async getDBWebNavPermissionList(){
        let obj = {};
        const {data} = await _devApi.getDBWebNavPermissionList(obj);
        return data;
    },

    renderPermissionTreeContent(createElement, { node, data }) {
        return <span>
          {data.display}
        </span>
    },
    handlePermissionTreeClick(data,node,element){

      let _self = this;
      let permissionTreeNodeClickTable = _.filter(this.permissionAccessList, (o)=> { return o.permissionTreeId == data.id; });

      let accessCheckArr = [];
      _.forEach(permissionTreeNodeClickTable,(x)=>{
        let checkObj = _.find(_self.accessCheckList, (o)=> { return x.accessCheckId == o.id; });
        if(checkObj){
            accessCheckArr.push(checkObj);
        }
      })

      let webNavPermissionNodeClickTable = _.filter(this.webNavPermissionList, (o)=> { return o.permissionTreeId == data.id; });

      let webNavNodeClickTable = [];
      _.forEach(webNavPermissionNodeClickTable,(x)=>{
        let checkObj = _.find(_self.webNavList, (o)=> { return x.webNavId == o.id; });
        if(checkObj){
            webNavNodeClickTable.push(checkObj);
        }
      })

      console.log(webNavNodeClickTable);

      this.webNavNodeClickTable = webNavNodeClickTable;

      this.permissionTreeNodeClickTable = accessCheckArr

      this.permissionTreeNodeClickData = data;

    },
    handleDeleteClick(row){
      let _self = this;
      let deleteSql = `DELETE FROM YW_PERMISSION_ACCESS
      WHERE
      PERMISSION_TREE_ID ='${_self.permissionTreeNodeClickData.id}'
      AND ACCESS_CHECK_ID ='${row.id}';`
      console.log(deleteSql);
      console.log(_self);
      _self.$showErrorMessage(deleteSql,10);
    },
    handleNavNodeDeleteClick(row){
      let _self = this;
      let deleteSql = `DELETE FROM YW_WEB_NAV_PERMISSION
      WHERE
      PERMISSION_TREE_ID ='${_self.permissionTreeNodeClickData.id}'
      AND WEB_NAV_ID ='${row.id}';`
      console.log(deleteSql);
      console.log(_self);
      _self.$showErrorMessage(deleteSql,10);
    },
    handleAddNewAccessClick(){
      this.permissionAccessDialog = true;
    },
    handleAddNewVueNavClick(){
      this.webNavListDialog = true;
    },
    filterMethod(value, data) {
      let _self = this;
      let accessCheckListFilter = [];
      _.forEach(_self.accessCheckList,(x)=>{

        if((x.className && x.className.indexOf(value) !== -1) || (x.description && x.description.indexOf(value) !== -1) || ( x.method && x.method.indexOf(value) !== -1 )){
          accessCheckListFilter.push(x);
        }
      })

      _self.accessCheckListFilter = accessCheckListFilter;
    },
    filterWebNavMethod(value, data){
      let _self = this;
      let webNavListFilter = [];
      _.forEach(_self.webNavList,(x)=>{
        if(x.id == value || x.shortName == value ){
          webNavListFilter.push(x);
        }
      })
      _self.webNavListFilter = webNavListFilter;
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
