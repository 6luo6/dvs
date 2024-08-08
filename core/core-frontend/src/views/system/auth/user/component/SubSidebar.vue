<template>
  <div class="content">
    <div class="role-list">
      <div class="sys-role">
        <div class="_list">
          <div
            class="__item"
            :class="currentResource == sysItem.id ? '__item-active' : ''"
            v-for="sysItem in resourceList"
            :key="sysItem.id"
            @click="changeCurrentResource(sysItem)"
          >
            <div class="role-name">{{ sysItem.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"

const currentResource = ref('1')
const resourceList = [
  {
    name: '仪表盘',
    id: '1'
  },
  {
    name: '数据大屏',
    id: '2'
  },
  {
    name: '数据集',
    id: '3'
  },
  {
    name: '数据源',
    id: '4'
  }
]

const changeCurrentResource = resource => {
  currentResource.value = resource.id
}
</script>
<style lang="less" scoped>
.content {
  height: 100%;
  border-right: 1px solid rgba(31, 35, 41, 0.15);

  .role-list {
    padding: 20px 8px;
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
  }
}
</style>
