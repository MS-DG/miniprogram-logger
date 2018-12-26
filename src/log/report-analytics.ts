import { ILogger, LogLevel, isLogLevel } from "./ILogger";
import { utils } from "../common/utils";
import { Reporter, Dictionary } from "../common/reporter";

export interface LogObject extends Dictionary {
    level: LogLevel;
    action?: string;
    content?: any;
    id?: string;
    record_time?: number;
}

const fileds = ['level', 'action', 'content']

export type LogValues = [LogLevel, string, any]

/**
 * 默认Log对象转换函数
 * 字段中注入`id`和`record_time`
 * @param data LogObject
 */
export function LogTransformFunction<T extends LogObject =LogObject>(data: T): Dictionary {
    if (typeof data === "object") {
        data.id = utils.guid();
        data.record_time = Date.now();
    }
    return data;
}
/**
 * 微信上报API
 */
export class ReportAnalytics<T extends LogObject, TValues extends T[keyof T][]=LogValues>
    extends Reporter<T, TValues>
    implements ILogger {

    /**
     * 记录日志级别
     */
    public logLevels: LogLevel[] = ['warn', 'error'];

    /**
     * @example
     * ```
     *  new ReportAnalytics<LogObject,[LogLevel,string,any]>('log',['id', 'record_time', 'level', 'action', 'content'])
     * ```
     * @param tableName - 上报的表名
     * @param fields - 字段列表,参数表对应,前三个分别是id,record_time,level对应的字段名称
     * @param context - 上下文
     */
    constructor(tableName: string, fields: string[] = fileds, context: Partial<T> = {}) {
        super(tableName, fields, context);
        this.TransformFunction = LogTransformFunction;
    }

    /**
     * 上报调试信息
     * @param action - 操作
     * @param content - 内容
     */
    public debug(action: TValues[1], content?: TValues[2], ...args: RemoveFirst3<TValues>): void;
    public debug(context: T): void;
    public debug(): void {
        this.logByLevel('debug', arguments);
    }

    /**
    * 上报信息
    * @param action - 操作
    * @param content - 内容
    */
    public info(action: TValues[1], content?: TValues[2], ...args: RemoveFirst3<TValues>): void;
    public info(context: T): void;
    public info(): void {
        this.logByLevel('info', arguments);
    }

    /**
    * 上报警告信息
    * @param action - 操作
    * @param content - 内容
    */
    public warn(action: TValues[1], content?: TValues[2], ...args: RemoveFirst3<TValues>): void;
    public warn(context: T): void;
    public warn(): void {
        this.logByLevel('warn', arguments);
    }

    /**
    * 上报错误信息
    * @param action - 操作
    * @param content - 内容
    */
    public error(action: TValues[1], content?: TValues[2], ...args: RemoveFirst3<TValues>): void;
    public error(context: T): void;
    public error(): void {
        this.logByLevel('error', arguments);
    }

    public log(level: TValues[0], action: TValues[1], content?: TValues[2], ...args: RemoveFirst3<TValues>): void;
    public log(context: Partial<T>): void;
    public log(): void {
        //@ts-ignore
        this.report.apply(this, arguments);
    }

    private logByLevel(level: TValues[0], args: IArguments) {
        if (args.length === 1 && typeof arguments[0] === 'object') {
            const context: T = arguments[0];
            context.level = level;
            return this.report(context);
        } else {
            const arg = Array.from(args);
            arg.unshift(level);
            // @ts-ignore
            return this.report.apply(this, arg);
        }
    }
}
// type RemoveFirst<T extends any[]> = ((...args: T) => void) extends ((a: any, ...rest: infer Rest) => void) ? Rest : never;
// type RemoveFisrt2<T extends any[]> = ((...args: T) => void) extends ((a: any, b: any, ...rest: infer Rest) => void) ? Rest : never;
type RemoveFirst3<T extends any[]> = ((...args: T) => void) extends ((a: any, b: any, c: any, ...rest: infer Rest) => void) ? Rest : never;
