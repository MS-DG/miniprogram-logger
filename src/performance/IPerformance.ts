export interface IPerformance {
    TableName: string;
    CorrelationId?: string;
    Extension?: any;

    Transform: TransformFunction;
    log(action: string, duration: number, parameter?: any): void;
    log(data: PerformanceParam): void;


    /**
     * 开始计时
     * @param action
     * @param param
     * @returns id
     */
    start(action: string, param?: any): number;
    start(data: PerformanceParam): number;
    stop(id: number, extension?: any): boolean;
    clear(id:number):boolean;
}

export interface PerformanceParam {
    [key: string]: any;
    action: string;
    time: number
    correlation_id?: string;
    user?: any
    param?: any;
    extension?: any;
    record_time?: Date;
}

export type TransformFunction = (data: PerformanceParam) => { [key: string]: string | number | undefined };