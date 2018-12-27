
export interface ILogger {
    logLevels?: LogLevel[];
    log(level: string, ...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}

// 所有Level
export const AllLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export function isLogLevel(level: any): level is LogLevel {
    return AllLevels.indexOf(level) >= 0;
}