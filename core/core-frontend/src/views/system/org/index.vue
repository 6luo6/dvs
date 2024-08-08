<template>
  <p class="router-title">组织管理</p>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="item in tabArray" :key="item.name" :label="item.label" :name="item.name" />
  </el-tabs>
  <div class="sys-setting-p setting-auto-h">
    <div class="container-sys-param">
      <group v-if="activeName === 'group'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Group from './group/index.vue'

const tabArray = [
  { label: '组织管理', name: 'group' },
]
const activeName = ref('group')
</script>
<style lang="less">
.router-title {
  color: #1f2329;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: '阿里巴巴普惠体 3.0 55 Regular L3';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
}
.sys-setting-p {
  width: 100%;
  height: calc(100vh - 176px);
  box-sizing: border-box;
  margin-top: 12px;
}
.setting-auto-h {
  height: auto !important;
}

.container-sys-param {
  height: 100%;
  overflow: hidden;
  background: var(--ContentBG, #ffffff);
  border-radius: 4px;
}
</style>
<style lang="less" scoped></style>
