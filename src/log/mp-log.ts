import { ILogger, Dictionary } from "./ILogger"
import { utils, wx } from "../common";

export interface LogObject {
    id: string;
    timestamp: string;
    correlation_id: string;
    level: string;
    action: string;
    content: string;
    [key: string]: string | number;
}


export class WxMpLogger implements ILogger {

    public readonly TableName: string;

    public CorrelationId: string;

    public FilterFields?: Dictionary;

    public LogManager?: any;

    constructor(tableName: string, filterFields?: Dictionary, logManager?: any) {
        this.TableName = tableName;
        this.CorrelationId = utils.guid();
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
            id: utils.guid(),
            timestamp: new Date().toUTCString(),
            correlation_id: this.CorrelationId,
            level: level,
            action: action,
            content: content,
        }
        for (let key in fields) {
            json[key] = fields[key];
        }
        // LogManager
        if (this.LogManager) {
            if (level === "error") {
                this.LogManager.warn.call(this.LogManager, '[ERROR]', action, content, filterFields);
            } else {
                this.LogManager[level].apply(this.LogManager, Array.from(arguments));
            }
        }
        // report
        wx.reportAnalytics(this.TableName, json);
        // console
        console[level as "log"]

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

