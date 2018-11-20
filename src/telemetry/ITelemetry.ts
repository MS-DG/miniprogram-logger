
export interface ITelemetry {
    TableName: string;
    UserInfo: UserInfo,
    Extension: any,
    transfrom: Function | undefined;
    log(action: string, parameter?: string, processTimeInMS?: number, correlationId?: string): void;
}

export interface UserInfo {
    AppName: string;
    AppId: string;
    OpenId: string;
    UnionId?: string;
}
