<template>
  <el-dialog
    :title="title"
    class="workflow-modal"
    width="90%"
    :visible="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      ref="form"
      :rules="locale === 'zh' ? rules : rulesEn"
      :model="form"
    >
      <el-form-item :label="t('__workFlow__.comment')" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{minRows: 2}" />
      </el-form-item>
      <el-form-item :label="t('__workFlow__.attachment')">
        <upload-attachment ref="attachment" :request-config="requestConfig" :loading.sync="upLoading" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading||upLoading" @click="cancel">{{ t('__workFlow__.cancel') }}</el-button>
      <el-button type="primary" :loading="loading||upLoading" @click="submitOK">{{ t('__workFlow__.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Locale from '../../../../mixins/locale'
import UploadAttachment from './upload.vue'
export default {
  components: {
    UploadAttachment
  },
  mixins: [Locale],
  props: {
    loading: Boolean,
    visible: Boolean,
    status: {
      type: String,
      default: ''
    },
    requestConfig: {
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
    }
  },
  data() {
    return {
      form: {
        comment: ''
      },
      upLoading: false
    }
  },
  computed: {
    title() {
      return this.t('__workFlow__.actionTitle')[this.status] || ''
    },
    rules() {
      if (['wf_reject', 'wf_overrule', 'wf_revoke'].includes(this.status)) {
        return {
          comment: [
            { required: true, message: '请输入评论信息', trigger: 'change' }
          ]
        }
      }
      return {}
    },
    rulesEn() {
      if (['wf_reject', 'wf_overrule', 'wf_revoke'].includes(this.status)) {
        return {
          comment: [
            { required: true, message: 'Please enter your comment information', trigger: 'change' }
          ]
        }
      }
      return {}
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false)
    },
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
          this.$emit('complete', this.status, data)
        }
      })
    }
  }
}
</script>
