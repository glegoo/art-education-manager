<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="'教师姓名'"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <!-- <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @@="tableKey=tableKey+1"
      >{{ '操作人' }}</el-checkbox>-->
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
      @sort-@="sortChange"
    >
      <el-table-column :label="'ID'" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'课程类型'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ courseTypeFilter(scope.row.course_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'教师'" width="65px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teacher_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'学员'" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.students_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'授课日'" width="65px" align="center">
        <template slot-scope="scope">
          <span>{{ weekList[scope.row.week].value }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'授课时间'" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.begin_time.slice(0,5) + '~' + scope.row.end_time.slice(0,5) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'备注'" align="center">
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="courseForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="'课程类型'" prop="course_type">
          <el-select v-model="temp.course_type" class="filter-item" placeholder="请选择课程">
            <el-option
              v-for="item in courseTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="'授课模式'" prop="course_mode">
          <el-radio-group v-model="temp.course_mode" @change="courseModeChanged">
            <el-radio :label="0">一对一</el-radio>
            <el-radio :label="1">小组课</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="'教师'" prop="teacher">
          <el-select v-model="temp.teacher" class="filter-item" placeholder="请选择教师">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="'工资'" prop="salary">
          <el-input v-model.number="temp.salary" placeholder="请输入工资（每课时）" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item v-for="(student, index) in temp.students" :label="'学员'" :key="student.key">
          <el-col :span="8">
            <el-form-item
              :prop="'students.' + index + '.value'"
              :rules="{required: true, validator: validateStudentName, trigger: 'blur'}"
            >
              <el-input v-model="student.value" style="width: 130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-popover placement="top" width="160" v-model="student.confirmVisable">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="student.confirmVisable = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="student.confirmVisable = false; removeStudentForm(student)"
              >确定</el-button>
            </div>
            <el-button
              v-if="index != 0"
              icon="el-icon-minus"
              size="mini"
              type="danger"
              plain
              circle
              slot="reference"
            ></el-button>
          </el-popover>
        </el-form-item>
        <el-form-item size="mini">
          <el-button
            @click="addStudentDomain"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            circle
            :disabled="temp.course_mode === 0"
          ></el-button>
        </el-form-item>
        <el-form-item :label="'授课日'" prop="week">
          <el-select
            v-model="temp.week"
            class="filter-item"
            placeholder="请选择星期"
            style="width: 200px;"
          >
            <el-option
              v-for="item in weekList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="'授课时间'" required>
          <el-col :span="8">
            <el-form-item prop="begin_time">
              <el-time-select
                placeholder="起始时间"
                v-model="temp.begin_time"
                style="width: 130px;"
                :picker-options="{
                  start: '08:00',
                  step: '00:10',
                  end: '21:00'
                }"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="end_time">
              <el-time-select
                placeholder="结束时间"
                v-model="temp.end_time"
                style="width: 130px;"
                :picker-options="{
                  start: '08:00',
                  step: '00:10',
                  end: '21:00',
                  minTime: temp.begin_time
                }"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="'备注'" prop="ps">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="temp.ps"
            style="width: 300px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ '确认' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ '确认' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, addCourse, updateCourse } from '@/api/courses'
import { fetchList as fetchTeacherList } from '@/api/teachers'
import { getStudentByName } from '@/api/students'
import waves from '@/directive/waves' // Waves directive
import { getElementById } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { weekList } from '@/enum'
import { courseTypeFilter } from '@/filters'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    teacherNameFilter: function(id) {}
  },
  data() {
    var validateStudentName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学生姓名不能为空'))
      }
      const same = this.temp.students.filter(student => {
        return student.value === value
      })
      if (same.length > 1) {
        return callback(new Error('不可以重复添加'))
      }
      const strArr = rule.field.split('.')
      const index = Number(strArr[1])
      getStudentByName({ name: value })
        .then(response => {
          if (response.data) {
            this.temp.students[index].id = response.data.id
            callback()
          }
        })
        .catch(err => {
          return callback(new Error(err))
        })
    }
    return {
      tableKey: 0,
      list: null,
      teacherList: null,
      courseTeacherList: null,
      courseStudentList: null,
      weekList,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        course: undefined,
        student: undefined,
        teacher: undefined,
        sort: '+id'
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        course_mode: 0,
        salary: 0,
        week: undefined,
        begin_time: undefined,
        end_time: undefined,
        teacher: undefined,
        ps: undefined,
        students: [{ value: '' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑课程',
        create: '添加课程'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        teacher: [{ required: true, message: '请选择教师', trigger: '@' }],
        course_type: [
          { required: true, message: '请选择课程类型', trigger: '@' }
        ],
        course_mode: [
          { required: true, message: '请选择授课模式', trigger: '@' }
        ],
        salary: [
          { type: 'number', message: '请填写数字' },
          { required: true, message: '请填写工资' }
        ],
        week: [{ required: true, message: '请选择授课日', trigger: '@' }],
        begin_time: [{ required: true, message: '请选开始时间', trigger: '@' }],
        end_time: [{ required: true, message: '请选结束时间', trigger: '@' }]
      },
      downloadLoading: false,
      courseTypes: [],
      courseTypeFilter,
      getElementById,
      validateStudentName
    }
  },
  created() {
    this.courseTypes = this.$store.getters.courseTypes
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      let loadCount = 0

      // 加载科目列表
      this.typeList = this.$store.getters.courseTypes
      if (this.typeList.length === 0) {
        loadCount++
        this.$store.dispatch('GetCourseTypes').then(() => {
          this.typeList = this.$store.getters.courseTypes
          loadCount--
          this.listLoading = loadCount === 0
        })
      }

      // 加载教师列表
      loadCount++
      fetchTeacherList().then(response => {
        this.teacherList = response.data.items

        loadCount--
        this.listLoading = loadCount === 0
      })

      // 加载课程列表
      loadCount++
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        loadCount--
        this.listLoading = loadCount === 0
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
        course_mode: 0,
        salary: 0,
        week: undefined,
        begin_time: undefined,
        end_time: undefined,
        teacher: undefined,
        ps: undefined,
        students: [{ value: '' }]
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.students = [{ value: '' }]
      this.$nextTick(() => {
        this.$refs['courseForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          addCourse(this.temp).then(response => {
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
        this.$refs['courseForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // @ Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCourse(tempData).then(() => {
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
        const tHeader = [
          'ID',
          '姓名',
          '性别',
          '年龄',
          '联系人',
          '联系电话',
          '备注'
        ]
        const filterVal = ['id', 'name', 'sex', 'age', 'contact', 'phone', 'ps']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'course-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          // if (j === 'sex') {
          //   return this.sexList[v[j]].value
          // } else if (j === 'contact') {
          //   return this.contactList[v[j]].value
          // } else {
          return v[j]
          // }
        })
      )
    },
    formAddTimeChanged(val) {
      console.log(val.getTime())
      this.temp.add_time = val.getTime() / 1000
    },
    removeStudentForm(item) {
      var index = this.temp.students.indexOf(item)
      if (index !== -1) {
        this.temp.students.splice(index, 1)
      }
    },
    addStudentDomain() {
      this.temp.students.push({
        value: '',
        key: Date.now()
      })
    },
    courseModeChanged(value) {
      if (value === 0 && this.temp.students.length > 1) {
        this.temp.students = this.temp.students.slice(0, 1)
      }
    }
  }
}
</script>
