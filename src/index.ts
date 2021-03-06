import { Console, ConsoleManager } from "./console/console";
import { ReportMonitor as CounterReportMonitor } from "./count/index";
import { LogLevel, LogManager, LogObject, ReportAnalytics as LogReporter, RelatimeLogger } from "./log/index";
import { ReportAnalytics as TelemetryReporter } from "./telemetry/index";
import { PerformanceObject, ReportAnalytics as TimeReporter } from "./time/index";

export { guid } from "./common/guid";
export { logTransformFunction } from "./common/reporter";
export { ICounter } from "./count/index";
export { AllLevels, ILogger, isLogLevel } from "./log/index";
export { ITelemetry, TelemetryTransformFunction } from "./telemetry/index";
export { ITimer } from "./time/index";
export { ConsoleManager, CounterReportMonitor, LogReporter, LogManager, LogObject, LogLevel, TelemetryReporter, TimeReporter, PerformanceObject, };



declare const console: Console;

/**
 * 原始console
 */
export const originConsole = console;
/**
 * 计数器
 */
export const defaultCounter = new CounterReportMonitor();

/**
 * 本地日志Logger
 */
export const defaultLogManager = wx.getLogManager && new LogManager();

/**
 * 实时日志
 */
export const defaultRealtimeLogger = wx.getRealtimeLogManager && new RelatimeLogger();

/**
 * 日志上报
 */
export const defaultLogReporter = new LogReporter<DefaultLogObject, [LogLevel, string, any, string]>(
    "log",
    ["level", "action", "content", "correlation_id",]
);

/**
 * 计时器上报
 */
export const defaultTimer = new TimeReporter<DefaultTimeObject, [string, number, any, string, any, string | number]>(
    "time",
    ["action", "duration", "param", "request_id", "result", "type"],
);

/**
 * Telemetry 统计日志
 */
export const defaultTelemetry = new TelemetryReporter("telemetry");

export const logger = new ConsoleManager<DefaultLogObject, DefaultTimeObject>(originConsole);
logger.Counters.push(defaultCounter);
if (defaultLogManager) {
    logger.Loggers.push(defaultLogManager);
}
if(defaultRealtimeLogger){
    logger.Loggers.push(defaultRealtimeLogger);
}
logger.Loggers.push(defaultLogReporter);
logger.Telemetry.push(defaultTelemetry);
logger.Timers.push(defaultTimer);

export interface DefaultLogObject extends LogObject {
    /** 
     * 关联ID 
     */
    correlation_id?: string;
    /**
     *  客户端用户数据(脱敏后),通过context设置 
     */
    user?: any;
}

export interface DefaultTimeObject extends PerformanceObject {
    /**
     *  参数 
     */
    param?: any;

    /**
     *  结果
     */
    result?: any;
    /**
     *  类型
     */
    type?: string | number;
    /**
     *  客户端数据用户数据(脱敏后),通过context设置 
     */
    user?: any;
    /**
     * 请求ID requestId
     */
    request_id?: string;

    /** 
     * 关联ID 
     */
    correlation_id?: string;

    /**
     * 成功标识
     */
    success?: boolean | string;
}

let isInjected = false;
/**
 * 监听全局错误
 * wx.onPageNotFound
 * wx.onError
 * wx.onMemoryWarning
 * wx.onAudioInterruptionEnd
 * wx.onAudioInterruptionBegin
 */
export function inject() {
    if (!isInjected) {
        isInjected = true;
        if (wx.onPageNotFound) {
            wx.onPageNotFound(res => logger.error("wx.onPageNotFound", res));
        }
        if (wx.onError) {
            wx.onError(err => logger.error("wx.onError", err));
        }
        //基础库 2.6.2 开始支持
        if (wx.onAudioInterruptionBegin) {
            wx.onAudioInterruptionEnd(err => logger.warn("wx.onAudioInterruptionEnd", err));
            wx.onAudioInterruptionBegin(err => logger.warn("wx.onAudioInterruptionBegin", err));
        }

        // 内存不足告警事件的回调函数 
        if (wx.onMemoryWarning) {
            wx.onMemoryWarning(err => logger.warn("wx.onMemoryWarning", err))
        }
    }
}

declare namespace wx {
    function getLogManager(): void;
    function getRealtimeLogManager():void;
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
    function onAudioInterruptionBegin(callback: (error: string) => void): void;
    function onAudioInterruptionEnd(callback: (error: string) => void): void;
    /* 
    * 最低基础库： `2.0.2`  
    * 内存不足告警事件的回调函数 
    */
    function onMemoryWarning(callback: (error: object) => void): void;
}
