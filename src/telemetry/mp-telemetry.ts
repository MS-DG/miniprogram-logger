import { ITelemetry, UserInfo, TelemetryObject } from "./ITelemetry"
import { utils } from "../common"

export class WxMpTelemetry implements ITelemetry {

    public readonly TableName: string;

    public readonly UserInfo: UserInfo;

    public Extension: any;

    public CorrelationId: string;

    constructor(tableName: string, userInfo: UserInfo, extension?: any, correlationId: string = "") {
        this.TableName = tableName;
        this.UserInfo = userInfo;
        this.Extension = extension
        this.CorrelationId = correlationId;
    }

    public log(action: string, parameter?: string, processTimeInMS?: number, correlationId: string = "") {
        let json: TelemetryObject = {
            id: utils.guid(),
            action: action,
            parameter: parameter,
            extension: this.Extension,
            user_info: this.reassembleUserInfo(processTimeInMS, correlationId)
        }   
        wx.reportAnalytics(this.TableName, json);
    }

    private reassembleUserInfo(processTimeInMS?: number, correlationId?: string): any {
        let info : object = {
            app_name: this.UserInfo.app_name,
            app_id: this.UserInfo.app_id,
            open_id: this.UserInfo.open_id,
            union_id: this.UserInfo.union_id,
            process_time: processTimeInMS,
            debug_correlation_id: correlationId == "" ? this.CorrelationId : correlationId,
            timestamp: new Date().toUTCString(),
        };
        return info;
    }

}

declare var wx: {
    reportAnalytics: Function;
}