<template>
  <div>
    <quill-editor ref="editorRef" v-model="content" @change="onTextChange" />
    <div v-if="showUserList" class="user-list">
      <ul style="height:180px;overflow-y: scroll;">
        <li
          v-for="user in matchedUsers"
          :key="user.id"
          style="list-style: none;"
          @click="selectUser(user)"
        >
          {{ user.name }}
        </li>
      </ul>
    </div>
    <p>已选择的人名列表: {{ selectedUserNames.join(', ') }}</p>
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
      content: '',
      editor: null,
      showUserList: false,
      users: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' },
        { id: 4, name: '王8' },
        { id: 5, name: '王9' },
        { id: 6, name: '王10' },
        { id: 7, name: '11' },
        { id: 8, name: '12' }
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
    onTextChange(delta, oldDelta, source) {
      const text = this.editor.getText()
      const atIndex = text.lastIndexOf('@')
      console.log(text, atIndex, '1234567')
      if (atIndex !== -1) {
        const mentionText = text.slice(atIndex + 1).trim()
        this.matchedUsers = this.users.filter(user => user.name.startsWith(mentionText))
        this.showUserList = this.matchedUsers.length > 0
        this.atIndex = atIndex
        console.log(this.matchedUsers, this.showUserList, this.atIndex, '1111111111')
      } else {
        this.showUserList = false
      }
    },
    selectUser(user) {
      const mention = `@${user.name}`
      this.editor.insertText(this.editor.getLength() - 1, mention + '')
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

  <style scoped>
  .user-list {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    list-style-type: none;
    padding: 0;
    margin: 0;
    z-index: 1;
  }

  .user-list li {
    padding: 5px 10px;
    cursor: pointer;
  }

  .user-list li:hover {
    background-color: #f0f0f0;
  }
  </style>
