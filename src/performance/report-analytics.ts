/// <reference lib="es2015"/>
import { IPerformance } from "./IPerformance";
import { Reporter } from "../common/reporter";

export interface Dictionary {
    [key: string]: string | number | undefined
};

// export interface PerformanceParam {
//     [key: string]: any;
//     action: string;
//     time: number
//     correlation_id?: string;
//     user?: any
//     param?: any;
//     extension?: any;
//     record_time?: Date;
// }

// export type TransformFunction = (data: PerformanceParam) => { [key: string]: string | number | undefined };

// function defaultTransform(data: PerformanceParam): { [key: string]: string | number | undefined } {
//     data.id = utils.guid();
//     data.user = utils.stringify(data.user);
//     data.param = utils.stringify(data.param);
//     data.extension = utils.stringify(data.extension);
//     data.record_time = <any>data.record_time!.getTime();
//     return data;
// }

// {
//     /**
//      * 客户端信息
//      */
//     public User?: any;
//     /**
//      * 额外数据
//      */
//     public Extension?: any;
//     /**
//      * 关联ID
//      */
//     public CorrelationId?: string;
// }

interface PerformanceParam extends Dictionary {
    /** 操作 */
    action?: string,
    /** 时间 */
    time?: number,
}

export class ReportAnalytics<
    T extends PerformanceParam,
    TValues extends T[keyof T][],
    TKeys extends (keyof T)[]= (keyof T)[]>
    extends Reporter<T, TValues, TKeys>
    implements IPerformance {

    private Id = 0;
    private readonly Stopwatch = new Map<number, [Date, Partial<T>]>();

    constructor(tableName: string, fields?: TKeys, context?: Partial<T>) {
        super(tableName, fields || ['action', 'time'] as TKeys, context);
    }

    /**
     * 快速记录性能日志
     * @param action 操作,
     * @param time 耗时单位毫秒
     * @param context 其它数据
     */
    public log(action: string, time: number, context?: any): void;
    /**
     * 快速记录性能日志
     * @param data PerformanceParam
     */
    public log(data: T): void;
    public log(): void {
        if (arguments.length === 0) {
            console.error('WxMpPerformance.log need 1 or more parameters');
            return;
        }
        // 单参数object
        // 或者多参数，安参数表赋值
        const data: T = (arguments.length === 1) ? arguments[0] : {
            [this.Fields[0]]: arguments[0],
            [this.Fields[1]]: arguments[1]
        }
        this.report(Object.assign(data, arguments[2]));
    }


    /**
     * 开始计时
     * @param action 
     * @param context 
     * @returns 返回计时ID
     */
    public start(action: string, context?: Partial<T>): number;
    public start(data: T): number;
    public start(): number {
        if ((arguments.length === 1) && typeof arguments[0] === "object") {
            //对象参数
            this.Stopwatch.set(this.Id, [new Date, arguments[0]]);
        } else {
            //多参数
            this.Stopwatch.set(this.Id, [new Date, Object.assign(arguments[1] || {}, { [this.Fields[0]]: arguments[0] })]);
        }
        return this.Id++;
    }

    /**
     * 完成计时，并清除计时ID
     * @param id 
     * @param context 
     */
    public stop(id: number, context?: Partial<T>): boolean {
        const info = this.Stopwatch.get(id);
        if (!info) {
            return false;
        }

        const [start, data] = info;
        Object.assign(data, context, { [this.Fields[1]]: (new Date as any) - (start as any) })
        this.report(data as T);
        return this.clear(id);
    }

    /**
     * 清除计时
     * @param id
     * @returns 不存在返回false 
     */
    public clear(id: number): boolean {
        return this.Stopwatch.delete(id);
    }
}