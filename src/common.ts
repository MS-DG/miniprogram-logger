
/**
 * 生成像Guid的随机数
 */
export function guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * 序列化字符串
 * @param data paramter
 */
export function stringify(data: any): string | undefined {
    return (data && typeof data !== "string") ? JSON.stringify(data) : data;
}