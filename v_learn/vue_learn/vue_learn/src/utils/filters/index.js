// 精确到10位小数点
let hackValue = Math.pow(0.1, 10)
let filters = {
    toDicimal (value, digit = 2) {
        if (isNaN(parseFloat(value))) {
            return NaN
        }
        digit = parseInt(digit < 0 ? 0 : digit)

        var f = Math.round((parseFloat(value) + hackValue) * Math.pow(10, digit)) / Math.pow(10, digit)
        var s = f.toString()

        // 不足小数点后面的0位数
        var rs = s.indexOf('.')
        if (rs < 0 && digit > 0) {
            rs = s.length
            s += '.'
            while (s.length <= rs + digit) {
                s += '0'
            }
        }
        return s
    }
}

export default {
    install (Vue) {
        Object.keys(filters).forEach(key => {
            Vue.filter(key, filters[key])
        })
    }
}
