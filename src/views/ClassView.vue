<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 学生已加入的班级
const joinedClasses = ref([
    { id: 1, name: '高一(1)班', teacher: '张老师' },
    { id: 3, name: '高二(3)班', teacher: '李老师' },
]);

// 模拟所有可加入班级数据
const allClasses = ref([
    { id: 1, name: '高一(1)班', teacher: '张老师' },
    { id: 2, name: '高一(2)班', teacher: '王老师' },
    { id: 3, name: '高二(3)班', teacher: '李老师' },
    { id: 4, name: '高二(4)班', teacher: '赵老师' },
]);

// 搜索框内容
const searchQuery = ref('');
const appliedClasses = ref<number[]>([]); // 学生申请中的班级ID数组

// 根据搜索过滤可申请的班级
const filteredClasses = computed(() => {
    return allClasses.value.filter(
        (classItem) => classItem.name.includes(searchQuery.value) && !joinedClasses.value.find(c => c.id === classItem.id)
    );
});

// 判断是否申请中
const isPending = (classId: number) => appliedClasses.value.includes(classId);

// 申请加入班级
const applyToJoin = (classItem) => {
    appliedClasses.value.push(classItem.id); // 标记班级申请中
    ElMessage.success(`已申请加入 ${classItem.name}`);
};
</script>

<template>
    <el-container>
        <!-- 页面标题 -->
        <el-header height="60px" class="header">
            <h2>我的班级</h2>
        </el-header>

        <!-- 主内容区域 -->
        <el-main class="main-content">
            <!-- 已加入班级展示 -->
            <el-card class="box-card" v-for="classItem in joinedClasses" :key="classItem.id">
                <template #header>
                    <div class="clearfix">
                    <span>{{ classItem.name }}</span>
                </div>
                </template>
                <div>
                    <p><strong>班主任：</strong>{{ classItem.teacher }}</p>
                    <p><strong>班级ID：</strong>{{ classItem.id }}</p>
                    <el-tag type="success">已加入</el-tag>
                </div>
            </el-card>

            <el-divider></el-divider>

            <!-- 搜索加入班级 -->
            <h3>申请加入新班级</h3>
            <el-row justify="space-between" class="toolbar">
                <el-col>
                    <el-input v-model="searchQuery" placeholder="搜索班级" prefix-icon="el-icon-search"></el-input>
                </el-col>
            </el-row>

            <!-- 可加入班级表格 -->
            <el-table :data="filteredClasses" style="width: 100%" border>
                <el-table-column prop="id" label="班级ID" width="100"></el-table-column>
                <el-table-column prop="name" label="班级名称"></el-table-column>
                <el-table-column prop="teacher" label="班主任"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button v-if="!isPending(scope.row.id)" @click="applyToJoin(scope.row)" type="primary"
                            size="small">
                            申请加入
                        </el-button>
                        <el-tag v-else type="info">申请中</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<style scoped>
.header {
    background-color: #409EFF;
    color: white;
    padding: 0 20px;
    display: flex;
    align-items: center;
}

.main-content {
    padding: 20px;
}

.box-card {
    margin-bottom: 20px;
}

.toolbar {
    margin-bottom: 20px;
}
</style>