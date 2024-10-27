<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useClass from '@/composables/useClass';
import useUtils from '@/composables/useUtils';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import useUser from '@/composables/useUser';


const router = useRouter();

// 用户数据处理逻辑
const { user, getUserInfo } = useUser();

// 班级处理逻辑
const { classes, getClasses, clas, getClassByCode, joinClass, exitClass } = useClass();

// 管理弹窗显示
const showDialog = ref<boolean>(false);
const showConfirmDialog = ref<boolean>(false);

// 邀请码表单数据
const inviteCode = ref<string>('');


// 邀请码验证函数
const checkInviteCode = async () => {
    const code: number = await getClassByCode(inviteCode.value);
    if (code === 1) {
        showDialog.value = false;
        showConfirmDialog.value = true; // 打开确认弹窗
    } else {
        ElMessage.error('邀请码错误，请重试');
    }
};

// 根据邀请码请求加入班级
const onjoinclass = async () => {
    // 校验是否完善个人信息
    await getUserInfo();
    if (!user.value.name) {
        ElMessage.error('请先完善个人信息');
        router.push('/personal');
        return;
    }

    await joinClass(inviteCode.value);
    showConfirmDialog.value = false;
    getClasses();
}

// 根据邀请码请求退出班级
const onExitClass = async (classCode: string) => {
    ElMessageBox.confirm('您确定要退出该班级吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await exitClass(classCode);
        getClasses();
    }).catch(() => {
        ElMessage({ type: 'info', message: '已取消删除' });
    });
};

// 查看班级详细信息
const viewClassDetails = (classId: number) => {
    router.push(`/class/${classId}`);
}

// 复制到剪贴板的函数
const { copyToClipboard } = useUtils();

// 初始化数据
onMounted(() => getClasses())
</script>

<template>
    <!-- 输入邀请码的弹窗 -->
    <el-dialog title="加入班级" v-model="showDialog" width="400px">

        <el-input v-model="inviteCode" placeholder="请输入班级邀请码"></el-input>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="checkInviteCode">确认</el-button>
            </div>
        </template>

    </el-dialog>

    <!-- 确认班级信息的弹窗 -->
    <el-dialog title="确认加入班级" v-model="showConfirmDialog" width="400px">
        <p>班级名称：{{ clas.class_name }}</p>
        <p>班主任：{{ clas.teacher_name }}</p>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showConfirmDialog = false">取消</el-button>
                <el-button type="primary" @click="onjoinclass">确认加入</el-button>
            </div>
        </template>

    </el-dialog>

    <el-container>
        <!-- 页面标题 -->
        <el-header height="60px" class="header">
            <h1 class="header-title">我的班级</h1>
            <el-button type="primary" @click="showDialog = true">加入班级</el-button>
        </el-header>

        <!-- 主内容区域 -->
        <el-main class="main-content">
            <!-- 已加入班级展示 -->
            <el-card class="box-card" v-for="classItem in classes" :key="classItem.id">
                <img v-lazy="classItem.class_img" alt="Class Image" class="class-img" @click="viewClassDetails(classItem.id)" />
                <template #header>
                    <div class="clearfix card-header">
                        <el-tooltip placement="top" effect="light" v-if="classItem.class_name.length > 10"
                            popper-class="custom-tooltip">
                            <template #content>
                                <div>{{ classItem.class_name }}</div>
                            </template>
                            {{ classItem.class_name.slice(0, 10) + '...' }}
                        </el-tooltip>
                        <span v-else>{{ classItem.class_name }}</span>
                    </div>
                </template>
                <div class="card-body">
                    <p><strong>班主任: </strong>{{ classItem.teacher_name }}</p>
                    <p>
                        <strong>班级邀请码: </strong>{{ classItem.class_code }}
                        <el-button type="primary" link class="copy-button"
                            @click="copyToClipboard(classItem.class_code)">复制</el-button>
                    </p>
                    <div class="card-footer">
                        <el-tag type="success">已加入</el-tag>
                        <el-button link type="danger" @click="onExitClass(classItem.class_code)" class="exit-button">退出</el-button>
                    </div>
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    /* 标题和按钮分开对齐 */
    align-items: center;
    /* 垂直居中 */
    padding: 0 20px;
    background-color: #009b93;
    /* 主色调 */
    color: white;
    /* 标题文字颜色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
    position: sticky;
    top: 0;
    border-radius: 8px;
    z-index: 10;
    /* 保持头部固定在顶部 */
}

.header-title {
    font-size: 1.5em;
    /* 标题字体大小 */
    font-weight: bold;
    margin: 0 auto;
    letter-spacing: 1px;
    /* 增加字母间距 */
}

.header-button {
    font-size: 1em;
    padding: 8px 16px;
    /* 按钮的内边距 */
    border-radius: 20px;
    /* 圆角按钮设计 */
    transition: all 0.3s ease;
    /* 动画过渡效果 */
}

.header-button:hover {
    background-color: white;
    color: #409EFF;
    /* 悬停时背景色和文字色交换 */
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        height: auto;
        padding: 10px 20px;
    }

    .header-title {
        margin-bottom: 10px;
    }
}

.main-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;
    background-color: #f9fafc;
    min-height: 100vh;
    /* 确保高度至少等于视窗高度 */
    box-sizing: border-box;
    /* 确保 padding 不影响高度计算 */
    align-items: flex-start;
    /* 确保卡片按内容自适应高度 */
}

.box-card {
    width: 300px;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    /* 确保卡片高度不被拉长 */
    flex-grow: 0;
    flex-shrink: 0;
}

.box-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.class-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
}

.card-header {
    padding: 10px;
    font-size: 1.25em;
    font-weight: bold;
    text-align: center;
    background-color: #fafafa;
    border-bottom: 1px solid #ebebeb;
}

.card-body {
    padding: 15px;
    font-size: 0.9em;
}

.card-body p {
    margin: 8px 0;
}

.card-footer {
    display: flex;
    justify-content: space-between;
}

.el-tag {
    margin-top: 10px;
}

.exit-button {
    margin-top: 10px;
}
</style>