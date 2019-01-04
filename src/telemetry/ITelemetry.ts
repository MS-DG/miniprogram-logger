
export interface ITelemetry {
    setContext?(key: any, value?: any): any;
    record(action: string, ...args: any[]): void;
}

export interface UserInfo {
    app_name: string;
    app_id: string;
    open_id: string;
    union_id?: string;
}


