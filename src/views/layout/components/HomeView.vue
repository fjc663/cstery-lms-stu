<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图图片
const carouselImages = ref([
    'https://cstery-sky.oss-cn-beijing.aliyuncs.com/student/avatar/8cb6b543-2ca6-419b-92b0-883d818812aa.png',
    'http://127.0.0.1:8080/imgs/default_homework.png',
    'http://127.0.0.1:8080/imgs/default_homework2.png',
    'https://cstery-sky.oss-cn-beijing.aliyuncs.com/student/avatar/8cb6b543-2ca6-419b-92b0-883d818812aa.png',
]);

// 快捷操作导航
const quickAccess = ref([
    { title: '我的课程', desc: '查看当前课程', icon: 'Class', route: '/class' },
    { title: '作业中心', desc: '查看和提交作业', icon: 'Homework', route: '/task' },
    { title: '考试安排', desc: '查看即将到来的考试', icon: 'EditPen', route: '/exams' },
    { title: '成绩查询', desc: '查看我的成绩', icon: 'DataLine', route: '/grades' },
]);

// 学习进度概览
const progressData = ref([
    { title: '已完成课程', value: '3/5', desc: '您的课程完成情况' },
    { title: '待完成作业', value: '4', desc: '未完成的作业数' },
    { title: '即将开始考试', value: '2', desc: '最近的考试安排' },
    { title: '总学时', value: '120小时', desc: '累计学习时间' },
]);

// 最新公告与提醒
const notifications = ref([
    { title: '新课程公告', content: '本周五将发布新的编程课程。' },
    { title: '作业截止提醒', content: '历史作业将于2024年10月8日截止提交。' },
    { title: '考试安排通知', content: '下周三将举行英语期中考试。' },
]);

// 导航到指定路由
const navigateTo = (route: string) => {
    router.push(route);
};
</script>

<template>
    <div class="student-home">
        <!-- 轮播图 -->
        <el-carousel height="400px" :interval="4000" arrow="always" type="card">
            <el-carousel-item v-for="(img, index) in carouselImages" :key="index">
                <img :src="img" class="carousel-image" alt="轮播图"/>
            </el-carousel-item>
        </el-carousel>

        <!-- 快捷入口 -->
        <div class="quick-access">
            <h2>快捷入口</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in quickAccess" :key="index">
                    <el-card shadow="hover" class="quick-access-card" @click="navigateTo(item.route)">
                        <el-icon :size="40">{{ item.icon }}</el-icon>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 学习进度概览 -->
        <div class="progress-overview">
            <h2>学习进度</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(data, index) in progressData" :key="index">
                    <el-card shadow="hover" class="overview-card">
                        <h3>{{ data.title }}</h3>
                        <p>{{ data.value }}</p>
                        <p class="overview-desc">{{ data.desc }}</p>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 最新公告与提醒 -->
        <div class="latest-notifications">
            <h2>最新公告与提醒</h2>
            <el-card v-for="(notification, index) in notifications" :key="index" class="notification-card" shadow="hover">
                <h3>{{ notification.title }}</h3>
                <p>{{ notification.content }}</p>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.student-home {
    padding: 20px;
    background-color: #f0f2f5;
}

.carousel-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

.quick-access, .progress-overview, .latest-notifications {
    margin-top: 40px;
}

.quick-access-card, .overview-card, .notification-card {
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.quick-access-card:hover, .overview-card:hover, .notification-card:hover {
    transform: translateY(-5px);
}

.quick-access-card h3, .overview-card h3 {
    margin-top: 10px;
    font-size: 1.2em;
}

.overview-card p {
    font-size: 2em;
    color: #409EFF;
    margin: 10px 0;
}

.overview-desc, .notification-card p {
    color: #666;
}

.notification-card h3 {
    font-weight: bold;
    font-size: 1.1em;
}
</style>
