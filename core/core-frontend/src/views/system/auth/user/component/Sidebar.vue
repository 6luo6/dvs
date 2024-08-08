<template>
  <div class="sidebar">
    <el-tabs v-model="activeName" class="title">
      <el-tab-pane
        v-for="item in tabArray"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>

    <div class="search-box">
      <el-input v-model="searchKey" :placeholder="'搜索'" clearable>
        <template #prefix>
          <el-icon>
            <Icon name="de-search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <div class="role-list">
      <div class="sys-role">
        <div class="_list">
          <div
            class="__item"
            :class="currentRole == sysItem.id ? '__item-active' : ''"
            v-for="sysItem in sysRoleList"
            :key="sysItem.id"
            @click="changeCurrentRole(sysItem)"
          >
            <div class="role-name">{{ sysItem.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted } from 'vue'

const emits = defineEmits(['changeRole'])

const tabArray = [
  { label: '用户', name: 'user' },
  { label: '角色', name: 'role' }
]
const activeName = ref('user')
const currentRole = ref('1')
const sysRoleList = [
  {
    name: '管理员',
    id: '1'
  },
  {
    name: '普通用户',
    id: '4'
  }
]
const customRoleList = ref([
  {
    name: '部门管理员',
    id: '5'
  },
  {
    name: '业务经理',
    id: '6'
  }
])
const searchKey = ref('')
const changeCurrentRole = role => {
  currentRole.value = role.id
  emits('changeRole', role)
}

const addRole = () => {
  unref(addRoleDialog).changeShow(true)
}

onMounted(() => {
  emits('changeRole', sysRoleList[0])
})
</script>

<style lang="less" scoped>
.sidebar {
  height: 100%;
  box-sizing: border-box;
  border-right: 1px solid rgba(31, 35, 41, 0.15);

  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 0 20px;
    border-bottom: 1px solid rgba(31,35,41,.15);
  }

  .search-box {
    margin-top: 20px;
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
        padding: 0 12px;

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
