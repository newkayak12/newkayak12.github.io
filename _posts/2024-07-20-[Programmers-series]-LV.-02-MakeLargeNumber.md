---
layout: post
categories: [PROGRAMMERS]
---

# 큰 수 만들기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42883)

[//]: # (retry)

> <pre>
> 어떤 숫자에서 k개의 수를 제거했을 때 얻을 수 있는 가장 큰 숫자를 구하려 합니다.
> 예를 들어, 숫자 1924에서 수 두 개를 제거하면
> [19, 12, 14, 92, 94, 24] 를 만들 수 있습니다.
> 이 중 가장 큰 숫자는 94 입니다.
> 
> 문자열 형식으로 숫자 number와 제거할 수의
> 개수 k가 solution 함수의 매개변수로 주어집니다.
> number에서 k 개의 수를 제거했을 때 만들 수 있는 수 중
> 가장 큰 숫자를 문자열 형태로 return 하도록 solution 함수를 완성하세요.
> 
>  제한 조건
>  - number는 2자리 이상, 1,000,000자리 이하인 숫자입니다.
>  - k는 1 이상 number의 자릿수 미만인 자연수입니다.
> </pre>

## 알고리즘
스택 사용 

쭉 순회하면서 이전의 수와 비교하는 방식으로 진행
스택에 넣고 스택보다 이번 수가 크면 스택을 pop하고 이번 수를 스택에 넣는 방식으로 진행

## 풀이

```java
class MakeLargeNumber {
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            String number = "1924";
            int k = 2;
            String result = "94";
            /**
             * 1924 -> 2개를 지운다.
             * 1회차-----------
             * 가장 큰 숫자를 찾는다. 9
             *      9 전의 숫자만큼 지운다. 924
             *      remove Count를 지운 만큼 줄인다. 1
             *      9 이후의 숫자를 넘긴다.
             *      9를 저장한다.
             *
             * save [9] next 24
             * 2회차-----------
             * 가장 큰 숫자를 찾는다. 4
             *
             */

            Assertions.assertEquals(result, solution(number, k));
        }

        @Test
        public void case2() {
            String number = "1231234";
            int k = 3;
            String result = "3234";

            Assertions.assertEquals(result, solution(number, k));
        }

        @Test
        public void case3() {
            String number = "4177252841";
            int k = 4;
            String result = "775841";

            Assertions.assertEquals(result, solution(number, k));
        }
    }
    public String solution(String number, int k) {

        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < number.length(); i ++ ) {
            char now = number.charAt(i);

            while( true ) {
                if( stack.isEmpty()) break;
                if( stack.peek() >= now ) break;
                if( k - 1 < 0 ) break;
                stack.pop();
                k -= 1;
            }

            stack.add(now);
        }


        return stack.stream().map(String::valueOf).reduce((p, n) -> p+n).get();
    }
}
```