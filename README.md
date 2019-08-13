# miniprogram-logger

It is used to logger and gather statistics of users' behavior by using wx.reportAnalytics

## example

```ts
import { logger } from "miniprogram-logger";
logger.debug("action", "log something", correlation_id);
logger.info("action2", "info or content", correlation_id);
logger.warn("action2", "important messages", correlation_id);
logger.error("action2", { err: Exception }, correlation_id);

// 开始计时开始
logger.time("timer-label", { action: "", param: "" });
// 完成计时结束
logger.timeEnd("timer-label");

// 耗时统计一次写入
logger.timeLog("action", 1000, { param: "xxx" }, "request-ID", { errMsg: "" },"type");
logger.timeLog({
    action: string,
    duration: number,
    parameter: any,
    requestId: string,
    result: string | any,
    ...
});

// 用户行为统计
logger.telemetry("do something", { p: "参数" }, {});

// 全局参数设置
logger.setContext("key", "value");
```

## API

### Const object

-   **`logger` 统一的默认 logger 对象，类似 console api 方式封装下面全部** (推荐使用)
-   `defaultCounter` 默认计数上报对象
-   `defaultLogManager` 本地日志管理对象
-   `defaultLogReporter` 自定义分析日志上报对象
-   `defaultTimer` 耗时统计上报对象
-   `defaultTelemetry` 用户行为统计上报对象

### Function

-   `inject()` listen and log the app onError/onPageNotFound
-   `guid()` get a UUID like string
-   `isLogLevel(level:any)` level is `LogLevel` or not

### Class

-   `ConsoleManager`
-   `CounterReportMonitor`
-   `LogReporter`
-   `LogManager`
-   `LogObject`
-   `LogLevel`
-   `TelemetryReporter`
-   `TimeReporter`
-   `PerformanceObject`

## Install

`npm i miniprogram-logger -S`

### 1. Create the data event in the MiniProgram backend as follow:(Reference: )

[https://developers.weixin.qq.com/miniprogram/analysis/custom/](https://developers.weixin.qq.com/miniprogram/analysis/custom/#12-%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6)

<details>

<summary>自定义记录表
</summary>

-   ![log](https://user-images.githubusercontent.com/6290356/56664307-7ac2c800-66da-11e9-8d65-2d0a1ec6d38b.png)
-   ![telemetry](https://user-images.githubusercontent.com/6290356/50898526-666bff80-144a-11e9-84e1-c85d6259255e.png)
-   ![time](https://user-images.githubusercontent.com/6290356/57513891-e6936a80-7341-11e9-84e3-266d6ad5c3d8.png)

</details>

`id`和`record_time` 默认会自动生成

下列所有非`number`类型均对应`string`

#### DefaultLogObject

日志对象

```json
{
    "level": "LogLevel",
    "action": "string",
    "content": "any",
    "user": {},
    "correlation_id": "string",
    "id": "string",
    "timestamp": "string"
}
```

上报事件名`log`;
表结构

| 字段           | 类型   | 说明            |
| -------------- | ------ | --------------- |
| id             | string | 单条记录过滤 ID |
| level          | string | 日志级别        |
| action         | string | 操作            |
| content        | string | 内容            |
| correlation_id | string | 关联 ID         |
| user           | string | 客户端脱敏数据  |
| timestamp      | string | ISO 时间戳      |

#### TelemetryObject

记录 Telemetry

```json
{
    "id": "string",
    "action": "string",
    "param": "any",
    "extension": {
        "debug_correlation_id": "string",
        "process_time": "number",
        "timestamp": "string"
    },
    "user": {
        "app_name": "string",
        "app_id": "string",
        "open_id": "string",
        "union_id": "string"
    }
}
```

自定上报默认事件名`telemetry`;
表结构

| 字段      | 类型   | 说明            |
| --------- | ------ | --------------- |
| id        | string | 单条记录过滤 ID |
| action    | string | 操作            |
| param     | string | 参数            |
| extension | string | 其它数据        |
| user      | string | 客户端脱敏数据  |

#### TimeReporter

时间统计对象

```json
{
    "action": "string",
    "duration": "number",
    "param": "any",
    "correlation_id": "string",
    "result": "any",
    "type": "string",
    "user": "any",
    "id": "string",
    "timestamp": "string"
}
```

自定上报默认事件名`time`;

表结构

| 字段           | 类型   | 说明            |
| -------------- | ------ | --------------- |
| id             | string | 单条记录过滤 ID |
| action         | string | 操作            |
| time           | number | 操作耗时        |
| param          | string | 参数            |
| correlation_id | string | 关联 ID         |
| result         | string | 操作结果        |
| type           | string | 操作分类        |
| user           | string | 客户端脱敏数据  |
| timestamp      | string | ISO 时间戳      |

## App Error

```js
import { inject } from "miniprogram-logger";
inject(); //自动记录全局错误
```

## task flow

```
                                                     +------------+
                        +-----------------------+--->+  monitor   | 监控报警
                        |         count         |    +------------+
                        |                       |
               +--------+----------+            |    +------------+
               |                   |     Filter +---->            |
               |                   +----------------->  Console   | 命令行
  log/info/... |                   |                 |            |
+------------> |                   |                 +------------+
               |                   |                 +------------+
  telemetry    |                   |     Filter      |            |
+------------> |                   +---------------->+ LogManager | 本地文件
               |                   |                 |            |
 time/timeLog  |        logger     |                 +------------+
+------------> |                   |                 +------------+
               |                   |     Filter      |            |
               |                   +---------------->+  Reporter  | 微信后端
               |                   |                 |            |
               |                   |                 +------------+
               |                   |     Filter      |            |
               |                   +---------------->+ realTimeLog| 实时日志
               |                   |                 |            |
               +-------------------+                 +------------+
```
