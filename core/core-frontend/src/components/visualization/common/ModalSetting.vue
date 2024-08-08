<template>
  <el-dialog
    class="modal-setting-box"
    v-model="isShow"
    width="500"
    title="弹框设置"
    :append-to-body="true"
  >
    <el-form label-width="auto" :model="modalForm" style="max-width: 600px" label-position="top">
      <el-form-item label="标题">
        <el-switch
          v-model="modalForm.isShowTitle"
          inline-prompt
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>
      <div v-show="modalForm.isShowTitle">
        <el-form-item>
          <el-input v-model="modalForm.title" placeholder="为空则读取图表标题" />
        </el-form-item>
        <div style="display: flex">
          <el-form-item style="padding-right: 4px">
            <el-tooltip content="文字" placement="top">
              <el-color-picker v-model="modalForm.titleColor" show-alpha :predefine="COLOR_PANEL" />
            </el-tooltip>
          </el-form-item>
          <el-form-item style="padding-right: 4px">
            <el-tooltip content="背景" placement="top">
              <el-color-picker
                v-model="modalForm.titleBgColor"
                show-alpha
                :predefine="COLOR_PANEL"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item style="padding: 0 4px">
            <el-tooltip content="字号" placement="top">
              <el-select style="width: 56px" v-model="modalForm.titleFontSize">
                <el-option
                  v-for="option in fontSizeList"
                  :key="option.value"
                  :label="option.name"
                  :value="option.value"
                />
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item style="padding-left: 4px">
            <el-select style="width: 100px" v-model="modalForm.titleLetterSpace">
              <template #prefix>
                <el-icon>
                  <Icon name="icon_letter-spacing_outlined" />
                </el-icon>
              </template>
              <el-option
                v-for="option in fontLetterSpace"
                :key="option.value"
                :label="option.name"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-space>
            <el-form-item style="padding-left: 8px">
              <el-checkbox class="icon-checkbox" v-model="modalForm.titleIsBolder">
                <el-tooltip placement="top">
                  <template #content> 加粗 </template>
                  <div class="icon-btn" :class="{ active: modalForm.titleIsBolder }">
                    <el-icon>
                      <Icon name="icon_bold_outlined" />
                    </el-icon>
                  </div>
                </el-tooltip>
              </el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-checkbox class="icon-checkbox" v-model="modalForm.titleIsItalic">
                <el-tooltip placement="top">
                  <template #content> 倾斜 </template>
                  <div class="icon-btn" :class="{ active: modalForm.titleIsItalic }">
                    <el-icon>
                      <Icon name="icon_italic_outlined" />
                    </el-icon>
                  </div>
                </el-tooltip>
              </el-checkbox>
            </el-form-item>

            <div style="height: 32px; margin-bottom: 10px; border-left: 1px solid #b1b0b0"></div>

            <el-form-item>
              <el-radio-group class="icon-radio-group" v-model="modalForm.titleHPosition">
                <el-radio label="left">
                  <el-tooltip placement="top">
                    <template #content> 左 </template>
                    <div
                      class="icon-btn"
                      :class="{
                        active: modalForm.titleHPosition === 'left'
                      }"
                    >
                      <el-icon>
                        <Icon name="icon_left-alignment_outlined" />
                      </el-icon>
                    </div>
                  </el-tooltip>
                </el-radio>
                <el-radio label="center">
                  <el-tooltip placement="top">
                    <template #content> 中 </template>
                    <div
                      class="icon-btn"
                      :class="{
                        active: modalForm.titleHPosition === 'center'
                      }"
                    >
                      <el-icon>
                        <Icon name="icon_center-alignment_outlined" />
                      </el-icon>
                    </div>
                  </el-tooltip>
                </el-radio>
                <el-radio label="right">
                  <el-tooltip placement="top">
                    <template #content> 右 </template>
                    <div
                      class="icon-btn"
                      :class="{
                        active: modalForm.titleHPosition === 'right'
                      }"
                    >
                      <el-icon>
                        <Icon name="icon_right-alignment_outlined" />
                      </el-icon>
                    </div>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-space>
        </div>
        <div style="display: flex">
          <el-form-item>
            <div>
              <span>上下间距 </span>
              <el-input-number
                v-model="modalForm.titleVPadding"
                controls-position="right"
                size="middle"
                :min="0"
                :max="100"
              />
            </div>
            <div style="margin-left: 10px">
              <span>左右间距 </span>
              <el-input-number
                v-model="modalForm.titleHPadding"
                controls-position="right"
                size="middle"
                :min="0"
                :max="100"
              />
            </div>
          </el-form-item>
        </div>
      </div>

      <el-form-item label="删除按钮">
        <el-switch
          v-model="modalForm.showCloseIcon"
          inline-prompt
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>
      <div v-if="modalForm.showCloseIcon">
        <el-form-item>
          <div style="display: flex">
            <el-input
              style="width: 120px; margin-right: 8px"
              v-model="modalForm.closeIcon"
              placeholder="请输入图标名称"
            ></el-input>
            <el-tooltip content="大小" placement="top">
              <el-input-number
                v-model="modalForm.iconSize"
                style="margin-right: 8px"
              ></el-input-number>
            </el-tooltip>
            <el-tooltip content="颜色" placement="top">
              <el-color-picker v-model="modalForm.iconColor" show-alpha :predefine="COLOR_PANEL" />
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display: flex">
            <span>上偏移 </span>
            <el-input-number
              v-model="modalForm.iconTop"
              style="margin-right: 8px"
            ></el-input-number>
            <span>右偏移 </span>
            <el-input-number v-model="modalForm.iconRight"></el-input-number>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="内容区域">
        <span style="margin-right: 8px">间距</span>
        <el-input-number
          v-model="modalForm.bodyPadding"
          controls-position="right"
          size="middle"
          :min="0"
          :max="100"
        />
        <span>背景色</span>
        <el-color-picker v-model="modalForm.bodyBgColor" show-alpha :predefine="COLOR_PANEL" />
      </el-form-item>
      <el-form-item>
        <div style="display: flex; align-items: center">
          <el-switch
            v-model="modalForm.isBodyFit"
            inline-prompt
            active-text="自适应"
            inactive-text="定宽高"
            style="margin-right: 8px"
          />
          <span style="margin-right: 8px">宽</span>
          <el-input
            v-model="modalForm.width"
            size="middle"
            :disabled="modalForm.isBodyFit"
            style="width: 120px; margin-right: 8px"
          />
          <span style="margin-right: 8px">高</span>
          <el-input
            v-model="modalForm.height"
            size="middle"
            :disabled="modalForm.isBodyFit"
            style="width: 120px; margin-right: 8px"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <div style="display: flex; align-items: center">
          <span style="margin-right: 8px">最大宽度</span>
          <el-input
            v-model="modalForm.maxWidth"
            size="middle"
            style="width: 120px; margin-right: 8px"
          />
          <span style="margin-right: 8px">最大高度</span>
          <el-input
            v-model="modalForm.maxHeight"
            size="middle"
            style="width: 120px; margin-right: 8px"
          />
        </div>
      </el-form-item>
    </el-form>
    <el-row class="root-class">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="save()">确认 </el-button>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, PropType, watch, computed } from 'vue'
