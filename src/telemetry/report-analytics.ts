
import { ITelemetry, UserInfo } from "./ITelemetry";
import { Reporter, Dictionary } from "../common/reporter";
import { guid } from "../common/guid";

export interface TelemetryObject extends Dictionary {
    /** 记录ID */
    id?: string;
    /** 记录操作 */
    action?: string;
    /** 参数 */
    param?: any;
    /** 扩展内容 */
    extension?: TelemetryExtension;
    /** 客户端数据 */
    user?: UserInfo;
}
/**
 * 默认 Telemetry对象转换函数
 * 字段中注入`id`和`extension.timestamp`
 * @param data LogObject
 */
export function TelemetryTransformFunction<T extends TelemetryObject =TelemetryObject>(data: T): Dictionary {
    if (typeof data === "object") {
        if (!data.id) {
            data.id = guid();
        }
        if (!data.extension) {
            data.extension = {};
        }
        data.extension.timestamp = new Date().toUTCString();
    }
    return data;
}

type TelemetryKeys = ['action', 'param', 'extension', 'user_info'];
type TelemetryValues = [string, any, Dictionary, UserInfo];

export class ReportAnalytics
    extends Reporter<TelemetryObject, TelemetryValues, TelemetryKeys>
    implements ITelemetry {

    constructor(tableName: string, context?: Partial<TelemetryObject>) {
        super(tableName, ['action', 'param', 'extension', 'user_info'], context);
        this.TransformFunction = TelemetryTransformFunction;
    }

    /**
     * 快速记录性能日志
     * @param action 操作,
     * @param context 其它数据
     */
    public record(action: TelemetryValues[0], parameter?: TelemetryValues[1], extension?: TelemetryValues[2], userInfo?: TelemetryValues[3]): void;
    /**
     * 快速记录性能日志
     * @param data PerformanceParam
     */
    public record(data: TelemetryObject): void;
    public record(): void {
        this.report.apply(this, arguments as any);
    }
}

interface TelemetryExtension extends Dictionary {
    /** 关联ID */
    debug_correlation_id?: string;
    /** 处理时间 */
    process_time?: number;
    /** 时间戳 */
    timestamp?: string | number;
}