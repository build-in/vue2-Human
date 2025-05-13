<template>
  <el-dialog
    class="user-select full-modal"
    :visible.sync="visible"
    title="人员选择"
    :before-close="handleClose"
    append-to-body
  >
    <el-form :model="form">
      <el-form-item label="shareId">
        <el-input v-model="form.id" placeholder="请输入shareit id" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.fullName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="onSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      @row-click="selectRow"
    >
      <el-table-column
        prop="id"
        label="shareId"
      >
        <template slot-scope="scope">
          <el-radio v-model="shareid" :label="scope.row.id"> {{ scope.row.id }} </el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="fullName"
        label="姓名"
      />
    </el-table>

    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :pager-count="5"
        :total="total"
        @current-change="changePage"
      />
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        @click="handleClose"
      >取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'WfUserSelect',
  props: {
  },
  data() {
    return {
      visible: true,
      form: {},
      tableData: [],
      shareid: '',
      loading: false,
      total: 0,
      current: 1
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.current = 1
      this.getUser()
    },
    getUser() {
      this.loading = true
      this.$parent.apiGetUser({
        id: this.form.id || '',
        fullName: this.form.fullName || '',
        current: this.current,
        size: 10
      }).then(res => {
        console.log('user', res)
        this.tableData = res.data.data.records || []
        this.total = res.data.data.total
        console.log('tableData', this.tableData)
      }).finally(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.$emit('selectUser', this.shareid)
      this.visible = false
    },
    handleConfirm() {
      this.$emit('selectUser', this.shareid)
      this.handleClose()
    },
    selectRow(row, column) {
      console.log('row', row)
      this.shareid = row.id
    },
    changePage(current) {
      this.current = current
      this.getUser()
    }

  }
}
</script>
<style lang="scss" scoped>
.page {
  padding-top: 20px;
  overflow: hidden;
  text-align: right;
}
</style>
<style lang="scss">
.user-select {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
