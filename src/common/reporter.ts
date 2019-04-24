import { guid } from "./guid";

/**
 * 序列化字符串
 * @param data paramter
 */
export function stringify(data: any): string | number | undefined {
    return data && typeof data !== "string" && typeof data !== "number" ? JSON.stringify(data) : data;
}
export interface Dictionary {
    [key: string]: string | number | any;
}

export interface BasicLogObject extends Dictionary {
    /** 
     * 记录ID
     */
    id?: string;
    /**
     * 时间戳
     */
    timestamp?: number;
}

/**
 * 默认Log对象转换函数
 * 自动添加蛇形命名
 * 字段中注入`id`和`timestamp`
 * @param data LogObject
*/
export function logTransformFunction<T extends Dictionary = Dictionary>(data: T): Dictionary {
    if (typeof data === "object") {
        Object.keys(data).reduce(function (acc, key) {
            const snake = key.replace(/([A-Z]+)/g, function (m, x) {
                return "_" + x.toLowerCase();
            });
            if (!(snake in acc)) {
                acc[snake] = data[key];
            }
            return acc;
        }, data);
        if (!data.id) {
            data.id = guid();
        }
        if (!data.timestamp) {
            data.timestamp = new Date().toISOString();
        }
    }
    return data;
}
/**
 * 上报封装
 */
export class Reporter<
    TObject extends Dictionary,
    TValues extends TObject[keyof TObject][],
    TKeys extends (keyof TObject)[] = (keyof TObject)[]
    > {
    /**
     * 上报转换函数
     */
    public TransformFunction?: (data: TObject) => any;
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
    protected readonly Fields: TKeys;

    constructor(table: string, fields: TKeys, context?: Partial<TObject>) {
        this.TableName = table;
        this.Fields = fields;
        this.Context = context || {};
    }

    /**
     *
     * @param args 上报的参数,各个参数分开,上报
     */
    protected report(...args: TValues): void;
    /**
     * 上报 Object
     * @param data
     */
    protected report(data: TObject): void;
    protected report() {
        if (arguments.length === 0) {
            //@ts-ignore
            console.error("report need 1 or more parameters");
            return;
        }
        const data = Object.assign({}, this.Context);
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            Object.assign(data, arguments[0]);
        } else {
            let n = Math.min(this.Fields.length, arguments.length);
            while (n-- > 0) {
                data[this.Fields[n] as string] = arguments[n];
            }
        }
        if (this.TransformFunction) {
            this.TransformFunction(data as TObject);
        }
        Object.keys(data).forEach(key => (data[key] = stringify(data[key])));
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
            delete this.Context[arguments[0]];
        } else {
            this.Context[arguments[0]] = arguments[1];
        }
        return this;
    }
}

declare var wx: {
    reportAnalytics: (table: string, data: object) => void;
};
