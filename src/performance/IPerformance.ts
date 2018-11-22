export interface IPerformance {
    TableName: string;
    CorrelationId?: string;
    Extension?: any;
    log(action: string, duration: number, parameter?: any): void;

    /**
     * 开始计时
     * @param action
     * @param param
     * @returns id
     */
    start(action: string, param?: any): number;
    // stop(id:number,data?:any);
    // clear(id:number);
}

export interface PerformanceObject {
    id: string;
    record_time: number;
    correlation_id?: string;
    action: string;
    time: number;
    user?: string
    param?: string;
    extension?: string;
}