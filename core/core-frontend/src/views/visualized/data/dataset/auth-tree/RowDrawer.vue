<template>
  <el-drawer v-model="drawer" title="添加行权限" direction="rtl" size="800px">
    <div class="row_drawer">
      <div class="group_title">
        <div class="label">行权限规则</div>
        <div>
          <el-switch v-model="formData.enable" active-text="启用行权限"></el-switch>
        </div>
      </div>
      <div>
        <div style="margin: 6px 0; font-size: 14px">类型</div>
        <div>
          <el-radio-group v-model="formData.authTargetType">
            <el-radio label="role">角色</el-radio>
            <el-radio label="user">用户</el-radio>
            <el-radio label="dept">系统变量</el-radio>
            <el-radio label="bpass_interface">数飞平台</el-radio>
          </el-radio-group>
          <el-select
            v-if="['role', 'user'].includes(formData.authTargetType)"
            v-model="formData.authTargetId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div style="margin: 6px 0; font-size: 14px">设置规则</div>
      <RowAuth @save="changeFilter" ref="RowAuthRef"></RowAuth>
      <div class="group_title" style="margin: 10px 0">
        <div class="label">
          白名单<span style="margin-left: 10px; font-size: 12px; color: gray; align-self: flex-end"
            >以上权限规则对白名单不生效</span
          >
        </div>
      </div>
      <el-select
        v-if="['role', 'dept', 'bpass_interface'].includes(formData.authTargetType)"
        multiple
        v-model="formData.whiteListUser"
        placeholder="请选择"
        style="width: 100%"
      >
        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, provide } from 'vue'
import { ElMessage } from 'element-plus-secondary'
import RowAuth from './RowAuth.vue'
import { searchRoleApi, orgOption } from '@/api/user'
import { rowPermissionTargetObjList, saveRowPermission } from '@/api/dataset'
import { queryUserApi, queryRoleApi } from '@/api/auth'
const drawer = ref(false)
const formData = reactive({
  enable: false,
  authTargetType: 'bpass_interface',
  authTargetId: '',
  whiteListUser: []
})
const emit = defineEmits(['saveSuccess'])
const roleList = ref([])
const userList = ref([])
const RowAuthRef = ref()
const datasetInfo = ref()
let detailInfo
function init() {
  queryUserApi({ keyword: '' }).then(res => {
    userList.value = res.data
  })
  queryRoleApi({ keyword: '' }).then(res => {
    roleList.value = res.data
  })
  // orgOption()
  // rowPermissionTargetObjList(datasetId.value, 'user').then()
}

function show(info, tree = { logic: 'or', items: null }, obj = {}) {
  datasetInfo.value = info
  detailInfo = obj
  if (Object.keys(obj).length) {
    formData.enable = obj.enable
    formData.authTargetType = obj.authTargetType
    formData.authTargetId = obj.authTargetId
  }
  drawer.value = true
  init()
  nextTick(() => {
    RowAuthRef.value.init(tree)
  })
}
const submit = () => {
  RowAuthRef.value.submit()
}
const changeFilter = val => {
  const { logic, items, errorMessage } = val
  if (errorMessage) {
    ElMessage.error({
      message: errorMessage,
      type: 'error',
      showClose: true
    })
    return
  }
  // dfsTreeDelete(items)
  let tree = { logic, items }
  saveRowPermission({
    datasetId: datasetInfo.value.id,
    ...formData,
    id: detailInfo.id,
    whiteListUser: JSON.stringify(formData.whiteListUser),
    expressionTree: JSON.stringify(tree),
    tree
  }).then(res => {
    ElMessage.success('保存成功')
    drawer.value = false
    emit('saveSuccess')
  })
}

const dfsTreeDelete = arr => {
  arr.forEach(ele => {
    if (ele?.subTree?.items?.length) {
      dfsTreeDelete(ele.subTree.items || [])
    } else {
      if (ele.field) {
        delete ele.field
      }
    }
  })
}

defineExpose({ show })
</script>

<style lang="less" scoped>
.row_drawer {
  .group_title {
    display: flex;
    justify-content: space-between;
    :deep(.label) {
      display: flex;
      align-items: center;

      &::before {
        display: inline-block;
        content: '';
        width: 2px;
        height: 18px;
        background-color: #03a9f4;
        margin-right: 5px;
      }
    }
  }
}
</style>
