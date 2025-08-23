---
layout: post
categories: [PROGRAMMERS]
---



# JadenCase 문자열 만들기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12951)

>
>  <pre>
> 
> JadenCase란 모든 단어의 첫 문자가 대문자이고,
> 그 외의 알파벳은 소문자인 문자열입니다.
> 
> 단, 첫 문자가 알파벳이 아닐 때에는 이어지는 알파벳은 소문자로 쓰면 됩니다. (첫 번째 입출력 예 참고)
> 문자열 s가 주어졌을 때, s를 JadenCase로 바꾼 문자열을 리턴하는 함수, solution을 완성해주세요.
> 
> 제한 조건
> - s는 길이 1 이상 200 이하인 문자열입니다.
> - s는 알파벳과 숫자, 공백문자(" ")로 이루어져 있습니다.
> - 숫자는 단어의 첫 문자로만 나옵니다.
> - 숫자로만 이루어진 단어는 없습니다.
> - 공백문자가 연속해서 나올 수 있습니다.
> </pre>

## 알고리즘



## 풀이

```java
class JadenCase {
    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            String s = "3people unFollowed me";
            String result = "3people Unfollowed Me";

            Assertions.assertEquals(result,solution(s));
        }

        @Test
        public void case2 () {
            String s = "for the last week";
            String result = "For The Last Week";

            Assertions.assertEquals(result,solution(s));
        }
    }

    public String solution( String s ) {

        StringBuilder builder = new StringBuilder();
        char[] charArray = s.toCharArray();
        for( int i = 0; i < charArray.length; i ++  ) {
            if(i == 0 || charArray[i - 1] == ' ') builder.append(Character.toUpperCase(charArray[i]));
            else builder.append(Character.toLowerCase(charArray[i]));
        }

        return builder.toString();
    }
}
```