/**
 * author: linq
 * at 2017/11/11
 * 配合input type=number使用，可以比较完美控制数字输入，而不会误输入非数值字符：
 1、支持两个modifies
     A：unsign 表示无符号
     B：undigit 表示整数
 2、只允许规则内数值字符粘贴，无效数值不能粘贴
 3、配合通用样式common_theme 兼容现有主题风格
 4、配合type为number原生输入框，过滤掉中文输入法无效输入
 5、精确控制小数点和负号输入，包括输入的位置控制

 Demo：输入包括0 的正整数
 <input type="number" class="common_theme" v-number.unsign.undigit  v-model="myDirectiveValue" placeholder="请输入内容"></input>
 *
 */

import {getCaretPosition} from '../custom/caretpositionhelper'

function isNumberKeyCode (code) {
    return (code >= 48 && code <= 57) || (code >= 96 && code <= 105)
}

function isCtrlComposeKeyCode (e) {
    return e.ctrlKey && e.keyCode !== 17 && e.keyCode !== 229
}

function isVirtualKeyCode (code) {
    return (code >= 33 && code <= 40) || // up/down/left/right/home/end/pgup/pgdn
        code == 8 || // BackSpace
        code == 46 || // Delete
        code == 13 // Enter
}

function isSignKeyCode (code) {
    return code == 189 || code == 109
}

function isDigitKeyCode (code) {
    return code == 110 || code == 190
}

function isExistSignChar (value) {
    return value.indexOf('-') > -1
}

function isExistDigitChar (value) {
    return value.indexOf('.') > -1
}

function trim (str) {
    return ((str + '') || '').replace(/(^\s*)|(\s*$)/g, '')
}

function preventInput (e) {
    if (e.preventDefault) {
        e.preventDefault()
    } else {
        e.returnValue = false
    }
    e.stopImmediatePropagation()
    e.stopPropagation()
    return false
}

export default {
    bind (el, binding) {
        let isHasSign = !binding.modifiers.unsign
        let isHasDigit = !binding.modifiers.undigit
        let hasDigit = binding.modifiers.digit
        binding.keydownInputHandle = function (e) {
            var keyCode = e.keyCode
            var target = e.target
            var value = target.value + '';
            var caretIndex = getCaretPosition(target)
            console.log(caretIndex, 'xxxxxxx');
            if (isCtrlComposeKeyCode(e) || isVirtualKeyCode(keyCode)) {
                return true
            }
            if (isNumberKeyCode(keyCode)) {
                if (isExistSignChar(value) && caretIndex === 0) {
                    return preventInput(e)
                }
                if(!isExistDigitChar(value)){
                    return true
                }
            }
            if (isHasSign && isSignKeyCode(keyCode)) {
                if (isExistSignChar(value)) {
                    return preventInput(e)
                } else {
                    if (caretIndex) {
                        return preventInput(e)
                    }
                }
                return true
            }
            if(hasDigit){
                let digitLen = value.indexOf('.');
                let len = value.length;
                if(isDigitKeyCode(keyCode)){
                    if (isExistDigitChar(value)) {
                        return preventInput(e)
                    }else{
                        if(digitLen < 0){
                            if(caretIndex == 0){
                                if((len - digitLen) > 2){
                                    return preventInput(e)
                                }else{
                                    return true
                                }
                            }else if((len - caretIndex) > 2 || (len - caretIndex) < -1){
                                return preventInput(e)
                            }else{
                                return true
                            }
                        }else{
                            if((len - digitLen) > 3){
                                return true
                            }else{
                                return preventInput(e)
                            }
                        }
                    }
                }else{
                    if(isExistDigitChar(value)){
                        if(digitLen >= caretIndex){
                            return true
                        }else if((len - digitLen) > 2){
                            return preventInput(e)
                        }else{
                            return true
                        }
                    }else{
                        return true
                    }
                }
            }
            if (isHasDigit && isDigitKeyCode(keyCode)) {
                if (isExistDigitChar(value)) {
                    return preventInput(e)
                } else {
                    if (isExistSignChar(value) && !caretIndex) {
                        return preventInput(e)
                    }
                }
                return true
            }
            return preventInput(e)
        }
        binding.pasteInputHandle = function (e) {
            var clipboardData = e.clipboardData || window.clipboardData
            if (clipboardData) {
                let resultValueArr = []
                let target = e.target
                let value = target.value
                let pasteText = trim(clipboardData.getData('text'))
                if (pasteText) {
                    let caretIndex = getCaretPosition(target)
                    if (caretIndex) {
                        resultValueArr.push(trim(value.substring(0, caretIndex)))
                    }
                    resultValueArr.push(trim(pasteText))
                    resultValueArr.push(trim(value.substring(caretIndex)))
                    value = +resultValueArr.join('')
                    if (isNaN(value)) {
                        return preventInput(e)
                    }
                    if (!isHasSign && value < 0) {
                        return preventInput(e)
                    }
                    if(hasDigit){
                        if((/^(\d+(\.\d{1,2}))|(\d+)$/.test(value))){
                            return true
                        }else{
                            return preventInput(e)
                        }
                    }
                    if (!isHasDigit && /\./.test(value + '')) {
                        return preventInput(e)
                    }
                }
            }
            return true
        }
        el.addEventListener('keydown', binding.keydownInputHandle)
        el.addEventListener('paste', binding.pasteInputHandle)
    },
    unbind (el, binding) {
        el.removeEventListener('keydown', binding.keydownInputHandle)
        el.removeEventListener('paste', binding.pasteInputHandle)
    }
}
