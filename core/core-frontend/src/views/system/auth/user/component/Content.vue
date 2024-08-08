<template>
  <div class="content">
    <div class="flex header">
      <el-tabs class="title">
        <el-tab-pane label="资源权限" />
      </el-tabs>
      <el-button type="primary" disabled>保存</el-button>
    </div>
    <div class="main">
      <el-container style="height: 100%">
        <el-aside width="18%">
          <sub-sidebar></sub-sidebar>
        </el-aside>
        <el-main>
          <sub-content></sub-content>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SubSidebar from './SubSidebar.vue'
import SubContent from './SubContent.vue'
</script>

<style lang="less" scoped>
.content {
  height: 100%;

  .header {
    padding: 0 30px;
    border-bottom: 1px solid rgba(31, 35, 41, 0.15);

    .title {
      flex: 1;
    }
  }

  .main {
    height: calc(100% - 46px);
  }
}

.flex {
  display: flex;
  align-items: center;
}

.role-name {
  font-size: 18px;
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
