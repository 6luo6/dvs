<template>
  <div class="content">
    <div class="flex header">
      <el-tabs v-model="activeName" class="title">
        <el-tab-pane v-for="item in tabArr" :key="item.name" :label="item.label" :name="item.name" />
      </el-tabs>
      <el-button type="primary" disabled>保存</el-button>
    </div>
    <div class="main">
      <sub-content :currentPermission="currentPermission" v-bind="$attrs"></sub-content>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, computed, useAttrs } from 'vue';
import SubContent from './SubContent.vue'

const props = defineProps({
  currentPermission: {
    type: String,
    default: 'resource'
  }
})
const { currentPermission } = toRefs(props)
const attrs = useAttrs()
const activeName = ref("user")
const tabArr = computed(() => {
  if (currentPermission.value == 'resource') {
    activeName.value = 'user'
    return [{
      name: "user",
      label: "用户"
    },
    {
      name: "role",
      label: "角色"
    }]
  } else {
    activeName.value = 'role'
    return [{
      name: "role",
      label: "角色"
    }]
  }
})

console.log(attrs,'父组件');

const test = () => {
  console.log('aaaaaaaaaaaaaa',attrs)
}

defineExpose({ test })
// const tabArray = ref([
//   {
//     name: "user",
//     label: "用户"
//   },
//   {
//     name: "role",
//     label: "角色"
//   }
// ])



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
