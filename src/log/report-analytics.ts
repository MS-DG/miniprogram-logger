import { ILogger, LogLevel } from "./ILogger";
import { utils } from "../common/utils";

type RemoveFirst<T extends any[]> = ((...args: T) => void) extends ((a: any, ...rest: infer Rest) => void) ? Rest : never;


export interface Dictionary {
    [key: string]: string | number | undefined
};

/**
 * 微信上报API
 */
export class ReportAnalytics<T extends Dictionary> implements ILogger {

    /**
     * 记录日志级别
     */
    public logLevels: LogLevel[] = ['warn', 'error'];

    /**
     * 存储的表名
     */
    public readonly TableName: string;

    /**
     * Id键值，空则不记录ID
     */
    public readonly KeyId: string;

    /**
     * 时间戳键值
     */
    public readonly KeyTimeStamp: string;

    /**
     * 每次记录的上下文信息
     */
    public Context: T;

    constructor(tableName: string, keyId: string = 'id', keyTimeStamp: string = 'timestamp', context?: T) {
        this.TableName = tableName;
        this.KeyId = keyId;
        this.KeyTimeStamp = keyTimeStamp;
        this.Context = context || {} as T;
    }

    /**
     * 设置上下文键值
     * @param key - 键
     * @param value - 值
     */
    public setContext(key: string, value: any): this;
    /**
     * 设置Context
     * @param context 
     */
    public setContext(context: Partial<T>): this;
    public setContext(): this {
        if (arguments.length == 1) {
            Object.assign(this.Context, arguments[0]);
        } else if (arguments[1] === undefined) {
            delete this.Context[arguments[0]]
        } else {
            this.Context[arguments[0]] = arguments[1];
        }
        return this;
    }

    /**
     * 上报调试信息
     * @param action 
     * @param content 
     * @param context 
     */
    public debug(action: string, content: string, context?: Partial<T>): void {
        this.log("debug", action, content, context);
    }
    /**
     * 上报信息
     * @param action 
     * @param content 
     * @param context 
     */
    public info(action: string, content: string, context?: Partial<T>): void {
        this.log("info", action, content, context);
    }
    /**
     * 上报警告信息
     * @param action 
     * @param content 
     * @param context 
     */
    public warn(action: string, content: string, context?: Partial<T>): void {
        this.log("warn", action, content, context);
    }
    /**
     * 上报错误信息
     * @param action 
     * @param content 
     * @param context 
     */
    public error(action: string, content: string, context?: Partial<T>): void {
        this.log("error", action, content, context);
    }

    public log(level: LogLevel, action: string, content: string, context?: Partial<T>): void {
        //过滤日志
        if (this.logLevels.indexOf(level) === -1) return;

        const data: Dictionary = Object.assign({}, this.Context, context, {
            level: level,
            action: action,
            content: content,
        });
        //stringify
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = utils.stringify(data[key]);
            }
        }
        if (this.KeyId) {
            data[this.KeyId] = utils.guid();
        }
        if (this.KeyTimeStamp) {
            data[this.KeyTimeStamp] = new Date().toUTCString();
        }
        // report
        wx.reportAnalytics(this.TableName, data);
    }

}

declare var wx: {
    reportAnalytics: Function;
}