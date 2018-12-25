export interface IPerformance {

    log(action: string, duration: number, ...args: any[]): void;
    log(data: { [key: string]: any }): void;

    /**
     * 开始计时
     * @param action
     * @param param
     * @returns id
     */
    start(action: string, ...args: any): number;
    stop(id: number, ...args: any): boolean;
    clear(id: number): boolean;
}

