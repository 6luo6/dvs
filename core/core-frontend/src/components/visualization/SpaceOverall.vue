<template>
  <div style="width: 100%" ref="bgForm">
    <el-form label-position="top" style="width: 100%">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="水平间距" class="form-item w100" :class="'form-item-' + themes">
            <el-input-number
              style="width: 100%"
              :effect="themes"
              controls-position="right"
              size="middle"
              :min="0"
              :max="100"
              v-model="state.mulItem.columnGap"
              @change="onMulItemChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="垂直间距" class="form-item w100" :class="'form-item-' + themes">
            <el-input-number
              style="width: 100%"
              :effect="themes"
              controls-position="right"
              size="middle"
              :min="0"
              :max="100"
              v-model="state.mulItem.rowGap"
              @change="onMulItemChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列数" class="form-item w100" :class="'form-item-' + themes">
            <el-input-number
              style="width: 100%"
              :effect="themes"
              controls-position="right"
              size="middle"
              :min="0"
              :max="100"
              v-model="state.mulItem.columnCount"
              @change="onMulItemChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_MUL_ITEM } from '@/views/chart/components/editor/util/chart'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { snapshotStoreWithOut } from '@/store/modules/data-visualization/snapshot'
import elementResizeDetectorMaker from 'element-resize-detector'
import { ElMessage } from 'element-plus-secondary'
import { cloneDeep, merge } from 'lodash-es'

const snapshotStore = snapshotStoreWithOut()
const emits = defineEmits(['onMulItemChange'])

const props = defineProps({
  chart: {
    type: Object,
    required: true
  },
  themes: {
    type: String as PropType<EditorTheme>,
    default: 'dark'
  },
  propertyInner: {
    type: Array<string>
  }
})

const state = reactive({
  mulItem: cloneDeep(DEFAULT_MUL_ITEM)
})

const init = () => {
  merge(state.mulItem, props.chart?.customAttr?.mulItem)
}

onMounted(() => {
  init()
})

const onMulItemChange = () => {
  emits('onMulItemChange', state.mulItem)
}

watch(
  () => props.chart?.customAttr?.mulItem,
  () => {
    init()
  },
  { deep: true }
)
</script>

<style scoped lang="less">
:deep(.ed-form-item) {
  display: block;
  margin-bottom: 16px;
}
.avatar-uploader-container {
  margin-bottom: 16px;
  :deep(.ed-upload--picture-card) {
    background: #eff0f1;
    border: 1px dashed #dee0e3;
    border-radius: 4px;

    .ed-icon {
      color: #1f2329;
    }

    &:hover {
      .ed-icon {
        color: #3370ff;
      }
    }
  }

  &.img-area_dark {
    :deep(.ed-upload-list__item).is-ready {
      border-color: #434343;
    }
    :deep(.ed-upload--picture-card) {
      background: #373737;
      border-color: #434343;
      .ed-icon {
        color: #ebebeb;
      }
    }
  }

  &.img-area_light {
    :deep(.ed-upload-list__item).is-ready {
      border-color: #dee0e3;
    }
  }
}
.avatar-uploader {
  width: 90px;
  height: 80px;
  overflow: hidden;
}
.avatar-uploader {
  width: 90px;
  :deep(.ed-upload) {
    width: 80px;
    height: 80px;
    line-height: 90px;
  }

  :deep(.ed-upload-list li) {
    width: 80px !important;
    height: 80px !important;
  }

  :deep(.ed-upload--picture-card) {
    background: #eff0f1;
    border: 1px dashed #dee0e3;
    border-radius: 4px;

    .ed-icon {
      color: #1f2329;
    }

    &:hover {
      .ed-icon {
        color: #3370ff;
      }
    }
  }
}

.shape-item {
  padding: 6px;
  border: none;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ed-select-dropdown__item {
  height: 100px !important;
  text-align: center;
  padding: 0px 5px;
}

.ed-select-dropdown__item.selected::after {
  display: none;
}

.indented-container {
  margin-top: 8px;
  width: 100%;
  padding-left: 22px;

  .indented-item {
    width: 100%;
    display: flex;

    .fill {
      flex: 1;
    }

    &.disabled {
      cursor: not-allowed;
      color: #8f959e;

      :deep(.avatar-uploader) {
        width: 90px;
        pointer-events: none;
      }

      :deep(.ed-upload--picture-card) {
        cursor: not-allowed;
      }

      .img-area_dark {
        :deep(.ed-upload--picture-card) {
          .ed-icon {
            color: #5f5f5f;
          }
        }
      }
      .img-area_light {
        :deep(.ed-upload--picture-card) {
          .ed-icon {
            color: #bbbfc4;
          }
        }
      }

      &:hover {
        .ed-icon {
          color: #8f959e;
        }
      }
    }
  }
}
.form-item {
  &.margin-bottom-8 {
    margin-bottom: 8px !important;
  }
  &.no-margin-bottom {
    margin-bottom: 0 !important;
  }
}

.re-update-span {
  cursor: pointer;
  color: #3370ff;
  size: 14px;
  line-height: 22px;
  font-weight: 400;
}

.image-hint {
  color: #8f959e;
  size: 14px;
  line-height: 22px;
  font-weight: 400;
  margin-top: 2px;
  &.image-hint_dark {
    color: #757575;
  }
}
</style>

<style lang="less">
.board-select {
  min-width: 50px !important;
  width: 304px;
  .ed-scrollbar__view {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
  }
  .ed-select-dropdown__item.hover {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .ed-select-dropdown__item.selected {
    background-color: rgba(0, 0, 0, 0) !important;
  }
}
</style>
