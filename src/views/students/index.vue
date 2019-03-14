<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="'学生姓名'"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.course"
        :placeholder="'课程'"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in courseTypes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        :placeholder="'状态'"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in studentStatusList"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ '搜索' }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ '添加' }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ '导出' }}</el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >{{ '操作人' }}</el-checkbox>
    </div>

    <br>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="'ID'"
        prop="id"
        sortable="custom"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'姓名'"
        width="80px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'性别'"
        width="65px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ sexList[scope.row.sex].value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'年龄'"
        width="65px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :label="'状态'"
        class-name="status-col"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.left_times | statusFilter">{{ scope.row.left_times | leftTimes2Status }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        :label="'入学时间'"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.join_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        :label="'联系人'"
        width="65px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ contactList[scope.row.contact].value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'联系电话'"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'备注'"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ps }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'操作'"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ '编辑' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="studentForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          :label="'姓名'"
          prop="name"
          placeholder="学员姓名"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          :label="'性别'"
          prop="sex"
        >
          <el-select
            v-model="temp.sex"
            class="filter-item"
            placeholder="请选择性别"
          >
            <el-option
              v-for="item in sexList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'年龄'"
          prop="age"
        >
          <el-input
            v-model.number="temp.age"
            placeholder="小学年龄 1-7|2-8|3-9|4-10|5-11|6-12"
          />
        </el-form-item>
        <el-form-item
          :label="'联系人'"
          prop="contact"
        >
          <el-select
            v-model="temp.contact"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in contactList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'联系电话'"
          prop="phone"
        >
          <el-input v-model.number="temp.phone" />
        </el-form-item>
        <el-form-item
          :label="'备注'"
          prop="ps"
        >
          <el-input v-model="temp.ps" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ '确认' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >{{ '确认' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, addStudent, updateStudent } from '@/api/students'
import { fetchList as fetchStudentList } from '@/api/students'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { studentStatusList, sexList, contactList } from '@/enum'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(left_times) {
      let ret = 'success'
      if (left_times < 0) {
        ret = 'danger'
      } else if (left_times === 0) {
        ret = 'info'
      } else if (left_times < 5) {
        ret = 'warning'
      }
      return ret
    },
    leftTimes2Status(left_times) {
      let ret = studentStatusList[0].value
      if (left_times < 0) {
        ret = studentStatusList[3].value
      } else if (left_times === 0) {
        ret = studentStatusList[2].value
      } else if (left_times < 5) {
        ret = studentStatusList[1].value
      }
      return ret
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (!/^1[34578]\d{9}$/.test(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      studentList: null,
      studentStatusList,
      sexList,
      contactList,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: name,
        sex: undefined,
        age: undefined,
        contact: undefined,
        phone: undefined,
        ps: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑学员',
        create: '添加学员'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '请填写学员姓名', trigger: 'blur' }],
        age: [{ type: 'number', message: '请填写数字', trigger: 'change' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        add_time: [
          {
            type: 'date',
            required: true,
            message: '请选择入学日期',
            trigger: 'change'
          }
        ]
      },
      downloadLoading: false,
      courseTypes: []
    }
  },
  created() {
    this.courseTypes = this.$store.getters.courseTypes
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStudentList().then(response => {
        this.studentList = response.data.items
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total

          this.listLoading = false
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: name,
        sex: undefined,
        age: undefined,
        contact: undefined,
        phone: undefined,
        ps: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['studentForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['studentForm'].validate(valid => {
        if (valid) {
          addStudent(this.temp).then((response) => {
            this.temp.id = response.id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['studentForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['studentForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateStudent(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getCourseName(id) {
      let name = ''
      if (this.studentList && this.studentList[id]) {
        name = this.studentList[id].course
      }
      return name
    },
    formAddTimeChanged(val) {
      console.log(val.getTime())
      this.temp.add_time = val.getTime() / 1000
    }
  }
}
</script>
