// 作业信息展示接口
export interface itask {
    id: number,
    title: string,
    desc: string,
    due_date: Date,
    allow_late_submission: boolean,
    submission_format: string,
    images: JSON,
    submitted: boolean
}

// 作业作答信息接口
export interface ianswer {
    id?: number,
    title: string,
    desc: string,
    images: JSON,
    created_at?: Date,
    updated_at?: Date
}