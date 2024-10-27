import { ref } from "vue";
import type { ianswer, itask } from "./interfaceType/taskInterface";
import type { result } from "./interfaceType/commonInterface";
import { editTaskApi, getAnswerByIdApi, getTaskByClassIdApi, getTaskByIdApi, submitTaskApi } from "@/apis/taskApi";
import { ElMessage } from "element-plus";


// 班级作业列表
const tasks = ref<itask[]>([])

// 作业详细信息
const task = ref<itask>({
    id: 0,
    title: '',
    desc: '',
    due_date: new Date('2024-02-13'),
    allow_late_submission: true,
    submission_format: '',
    images: JSON.parse('[]'), 
    submitted: false,
    score: null,
    feedback: ''
})

// 作答信息
const answer = ref<ianswer>({
    title: '',
    desc: '',
    images: JSON.parse('[]'),
})

// 根据班级ID请求班级作业
const getTaskByClassId = async (classId: number) => {
    const res: result = await getTaskByClassIdApi(classId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    tasks.value = res.data;
}

// 根据作业ID请求作业信息
const getTaskById = async (taskId: number) => {
    const res: result = await getTaskByIdApi(taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    task.value = res.data;
}

// 根据作业ID请求作业作答信息
const getAnswerById = async (taskId: number) => {
    const res: result = await getAnswerByIdApi(taskId);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    answer.value = res.data;
}

// 提交作业
const submitTask = async (taskId: number, answer: ianswer): Promise<number> => {
    const res: result = await submitTaskApi(taskId, answer);

    if (res.code === 1) {
        ElMessage.success("提交成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

// 修改作业
const editTask = async (taskId: number, answer: ianswer): Promise<number> => {
    const res: result = await editTaskApi(taskId, answer);

    if (res.code === 1) {
        ElMessage.success("修改成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res.code;
}

export default function () {
    return {
        tasks,
        getTaskByClassId,
        submitTask,
        task,
        getTaskById,
        answer,
        getAnswerById,
        editTask
    }
}