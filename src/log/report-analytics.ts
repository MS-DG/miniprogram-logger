import { ILogger, LogLevel } from "./ILogger";
import { Reporter, logTransformFunction, BasicLogObject } from "../common/reporter";

export interface LogObject extends BasicLogObject {
    /** 
     * 日志级别
     */
    level?: LogLevel;
    /** 
     * 操作
     */
    action?: string;
    /** 
     * 内容
     */
    content?: any;
}

const fileds = ['level', 'action', 'content']

export type LogValues = [LogLevel, string, any]

/**
 * 微信上报API
 */
export class ReportAnalytics<T extends LogObject, TValues extends T[keyof T][] = LogValues>
    extends Reporter<T, TValues>
    implements ILogger {

    /**
     * 记录日志级别
     */
    public logLevels: LogLevel[] = ['warn', 'error'];

    /**
     * @example
     * ```
     *  new ReportAnalytics<LogObject,[LogLevel,string,any]>('logger',['level', 'action', 'content'])
     * ```
     * @param tableName - 上报的表名
     * @param fields - 字段列表,参数表对应,前三个分别是id,record_time,level对应的字段名称
     * @param context - 上下文
     */
    constructor(tableName: string, fields: string[] = fileds, context: Partial<T> = {}) {
        super(tableName, fields, context);
        this.TransformFunction = logTransformFunction;
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
        this.report.apply(this, arguments as any);
    }

    private logByLevel(level: TValues[0], args: IArguments) {
        if (args.length === 1 && typeof arguments[0] === 'object') {
            const context: T = arguments[0];
            context.level = level;
            return this.report(context);
        } else {
            Array.prototype.unshift.call(args, level);
            return this.report.apply(this, args as any);
        }
    }
}
// type RemoveFirst<T extends any[]> = ((...args: T) => void) extends ((a: any, ...rest: infer Rest) => void) ? Rest : never;
// type RemoveFisrt2<T extends any[]> = ((...args: T) => void) extends ((a: any, b: any, ...rest: infer Rest) => void) ? Rest : never;
type RemoveFirst3<T extends any[]> = ((...args: T) => void) extends ((a: any, b: any, c: any, ...rest: infer Rest) => void) ? Rest : never;
