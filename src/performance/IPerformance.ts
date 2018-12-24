export interface IPerformance {

    log(action: string, duration: number, parameter?: any): void;
    // log(data: PerformanceParam): void;

    /**
     * 开始计时
     * @param action
     * @param param
     * @returns id
     */
    start(action: string, param?: any): number;
    // start(data: PerformanceParam): number;
    stop(id: number, extension?: any): boolean;
    clear(id: number): boolean;
}

