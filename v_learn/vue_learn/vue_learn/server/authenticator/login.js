var speakeasy = require('speakeasy')
var config = require('../config')

exports = module.exports = (req,res) => {
    var resObj = {}
    if(req.query.token){
        var userToken = req.query.token
        var verified = speakeasy.totp.verify({
            secret: config.LOGIN_PRIVATE_SECRET,
            encoding: 'base32',
            token: userToken
        })
        if(verified){
            resObj.success = true
            req.session.verify = true
        }else{
            resObj.success = false
            resObj.errCode = 1100
            resObj.message = "token denied !!!"
        }
    }else{
        resObj.success = false
        resObj.errCode = 1101
        resObj.message = "token empty !!!"
    }
    res.send(resObj)
}
