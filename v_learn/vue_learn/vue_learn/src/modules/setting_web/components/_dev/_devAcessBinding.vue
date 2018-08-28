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
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
            <el-tree
              :data="accessCheckList"
              default-expand-all
              :filter-node-method="filterNode"
              :render-content="renderContent"
              @node-click="handleNodeClick"
              ref="accessCheckListRef">
            </el-tree>
          </el-card>
          <el-dialog
            title="小心 id 可能和线上不一致。你应该在初始化脚本里面写清楚 你这个版本新增了什么"
            :visible.sync="accessCheckClickDialog">
  <el-row>

  <el-form ref="accessCheckClickFrom" :model="accessCheckClickData" label-width="80px">
    <el-form-item label="enable">
      <el-switch @change="accessCheckClickDataEnableChange" v-model="accessCheckClickData.enable"></el-switch>
    </el-form-item>
    <el-form-item label="id">
       <el-input v-model="accessCheckClickData.id" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="applicationName">
       <el-input v-model="accessCheckClickData.applicationName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="url">
       <el-input v-model="accessCheckClickData.url" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="className">
       <el-input v-model="accessCheckClickData.className" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="method">
       <el-input v-model="accessCheckClickData.method" :disabled="true"></el-input>
    </el-form-item>
  </el-form>
      <el-col :span="12">
        <el-tree
          :data="permissionTree"
          node-key="id"
          show-checkbox
          :check-strictly="true"
          default-expand-all
          :default-checked-keys="permissionTreeDefaultCheckedKeys"
          :render-content="renderPermissionTreeContent"
          @node-click="handlePermissionTreeClick"
          ref="permissionTreeRef">
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-form ref="permissionTreeForm" :model="permissionTreeNodeClickData" label-width="80px">
          <el-form-item label="treeId">
             <el-input v-model="permissionTreeNodeClickData.treeId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="Name">
             <el-input v-model="permissionTreeNodeClickData.permissionName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="enable">
            <el-switch v-model="permissionTreeNodeClickData.enable"></el-switch>
          </el-form-item>
          <el-form-item label="sql">
            <span v-if="permissionTreeNodeClickData.treeId && permissionTreeNodeClickData.checked">
              DELETE FROM `YW_PERMISSION_ACCESS`
              WHERE `PERMISSION_TREE_ID` = '{{permissionTreeNodeClickData.treeId}}'
              and `ACCESS_CHECK_ID` = '{{permissionTreeNodeClickData.checkId}}' ;
            </span>
            <span v-if="permissionTreeNodeClickData.treeId &&  !permissionTreeNodeClickData.checked">
              INSERT INTO `YW_PERMISSION_ACCESS`
              (`PERMISSION_TREE_ID`,
              `ACCESS_CHECK_ID`,
              `UPDATED_TIME`,
              `UPDATED_USER`)
              SELECT
              '{{permissionTreeNodeClickData.treeId}}',
              yac.id,
              '{{new Date().getTime()}}',
              'admin'
              FROM `YW_ACCESS_CHECK` yac
              where not exists (
              select * from `YW_PERMISSION_ACCESS` tpa
                  where tpa.PERMISSION_TREE_ID = 3
                  and tpa.ACCESS_CHECK_ID = (
              		select id from YW_ACCESS_CHECK tac where tac.CLASS_NAME = '{{permissionTreeNodeClickData.className}}'
              					and tac.METHOD='{{permissionTreeNodeClickData.method}}'
                      )
              ) and yac.CLASS_NAME=  '{{permissionTreeNodeClickData.className}}'	and yac.METHOD = '{{permissionTreeNodeClickData.method}}';
            </span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
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
            filterText: '',
            accessCheckList: [],
            permissionAccessList: [],
            permissionTreeList: [],
            permissionTree: [],
            permissionTreeDefaultCheckedKeys: [],
            accessCheckClickData: {},
            permissionTreeNodeClickData: {},
            accessCheckClickDialog: false
        }
    },
    mounted () {
        this.currentRouteUrl = '_devAcessBinding'
        this.loading()
    },
    filters: {
    },
    components: {
        settingMenu
    },
    watch: {
        filterText (val) {
            this.$refs.accessCheckListRef.filter(val)
        }
    },
    methods: {
        loading () {
            let _self = this

            let promiseArr = []
            let permissionAccessList = this.getDBpermissionAccessList()
            let accessCheckList = this.getDBaccessCheckList()
            let permissionTreeList = this.getDBpermissionTreeList()

            promiseArr.push(permissionAccessList)
            promiseArr.push(accessCheckList)
            promiseArr.push(permissionTreeList)

            Promise.all(promiseArr).then((promiseRes) => {
                let _permissionAccessList = promiseRes[0]
                let _accessCheckList = promiseRes[1]
                let _permissionTreeList = promiseRes[2]
                _self.permissionAccessList = _permissionAccessList
                _self.accessCheckList = _accessCheckList
                _self.permissionTreeList = _permissionTreeList
                _self.buildTree(_permissionTreeList)
            })
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
            let _permissionTree = []
            let firstNode = _.filter(this.permissionTreeList, (o) => { return o.parentId == 0 })
            _.forEach(firstNode, (x) => {
                _self.buildChildrenTree(x)
            })
            this.permissionTree = firstNode
        },
        async getDBpermissionAccessList () {
            const obj = {}
            const {data} = await _devApi.getDBpermissionAccessList(obj)
            return data
        },
        async getDBaccessCheckList () {
            const obj = {}
            const {data} = await _devApi.getDBaccessCheckList(obj)
            return data
        },
        async getDBpermissionTreeList () {
            let obj = {}
            const {data} = await _devApi.getDBpermissionTreeList(obj)
            return data
        },
        filterNode (value, data) {
            if (!value) return true
            return (data.className && data.className.indexOf(value) !== -1) || (data.description && data.description.indexOf(value) !== -1) || (data.method && data.method.indexOf(value) !== -1)
        },
        renderContent (createElement, { node, data }) {
            if (node.level === 1) {
                return <span>
                    {data.className}  {data.method} {data.description}
                </span>
            }
        },
        renderPermissionTreeContent (createElement, { node, data }) {
            return <span>
                {data.permissionName}
            </span>
        },
        handleNodeClick (data) {
            this.accessCheckClickData = data
            this.handlerAccessCheckChecked()
            this.accessCheckClickDialog = true
        },
        handlerAccessCheckChecked () {
            let accessCheckClickData = this.accessCheckClickData
            let permissionAccessList = this.permissionAccessList
            let checkedList = _.filter(this.permissionAccessList, (o) => { return o.accessCheckId == accessCheckClickData.id })
            let checkedArr = []
            _.forEach(checkedList, function (value, key) {
                checkedArr.push(value.permissionTreeId)
            })
            this.permissionTreeDefaultCheckedKeys = checkedArr
        },
        handlePermissionTreeClick (data, node, element) {
            let _self = this
            let obj = {}
            obj.treeId = data.id
            obj.checkId = this.accessCheckClickData.id

            obj.className = this.accessCheckClickData.className
            obj.method = this.accessCheckClickData.method

            obj.permissionName = data.permissionName
            obj.enable = data.enable
            obj.applicationName = this.accessCheckClickData.applicationName
            obj.checked = false
            let checked = _.find(this.permissionAccessList, (o) => { return o.permissionTreeId == data.id && o.accessCheckId == _self.accessCheckClickData.id })
            if (checked) {
                obj.checked = true
            }
            this.permissionTreeNodeClickData = obj
        },
        async accessCheckClickDataEnableChange (enable) {
            let _self = this
            const {data} = await _devApi.changeEnable(_self.accessCheckClickData)
            return data
        }
        //     roundClick(){
        //         let permissionTreeData = this.$refs.permissionTreeRef.getCheckedNodes();
        //         let className = this.accessCheckClickData.className;
        //         let method = this.accessCheckClickData.method;
        // let treeArrIds = [];
        // console.group("installSql group");
        // _.forEach(permissionTreeData,(x)=>{
        //   let treeId = x.id;
        //   treeArrIds.push(treeId);
        //   let installSql =`INSERT INTO YW_PERMISSION_ACCESS
        //   (PERMISSION_TREE_ID,
        //   ACCESS_CHECK_ID,
        //   UPDATED_TIME,
        //   UPDATED_USER)
        //   SELECT
        //   '${treeId}',
        //   yac.id,
        //   '${new Date().getTime()}',
        //   'admin'
        //   FROM YW_ACCESS_CHECK yac
        //   where not exists (
        //   select * from YW_PERMISSION_ACCESS tpa
        //       where tpa.PERMISSION_TREE_ID = ${treeId}
        //       and tpa.ACCESS_CHECK_ID = (
        //       select id from YW_ACCESS_CHECK tac where tac.CLASS_NAME = '${className}'
        //             and tac.METHOD='${method}'
        //           )
        //   ) and yac.CLASS_NAME= '${className}' and yac.METHOD = '${method}';`;
        // console.log(installSql);
        // })
        // console.groupEnd();
        //
        //       // DELETE FROM `YW_PERMISSION_ACCESS`
        //         // WHERE PERMISSION_TREE_ID not in ('1')
        //         // and
        //         // ACCESS_CHECK_ID = (select id from YW_ACCESS_CHECK tac where tac.CLASS_NAME = 'YwRoleController' and tac.METHOD='queryRoleList' );
        //     }

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
