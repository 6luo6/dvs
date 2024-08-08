<template>
  <el-dialog v-model="visible" :title="'添加角色'" :width="'30%'">
    <div class="content">
      <el-form :model="formData" label-position="top" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="角色名称" required prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-radio-group v-model="formData.roleType" @change="onchange">
            <el-radio v-for="role in roleList" :key="role.id" :label="role.id" size="large">{{ role.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirmMethod(ruleFormRef)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { roleCreateApi, } from '@/api/user'
import { ElMessage, } from 'element-plus-secondary'
interface FormData {
  name: string
  roleType: string
}

const ruleFormRef = ref();
const visible = ref<boolean>(false)
const formData = ref<FormData>({
  name: '',
  roleType: '2'
})
const roleList = ref([])
const formRules = reactive<any>({
  name: [{
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  }],
})

const changeShow = (show: boolean, role) => {
  if (show == visible.value) return
  roleList.value = role
  visible.value = show
}

const confirmMethod = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      roleCreateApi({
        name: formData.value.name,
        typeCode: formData.value.roleType
      }).then(res => {
        console.log(res, '创建自定义角色');
        if (true) {
          ElMessage({
            type: 'success',
            message: '创建成功'
          })
        }
        visible.value = false
      })

    } else {
      console.log('error submit!')
      return false
    }
  })
}

const onchange = (val) => {
  console.log(val)
}

defineExpose({ changeShow })
</script>
<style lang="less" scoped>
.content {
  height: 40vh;
}
</style>
