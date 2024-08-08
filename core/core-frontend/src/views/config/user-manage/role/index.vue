<template>
  <div class="main">
    <el-container style="height: 100%;">
      <el-aside width="22%">
        <role-sidebar @changeRole="changeRole"></role-sidebar>
      </el-aside>
      <el-main>
        <role-content ref="roleContent" :role="roleInfo"></role-content>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import RoleSidebar from './component/Sidebar.vue'
import RoleContent from './component/Content.vue'
import { ref,unref } from 'vue';
const roleInfo = ref({})
const roleContent = ref()
const changeRole = (role) => {
    roleInfo.value = role
    console.log("切换角色 ==>", role)
    unref(roleContent).getRoles(role.id)
}
</script>

<style lang="less" scoped>
.main {
    height: calc(100vh - 176px);
}
</style>
