/// <reference lib="es2015"/>
import { IPerformance, PerformanceParam, TransformFunction } from "./IPerformance"
import { utils ,wx} from "../common";


function defaultTransform(data: PerformanceParam): { [key: string]: string | number | undefined } {
    data.id = utils.guid();
    data.user = utils.stringify(data.user);
    data.param = utils.stringify(data.param);
    data.extension = utils.stringify(data.extension);
    data.record_time = <any>data.record_time!.getTime();
    return data;
}

export class WxMpPerformance implements IPerformance {

    public readonly TableName: string;

    /**
     * 客户端信息
     */
    public User?: any;
    /**
     * 额外数据
     */
    public Extension?: any;
    /**
     * 关联ID
     */
    public CorrelationId?: string;


    /**
     * 转换方法
     */
    public Transform: TransformFunction = defaultTransform;

    private Id = 0;
    private readonly Stopwatch = new Map<number, [Date, any]>();

    constructor(tableName: string, extension?: any) {
        this.TableName = tableName;
        this.Extension = extension;
    }

    /**
     * 快速记录性能日志
     * @param action 操作,
     * @param time 耗时单位毫秒
     * @param parameter 参数 
     * @param extension 扩展数据
     */
    public log(action: string, time: number, parameter?: any, extension?: any): void;
    /**
     * 快速记录性能日志
     * @param data PerformanceParam
     */
    public log(data: PerformanceParam): void;
    public log(): void {
        if (arguments.length === 0) {
            console.error('WxMpPerformance.log need 1 or more parameters');
            return;
        }

        // 单参数object
        // 或者多参数，安参数表赋值
        const data: PerformanceParam = (arguments.length === 1) ?
            arguments[0] : {
                action: arguments[0],
                time: arguments[1],
                param: arguments[2],
            }

        data.extension = arguments.length > 2 ? arguments[3] : data.extension || this.Extension;
        data.correlation_id = data.correlation_id || this.CorrelationId;
        data.record_time = data.record_time || new Date();

        wx.reportAnalytics(this.TableName, this.Transform(data));
    }


    /**
     * 开始计时
     * @param action 
     * @param param 
     * @returns 返回计时ID
     */
    public start(action: string, param?: any): number;
    public start(data: PerformanceParam): number;
    public start(): number {
        if ((arguments.length === 1) && typeof arguments[0] === "object") {
            //对象参数
            this.Stopwatch.set(this.Id, [new Date, arguments[0]]);
        } else {
            //多参数
            this.Stopwatch.set(this.Id, [new Date, {
                action: arguments[0],
                param: arguments[1],
            }]);
        }
        return this.Id++;
    }

    /**
     * 完成计时，并清除计时ID
     * @param id 
     * @param extension 
     */
    public stop(id: number, extension?: any): boolean {
        const info = this.Stopwatch.get(id);
        if (!info) {
            return false;
        }

        const [start, data] = info;
        const now = new Date();
        if (arguments.length > 1) {
            // 设置 extens 字段
            data.extension = extension;
        }
        data.time = (now as any) - (start as any);
        data.record_time = now;
        this.log(data);
        return this.clear(id);
    }

    /**
     * 清除计时
     * @param id
     * @returns 不存在返回false 
     */
    public clear(id: number): boolean {
        return this.Stopwatch.delete(id);
    }

}

