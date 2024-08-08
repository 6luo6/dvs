<template>
  <el-dialog
    ref="enlargeDialog"
    v-loading="state.loading"
    :append-to-body="true"
    :title="t('visualization.jump_set')"
    v-model="dialogShow"
    width="70vw"
    top="10vh"
    trigger="click"
  >
    <div @keydown.stop @keyup.stop style="height: 550px">
      <el-row>
        <el-row class="preview">
          <el-col :span="24" class="preview-show">
            <el-container class="settings-container">
              <el-header class="settings-header">
                <el-form-item class="radio-group-box">
                  <template #label>
                    <span class="title">{{ t('visualization.link_type') }}</span>
                  </template>
                  <el-radio-group class="larger-radio" v-model="state.linkJumpInfo.linkType">
                    <el-radio label="outer">{{ t('visualization.link_outer') }}</el-radio>
                    <el-radio label="inner">{{ resourceType }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item class="radio-group-box">
                  <template #label>
                    <span class="title">{{ t('visualization.open_model') }}</span>
                  </template>
                  <el-radio-group
                    class="larger-radio"
                    v-if="state.linkJumpInfo"
                    v-model="state.linkJumpInfo.jumpType"
                  >
                    <el-radio label="_self">{{ t('visualization.now_window') }}</el-radio>
                    <el-radio label="_blank">{{ t('visualization.new_window') }}</el-radio>
                    <el-radio label="modal">弹框</el-radio>
                  </el-radio-group>
                  <el-icon
                    v-if="state.linkJumpInfo && state.linkJumpInfo.jumpType == 'modal'"
                    style="margin-left: 10px; cursor: pointer"
                    @click="openModalSetting"
                    ><Setting
                  /></el-icon>
                </el-form-item>
              </el-header>

              <el-main class="settings-main">
                <template v-if="state.linkJumpInfo">
                  <div style="height: 50%">
                    <template v-if="state.linkJumpInfo.linkType === 'inner'">
                      <el-form label-position="top" class="main-form">
                        <div class="m-row">
                          <div style="flex: 1">
                            <el-form-item>
                              <template #label> 当前{{ resourceType }} </template>
                              <el-select style="width: 100%" v-model="dvInfo.name" disabled>
                                <el-option
                                  :key="dvInfo.name"
                                  :label="dvInfo.name"
                                  :value="dvInfo.name"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <div class="icon-center">
                            <Icon style="width: 20px; height: 20px" name="dv-link-target" />
                          </div>
                          <div style="flex: 1">
                            <el-form-item>
                              <template #label> 目标{{ resourceType }} </template>
                              <el-tree-select
                                v-model="state.linkJumpInfo.targetDvId"
                                :data="state.panelList"
                                :props="state.dvSelectProps"
                                :render-after-expand="false"
                                filterable
                                class="dv-selector"
                              >
                                <template #default="{ node, data }">
                                  <div class="label-content-details">
                                    <el-icon
                                      size="18px"
                                      style="display: inline-block"
                                      v-if="data.leaf"
                                    >
                                      <Icon name="dv-dashboard-spine"></Icon>
                                    </el-icon>
                                    <el-icon size="18px" style="display: inline-block" v-else>
                                      <Icon name="dv-folder"></Icon>
                                    </el-icon>
                                    <span
                                      style="margin-left: 8px; font-size: 14px"
                                      :title="node.label"
                                      >{{ node.label }}</span
                                    >
                                  </div>
                                </template>
                              </el-tree-select>
                            </el-form-item>
                          </div>
                        </div>
                      </el-form>
                    </template>

                    <template v-if="outerContentShow">
                      <el-row :gutter="8" class="main-form">
                        <el-col :span="24" style="height: 100%">
                          <div class="url-text">
                            {{ t('visualization.target_url') }}
                          </div>
                          <div class="outer-content-mirror">
                            <jump-set-outer-content-editor
                              ref="outerContentEditor"
                              :link-jump-info="state.linkJumpInfo"
                              :link-jump-info-array="state.linkJumpInfoArray"
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </template>
                  </div>
                  <div style="height: 50%">
                    <el-checkbox-group
                      v-model="state.linkJumpInfo.searchParams">
                      <el-checkbox
                        v-for="item in queryComponent"
                        :key="item.name"
                        :label="item.name"
                        >{{ item.name }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </div>
                </template>
                <div v-else class="empty">
                  <empty-background
                    :description="t('visualization.select_dimension_hint')"
                    img-type="noneWhite"
                  />
                </div>
              </el-main>
            </el-container>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="root-class">
        <el-button size="mini" @click="cancel()">{{ t('common.cancel') }} </el-button>
        <el-button type="primary" size="mini" @click="save()"
          >{{ t('dataset.confirm') }}
        </el-button>
      </el-row>
    </div>
  </el-dialog>
  <ModalSetting
    ref="modalSettingRef"
    @onModalSetting="onModalSetting"
    :modalSetting="state.modalSetting"
  ></ModalSetting>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, computed, watch, PropType } from 'vue'
import { dvMainStoreWithOut } from '@/store/modules/data-visualization/dvMain'
import { fieldType } from '@/utils/attr'
import { storeToRefs } from 'pinia'
import { queryTreeApi } from '@/api/visualization/dataVisualization'
import { ElMessage, ElScrollbar } from 'element-plus-secondary'
import { useI18n } from '@/hooks/web/useI18n'
import { getDatasetDetails, listFieldByDatasetGroup } from '@/api/dataset'
import { BusiTreeRequest } from '@/models/tree/TreeNode'
import JumpSetOuterContentEditor from '@/components/visualization/JumpSetOuterContentEditor.vue'
import { Search } from '@element-plus/icons-vue'
import { snapshotStoreWithOut } from '@/store/modules/data-visualization/snapshot'
import EmptyBackground from '@/components/empty-background/src/EmptyBackground.vue'
import { filterEmptyFolderTree } from '@/utils/canvasUtils'
import ModalSetting from './common/ModalSetting.vue'
const dvMainStore = dvMainStoreWithOut()
const { dvInfo, canvasViewInfo, componentData } = storeToRefs(dvMainStore)

//查询组件列表
const queryComponent = computed(() => {
  return componentData.value
    .filter(item => item.component === 'VQuery')
    .map(x => x.propValue)
    .flat(2)
})

const linkJumpInfoTree = ref(null)
const { t } = useI18n()
const dialogShow = ref(false)
import { canvasSave } from '@/utils/canvasUtils'

const props = defineProps({
  chart: {
    type: Object as PropType<ChartObj>,
    required: true
  }
})
const emit = defineEmits(['onModalSetting'])

const resourceType = computed(() => (dvInfo.value.type === 'dashboard' ? '仪表板' : '数据大屏'))

const state = reactive({
  loading: false,
  curJumpViewInfo: {},
  curDatasetInfo: {},
  tempId: null,
  viewId: null,
  name2Auto: [],
  searchField: '',
  searchFunction: '',
  inputType: 'self',
  fieldName: 'name',
  tableRadio: null,
  keyWordSearch: '',
  columnLabel: t('visualization.belong_to_category'),
  templateList: [],
  importTemplateInfo: {
    snapshot: ''
  },
  sourceViewFields: [],
  dvSelectProps: {
    label: 'name',
    children: 'children',
    value: 'id',
    isLeaf: 'leaf',
    disabled: 'disabled'
  },
  treeProp: {
    id: 'sourceFieldId',
    label: 'sourceFieldName',
    children: 'children'
  },
  linkJump: null,
  linkJumpInfoArray: [],
  linkJumpInfoXArray: [],
  linkJumpCurViewFieldArray: [],
  mapJumpInfoArray: {},
  panelList: [],
  linkJumpInfo: {
    linkType: 'outer',
    jumpType: '_self',
    targetDvId: null,
    content: null,
    publicJumpId: null,
    searchParams: [],
  },
  modalSetting: null
})

const outerContentEditor = ref(null)
const modalSettingRef = ref()

let viewInfo
const dialogInit = element => {
  viewInfo = element
  state.modalSetting = element.value.modalSetting
  if (element.value.linkJumpInfo) {
    state.linkJumpInfo = JSON.parse(JSON.stringify(element.value.linkJumpInfo))
  }
  dialogShow.value = true
  state.loading = true
  const request = { busiFlag: dvInfo.value.type } as BusiTreeRequest
  // 获取可关联的仪表板
  queryTreeApi(request)
    .then(rsp => {
      if (rsp && rsp[0]?.id === '0') {
        state.panelList = rsp[0].children
      } else {
        state.panelList = rsp
      }
      state.panelList = filterEmptyFolderTree(state.panelList)
    })
    .finally(() => {
      state.loading = false
    })
}

const save = () => {
  console.log(state.linkJumpInfo)
  viewInfo.value.linkJumpInfo = state.linkJumpInfo
  state.loading = true
  canvasSave(() => {
    ElMessage.success('保存成功')
    state.loading = false
    cancel()
  })
  //   state.loading = true
  //   updateJumpSet(state.linkJump)
  //     .then(() => {
  //       snapshotStore.recordSnapshotCache()
  //       ElMessage.success('保存成功')
  //       // 刷新跳转信息
  //       queryVisualizationJumpInfo(dvInfo.value.id).then(rsp => {
  //         dvMainStore.setNowPanelJumpInfo(rsp.data)
  //         cancel()
  //       })
  //       state.loading = false
  //     })
  //     .catch(() => {
  //       state.loading = false
  //     })
}

const codeMirrorContentSet = content => {
  nextTick(() => {
    outerContentEditor.value?.editorInit(content)
  })
}

const cancel = () => {
  dialogShow.value = false
}

const outerContentShow = computed(() => {
  return state.linkJumpInfo && state.linkJumpInfo.linkType === 'outer' && dialogShow.value
})

const openModalSetting = () => {
  modalSettingRef.value.show()
}

const onModalSetting = val => {
  viewInfo.value.modalSetting = val
}

watch(
  () => outerContentShow.value,
  newValue => {
    if (newValue) {
      codeMirrorContentSet(state.linkJumpInfo.content)
    }
  }
)


defineExpose({
  dialogInit
})
</script>

<style scoped lang="less">
.root-class {
  margin: 15px 0px 5px;
  justify-content: right;
}

.preview {
  margin-top: 5px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  height: 470px !important;
  overflow: hidden;
  background-size: 100% 100% !important;
}

.preview-show {
  border-left: 1px solid #e6e6e6;
  height: 470px;
  background-size: 100% 100% !important;
}

.top_border {
  border-top: 1px solid #e6e6e6;
}

.slot-class {
  color: white;
}

.bottom {
  margin-top: 10px;
  justify-content: center;
}

.ellip {
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
  text-align: center;
  background-color: #f7f8fa;
  color: #3d4d66;
  font-size: 12px;
  line-height: 24px;
  height: 24px;
  border-radius: 3px;
}

.select-filed {
  margin-right: 8px;
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*不换行*/
  text-overflow: ellipsis; /*超出部分文字以...显示*/
  color: #3d4d66;
  font-size: 12px;
  line-height: 35px;
  height: 35px;
  border-radius: 3px;
}

.custom-position {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  flex-flow: row nowrap;
  color: #9ea6b2;
}

.tree-style {
  padding: 10px 15px;
  height: 100%;
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.auth-span {
  float: left;
  width: 30px;
  margin-left: -8px;
}

.tree-head {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #3d4d66;
  .head-text {
    margin-left: 16px;
    font-weight: 500;
    font-size: 14px;
    color: #1f2329;
  }
  .head-filter {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: end;
    margin-right: 16px;
    font-weight: 400;
    font-size: 12px;
    color: #646a73;
    .ed-switch {
      margin-left: 8px;
    }
  }
}

.padding-lr {
  padding: 0 4px;
}

.field-height {
  height: calc(100% - 25px);
  margin-top: 12px;
}

.drag-list {
  height: calc(100% - 26px);
  overflow: auto;
}

.item-dimension {
  display: flex;
  height: 28px;
  padding: 1px 8px;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  border-radius: 4px;
  border: 1px solid #dee0e3;

  background: #fff;

  color: var(--neutral-900, #1f2329);
  /* 中文/桌面端/正文 14 22 Regular */
  font-family: '阿里巴巴普惠体 3.0 55 Regular L3';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;

  cursor: pointer;
}

.item-dimension + .item-dimension {
  margin-top: 4px;
}

.item-dimension:hover {
  border: 1px solid var(--blue-500, #3370ff);
  background: var(--ed-color-primary-1a, rgba(51, 112, 255, 0.1));
}

.item-quota {
  padding: 2px 10px;
  margin: 2px 2px 0 2px;
  border: solid 1px #eee;
  text-align: left;
  color: #606266;
  background-color: white;
  display: block;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-quota + .item-quota {
  margin-top: 2px;
}

.item-quota:hover {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #b2d3a3;
  cursor: pointer;
}

.blackTheme .item-quota:hover {
}

span {
  font-size: 12px;
}

.set-name-area {
  font-weight: 600;
  margin-right: 20px;
}

:deep(.ed-row) {
  width: 100%;
}

.dv-selector {
  width: 100%;
}

.top-area {
  float: left;
  line-height: 33px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.top-area-text {
  font-weight: 400;
  font-size: 14px;
  color: #646a73;

  &.margin-left {
    margin-left: 24px;
  }
}
.settings-container {
  height: 100%;

  .settings-header {
    height: 92px;
    border-bottom: 1px solid #e6e6e6;

    .radio-group-box {
      margin-top: 8px;
      margin-bottom: 8px;

      .title {
        color: #646a73;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }

      :deep(.ed-radio__label) {
        color: #1f2329;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }
    }
  }

  .settings-main {
    padding: 16px;
    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .main-form {
      height: 100%;
      width: 100%;

      .m-row {
        width: 100%;
        display: flex;
      }

      .icon-center {
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .main-scrollbar-container {
        height: calc(100% - 132px);

        :deep(.ed-scrollbar) {
          height: fit-content;
          max-height: 208px;
        }
      }
    }
  }
}

.top-area-value {
  font-weight: 400;
  font-size: 14px;
  color: #1f2329;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.view-type-icon {
  color: var(--ed-color-primary);
  width: 22px;
  height: 16px;
}
.content-head {
  height: 30px;
  margin-top: 10px;
  .content-head-text {
    margin-left: 16px;
    font-weight: 400;
    font-size: 14px;
    color: #646a73;
    line-height: 32px;
    margin-right: 16px;
  }
}
.link-icon-area {
  text-align: center;
  line-height: 35px;
}
.inner-content {
  width: 100%;
  padding: 16px 16px 8px 16px;
  font-size: 14px !important;
}

.outer-content {
  height: 340px;
  border-radius: 4px;
}

.padding-lr {
  height: 500px;
  border: 1px solid var(--deCardStrokeColor, #dee0e3);
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  margin-left: 12px;
  width: 214px;
  overflow-y: hidden;
}

.mb8 {
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;

  i {
    margin-left: 4.67px;
  }
}

.field-height {
  height: calc(50% - 41px);
  margin-top: 4px;
  overflow-y: auto;
}

.class-na {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: var(--deTextDisable);
}
.outer-content-mirror {
  border: 1px solid #bbbfc4;
  border-radius: 4px;
  height: calc(100% - 30px);
  width: 100%;
  overflow: hidden;
}
.url-text {
  width: 100%;
  line-height: 22px;
  margin-bottom: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: #1f2329;
  display: flex;
  align-items: center;
}

.outer-content-right {
  border: 1px solid #bbbfc4;
  border-radius: 4px;
  height: calc(100% - 30px);
  width: 100%;
  padding: 12px;
}

.tree-select-field {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.label-content-details {
  width: 100%;
  display: flex;
  align-items: center;
}
.hint-icon {
  margin-left: 4px;
  cursor: pointer;
  color: #646a73;
}
.m-del-icon-btn {
  color: #646a73;
  margin-top: 2px;
  margin-left: -4px;

  &:hover {
    background: rgba(31, 35, 41, 0.1) !important;
  }
  &:focus {
    background: rgba(31, 35, 41, 0.1) !important;
  }
  &:active {
    background: rgba(31, 35, 41, 0.2) !important;
  }
}
.larger-radio {
  .ed-radio__inner {
    width: 16px;
    height: 16px;
  }
}

.custom-option {
  font-size: 14px;
  display: flex;
  align-items: center;
}
</style>
