import router from '@/router';
import { ElMessage } from 'element-plus';

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


export default function () {
    return {
        copyToClipboard,
        formatDate,
        formattedDateTime,
        goBack,
        isDueDateLaterThanNow
    }
}