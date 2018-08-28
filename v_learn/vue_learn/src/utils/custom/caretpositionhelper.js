function getCaretPosition (target) {
    var caretPos = 0
    if (document.selection) {
        target.focus()
        var Sel = document.selection.createRange()
        Sel.moveStart('character', -target.value.length)
        caretPos = Sel.text.length
    } else if ('selectionStart' in target) { // Firefox support
        caretPos = target.selectionStart
    }
    return caretPos
}

// 设置光标位置
function setCaretPosition (target, pos) {
    if (target.setSelectionRange) {
        target.focus()
        target.setSelectionRange(pos, pos)
    } else if (target.createTextRange) {
        var range = target.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
    }
}

export {
    getCaretPosition,
    setCaretPosition
}
