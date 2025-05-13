<template>
  <div class="editor-edit-people">
    <quill-editor
      ref="editorRef"
      v-model="content"
      style="width:100%;height:170px"
      :options="editorOption"
      @change="onTextChange"
    />
    <div v-if="showUserList" class="user-list">
      <div class="item-work-div">
        <div
          v-for="item in matchedUsers"
          :key="item.id"
          class="div-2"
          @click="selectUser(item)"
        >
          <div class="div-3">
            <img :src="item.url" class="avatar-img">
          </div>
          <div class="div-4">
            <div class="div-5">{{ item.fullName }}</div>
            <div class="div-6">{{ item.email }}</div>
          </div>
        </div>
      </div>
    </div>
    <p>已选择的人名列表ID: {{ selectedUserNames.join(', ') }}</p>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'QuillMention',
  components: {
    quillEditor
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: false
        },
        placeholder: '请输入内容...'
      },
      content: '',
      editor: null,
      showUserList: false,
      users: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
      ],
      matchedUsers: [],
      atIndex: -1,
      selectedUserNames: []
    }
  },
  mounted() {
    this.editor = this.$refs.editorRef.quill
  },
  methods: {
    // justPeopleInputAt(delta) {
    //   delta.ops.forEach(function(op) {
    //     if (op.insert && typeof op.insert === 'string') {
    //       if (op.insert.includes('@')) {
    //         console.log('用户输入了 @ 符号')
    //         return true
    //       }
    //     }
    //   })
    // },
    // onTextChange(delta, oldDelta, source) {
    //   const text = this.editor.getText()
    //   const atIndex = text.lastIndexOf('@')
    //   if (atIndex !== -1) {
    //     const mentionText = text.slice(atIndex + 1).trim()
    //     // console.log(mentionText, 'etryryr')
    //     this.matchedUsers = this.list.filter(user => user.fullName.startsWith(mentionText))
    //     this.showUserList = this.matchedUsers.length > 0
    //     this.atIndex = atIndex
    //     // console.log(this.matchedUsers, this.showUserList, this.atIndex, '1111111111')
    //   } else {
    //     this.showUserList = false
    //   }
    // },
    onTextChange(delta, oldDelta, source) {
      const text = this.editor.getText()
      const atIndex = text.lastIndexOf('@')
      if (atIndex !== -1) {
        const mentionText = text.slice(atIndex + 1).trim()
        // console.log(mentionText, 'etryryr')
        this.matchedUsers = this.list.filter(user => user.fullName.startsWith(mentionText))
        this.showUserList = this.matchedUsers.length > 0
        this.atIndex = atIndex
        // console.log(this.matchedUsers, this.showUserList, this.atIndex, '1111111111')
      } else {
        this.showUserList = false
      }
    },
    getLastAtValue(str) {
      const lastIndex = str.lastIndexOf('@')
      if (lastIndex !== -1) {
        const result = str.substring(lastIndex + 1)
        return result
      } else {
        console.log('字符串中未找到 @ 符号')
        return false
      }
    },
    selectUser(user) {
      const text = this.editor.getText()
      const atIndex = text.lastIndexOf('@')
      const lastAtValue = this.getLastAtValue(text)
      // 获取拼接的用户名
      const mention = `@${user.fullName}`
      // 插入用户名到编辑器中
      // 1、直接输入@ 选择用户
      // 2、输入@ 然后在输入匹配用户关键字，选择用户，此时应该是替换掉之前的用户
      // 3、输入@ 然后输入不属于关键字的信息，选择用户，这时候直接增加用户
      console.log(mention, 'mentionmentionmention', lastAtValue, 'lastAtValuelastAtValue')
      // if (atIndex === 1) {
      //   this.editor.insertText(this.editor.getLength(), mention + '')
      // }
      if (atIndex > 1) {
        this.matchedUsers = this.list.filter(user => user.fullName.startsWith(lastAtValue))
        // 2、输入@ 然后在输入匹配用户关键字，选择用户，此时应该是替换掉之前的用户
        if (this.matchedUsers) {
          console.log('1111')
          // @之后 输入匹配的关键字多次，但是不全部匹配，且用户继续输入，此时应不应该删除前面的内容
          this.editor.deleteText(atIndex, lastAtValue.length)

          this.editor.insertText(this.editor.getLength(), mention + '')
        } else {
          // 3、输入@ 然后输入不属于关键字的信息，选择用户，这时候直接增加用户
          this.editor.insertText(this.editor.getLength(), mention + '')
          console.log('2222')
        }
      }

      // 插入的用户名+ @ 高亮
      this.editor.formatText(this.editor.getLength() - mention.length, mention.length, {
        color: 'blue',
        bold: true,
        italic: true
      })
      this.showUserList = false
      this.selectedUserNames.push(user.id)
      // 将光标移动到插入内容之后
      // this.editor.setSelection(this.editor.getLength() - 1 + mention.length)
      // 清除可能存在的格式，还原输入样式
      // alert(this.editor.setSelection, this.editor.removeFormat, 'this.editor.removeFormat')
      this.editor.removeFormat(this.editor.getLength() - 1, 10)
    }
  }
}
</script>

<style lang="scss">
.editor-edit-people {
  .user-list {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    list-style-type: none;
    padding: 0;
    margin: 0;
    z-index: 1;
    // margin-top: -170px;
    // right: 0;
    // margin-right: 30px;
  }

  .user-list li {
    padding: 5px 10px;
    cursor: pointer;
  }

  .user-list li:hover {
    background-color: #f0f0f0;
  }

  .item-work-div {
    display: flex;
    max-height: 400px;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: scroll;

    @media (max-width: 991px) {
      .div {
        width: 100%;
        max-width: 219px;
      }
    }

    @media (max-width: 640px) {
      .div {
        width: 100%;
        max-width: none;
        border-radius: 8px;
      }
    }

    .div-2 {
      display: flex;
      min-height: 40px;
      padding: 8px;
      align-items: center;
      gap: 8px;
      align-self: stretch;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 10px;
    }

    .div-2:hover {
      background-color: #EAEAEA;
    }

    @media (max-width: 640px) {
      .div-2 {
        padding: 6px;
      }
    }

    .div-3 {
      display: flex;
      width: 32px;
      height: 32px;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .avatar-img {
      width: 32px;
      height: 32px;
      border-radius: 60px;
      object-fit: cover;
    }

    .div-4 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex: 1;
    }

    .div-5 {
      color: #1b1d1f;
      font: 400 14px/21px Poppins, sans-serif;
    }

    .div-6 {
      color: #727880;
      font: 400 12px/18px Poppins, sans-serif;
      width: 150px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
