<template>
  <el-dialog
    v-model="visible"
    :title="`添加${type == 'group' ? '组织用户' : '外部用户'}`"
    :width="width"
  >
    <div :style="{ height: type == 'group' ? '60vh' : '30vh' }">
      <div class="group-box" v-if="type == 'group'">
        <div class="__left">
          <el-input v-model="searchKey" clearable>
            <template #prefix>
              <el-icon>
                <Icon name="de-search" />
              </el-icon>
            </template>
          </el-input>
          <div class="user-list">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >全部</el-checkbox
            >
            <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
              <div class="user-item" v-for="groupUser in userList" :key="groupUser.id">
                <el-checkbox :label="groupUser.id" :value="groupUser.id">
                  {{ groupUser.name }}<span class="sub-label">({{ groupUser.account||"--" }})</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
            <!-- <div v-for="groupUser in userList" :key="groupUser.id">
              <el-checkbox v-model="groupUser.checked" :label="groupUser.name" />
            </div> -->
          </div>
        </div>
        <div class="__right">
          <div class="header">
            <div class="title">已选：{{ checkedUsers.length }} 个用户</div>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 16px"
              @click="clearCheckedUsers"
              >清空</el-link
            >
          </div>
          <div class="user-list">
            <div
              class="user-item"
              v-for="checkedGroupUser in checkedUserList"
              :key="checkedGroupUser.id"
            >
              <div class="label">
                {{ checkedGroupUser.name
                }}<span class="sub-label">({{ checkedGroupUser.account || '--'}})</span>
              </div>
              <el-link
                :underline="false"
                style="font-size: 16px"
                @click="removeCheckedUser(checkedGroupUser)"
              >
                <el-icon><CloseBold /></el-icon>
              </el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="other-box" v-if="type == 'other'">
        <div>
          <el-input v-model="searchKey2" placeholder="请输入用户账号" clearable size="large">
            <template #append>
              <el-button @click="searchBt">查找用户</el-button>
            </template>
          </el-input>
        </div>
        <div class="user-info">
          <div class="label">
            test1
            <span class="sub-label">(test1)</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="conformsAdd"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, toRefs, onMounted, } from 'vue'
import { ElMessage } from 'element-plus-secondary'
// import {queryUserApi} from '@/api/auth'
import {mountUserApi,searchExternalUserApi,mountExternalUserApi,userOptionForRoleApi} from "@/api/user"

const props = defineProps({
  type: {
    type: String,
    default: 'group'
  },
  width: {
    type: String,
    default: '60%'
  },
  role: {
    type: Object,
    default: () => ({})
  }
})

const { type } = toRefs(props)

const emits = defineEmits(['getRoles'])
const visible = ref<boolean>(false)
const searchKey = ref<string>('')
const searchKey2 = ref<string>('') //后续改为查询外部用户接口返回用户
interface FormData {
  account: string
  name: string
  email: string
  phone: string
  role: []
  isUse: boolean
}

interface User {
  name: string
  account: string
  id: string
}

const userList = ref<User[]>([
  // {
  //   name: 'docs_demo',
  //   account: 'docs_demo',
  //   id: '1'
  // },
  // {
  //   name: 'test1',
  //   account: 'test1',
  //   id: '2'
  // },
  // {
  //   name: 'test2',
  //   account: 'test2',
  //   id: '3'
  // },
  // {
  //   name: 'test3',
  //   account: 'test3',
  //   id: '4'
  // },
  // {
  //   name: 'test4',
  //   account: 'test4',
  //   id: '5'
  // },
  // {
  //   name: 'test5',
  //   account: 'test5',
  //   id: '6'
  // },
  // {
  //   name: 'test6',
  //   account: 'test6',
  //   id: '7'
  // },
  // {
  //   name: 'test7',
  //   account: 'test7',
  //   id: '8'
  // },
  // {
  //   name: 'test8',
  //   account: 'test8',
  //   id: '9'
  // },
  // {
  //   name: 'test9',
  //   account: 'test9',
  //   id: '10'
  // }
])
const checkedUsers = ref<string[]>([])
const checkedUserList = computed(() => {
  const results = []
  userList.value.forEach(val => {
    if (checkedUsers.value.includes(val.id)) {
      results.push(val)
    }
  })
  return results
})
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
onMounted(()=>{
 
  
})

