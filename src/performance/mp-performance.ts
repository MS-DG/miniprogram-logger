import { IPerformance, PerformanceObject } from "./IPerformance"
import { guid, stringify } from "../common";

export class WxMpPerformance implements IPerformance {


    public readonly TableName: string;

    public CorrelationId?: string;

    public Extension?: any;

    public User: any;

    private Id = 0;
    private readonly Stopwatch = new Map<number, [Date, any]>();

    constructor(tableName: string, extension?: any) {
        this.TableName = tableName;
        this.Extension = extension;
    }

    public log(action: string, duration: number, parameter?: any, extension?: any): void;
    public log(data: any): void;
    //  {
    //     const json: PerformanceObject = {
    //         id: guid(),
    //         action: action,
    //         time: duration,
    //         record_time: new Date().getTime(),
    //         correlation_id: this.CorrelationId,
    //         param: stringify(parameter),
    //         extension: stringify(extension || this.Extension),
    //         user: stringify(this.User),
    //     };
    //     wx.reportAnalytics(this.TableName, json);
    // }
    public log(data: any): void {
        wx.reportAnalytics(this.TableName, json);
    }

    public start(action: string, param?: any): number;
    public start(): number {
        this.Stopwatch.set(this.Id, [new Date, { ...arguments }])
        return this.Id++;
    }

    public stop(id: number, extension?: any): boolean {
        const info = this.Stopwatch.get(id);
        if (!info) {
            return false;
        }

        const [start, data] = info;
        if (arguments.length > 1) {
            // 设置 extens 字段
            data.extension = extension;
        }
        data.time = (new Date as any as number) - (start as any as number);
        this.log(data);
        return this.clear(id);

    }

    public clear(id: number): boolean {
        return true;
    }

}
declare var wx: {
    reportAnalytics: Function;
}
