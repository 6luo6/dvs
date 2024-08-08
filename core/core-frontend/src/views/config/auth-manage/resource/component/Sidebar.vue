<template>
  <div class="sidebar">
    <el-tabs v-model="activeName" class="title" @tab-change="tabChange">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
    <template v-if="activeName == 'resource'">
      <resource-list style="height: calc(100% - 46px)"></resource-list>
    </template>
    <template v-if="activeName == 'menu'">
      <menu-list style="height: calc(100% - 46px)"></menu-list>
    </template>
    <!-- <el-container style="height: 100%">
      <el-aside width="18%">
        <sub-sidebar></sub-sidebar>
      </el-aside>
      <el-main>
        <sub-content></sub-content>
      </el-main>
    </el-container> -->
    <!-- <div class="search-box">
      <el-input v-model="searchKey" :placeholder="'搜索'" clearable>
        <template #prefix>
          <el-icon>
            <Icon name="de-search" />
          </el-icon>
        </template>
      </el-input>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted } from 'vue'
import ResourceList from './ResourceList.vue'
import MenuList from './MenuList.vue';

const emits = defineEmits(['changeRole','changeTab'])

const tabArray = [
  { label: '资源权限', name: 'resource' },
  { label: '菜单权限', name: 'menu' }
]
const activeName = ref('resource')
// const currentRole = ref('1')
// const sysRoleList = [
//   {
//     name: '管理员',
//     id: '1'
//   },
//   {
//     name: '普通用户',
//     id: '4'
//   }
// ]
// const customRoleList = ref([
//   {
//     name: '部门管理员',
//     id: '5'
//   },
//   {
//     name: '业务经理',
//     id: '6'
//   }
// ])
// const searchKey = ref('')
// const changeCurrentRole = role => {
//   currentRole.value = role.id
//   emits('changeRole', role)
// }

const tabChange = name => {
  emits('changeTab', name)
}

// const addRole = () => {
//   unref(addRoleDialog).changeShow(true)
// }

onMounted(() => {
  // emits('changeRole', sysRoleList[0])
})
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid rgba(31, 35, 41, 0.15);

  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 0 20px;
    border-bottom: 1px solid rgba(31, 35, 41, 0.15);
  }
}
</style>
