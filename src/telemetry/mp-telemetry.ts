import { ITelemetry, UserInfo } from "./ITelemetry"
import { Common } from "../common"

export class WxMpTelemetry implements ITelemetry {

    public readonly TableName: string;

    public readonly UserInfo: UserInfo;

    public readonly Extension: any;

    private extensionJsonStr: string;

    public CorrelationId: string;

    constructor(tableName: string, userInfo: UserInfo, extension?: any, transfrom?: Function, correlationId: string = "") {
        this.TableName = tableName;
        this.UserInfo = userInfo;
        this.Extension = transfrom ? transfrom(extension) : extension
        this.extensionJsonStr = typeof(extension) != "string" ? JSON.stringify(extension) : extension;
        this.CorrelationId = correlationId;
    }

    public log(action: string, parameter?: string, processTimeInMS?: number, correlationId: string = "") {
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
        let info : object = {
            app_name: this.UserInfo.app_name,
            app_id: this.UserInfo.app_id,
            open_id: this.UserInfo.open_id,
            union_id: this.UserInfo.union_id,
            process_time: processTimeInMS,
            debug_correlation_id: correlationId == "" ? this.CorrelationId : correlationId,
            timestamp: new Date().toUTCString(),
        };
        return JSON.stringify(info);
    }

}

declare var wx: {
    reportAnalytics: Function;
}