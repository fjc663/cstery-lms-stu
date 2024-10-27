import http from '@/utils/http'
import type { ieditPassword, ilogin, iregister } from '@/composables/interfaceType/userInterface'
import type { istudentInfo } from '@/composables/interfaceType/userInterface'


// 用户注册
export function userRegisterAPI(data: iregister): any {
    return http({
        url: '/student/user/register',
        method: 'Post',
        data: data
    })
}

// 用户登录
export function userLoginAPI(data: ilogin): any {
    return http({
        url: '/student/user/login',
        method: 'Post',
        data: data
    })
}

// 获得用户信息
export function getUserInfoAPI(): any {
    return http({
        url: '/student/user'
    })
}

// 修改用户信息
export function updateUserInfoAPI(data: istudentInfo): any {
    return http({
        url: '/student/user',
        method: 'Put',
        data: data
    })
}

// 修改密码
export function editPasswordAPI(data: ieditPassword): any {
    return http({
        url: '/student/user/editPassword',
        method: 'Put',
        data: data
    })
}
