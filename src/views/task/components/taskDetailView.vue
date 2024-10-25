<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import useTask from '@/composables/useTask';
import { useRoute } from 'vue-router';
import useUtils from '@/composables/useUtils';
import type { UploadProps, UploadUserFile } from 'element-plus'
import useUpload from '@/composables/useUpload';
import type { result } from '@/composables/interfaceType/commonInterface';
import useDelete from '@/composables/useDelete';


// 作业相关处理逻辑
const { task, getTaskById, answer, getAnswerById, submitTask, editTask } = useTask();

// 文件上传处理逻辑
const { uploadTask } = useUpload();
// 文件删除处理逻辑
const { deleteTask } = useDelete();

// 日期格式化函数
const { formatDate, formattedDateTime, goBack, isDueDateLaterThanNow } = useUtils();

// 从路由获得作业ID
const route = useRoute();
const taskId = Number(route.params.id);

// 作业作答图片URL列表
const fileList = ref<UploadUserFile[]>([]);

// 作业删除列表
const filenames = ref<string[]>([]);

// 预览URL和弹窗显示
const dialogImageUrl = ref<string>('');
const dialogVisible = ref<boolean>(false);

// 上传班级图片
const onUploadTask = async (task: any) => {
    // 设置表单数据
    const formData = new FormData();
    formData.append('task_image_file', task.file);

    // 上传
    const res: result = await uploadTask(formData);

    if (res.code === 1) {

        // 查找在 fileList 中对应的文件索引
        const fileIndex = fileList.value.findIndex(item => item.uid === task.file.uid);

        if (fileIndex !== -1) {
            // 更新对应文件的信息
            fileList.value[fileIndex] = {
                ...fileList.value[fileIndex],
                name: res.data.split('/').pop(), // 更新文件名
                url: res.data, // 上传成功后的图片 URL
                status: 'success' // 更新状态
            };
        }

    }
};

// 移除图片
const handleRemove: UploadProps['onRemove'] = (file: any, files: any[]) => {
    filenames.value.push(file.name);
    fileList.value = files;
    ElMessage.success('移除成功');
};

// 预览图片
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
}

// 上传班级图片前的钩子函数
const beforeTaskUpload: UploadProps['beforeUpload'] = (file: File) => {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt10M = file.size / 1024 / 1024 < 10;

    if (!isJPGorPNG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!');
        return false;
    }

    if (!isLt10M) {
        ElMessage.error('上传图片大小不能超过 10MB!');
        return false;
    }

    return true;
};

// 处理上传图片超出限制的情况
const handleExceed = () => {
    ElMessage.warning('最多只能上传10张图片');
};

// 提交作业
const submitAssignment = async () => {
    if (answer.value.title.length === 0) {
        ElMessage.error('请填写标题');
        return;
    }

    if (task.value.submission_format === 'text' && answer.value.desc.length === 0 && fileList.value.length === 0) {
        ElMessage.error('请填写答案后提交');
        return;
    }
    if (task.value.submission_format === 'img' && fileList.value.length === 0) {
        ElMessage.error('请上传至少一张图片后提交');
        return;
    }

    // 转化作业图片列表为JSON
    answer.value.images = JSON.parse(JSON.stringify(fileList.value.map(v => v.url)));

    let code: number = 0;
    // 提交
    if (task.value.submitted) {
        code = await editTask(taskId, answer.value);
    } else {
        code = await submitTask(taskId, answer.value);
    }

    // 删除上传但移除的图片
    deleteTask(filenames.value)

    if (code === 1) {
        // 提交后刷新页面
        getTaskById(taskId);
        getAnswerById(taskId);
    }

};

// 页面初始化
onMounted(async () => {

    // 初始化作业信息
    await getTaskById(taskId);

    // 如果有提交过，初始化作答信息
    if (task.value.submitted) {
        await getAnswerById(taskId);

        // 如果有提交图片，展示作答图片
        if (Array.isArray(answer.value.images)) {
            fileList.value = answer.value.images.map((url: string) => ({
                name: url.split('/').pop() || '',
                url: url,
            }));
        }
    } else {
        answer.value = {
            title: '',
            desc: '',
            images: JSON.parse('[]')
        }
    }
})
</script>

