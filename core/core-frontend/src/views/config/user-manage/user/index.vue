<template>
  <div class="content">
    <div class="flex">
      <div class="btn-group" style="flex: 1">
        <el-button type="primary" @click="openUserDialog('add')"> 添加用户 </el-button>
        <!-- todo -->
        <el-button style="margin-left: 12px" @click="openImportUserDialog"> 批量导入 </el-button>
      </div>
      <div class="flex">
        <el-input v-model="searchKey" :placeholder="'搜索姓名、账号、邮箱'" clearable @keyup.enter.native="search()">
          <template #prefix>
            <el-icon>
              <Icon name="de-search" />
            </el-icon>
          </template>
        </el-input>
        <el-button style="margin-left: 12px">
          <div class="flex">
            <el-icon>
              <Icon name="icon-filter"></Icon>
            </el-icon>
            <div style="margin-left: 5px">筛选</div>
          </div>
        </el-button>
      </div>
    </div>
    <div style="margin-top: 20px">
      <el-table ref="userTable" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#e8e9e9' }">
        <template v-for="item in tableColumn">
          <el-table-column v-if="!item.prop && !item.isSlot" :type="item.type" :min-width="item.width"
            show-overflow-tooltip />
          <el-table-column v-if="item.prop && !item.isSlot" :prop="item.prop" :label="item.label"
            :min-width="item.width" show-overflow-tooltip />
          <el-table-column v-if="item.isSlot" :prop="item.prop" :label="item.label" :min-width="item.width"
            :fixed="item.prop == 'operations' ? 'right' : false" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.column.property == 'operations'">
                <el-link type="primary" style="font-size: 18px" @click="openUserDialog('edit', scope.row)">
                  <el-icon>
                    <Icon name="icon_edit_outlined"></Icon>
                  </el-icon>
                </el-link>
                <el-popconfirm :title="'是否恢复为初始密码？ '+defaultPwd" width="200" @confirm="resetPwd(scope.row.id)">
                  <template #reference>
                    <el-link type="primary" style="margin-left: 10px; font-size: 18px">
                      <el-icon>
                        <Icon name="icon_resetpassword"></Icon>
                      </el-icon>
                    </el-link>
                  </template>
                </el-popconfirm>
                <el-link type="primary" style="margin-left: 10px; font-size: 18px" @click="deleteUser(scope.row.id)">
                  <el-icon>
                    <Icon name="icon_delete-trash_outlined"></Icon>
                  </el-icon>
                </el-link>
              </div>
              <div v-if="scope.column.property == 'enable'">
                <el-switch v-model="scope.row.enable" @change="changeUse($event, scope.row)" />
              </div>
              <div v-if="scope.column.property == 'roleItems'">
                {{ String(scope.row.roleItems?.map(e => e.name)) || '--' }}
              </div>
              <div v-if="scope.column.property == 'createTime'">
                {{ disposeDate(scope.row.createTime) || '--' }}
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
        layout="total,  prev, pager, next,sizes, jumper" :total="userListTotal" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <add-user-dialog ref="addUserDialog" :type="formType" @getUser="getUser()"></add-user-dialog>
    <ImportUserDialog v-model="showDialog" @cancelBtn="showDialog = false" />
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted } from 'vue'
import AddUserDialog from './component/AddUser.vue'
import ImportUserDialog from './component/ImportUser.vue'
import { ElMessage, ElMessageBox } from 'element-plus-secondary'
import { userPageApi, resetPwdApi, defaultPwdApi,switchEnableApi,userDelApi} from '@/api/user'
import {disposeDate} from '@/utils/utils'
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
    prop: null,
    type: 'selection',
    width: 55
  },
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
    prop: 'roleItems',
    label: '角色',
    width: 180,
    isSlot: true
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 180
  },
  {
    prop: 'enable',
    label: '是否启用',
    width: 180,
    isSlot: true
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    isSlot: true
  },
  {
    prop: 'operations',
    isSlot: true,
    label: '操作',
    width: 180
  }
])
const tableData = ref([])

const addUserDialog = ref(null)
const showDialog = ref(false)
const formType = ref('add')
const currentPage = ref(1) //当前页
const pageSize = ref(10) //页码大小
const userListTotal = ref(0) //总条数
const defaultPwd = ref()

onMounted(() => {
  getUser()
  //获取默认密码
  defaultPwdApi().then(res => {
    defaultPwd.value = res.data
  })
})

const handleSelectionChange = item => {
  console.log('选中的数据 ==>', item)
}
//启用/禁用当前用户
const changeUse = (value, row) => {
  console.log('启用/禁用当前用户 ==>', row, value);
  switchEnableApi({id:row.id,enable:value})
}

const openUserDialog = (type, row = {}) => {
  formType.value = type
  unref(addUserDialog).changeShow(true, row)
}
const openImportUserDialog = () => {
  showDialog.value = true
}
const resetPwd = (id) => {
  resetPwdApi(id).then(res => {
    console.log(res, '重置密码');
    if (true) {
      ElMessage({
        message: "重置成功！",
        type: 'success'
      })
    }
  })

}
const deleteUser = (id) => {
  ElMessageBox.confirm(
    '确定删除该用户吗？',
    '',
    {
      showClose: false,
      confirmButtonText: '删除',
      confirmButtonClass: 'ed-button--danger',
      type: "warning"
    }
  ).then(() => {
    userDelApi(id).then(res=>{
      console.log(res,'删除用户');
      getUser()
      ElMessage({
      type: 'success',
      message: '删除成功',
    })
    }).catch(err=>{
      console.log(err);  
    })
    
  })
}
const getUser = (keyword?: string) => {
  userPageApi(currentPage.value, pageSize.value,
    {
      request:
      {
        keyword: keyword,
        conditions: [],
        orders: []
      }
    }
  ).then(res => {
    console.log(res.data);

    tableData.value = res.data.records
    userListTotal.value = res.data.total
    currentPage.value = res.data.pages
  })
}
const handleSizeChange = () => {
  getUser()
}
const handleCurrentChange = () => {
  getUser()
}

const search = () => {

  getUser(searchKey.value)
}
</script>

<style lang="less" scoped>
.content {
  padding: 30px;
  height: calc(100vh - 176px);
  display: flex;
  flex-direction: column;
}

.flex {
  display: flex;
  align-items: center;
}

.tbHearderStyle {
  background-color: red;
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
