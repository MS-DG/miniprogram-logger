export interface ILogger {
    LogLevel: string;
    CorrelationId: string;
    Extension: any;
    transform: Function;
    log(config: LogConfig);
    log(level: string, action: string, content?: any);
    debug(action: string, content?: any);
    info(action: string, content?: any);
    warn(action: string, content?: any);
    error(action: string, content?: any);
    alert(action: string, content?: any);
}

export interface LogConfig {
    level: string;
    action: string;
    CorrelationId?: string;
    Data?: any;
    content?: any;
    transform?: Function;
}