<template>
  <el-dialog v-model="visible" :title="`${type == 'add' ? '添加' : '编辑'}组织`" width="40%">
    <el-form :model="formData" label-position="top" :rules="rules" ref="addOrgForm">
      <el-form-item label="组织名称" required prop="name">
        <el-input v-model="formData.name" placeholder="请输入组织名称" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="type == 'add'" label="上级组织">
        <el-tree-select v-model="formData.parentGroupId" :disabled="disabled" :data="groupList" :render-after-expand="false" check-strictly
          placeholder="请选择上级组织(默认根组织)" style="width: 100%;"  :props="{label:'name',value:'id'}">
          <!-- <template
            #default="{ node, data }">
            {{ data.name || '--' }}
          </template> -->
        </el-tree-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd(addOrgForm)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, toRefs, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus-secondary'
import { saveApi, updateApi, } from "@/api/org"

const props = defineProps({
  type: {
    type: String,
    default: 'add'
  },
})

const groupList = ref([])
const addOrgForm = ref()
const disabled = ref<boolean>(false)
const { type } = toRefs(props)
const rules = reactive({
  name: [
    { required: true, message: '请填写组织名称', trigger: 'blur' },
  ],
})
onMounted(() => {
  // console.log(props.orgList,33332222);
  // groupList.value = props.orgList
})
const emits = defineEmits(['changeShow', 'getOrgList'])
const visible = ref<boolean>(false)

interface FormData {
  name: string
  parentGroupId: string
}
const formData = ref<FormData>({
  name: '',
  parentGroupId: ''
})

const changeShow = (show, data, orgList) => {
  if (show == visible.value) return
  console.log(data, orgList, '33333');
  disabled.value = false
  if (data.type == 'add' && data.id) {
    formData.value.name = ''
    formData.value.parentGroupId = data.id
    disabled.value = true
  } else if (data.type == 'edit') {
    formData.value.name = data.name
    formData.value.parentGroupId = data.id
  } else {
    formData.value.name = ''
    formData.value.parentGroupId = ''
    
  }
  groupList.value = orgList
  visible.value = show
}
const confirmAdd = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (type.value == 'add') {
        saveApi({
          name: formData.value.name,
          pid: formData.value.parentGroupId || 0
        }).then(() => {
          if (true) {
            emits('getOrgList')
            ElMessage({
              type: 'success',
              message: '新增成功'
            })
          }
        })

      } else if (type.value == 'edit') {
        console.log('editeditedit', formData.value.parentGroupId, formData.value.name);
        updateApi({
          id: formData.value.parentGroupId,
          name: formData.value.name
        }).then(() => {
          if (true) {
            emits('getOrgList')
            ElMessage({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      }


      visible.value = false;
    } else {
      console.log('error submit!')
      return false
    }
  })

}
defineExpose({ changeShow })
</script>
<style lang="less" scoped></style>
