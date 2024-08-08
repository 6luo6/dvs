<template>
  <div></div>
</template>
<script setup lang="ts">
import { platformLoginApi } from '@/api/login'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useCache } from '@/hooks/web/useCache'

const userStore = useUserStoreWithOut()
const route = useRoute()
const { wsCache } = useCache()
wsCache.delete('user.token')
platformLoginApi(route.query.origin || 4).then(res => {
  const { token, exp } = res.data
  userStore.setToken(token)
  userStore.setExp(exp)
  router.push({ path: '/' })
})
</script>

<style scoped></style>