import {
  COLOR_PANEL,
  CHART_FONT_LETTER_SPACE,
  DEFAULT_MODAL
} from '@/views/chart/components/editor/util/chart'
const props = defineProps({
  modalSetting: {
    type: Object as PropType<ModalSetting>,
    required: true
  }
})
const fontLetterSpace = CHART_FONT_LETTER_SPACE
const emit = defineEmits(['onModalSetting'])
const modalForm = ref<ModalSetting>({ ...DEFAULT_MODAL })
const isShow = ref(false)
const show = () => {
  isShow.value = true
}

const cancel = () => {
  isShow.value = false
}
const save = () => {
  emit('onModalSetting', modalForm.value)
  cancel()
}
const fontSizeList = computed(() => {
  const arr = []
  for (let i = 10; i <= 60; i = i + 2) {
    arr.push({
      name: i + '',
      value: i
    })
  }
  return arr
})
watch(
  () => props.modalSetting,
  value => {
    if (value) {
      modalForm.value = { ...value }
    }
  },
  {
    immediate: true
  }
)
defineExpose({ show })
</script>

<style lang="less">
.modal-setting-box {
  .ed-form-item {
    margin-bottom: 10px;
  }
  .root-class {
    margin: 15px 0px 5px;
    justify-content: right;
  }
  .icon-checkbox {
    .ed-checkbox__input {
      display: none;
    }
    .ed-checkbox__label {
      padding: 0;
    }
  }
  .icon-radio-group {
    .ed-radio {
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
    .ed-radio__input {
      display: none;
    }
    .ed-radio__label {
      padding: 0;
    }
  }
  .icon-btn {
    font-size: 16px;
    line-height: 16px;
    width: 24px;
    height: 24px;
    text-align: center;
    border-radius: 4px;
    padding-top: 4px;
    color: #1f2329;
    cursor: pointer;
    &.active {
      color: var(--ed-color-primary);
      background-color: var(--ed-color-primary-1a, rgba(51, 112, 255, 0.1));
    }

    &:hover {
      background-color: rgba(31, 35, 41, 0.1);
    }
  }
}
</style>
