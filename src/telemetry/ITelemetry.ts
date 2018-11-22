
export interface ITelemetry {
    TableName: string;
    UserInfo: UserInfo,
    Extension: any,
    log(action: string, parameter?: string, processTimeInMS?: number, correlationId?: string): void;
}

export interface UserInfo {
    app_name: string;
    app_id: string;
    open_id: string;
    union_id?: string;
}

export interface TelemetryObject {
    id: string;
    action: string;
    parameter?: string;
    extension?: string;
    user_info: string;
}
