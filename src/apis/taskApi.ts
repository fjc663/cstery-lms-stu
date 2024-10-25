import type { ianswer } from "@/composables/interfaceType/taskInterface";
import http from "@/utils/http";


// 根据班级ID请求作业信息
export function getTaskByClassIdApi(classId: number): any {
    return http({
        url: `/student/task/class/${classId}`
    })
}

// 根据作业ID请求作业信息
export function getTaskByIdApi(taskId: number):any {
    return http({
        url: `/student/task/${taskId}`
    })
}

// 根据作业ID和学生ID请求作答信息
export function getAnswerByIdApi(taskId: number):any {
    return http({
        url: `/student/task/answer/${taskId}`
    })
}

// 提交作业
export function submitTaskApi(taskId: number, task: ianswer): any {
    return http({
        url: `/student/task/${taskId}`,
        method: 'Post',
        data: task
    })
}

// 修改作业
export function editTaskApi(taskId: number, task: ianswer): any {
    return http({
        url: `/student/task/${taskId}`,
        method: 'Put',
        data: task
    })
}
