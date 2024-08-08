<template>
  <div class="content">
    <div class="flex">
      <div class="btn-group" style="flex: 1">
        <el-button type="primary" @click="openGroupDialog('add')">
          <el-icon style="margin-right: 5px"><Icon name="icon_add_outlined"></Icon></el-icon>
          添加组织
        </el-button>
        <!-- todo -->
        <!-- <el-button style="margin-left: 12px"> 批量导入 </el-button> -->
      </div>
      <div class="flex">
        <el-input v-model="searchKey" :placeholder="'请输入名称搜索'" clearable @keyup.enter.native="search()">
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
        style="width: 100%"
        row-key="name"
        default-expand-all
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
                <el-tooltip class="box-item" effect="dark" content="添加子组织">
                  <el-link
                    type="primary"
                    style="font-size: 18px"
                    @click="openGroupDialog('add', scope.row)"
                  >
                    <el-icon>
                      <Icon name="icon_add_outlined"></Icon>
                    </el-icon>
                  </el-link>
                </el-tooltip>
                <el-link
                  type="primary"
                  style="margin-left: 10px; font-size: 18px"
                  @click="openGroupDialog('edit', scope.row)"
                >
                  <el-icon>
                    <Icon name="icon_edit_outlined"></Icon>
                  </el-icon>
                </el-link>
                <el-dropdown @command="operatorMore(scope.row)">
                  <el-link
                    type="primary"
                    style="margin-left: 10px; font-size: 18px"
                  >
                    <el-icon>
                      <Icon name="icon_more_outlined"></Icon>
                    </el-icon>
                  </el-link>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="delete">
                        <el-icon>
                          <Icon name="icon_delete-trash_outlined"></Icon>
                        </el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>

                <!-- <el-popconfirm title="是否恢复为初始密码？" width="200" @confirm="resetPwd">
                  <template #reference>
                    <el-link type="primary" style="margin-left: 10px; font-size: 18px">
                      <el-icon>
                        <Icon name="icon_resetpassword"></Icon>
                      </el-icon>
                    </el-link>
                  </template>
                </el-popconfirm>
                <el-link
                  type="primary"
                  style="margin-left: 10px; font-size: 18px"
                  @click="deleteUser"
                >
                  <el-icon>
                    <Icon name="icon_delete-trash_outlined"></Icon>
                  </el-icon>
                </el-link> -->
              </div>
              <div v-if="scope.column.property == 'createTime'">
              {{ disposeDate(scope.row.createTime)||"--" }}
              </div>
              <div v-if="scope.column.property == 'count'">
              {{ scope.row.children.length }}
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" /> -->
      </el-table>
    </div>
    <add-group-dialog ref="addGroupDialog" :type="formType" @getOrgList="getOrgList"></add-group-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted} from 'vue'
import AddGroupDialog from './component/AddGroup.vue'
import { ElMessage, ElMessageBox } from 'element-plus-secondary'
import {searchApi, deleteApi} from '@/api/org'
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
    prop: 'name',
    label: '组织名称',
    width: 380
  },
  {
    prop: 'count',
    label: '下属组织数',
    width: 180,
    isSlot: true,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    isSlot: true,
  },
  {
    prop: 'operations',
    isSlot: true,
    label: '操作',
    width: 180
  }
])
const tableData = ref([
  // {
  //   id: '1',
  //   name: 'test1',
  //   count: '2',
  //   createTime: '2024-01-01 10:00:00',
  //   children: [
  //     {
  //       id: '1-1',
  //       name: 'test2',
  //       count: '0',
  //       createTime: '2024-01-01 10:00:00'
  //     },
  //     {
  //       id: '1-2',
  //       name: 'test3',
  //       count: '0',
  //       createTime: '2024-01-01 10:00:00'
  //     }
  //   ]
  // },
  // {
  //   id: '2',
  //   name: 'admin',
  //   count: '0',
  //   createTime: '2024-01-01 10:00:00'
  // }
])

const addGroupDialog = ref(null)

const formType = ref('add')

onMounted(()=>{
  getOrgList()
  
})

const getOrgList = (keyWords?:string)=>{
  searchApi({
    keyword:keyWords
  }).then(res=>{
    console.log(res,'组织列表查询');
    tableData.value = res.data
  })
}

const search = ()=>{
  getOrgList(searchKey.value)
}

const openGroupDialog = (type, row = {},orgList?:any) => {
  formType.value = type
  row = {
    ...row,
    type: type
  }
  orgList = tableData.value
  unref(addGroupDialog).changeShow(true, row,orgList)
}

const deleteUser = (id) => {
  ElMessageBox.confirm('若该组织存在子组织请先删除子组织', '确定删除该组织吗？', {
    showClose: false,
    confirmButtonText: '删除',
    confirmButtonClass: 'ed-button--danger',
    type: 'warning'
  }).then(() => {
    if(id){
      deleteApi(id).then(() => {
        getOrgList()
        ElMessage({
      type: 'success',
      message: '删除成功'
      })
      })
    }
    
  })
}

const operatorMore = (command) => {
  console.log(command,555555);
  // if (command == 'delete') {
  // }
  deleteUser(command?.id)
}

// const formatDate=(time)=>{
// }

</script>

<style lang="less" scoped>
.content {
  padding: 30px;
  height: calc(100vh - 176px);
}

.flex {
  display: flex;
  align-items: center;
}
</style>
