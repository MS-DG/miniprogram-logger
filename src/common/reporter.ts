import { utils } from "./utils";
export interface Dictionary {
    [key: string]: string | number | any
};

declare var wx: {
    reportAnalytics: (table: string, data: object) => void;
}


export type MapTTuple<Tkey, Tvalue> = {

}

export class Reporter<
    TObject extends Dictionary,
    TValueTuple extends TObject[keyof TObject][],
    TKeyTuple extends (keyof TObject)[]= (keyof TObject)[]>
{
    /**
     * 存储的表名
     */
    public readonly TableName: string;
    /**
     * 每次记录的上下文信息
     */
    public readonly Context: Partial<TObject>;
    /**
     * 字段参数映射关系
     */
    protected readonly Fields: TKeyTuple;

    constructor(table: string, fields: TKeyTuple, context?: Partial<TObject>) {
        this.TableName = table;
        this.Fields = fields;
        this.Context = context || {};
    }

    /**
     * 
     * @param args 上报的参数,各个参数分开,上报
     */
    public report(...args: TValueTuple): void;
    /**
     * 上报 Object
     * @param data 
     */
    public report(data: TObject): void;
    public report() {
        const data = this.Context;
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            for (let key in arguments[0]) {
                if (arguments[0].hasOwnProperty(key)) {
                    data[key] = utils.stringify(data[key]);
                }
            }
        } else {
            let n = Math.min(this.Fields.length, arguments.length);
            while (n-- > 0) {
                data[this.Fields[n] as string] = utils.stringify(arguments[n]);
            }
        }
        wx.reportAnalytics(this.TableName, data);
    }

    /**
     * 设置上下文键值
     * @param key - 键
     * @param value - 值
     */
    public setContext<T extends keyof TObject = string>(key: T, value: TObject[T]): this;
    /**
     * 设置Context
     * @param context 
     */
    public setContext(context: Partial<TObject>): this;
    public setContext(): this {
        if (arguments.length == 1) {
            Object.assign(this.Context, arguments[0]);
        } else if (arguments[1] === undefined) {
            delete this.Context[arguments[0]]
        } else {
            this.Context[arguments[0]] = arguments[1];
        }
        return this;
    }
}
