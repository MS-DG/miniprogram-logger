import { ICounter } from "./ICounter";

export class ReportMonitor implements ICounter {
    count(label: string, value: number = 1): void {
        wx.reportMonitor(label, value);
    }
}

declare namespace wx {
    /** 最低基础库： `2.0.1` */
    function reportMonitor(
        /** 监控ID，在「小程序管理后台」新建数据指标后获得 */
        name: string,
        /** 上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量 */
        value: number,
    ): void;
}