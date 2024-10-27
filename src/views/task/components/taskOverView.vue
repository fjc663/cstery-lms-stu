<script lang="ts" setup>
import useClass from '@/composables/useClass';
import useUtils from '@/composables/useUtils';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

// 通用工具方法
const { isDueDateLaterThanNow } = useUtils()

// 班级数据处理逻辑
const { classes, getClasses } = useClass();


// 跳转作业提交页面
const goToSubmitPage = (taskId: number) => {
    router.push(`/task/${taskId}`)
}

// 初始化数据
onMounted(() => getClasses())
</script>

<template>
    <div class="class-task-list">
        <h1>班级作业列表</h1>
        <div v-for="classItem in classes" :key="classItem.id" class="class-item">
            <h2>{{ classItem.class_name }} - {{ classItem.teacher_name }}</h2>
            <p>{{ classItem.desc }}</p>
            <img v-lazy="classItem.class_img" alt="Class Image" class="class-image" />

            <div v-if="classItem.tasks.length > 0" class="tasks">
                <h3>作业列表</h3>
                <ul>
                    <li v-for="task in classItem.tasks" :key="task.id" class="task-item">
                        <h4>
                            <el-tooltip placement="top" effect="light" v-if="task.title.length > 30"
                                popper-class="custom-tooltip">
                                <template #content>
                                    <div>{{ task.title }}</div>
                                </template>
                                {{ task.title.slice(0, 30) + '...' }}
                            </el-tooltip>
                            <span v-else>{{ task.title }}</span>

                            <el-tag v-if="task.submitted" type="success">
                                已提交
                            </el-tag>

                            <el-tag v-else type="warning">
                                未提交
                            </el-tag>

                            <el-tag style="margin-left: 5px;" v-if="task.due_date && !isDueDateLaterThanNow(task.due_date)" type="danger">
                                已截止
                            </el-tag>
                        </h4>

                        <p>
                            <el-tooltip placement="top" effect="light" v-if="task.desc.length > 30"
                                popper-class="custom-tooltip">
                                <template #content>
                                    <div>{{ task.desc }}</div>
                                </template>
                                {{ task.desc.slice(0, 30) + '...' }}
                            </el-tooltip>
                            <span v-else>{{ task.desc }}</span>
                        </p>

                        <!-- 跳转作业页面按钮 -->
                        <el-button
                            v-if="task.submitted && (!task.due_date || task.allow_late_submission || isDueDateLaterThanNow(task.due_date))"
                            @click="goToSubmitPage(task.id)" class="edit-button">去修改</el-button>
                        <el-button v-else-if="!task.due_date || task.allow_late_submission || isDueDateLaterThanNow(task.due_date)"
                            @click="goToSubmitPage(task.id)" class="submit-button">去提交</el-button>
                        <el-button v-else @click="goToSubmitPage(task.id)" class="view-button">去查看</el-button>
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>该班级暂无作业。</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.class-task-list {
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f3f6f9;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 1.8em;
    font-weight: bold;
}

.class-item {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.class-item:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
}

.class-image {
    width: 100%;
    max-width: 120px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 10px;
    display: block;
}

.tasks {
    margin-top: 20px;
}

.task-item {
    margin: 15px 0;
    padding: 15px;
    border-radius: 4px;
    background-color: #f9f9f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 4px solid #3498db;
    transition: background-color 0.2s ease;
}

.task-item:hover {
    background-color: #f0f7ff;
}

.task-item h4 {
    font-weight: bold;
    color: #34495e;
    margin: 0;
    font-size: 1.1em;
}

.task-item p {
    color: #7f8c8d;
    margin: 5px 0 0;
    font-size: 0.95em;
    line-height: 1.4;
}

button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

button:hover {
    background-color: #2980b9;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

button:active {
    background-color: #1e6fa1;
}

.edit-button {
    background-color: #2ecc71;
}

.edit-button:hover {
    background-color: #27ae60;
}

.submit-button {
    background-color: #3498db;
}

.submit-button:hover {
    background-color: #2980b9;
}

.view-button {
    background-color: #e67e22;
}

.view-button:hover {
    background-color: #d35400;
}

p {
    color: #7f8c8d;
    line-height: 1.6;
    font-size: 14px;
}
</style>
