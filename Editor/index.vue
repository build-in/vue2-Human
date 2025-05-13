<template>
  <div class="at-editor">
    <AtDialog
      :visible="showDialog"
      :position="position"
      :query-string="queryString"
      :list="list"
      @pickUser="pickUser"
      @hide="hide"
    />
    <p class="limite-count"> <span :class="[currentLength >= maxLength ? 'limite-red' :'']">{{ currentLength }}</span> / <span>{{ maxLength }}</span></p>
    <div
      ref="divRef"
      class="editor"
      contenteditable
      @keyup="handkeKeyUp"
      @keydown="handleKeyDown"
      @input="updateContent"
      @focus="onFocus"
      @blur="onBlur"
    />
    <p v-if="!content" class="placeholder">{{ t('__workFlow__.nailPeople') }}</p>
  </div>
</template>

<script>
import AtDialog from './AtDialog.vue'
import { eventBus } from '../eventBus'
import { MAXLength } from '../const'

// 获取当前浏览器窗口中用户所选择的文本范围或光标的位置
const getCursorIndex = () => {
  const selection = window.getSelection()
  const offset = selection?.focusOffset
  console.log('!!! getCursorIndex focusOffset', offset)
  return offset
}

// 获取节点位置
const getRangeRect = () => {
  const selection = window.getSelection()
  // 从选择对象中获取第一个选中的范围（Range）
  // 通常用户一次只能选择一个连续的文本范围，所以这里取索引为 0 的范围
  const range = selection?.getRangeAt(0)
  // getClientRects() 方法返回一个包含该范围所有边界矩形的 DOMRectList 对象
  // 这里取第一个矩形，通常情况下一个连续的文本范围对应一个矩形
  const rect = range.getClientRects()[0]
  const LINE_HEIGHT = 30
  // y 坐标在范围矩形的 y 坐标基础上加上行高，实现垂直位置的偏移
  return {
    x: rect.x,
    y: rect.y + LINE_HEIGHT
  }
}

// 返回一个两边是空格，中间是内容的，不可编辑的span块
const createAtButton = (user) => {
  const btn = document.createElement('span')
  btn.style.display = 'inline-block'
  btn.id = user?.id
  btn.className = 'at-button'
  btn.contentEditable = 'false'
  btn.textContent = `@${user.fullName}`
  const wrapper = document.createElement('span')
  wrapper.style.display = 'inline-block'
  wrapper.contentEditable = 'false'
  const spaceElem = document.createElement('span')
  spaceElem.style.whiteSpace = 'pre'
  spaceElem.textContent = '\u200b'
  spaceElem.contentEditable = 'false'
  const clonedSpaceElem = spaceElem.cloneNode(true)
  wrapper.appendChild(spaceElem)
  wrapper.appendChild(btn)
  wrapper.appendChild(clonedSpaceElem)
  return wrapper
}

const replaceString = (raw, replacer) => {
  return raw.replace(/@([^@\s]*)$/, replacer)
}
import Locale from '../../../../mixins/locale'

