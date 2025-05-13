<template>
  <el-dialog
    title="撤销"
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
      <el-form-item label="撤销原因" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{minRows: 2}" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitOK">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    visible: Boolean
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
      }
    }
  },
  methods: {
    submitOK() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('complete', 'wf_revoke', this.form)
        }
      })
    }
  }
}
</script>
