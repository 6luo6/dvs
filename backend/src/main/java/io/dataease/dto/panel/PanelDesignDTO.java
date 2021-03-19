package io.dataease.dto.panel;

import io.dataease.base.domain.PanelDesign;
import io.dataease.dto.chart.ChartViewDTO;
import lombok.Data;

/**
 * Author: wangjiahao
 * Date: 2021-03-17
 * Description:
 */
@Data
public class PanelDesignDTO extends PanelDesign {

    //当前视图是否在仪表盘中显示
    private boolean keepFlag = false;

    private ChartViewDTO chartView;

    private Object systemComponent;

    public PanelDesignDTO() {

    }
    public PanelDesignDTO(ChartViewDTO chartView) {
        this.chartView=chartView;
    }

}
