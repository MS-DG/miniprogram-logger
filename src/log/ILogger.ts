
export type Dictionary = { [key: string]: string | number };

export interface ILogger {
    TableName: string;
    CorrelationId: string;
    FilterFields?: Dictionary;
    LogManager?: object;
    log(level: string, action: string, content: string, filterFields?: Dictionary): void;
    debug(action: string, content: string, filterFields?: Dictionary): void;
    info(action: string, content: string, filterFields?: Dictionary): void;
    warn(action: string, content: string, filterFields?: Dictionary): void;
    error(action: string, content: string, filterFields?: Dictionary): void;
    count(label: string): void;
}

export interface LogObject {
    id: string;
    timestamp: string;
    correlation_id: string;
    level: string;
    action: string;
    content: string;
    [key: string]: string | number;
}
