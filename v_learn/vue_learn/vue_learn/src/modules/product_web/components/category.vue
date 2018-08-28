<template>
  <div class="category_box" @click="recoverInput">
    <div class="category_box_operate">
      <el-row>
        <el-col :span="4">
          <el-button v-if="$hasPermission('catalogCatalogCreate')"  type="primary" icon="el-icon-plus" @click="createCategory">Create</el-button>
        </el-col>
        <el-col :span="2" :offset="16">
          <span @click="refreshCategory" class="category_operate_span">Refresh</span>
        </el-col>
        <el-col :span="2">
          <span @click="refreshCategory" class="category_operate_span">Collapse All</span>
        </el-col>
      </el-row>
    </div>
    <div class="category_box_tree">
      <div class="category_box_title">
        <span class="box_title_dialog">Feature Relation</span>
        <span class="box_title_operate">Operation</span>
        <span class="box_title_date">Created Date</span>
        <span class="box_title_categoryId">Category ID</span>
        <span class="box_title_label">Category Name</span>
        <span class="box_title_move">Move</span>
      </div>
      <div class="category_box_loading" v-show="categoryList.length==0" v-loading="loading"
           element-loading-text="Loading..."></div>
      <template v-if="categoryList.length>0">
        <el-tree
          :data="categoryList"
          v-loading="loading"
          element-loading-text="Loading..."
          :props="defaultProps"
          empty-text="no data"
          :default-expanded-keys="expandArrays"
          :expand-on-click-node="false"
          node-key="categoryId"
          :render-content="renderContent">
        </el-tree>
      </template>
    </div>
    <edit-category-dialog v-if="categoryDialogFormVisible" :dataVisible.sync="categoryDialogFormVisible"
                          :categoryId.sync="categoryIdData"
                          :parentCategoryId.sync="parentCategoryIdData"></edit-category-dialog>
    <create-category-dialog v-if="createCategoryDialogFormVisible"
                            :createDataVisible.sync="createCategoryDialogFormVisible"
                            :parentCategoryList.sync="firstCategory"
                            v-on:refreshList="refreshCategory"></create-category-dialog>
  </div>
