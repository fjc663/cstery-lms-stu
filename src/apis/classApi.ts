import http from "@/utils/http";

// 查询已加入的班级
export function getClassApi(): any {
    return http({
        url: '/student/class'
    })
}

// 根据邀请码查询班级信息
export function getClassByCodeApi(class_code: string): any {
    return http({
        url: '/student/class/code',
        params: {class_code: class_code}
    })
}

// 根据邀请码加入班级
export function joinClassApi(class_code: string): any {
    return http({
        url: '/student/class/join',
        method: 'Post',
        params: {class_code: class_code}
    })
}

// 根据邀请码退出班级
export function exitClassApi(class_code: string): any {
    return http({
        url: '/student/class/exit',
        method: 'Post',
        params: {class_code: class_code}
    })
}

// 根据班级ID请求班级详细信息
export function getClassByIdApi(class_id: number): any {
    return http({
        url: `student/class/${class_id}`
    })
}