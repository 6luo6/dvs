<template>
  <el-dialog v-model="visible" :title="`${type == 'add' ? '添加' : '编辑'}用户`" width="60%">
    <div class="tooltip" v-if="type == 'add'">
      <el-icon color="#3370ff">
        <InfoFilled />
      </el-icon>
      <div style="margin-left: 10px">默认密码：{{ defaultPwd }}</div>
      <el-link style="margin-left: 15px" type="primary" @click="copy">复制</el-link>
    </div>
    <el-form :rules="formRules" :model="formData" label-position="top" ref="ruleFormRef">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="账号" required prop="account">
            <el-input v-model="formData.account" placeholder="请输入账号" :disabled="type == 'edit' ? true : false"
              autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" required prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" required prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码">
            <el-input v-model="formData.phone" placeholder="请输入手机号码" autocomplete="off">
              <template #prepend>+86</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色" required prop="roleIds">
            <el-select v-model="formData.roleIds" multiple placeholder="请选择角色" style="width: 100%;">
              <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用">
            <el-switch v-model="formData.enable" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="Zones">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirmMethod(ruleFormRef, type)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
import { ElMessage } from 'element-plus-secondary'
import { defaultPwdApi, roleOptionForUserApi, userCreateApi, userEditApi } from '@/api/user'
const props = defineProps({
  type: {
    type: String,
    default: "add"
  }
})

const { type } = toRefs(props)
const defaultPwd = ref('') //默认密码
const ruleFormRef = ref()
const emits = defineEmits(['changeShow', 'getUser'])
const visible = ref<boolean>(false)
const userId = ref();
onMounted(() => {
  //获取默认密码
  defaultPwdApi().then(res => {
    defaultPwd.value = res.data
  })
  //获取用户可选角色
  roleOptionForUserApi({}).then((res) => {
    roleList = res.data
  })
})

interface FormData {
  account: string
  name: string
  email: string
  phone: string
  roleIds: any[]
  enable: boolean
}

interface Role {
  name: string,
  id: string
}

const formData = ref<FormData>({
  account: '',
  name: '',
  email: '',
  phone: '',
  roleIds: [],
  enable: true
})

let roleList = reactive<Role[]>([])
//父组件调编辑功能，传参
const changeShow = (show, data) => {
  if (show == visible.value) return
  if (Reflect.has(data, 'roleItems')) {
    formData.value.roleIds = data.roleItems.map(e => String(e.id))
  }
  let obj = {
    account: '',
    name: '',
    email: '',
    phone: '',
    roleIds: [],
    enable: true
  }
  if (data.account) {
    userId.value = data.id
    obj = {
      ...formData.value,
      ...data
    }
  }

  // formData.account = data.account
  // formData.value = Object.assign(formData.value,data)
  formData.value = obj
  visible.value = show
}

const copy = async () => {
  try {
    await toClipboard(defaultPwd.value)
    ElMessage({
      message: '复制成功！',
      type: 'success'
    })
  } catch (e) {
    ElMessage.error('复制失败！')
    console.log(e)
  }
}


const confirmMethod = (formEl, type) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (type === 'add') {
        userCreateApi({
          name: formData.value.name,
          account: formData.value.account,
          email: formData.value.email,
          phone: formData.value.phone,
          roleIds: formData.value.roleIds,
          enable: formData.value.enable,
        }).then(res => {
          console.log('新增用户---', res);
          if (true) {
            emits("getUser");
            ElMessage({
              message: '新增成功！',
              type: 'success'
            })
          }
        })
      } else {
        userEditApi({
          name: formData.value.name,
          account: formData.value.account,
          email: formData.value.email,
          phone: formData.value.phone,
          roleIds: formData.value.roleIds,
          enable: formData.value.enable,
          id: userId.value
        }).then(res => {
          console.log('编辑用户---', res);
          if (true) {
            emits("getUser");
            ElMessage({
              message: '编辑成功！',
              type: 'success'
            })
          }
        })
      }

      visible.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })

}
let IsEmail = (str) => {
  var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return reg.test(str);
}
let checkTelephone = (telephone) => {
  var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!reg.test(telephone)) {
    return false;
  } else {
    return true;
  }
}
const checkEmail = (rule: any, value: any, callback: any) => {
  if (IsEmail(value)) {
    return callback()
  }
  return callback(new Error('请填写正确邮箱'))
}
const checkPhone = (rule: any, value: any, callback: any) => {
  if (checkTelephone(value)) {
    return callback()
  }
  return callback(new Error('请填写正确手机号'))
}
const formRules = reactive<any>({
  account: [{
    required: true,
    message: '请输入账号',
    trigger: 'blur'
  }],
  name: [{
    required: true,
    message: '请输入姓名',
    trigger: 'blur'
  }],
  email: [{
    required: true,
    message: '请输入邮箱',
    trigger: 'blur'
  },
  { validator: checkEmail, trigger: 'blur' }],
  phone: [{
    required: true,
    message: '请输入手机号',
    trigger: 'blur'
  }, { validator: checkPhone, trigger: 'blur' }],
  roleIds: [{
    required: true,
    message: '请选择角色',
    trigger: 'blur'
  }],
})
defineExpose({ changeShow })
</script>

<style lang="less" scoped>
.tooltip {
  display: flex;
  align-items: center;
  background-color: #e1eaff;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 18px;
}
</style>
