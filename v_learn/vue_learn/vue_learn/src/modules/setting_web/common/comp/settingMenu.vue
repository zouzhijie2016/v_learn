<template>
  <div>
        <el-menu :default-active="urlPermiss" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="light" router>
          <el-submenu v-for="node in navNode" :key="node.id" :index="''+node.id" class="first_menu" >
              <template slot="title"><i v-bind:class="setIcon(node.shortName)"></i>{{node.description}}</template>
              <el-menu-item-group>
              <el-menu-item v-for="child in node.children" :key="child.id" :index="''+child.shortName" :route="child.route" >{{child.description}}</el-menu-item>
              </el-menu-item-group>
          </el-submenu>
        </el-menu>
  </div>
</template>
<script>
import commonApi from '~api/commonapi'
import {mapState} from 'vuex'
import _ from 'lodash'
export default {
    props: ['urlPermiss'],
    data () {
        return {
            _navNode:[],
        }
    },
    computed: {
        ...mapState([
            'navTrees',
        ])
    },
    created () {
        document.title = 'Setting | OCMS-BIM'
        // this.getSettingPermission()
       // this.setSelectedMenu()
        this.buildTree(8);
    },
    activated () {
        this.setSelectedUrl()
    },
    methods: {
        buildTree(rootId){
          let _navNode =[];
          let firstNode = _.filter(this.navTrees, (o)=> { return o.parentId == rootId; });
          _.forEach(firstNode,(x)=>{
            let sNode = _.filter(this.navTrees, (z)=> { return z.parentId == x.id; });
            _.forEach(sNode, function(n) {
                n.route = {};
                n.route.name = n.vueName;
            });
            sNode = _.sortBy(sNode, [(a) => { return a.seqId }])
            x.children = sNode;
            _navNode.push(x);
          })
          _navNode = _.sortBy(_navNode, [(a) => { return a.seqId }])
          this.navNode = _navNode;
          console.log(this.navNode);
        },
        getSettingPermission () {
            commonApi.getSettingPermission().then(d => {
                if (!d.data) {
                    this.showNoPermissionMessage('There is no access permission')
                }
            }).catch(e => {
                this.$showErrorMessage(e.message)
            })
        },
        setSelectedUrl () {
            this.selectedUrl = location.href
        },
	    /*setSelectedMenu(){
        	var _self = this;
		    let menuUrl = location.hash.replace("#/","");
            switch (menuUrl){
                case"companySetting":
	                _self.urlPermiss = "USER_SETTING";
                	break;
                case"storeSetting":
	                _self.urlPermiss = "STORE_SETTING";
                	break;
	            case"roleSetting":
		            _self.urlPermiss = "ROLE_SETTING";
		            break;
	            case"userSetting":
		            _self.urlPermiss = "USER_SETTING";
		            break;
	            case"_dev":
		            _self.urlPermiss = "_dev";
		            break;
            }
        },*/
        handleOpen (key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose (key, keyPath) {
            console.log(key, keyPath)
        },
        showNoPermissionMessage (msg) {
            this.$message({
                showClose: true,
                message: msg || 'There is no access',
                type: 'error',
                onClose: () => {
                    location.href = '/user_web/index.html#/login'
                }
            })
        },
	    setIcon (name) {
		    let iconName = '';
		    switch (name) {
			    case 'companyNav':
				    iconName = 'set-company setting-menu-icon'
				    break
			    case 'storeNav':
				    iconName = 'set-store setting-menu-icon'
				    break
			    case 'roleNav':
				    iconName = 'set-role setting-menu-icon'
				    break
			    case 'userNav':
				    iconName = 'set-user setting-menu-icon'
				    break
			    case 'devNav':
				    iconName = 'set-company setting-menu-icon'
				    break
		    }
            return iconName
	    },
    }
}
</script>
<style>
  .first_menu .el-submenu__title{
    font-size:12px;
  }
  .el-menu{
    background-color: #fff;
  }
  .el-menu-item{
    font-size:12px;
  }
</style>
<style scoped>
  a{
    display: block;
  }

</style>
