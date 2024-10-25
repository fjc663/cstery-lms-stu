<script lang="ts" setup>
import { onMounted } from 'vue';
import useClass from '@/composables/useClass';
import { useRoute, useRouter } from 'vue-router';
import useUtils from '@/composables/useUtils';
import useTask from '@/composables/useTask';

const router = useRouter();

// 通过路由获取班级ID
const route = useRoute();
const classId = Number(route.params.id);

// 获取班级和学生数据
const { clas, getClassById } = useClass();
// 作业处理逻辑
const { tasks, getTaskByClassId } = useTask();

// 复制到剪贴板的函数、日期格式化函数、返回上级、判断是否到截止日期
const { copyToClipboard, formatDate, goBack, isDueDateLaterThanNow } = useUtils();

// 跳转作业提交页面
const goToSubmitPage = (taskId: number) => {
    router.push(`/task/${taskId}`)
}

// 初始化页面
onMounted(async () => {
    await getClassById(classId);

    await getTaskByClassId(classId);
});
</script>

<template>
    <div class="class-detail">
        <el-page-header @back="goBack" />

        <div class="class-header">
            <img v-lazy="clas.class_img" alt="班级图片" class="class-img" />
            <div class="separator"></div> <!-- 分隔符 -->
            <div class="class-info">
                <h1>{{ clas.class_name }}</h1>
                <p>班主任：{{ clas.teacher_name }}</p>
                <p>
                    班级邀请码：{{ clas.class_code }}
                    <el-button type="success" link class="copy-button"
                        @click="copyToClipboard(clas.class_code || '')">复制</el-button>
                </p>
                <p>班级描述：{{ clas.desc }}</p>
            </div>
        </div>

        <!-- 作业信息展示 -->
        <div class="assignment-list">
            <h2>作业信息</h2>
            <el-card v-for="task in tasks" :key="task.id" class="task-card">
                <h3 class="task-title">
                    {{ task.title }}

                    <el-tag v-if="task.submitted" type="success">
                        已提交
                    </el-tag>

                    <el-tag v-else-if="!isDueDateLaterThanNow(task.due_date)" type="danger">
                        已截止
                    </el-tag>

                    <el-tag v-else type="warning">
                        未提交
                    </el-tag>
                </h3>
                <p class="task-desc"><strong>描述：</strong>{{ task.desc }}</p>
                <p class="task-due-date"><strong>截止日期：</strong>{{ formatDate(task.due_date) }}</p>
                <p class="task-late-submission"
                    :class="{ 'allowed': task.allow_late_submission, 'not-allowed': !task.allow_late_submission }">
                    <strong>是否允许迟交：</strong>{{ task.allow_late_submission ? '是' : '否' }}
                </p>
                <p class="task-submission-format" :style="{ color: task.submission_format === 'img' ? 'red' : 'blue' }">
                    <strong>提交格式：</strong>{{
                        task.submission_format === 'img' ? '必须提交图片' :
                            '任意格式' }}
                </p>

                <!-- 展示多张图片 -->
                <div v-if="task.images && Array.isArray(task.images)" class="image-gallery">
                    <el-image v-for="(image, index) in task.images" :key="index" :src="image" alt="作业图片" fit="cover"
                        :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="task.images"
                        :initial-index="index" class="task-image" />
                </div>

                <div class="footer-button">
                    <!-- 跳转作业页面按钮 -->
                    <el-button
                        v-if="task.submitted && (task.allow_late_submission || isDueDateLaterThanNow(task.due_date))"
                        @click="goToSubmitPage(task.id)" class="edit-button">修改作业</el-button>
                    <el-button v-else-if="task.allow_late_submission || isDueDateLaterThanNow(task.due_date)"
                        @click="goToSubmitPage(task.id)" class="submit-button">提交作业</el-button>
                    <el-button v-else @click="goToSubmitPage(task.id)" class="view-button">查看提交</el-button>
                </div>


            </el-card>
        </div>

    </div>
</template>

<style scoped>
.class-detail {
    padding: 40px;
    background-color: #f9f9f9;
    border-radius: 10px;
}

.class-header {
    display: flex;
    align-items: flex-start;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

.class-img {
    width: 300px;
    /* 设置固定宽度 */
    height: auto;
    /* 自动高度以保持比例 */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.separator {
    width: 1px;
    /* 分隔符的宽度 */
    background-color: #eaeaea;
    /* 分隔符颜色 */
    margin: 0 20px;
    /* 左右间距 */
    height: 100%;
    /* 分隔符高度 */
}

.class-info {
    flex: 1;
    /* 使班级信息区域占据剩余空间 */
}

.class-header h1 {
    color: #333;
    margin-bottom: 10px;
}

.assignment-list {
    padding: 20px;
    background-color: #f9f9f9;
    /* 背景色 */
}

.task-card {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
    font-size: 1.5em;
    /* 增大标题字体 */
    color: #333;
    /* 深色字体 */
    border-bottom: 1px solid #e0e0e0;
    /* 下划线效果 */
    padding-bottom: 5px;
    /* 与下方内容间隔 */
}

.task-desc,
.task-due-date,
.task-late-submission,
.task-submission-format {
    font-size: 1em;
    /* 统一字体大小 */
    margin: 8px 0;
    /* 上下间距 */
    color: #555;
    /* 较浅的字体颜色 */
}

strong {
    color: #333;
    /* 强调文本颜色 */
}

.task-late-submission {
    font-size: 1em;
    /* 统一字体大小 */
    margin: 8px 0;
    /* 上下间距 */
}

.allowed {
    color: #4caf50;
    /* 允许迟交时的颜色 */
}

.not-allowed {
    color: #f44336;
    /* 不允许迟交时的颜色 */
}

.task-submission-format {
    font-weight: bold;
    /* 加粗格式说明 */
}

.image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.task-image {
    max-width: 100%;
    height: 200px;
    border-radius: 5px;
    cursor: pointer;
}

.footer-button {
    margin-top: 10px;
}

.submit-button,
.edit-button,
.view-button {
    width: 120px;
    /* 使按钮宽度自适应 */
    padding: 12px;
    /* 按钮内边距增加 */
    font-size: 1.1em;
    /* 字体稍大 */
    border-radius: 8px;
    /* 圆角效果 */
    color: #fff;
    /* 文字颜色 */
    transition: background-color 0.3s, transform 0.2s;
    /* 添加过渡效果 */
}

.submit-button {
    background-color: #8bccc3;
    /* 自定义背景色 */
}

.edit-button {
    background-color: #88a742b4;
    /* 自定义背景色 */
}

.view-button {
    background-color: #7eade2;
    /* 自定义背景色 */
}

.submit-button:hover {
    background-color: #46a094;
    /* 悬停时的背景色 */
    transform: scale(1.05);
    /* 悬停时轻微放大效果 */
}

.edit-button:hover {
    background-color: #425a0cb4;
    /* 悬停时的背景色 */
    transform: scale(1.05);
    /* 悬停时轻微放大效果 */
}

.view-button:hover {
    background-color: #5092dd;
    /* 悬停时的背景色 */
    transform: scale(1.05);
    /* 悬停时轻微放大效果 */
}

.edit-button:active,
.submit-button:active,
.view-button:active {
    transform: scale(0.95);
    /* 点击时缩小效果 */
}

.edit-button:focus,
.submit-button:focus,
.view-button:focus {
    outline: none;
    /* 去掉焦点框 */
}
</style>
