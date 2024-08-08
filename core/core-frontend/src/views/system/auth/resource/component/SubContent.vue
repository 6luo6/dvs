<template>
  <div class="content">
    <div class="header">
      <el-input v-model="searchKey" :placeholder="'搜索'" clearable>
        <template #prefix>
          <el-icon>
            <Icon name="de-search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div style="margin-top: 20px">
      <el-table ref="userTable" :data="tableData" style="width: 100%" default-expand-all
        :header-cell-style="{ background: '#e8e9e9' }">
        <template v-for="item in tableColumn">
          <el-table-column v-if="!item.prop && !item.isSlot" :type="item.type" :min-width="item.width" />
          <el-table-column v-if="item.prop && !item.isSlot" :prop="item.prop" :label="item.label"
            :min-width="item.width" />
          <el-table-column v-if="item.isSlot" :prop="item.prop" :label="item.label" :min-width="item.width">
            <template #default="scope">
              <div v-if="scope.column.property == 'manage'">
                <el-checkbox v-model="scope.row.manage" size="large" />
              </div>
              <div v-if="scope.column.property == 'auth'">
                <el-checkbox v-model="scope.row.auth" size="large" />
              </div>
              <div v-if="scope.column.property == 'name'">
                <div class="flex">
                  <div class="role-name">{{ scope.row.name }}</div>
                  <div class="tag">系统</div>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, watch, useAttrs } from 'vue';

const emits = defineEmits(['getTableData'])
const props = defineProps({
  currentPermission: {
    type: String,
    default: 'resource'
  }
})
// const { activeName } = toRefs(props)
interface Column {
  prop?: string
  type?: string
  label?: string
  width: number | string
  isSlot?: boolean
}
const tableData = ref([])
const tableColumn = ref<Column[]>([])

const searchKey = ref('')

const attrs = useAttrs()
console.log(attrs,'attrs-孙组件');

const getTableDataByUser = ()=>{
  // emits('getTableData')
//用户模拟数据
const user = [
{
    id: '1',
    name: 'admin_1',
    look: null,
    import: null,
    manage: true,
    auth: true,
  },
  {
    id: '2',
    name: 'admin_2',
    look: null,
    import: null,
    manage: false,
    auth: false,
  }
]
tableData.value = user
}
const getTableDataByRole = ()=>{
//角色模拟数据；
const roleData = [
  {
    id: '1',
    name: '管理员角色',
    use: true,
    auth: true,
    readOnly:true,
  },
  {
    id: '1',
    name: '角色1',
    use: false,
    auth: false,
    readOnly:false,
  },
]
tableData.value = roleData
}

watch(() => props.currentPermission, (n) => {
  if (n == 'resource') {
    tableColumn.value = [{
      prop: 'name',
      label: '名称',
      width: 320
    },
    {
      prop: 'look',
      label: '查看',
      width: 80
    },
    {
      prop: 'import',
      label: '导出',
      width: 80
    },
    {
      prop: 'manage',
      label: '管理',
      width: 80,
      isSlot: true
    },
    {
      prop: 'auth',
      isSlot: true,
      label: '授权',
      width: 80,
    }]
    getTableDataByUser()
  } else {
    tableColumn.value = [
      {
        prop: 'name',
        label: '名称',
        width: 320,
        isSlot: true
      },
      {
        prop: 'use',
        label: '使用',
        width: 80
      },
      {
        prop: 'auth',
        label: '授权',
        width: 80
      },
    ]
    getTableDataByRole()
  }

},
  { immediate: true, deep: true }
)
</script>
<style lang="less" scoped>
.content {
  padding: 30px;
}
.flex {
  display: flex;
  align-items: center;
}

.role-name {
  font-size: 16px;
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
</style>
