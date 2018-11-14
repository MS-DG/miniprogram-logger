
export interface ITelemetry {
    UserInfo: UserInfo,
    Extension?: any;
    CorrelationId?: string;
    transfrom:Function;
    log(action: string, parameter?: string, processTimeInMS?: number);
}

export interface UserInfo {
    AppName: string;
    AppId: string;
    OpenId?: string;
    UnionId?: string;
}
