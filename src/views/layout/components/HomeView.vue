<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图图片
const carouselImages = ref([
    'http://127.0.0.1:8080/imgs/lunbotu/stu1.png',
    'http://127.0.0.1:8080/imgs/lunbotu/stu2.png',
    'http://127.0.0.1:8080/imgs/lunbotu/stu3.png',
    'http://127.0.0.1:8080/imgs/lunbotu/stu4.png',
]);

// 快捷操作导航
const quickAccess = ref([
    { title: '我的课程', desc: '查看当前课程', icon: 'Class', route: '/class' },
    { title: '作业中心', desc: '查看和提交作业', icon: 'Homework', route: '/task' },
    { title: '成绩查询', desc: '查看我的成绩', icon: 'Grade', route: '/grade' },
    { title: '个人中心', desc: '查看和完善个人信息', icon: 'Personal', route: '/personal' },
]);

// 宣传图片
const promotionImages = ref([
    'http://127.0.0.1:8080/imgs/lunbotu/stu5.png',
    'http://127.0.0.1:8080/imgs/lunbotu/stu6.png',
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
                <img :src="img" class="carousel-image" alt="轮播图" />
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
    </div>

    <!-- 宣传图片 -->
    <div class="promotion-images">
        <el-row :gutter="20">
            <el-col :span="24" v-for="(image, index) in promotionImages" :key="index">
                <img :src="image" class="promotion-image" alt="宣传图片" />
            </el-col>
        </el-row>
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

.quick-access {
    margin-top: 40px;
}

.quick-access-card {
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    margin-top: 10px;
    border-radius: 10px;
}

.quick-access-card:hover {
    transform: translateY(-5px);
}

.quick-access-card h3 {
    margin-top: 10px;
    font-size: 1.2em;
}

.promotion-image {
    width: 100%;
    border-radius: 8px;
}
</style>
