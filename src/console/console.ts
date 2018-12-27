import { ICounter } from "../count/ICounter";
import { ILogger, LogLevel } from "../log/ILogger";
import { ITimer } from "../time/ITimer";
import { ITelemetry } from "../telemetry/ITelemetry";
import { TelemetryObject } from "../telemetry/report-analytics";
import { PerformanceObject } from "../time/report-analytics";
import { LogObject } from "../log/report-analytics";

export type ConsoleLevel = LogLevel | 'time' | 'telemetry';

export class Console<TLog=LogObject, TTime=PerformanceObject, TTelemetry=TelemetryObject> {
    public readonly Counters: ICounter[] = [console];

    public readonly Loggers: ILogger[] = [console];

    public readonly Timers: ITimer[] = [console];

    public readonly Telemetry: ITelemetry[] = [];

    /**
     * 计数
     * @param label 
     * @param value 
     */
    count(label?: string, value?: number): void {
        if (this.Counters) {
            const args = arguments;
            this.Counters.forEach(function (v) { v.count.apply(v, args as any) });
        }
    }

    debug(action: string, content?: any, ...optionalParams: any[]): void;
    debug(data: TLog): void;
    debug() {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(function (v) { v.debug.apply(v, args as any) });
        }
    }

    error(action: string, content?: any, ...optionalParams: any[]): void;
    error(data: TLog): void;
    error(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(function (v) { v.error.apply(v, args as any) });
        }
    }

    info(action: string, content?: any, ...optionalParams: any[]): void;
    info(data: TLog): void;
    info(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(function (v) { v.info.apply(v, args as any) });
        }
    }

    warn(action: string, content?: any, ...optionalParams: any[]): void;
    warn(data: TLog): void;
    warn(): void {
        if (this.Loggers) {
            const args = arguments;
            this.Loggers.forEach(function (v) { v.warn.apply(v, args as any) });
        }
    }

    log(level: ConsoleLevel, action: string, content?: any, ...optionalParams: any[]): void {
        const args = arguments;
        if (level === 'time') {
            if (this.Timers) {
                this.Timers.forEach(function (v) { v.log.apply(v, Array.prototype.slice.call(args, 1) as any) });
            }
        } else if (level === 'telemetry') {
            if (this.Telemetry) {
                this.Telemetry.forEach(function (v) { v.record.apply(v, Array.prototype.slice.call(args, 1) as any) });
            }
        } else if (this.Loggers) {
            this.Loggers.forEach(function (v) { v.log.apply(v, args as any) });
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
            this.Telemetry.forEach(function (v) { v.record.apply(v, args as any) });
        }
    }

    /**
     * 开始计时
     * @param label - 计时标签
     * @param context - 保存上下文信息
     */
    time(label: string, context?: Partial<TTime>): void {
        if (this.Timers) {
            this.Timers.forEach(function (v) { v.time(label, context) });
        }
    }
    /**
     * 开始计时
     * @param label - 计时标签
     * @param context - 保存上下文信息
     */
    timeEnd(label: string, context?: Partial<TTime>): void {
        if (this.Timers) {
            this.Timers.forEach(function (v) { v.timeEnd(label, context) });
        }
    }
}
