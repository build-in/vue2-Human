<template>
  <el-dialog
    :title="t('__workFlow__.transfer')"
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
      <el-form-item :label="t('__workFlow__.transferee')" prop="assignee">
        <el-select
          v-model="form.assignee"
          filterable
          remote
          reserve-keyword
          :placeholder="t('__workFlow__.enterSearch')"
          loading-text="loading..."
          :remote-method="remoteMethod"
          :loading="searchLoading"
          style="width: 100%;"
          @focus="onFocus"
        >
          <el-option
            v-for="(item, i) in options"
            :key="`${item.id}-${i}`"
            :label="`${item.fullName}(${item.id})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('__workFlow__.transferReason')" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{minRows: 2}" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('update:visible', false)">{{ t('__workFlow__.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submitOK">{{ t('__workFlow__.confirm') }}</el-button>
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
        comment: '',
        assignee: ''
      },
      rules: {
        // todo
        assignee: [
          { required: true, message: '请选择转办人', trigger: 'blur' }
        ]
      },
      rulesEn: {
        // todo
        assignee: [
          { required: true, message: 'Please select the transferor', trigger: 'blur' }
        ]
      },
      searchLoading: false,
      options: []
    }
  },
  methods: {
    onFocus() {
      this.remoteMethod()
    },
    remoteMethod(query) {
      this.searchLoading = true
      const reg = /^[\u4e00-\u9fa5]+$/
      let id = ''
      let fullName = ''
      if (reg.test(query)) {
        fullName = query
      } else {
        id = query
      }
      this.$parent.apiGetUser({
        id,
        fullName,
        current: 1,
        size: 20
      }).then(res => {
        const data = res.data.data || {}
        this.options = data.records || []
      }).finally(() => {
        this.searchLoading = false
      })
    },
    submitOK() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('complete', 'wf_transfer_new', this.form)
        }
      })
    }
  }
}
</script>
