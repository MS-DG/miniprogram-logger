import { ConsoleManager } from './console/console';
import { ReportMonitor as CounterReportMonitor } from './count/index';
import { ReportAnalytics as LogReporter, LogManager, LogObject, LogLevel } from './log/index';
import { ReportAnalytics as TelemetryReporter } from './telemetry/index';
import { PerformanceObject, ReportAnalytics as TimeReporter } from './time/index';

export { ICounter } from './count/index';
export { ILogger, AllLevels, isLogLevel } from './log/index';
export { ITelemetry } from './telemetry/index';
export { ITimer } from './time/index';

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

