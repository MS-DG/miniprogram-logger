/// <reference lib="dom" />

import { ConsoleManager } from "./console/console";
import { ReportMonitor as CounterReportMonitor } from "./count/index";
import { ReportAnalytics as LogReporter, LogManager, LogObject, LogLevel } from "./log/index";
import { ReportAnalytics as TelemetryReporter } from "./telemetry/index";
import { PerformanceObject, ReportAnalytics as TimeReporter } from "./time/index";

export { ICounter } from "./count/index";
export { ILogger, AllLevels, isLogLevel } from "./log/index";
export { ITelemetry } from "./telemetry/index";
export { ITimer } from "./time/index";
export { guid } from "./common/guid";

export {
    ConsoleManager,
    CounterReportMonitor,
    LogReporter,
    LogManager,
    LogObject,
    LogLevel,
    TelemetryReporter,
    TimeReporter,
    PerformanceObject,
};

/**
 * 原始console
 */
export const originConsole = console;
/**
 * 计数器
 */
export const defaultCounter = new CounterReportMonitor();

/**
 * Logger
 */
export const defaultLogManager = new LogManager();
export const defaultLogReporter = new LogReporter<DefaultLogObject, [LogLevel, string, any, string]>("log", [
    "level",
    "action",
    "content",
    "correlation_id",
]);

/**
 * 计时器
 */
export const defaultTimer = new TimeReporter<DefaultTimeObject, [string, number, any, string, any, string | number]>(
    "time",
    ["action", "time", "param", "correlation_id", "result", "type"],
);

/**
 * Telemetry 统计日志
 */
export const defaultTelemetry = new TelemetryReporter("telemetry");

export const logger = new ConsoleManager<DefaultLogObject, DefaultTimeObject>(originConsole);
logger.Counters.push(defaultCounter);
logger.Loggers.push(defaultLogManager, defaultLogReporter);
logger.Telemetry.push(defaultTelemetry);
logger.Timers.push(defaultTimer);

export interface DefaultLogObject extends LogObject {
    /** 关联ID */
    correlationId?: string;
    /** 客户端用户数据(脱敏后),通过context设置 */
    user?: any;
}

export interface DefaultTimeObject extends PerformanceObject {
    /** 参数 */
    param?: any;
    /** 关联ID */
    correlationId?: string;
    /** 结果 */
    result?: any;
    /** 类型 */
    type?: string | number;
    /** 客户端数据用户数据(脱敏后),通过context设置 */
    user?: any;
}

let isInjected = false;
/**
 * 监听全家错误
 * wx.onPageNotFound
 * wx.onError
 */
export function inject() {
    if (!isInjected) {
        isInjected = true;
        wx.onPageNotFound(res => logger.error("wx.PageNotFound", res));
        wx.onError(err => logger.error(err));
    }
}

declare namespace wx {
    interface PageResult {
        errMsg: string;
        path: string; //	不存在页面的路径
        query: object; //	打开不存在页面的 query 参数
        isEntryPage: boolean; //	是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）
    }
    /** 小程序要打开的页面不存在事件的回调函数 */
    function onPageNotFound(callback: (res: PageResult) => void): void;
    /** 小程序错误事件的回调函数 */
    function onError(callback: (error: string) => void): void;
}
