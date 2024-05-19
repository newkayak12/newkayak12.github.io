from [Dictionary - YAML](https://github.com/newkayak12/Dictionary/blob/master/java/21.YAML.md)

# YAML(Yet Another Markup Language)
기존에 주로 사용되던 포맷인 JSON의 불편함을 해소하기 위해 만들어진 superset이다. (확장자만 바꿔도 JSON -> YAML로 변환된다. )

## 데이터 정의
1. Key:Value 표기
2. 콤마 표기하지 않음
3. indent로 계층 구조를 표현
4. 따옴표 (굳이 쓰지 않아도 된다.)
5. 작은 따옴표, 큰 따옴표 -> 이스케이필 문자를 구분해야하면, 큰 따옴표는 escapeSequence, 작은 따옴표는 그대로 문자열로 처리한다.

## 배열 & 리스트
1. `-`으로 하위 엘리먼트 표현
2. 객체 배열이 필요하다면 객체 시작에만 `-`를 사용한다.
```yaml
students:
  - name: Mark
    major: Math
    age: 20
  - name: Julie
    major: Arts
    age: 23
  - name: Tommy
    major: Music
    age: 25
```
3. Boolean : yes/no, true/false를 boolean으로 구문한다. case insensitive다.
4. 변수 선언 : `&`으로 변수 선언하고 `*`으로 참조한다.

```yaml
default: &default_school # default_school 라는 변수를 선언하고, 그 내용은 group 과 description 데이터를 지니고 있다
   group: '서울대학교'
   description: |
      서울에 위치하는 대한민국 대학교!

student:
   - name: '홍길동'
     <<: *default_school # default_school 변수 내용물을 대입한다
   - name: '임꺽정'
     <<: *default_school # default_school 변수 내용물을 대입한다
```