import { ILogger, LogLevel, AllLevels, isLogLevel } from "./ILogger";

/**
 * 实时日志
 */
export class RelatimeLogger implements ILogger {
    /**
     * 记录日志级别
     */
    public logLevels: LogLevel[] = AllLevels;
    private readonly manager: wx.LogManager;

    /**
     * 创建LogManager
     * @param wxLogManager - 微信LogManager或者参数
     */
    constructor(wxLogManager?: wx.LogManager) {
        this.manager = wxLogManager || wx.getRealtimeLogManager();
    }

    debug(...args: any[]): void {
        return this.log('debug', ...args);
    }
    info(...args: any[]): void {
        return this.log('info', ...args);
    }
    warn(...args: any[]): void {
        return this.log('warn', ...args);
    }
    error(...args: any[]): void {
        return this.log('error', ...args);
    }

    log(level: LogLevel, ...args: any[]): void;
    log(...args: any[]): void;
    log(): void {
        if (arguments.length > 1 && isLogLevel(arguments[0])) {
            const level: LogLevel = arguments[0];
            if (this.logLevels.indexOf(level) >= 0) {
                this.manager[level].apply(this.manager, Array.prototype.slice.call(arguments, 1));
            }
        } else {
            this.manager.debug(arguments);
        }
    }

}


declare namespace wx {

    function getRealtimeLogManager(): LogManager;

    interface LogManager {
        /** 写 debug 日志 */
        debug(
            /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
            ...args: any[]
        ): void;
        /** 写 info 日志 */
        info(
            /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
            ...args: any[]
        ): void;
        /** 写 error 日志 */
        error(
            /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
            ...args: any[]
        ): void;
        /** 写 warn 日志 */
        warn(
            /** 日志内容，可以有任意多个。每次调用的参数的总大小不超过100Kb */
            ...args: any[]
        ): void;
    }
}