<template>
  <div class="workflow-card workflow-comment">
    <div class="module-title">{{ t('__workFlow__.module.comment') }}</div>
    <GoodEditor
      ref="editorRef"
      :list="peopleList"
      @contentUpdated="handleContentUpdate"
    />
    <div class="control-upload">
      <div class="control-btn upfile-btn-file" @click="triggerUpload('file')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="t('__workFlow__.uploadFile')"
          placement="top"
        >
          <FileIcon />
        </el-tooltip>
      </div>
      <div class="control-btn upfile-btn" @click="triggerUpload('image')">
        <el-tooltip
          class="item"
          effect="dark"
          :content="t('__workFlow__.uploadImages')"
          placement="top"
        >
          <PictureIcon />
        </el-tooltip>
      </div>
    </div>
    <div class="send-btn">
      <!-- 发送按钮 -->
      <el-button
        :loading="loading"
        :disabled="disabled"
        class="send"
        :type="disabled ? 'info' : 'primary'"
        size="mini"
        @click="sendComment"
      >{{ t('__workFlow__.send') }}</el-button>
    </div>
    <el-form
      ref="commentForm"
      :rules="locale === 'zh' ? rules : rulesEn"
      :model="form"
      :show-close="false"
      class="comment-form"
    >
      <div class="upload-content">
        <!-- 上传图片-->
        <el-form-item>
          <el-upload
            ref="uploadImages"
            v-model="form.list"
            class="upload-files upload-image"
            :limit="9"
            :headers="headers"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            :on-success="onUploadSuccess"
            :action="uploadUrl()"
            :file-list="resultFileList"
            :accept="IMAGE_UPLOAD_TYPE"
            list-type="picture-card"
          />
        </el-form-item>
        <!-- 上传附件 -->
        <el-form-item>
          <el-upload
            ref="uploadFiles"
            v-model="form.filesList"
            class="upload-files upload-other"
            :limit="9"
            :headers="headers"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemoveFile"
            :on-success="onUploadSuccessFile"
            :action="uploadUrl()"
            :file-list="fileResultList"
            :accept="FILE_UPLOAD_TYPE"
            list-type="text"
          />
        </el-form-item>
      </div>
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
              <span>{{ v.createTimestamp | dealTimeZone }}</span>
            </div>
            <div class="aside-content">
              <div v-if="v.deleted" class="aside-msg aside-delete">
                <span> {{ t('__workFlow__.commentHasBeenDeleted') }}</span>
                <span> ({{ v.updateTimestamp | dealTimeZone }})</span>
              </div>
              <div v-else class="aside-msg" v-html="v.content" />
              <div v-if="!v.deleted" class="aside-btn">
                <div v-if="v.isAllowDeleted" class="default-delete-btn" @click="deleteComment(v)">{{ t('__workFlow__.delete') }}</div>
                <div v-else class="delete" />
              </div>
            </div>
          </div>
          <div v-if="!v.deleted">
            <div class="show-image-list">
              <div v-for="(item, index) in v.images" :key="index">
                <div class="images-content">
                  <img class="show-image" :src="item.url">
                  <div class="hover-pick" @click="handlePreview(item)">
                    <img src="./svg/Magnifying_glass.png" class="type-img-innner" alt="">
                  </div>
                </div>
              </div>
            </div>
            <div class="show-file-list">
              <div v-for="(item, index) in v.attachments" :key="index">
                <div class="show-file">
                  <FileDownload />
                  <div class="file-name">{{ item.name }}</div>
                  <div class="file-link">
                    <a :href="item.url"><i class="el-icon-download" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
import Locale from '../../../mixins/locale'
import { UPLOAD_TYPE, IMAGE_UPLOAD_TYPE, DEFAULT_UPLOAD_IMAGE, FILE_UPLOAD_TYPE, getTimeWithTimeZone, MAXLength } from './const'
import FileIcon from './svg/fileIcon.vue'
import PictureIcon from './svg/pictureIcon.vue'
import FileDownload from './svg/fileDonwnload.vue'

import GoodEditor from './Editor/index.vue'
import { eventBus } from './eventBus'

