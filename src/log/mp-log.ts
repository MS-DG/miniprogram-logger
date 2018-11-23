import { ILogger, Dictionary, LogObject } from "./ILogger"
import { guid } from "../common";

export class WxMpLogger implements ILogger {

    public readonly TableName: string;

    public CorrelationId: string;

    public FilterFields?: Dictionary;

    public LogManager?: any;

    constructor(tableName: string, filterFields?: Dictionary, logManager?: any) {
        this.TableName = tableName;
        this.CorrelationId = guid();
        this.FilterFields = filterFields;
        this.LogManager = logManager;
    }

    public log(level: string, action: string, content: string, filterFields?: Dictionary): void {
        let fields: Dictionary = {};
        if (this.FilterFields != undefined) {
            fields = JSON.parse(JSON.stringify(this.FilterFields));
        }
        if (filterFields != undefined) {
            for (let key in filterFields) {
                fields[key] = filterFields[key];
            }
        }
        let json: LogObject = {
            id: guid(),
            timestamp: new Date().toUTCString(),
            correlation_id: this.CorrelationId,
            level: level,
            action: action,
            content: content,
        }
        for (let key in fields) {
            json[key] = fields[key];
        }
        wx.reportAnalytics(this.TableName, json);
        if (this.LogManager != undefined) {
            switch (level) {
                case "debug":
                    this.LogManager.debug(json);
                    break;
                case "info":
                    this.LogManager.info(json);
                    break;
                case "warn":
                    this.LogManager.warn(json);
                    break;
                case "error":
                    this.LogManager.warn("Error", json);
                    break;
            }
        }

    }

    public debug(action: string, content: string, filterFields?: Dictionary): void {
        this.log("debug", action, content, filterFields);
    }

    public info(action: string, content: string, filterFields?: Dictionary): void {
        this.log("info", action, content, filterFields);
    }

    public warn(action: string, content: string, filterFields?: Dictionary): void {
        this.log("warn", action, content, filterFields);
    }

    public error(action: string, content: string, filterFields?: Dictionary): void {
        this.log("error", action, content, filterFields);
    }
}

declare var wx: {
    reportAnalytics: Function;
}