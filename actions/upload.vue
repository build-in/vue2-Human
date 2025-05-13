<template>
  <div>
    <el-upload
      class="upload-demo"
      :headers="headers"
      :action="action"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :on-change="handleChange"
      multiple
      :file-list="fileList"
    >
      <el-button :loading="loading" size="small" type="primary">{{ t('__workFlow__.upload') }}</el-button>
    </el-upload>
    <div v-if="previewVisible" class="previewDialog">
      <div class="pv-bg" />
      <div class="pv-close">
        <i class="el-icon-circle-close" @click="previewVisible=false" />
      </div>
      <div class="pv-con">
        <img :src="pvData.url">
      </div>
    </div>
  </div>
</template>

<script>
import Locale from '../../../../mixins/locale'
export default {
  mixins: [Locale],
  props: {
    requestConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loading: Boolean
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      upLoading: false,
      pvData: {}
    }
  },
  computed: {
    headers() {
      return this.requestConfig.headers || {}
    },
    action() {
      let baseURL = this.requestConfig.baseURL || ''
      if (baseURL) {
        const isEndFix = baseURL.charAt(baseURL.length - 1) === '/'
        baseURL = isEndFix ? baseURL.substr(0, baseURL.length - 1) : baseURL
      }
      return baseURL + '/operating-omc-portal/common/file/workflow/upload'
    }
  },
  methods: {
    handlePreview(file) {
      const type = file.raw.type
      this.pvData = {}
      try {
        if (type.includes('image')) {
          this.pvData = file.response.data || {}
          this.previewVisible = true
        } else {
          this.$message({
            message: this.t('__workFlow__.imageTips'),
            type: 'warning'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    handleProgress() {
      this.$emit('update:loading', true)
    },
    handleChange() {
      this.$emit('update:loading', false)
    },
    handleSuccess(response, file, fileList) {
      const list = []
      fileList.forEach(v => {
        if (v.response.code === 'APPLY_SUCCESS') {
          list.push(v)
        } else {
          this.$message.error(v.response.msg || this.t('__workFlow__.uploadErr'))
        }
      })
      this.fileList = list
      this.$emit('update:loading', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.previewDialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .pv-bg {
    background: #000;
    opacity: .5;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .pv-close {
    position: absolute;
    top: 26px;
    right: 26px;
    color: #fff;
    font-size: 30px;
    i {
      cursor: pointer;
    }
  }
  .pv-con {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 80%;
    width: 80%;
    overflow: auto;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
    }
  }
}
</style>
