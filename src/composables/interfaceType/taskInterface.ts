// 作业信息展示接口
export interface itask {
    id: number,
    title: string,
    desc: string,
    due_date: Date | null,
    allow_late_submission: boolean,
    submission_format: string,
    images: JSON,
    submitted: boolean,
    score: number | null,
    feedback: string,
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

// 作业信息分页查询条件
export interface itaskPageQuery {
    page: number,
    pageSize: number,
    task_title?: string,
    class_name?: string,
    is_cut_off?: boolean | null
}

// 作业详细报告
export interface itaskReport {
    task_id: number,
    task_title: string,
    class_name: string,
    due_date: Date,
    score: number
}

// 作业图表报告数据
export interface iReportChart {
    completion_count: number,
    not_completion_count: number,
    score_list: number[]
}