<template>
    <div class="assignment-submit-page">
        <el-page-header @back="goBack" />

        <!-- 作业详细信息部分 -->
        <div class="assignment-details">
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
                <strong>提交格式：</strong>
                {{ task.submission_format === 'img' ? '必须提交图片' : '任意格式' }}
            </p>

            <p v-if="task.submitted && answer.created_at" class="task-create-date"><strong>第一次提交时间：</strong>{{
                formattedDateTime(answer.created_at) }}</p>
            <p v-if="task.submitted && answer.updated_at" class="task-update-date"><strong>最后一次提交时间：</strong>{{
                formattedDateTime(answer.updated_at) }}</p>

            <!-- 展示多张图片 -->
            <div v-if="task.images && Array.isArray(task.images)" class="image-gallery">
                <el-image v-for="(image, index) in task.images" :key="index" :src="image" alt="作业图片" fit="cover"
                    :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="task.images"
                    :initial-index="index" class="task-image" />
            </div>
        </div>

        <!-- 答题提交区域 -->
        <div class="submission-area">
            <h2>答题区域</h2>
            <el-form :model="answer" label-width="120px" class="submission-form">
                <!-- 作答标题 -->
                <el-form-item label="作答标题" prop="title" :rules="[{ required: true, message: '作答标题不能为空', trigger: 'change' },
                { min: 1, max: 100, message: '作答标题长度应为 1 到 100 个字符', trigger: 'blur' }]">
                    <el-input :disabled="!(task.allow_late_submission || isDueDateLaterThanNow(task.due_date))"
                        v-model="answer.title" placeholder="请输入作答标题" />
                </el-form-item>

                <!-- 根据提交格式选择答案内容 -->
                <el-form-item label="答案内容" prop="desc">
                    <el-input :disabled="!(task.allow_late_submission || isDueDateLaterThanNow(task.due_date))"
                        type="textarea" v-model="answer.desc" placeholder="请输入答案" :rows="10" />
                </el-form-item>

                <el-form-item label="上传图片"
                    :rules="task.submission_format === 'img' ? [{ required: true, message: '请上传图片', trigger: 'change' }] : []">

                    <el-upload :disabled="!(task.allow_late_submission || isDueDateLaterThanNow(task.due_date))"
                        class="upload-demo" drag multiple :limit="10" v-model:file-list="fileList"
                        :on-exceed="handleExceed" list-type="picture-card" :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove" :http-request="onUploadTask" :before-upload="beforeTaskUpload">
                        <div class="el-upload__text">拖动图片到此处，或 <em>点击上传</em></div>
                        <template v-slot:tip>
                            <div class="el-upload__tip">最多上传10张小于10MB，格式为JPG/PNG的图片。</div>
                        </template>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                        <div class="image-container">
                            <img class="preview-image" :src="dialogImageUrl" alt="Preview Image" />
                        </div>
                    </el-dialog>
                </el-form-item>

                <!-- 提交按钮 -->
                <el-form-item>
                    <el-button v-if="task.allow_late_submission || isDueDateLaterThanNow(task.due_date)"
                        class="submit-button" type="primary" @click="submitAssignment">{{
                            task.submitted ? '保存修改'
                                : '提交作业'
                        }}</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<style scoped>
.assignment-submit-page {
    padding: 20px;
}

.assignment-details {
    margin-top: 15px;
    background-color: #f9fafc;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
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
.task-submission-format,
.task-update-date,
.task-create-date {
    font-size: 1em;
    /* 统一字体大小 */
    margin: 8px 0;
    /* 上下间距 */
    color: #555;
    /* 较浅的字体颜色 */
}

.task-create-date {
    color: #2d21d1;
}

.task-update-date {
    color: #0674bd;
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

.submission-area {
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-upload__text em {
    color: #409EFF;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    /* 保持容器的宽度限制 */
}

.preview-image {
    max-width: 100%;
    /* 图片宽度最大为容器的宽度 */
    max-height: 80vh;
    /* 高度最大为视窗的 80%，确保不会超出可视区域 */
    object-fit: contain;
    /* 确保图片不会被拉伸或裁剪 */
}

.submit-button {
    margin: 0 auto;
}

.submission-form {
    max-width: 600px;
    margin: auto;
}
</style>