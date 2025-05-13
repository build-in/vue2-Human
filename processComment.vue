<template>
  <el-card>
    <div slot="header">
      <span>评论</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        :icon="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
        @click="isOpen = !isOpen"
      />
    </div>
    <div v-show="isOpen" class="comment-body">
      <el-form
        ref="commentForm"
        :rules="rules"
        :model="form"
        :show-close="false"
        class="comment-form"
      >
        <el-form-item prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入评论内容"
          />
        </el-form-item>
        <el-button
          :loading="loading"
          class="send"
          size="mini"
          @click="sendComment"
        >发送</el-button>
      </el-form>
      <div class="comment-list">
        <ul>
          <li v-for="(v, i) in commentList" :key="i">
            <div class="logo">
              <img v-if="v.avatar" :src="v.avatar">
              <span v-else>{{ v.operatorName ? v.operatorName.slice(-2) : '' }}</span>
            </div>
            <div class="aside">
              <div class="name">
                <span>{{ v.operatorName }}({{ v.operator }})</span>
                <span>{{ v.createTime }}</span>
              </div>
              <div>{{ v.content }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </el-card>
</template>

<script>
// import { commentProcess, commentDetail } from '../api/workflow/process'
export default {
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isOpen: true,
      loading: false,
      form: {},
      rules: {
        content: [
          { type: 'string', required: true, message: '请输入评论内容', trigger: 'change' }
        ]
      },
      commentList: []
    }
  },
  mounted() {
    this.getCommentDetail()
  },
  methods: {
    getCommentDetail() {
      this.$parent.apiCommentDetail({
        ...this.params
      }).then(res => {
        this.commentList = res.data.data
      })
    },
    sendComment() {
      this.$refs['commentForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$parent.apiCommentProcess({
            ...this.params,
            ...this.form
          }).then(res => {
            this.$refs['commentForm'].resetFields()
            this.getCommentDetail()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.comment-body {
  overflow: hidden;
  .comment-form {
    overflow: hidden;
  }
  .send {
    float: right;
  }
  .comment-list {
    ul {
      padding: 0;
    }
    li {
      overflow: hidden;
      font-size: 14px;
      margin-bottom: 20px;
      color: #1B1D1F;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      background: #3782FF;
      float: left;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #fff;
        font-size: 14px;
      }
    }
    .aside {
      float: left;
      padding-left: 12px;
      width: calc(100% - 40px);
      box-sizing: border-box;
    }
    .name {
      display: flex;
      justify-content: space-between;
      color: #9DA2A7;
      margin-bottom: 3px;
      font-size: 12px;
    }
  }
}
</style>
