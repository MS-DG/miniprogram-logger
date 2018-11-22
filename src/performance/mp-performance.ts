import { IPerformance, PerformanceObject } from "./IPerformance"
import { Common } from "../common";

export class WxMpPerformance implements IPerformance {
    
    public readonly TableName: string;

    public CorrelationId: string;

    public Extension: any;

    constructor(tableName: string, extension?: any) {
        this.TableName = tableName;
        this.CorrelationId = Common.NewGuid();
        this.Extension = extension;
    }

    public log(action: string, duration: number, parameter?: any): void {
        let json: PerformanceObject = {
            id: Common.NewGuid(),
            timestamp: new Date().toUTCString(),
            correlation_id: this.CorrelationId,
            action: action,
            duration: duration,
            parameter: parameter,
            extension: this.Extension,
        };
        wx.reportAnalytics(this.TableName, json);
    }
}

declare var wx: {
    reportAnalytics: Function;
}
