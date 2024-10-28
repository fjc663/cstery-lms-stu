<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';
import useReport from '@/composables/useReport';
import useUtils from '@/composables/useUtils';
import useClass from '@/composables/useClass';


const router = useRouter();

// 成绩报告处理逻辑
const { pageQueryTask, pageQueryTaskReport, totaltaskReport, taskReports, reportChart, getChartData } = useReport();

// 班级处理逻辑
const { classes, getClasses } = useClass();

// 工具方法
const { isDueDateLaterThanNow } = useUtils();

const page = ref<number>(1); // 当前页
const pageSize = ref<number>(10); // 每页条数

// 每页大小改变时触发
const handleSizeChange = (pageSize: number) => {
    pageQueryTask.value.pageSize = pageSize;

    pageQueryTaskReport();
};

// 页码改变时触发
const handleCurrentChange = (page: number) => {
    pageQueryTask.value.page = page;

    pageQueryTaskReport();
};

// 搜索和过滤条件
const filters = ref({
    task_title: '',
    class_name: '',
    is_cut_off: null
});

// 分页条件查询
const searchTask = () => {
    pageQueryTask.value.task_title = filters.value.task_title;
    pageQueryTask.value.class_name = filters.value.class_name;
    pageQueryTask.value.is_cut_off = filters.value.is_cut_off;

    pageQueryTaskReport();
}

// 查看详情跳转方法
const viewDetails = (taskId: number) => {
    router.push({ path: `/task/${taskId}` });
};


// 图表元素引用
const scoreDistributionChart = ref(null);
const completionChart = ref(null);

function loadChartData() {
    // 成绩分布图表
    const scoreChart = echarts.init(scoreDistributionChart.value);
    scoreChart.setOption({
        xAxis: { type: 'category', data: ['0-59', '60-69', '70-79', '80-89', '90-100'] },
        yAxis: { type: 'value' },
        series: [
            {
                data: reportChart.value.score_list,
                type: 'bar',
                barWidth: '50%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#67C23A' },
                        { offset: 1, color: '#409EFF' },
                    ]),
                    borderRadius: [5, 5, 0, 0],
                },
            },
        ],
    });

    // 作业完成情况图表
    const completionChartInstance = echarts.init(completionChart.value);
    completionChartInstance.setOption({
        tooltip: { trigger: 'item' },
        series: [
            {
                name: '完成情况',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: reportChart.value.completion_count, name: '已完成', itemStyle: { color: '#67C23A' } },
                    { value: reportChart.value.not_completion_count, name: '未完成', itemStyle: { color: '#F56C6C' } },
                ],
            },
        ],
    });
}

// 初始化页面数据
onMounted(async () => {
    pageQueryTask.value.page = page.value;
    pageQueryTask.value.pageSize = pageSize.value;
    await pageQueryTaskReport();

    await getClasses();

    // 加载成绩数据和图表数据
    await getChartData();
    loadChartData();
})
</script>

<template>
    <div class="student-grades-management">
        <h1>我的成绩</h1>

        <!-- 图表：展示成绩分布和作业完成情况 -->
        <div class="charts-section">
            <el-card shadow="hover" class="chart-card">
                <h2>成绩分布</h2>
                <div ref="scoreDistributionChart" class="chart"></div>
            </el-card>

            <el-card shadow="hover" class="chart-card">
                <h2>作业完成情况</h2>
                <div ref="completionChart" class="chart"></div>
            </el-card>
        </div>

        <!-- 筛选条件 -->
        <div class="filter-section">
            <el-input v-model="filters.task_title" placeholder="输入作业标题" clearable class="search-input">
                <template #append>
                    <el-button icon="Search" @click="searchTask" />
                </template>
            </el-input>

            <el-select v-model="filters.class_name" placeholder="选择班级" clearable class="select-filter"
                @change="searchTask">
                <el-option v-for="classItem in classes" :key="classItem.id" :label="classItem.class_name"
                    :value="classItem.class_name" />
            </el-select>

            <el-select v-model="filters.is_cut_off" placeholder="截止状态" clearable class="select-filter"
                @change="searchTask">
                <el-option label="已截止" :value="true" />
                <el-option label="未截止" :value="false" />
            </el-select>
        </div>

        <!-- 成绩表格 -->
        <el-table :data="taskReports" border stripe style="width: 100%"
            :header-cell-style="{ 'text-align': 'center', 'background-color': '#f7f8fa', 'font-weight': 'bold' }"
            :cell-style="{ 'text-align': 'center' }">
            <!-- 序号 -->
            <el-table-column type="index" width="60" label="序号"></el-table-column>

            <!-- 作业标题 -->
            <el-table-column prop="task_title" label="作业标题"></el-table-column>

            <!-- 所属班级 -->
            <el-table-column prop="class_name" label="所属班级"></el-table-column>

            <!-- 是否截止 -->
            <el-table-column prop="is_cut_off" label="是否截止" width="100">
                <template #default="scope">
                    <el-tag :type="isDueDateLaterThanNow(scope.row.due_date) ? 'success' : 'danger'">
                        {{ isDueDateLaterThanNow(scope.row.due_date) ? '未截止' : '已截止' }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 分数 -->
            <el-table-column prop="score" label="分数" width="100">
                <template #default="scope">
                    <el-tag v-if="scope.row.score" :type="scope.row.score >= 60 ? 'success' : 'danger'">
                        {{ scope.row.score }}
                    </el-tag>
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="viewDetails(scope.row.task_id)" link>查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section">
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper" :total="totaltaskReport"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<style scoped>
.student-grades-management {
    padding: 20px;
    background-color: #f9fafc;
    min-height: 100vh;
}

h1 {
    font-size: 1.8em;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.charts-section {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 20px;
}

.chart-card {
    width: 48%;
}

.chart {
    width: 100%;
    height: 250px;
}

.filter-section {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
}

.search-input {
    width: 220px;
}

.select-filter {
    width: 180px;
}

.pagination-section {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>
