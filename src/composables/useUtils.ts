import router from '@/router';
import { ElMessage, type UploadProps } from 'element-plus';

// 复制到剪贴板的函数
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        ElMessage.success('复制成功');
    } catch {
        ElMessage.error("复制失败");
    }
};

// 日期格式化函数
const formatDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-'); // 将默认的'/'替换为'-'

    return `${formattedDate} 23:59:59`; // 添加时间
};

// 格式化为更易读的格式，例如：YYYY-MM-DD HH:mm:ss
const formattedDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).replace(/\//g, '-');
}

// 判断是否到截止时间
const isDueDateLaterThanNow = (dueDate: Date) => {
    if (!dueDate) {
        return '';
    }

    // 如果 `birthday` 是字符串，则尝试转换为 `Date`
    const dateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (isNaN(dateObj.getTime())) { // 确保转换成功
        return '';
    }

    // 创建一个新的日期对象，设置为 due_date 的日期
    const dueDateWithTime = new Date(dueDate);
    dueDateWithTime.setHours(23, 59, 59, 999); // 设置时间为 23:59:59

    // 获取当前时间
    const now = new Date();

    // 比较 dueDateWithTime 和当前时间
    return dueDateWithTime > now; // 返回布尔值
};

// 返回上次路由
const goBack = () => {
    router.back();
}

// 上传图片前的钩子函数
const beforeUpload: UploadProps['beforeUpload'] = (file: File) => {
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

// 根据出生日期计算年龄
const calculateAge = (birthday: Date | string | null): string | number => {
    if (!birthday) {
        return '';
    }

    // 如果 `birthday` 是字符串，则尝试转换为 `Date`
    const dateObj = birthday instanceof Date ? birthday : new Date(birthday);
    if (isNaN(dateObj.getTime())) { // 确保转换成功
        return '';
    }

    const ageDifMs: number = Date.now() - dateObj.getTime();
    const ageDate: Date = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};


export default function () {
    return {
        copyToClipboard,
        formatDate,
        formattedDateTime,
        goBack,
        isDueDateLaterThanNow,
        beforeUpload,
        handleExceed,
        calculateAge
    }
}