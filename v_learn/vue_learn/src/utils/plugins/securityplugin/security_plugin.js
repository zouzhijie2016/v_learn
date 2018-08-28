
import _ from 'lodash'

class Acl {
    init (router, permissions, roleList,debug) {
		this.debug = debug
        this.router = router
        this.permissions = permissions || []
        this.roleList = roleList || []
    }
    checkRole (roleName) {
		let debug = this.debug
		if(debug){
			return true
		}
        if (roleName == undefined) { return false }
        let roleList = this.roleList
        if (roleName.indexOf('&&') !== -1) {
            let roleNameAnd = roleName.split('&&')
            return roleNameAnd.every((o) => { return _.indexOf(roleList, _.trim(o)) !== -1 })
        }
        if (roleName.indexOf('||') !== -1) {
            let roleNameOr = roleName.split('||')
            return roleNameOr.some((o) => { return _.indexOf(roleList, _.trim(o)) !== -1 })
        }
        return _.indexOf(roleList, roleName) !== -1
    }
    checkPermission (pem) {
		let debug = this.debug
		if(debug){
			return true
		}
        if (pem == undefined) { return false }
        let permissions = this.permissions
        if (pem.indexOf('&&') !== -1) {
            let pemAnd = pem.split('&&')
            return pemAnd.every((o) => { return _.indexOf(permissions, _.trim(o)) !== -1 })
        }
        if (pem.indexOf('||') !== -1) {
            let pemOr = pem.split('||')
            return pemOr.some((o) => { return _.indexOf(permissions, _.trim(o)) !== -1 })
        }
        return _.indexOf(permissions, pem) !== -1
    }
    setRole (roleName) {
      let arrRoleName = Array.prototype.concat(roleName);
      let roleList = this.roleList
      _.forEach(arrRoleName,(r) =>{
        if(_.indexOf(roleList, r) !== -1){
          roleList.push(r)
        }
      })
      this.roleList = roleList;
    }
    setRole (pem) {
      let arrPem = Array.prototype.concat(pem);
      let permissions = this.permissions
      _.forEach(arrPem,(p) =>{
        if(_.indexOf(permissions, p) !== -1){
          permissions.push(r)
        }
      })
      this.permissions = permissions;
    }
    // 这里是在页面跳转的时候 进行校验。。时间关系。后面补上
    // set router(router) {
    //     router.beforeEach((to, from, next) => {
    //         console.log(to);
    //         console.log(from);
    //         return next()
    //     })
    // }
}

let acl = new Acl()

Acl.install = (Vue, {router, permissions, roleList,debug = false}) => {
    acl.init(router, permissions, roleList,debug)
    Vue.prototype.$hasPermission = (permission) => acl.checkPermission(permission)
    Vue.prototype.$hasRole = (roleName) => acl.checkRole(roleName)

    Vue.prototype.$setRole = (roleName) => acl.setRole(roleName)
    Vue.prototype.$setPermission = (permission) => acl.setPermission(roleName)
    Vue.directive('security', function (el, binding) {
        if(binding.value){
            let securityObj = typeof(binding.value) === 'string' ? JSON.parse(binding.value) : binding.value;
            let permission = securityObj.permission
            if (permission && !acl.checkPermission(permission)) {
                el.innerHTML="";
                el.parentNode &&  el.parentNode.removeChild(el);
                return;
            }
            let role = securityObj.role
            if (role && !acl.checkRole(role)) {
                el.innerHTML="";
                el.parentNode && el.parentNode.removeChild(el);
                return;
            }
          }
    })
}

export default Acl
