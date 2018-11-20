import { ITelemetry, UserInfo } from "./ITelemetry"
import { Common } from "../common"

export class WxMpTelemetry implements ITelemetry {

    public readonly TableName: string;

    public readonly UserInfo: UserInfo;

    public readonly Extension: any;

    private extensionJsonStr: string;

    public transfrom: Function | undefined;

    constructor(tableName: string, userInfo: UserInfo, extension?: any, transfrom?: Function) {
        this.TableName = tableName;
        this.UserInfo = userInfo;
        this.Extension = transfrom ? transfrom(extension) : extension
        this.extensionJsonStr = typeof(extension) != "string" ? JSON.stringify(extension) : extension;
        this.transfrom = transfrom;
    }

    public log(action: string, parameter?: string, processTimeInMS?: number, correlationId?: string) {
        wx.reportAnalytics(
            this.TableName, {
                id: Common.NewGuid(),
                action: action,
                parameter: parameter,
                extension: this.extensionJsonStr,
                user_info: this.reassembleUserInfo(processTimeInMS, correlationId),
            }
        )
    }

    private reassembleUserInfo(processTimeInMS?: number, correlationId?: string): string {
        let obj : any = {};
        obj["app_name"] = this.UserInfo.AppName;
        obj["app_id"] = this.UserInfo.AppId;
        obj["open_id"] = this.UserInfo.OpenId;
        obj["union_id"] = this.UserInfo.UnionId;
        obj["process_time"] = processTimeInMS;
        obj["debug_correlation_id"] = correlationId;
        obj["timestamp"] = new Date().toUTCString();
        return JSON.stringify(obj);
    }

}

declare var wx: {
    reportAnalytics: Function;
    reportmonitor: Function;
}