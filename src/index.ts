import { ConsoleManager } from './console/console';
import { ReportMonitor as CounterReportMonitor } from './count/';
import { ReportAnalytics as LogReporter, LogManager, LogObject, LogLevel } from './log/';
import { ReportAnalytics as TelemetryReporter } from './telemetry/';
import { PerformanceObject, ReportAnalytics as TimeReporter } from './time/';

export { ICounter } from './count/';
export { ILogger, AllLevels, isLogLevel } from './log/';
export { ITelemetry } from './telemetry/';
export { ITimer } from './time/';

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
export const defaultLogReporter = new LogReporter<DefaultLogObject, [LogLevel, string, any, string]>(
    'log',
    ['level', 'action', 'content', 'correlation_id']
);

/**
 * 计时器
 */
export const defaultTimer = new TimeReporter<DefaultTimeObject, [string, number, any, string, any, string | number]>(
    'preformance',
    ['action', 'time', 'param', 'correlation_id', 'result', 'type']
);

/**
 * Telemetry 统计日志
 */
export const defaultTelemetry = new TelemetryReporter('telemetry');

export const logger = new ConsoleManager<DefaultLogObject, DefaultTimeObject>(originConsole);
logger.Counters.push(defaultCounter);
logger.Loggers.push(defaultLogManager, defaultLogReporter);
logger.Telemetry.push(defaultTelemetry);
logger.Timers.push(defaultTimer);

export interface DefaultLogObject extends LogObject {
    /** 关联ID */
    correlation_id?: string,
    /** 客户端用户数据(脱敏后),通过context设置 */
    user?: any,
}

export interface DefaultTimeObject extends PerformanceObject {
    /** 参数 */
    param?: any,
    /** 关联ID */
    correlation_id?: string,
    /** 结果 */
    result?: any;
    /** 类型 */
    type?: string | number;
    /** 客户端数据用户数据(脱敏后),通过context设置 */
    user?: any,
}

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
}
