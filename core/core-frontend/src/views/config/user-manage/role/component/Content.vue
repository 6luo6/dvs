<template>
  <div class="content">
    <div class="flex">
      <div class="flex">
        <div class="role-name">{{ role.name }}</div>
        <div class="tag">系统</div>
      </div>
      <el-divider direction="vertical" />
      <div class="flex">
        <el-icon>
          <Icon name="icon_member_filled"></Icon>
        </el-icon>
        <div style="margin-left: 2px">2</div>
      </div>
    </div>
    <div class="flex" style="margin-top: 20px">
      <div class="btn-group" style="flex: 1">
        <el-dropdown @command="addUser">
          <el-button type="primary">
            添加用户<el-icon class="el-icon--right" style="margin-left: 5px"
              ><arrow-down
            /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="group">
                <el-icon>
                  <Icon name="icon_team-add_outlined"></Icon>
                </el-icon>
                添加组织用户
              </el-dropdown-item>
              <el-dropdown-item command="other">
                <el-icon>
                  <Icon name="icon_member-add_outlined"></Icon>
                </el-icon>
                添加外部用户
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-button type="primary" @click="openUserDialog('add')"> 添加用户 </el-button> -->
      </div>
      <div class="flex">
        <el-input v-model="searchKey" :placeholder="'搜索姓名、账号、邮箱'" clearable @keyup.enter.native="search()">
          <template #prefix>
            <el-icon>
              <Icon name="de-search" />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <div style="margin-top: 20px">
      <el-table
        ref="userTable"
        :data="tableData"
        fit
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <template v-for="item in tableColumn">
          <el-table-column
            v-if="!item.prop && !item.isSlot"
            :type="item.type"
            :min-width="item.width"
          />
          <el-table-column
            v-if="item.prop && !item.isSlot"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
          />
          <el-table-column
            v-if="item.isSlot"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :fixed="item.prop == 'operations' ? 'right' : false"
          >
            <template #default="scope">
              <div v-if="scope.column.property == 'operations'">
                <el-link
                  type="primary"
                  style="margin-left: 10px; font-size: 18px"
                  @click="deleteUser(scope.row)"
                >
                  <el-icon>
                    <Icon name="icon_assigned_outlined"></Icon>
                  </el-icon>
                </el-link>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" /> -->
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background
        layout="total,  prev, pager, next,sizes, jumper" :total="roleListTotal" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <add-user-dialog ref="addUserDialog" :type="dialogType" :width="dialogWidth" :role="role" @getRoles="getRoles"></add-user-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, unref, onMounted,} from 'vue'
import AddUserDialog from './AddUser.vue'
import { ElMessage, ElMessageBox } from 'element-plus-secondary'
import {userSelectedForRoleApi,unMountUserApi} from '@/api/user'

const props = defineProps({
  role: {
    type: Object,
    default: () => ({})
  }
})
const { role } = toRefs(props)

const searchKey = ref('')
interface Column {
  prop?: string
  type?: string
  label?: string
  width: number | string
  isSlot?: boolean
}
const tableColumn = ref<Column[]>([
  {
    prop: 'name',
    label: '姓名',
    width: 180
  },
  {
    prop: 'account',
    label: '账号',
    width: 180
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 180
  },
  {
    prop: 'operations',
    isSlot: true,
    label: '操作',
    width: 180
  }
])
const tableData = ref([
  {
    name: 'test1',
    account: 'test1',
    roleName: '普通用户',
    roleId: '4',
    email: '123456789@qq.com',
    isUse: true,
    createTime: '2024-01-01 10:00:00'
  },
  {
    name: 'admin',
    account: 'admin',
    roleName: '管理员',
    roleId: '1',
    email: '123456789@qq.com',
    isUse: true,
    createTime: '2024-01-01 10:00:00'
  }
])

const addUserDialog = ref(null)
const dialogType = ref('')
const dialogWidth = ref('50%')

const currentPage = ref(1) //当前页
const pageSize = ref(10) //页码大小
const roleListTotal = ref(0) //总条数 

// onMounted(()=>{
//   getRoles()
// })

const getRoles=(roleId: string, keyword?: string)=>{
  userSelectedForRoleApi(currentPage.value, pageSize.value,
    {
      request:
      {
        keyword: keyword||'',
        rid: roleId,
        order: ''
      }
    }).then(res => {
    console.log(res.data,'查询角色列表');

    // tableData.value = res.data.records
    // roleListTotal.value = res.data.total
    // currentPage.value = res.data.pages
  })
}

const addUser = command => {
  if (command == 'group') {
    dialogWidth.value = '50%'
  } else {
    dialogWidth.value = '30%'
  }
  dialogType.value = command
  unref(addUserDialog).changeShow(true,command)
}

const handleSelectionChange = item => {
  console.log('选中的数据 ==>', item)
}

const deleteUser = (row) => {
  console.log(row,props.role.id,'--------');
  
  ElMessageBox.confirm('确定将该用户从角色中移除吗？', '', {
    showClose: false,
    confirmButtonText: '移除',
    confirmButtonClass: 'ed-button--danger',
    type: 'warning'
  }).then(() => {
    unMountUserApi({
      rid:props.role.id,
      uid:'356'
    }).then(res=>{
      console.log(res,'解绑用户');
      ElMessage({
      type: 'success',
      message: '移除成功'
    })
    })
    
  })
}

const handleSizeChange = () => {
  getRoles(props.role.id)
}
const handleCurrentChange = () => {
  getRoles(props.role.id)
}
const search = ()=>{
  getRoles(props.role?.id,searchKey.value)
}
defineExpose({getRoles})
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flex {
  display: flex;
  align-items: center;
}

.role-name {
  font-size: 18px;
  font-weight: bold;
}

.tag {
  margin-left: 10px;
  font-size: 12px;
  color: #3977fe;
  background-color: #c2d4ff;
  padding: 0 5px;
  font-weight: bold;
}
.pagination {
  flex-grow: 1;
  position: relative;
  margin-top: 40px;
}

.ed-pagination {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