export default {
  name: 'Comment',
  components: {
    FileIcon,
    PictureIcon,
    FileDownload,
    GoodEditor
  },
  filters: {
    dealTimeZone(val) {
      return getTimeWithTimeZone(val)?.formattedTime
    }
  },
  mixins: [Locale],
  provide() {
    return {
      app: this
    }
  },
  props: {
    task: {
      type: Object,
      default: () => {
        return {}
      }
    },
    locale: {
      type: String,
      default: () => {
        return 'zh'
      }
    },
    requestConfig: {
      type: Object,
      default: () => {
        return {}
      }
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
      loading: false,
      // searchLoading: false,
      disabled: true,
      form: {
        list: [],
        filesList: [],
        content: ''
      },
      rules: {
        content: [
          { type: 'string', required: true, message: '请输入评论内容', trigger: 'change' }
        ]
      },
      rulesEn: {
        content: [
          { type: 'string', required: true, message: 'Please enter the comment content', trigger: 'change' }
        ]
      },
      commentList: [],
      UPLOAD_TYPE,
      FILE_UPLOAD_TYPE,
      IMAGE_UPLOAD_TYPE,
      resultFileList: [],
      fileResultList: [],
      dialogTableVisible: false,
      peopleList: [],
      content: {},
      // quill: null,
      matchedUsers: [],
      atIndex: -1,
      current: 1,
      size: 1000,
      editChoose: {
        content: '',
        users: [],
        html: ''
      },
      filterUserId: new Set(),
      dialogImageUrl: '',
      dialogVisible: false,
      currentLength: 0
    }
  },
  computed: {
    headers() {
      return this.requestConfig.headers || {}
    }
  },
  watch: {
    'editChoose.html'(val) {
      this.justifyHighlight()
      // 过滤删除的用户
      this.filterUserId.clear()
      const userNames = this.filterUser(val)
      this.editChoose.users.forEach((v) => {
        userNames.forEach((k) => {
          if (k === v.fullName) {
            this.filterUserId.add(v?.id)
          }
        })
      })
    },
    resultFileList() {
      this.justifyHighlight()
    },
    fileResultList() {
      this.justifyHighlight()
    }
  },
  created() {
    this.initMerchantList()
  },
  mounted() {
    this.getCommentDetail()
  },
  methods: {
    triggerUpload(type) {
      const refMap = {
        'image': 'uploadImages',
        'file': 'uploadFiles'
      }
      const refName = refMap[type]
      if (refName) {
        const uploadComponent = this.$refs[refName]
        if (uploadComponent) {
          const inputElement = uploadComponent.$el.querySelector('input[type="file"]')
          if (inputElement) {
            inputElement.click()
          }
        }
      }
    },
    filterUser(htmlString) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')
      const atButtons = doc.querySelectorAll('.at-button')
      const texts = new Set()
      atButtons.forEach((button) => {
        let text = button.textContent
        if (text.startsWith('@')) {
          text = text.slice(1).trim()
        }
        texts.add(text)
      })
      return texts || []
    },
    // 输入框、图片、附件 三者任一有值，按钮可用
    justifyHighlight() {
      if (this.editChoose.content && this.editChoose.content !== '<br>') {
        this.disabled = false
        return
      } else if (this.resultFileList.length) {
        this.disabled = false
        return
      } else if (this.fileResultList.length) {
        this.disabled = false
        return
      } else {
        this.disabled = true
      }
    },
    // 初始化商家列表
    initMerchantList() {
      this.getALlMerchant({
        current: this.current,
        size: this.size
      })
    },
    handleContentUpdate(val = {}) {
      this.editChoose = val || {}
    },
    getALlMerchant(params) {
      // this.searchLoading = true
      this.$parent.apiGetAllUser({
        current: params.current,
        size: params.size
      }).then(res => {
        const data = res.data.data || {}
        if (data) {
          this.peopleList = data?.records || []
        }
      }).finally((e) => {
        console.log(e)
        // this.searchLoading = false
      })
    },
    deleteComment(val) {
      this.$confirm(this.t('__workFlow__.deleteComment'), this.t('__workFlow__.tip'), {
        confirmButtonText: this.t('__workFlow__.confirm'),
        cancelButtonText: this.t('__workFlow__.cancel'),
        type: 'warning'
      }).then(() => {
        this.$parent.apiDeleteComment({
          id: val.id
        }).then(res => {
          const data = res.data.data || {}
          this.$message({
            type: 'success',
            message: this.t('__workFlow__.deleteSuccess')
          })
          if (data) {
            this.getCommentDetail()
          }
        }).finally((e) => {
          console.log(e)
        })
      }).catch((e) => {
        console.log(e)
      })
    },
    uploadUrl() {
      let baseURL = this.requestConfig.baseURL || ''
      if (baseURL) {
        const isEndFix = baseURL.charAt(baseURL.length - 1) === '/'
        baseURL = isEndFix ? baseURL.substr(0, baseURL.length - 1) : baseURL
      }
      return baseURL + '/operating-omc-portal/common/file/workflow/upload'
    },
    handleExceed(files, fileList) {
      if (fileList && fileList.length === 9) {
        this.$message.warning(this.t('__workFlow__.upToNineCanBeUploaded'))
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error(this.t('__workFlow__.overload'))
      }
      return isLt20M
    },
    handleRemove(file, fileList) {
      if (!file) {
        return
      }
      const index = this.resultFileList.findIndex(item => item.uid === file.uid)
      this.resultFileList.splice(index, 1)
    },
    handleRemoveFile(file, fileList) {
      if (!file) {
        return
      }
      const index = this.fileResultList.findIndex(item => item.uid === file.uid)
      this.fileResultList.splice(index, 1)
    },
    onUploadSuccess(response, file, fileList) {
      if (response && response.code === 'APPLY_SUCCESS') {
        if (response.data) {
          this.resultFileList.push({
            url: response.data.url,
            name: response.data.name,
            uid: file.uid,
            type: 'image'
          })
        }
      } else if (response && response.msg) { console.log('upload failed', response.msg) }
    },
    onUploadSuccessFile(response, file, fileList) {
      if (response && response.code === 'APPLY_SUCCESS') {
        if (response.data) {
          this.fileResultList.push({
            url: response.data.url,
            name: response.data.name,
            uid: file.uid,
            type: 'file'
          })
          // this.dealPDF()
          // setTimeout(() => {
          //   this.dealPDF()
          // }, 1)
        }
      } else if (response && response.msg) { console.log('upload failed', response.msg) }
    },
    dealPDF() {
      const liElements = document.querySelectorAll('ul.el-upload-list.el-upload-list--picture li.el-upload-list__item')
      liElements.forEach(function(liElement) {
        const aElement = liElement.querySelector('a.el-upload-list__item-name')
        if (aElement && !IMAGE_UPLOAD_TYPE.some(subString => aElement.textContent.includes(subString))) {
          const imgElement = liElement.querySelector('img.el-upload-list__item-thumbnail')
          if (imgElement) {
            imgElement.src = DEFAULT_UPLOAD_IMAGE
          }
        }
      })
    },
    getCommentDetail() {
      this.$parent.apiCommentDetail({
        processId: this.task.processId,
        taskId: this.task.taskId
      }).then(res => {
        this.commentList = res.data.data
      })
    },
    resetForm() {
      this.$refs['commentForm'].resetFields()
      this.resultFileList = []
      this.fileResultList = []
      this.editChoose.users = []
      this.editChoose.content = ''
      eventBus.$emit('callChildMethod')
    },
    sendComment() {
      this.$refs['commentForm'].validate((valid) => {
        if (this.editChoose.currentLength > MAXLength) {
          this.$message.warning(this.t('__workFlow__.overMaxLength'))
          return
        }
        if (valid) {
          this.loading = true
          this.$parent.apiCommentProcess({
            'processId': this.task.processId,
            'taskId': this.task.taskId,
            'content': this.editChoose.html || '',
            'shareIds': [...this.filterUserId] || [],
            'attachments': this.fileResultList || [],
            'images': this.resultFileList || []
          }).then(res => {
            this.$refs['commentForm'].resetFields()
            this.getCommentDetail()
            this.resetForm()
            this.$refs.editorRef.currentLength = 0
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.workflow-comment {
  .control-upload {
    display: flex;
    position: absolute;
    right: 0;
    margin-right: 40px;
    margin-top: -32px;
    .control-btn {
      background: #fff;
      padding: 6px;
      border-radius: 12px;
      & + .control-btn {
        margin-left: 6px;
      }
    }
  }
  .send-btn {
    display: flex;
    justify-content: end;
    margin-top: 10px;
  }
  .comment-form {
    overflow: hidden;
    .el-form-item {
      margin-bottom: 8px;
    }
    .send {
      border-radius: 12px;
      padding: 7px 12px;
      min-width: 80px;
    }
    .upload-content {
      display: flex;
      justify-content: start;
      // margin-top: 10px;
      display: flex;
      flex-direction: column;
      .el-form-item__content{
        line-height: 0px;
      }
      .el-form-item{
        margin-bottom: 0px;
      }
    }
  }
  .comment-list {
    padding: 14px 0;
    box-sizing: border-box;
    // margin-top:-45px;
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      overflow: hidden;
      font-size: 14px;
      margin-bottom: 20px;
      color: #1B1D1F;
      box-sizing: border-box;
      padding: 10px;
      .default-delete-btn{
        visibility: hidden;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &:hover{
        background: #F8F8F8;
        border-radius: 12px;
        cursor: pointer;
        .default-delete-btn{
          visibility: visible;
        }
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
      .aside-content{
        display:flex;
        justify-content: space-between;
        margin-bottom: 5px;
        .at-button{
          color: #0C71FF;
        }
      }
      .aside-msg {
        word-wrap: break-word;
        max-width: 84%;
      }
      .aside-delete {
        color: #727880;
      }
      .aside-content{
        display: flex;
        justify-content: space-between;
        align-items: start;
        .aside-btn{
          color:red;
          cursor: pointer;
          word-break: keep-all;
          .delete{
            color: #9DA2A7;
            cursor: none;
          }
        }
      }
    }
    .name {
      display: flex;
      justify-content: space-between;
      color: #9DA2A7;
      margin-bottom: 3px;
      font-size: 12px;
    }
  }
  .upload-files {
    .el-upload__tip {
      color: rgba(157, 162, 167, 1);
    }
  }

  .upfile-btn {
    display: flex;
    background: #fff;
    border-radius: 12px;
    cursor: pointer;

    :nth-child(2) {
      color: rgba(114, 120, 128, 1);
      font-family: Poppins;
      font-weight: 500;
      font-size: 14px;
      margin-left:5px;
    }
  }
  .upfile-btn-file {
    display: flex;
    cursor: pointer;
    :nth-child(2) {
      color: rgba(114, 120, 128, 1);
      font-family: Poppins;
      font-weight: 500;
      font-size: 14px;
      margin-left:5px;
    }
  }
  .hasFile {
    display: flex;
      :nth-child(2) {
        color: rgba(114, 120, 128, 1);
        font-family: Poppins;
        font-weight: 500;
        font-size: 14px;
        margin-left:5px;
      }
  }
  .el-textarea__inner {
    height: 220px;
  }
  textarea{
    height: 220px;
  }
  .upload-image{
    // height: 56px;
    .el-upload-list--picture {
      display: flex;
      li {
        width: 100px;
        margin-left: 5px;
      }
    }
    .el-upload-list--picture-card {
      display: flex;
      // margin-top: -96px;
      .el-upload-list__item {
        width: 64px;
        height: 64px;
      }
    }
    .el-upload--picture-card {
      width:0px;
      height:0px;
    }
  }
  .upload-other {
    margin-bottom: 12px;
    .el-upload-list--text {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      li {
        width: 29%;
        margin-left: 5px;
      }
    }
  }
  .show-image-list {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    margin-top: 10px;
    width:100%;
    padding-left:52px;
    .hover-pick{
      position: absolute;
      top: 0;
      background: #000;
      border-radius: 12px;
      width: 64px;
      height: 64px;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      opacity: 0.5;
      visibility: hidden;
      .type-img-innner{
        height: 15px;
        width:15px;
        z-index: 2;
      }
    }
    .images-content{
      position: relative;
      &:hover{
        .hover-pick{
          visibility:visible;
        }
      }
    }
    .show-image{
      width: 64px;
      height: 64px;
      object-fit: cover;
      margin-right:5px;
      border-radius: 12px;
      cursor: pointer;
    }
  }
  .show-file-list {
    display: flex;
    // flex-wrap: wrap;
    margin-top: 10px;
    justify-content: start;
    width:100%;
    flex-wrap: wrap;
    margin-left: 52px;
    .show-file {
      width: 200px;
      height: 34px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-right:5px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #1B1D1F;
      margin-bottom: 5px;
      cursor: pointer;
      position: relative;
      :nth-child(2) {
        margin-left: 5px;
      }
    }
    .file-name{
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .file-link{
      position: absolute;
      right: 0;
      margin-right: 10px;
    }
  }
}
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .show-image-list{
    display: flex;
    justify-content: start;
    margin-top: 10px;
    width:100%;
    .show-image {
      width: 64px !important;
      height: 64px !important;
      object-fit: cover;
      margin-right:5px;
    }
  }
  .pay-messagebox-small {
      width: 350px;
      .el-message-box__btns{
        margin-top: 20px;
        justify-content: end;
      }
  }
  .el-message-box{
    width:85% !important;
  }
}
@media  screen and (min-width: 0px) and (max-width: 640px) {
  .show-image-list{
    display: flex;
    justify-content: start;
    margin-top: 10px;
    width:100%;
    .show-image{
      width: 64px !important;
      height: 64px !important;
      object-fit: cover;
      margin-right:5px;
    }
  }
  .show-file-list{
    display: flex;
    margin-top: 10px;
    justify-content: start;
    width:100%;
    flex-wrap: wrap;
    .show-file {
      width: 180px !important;
      height: 34px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-right:5px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #1B1D1F;
      margin-bottom: 5px;
      position: relative;
      :nth-child(2) {
        margin-left: 5px;
      }
    }
  }
  .pay-messagebox-small {
      width: 230px;
      .el-message-box__btns{
        margin-top: 20px;
        justify-content: end;
      }
  }
  .el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
    .el-upload-list__item {
      width: 64px;
      height: 64px;
    }
  }
   .el-message-box{
    width:85% !important;
  }
}
</style>
