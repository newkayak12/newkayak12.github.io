---
layout: post
categories: [PROGRAMMERS]
---

# 피보나치 수


> <pre>
> 피보나치 수는 F(0) = 0, F(1) = 1일 때, 1 이상의 n에 대하여 F(n) = F(n-1) + F(n-2) 가 적용되는 수 입니다.
> 
> 예를들어
> F(2) = F(0) + F(1) = 0 + 1 = 1
> F(3) = F(1) + F(2) = 1 + 1 = 2
> F(4) = F(2) + F(3) = 1 + 2 = 3
> F(5) = F(3) + F(4) = 2 + 3 = 5
> 
> 와 같이 이어집니다.
> 2 이상의 n이 입력되었을 때, n번째 피보나치 수를 1234567으로 나눈 나머지를 리턴하는 함수,
> solution을 완성해 주세요.
> 
> 제한 사항
> n은 2 이상 100,000 이하인 자연수입니다.
> </pre> 

## 알고리즘
재귀, for, modulo

## 풀이

```java
class Fibonacci {
    @Nested
    class TestCase {
        @Test
        public void case1 () {
            int n = 3;
            int result = 2;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case2 () {
            int n = 5;
            int result = 5;
            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case3 () {
            int n = 100_000;
            int result = 174725;
            Assertions.assertEquals(result, solution(n));
        }
    }

    public int solution( int n ){
        return (int)(this.noRecursive(n) % 1234567);
    }
//    private long recursive(int n ) { //숫자가 커지면 StackOverflow
//        if (n <= 0) return 0;
//        else if (n == 1) return 1;
//        else return fibonacci((n - 1)) + fibonacci((n - 2));
//    }
    private long noRecursive ( int n ) {
        long i = 1;

        long now = 0;
        long next = 1;

        while ( i < n ) {
            long tmp = next;
            next += now;
            now = tmp;

            i++;
        }


        return next;
    }
}
```