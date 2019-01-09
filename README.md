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


<details>

<summary>自定义记录表
</summary>

* ![log](https://user-images.githubusercontent.com/6290356/50898793-2bb69700-144b-11e9-933a-0c0349d6a2fb.png)
* ![telemetry](https://user-images.githubusercontent.com/6290356/50898526-666bff80-144a-11e9-84e1-c85d6259255e.png)
* ![time](https://user-images.githubusercontent.com/6290356/50899152-49383080-144c-11e9-8667-dd4aed600380.png)

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
    "user":{},
    "correlation_id": "string",
    "id": "string",
    "record_time": "number"
}
```
上报事件名`log`;

表结构
| 字段 | 类型 | 说明 |
|---	|---	|---	|
| id | string| 单条记录过滤ID |
| level | string| 日志级别 |
| action | string| 操作 |
| content | string | 内容 |
| correlation_id | string | 关联ID |
| user | string | 客户端脱敏数据 |
| record_time | number | 上报时间 |

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

自定上报默认事件名`telemetry`;

表结构
| 字段 | 类型 | 说明 |
|---	|---	|---	|
| id | string| 单条记录过滤ID |
| action | string| 操作 |
| param | string | 参数 |
| extension | string | 其它数据 |
| user | string | 客户端脱敏数据 |

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

自定上报默认事件名`time`;

表结构
| 字段 | 类型 | 说明 |
|---	|---	|---	|
| id | string| 单条记录过滤ID |
| action | string| 操作 |
| time | number | 操作耗时 |
| param | string | 参数 |
| correlation_id | string | 关联ID |
| result | string | 操作结果 |
| type | string | 操作分类 |
| user | string | 客户端脱敏数据 |
| record_time | number | 上报时间 |


