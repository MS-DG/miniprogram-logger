# miniprogram-logger
It is used to logger and gather statistics of users' behavior by using wx.reportAnalytics
## Install
npm i miniprogram-logger -S
## Usage
### 1. Create the data event in the MiniProgram backend as follow:(Reference: )
#### WxMpLogger

```ts
{
    id: string;
    timestamp: string;
    correlation_id: string;
    level: string;
    action: string;
    content: string;
    [key: string]: string | number;
}
```

#### WxMpTelemetry

```ts
{
    id: string;
    action: string;
    parameter: string;
    extension: string;
    user_info: string;
}
```

#### WxMpPerformance

```ts
{
    id: string;
    user: string;
    param: string;
    extension: string;
    record_time: number;
    correlation_id: string;
    time: number;
    action: string
}
```

### 2. Initialization

#### WxMpLogger
```ts
let logger: WxMpLogger = new WxMpLogger("logger", { extension1: "extension1", extension2: 2 });
logger.debug("action1", "content1", { extension3: "extension3" });
```
#### WxMpTelemetry
```ts
let telemetry: WxMpTelemetry = new WxMpTelemetry("telemetry", { app_id: "1", app_name: "2", open_id: "3", union_id: "4" }, { a: "aaa", b: "bbb" }, "11111-22222-33333");
telemetry.log("action1", "parameter1", 10);
```
#### WxMpPerformance
```ts
let performance: WxMpPerformance = new WxMpPerformance("performance", { extension1: "extension1", extension2: "extension2" });
telemetry.log("action1", "parameter1", 10);
```



