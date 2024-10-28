import type { itaskPageQuery } from "@/composables/interfaceType/taskInterface";
import http from "@/utils/http";


// 根据学生ID分页查询作业
export function pageQueryTaskReportApi(taskPageQuery: itaskPageQuery): any {
    return http({
        url: '/student/report',
        params: taskPageQuery
    })
}

// 请求作业完成情况的图表数据
export function getChartDataApi(): any {
    return http({
        url: '/student/report/chart'
    })
}

