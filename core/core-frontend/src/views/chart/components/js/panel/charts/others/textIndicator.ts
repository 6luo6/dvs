import { AbstractChartView, ChartLibraryType, ChartRenderType } from '../../types'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
/**
 * 指标卡图表
 */
export class TextIndicatorChartView extends AbstractChartView {
  properties: EditorProperty[] = [
    'background-overall-component',
    'title-selector',
    'indicator-value-selector',
    'indicator-name-selector',
    'threshold',
    'function-cfg',
    'jump-set',
  ]
  propertyInner: EditorPropertyInner = {
    'background-overall-component': ['all'],
    'title-selector': [
      'title',
      'fontSize',
      'color',
      'hPosition',
      'isItalic',
      'isBolder',
      'remarkShow',
      'fontFamily',
      'letterSpace',
      'fontShadow'
    ],
    'indicator-value-selector': [
      'fontSize',
      'color',
      'hPosition',
      'isItalic',
      'isBolder',
      'fontFamily',
      'letterSpace',
      'fontShadow'
    ],
    'indicator-name-selector': [
      'title',
      'fontSize',
      'color',
      'hPosition',
      'isItalic',
      'isBolder',
      'fontFamily',
      'letterSpace',
      'fontShadow'
    ],
    'function-cfg': ['emptyDataStrategy'],
  }
  axis: AxisType[] = ['xAxis', 'filter']
  axisConfig: AxisConfig = {
    xAxis: {
      name: `维度`,
      limit: 1,
      type: 'd'
    }
  }
  constructor() {
    super(ChartRenderType.CUSTOM, ChartLibraryType.TextIndicator, 'textIndicator')
  }
}
