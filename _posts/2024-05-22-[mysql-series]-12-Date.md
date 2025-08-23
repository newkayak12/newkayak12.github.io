---
layout: post
categories: [MYSQL]
---
from [Dictionary - Date](https://github.com/newkayak12/Dictionary/blob/master/sql/12.Date.md)



# 날짜 관련
```mysql
set @now := current_timestamp();
set @now := '2024-02-01 17:15:34';
select @now from dual;

select week(@now) - week(date_add(@now, interval - day(@now) + 1 day)) + 1 from dual; -- 달의 몇 째주인지
select DAYOFWEEK(@now) from dual; -- 주의 무슨 요일인지 (1 = SUN ~ 7 = SAT )
```
