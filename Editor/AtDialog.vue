<template>
  <div v-if="visible" :style="{ position: 'fixed', top: position.y + 'px', left: position.x + 'px' }" class="wrapper" :noUser="!users || !users.length">
    <div v-if="!users.length">{{ t('__workFlow__.noSearchResultsFound') }}</div>
    <div
      v-for="(user, i) in users"
      :key="user.id"
      :class="{ 'active item-nail': i === index, 'item-nail': i!== index }"
      @click.stop.prevent="handlePickUser(user)"
      @mouseenter="index = i"
      @mouseleave="index = -1"
    >
      <div class="left">
        <!-- <img src="https://img-cdn-inner.payermax.com/omc/dev/upload/workflow/20250328/4caa90244ad1462dac7777707cf5ecfe/25cb9e46-52f4-4667-aaa1-146eecea2b3c.jpeg" alt=""> -->
      </div>
      <div class="right">
        <div class="name">{{ user.fullName }}</div>
        <div class="id">{{ user.id }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Locale from '../../../../mixins/locale'
export default {
  mixins: [Locale],
  inject: ['app'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    queryString: {
      type: String,
      default: ''
    },
    pickUser: {
      type: Function,
      default: () => {}
    },
    hide: {
      type: Function,
      default: () => {}
    },
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      users: [],
      index: -1
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler() {
        this.index = 0
      }
    },
    queryString: {
      immediate: true,
      handler(newQuery) {
        const foundUsers = this.searchUser(newQuery)
        if (foundUsers && foundUsers.length) {
          const filteredUsers = foundUsers.map((item, index) => ({
            ...item,
            index: index
          }))
          this.users = filteredUsers
          this.index = 0
        } else {
          this.users = []
          this.index = -1
          this.hide()
        }
      }
    }
  },
  mounted() {
    this.keyDownHandler = (e) => {
      // 只有在对话框可见时才处理键盘事件
      if (this.visible) {
        if (e.code === 'Escape') {
          this.hide()
          return
        }
        // 确保 this.index 不会超过用户列表的最大索引
        if (e.code === 'ArrowDown') {
          this.index = Math.min(this.index + 1, (this.users.length || 0) - 1)
          return
        }
        // 确保 this.index 不会小于 0
        if (e.code === 'ArrowUp') {
          this.index = Math.max(0, this.index - 1)
          return
        }
        if (e.code === 'Enter') {
          if (this.index !== undefined && this.users[this.index]) {
            this.$emit('pickUser', {
              type: 'enter',
              data: this.users[this.index]
            })
            this.index = -1
          }
          return
        }
      }
    }
    document.addEventListener('keyup', this.keyDownHandler)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keyDownHandler)
  },
  methods: {
    // 搜索用户的函数 匹配到返回匹配的，匹配不到返回全部
    searchUser(queryString) {
      if (!this.list || this.list.length === 0) {
        return []
      }
      if (!queryString || queryString.length === 0) {
        return [...this.list]
      }
      const regex = new RegExp(queryString, 'gi')
      const filteredRecords = this.list.filter(record => {
        return regex.test(record.id) || regex.test(record.fullName)
      })
      return filteredRecords.length > 0 ? filteredRecords : []
    },
    handlePickUser(user) {
      this.$emit('pickUser', {
        type: 'click',
        data: user
      })
      // 给一个index的值
      this.index = -1
    }
  }
}
</script>

<style scoped>
  @import './AtDialog.scss';
</style>
