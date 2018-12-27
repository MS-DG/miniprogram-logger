import { ILogger, LogLevel, AllLevels, isLogLevel } from "./ILogger";

/**
 * 微信LogManager,增加error接口
 */
export class LogManager implements ILogger {
    /**
     * 记录日志级别
     */
    public logLevels: LogLevel[] = AllLevels;
    private readonly manager: wx.LogManager;

    /**
     * 创建LogManager
     * @param wxLogManager - 微信LogManager或者参数
     */
    constructor(wxLogManager?: wx.LogManager | number) {
        if (typeof wxLogManager === 'number') {
            this.manager = wx.getLogManager(wxLogManager);
        } else {
            this.manager = wxLogManager || wx.getLogManager();
        }
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
                if (level === 'error') {
                    arguments[0] = '[ERROR]';
                    this.manager.log.call(this.manager, arguments);
                } else {
                    this.manager[level].call(this.manager, Array.prototype.slice.call(arguments, 1));
                }
            }
        } else {
            this.manager.log.call(this.manager, arguments);
        }

    }

}


declare namespace wx {

    function getLogManager(
        /** 取值为0/1，取值为0表示是否会把 `App`、`Page` 的生命周期函数和 `wx` 命名空间下的函数调用写入日志，取值为1则不会。默认值是 0
         *
         * 最低基础库： `2.3.2` */
        level?: number,
    ): LogManager;

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
        /** 写 log 日志 */
        log(
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