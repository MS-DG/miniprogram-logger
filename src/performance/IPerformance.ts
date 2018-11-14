export interface IPerformance {
    TableName:string;
    CorrelationId: string;
    Extension: any;
    transform: Function;
    log(action: string, duration: number, param?: any, data?:any);
    
    /**
     * 开始计时
     * @param action
     * @param param
     * @returns id
     */
    start(action: string, param?: any): number;
    stop(id:number,data?:any);
    clear(id:number);
}