export default {
  name: 'GoodEditor',
  components: {
    AtDialog
  },
  mixins: [Locale],
  inject: ['app'],
  props: {
    contentUpdated: {
      type: Function,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryString: '',
      showDialog: false,
      position: {
        x: 0,
        y: 0
      },
      users: [],
      content: '',
      hasContent: false,
      maxLength: MAXLength, // 设定最大输入字数,
      lastFocusNode: null,
      hasFoused: true,
      currentLength: 0,
      showDialogCursorOffset: null
    }
  },
  watch: {
    showDialog(val) {
      if (val) {
        this.showDialogCursorOffset = getCursorIndex()
      }
    },
    content(val) {
      console.log('输入内容发生变化：', val)
      // 在这里可以添加你需要执行的逻辑
      // this.justLength()
    }
  },
  created() {
    // 在事件总线上监听事件
    eventBus.$on('callChildMethod', this.clear)
    eventBus.$on('getCurrentLeng', this.getLength)
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    eventBus.$off('callChildMethod', this.clear)
    eventBus.$on('getCurrentLeng', this.getLength)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.$refs.divRef.focus()
      // window.hi = this
    },
    // limiteState() {
    //   this.$message.warning(this.t('__workFlow__.overMaxLength'))
    // },
    updateContent(event) {
      this.content = event.target.innerHTML
      this.hasContent = this.content.length > 0
      this.updateParentContent()
      // 输入检查字符长度
      this.justLength()
      // const isAddingChar = !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
      // if (this.currentLength > this.maxLength && isAddingChar) {
      //   this.limiteState()
      //   event.preventDefault()
      // }
    },
    justLength() {
      const editor = this.$refs.divRef
      const text = editor.textContent.replace(/\s/g, '').replace(/\u200B/g, '') // 去除空白字符
      this.currentLength = text.length
    },
    updateParentContent() {
      this.$emit('contentUpdated', {
        content: this.content,
        html: this.$refs.divRef.innerHTML,
        users: this.users || [],
        currentLength: this.$refs.divRef.textContent.replace(/\s/g, '').replace(/\u200B/g, '').length
      })
    },
    handkeKeyUp(e) {
      if (this.showAt()) {
        const position = getRangeRect()
        this.position = position
        const user = this.getAtUser()
        this.queryString = user || ''
        this.showDialog = true
        this.showDialogCursorOffset = getCursorIndex()
      } else {
        this.showDialog = false
      }
    },
    handleKeyDown(e) {
      // if (e.code === 'Enter') {
      //   this.updateParentContent()
      // }
      // 禁止按键操作逻辑
      if (this.showDialog) {
        if (
          e.code === 'ArrowUp' ||
          e.code === 'ArrowDown' ||
          e.code === 'Enter'
        ) {
          e.preventDefault()
        }
      }

      // 允许删除键控制逻辑
      if (e.code === 'Backspace') {
        if (this.$refs.divRef.textContent.length < 1) {
          e.preventDefault()
        } else {
          return
        }
      }
    },
    onFocus() {
      this.$emit('focus')
      this.hasFoused = false
    },
    onBlur() {
      this.$emit('blur')
      if (this.$refs.divRef.innerText.length === 0) {
        this.hasFoused = true
      } else {
        this.hasFoused = false
      }

      setTimeout(() => {
        this.hide()
      }, 200)
    },
    pickUser(user = {}) {
      this.replaceAtUser(user)
      this.justLength()
      this.updateParentContent()
      // 弹框检查字符长度
      if (user?.data?.id) {
        this.users.push(user?.data)
        this.updateParentContent()
        this.showDialog = false
      }
    },
    hide() {
      this.showDialog = false
    },
    clear() {
      this.users = []
      this.$refs.divRef.innerHTML = ''
      this.content = ''
    },
    getLength() {
      return this.currentLength
    },
    // 是否展示 @
    // 检查当前文本节点中，光标位置之前的文本是否以 @ 符号开头，并且后面跟随了非 @ 和非空白字符，若满足条件则返回 true，否则返回 false。
    showAt() {
      const node = this.getRangeNode()
      if (!node || node.nodeType !== Node.TEXT_NODE) return false
      const content = node.textContent || ''
      // 定义一个正则表达式，用于匹配以 @ 开头，后面跟随零个或多个非 @ 和非空白字符，并且以字符串结尾的部分
      const regx = /@([^@\s]*)$/
      // 截取光标前的文本 (可能在中间插入了文本，需要截取光标前的文本)
      const match = regx.exec(content.slice(0, getCursorIndex()))
      return match && match.length === 2
    },
    getRangeNode(type = 'enter') {
      const selection = window.getSelection()
      const focusNode = selection?.focusNode
      const parentNode = this.$refs.divRef

      if (parentNode) {
        if (parentNode.contains(focusNode)) {
          this.lastFocusNode = focusNode
          return focusNode
        } else {
          return this.lastFocusNode
        }
      }
      return null
    },
    // 获取 @ 用户
    getAtUser() {
      const content = this.getRangeNode()?.textContent || ''
      // 定义一个正则表达式，用于匹配以 @ 开头，后面跟随零个或多个非 @ 和非空白字符，并且以字符串结尾的部分
      const regx = /@([^@\s]*)$/
      // 调用 getCursorIndex 函数获取当前光标的索引位置
      // 然后使用 slice 方法截取从文本开头到光标位置的文本
      // 最后使用正则表达式的 exec 方法对截取的文本进行匹配
      const match = regx.exec(content.slice(0, getCursorIndex()))
      // 匹配结果数组的第一个元素是整个匹配的字符串，第二个元素是捕获组中的内容
      if (match && match.length === 2) {
        // 如果匹配成功，则返回捕获组中的内容，即 @ 后面的用户名部分
        return match[1]
      }
      return undefined
    },
    replaceAtUser(user) {
      const { type = '', data = {}} = user || {}
      // 调用 getRangeNode 方法获取当前操作的文本节点
      const node = this.getRangeNode(type)
      // 这里点击 和 Enter 选择的内容不同 改这里
      // console.log(node, '替换用户操作')
      // 检查节点是否存在
      if (node) {
        // 获取节点的文本内容，如果不存在则赋值为空字符串
        const content = node.textContent || ''
        // 获取当前光标的索引位置
        // const endIndex = getCursorIndex()
        // const endIndex = content.indexOf('@')
        const endIndex = this.showDialogCursorOffset || getCursorIndex()
        // 调用 replaceString 函数，将从文本开头到光标位置的部分进行替换，这里传入空字符串作为替换内容
        const preSlice = replaceString(content.slice(0, endIndex), '')
        // 使用正则匹配@字符到结尾的子字符串长度
        // const atTempStrLen = content.match(/@([^@\s]*)$/)?.[0]?.length || 0
        // 截取从光标位置到文本末尾的部分
        const restSlice = content.slice(endIndex)
        // const restSlice = content.slice(endIndex + atTempStrLen)
        const parentNode = node.parentNode
        const nextNode = node.nextSibling
        // 创建一个新的文本节点，内容为替换后的前半部分内容
        const previousTextNode = document.createTextNode(preSlice)
        // 创建一个新的文本节点，内容为零宽度空格和截取的后半部分内容
        const nextTextNode = document.createTextNode('\u200b' + restSlice)
        // 调用 createAtButton 函数，根据用户数据创建一个包含用户信息的 @ 按钮元素
        const atButton = createAtButton(data)

        // 从父节点中移除当前节点
        parentNode.removeChild(node)
        // 检查当前节点是否有下一个兄弟节点
        if (nextNode) {
          // 如果有下一个兄弟节点，将新创建的三个节点依次插入到该兄弟节点之前
          parentNode.insertBefore(previousTextNode, nextNode)
          parentNode.insertBefore(atButton, nextNode)
          parentNode.insertBefore(nextTextNode, nextNode)
        } else {
          // 如果没有下一个兄弟节点，将新创建的三个节点依次追加到父节点的末尾
          parentNode.appendChild(previousTextNode)
          parentNode.appendChild(atButton)
          parentNode.appendChild(nextTextNode)
        }
        // 创建一个新的 Range 对象，恢复光标到结尾
        const range = document.createRange()
        range.setStart(nextTextNode, 0)
        range.setEnd(nextTextNode, 0)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }
}
</script>

<style lang="scss">
.at-editor {
  position: relative;
  .limite-count {
    position: absolute;
    left: 6px;
    bottom: -6px;
    color: #C6C8CB;
    font-size: 10px;
    line-height: 14px;
    background: #fff;
    border-radius: 12px;
    padding: 6px;
    .limite-red{
      color:red;
    }
  }
  .editor {
    margin: 0 auto;
    min-height: 96px;
    max-height: 200px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    text-align: left;
    padding: 12px 12px 32px;
    overflow: auto;
    color: #1B1D1F;
    font-size: 14px;
    line-height: 21px;
    &:focus {
      outline: none;
      border: 1px solid #0c71ff;
    }
  }
  .placeholder {
    position: absolute;
    top: 0;
    left: 15px;
    color: #C6C8CB;
    font-size: 14px;
    line-height: 21px;
    pointer-events: none;
  }
  .at-button {
    outline: none;
    appearance: none;
    padding: 0 8px;
    background-color: transparent;
    color: #0C71FF;
    font-family: Poppins;
    font-size: 14px;
    line-height: 21px;
  }
}
</style>
