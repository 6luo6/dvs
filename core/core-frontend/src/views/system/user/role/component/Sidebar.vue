<template>
  <div class="sidebar">
    <div class="title">角色列表</div>
    <div class="search-box">
      <el-input v-model="searchKey" :placeholder="'搜索'" clearable @keyup.enter.native="search()">
        <template #prefix>
          <el-icon>
            <Icon name="de-search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="role-list">
      <div class="sys-role">
        <div class="_title">系统内置角色</div>
        <div class="_list">
          <div
            class="__item"
            :class="currentRole == sysItem.id ? '__item-active' : ''"
            v-for="sysItem in sysRoleList"
            :key="sysItem.id"
            @click="changeCurrentRole(sysItem)"
          >
            <div class="role-name">{{ sysItem.name }}</div>
            <div class="tag">系统</div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="custom-role">
        <div class="_title">
          <div style="flex: 1">自定义角色</div>
          <el-link :underline="false" style="font-size: 16px" @click="addRole">
            <el-icon color="#92969e"><Plus /></el-icon>
          </el-link>
        </div>
        <div class="_list">
          <div
            class="__item"
            :class="currentRole == cusItem.id ? '__item-active' : ''"
            v-for="cusItem in customRoleList"
            :key="cusItem.id"
            @click="changeCurrentRole(cusItem)"
          >
            <div class="role-name">{{ cusItem.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <add-role-dialog ref="addRoleDialog" ></add-role-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted } from 'vue'
import AddRoleDialog from './AddRole.vue'
import {searchRoleApi,} from '@/api/user'

const emits = defineEmits(['changeRole'])

const currentRole = ref('2')
const addRoleDialog = ref(null)
const sysRoleList =ref([])
const customRoleList = ref([])
const searchKey = ref('')
const changeCurrentRole = role => {
  currentRole.value = role.id
  emits('changeRole', role)
}

const addRole = () => {
  unref(addRoleDialog).changeShow(true,sysRoleList.value)
}

onMounted(() => {
  searchRoleApi('').then(res=>{
    console.log(res,'角色查询');
    customRoleList.value = res.data.filter(item=> item.root !== true)
    sysRoleList.value = res.data.filter(item=> item.root === true)
    emits('changeRole', sysRoleList.value[0])
  })
})

const search=()=>{
  searchRoleApi(searchKey.value).then(res=>{
    console.log(res,'角色搜索');
    customRoleList.value = res.data.filter(item=> item.root !== true)
    sysRoleList.value = res.data.filter(item=> item.root === true)
  })
}
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid rgba(31, 35, 41, 0.15);

  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 20px;
  }

  .search-box {
    padding: 0 20px;
  }

  .role-list {
    margin-top: 10px;
    padding: 10px 8px;
    .sys-role {
      ._title {
        font-size: 16px;
        color: #92969e;
        font-weight: bold;
        padding: 10px 12px;
      }

      ._list {
        .__item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          cursor: pointer;
          border-radius: 4px;

          &:hover {
            color: #3370ff;
          }

          .tag {
            margin-left: 12px;
            font-size: 12px;
            color: #3977fe;
            background-color: #c2d4ff;
            padding: 0 5px;
            font-weight: bold;
          }
        }

        .__item-active {
          background-color: #ebf1ff;
          font-weight: bold;
          color: #3370ff;
        }
      }
    }

    .custom-role {
      ._title {
        font-size: 16px;
        color: #92969e;
        font-weight: bold;
        padding: 10px 12px;
        display: flex;
        align-items: center;
      }

      ._list {
        .__item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          cursor: pointer;
          border-radius: 4px;

          &:hover {
            color: #3370ff;
          }

          .tag {
            margin-left: 12px;
            font-size: 12px;
            color: #3977fe;
            background-color: #c2d4ff;
            padding: 0 5px;
            font-weight: bold;
          }
        }

        .__item-active {
          background-color: #ebf1ff;
          font-weight: bold;
          color: #3370ff;
        }
      }
    }

    .divider {
      margin: 10px;
      height: 1px;
      background-color: #c6cacd;
    }
  }
}
</style>
