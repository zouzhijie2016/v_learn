
/**
 * Get all property names by walking up prototype chain
 * @param {*} obj
 * @return {array}
 */
function getAllPropertyNames (obj) {
    let props = []
    do {
        Object.getOwnPropertyNames(obj).forEach((prop) => {
            if (props.indexOf(prop) === -1) { props.push(prop) }
        })
    } while (obj = Object.getPrototypeOf(obj))

    return props
}

/**
 * A copy of auto-bind for debugging.
 * @param {object} self - object to bind its own functions to
 * @return {this}
 */
export default function (self) {
    for (const key of getAllPropertyNames(self)) {
        const val = self[key]

        if (key !== 'constructor' &&
          typeof val === 'function' &&
          (!/^bound /g.test(self[key].name))) {
            self[key] = val.bind(self)
        }
    }
    return self
}
