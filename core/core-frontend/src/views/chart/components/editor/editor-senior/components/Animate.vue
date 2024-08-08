<script lang="tsx" setup>
import { computed, onMounted, PropType, reactive, ref, watch } from 'vue'
import { COLOR_PANEL, DEFAULT_ANIMATE } from '@/views/chart/components/editor/util/chart'
import { parseJson } from '../../../js/util'

const props = defineProps({
  chart: {
    type: Object as PropType<ChartObj>,
    required: true
  },
  themes: {
    type: String,
    default: 'dark'
  },
  propertyInner: {
    type: Array<string>
  }
})

const emit = defineEmits(['onAnimateChange'])

watch(
  () => props.chart.senior.animateForm,
  () => {
    init()
  },
  { deep: true }
)

const state = reactive({
  animateForm: JSON.parse(JSON.stringify(DEFAULT_ANIMATE)),
  predefineColors: COLOR_PANEL,
  showEmptyStrategy: false
})

const changeAnimate = () => {
  emit('onAnimateChange', state.animateForm)
}

const showProperty = prop => props.propertyInner?.includes(prop)

const init = () => {
  const chart = JSON.parse(JSON.stringify(props.chart))
  if (chart.senior) {
    let senior = parseJson(chart.senior)
    if (senior.animateForm) {
      state.animateForm = senior.animateForm
    }

  }
}


onMounted(() => {
  init()
})
</script>

<template>
  <div @keydown.stop @keyup.stop style="width: 100%">
    <el-form ref="animateForm" :model="state.animateForm" label-position="top">
      <el-form-item
        v-if="showProperty('count')"
        label="数字滚动"
        class="form-item"
        :class="'form-item-' + themes"
      >
        <el-radio-group
          :effect="themes"
          v-model="state.animateForm.isCount"
          @change="changeAnimate"
        >
          <el-radio :effect="themes" :label="true">
            是
          </el-radio>
          <el-radio :effect="themes" :label="false">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="showProperty('count')"
        label="数字滚动时间"
        class="form-item"
        :class="'form-item-' + themes"
      >
        <el-input :effect="themes" v-model="state.animateForm.countDuration" @change="changeAnimate"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.shape-item {
  padding: 6px;
  border: none;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ed-select-dropdown__item {
  padding: 0 20px;
}
span {
  font-size: 12px;
}

.switch-style {
  position: absolute;
  right: 10px;
  margin-top: -4px;
}
.color-picker-style {
  cursor: pointer;
  z-index: 1003;
}
.form-item :deep(.ed-radio-group) {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  label {
    line-height: 28px;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
.range-slider {
  :deep(.ed-form-item__content) {
    padding: 0 8px;
  }
  :deep(.ed-slider__button-wrapper) {
    --ed-slider-button-wrapper-size: 36px;
    --ed-slider-button-size: 16px;
  }
}
.form-item-checkbox {
  margin-bottom: 10px !important;
}
</style>
