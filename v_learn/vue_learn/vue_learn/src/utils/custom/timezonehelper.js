var _msPerHour = 36E5
var _defaultDateFormat = 'dd/MM/yyyy'
var _serverTimeNow = new Date()
var _serverHoursOffset = (_serverTimeNow.getTimezoneOffset() / 60) * _msPerHour
var _isDate = (d) => {
    return d && Object.prototype.toString.call(d) === '[object Date]'
}
var updateServerSetting = function () {
    var timeNowEle = document.getElementById('timeNow')
    var timeOffsetEle = document.getElementById('rawOffset')
    if (timeNowEle && +timeNowEle.value) {
        _serverTimeNow = +timeNowEle.value
    }
    if (timeOffsetEle) {
        _serverHoursOffset = +timeOffsetEle.value || 0
    }
}

/**
 * 根据本地日期或正确日期格式类型，获取格式化服务器日期字符串
 * @param time 日期时间对象
 * @param fmt  格式化字符串
 * @returns {*}
 */
var getServerDateStrByLocal = function (time, fmt) {
    var tempDate = parseDate(time)
    if (!tempDate) {
        return ''
    }
    return formatDate(getServerDateByLocalDate(tempDate), fmt)
}

/**
 * 根据本地日期获取服务器端日期
 * @param loaclDate 本地日期
 * @returns {Date} 服务器日期
 */
var getServerDateByLocalDate = function (loaclDate) {
    updateServerSetting()
    _serverHoursOffset = _serverHoursOffset || 0
    var currentHours = loaclDate.getTime() + _serverHoursOffset + ((loaclDate.getTimezoneOffset() / 60) * _msPerHour)
    var dateMS = loaclDate.setTime(currentHours)
    return new Date(dateMS)
}

/**
 * 获取服务器端时间戳
 * @param dateObj {String、Date、Number} 服务器端日期对象或日期字符串
 * @param fmt  dateObj为String时，fmt生效
 * @returns {number} 时间戳
 */
var getServerTimestamp = function (dateObj, fmt) {
    var tempDate = parseDate(dateObj, fmt)
    if (tempDate) {
        if (fmt) {
            tempDate = getPartialDate(tempDate, fmt)
        }
        return getServerTimestampByServerDate(tempDate)
    }
    return 0
}

/**
 * 根据服务器日期获取服务器时区时间戳
 * @param serverDate  服务器日期
 * @returns {number} 服务器时间的时间戳
 */
var getServerTimestampByServerDate = function (serverDate) {
    updateServerSetting()
    _serverHoursOffset = _serverHoursOffset || 0
    var currentHours = serverDate.getTime() - _serverHoursOffset + ((-serverDate.getTimezoneOffset() / 60) * _msPerHour)
    var dateMS = serverDate.setTime(currentHours)
    return (new Date(dateMS)).getTime()
}

/**
 * 转换为本地日期
 * @param dateObj {String、Date、Number} 日期对象或日期字符串
 * @param fmt  dateObj为String时，fmt生效
 * @returns {*} 本地日期对象
 */
var parseDate = function (dateObj, fmt) {
    var tempDate
    if (_isDate(dateObj)) {
        return new Date(dateObj)
    } else if (typeof dateObj === 'number') {
        return new Date(dateObj)
    } else if (typeof dateObj === 'string' && fmt) {
        var time = dateObj
        var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0}
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
            time = time.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
                obj[$3] = parseInt(_$1)
                return ''
            })
            return ''
        })
        obj.M-- // 月份
        tempDate = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s)
        if (obj.S !== 0) {
            tempDate.setMilliseconds(obj.S)
        }
        return tempDate
    }
    return false
}

/**
 * 获取标准的格式化日期
 * @param d 时间
 * @returns {string}
 */
var formatDate = function (d, fmt = _defaultDateFormat) {
    var o = {
        'M+': d.getMonth() + 1, // 月份
        'd+': d.getDate(), // 日
        'h+': d.getHours(), // 小时
        'm+': d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
        'S': d.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
}

/**
 * 获取指定fmt格式的部分日期对象，例如：当dateObj为Date、frm为yyyy-MM-dd时返回日期只有年月日部分。
 * @param d {String、Date、Number} 日期对象或日期字符串
 * @param fmt  为空时获取日期全部内容，不为空时获取指定部分日期。
 * @returns {*} 指定格式部分日期对象，例如：指定为yyyy-MM只返回年月日期对象
 */
var getPartialDate = function (d, fmt) {
    if (!_isDate(d) || !fmt) {
        return d
    }
    var regArr = [
        {key: 'y', value: d.getFullYear(), matched: false},
        {key: 'M', value: d.getMonth(), matched: false},
        {key: 'd', value: d.getDate(), matched: false},
        {key: 'h', value: d.getHours(), matched: false},
        {key: 'm', value: d.getMinutes(), matched: false},
        {key: 's', value: d.getSeconds(), matched: false},
        {key: 'S', value: d.getMilliseconds(), matched: false}
    ]
    regArr.forEach(function (item) {
        if (fmt.indexOf(item.key) > -1) {
            item.matched = true
        }
    })
    var dArr = regArr.map(function (item) {
        return item.matched ? item.value : 0
    })
    var tempDate = new Date(dArr[0], dArr[1], dArr[2], dArr[3], dArr[4], dArr[5])
    if (dArr[6]) {
        tempDate.setMilliseconds(dArr[6])
    }
    return tempDate
}

let dateUtil = {
    getServerDateStrByLocal,
    getServerDateByLocalDate,
    getServerTimestamp,
    getServerTimestampByServerDate,
    parseDate,
    formatDate,
    getPartialDate
}

Object.defineProperty(dateUtil, 'serverHoursOffset', {
    get () {
        return _serverHoursOffset
    },
    set (newVal) {
        _serverHoursOffset = newVal
    },
    enumerable: true,
    configurable: true
})
Object.defineProperty(dateUtil, 'serverTimeNow', {
    get () {
        return _serverTimeNow
    },
    set (newVal) {
        _serverTimeNow = newVal
    },
    enumerable: true,
    configurable: true
})

export default dateUtil

