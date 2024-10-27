import http from "@/utils/http";

// 上传头像图片
export function uploadAvatarAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/student/avatar',
        method: 'Post',
        data: data
    })
}

// 上传作业作答图片
export function uploadAnswerAPI(data: FormData): any {
    return http({
        headers: {"Content-Type": "multipart/form-data"},
        url: '/upload/student/answer',
        method: 'Post',
        data: data
    })
}

