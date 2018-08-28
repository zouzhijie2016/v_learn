<template>
  <div>
    <el-dialog title="Role setting info" custom-class="roleInfoDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form :model="form" ref="form" label-width="160px" class="demo-ruleForm" v-loading="loading"
                 element-loading-text="Loading...">
          <div class="role_setting_item" style="overflow: hidden">
            <el-col :span="8">
              <label class="item_label">Country : </label>
              <span class="item_span">{{form.country}}</span>
            </el-col>
            <el-col :span="16">
              <label class="item_label">Company : </label>
              <span class="item_span">{{form.companyName}}</span>
            </el-col>
          </div>
          <el-form-item label="Role name : " prop="roleName" class="role_setting_item">
            {{form.roleName}}
          </el-form-item>
          <el-form-item label="Cost Setting : "  class="role_setting_item">
            <template v-for="item in form.cost">{{item}}&nbsp;&nbsp;</template>
          </el-form-item>
          <el-form-item label="Page Setting : " class="role_setting_item">
            <el-tree class="filter-tree role_setting_tree" :data="permissionTree" :props="defaultProps" default-expand-all  ref="tree2"></el-tree>
          </el-form-item>
        </el-form>
        <div class="role_info_btns">
          <el-button @click="dataCloseVisible = false">Close</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import roleSettingApi from '~api/setting/roleSettingApi'
import _ from 'lodash'
export default {
    props: ['dataVisible', 'dataRoleId'],
    data () {
        return {
            dataCloseVisible: true,
            loading: false,
            pageOptions: [],
            permissionTree: [],
            roleId: '',
            form: {
                country: 'Uganda',
                companyName: 'egatee.ltd',
                roleName: '',
                cost: []
            },
            defaultProps: {
                children: 'children',
                label: 'permissionName'
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataRoleId', '')
            }
        }
    },
    created () {
        this.roleId = this.dataRoleId
        this.initData()
    },
    methods: {
        initData () {
            var _self = this
            _self.roleId = _self.dataRoleId
            _self.loading = true
            roleSettingApi.querySingleRole({
                id: _self.roleId
            }).then(d => {
                _self.loading = false
                if (d.success && d.data) {
                    _self.pageOptions.splice(0)
                    _self.pageOptions = _self.pageOptions.concat(d.data.permissionTreeList)
                    _self.setParmarsData(d.data)
                } else {
                    _self.$showErrorMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.$showErrorMessage(e.message)
            })
        },
        setParmarsData (data) {
            var _self = this
            data.defaultCost ? _self.form.cost.push('defaultCost') : ''
            data.bananaCost ? _self.form.cost.push('bananaCost') : ''
            data.retailCost ? _self.form.cost.push('retailCost') : ''
            data.specialCost ? _self.form.cost.push('specialCost') : ''
            _self.form.companyName = data.companyName
            _self.form.operateType = data.operateType
            _self.form.roleName = data.roleName
            let firstNode = _.filter(data.permissionTreeList, (o) => { return o.parentId == 0 })
            _.forEach(firstNode, (x) => {
                _self.buildChildrenTree(x)
            })
            _self.permissionTree = firstNode
            console.dir('-------------------page')
            console.dir(_self.pageOptions)
        },
        buildChildrenTree (x) {
            let _self = this
            let childrenNode = _.filter(this.pageOptions, (o) => { return x.id == o.parentId && x.id != o.id && o.parentId != 0 })
            x.children = childrenNode
            _.forEach(childrenNode, (y) => {
                _self.buildChildrenTree(y)
            })
        }

    }
}
</script>
<style>
  .roleInfoDialog {
    width: 700px;
    height:600px;
    padding-right: 20px;
  }
</style>
<style scoped>
  .demo-ruleForm{
    margin-bottom:10px;
  }
  .role_setting_item {
    margin-bottom: 18px;
    height: 30px;
  }
  .roleInfoDialog .item_label {
      width: 150px;
      text-align: right;
      font-size:12px;
  }
  .roleInfoDialog .item_span{
      font-size:12px;
  }

  .role_info_btns {
    margin-top:295px;
    text-align: center;
  }

  .role_setting_tree{
    height:300px;
    overflow-y:auto;
  }

</style>
