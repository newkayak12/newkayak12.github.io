---
layout: post
categories: [PROGRAMMERS]
---

# 멀리 뛰기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12914)

> <pre>
> 효진이는 멀리 뛰기를 연습하고 있습니다.
> 효진이는 한번에 1칸, 또는 2칸을 뛸 수 있습니다.
> 칸이 총 4개 있을 때, 효진이는
> 
> (1칸, 1칸, 1칸, 1칸)
> (1칸, 2칸, 1칸)
> (1칸, 1칸, 2칸)
> (2칸, 1칸, 1칸)
> (2칸, 2칸)
> 
> 의 5가지 방법으로 맨 끝 칸에 도달할 수 있습니다.
> 멀리뛰기에 사용될 칸의 수 n이 주어질 때,
> 효진이가 끝에 도달하는 방법이 몇 가지인지 알아내,
> 여기에 1234567를 나눈 나머지를 리턴하는 함수, solution을 완성하세요.
> 
> 예를 들어 4가 입력된다면, 5를 return하면 됩니다.
> 
>   제한 사항
> n은 1 이상, 2000 이하인 정수입니다.
> </pre>

## 알고리즘
1. 모듈러
2. 점화식 세우기

## 풀이 

```java
class LongJump {

    @Nested
    class TestCases{
        @Test
        public void case1 () {
            /**
             * (1칸, 1칸, 1칸)
             * (1칸, 2칸)
             * (2칸, 1칸)
             */
            int n = 3;
            int result = 3;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case2 () {
            /**
             * (1칸, 1칸, 1칸, 1칸)
             * (1칸, 2칸, 1칸)
             * (1칸, 1칸, 2칸)
             * (2칸, 1칸, 1칸)
             * (2칸, 2칸)
             */
            int n = 4;
            int result = 5;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case3 () {
            /**
             * (1칸, 1칸, 1칸, 1칸, 1칸)
             * (2칸, 1칸, 1칸, 1칸)
             * (1칸, 2칸, 1칸, 1칸)
             * (1칸, 1칸, 2칸, 1칸)
             * (1칸, 1칸, 1칸, 2칸)
             * (2칸, 2칸, 1칸)
             * (2칸, 1칸, 2칸)
             * (1칸, 2칸, 2칸)
             */
            int n = 5;
            int result = 8;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case4 () {
            /**
             * (1칸, 1칸, 1칸, 1칸, 1칸, 1칸)
             * (2칸, 1칸, 1칸, 1칸, 1칸)
             * (1칸, 2칸, 1칸, 1칸, 1칸)
             * (1칸, 1칸, 2칸, 1칸, 1칸)
             * (1칸, 1칸, 1칸, 2칸, 1칸)
             * (1칸, 1칸, 1칸, 1칸, 2칸)
             *
             * (2칸, 2칸, 1칸, 1칸)
             * (1칸, 1칸, 2칸, 2칸)
             * (2칸, 1칸, 2칸, 1칸)
             * (1칸, 2칸, 1칸, 2칸)
             * (2칸, 1칸, 1칸, 2칸)
             * (1칸, 2칸, 2칸, 1칸)
             *
             * (2칸, 2칸, 2칸)
             */
            int n = 6;
            int result = 13;

            Assertions.assertEquals(result, solution(n));
        }


    }
    public long solution(int n) {
        return this.check(n, 0, 0, 1);
    }

    private long check ( int n , int count, int prev, int next ) {
        int num = 1_234_567;
        if( n <= count ) return next % num;
        else return this.check(n, count + 1, next % num,  prev % num  + next % num);
    }
}
```