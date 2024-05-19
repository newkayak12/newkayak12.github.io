from [Dictionary - Split vs StringTokenizer](https://github.com/newkayak12/Dictionary/blob/master/java/20.StringAndTokenizer.md)

# Split vs. StringTokenizer
## 1. Split
정규식을 받는 메소드와, 정규식 + 인덱스를 받는 메소드 두 개가 오버로딩되어 있다.
```java
class String {
    public String[] split(String regex);
// 반환을 String 배열로 받는다.
// 구분 기호를 문자열이 아닌 정규표현식으로 받는다. (중요)

    public String[] split(String regex, int limit);
// 문자열을 정규식에 맞춰서 분리하는데 limit만큼 문자열을 자른다.
}
```
## 2. StringTokenizer
구분자를 기준으로 토큰이라는 여러 개의 문자열로 잘라내는데 사용한다.
````java
// 문자열을 공백 문자를 구분자로 자르기
new StringTokenizer(String str)


// 문자열을 매개변수로 지정된 구분자(delim)로 자르기
// 이때 구분자는 토큰으로 간주되지 않음
new StringTokenizer(String st, String delim)


// 문자열을 매개변수로 지정된 구분자(delim)로 자르기
// returnDelims 의 값을 true로하면 구분자도 토큰으로 간주
new StringTokenizer(String str, String delim, boolean returnDelims)
````

## 결론적으로 split vs. StringTokenizer

- split 메소드는 String클래스에 속해있는 메소드이고, StringTokenizer는 java.util에 포함되어 있는 클래스이다.
- 구분자를 split는 정규 표현식으로 구분하고, StringTokenizer는 문자로 받는다.
- split는 결과 값이 문자열 배열이지만, stringtokenizer는 객체이다.
- split는 빈문자열을 토큰으로 인식하는 반면, StringTokenizer는 빈 문자열을 토큰으로 인식하지 않는다.
- 성능은 split 보다 StringTokenizer 가 좋다.
- split은 데이터를 토큰으로 잘라낸 결과를 배열에 담아서 반환하기 때문에 StringTokenizer 보다 성능이 떨어진다.
- 그러나 데이터의 양이 많은 경우가 아니라면 별 문제가 되지 않는다.
