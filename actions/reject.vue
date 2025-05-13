<template>
  <el-dialog
    title="拒绝"
    class="workflow-modal"
    width="90%"
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
    >
      <el-form-item label="拒绝原因" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{minRows: 2}" />
      </el-form-item>
      <el-form-item label="附件">
        <upload-attachment ref="attachment" :request-config="requestConfig" :loading.sync="upLoading" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading||upLoading" @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" :loading="loading||upLoading" @click="submitOK">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadAttachment from './upload.vue'
export default {
  components: {
    UploadAttachment
  },
  props: {
    loading: Boolean,
    visible: Boolean,
    requestConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        comment: ''
      },
      rules: {
        comment: [
          { required: true, message: '请输入撤销原因', trigger: 'blur' }
        ]
      },
      upLoading: false
    }
  },
  methods: {
    submitOK() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const attachment = []
          const fileList = this.$refs.attachment.fileList
          fileList.forEach(v => {
            const response = v.response || {}
            const data = response.data || {}
            if (data.url) {
              attachment.push({
                url: data.url
              })
            }
          })
          const data = {
            comment: this.form.comment,
            attachment
          }
          this.$emit('complete', 'wf_reject', data)
        }
      })
    }
  }
}
</script>
