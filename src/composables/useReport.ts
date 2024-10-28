import { getChartDataApi, pageQueryTaskReportApi } from "@/apis/reportApi"
import type { result } from "./interfaceType/commonInterface"
import type { iReportChart, itaskPageQuery, itaskReport } from "./interfaceType/taskInterface"
import { ref } from "vue"
import { ElMessage } from "element-plus"


// 班级学生数据列表
const taskReports = ref<itaskReport[]>([]);

// 分页查询条件
const pageQueryTask = ref<itaskPageQuery>({
    page: 1,
    pageSize: 10
});

// 分页查询得到总条数
const totaltaskReport = ref<number>(0);

// 图表数据
const reportChart = ref<iReportChart>({
    completion_count: 0,
    not_completion_count: 0,
    score_list: []
})

// 根据学生ID分页查询作业
const pageQueryTaskReport = async () => {
    const res: result = await pageQueryTaskReportApi(pageQueryTask.value);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    totaltaskReport.value = res.data.total;
    taskReports.value = res.data.records;
}

// 请求作业完成情况的图表数据
const getChartData = async () => {
    const res: result = await getChartDataApi();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    reportChart.value = res.data;
}


export default function() {
    return {
        pageQueryTask,
        pageQueryTaskReport,
        totaltaskReport,
        taskReports,
        reportChart,
        getChartData
    }
}