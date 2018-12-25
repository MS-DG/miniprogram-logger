
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

type TelemetryKeys = ['action', 'parameter', 'extension', 'user_info'];
type TelemetryValues = [string, string, Dictionary, UserInfo];

export class ReportAnalytics extends Reporter<TelemetryObject, TelemetryValues, TelemetryKeys>
// implements IPerformance
{

    constructor(tableName: string, context?: Partial<TelemetryObject>) {
        super(tableName, ['action', 'parameter', 'extension', 'user_info'], context);
    }

    /**
     * 快速记录性能日志
     * @param action 操作,
     * @param context 其它数据
     */
    public log(action: TelemetryValues[0], parameter?: TelemetryValues[1], extension?: TelemetryValues[2], userInfo?: TelemetryValues[3]): void;
    /**
     * 快速记录性能日志
     * @param data PerformanceParam
     */
    public log(data: TelemetryObject): void;
    public log(): void {
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
        if (arguments.length > 3) {
            data.user_info = arguments[3]
        }
        data.extension = arguments[2] || {}
        data.extension!.timestamp = new Date().toUTCString();
        data.id = utils.guid();
        this.report(data);
    }
}