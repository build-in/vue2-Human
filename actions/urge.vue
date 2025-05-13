<template>
  <el-dialog
    :title="t('__workFlow__.urge')"
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
      class="urge-form"
    >
      <el-form-item :label="t('__workFlow__.expediter')" prop="shareIds" class="urge-ids">
        <el-checkbox-group v-model="form.shareIds">
          <el-checkbox
            v-for="(v) in data"
            :key="v.shareId"
            :label="v.shareId"
            name="shareIds"
          >{{ v.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :label="t('__workFlow__.urgeInfo')" prop="content">
        <el-input v-model="form.content" type="textarea" :autosize="{minRows: 2}" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('update:visible', false)">{{ t('__workFlow__.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="sendUrgent">{{ t('__workFlow__.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Locale from '../../../../mixins/locale'
export default {
  mixins: [Locale],
  props: {
    loading: Boolean,
    visible: Boolean,
    data: {
      type: Array,
      default: () => {
        return []
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
        shareIds: [],
        content: ''
      },
      rules: {
        shareIds: [
          { type: 'array', required: true, message: '请选择催办人', trigger: 'change' }
        ]
      },
      rulesEn: {
        shareIds: [
          { type: 'array', required: true, message: 'Please select expediter', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    sendUrgent() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('complete', 'urge', this.form)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.workflow-modal .urge-form {
  .urge-ids {
    .el-form-item__label {
      width: 100%;
      text-align: left;
    }
  }
}
</style>
