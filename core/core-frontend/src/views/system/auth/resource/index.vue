<template>
  <div class="main">
    <el-container style="height: 100%;">
      <el-aside :width="sidebarWidth">
        <auth-sidebar :source="source" @changeRole="changeRole" @changeTab="changeTab"></auth-sidebar>
      </el-aside>
      <el-main>
        <auth-content ref="authContent" :source="source" :role="userInfo" :currentPermission="currentPermission" @getTabel="getTabel"></auth-content>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import AuthSidebar from './component/Sidebar.vue'
import AuthContent from './component/Content.vue'
import { ref, toRefs, unref } from 'vue';

const props = defineProps({
    source: {
        type: String,
        default: 'user'
    }
})
const { source } = toRefs(props)
const currentPermission = ref('resource')
const userInfo = ref({})
const sidebarWidth = ref('50%')
const authContent = ref()

const changeRole = (role) => {
    userInfo.value = role
    console.log("切换用户/角色 ==>", role)
}

const changeTab = name => {
  console.log('切换权限类型',name);
  console.log(unref(authContent))
  unref(authContent).test()
  currentPermission.value = name;
    if(name == 'menu') {
        sidebarWidth.value = '25%'
    }else {
        sidebarWidth.value = '50%'
    }
}

const getTabel = ()=>{
  
}
</script>

<style lang="less" scoped>
::v-deep {
    .ed-main {
        padding: 0;
    }
}
.main {
    height: calc(100vh - 176px);
}
</style>
