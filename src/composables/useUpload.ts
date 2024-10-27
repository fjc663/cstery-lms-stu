import { uploadAvatarAPI, uploadAnswerAPI } from "@/apis/uploadApi";
import type { result } from "./interfaceType/commonInterface";
import { ElMessage } from "element-plus";


// 上传头像
const uploadAvatar = async (formData: FormData): Promise<result> => {
    const res: result = await uploadAvatarAPI(formData);

    if (res.code === 1) {
        ElMessage.success("修改成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res;
}

// 上传作答图片
const uploadAnswer = async (formData: FormData): Promise<result> => {
    const res: result = await uploadAnswerAPI(formData);

    if (res.code === 1) {
        ElMessage.success("上传成功");
    } else {
        ElMessage.error(res.msg);
    }

    return res;
}

export default function() {
    return {
        uploadAvatar,
        uploadAnswer
    }
}