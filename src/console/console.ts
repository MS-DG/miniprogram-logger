import { ICounter } from "../count/index";
import { ILogger, LogLevel } from "../log/index";
import { ITimer } from "../time/ITimer";
import { ITelemetry } from "../telemetry/index";
import { TelemetryObject } from "../telemetry/index";
import { PerformanceObject } from "../time/index";
import { LogObject } from "../log/index";

export type ConsoleLevel = LogLevel | "time" | "telemetry";

export class ConsoleManager<TLog = LogObject, TTime = PerformanceObject, TTelemetry = TelemetryObject> {
    public readonly Counters: ICounter[];

    public readonly Loggers: ILogger[];

    public readonly Timers: ITimer[];

    public readonly Telemetry: ITelemetry[] = [];

    constructor(c: Console) {
        this.Counters = c ? [c] : [];
        this.Loggers = c ? [c] : [];
        this.Timers = c ? [c] : [];
    }

    /**
     * 计数
     * @param label
     * @param value
     */
    count(label?: string, value?: number): void {
        if (this.Counters) {
            const args = arguments;
            this.Counters.forEach(v => v.count.apply(v, args as any));
        }
    }

    /**
     * 记录调试日志
     * @param action - 操作
     * @param content - 记录内容
     * @param correlationId - 关联ID
     * @param optionalParams - 其它参数
     */
    debug(action: string, content?: any, correlationId?: string, ...optionalParams: any[]): void;
    debug(data: TLog): void;
    debug() {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(v => v.debug.apply(v, args as any));
        }
    }

    /**
     * 记录日志信息
     * @param action - 操作
     * @param content - 记录内容
     * @param correlationId - 关联ID
     * @param optionalParams - 其它参数
     */
    info(action: string, content?: any, correlationId?: string, ...optionalParams: any[]): void;
    info(data: TLog): void;
    info(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(v => v.info.apply(v, args as any));
        }
    }

    /**
     * 记录警告日志
     * @param action - 操作
     * @param content - 记录内容
     * @param correlationId - 关联ID
     * @param optionalParams - 其它参数
     */
    warn(action: string, content?: any, correlationId?: string, ...optionalParams: any[]): void;
    warn(data: TLog): void;
    warn(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(v => v.warn.apply(v, args as any));
        }
    }
    /**
     * 记录错误日志
     * @param action - 操作
     * @param content - 记录内容
     * @param correlationId - 关联ID
     * @param optionalParams - 其它参数
     */
    error(action: string, content?: any, correlationId?: string, ...optionalParams: any[]): void;
    error(data: TLog): void;
    error(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(v => v.error.apply(v, args as any));
        }
    }

    /**
     *
     * @param level 日志级别
     * @param action 日志操作
     * @param content 内容
     * @param correlationId 关联ID
     * @param optionalParams ... 其它参数
     */
    log(level: ConsoleLevel, action: string, content?: any, correlationId?: string, ...optionalParams: any[]): void {
        const args = arguments;
        if (level === "time") {
            if (this.Timers) {
                this.Timers.forEach(v => v.log.apply(v, Array.prototype.slice.call(args, 1) as any));
            }
        } else if (level === "telemetry") {
            if (this.Telemetry) {
                this.Telemetry.forEach(v => v.record.apply(v, Array.prototype.slice.call(args, 1) as any));
            }
        } else if (this.Loggers) {
            this.Loggers.forEach(v => v.log.apply(v, args as any));
        }
    }

    /**
     * 记录telemetry信息
     * @param action - 操作
     * @param parameter - 参数
     * @param extension - 附加数据
     * @param userInfo - 客户端信息
     * @param args - 其它参数...
     */
    telemetry(action: string, parameter?: any, extension?: any, userInfo?: any, ...args: any[]): void;
    telemetry(data: TTelemetry): void;
    telemetry(): void {
        if (this.Telemetry) {
            const args = Array.prototype.slice.call(arguments, 1);
            this.Telemetry.forEach(v => v.record.apply(v, args as any));
        }
    }

    /**
     * 一次记录时间(性能)日志
     * @param action - 操作
     * @param duration - 耗时
     * @param parameter - 参数
     * @param request_id - 请求ID
     * @param result - 操作结果
     * @param args - 其它参数
     */
    perfLog(
        action: string,
        duration: number,
        parameter?: any,
        requestId?: string,
        result?: string | any,
        ...args: any
    ): void;
    perfLog(data: TTime): void;
    perfLog() {
        if (this.Timers) {
            const args = arguments;
            this.Timers.forEach(v => v.log.apply(v, args as any));
        }
    }
    /**
     * 开始计时
     * @param label - 计时标签
     * @param context - 保存上下文信息
     */
    time(label: string, context?: Partial<TTime>): void {
        if (this.Timers) {
            this.Timers.forEach(v => v.time(label, context));
        }
    }
    /**
     * 结束计时
     * @param label - 计时标签
     * @param context - 保存上下文信息
     */
    timeEnd(label: string, context?: Partial<TTime>): void {
        if (this.Timers) {
            this.Timers.forEach(v => v.timeEnd(label, context));
        }
    }

    /**
     * 设置统一的上下文信息
     */
    setContext<T extends (keyof TTelemetry) & (keyof TTime) & (keyof TLog)>(key: T, value: TLog[T]): void {
        this.Loggers.forEach(v => v.setContext && v.setContext(key, value));
        this.Telemetry.forEach(v => v.setContext && v.setContext(key, value));
        this.Timers.forEach(v => v.setContext && v.setContext(key, value));
    }
}

export interface Console {
    assert(condition?: boolean, message?: string, ...data: any[]): void;
    clear(): void;
    count(label?: string): void;
    debug(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
    group(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupEnd(): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    timeStamp(label?: string): void;
    warn(message?: any, ...optionalParams: any[]): void;
}
