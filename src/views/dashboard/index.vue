<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span
        v-for="role in roles"
        :key="role"
      >{{ role }}</span></div>
    <br>
    <el-tag
      :key="tag.id"
      v-for="tag in typeList"
      :disable-transitions="false"
    >
      {{tag.name}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button
      v-else
      class="button-new-tag"
      size="small"
      @click="showInput"
    >+ New Tag</el-button>
  </div>
</template>

<script>
import { fetchTypeList, addType } from '@/api/courses'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
      loading: true,
      typeList: null,
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      fetchTypeList().then(response => {
        this.typeList = response.data.items
        this.loading = false
      })
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        addType({ name: inputValue }).then(response => {
          this.getList()
        })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
