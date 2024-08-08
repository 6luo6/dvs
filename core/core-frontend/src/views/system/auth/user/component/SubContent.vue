<template>
  <div class="content">
    <div class="header">
      <el-input v-model="searchKey" :placeholder="'搜索名称'" clearable>
        <template #prefix>
          <el-icon>
            <Icon name="de-search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div style="margin-top: 20px">
      <el-table ref="userTable" :data="tableData" style="width: 100%" row-key="name" default-expand-all
        :header-cell-style="{ background: '#e8e9e9' }" >
        >
        <template v-for="item in tableColumn">
          <el-table-column v-if="!item.prop && !item.isSlot" :type="item.type" :min-width="item.width" />
          <el-table-column v-if="item.prop && !item.isSlot" :prop="item.prop" :label="item.label"
            :min-width="item.width" />
          <el-table-column v-if="item.isSlot" :prop="item.prop" :label="item.label" :min-width="item.width" >
            <template #default="scope" >
              <div v-if="scope.column.property == 'name'" class="tree-item">
                    <el-icon>
                        <Icon :name="scope.row.children?.length ? 'dv-folder' : 'dv-dashboard-spine'"></Icon>
                    </el-icon>
                    <div class="_text">{{ scope.row.name }}</div>
              </div>
              <div  v-if="scope.column.property == 'look'" >
                <el-checkbox v-if="scope.row.look!==null" v-model="scope.row.look"  size="large" />
              </div>
              <div  v-if="scope.column.property == 'import'" >
                <el-checkbox v-if="scope.row.import!==null" v-model="scope.row.import"  size="large" />
              </div>
              <div  v-if="scope.column.property == 'manage'" >
                <el-checkbox  v-model="scope.row.manage"  size="large" />
              </div>
              <div  v-if="scope.column.property == 'auth'" >
                <el-checkbox  v-model="scope.row.auth"  size="large" />
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

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
    label: '资源名称',
    width: 380,
    isSlot: true,
  },
  {
    prop: 'look',
    label: '查看',
    isSlot: true,
    width: 80,
  },
  {
    prop: 'import',
    label: '导出',
    isSlot: true,
    width: 80
  },
  {
    prop: 'manage',
    isSlot: true,
    label: '管理',
    width: 80
  },
  {
    prop: 'auth',
    isSlot: true,
    label: '授权',
    width: 80
  }
])
const tableData = ref([
  {
    id: '1',
    name: '仪表盘',
    look: null,
    import: null,
    manage: false,
    auth: false,
    children: [
      {
        id: '1-1',
        name: '演示',
        look: true,
        import: false,
        manage: false,
        auth: false,
        children: [
          {
            id: '1-1-1',
            name: '新建仪表盘',
            look: true,
            import: false,
            manage: false,
            auth: false,
          }
        ]
      },
    ]
  },
])
</script>
<style lang="less" scoped>
.content {
  padding: 30px;
}
.tree-item {
    display: flex;
    align-items: center;

    ._text {
        margin-left: 5px;
    }
}
::v-deep .ed-table .cell{
  display: flex;
  align-items: center;
  line-height: 28px;
}
</style>
