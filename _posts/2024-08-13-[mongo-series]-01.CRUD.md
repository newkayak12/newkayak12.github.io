---
layout: post

categories: [MONGO]
---


# CRUD


## 생성
- show dbs (SHOW DATABASES;) : db list
- db (SELECT DATABASE();) : 현재 사용 중인 DB 출력
- db.stats() : 현재 사용하고 있는 db 정보 출력
- use database (USE database) : db 선택
- db.dropDatabase() (DROP database) : drop



## 컬렉션 명령어
- db.createCollection("name", {capped:true, size:6142800, max:10000) (create table name ();)

| field  |  type   |           description           |
|:------:|:-------:|:-------------------------------:|
| capped | boolean |     고정된 크기를 가진 컬렉션을 만들 것인가      |
|  size  | number  | 컬렉션 최대 사이즈(capped=true 일 경우 필수) |
|  max   | number  |           최대 도큐먼트 세트            |


- show collections() (SHOW CREATE TABLE [tableName])
- db.[collectionName].drop() (DROP TABLE [tableName])

### Projection
- 원하는 키, 값만 가져오는 것을 의미한다.
- project을 하면 용량이 준다.

```javascript
db.[tableName].find({/*조건*/}, {"_id": false, "name": true, "hits":true, "author":{$slice: 1}})
```

### _id
도큐먼트의 PK다. 도큐먼트가 생성될 때 이 필드가 없으면 묵시적으로 생성해서 자동으로 추가한다.


## 수정

1. update

- 기본적으로 single 업데이트
- $set으로 해야 도큐먼트롤 통으로 덮어쓰지 않고 일부 key에만 업데이트할 수 있다.

```javascript
db.table.update ({hits: 110}, {$set: {hits: 120}}, {
    usert: true /** 없으면 insert 아니면 update **/, 
    multi: true /** 대량 업데이트 여부 false면 최초 한 개만 업데이트 **/
})

// $set 이외 $unset으로 지울 수도 있다.


db.array.update({name:"F"}, {
    $push:{category: "science"}, //Array에 삽입 (통 업데이트 없이)
    $pull:{category:"science"}//Array에서 제거  (통 업데이트 없이)
    
    //$addToSet은 중복을 확인하고 Array에 삽입한다.
})
```

2. updateOne
- 매칭되는 도큐먼트 중 첫 번째만 수정

3. updateMany
- 매칭되는 모든 도큐먼트를 수정 {multi:true}

4. replaceOne
- 도큐먼트를 통으로 교체

> 5.0이후로 Deprecated! 
> 
> 5. FindAnyModify

[//]: # (> - select from for update와 비슷한 느낌이다.)
> - mongo는 여러 명령을 트랜잭션으로 묶을 수 없어서 자주 사용하지는 않지만 유용하다.
> 
> ```javascript
> db.target.findAndModify({
>     query: {}, // 조건
>     update:{}, //업데이트
>     new:true //수정 이전, 이후 중 어떤 것을 반환할지 결정
> })
> ```
>

5. FindOneAndUpdate(filter, update, options)/ FindOneAndReplace(filter, replacement, options)
- findAndModify를 쪼개 놓은 메소드들 이다.

## 삭제

```javascript
db.target.remove({/** query **/})
```

1. deleteOne : 처음 매칭되는 하나의 도큐먼트만 삭제
2. deleteMany : 매칭되는 모든 도큐먼트를 지움
=======
## 도큐먼트 명령어

- insert : 단일, 다수의 Document 입력에 사용한다. 컬렉션이 존재하지 않으면 자동으로 생성하고 insert한다.

```javascript
// 단일
db.apple.insert({"model":"iPhone"})

// 다수
db.apple.insert({"model":"iPhone"}, {"model": "iPad"})
```

- insertOne : 단일 Document 입력에 사용

```javascript
// 단일
db.apple.insertOne({"model":"iPhone"})
```

- insertMany : 다중 Document 입력에 사용

```javascript
// 다수
db.apple.insertMany({"model":"iPhone"}, {"model": "iPad"})
```


## 조회

- `find({조건}, {projection})` : 리스트를 확인

```javascript
//리스트
db.appe.find().pretty();

//조건
db.appe.find({"model":{$eq:"iphone"}}).pretty();
```

### 논리 연산자

- `{key: {$gt: value}}`  :  graterThan
- `{key: {$lt: value}}`  :  lessThan
- `{key: {$gte: value}}`  :  graterOrEqual
- `{key: {$lte: value}}`  :  lessOrEqual
- `{key: {$eq: value}}` : equal
- `{key: {$ne: value}}` : not equal
- `{key: {$in: [value1, value2, value3]}}` : in
- `{key: {$nin: [value1, value2, value3]}}` : not 
- `{key: {$and: [{조건1}, {조건2}]}}` : and 
- `{key: {$or: [{조건1}, {조건2}]}}` : or
- `{key: {$nor: [{조건1}, {조건2}]}}` : or
- `{key: {$not: {조건}}}` : not


### 정규표현식

- `{key: {$regx: /[regex]/, $options:["g","i"]}}` : 정규표현식을 사용해서 검색


### 조건(Js)

자바스크립트를 사용해서 검색할 수 있다. `this`를 사용해야 한다.

- `{$where: "this.model === 'Iphone'}`

### 정렬
1은 asc, -1은 desc

- `sort({model: 1})`

```js
db.apple.find().sort({model: 1}).pretty()
```
    
