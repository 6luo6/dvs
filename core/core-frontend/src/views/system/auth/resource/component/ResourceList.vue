<template>
  <div class="list-box">
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
    <div class="page-list">
      <div class="search-box">
        <el-input v-model="searchKey" :placeholder="'搜索名称'" clearable>
          <template #prefix>
            <el-icon>
              <Icon name="de-search" />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div class="page-box">
        <el-tree
          ref="treeRef"
          :data="dataSource"
          highlight-current
          default-expand-all
          :filter-node-method="filterNode"
        >
            <template #default="{ node,data }">
                <div class="tree-item">
                    <el-icon>
                        <Icon :name="data.children?.length ? 'dv-folder':'dv-dashboard-spine'"></Icon>
                    </el-icon>
                    <div class="_text">{{ node.label }}</div>
                </div>
            </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElTree } from 'element-plus-secondary'
import { ref, watch } from 'vue'
const sysRoleList = [
  {
    name: '仪表板',
    id: '1'
  },
  {
    name: '大数据',
    id: '4'
  }
]
const currentRole = ref('1')
const searchKey = ref('')
interface Tree {
  id: number
  label: string
  children?: Tree[]
}
const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: '仪表板',
    children: [
      {
        id: 4,
        label: '演示',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1'
          },
          {
            id: 10,
            label: 'Level three 1-1-2'
          }
        ]
      }
    ]
  },
 
])

const treeRef = ref<InstanceType<typeof ElTree>>()

watch(searchKey, val => {
  treeRef.value!.filter(val)
})

const changeCurrentRole = role => {
  currentRole.value = role.id
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
</script>
<style lang="less" scoped>
.list-box {
  display: flex;
}

.search-box {
  margin-top: 20px;
  padding: 0 12px;
}

.role-list {
  width: 50%;
  box-sizing: border-box;
  padding: 10px 8px;
  border-right: 1px solid rgba(31, 35, 41, 0.15);
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

.page-list {
  width: 50%;
  box-sizing: border-box;
  padding: 10px 8px;

  .page-box {
    margin-top: 10px;
    padding: 0 12px;
  }
}

.tree-item {
    display: flex;
    align-items: center;

    ._text {
        margin-left: 5px;
    }
}
</style>
