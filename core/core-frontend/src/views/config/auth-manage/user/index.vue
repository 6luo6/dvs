<template>
  <div class="main">
    <el-container style="height: 100%;">
      <el-aside width="18%">
        <auth-sidebar :source="source" @changeRole="changeRole"></auth-sidebar>
      </el-aside>
      <el-main>
        <auth-content :source="source" :role="userInfo"></auth-content>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import AuthSidebar from './component/Sidebar.vue'
import AuthContent from './component/Content.vue'
import { ref, toRefs } from 'vue';

const props = defineProps({
    source: {
        type: String,
        default: 'user'
    }
})
const { source } = toRefs(props)

const userInfo = ref({})

const changeRole = (role) => {
    userInfo.value = role
    console.log("切换用户/角色 ==>", role)
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
