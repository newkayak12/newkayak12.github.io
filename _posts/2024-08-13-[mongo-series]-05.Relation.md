---
layout: post

categories: [MONGO]
---


# 관계

기본적으로 RDB과 다르게 몽고는 관계성에 중점을 두지는 않았다. 
그렇지만 컬렉션 간 관계를 바탕으로 데이터를 조회해야할 때가 있다. 두 가지 밥법이 있다.


1. Embedded : 다른 도큐먼트를 포함해서 한 도큐먼트에 통째로 저장하는 방법이다.

```mongodb-json
{
    _id: "xxxxxxx",
    name: "newkayak",
    address : {
        city: "seoul",
        gu: "sungdong-gu",
        dong: "haengdangdong"
    }
}
```

  - 장점
    1. 수정이 용이하다.
    2. 한 번의 쿼리로 모두 찾아올 수 있다.
    3. 읽기 속도가 빠르다.
  - 단점
    1. 일관성 유지가 어렵다.
    2. document 사이즈가 커진다.
    3. document 사이즈 제한이 있으므로 사이즈가 커질 때마다 블록을 옮겨야 해서 단편화가 생길 수 있다.


2. Reference : Pointer 개념으로 참조할 수 있는 아이디를 저장하는 방법이다.

```mongodb-json
//user
{
    _id: "xxxxxxx",
    name: "newkayak",
}
//city
{
    _id: "SEOUL_XXX~",
    user_id: "xxxxxxx",
    city: "seoul",
    gu: "sungdong-gu",
    dong: "haengdangdong"
}
```

  - 장점
    1. 일관성 유지가 쉽다.
  - 단점
    1. 외래키 같이 다른 쪽 키를 소유하고 있어야만 한다.
    2. 반복된 조회로 퍼포먼스가 떨어질 수 있다.