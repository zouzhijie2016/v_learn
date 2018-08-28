var formatToNumber = function (value) {
    if (value) {
        return value.split(',').join('')
    } else {
        return value
    }
}

var formatToThousands = function (value) {
    if (value) {
        var parts
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            parts = value.toString().split('.')
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (','))

            return parts.join('.')
        }
        return NaN
    } else {
        return value
    }
}

export default {
    formatToNumber,
    formatToThousands
}

