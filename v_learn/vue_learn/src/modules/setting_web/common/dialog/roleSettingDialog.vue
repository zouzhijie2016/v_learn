<template>
  <div>
    <el-dialog :title="title" custom-class="roleSettingDialog" :visible.sync="dataCloseVisible"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="160px" class="demo-ruleForm" v-loading="loading"
                 element-loading-text="Loading...">
          <div class="role_setting_item" style="overflow: hidden">
            <el-col :span="8">
              <label class="item_label">Country : </label>
              <span class="item_span">{{form.countryName}}</span>
            </el-col>
            <el-col :span="16">
              <label class="item_label">Company : </label>
              <span class="item_span">{{form.companyName}}</span>
            </el-col>
          </div>
          <el-form-item label="Role name" prop="roleName" class="role_setting_item">
            <el-input v-model.trim="form.roleName" placeholder="Input role name" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item label="Cost Setting" class="store_setting_item">
            <el-checkbox-group v-model="form.cost">
              <el-checkbox v-for="item in costSetting" :label="item" :key="item">{{item}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="Page Setting" class="role_setting_item" style="width:500px;height:auto">
            <el-input v-model="selectPage"></el-input>

            <el-tree v-if="isShowTree" v-loading="treeLoading" @check-change="treeNodeClick"   ref="pageTree" class="role_setting_tree" :data="permissionTree" show-checkbox node-key="id"
                     :filter-node-method="filterNode" :default-expand-all="true"
                     :default-checked-keys="permissionTreeList"
                     :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item class="role_setting_operate">

          </el-form-item>
        </el-form>
        <div class="store_setting_operate">
          <el-button type="primary" :disabled="roleId!='' && !isUpdateData" @click="saveRoleSetting('form')" :loading="saveLoading" class="operate_button">
            Save
          </el-button>
          <el-button @click="cancelRoleSetting('form')" class="operate_button">Cancel</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="message"
      :visible.sync="cancelDialogVisible"
      width="30%"
      center>
      <span>Information has been modify,</span>
      <span>are you sure to discard these changes?</span>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmCancel('form')">discard</el-button><el-button
        @click="cancel">No</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import Utils from '~utils/index'
import roleSettingApi from '~api/setting/roleSettingApi'
import _ from 'lodash'
export default {
    props: ['dataVisible', 'dataRoleId', 'refreshRole', 'dataType'],
    data () {
        let operateType = this.dataType != 'edit' ? 'create' : 'edit'
        var checkRoleName = (rule, value, callback) => {
            if (!this.isModifyRole && this.dataType != 'create') { callback(); return }
            let reg = new RegExp('^[ a-zA-Z0-9]+$')
            if (!reg.test(value)) {
                callback(new Error('Role name can only be numbers or letters.'))
                return false
            }
            if (value.length > 40) {
                callback(new Error('Length of role name cannot exceed 40.'))
                return false
            }
            roleSettingApi.isExistName({
                roleName: value,
                operateType: operateType,
                id: this.dataRoleId
            }).then(d => {
                if (d.success) {
                    callback()
                } else {
                    callback(new Error(d.message))
                }
            }).catch(e => {
                this.$showErrorMessage(e)
            })
        }
        return {
            title: 'role setting',
            dataCloseVisible: true,
            cancelDialogVisible: false,
            loading: false,
            saveLoading: false,
            treeLoading: false,
            isAutoRoleName: true,
            isShowTree: false,
            roleId: '',
            selectPage: '',
            costSetting: ['defaultCost', 'bananaCost', 'specialCost', 'retailCost'],
            form: {
                countryName: '',
                companyName: '',
                roleName: '',
                cost: [],
                page: []
            },
            permissionTreeList: [],
            permissionTree: [],
            fieldDatas: {},
            rules: {
                roleName: [
                    {required: true, message: 'Please select role name!', trigger: 'blur'}, { validator: checkRoleName, trigger: 'blur' }]
            },
            isUpdateData: false,
            pageOptions: [],
            defaultProps: {
                children: 'children',
                label: 'display'
            }
        }
    },
    watch: {
        dataCloseVisible () {
            this.$emit('update:dataVisible', this.dataCloseVisible)
            if (!this.dataCloseVisible) {
                this.$emit('update:dataRoleId', '')
            }
        },
        'selectPage': function (val) {
            this.$refs.pageTree.filter(val)
        },
        'form.roleName': function (val) {
            if (this.isModifyRole) {
                this.isUpdateData = true
            }
        },
        'form.cost': function (val) {
            if (this.isModifyRole) {
                this.isUpdateData = true
            }
        }
    },
    mounted () {
        this.roleId = this.dataRoleId
        this.initTitle()
        this.getRoleInfoDatas()
    },
    methods: {
        initTitle () {
            var _self = this
            switch (_self.dataType) {
                case 'edit':
                    _self.title = 'Edit ' + _self.title
                    break
                case 'copy':
                    _self.title = 'Copy ' + _self.title
                    break
                default:
                    _self.title = 'New ' + _self.title
                    break
            }
        },
        filterNode (value, data) {
            if (!value) return true
            return data.permissionName.indexOf(value) !== -1
        },
        treeNodeClick (obj) {
            if (this.isModifyRole && !this.isUpdateData) {
                this.isUpdateData = true
            }
        },
        getRoleInfoDatas () {
            var _self = this
            if (_self.roleId) {
                _self.loading = true
            }
            var getAllMenuPromise = new Promise(function (resolve) {
                _self.getAllMenu(function (data) {
                    resolve(data)
                })
            })
            var currentCompany = null
            if (_self.dataType == 'create') {
                currentCompany = new Promise(function (resolve) {
                    roleSettingApi.queryCurrentCompany().then(d => {
                        if (d.success && d.data) {
                            _self.form.companyName = d.data.companyName
                            _self.form.countryName = d.data.countryName
                        }
                        resolve()
                    })
                })
            }
            Promise.all([getAllMenuPromise, currentCompany]).then(function (arr) {
                if (_self.roleId) {
                    _self.getRoleInfoByID({roleId: _self.roleId})
                }
            }, function () {
                _self.loading = false
            })
        },
        getAllMenu (cb) {
            this.treeLoading = true
            roleSettingApi.queryPermissionTree().then(d => {
                this.treeLoading = false
                typeof cb === 'function' && cb.apply(this, arguments)
                if (d.success && d.data) {
                    this.pageOptions.splice(0)
                    this.pageOptions = this.pageOptions.concat(d.data)
                    this.setParmarsData(d.data)
                    if (!this.roleId) {
                        this.isShowTree = true
                    }
                }
            }).catch(e => {
                this.treeLoading = false
                typeof cb === 'function' && cb.apply(this, arguments)
            })
        },
        buildChildrenTree (x) {
            let _self = this
            let childrenNode = _.filter(this.pageOptions, (o) => { return x.id == o.parentId && x.id != o.id && o.parentId != 0 })
            x.children = childrenNode
            _.forEach(childrenNode, (y) => {
                _self.buildChildrenTree(y)
            })
        },
        setParmarsData (data) {
            var _self = this
            let firstNode = _.filter(data, (o) => { return o.parentId == 0 })
            _.forEach(firstNode, (x) => {
                _self.buildChildrenTree(x)
            })
            _self.permissionTree = firstNode
        },
        getRoleInfoByID () {
            var _self = this
            roleSettingApi.querySingleRole({
                id: _self.roleId
            }).then(d => {
                _self.loading = false
                if (d.success && d.data) {
                    d.data.defaultCost ? _self.form.cost.push('defaultCost') : ''
                    d.data.bananaCost ? _self.form.cost.push('bananaCost') : ''
                    d.data.retailCost ? _self.form.cost.push('retailCost') : ''
                    d.data.specialCost ? _self.form.cost.push('specialCost') : ''
                    _self.form.companyName = d.data.companyName
                    _self.form.countryName = d.data.countryName
                    _self.form.operateType = d.data.operateType
                    if (_self.dataType == 'edit') {
                        _self.form.roleName = d.data.roleName
                    }
                    _self.permissionTreeList.splice(0)
                    d.data.permissionTreeList && d.data.permissionTreeList.forEach(function (item) {
                        _self.permissionTreeList.push(parseInt(item.id))
                    })
                    _self.isShowTree = true
                    _self.$nextTick(() => {
                        _self.isModifyRole = true
                    })
                }
            })
        },
        saveRoleSetting (formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveLoading = true
                    let formatDatas = this.formatDatas()
                    if ((!this.roleId && this.dataType != 'edit') || (this.dataType == 'copy')) {
                        roleSettingApi.createRole(formatDatas).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Save role setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshRole')
                            } else {
                                this.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            this.saveLoading = false
                            this.$showErrorMessage(e)
                        })
                    } else {
                        roleSettingApi.updateRole(formatDatas).then(d => {
                            this.saveLoading = false
                            if (d.success) {
                                this.$showSuccessMessage('Update role setting success!')
                                this.$emit('update:dataVisible', false)
                                this.$emit('refreshRole')
                            } else {
                                this.$showErrorMessage(d)
                            }
                        }).catch(e => {
                            this.saveLoading = false
                            this.$showErrorMessage(e)
                        })
                    }
                }
            })
        },
        formatDatas () {
            let data = {}
            data.id = this.roleId
            data.roleName = this.form.roleName
            data.defaultCost = this.form.cost.indexOf('defaultCost') > -1
            data.bananaCost = this.form.cost.indexOf('bananaCost') > -1
            data.retailCost = this.form.cost.indexOf('retailCost') > -1
            data.specialCost = this.form.cost.indexOf('specialCost') > -1
            data.operateType = this.form.operateType
            data.permissionTreeList = this.$refs.pageTree.getCheckedNodes()
            return data
        },
        cancelRoleSetting () {
            if (!this.isUpdateData) {
                this.$emit('update:dataRoleId', '')
                this.$emit('update:dataVisible', false)
                return
            }
            this.cancelDialogVisible = true
        },
        confirmCancel (formName) {
            this.$refs[formName].resetFields()
            this.$emit('update:dataRoleId', '')
            this.$emit('update:dataVisible', false)
        },
        cancel () {
            this.$emit('update:dataRoleId', '')
            this.cancelDialogVisible = false
        }
    }
}
</script>
<style>
  .roleSettingDialog {
    width: 700px;
    padding-right: 20px;
  }

  .el-form-item__error {
    padding-top: 0px;
  }
</style>
<style scoped>
  .role_setting_item {
    margin-bottom: 18px;
  }
  .role_setting_tree{
    height:400px;
    overflow-y:auto;
  }

  .role_setting_item .item_label {
      width: 150px;
      text-align: right;
      font-size:12px;
  }
  .role_setting_item .item_span{
      font-size:12px;
  }

  .role_setting_operate .operate_button {
    margin-right: 100px;
  }

  .setting_add_div {
    height: auto;
    display: inline-block;
  }
  .store_setting_operate{
    width:400px;
    text-align: center;
    margin:0 auto;
  }
  .operate_button{
    margin:30px 30px 0px;
  }

</style>
