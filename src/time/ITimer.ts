export interface ITimer {
    setContext?(key: any, value?: any): any;

    log(action: string, duration: number, ...args: any[]): void;
    log(data: { [key: string]: any }): void;

    time(action: string, ...args: any[]): void;
    timeEnd(action: string, ...args: any[]): void;

    /**
     * 开始计时
     * @param action
     * @returns id
     */
    start?(action: string, ...args: any): number;
    end?(id: number, ...args: any): boolean;
    remove?(id: any): boolean;
}

