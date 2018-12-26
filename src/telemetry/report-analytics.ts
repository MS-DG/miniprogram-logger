
import { ITelemetry, UserInfo } from "./ITelemetry";
import { Reporter, Dictionary } from "../common/reporter";
import { utils } from "../common/utils";

export interface TelemetryObject extends Dictionary {
    id: string;
    action: string;
    parameter?: string;
    extension?: Dictionary;
    user_info?: UserInfo
}
/**
 * 默认 Telemetry对象转换函数
 * 字段中注入`id`和`extension.timestamp`
 * @param data LogObject
 */
export function TelemetryTransformFunction<T extends TelemetryObject =TelemetryObject>(data: T): Dictionary {
    if (typeof data === "object") {
        data.id = utils.guid();
        if (!data.extension) {
            data.extension = {};
        }
        data.extension.timestamp = new Date().toUTCString();
    }
    return data;
}

type TelemetryKeys = ['action', 'parameter', 'extension', 'user_info'];
type TelemetryValues = [string, string, Dictionary, UserInfo];

export class ReportAnalytics
    extends Reporter<TelemetryObject, TelemetryValues, TelemetryKeys>
    implements ITelemetry {

    constructor(tableName: string, context?: Partial<TelemetryObject>) {
        super(tableName, ['action', 'parameter', 'extension', 'user_info'], context);
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
        if (arguments.length === 0) {
            console.error('ReportAnalytics.log need 1 or more parameters');
            return;
        }
        // 单参数object
        // 或者多参数，安参数表赋值
        const data: TelemetryObject = (arguments.length === 1 && typeof arguments[0] === 'object') ? arguments[0] : { action: arguments[0] };
        if (arguments.length > 1) {
            data.parameter = arguments[1];
        }
        if (arguments.length > 2) {
            data.extension = arguments[2]
        }
        if (arguments.length > 3) {
            data.user_info = arguments[3]
        }
        this.report(data);
    }
}