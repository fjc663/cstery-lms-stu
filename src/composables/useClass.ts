import { ref } from "vue";
import type { iclass } from "./interfaceType/classInterface";
import type { result } from "./interfaceType/commonInterface";
import { exitClassApi, getClassApi, getClassByCodeApi, getClassByIdApi, joinClassApi } from "@/apis/classApi";
import { ElMessage } from "element-plus";

// 已加入班级的数据列表
const classes = ref<iclass[]>([]);

// 一个班级详细数据
const clas = ref<iclass>({
    id: 0,
    class_name: '',
    class_code: '',
    teacher_name: '',
    desc: '',
    class_img: '',
    tasks: []
});

// 获得已加入班级
const getClasses = async () => {
    const res: result = await getClassApi();

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }

    classes.value = res.data;

}

// 根据邀请码查询班级
const getClassByCode = async (class_code: string): Promise<number> => {
    const res: result = await getClassByCodeApi(class_code);

    if (res.code === 1) {
        clas.value = res.data;
    }
    return res.code;
}

// 根据邀请码加入班级
const joinClass = async (class_code: string) => {
    const res: result = await joinClassApi(class_code);

    if (res.code === 1) {
        ElMessage.success('加入成功');
    } else {
        ElMessage.error(res.msg);
    }
}

// 根据邀请码退出班级
const exitClass = async (class_code: string) => {
    const res: result = await exitClassApi(class_code);

    if (res.code === 1) {
        ElMessage.success('退出成功');
    } else {
        ElMessage.error(res.msg);
    }
}

// 根据ID获得班级详细信息
const getClassById = async (class_id: number) => {

    const res: result = await getClassByIdApi(class_id);

    if (res.code === 0) {
        ElMessage.error(res.msg);
        return;
    }
    clas.value = res.data;

}

export default function () {
    return {
        classes,
        getClasses,
        clas,
        getClassByCode,
        joinClass,
        exitClass,
        getClassById
    }
}