const getCurrentUsers = (keyword?: string) =>{
  userOptionForRoleApi({keyword: keyword,rid:props.role.id,order:1}).then((res)=>{
    userList.value = res.data
    console.log(res,'查询当前组织内用户');
  })
}

const getOutUsers = (keyword:string)=>{
  searchExternalUserApi(keyword).then((res)=>{
    console.log(res,'查询组织外用户');
    
  }
)
}

const changeShow = (show: boolean,type) => {
  if (show == visible.value) return
  if(type=='group'){
    clearCheckedUsers()
    getCurrentUsers()
  }else{
    console.log('other-----');
  }
  visible.value = show
}

const searchBt =()=>{
  if(searchKey2.value){
    getOutUsers(searchKey2.value)
  }else{
    ElMessage({
      type: 'warning',
      message: '填写用户的 ID 或账号搜索'
    })
  }
}

const handleCheckedUsersChange = (data: string[]) => {
  const checkedCount = data.length
  checkAll.value = checkedCount === userList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < userList.value.length
}

const handleCheckAllChange = (val: boolean) => {
  const allUser = userList.value.map(item => item.id)
  checkedUsers.value = val ? allUser : []
  isIndeterminate.value = false
}

const clearCheckedUsers = () => {
  checkedUsers.value = []
  checkAll.value = false
  isIndeterminate.value = false
}

const removeCheckedUser = (item: User) => {
  const index = checkedUsers.value.findIndex(value => value == item.id)
  checkedUsers.value.splice(index, 1)
  const checkedCount = checkedUsers.value.length
  checkAll.value = checkedCount === userList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < userList.value.length
}

const conformsAdd = ()=>{
  if(props.role.id&&checkedUserList.value.length){
    let results=[];
    checkedUserList.value.map(e=>{
      results.push(e.id)
    })
    mountUserApi({
    rid:props.role.id,
    uids:results
  }).then(res=>{
    console.log(res,'角色绑定用户');
    if(true){
      ElMessage({
      type: 'success',
      message: '添加成功'
    })
    visible.value = false;
    emits('getRoles',props.role.id)
    }
  })
  }else if(type.value == 'other'&&searchKey2.value){ //添加组织外用户
    mountExternalUserApi({
      rid:props.role.id,
      uid:''
    })
    
  }else{
    ElMessage({
      type: 'error',
      message: '请选择需要添加的用户'
    })
    
  }
  
}

const cancelAdd = ()=>{
  visible.value = false;
}
defineExpose({ changeShow })
</script>

<style lang="less" scoped>
.content {
  height: 60vh;

  .group-box {
    display: flex;
    height: 100%;
    border: 1px solid #d7dce8;

    .__left {
      box-sizing: border-box;
      width: 50%;
      padding: 30px;
      border-right: 1px solid #d7dce8;
      height: 100%;

      .user-list {
        margin-top: 12px;
        height: calc(100% - 30px);
        overflow-y: auto;

        .user-item {
          margin-top: 10px;

          .sub-label {
            color: #a4a6ad;
          }
        }
      }
    }

    .__right {
      box-sizing: border-box;
      width: 50%;
      padding: 30px;
      height: 100%;

      .header {
        display: flex;
        align-items: center;
        font-size: 16px;

        .title {
          flex: 1;
        }
      }

      .user-list {
        margin-top: 12px;
        height: calc(100% - 30px);
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 0;
        }
        /* 隐藏水平滚动条 */
        &::-webkit-scrollbar {
          height: 0;
        }
        /* 隐藏滚动条的轨道 */
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0);
        }
        /* 隐藏滚动条的滑块 */
        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0);
        }

        .user-item {
          margin-top: 18px;
          display: flex;
          align-items: center;
          font-size: 16px;

          .label {
            flex: 1;

            .sub-label {
              color: #a4a6ad;
            }
          }
        }
      }
    }
  }

  .other-box {
    .user-info {
      padding: 0 10px;
      margin-top: 18px;
      display: flex;
      align-items: center;

      .label {
        flex: 1;
        font-size: 18px;

        .sub-label {
          color: #a4a6ad;
          font-size: 16px;
        }
      }
    }
  }
}

.tooltip {
  display: flex;
  align-items: center;
  background-color: #e1eaff;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 18px;
}

::v-deep {
  .ed-input-group__append {
    background-color: transparent;
  }
}
</style>
