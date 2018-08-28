

var isDev = process.env.NODE_ENV === 'development'


var isLogin = (req,res) => {
    if(req.session.verify || !isDev){
        var resObj = {}
        resObj.success = false
        resObj.errCode = 1100
        resObj.message = "user not login !!!"
        res.send(resObj)
        return false
    }
    return true

}

exports = module.exports = {
    isDev,
    isLogin
}
