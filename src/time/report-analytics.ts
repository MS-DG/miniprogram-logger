/// <reference lib="es2015"/>
import { ITimer } from "./ITimer";
import { Reporter, Dictionary } from "../common/reporter";
import { guid } from "../common/guid";

export interface PerformanceObject extends Dictionary {
    /** id */
    id?: string;
    /** 操作 */
    action?: string;
    /** 时间 */
    time?: number;
}

/**
 * 默认Performance日志对象转换函数
 * 字段中注入`id`和`record_time`
 * @param data PerformanceObject
 */
export function PerformanceTransformFunction<T extends PerformanceObject = PerformanceObject>(data: T): Dictionary {
    if (typeof data === "object") {
        data.id = data.id || guid();
        data.record_time = data.record_time || Date.now();
    }
    return data;
}

export class ReportAnalytics<
    T extends PerformanceObject,
    TValues extends T[keyof T][],
    TKeys extends (keyof T)[] = (keyof T)[]
> extends Reporter<T, TValues, TKeys> implements ITimer {
    private Id = 0;
    private readonly Stopwatch = new Map<number | string, [number, Partial<T>]>();

    constructor(tableName: string, fields?: TKeys, context?: Partial<T>) {
        super(tableName, fields || (["action", "time"] as TKeys), context);
        this.TransformFunction = PerformanceTransformFunction;
    }

    /**
     * 快速记录性能日志
     * @param action 操作,
     * @param time 耗时单位毫秒
     * @param context 其它数据
     */
    public log(action: string, time: number, ...args: RemoveFisrt2<TValues>): void;
    /**
     * 快速记录性能日志
     * @param data PerformanceParam
     */
    public log(data: T): void;
    public log(): void {
        //@ts-ignore
        this.report.apply(this, arguments);
    }

    /**
     *
     * @param label - 唯一标签,结束时使用同样标签,
     * @param context - 记录上下文信息，如果未设置action则使用label作为action
     */
    public time(label: string, context?: Partial<T>): void {
        this.Stopwatch.set(label, [Date.now(), Object.assign({ [this.Fields[0]]: arguments[0] }, context)]);
    }
    /**
     *
     * @param label - 唯一标签,与开始对应
     * @param context - 记录上下文信息，如果未设置action则使用label作为action
     */
    public timeEnd(label: string, context?: Partial<T>): void {
        if (!this.end(label as any, context)) {
            console.error("timer label not found", label);
        }
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
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            //对象参数
            this.Stopwatch.set(this.Id, [Date.now(), arguments[0]]);
        } else {
            //多参数
            this.Stopwatch.set(this.Id, [
                Date.now(),
                Object.assign(arguments[1] || {}, { [this.Fields[0]]: arguments[0] }),
            ]);
        }
        return this.Id++;
    }

    /**
     * 完成计时，并清除计时ID
     * @param id
     * @param context
     */
    public end(id: number, context?: Partial<T>): boolean {
        const info = this.Stopwatch.get(id);
        if (!info) {
            return false;
        }

        const [start, data] = info;
        Object.assign(data, context, { [this.Fields[1]]: Date.now() - start });
        this.report(data as T);
        return this.remove(id);
    }

    /**
     * 清除计时
     * @param id
     * @returns 不存在返回false
     */
    public remove(id: number | string): boolean {
        return this.Stopwatch.delete(id);
    }
}

type RemoveFisrt2<T extends any[]> = ((...args: T) => void) extends ((a: any, b: any, ...rest: infer Rest) => void)
    ? Rest
    : never;