</template>
<script>
import productApi from '~api/productapi'
import editCategoryDialog from './editCategoryDialog.vue'
import createCategoryDialog from './createCategoryDialog.vue'
import Utils from '~utils/index'
export default {
    data () {
        return {
            isCollapse: false,
            isRefresh: false,
            categoryIdData: '',
            categoryDialogFormVisible: false,
            createCategoryDialogFormVisible: false,
            formatDatas: [],
            expandArrays: [],
            firstCategory: [],
            newStoreArrs: [],
            categoryList: [],
            defaultProps: {
                label: 'categoryName',
                children: 'children',
                id: 'categoryId'
            },
            isEdit: false,
            loading: true
        }
    },
    components: {
        editCategoryDialog,
        createCategoryDialog
    },
    mounted () {
        this.listClassfication()
    },
    methods: {
        recoverInput () {
            this.setEditToReading(this.categoryList)
        },
        filterNode (value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        refreshCategory () {
            this.listClassfication()
        },
        editCategoryName (store, data, node) {
            this.setEditToReading(store.data)
            data.isEdit = true
        },
        setEditToReading (data) {
            data.map(function (item) {
                item.isEdit = false
                if (item.children && item.children.length > 0) {
                    item.children.map(function (val) {
                        val.isEdit = false
                        if (val.children && val.children.length > 0) {
                            val.children.map(function (value) {
                                value.isEdit = false
                            })
                        }
                    })
                }
            })
        },
        setCategoryName (data) {
            if (event.keyCode == 13) {
                data.categoryName = event.target.value
                data.categoryName = data.categoryName.replace(/(^\s*)|(\s*$)/g, '')
                data.isEdit = false
                var obj = {
                    categoryId: data.categoryId,
                    categoryName: data.categoryName,
                    parentCategoryId: data.parentCategoryId
                }
                productApi.editProductCategory(obj).then(d => {
                    if (d.success) {
                        this.$message({
                            message: 'edit success',
                            type: 'success'
                        })
                        data.categoryId = d.data.categoryId
                        data.categoryName = d.data.categoryName
                    } else {
                        this.showErroMessage(d.message)
                    }
                }).catch(e => {
                    this.showErroMessage(e)
                })
            }
        },
        removeCategory (store, data) {
            this.$confirm('Do you want to delete?', '', {
                confirmButtonText: 'confirm',
                cancelButtonText: 'cancle',
                type: 'warning'
            }).then(() => {
                var obj = {categoryId: data.categoryId, parentProductCategoryId: data.parentCategoryId}
                productApi.deleteProductCategory(obj).then(d => {
                    if (d.success) {
                        this.$message({
                            message: 'delete success',
                            type: 'success'
                        })
                        store.remove(data)
                    } else {
                        this.showErroMessage(d.message)
                    }
                }).catch(e => {
                    this.showErroMessage(e)
                })
            })
        },
        editCategory (store, data, node) {
            this.categoryDialogFormVisible = true
            this.categoryIdData = data.categoryId
            this.parentCategoryIdData = data.parentCategoryId
        },
        moveDownCategory (store, data, node) {
            if (node.level == 1 && store.data.length == data.sequenceNum) {
                return
            }
            if (node.level == 2 || node.level == 3) {
                var parentLength = node.parent.data.children.length
                if (data.sequenceNum == parentLength) {
                    return
                }
            }
            this.loading = true
            this.newStoreArrs.splice(0)
            this.newStoreArrs = this.newStoreArrs.concat(this.categoryList)
            this.getDownVal(node.level, data.categoryId, data.parentCategoryId)
            this.moveForData(store, node.level, data)
        },
        moveForData (store, type, currentData) {
            var _self = this
            var parentSeqNum = ''
            switch (type) {
                case 1:
                    _self.newStoreArrs.map(function (item, index) {
                        item.sequenceNum = index + 1
                    })
                    _self.formatDatas.splice(0)
                    _self.formatDatas = _self.formatDatas.concat(_self.newStoreArrs)
                    break
                case 2:
                    _self.formatDatas.splice(0)
                    _self.newStoreArrs.map(function (item) {
                        if (item.categoryId == currentData.parentCategoryId) {
                            for (let i = 0; i < item.children.length; i++) {
                                item.children[i].sequenceNum = i + 1
                            }
                            _self.formatDatas = _self.formatDatas.concat(item.children)
                            parentSeqNum = item.categoryId
                            return
                        }
                    })
                    break
                case 3:
                    _self.formatDatas.splice(0)
                    _self.newStoreArrs.map(function (item) {
                        item.children.map(function (val) {
                            if (val.categoryId == currentData.parentCategoryId) {
                                for (let i = 0; i < val.children.length; i++) {
                                    val.children[i].sequenceNum = i + 1
                                }
                                _self.formatDatas = _self.formatDatas.concat(item.children)
                                parentSeqNum = val.categoryId
                                return
                            }
                        })
                    })
                    break
            }
            productApi.moveProductCategory({categoryJSONArr: _self.formatDatas}).then(d => { // 移动
                _self.loading = false
                if (d.success) {
                    _self.$message({
                        message: 'move success',
                        type: 'success'
                    })
                    _self.categoryList.splice(0)
                    _self.categoryList = _self.categoryList.concat(_self.newStoreArrs)
                    _self.expandArrays.splice(0)
                    _self.expandArrays = _self.expandArrays.concat(parentSeqNum)
                    store.data.splice(0)
                    store.data = store.data.concat(_self.categoryList)
                    console.dir(store.data)
                } else {
                    _self.showErroMessage(d.message)
                }
            }).catch(e => {
                _self.loading = false
                _self.showErroMessage(e)
            })
        },
        getDownVal (level, categoryId, parentId) {
            switch (level) {
                case 1:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        if (this.newStoreArrs[i].categoryId == categoryId) {
                            var temp1 = {}
                            temp1 = this.newStoreArrs[i + 1]
                            this.newStoreArrs[i + 1] = this.newStoreArrs[i]
                            this.newStoreArrs[i] = temp1
                            return
                        }
                    }
                    break
                case 2:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        if (this.newStoreArrs[i].categoryId == parentId) {
                            var children1 = this.newStoreArrs[i].children
                            for (let vkey in children1) {
                                if (children1[vkey].categoryId == categoryId) {
                                    var temp2 = {}
                                    temp2 = children1[parseInt(vkey) + 1]
                                    children1[parseInt(vkey) + 1] = children1[vkey]
                                    children1[vkey] = temp2
                                    return
                                }
                            }
                        }
                    }
                    break
                case 3:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        for (let j = 0; j < this.newStoreArrs[i].children.length; j++) {
                            if (this.newStoreArrs[i].children[j].categoryId == parentId) {
                                var children2 = this.newStoreArrs[i].children[j].children
                                for (let ckey in children2) {
                                    if (children2[ckey].categoryId == categoryId) {
                                        var temp3 = {}
                                        temp3 = children2[parseInt(ckey) + 1]
                                        children2[parseInt(ckey) + 1] = children2[ckey]
                                        children2[ckey] = temp3
                                        return
                                    }
                                }
                            }
                        }
                    }
                    break
            }
        },
        getUpVal (level, categoryId, parentId) {
            switch (level) {
                case 1:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        if (this.newStoreArrs[i].categoryId == categoryId) {
                            var utemp1 = {}
                            utemp1 = this.newStoreArrs[i - 1]
                            this.newStoreArrs[i - 1] = this.newStoreArrs[i]
                            this.newStoreArrs[i] = utemp1
                            return
                        }
                    }
                    break
                case 2:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        if (this.newStoreArrs[i].categoryId == parentId) {
                            var uchildren1 = this.newStoreArrs[i].children
                            for (let vkey in uchildren1) {
                                if (uchildren1[vkey].categoryId == categoryId) {
                                    var utemp2 = {}
                                    utemp2 = uchildren1[parseInt(vkey) - 1]
                                    uchildren1[parseInt(vkey) - 1] = uchildren1[vkey]
                                    uchildren1[vkey] = utemp2
                                    return
                                }
                            }
                        }
                    }
                    break
                case 3:
                    for (let i = 0; i < this.newStoreArrs.length; i++) {
                        for (let j = 0; j < this.newStoreArrs[i].children.length; j++) {
                            if (this.newStoreArrs[i].children[j].categoryId == parentId) {
                                var uchildren2 = this.newStoreArrs[i].children[j].children
                                for (let ckey in uchildren2) {
                                    if (uchildren2[ckey].categoryId == categoryId) {
                                        var utemp3 = {}
                                        utemp3 = uchildren2[parseInt(ckey) - 1]
                                        uchildren2[parseInt(ckey) - 1] = uchildren2[ckey]
                                        uchildren2[ckey] = utemp3
                                        return
                                    }
                                }
                            }
                        }
                    }
                    break
            }
        },
        moveUpCategory (store, data, node) {
            if (data.sequenceNum == 1) {
                return
            }
            this.loading = true
            this.newStoreArrs.splice(0)
            this.newStoreArrs = this.newStoreArrs.concat(this.categoryList)
            this.getUpVal(node.level, data.categoryId, data.parentCategoryId)
            this.moveForData(store, node.level, data)
        },
        createCategory () {
            this.createCategoryDialogFormVisible = true
        },
        formatTimeForTimestamp (time) {
            return Utils.getServerDateStrByLocal(time, 'dd/MM/yyyy hh:mm:ss')
        },
        formatTimeToTimestamp (time) {
            var newD = new Date(time)
            var d = Utils.getServerTimestampByServerDate(newD)
            return d
        },
        listClassfication () {
            this.loading = true
            productApi.getClassficationList().then(d => {
                this.loading = false
                if (d.success && d.data && d.data.productCategoryBeanMap) {
                    this.categoryList.splice(0)
                    this.categoryList = this.categoryList.concat(this.setSourceData(d.data.productCategoryBeanMap))
                }
            }).catch(e => {
                this.loading = false
                this.showErroMessage(e)
            })
        },
        setTargetData (currentData, data, type) {
            var formatData = []
            switch (type) {
                case 1:
                    data.map(function (item) {
                        formatData.push({
                            'categoryId': item.categoryId,
                            'categoryName': item.categoryName,
                            'createTime': item.createTime,
                            'parentCategoryId': item.parentCategoryId,
                            'sequenceNum': item.sequenceNum
                        })
                    })
                    break
                case 2:
                    var parentD = currentData.parentCategoryId
                    formatData = data.filter(function (item) {
                        return item.categoryId == parentD
                    })
                    break
                case 3:
                    break
            }
            return formatData
        },
        setSourceData (data) {
            var source = []
            // 获得第一层目录
            for (var firstIndex in data) {
                var temp1 = data[firstIndex]
                temp1.isEdit = false
                if (temp1.parentCategoryId == 'DefaultRootCategory') {
                    var time1 = temp1.createTime
                    temp1.fixCreateTime = this.formatTimeForTimestamp(time1)
                    source.push(temp1)
                    this.firstCategory = source
                    this.firstCategory = this.setGroupBy(this.firstCategory.sort(this.sortCompare('sequenceNum')))
                }
            }
            source.sort(this.sortCompare('sequenceNum'))
            for (var i = 0; i < source.length; i++) {
                var firstCategoryId = source[i].categoryId
                var secondCategory = []
                source[i].children = secondCategory
                // 把二级类目放入相应的一级
                for (var eachCategory1 in data) {
                    var temp2 = data[eachCategory1]
                    temp2.isEdit = false
                    if (temp2.parentCategoryId == firstCategoryId) {
                        var time2 = temp2.createTime
                        temp2.fixCreateTime = this.formatTimeForTimestamp(time2)
                        secondCategory.push(temp2)
                    }
                }
                secondCategory = this.setGroupBy(secondCategory.sort(this.sortCompare('sequenceNum')))
            }

            for (var m = 0; m < source.length; m++) {
                var second = source[m].children
                // 循环所有的二级菜单
                for (var n = 0; n < second.length; n++) {
                    var secondCategoryId = second[n].categoryId
                    var thirdCategory = []
                    second[n].children = thirdCategory
                    // 把三级类目放入相应的二级
                    for (var eachCategory2 in data) {
                        var temp3 = data[eachCategory2]
                        temp3.isEdit = false
                        if (temp3.parentCategoryId == secondCategoryId) {
                            var time3 = temp3.createTime
                            temp3.fixCreateTime = this.formatTimeForTimestamp(time3)
                            thirdCategory.push(temp3)
                        }
                    }
                    thirdCategory = this.setGroupBy(thirdCategory.sort(this.sortCompare('sequenceNum')))
                }
            }
            for (var no in data) {
                data[no].title = data[no].categoryName
                data[no].key = data[no].categoryId
            }
            console.dir(source)
            return source
        },
        setGroupBy (val) {
            val.map(function (item, index) {
                item.sequenceNum = index + 1
            })
            return val
        },
        sortCompare (property) {
            return function (a, b) {
                var value1 = a[property]
                var value2 = b[property]
                if (value1 < value2) {
                    return -1
                } else if (value1 > value2) {
                    return 1
                } else {
                    return 0
                }
            }
        },
        showOrshrinkCategory (node) {
            if (node.expanded) {
                node.expanded = false
            } else {
                node.expanded = true
            }
        },
        renderContent (h, {node, data, store}) {
          return (
               <span class="category_tree">
                  <span class="category_tree_label">
                      <span on-click={ () => this.showOrshrinkCategory(node) }>
                          {data.isEdit ? <input type="text" value={data.categoryName} class="categroy_tree_labelInput" onKeyup={ () => this.setCategoryName(data)}/> : node.label}
                      </span>
                  </span>
                  <span class="category_tree_name">
                      <el-button v-security='{"permission":"catalogCatalogEdit"}' size="mini" on-click={ () => this.editCategory(store, data) }  plain >View Or Edit</el-button>
                  </span>
                  <span class="category_tree_name">
                      <el-button v-security='{"permission":"catalogCatalogEdit"}' size="mini"  plain on-click={ () => this.editCategoryName(store, data, node) }>Edit</el-button>
                      <el-button v-security='{"permission":"catalogCatalogDelete"}' size="mini" on-click={ () => this.removeCategory(store, data) }  plain>Delete</el-button>
                  </span>
                  <span class="category_tree_name">
                      <span>{data.fixCreateTime}</span>
                  </span>
                  <span class="category_tree_name">
                      <span>{data.categoryId}</span>
                  </span>
                  <span class="category_tree_move">
                      <span class="el-icon-arrowdown" on-click={ () => this.moveDownCategory(store, data, node)}></span>
                      <span class="el-icon-arrowup" on-click={ () => this.moveUpCategory(store, data, node)}></span>
                  </span>
              </span>
            )
        },
        showErroMessage (err) {
            this.$showErrorMessage(err)
        }
    }
}
</script>
<style scope>
  .category_box {
    background-color: #fff;
    border: 1px solid #dbdbdb;
  }

  .category_box_operate {
    padding: 24px 12px 8px 24px;
  }

  .category_box_loading {
    height: 80px;
    text-align: center;
  }

  .category_operate_span {
    cursor: pointer;
  }

  .category_box_data {
    text-align: center;
    line-height: 40px;
  }

  .el-tree-node__content {
    height: 40px;
    border-bottom: 1px solid rgb(223, 234, 236);
    font-size: 12px;
  }

  .el-tree-node__expand-icon {
    border-left-width: 9px;
  }

  .category_tree_arrow {
    display: inline-block;
  }

  .category_box_tree {
    padding: 14px 24px 24px;
  }

  .category_box_title {
    background: rgb(238, 244, 246);
    overflow: hidden;
  }

  .category_box_title > span {
    display: inline-block;
    width: 130px;
    float: right;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: bold;
    margin-right: 20px;
  }

  .category_box_title .box_title_label {
    float: left;
    display: inline-block;
    width: 32%;
  }

  .category_box_title .box_title_move {
    float: left;
    display: inline-block;
    width: 8%;
  }

  /*.category_box_title .box_title_create{
    float:left;
    display: inline-block;
    width:17%;
  }*/
  .category_tree_label {
    display: inline-block;
    width: 32%;
  }

  .category_tree_move {
    display: inline-block;
    width: 8%;
    margin-right: 20px;
  }

  /*.category_tree_append{
    display: inline-block;
    width:20%;
    margin-right:20px;
  }*/
  .category_tree_name {
    display: inline;
    width: 127px;
    vertical-align: middle;
    float: right;
    height: 40px;
    line-height: 40px;
    margin-right: 20px
  }

  .categroy_tree_labelInput {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfd3d9;
    box-sizing: border-box;
    color: #1f363d;
    display: inline-block;
    font-size: inherit;
    height: 30px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  }
  .category_tree{
    width: 100%;
  }
</style>
