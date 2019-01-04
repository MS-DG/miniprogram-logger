# miniprogram-logger
It is used to logger and gather statistics of users' behavior by using wx.reportAnalytics

## Install

`npm i miniprogram-logger -S`

## Usage

```ts
import {logger} from 'miniprogram-logger';
logger.debug('action','log something',correlation_id);
logger.info('action2', 'info or content',correlation_id);
logger.warn('action2', 'important message',correlation_id);
logger.error('action2', {err:Exception},correlation_id);

//开始计时
logger.time('timer-label',{action:'',param:''});
//完成计时
logger.timeEnd('timer-label');

//
logger.telemetry('do something',{p:'参数'},{})

```


### 1. Create the data event in the MiniProgram backend as follow:(Reference: )

[https://developers.weixin.qq.com/miniprogram/analysis/custom/](https://developers.weixin.qq.com/miniprogram/analysis/custom/#12-%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6)


`id`和`record_time` 默认会自动生成

下列所有非`number`类型均对应`string`

#### DefaultLogObject
日志对象
```json
{
    "level": "LogLevel",
    "action": "string",
    "content": "any",
    "user":{},
    "correlation_id": "string",
    "id": "string",
    "record_time": "number"
}
```
上报事件名`log`;

#### TelemetryObject
记录Telemetry
```json
{
    "id": "string",
    "action": "string",
    "param": "any",
    "extension": {
        "debug_correlation_id": "string",
        "process_time": "number",
        "timestamp": "string | number"
    },
    "user": {
        "app_name": "string",
        "app_id": "string",
        "open_id": "string",
        "union_id": "string",
    }
}
```
上报事件名`telemetry`;


#### TimeReporter
时间统计对象

```json
{
    "action": "string",
    "time": "number",
    "param": "any",
    "correlation_id":"string",
    "result":"any",
    "type":"string",
    "user": "any",
    "id": "string",
    "record_time": "number"
}
```


