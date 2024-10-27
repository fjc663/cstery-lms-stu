import type { result } from "./interfaceType/commonInterface";
import { ElMessage } from "element-plus";
import { deleteAnswerAPI } from "@/apis/deleteApi";

// 删除作答图片
const deleteAnswer = async (filenames: string[]) => {
    const res: result = await deleteAnswerAPI(filenames);

    if (res.code === 0) {
        ElMessage.error(res.msg);
    }

}

export default function() {
    return {
        deleteAnswer
    }
}