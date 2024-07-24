---
layout: post
categories: [PROGRAMMERS]
---


# 짝지어 제거하기

[//]: # (retry)

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12973)

> <pre>
> 짝지어 제거하기는, 알파벳 소문자로 이루어진 문자열을 가지고 시작합니다.
> 먼저 문자열에서 같은 알파벳이 2개 붙어 있는 짝을 찾습니다.
> 그다음, 그 둘을 제거한 뒤, 앞뒤로 문자열을 이어 붙입니다.
> 이 과정을 반복해서 문자열을 모두 제거한다면 짝지어 제거하기가 종료됩니다.
> 문자열 S가 주어졌을 때, 짝지어 제거하기를 성공적으로 수행할 수 있는지 반환하는 함수를 완성해 주세요.
> 성공적으로 수행할 수 있으면 1을, 아닐 경우 0을 리턴해주면 됩니다.
>
>
> 예를 들어, 문자열 S = baabaa 라면
>
> b aa baa → bb aa → aa →
> 의 순서로 문자열을 모두 제거할 수 있으므로 1을 반환합니다.
>
> 제한사항
>  - 문자열의 길이 : 1,000,000이하의 자연수
>  - 문자열은 모두 소문자로 이루어져 있습니다.
> </pre>

## 알고리즘
스택 사용

## 풀이

```java
class MatchAndRemove {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            String s = "baabaa";
            int result = 1;
            Assertions.assertEquals(result, solution(s));
        }

        @Test
        public void case2 () {
            String s = "cdcd";
            int result = 0;

            Assertions.assertEquals(result, solution(s));
        }
    }

    public int solution( String s ) {
        if( s.length() % 2 != 0) return 0;

        String target = s;
        while( true ) {
            if( target.length() == 0 ) break;
            Stack<Character> stack = new Stack<>();
            stack.push(s.charAt(0));
            int count = 0;

            for( int i = 1; i < target.length(); i ++ ) {
                if( !stack.isEmpty() && stack.peek() == target.charAt(i) ) {
                    stack.pop();
                    count += 1;
                }
                else {
                    stack.push(target.charAt(i));
                }
            }

            if( count == 0 ) break;
            target = stack.stream().map(String::valueOf).collect(Collectors.joining());
        }


        return target.length() == 0 ? 1 : 0;
    }
}
```