export interface IMonitor {
    count(label: string, value?: number): this;
}