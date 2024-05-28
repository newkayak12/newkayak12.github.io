---
layout: post
categories: [PROGRAMMERS]
---


# 콜라 문제 

[programmers](https://school.programmers.co.kr/learn/courses/30/lessons/132267)

> 정답은 아무에게도 말하지 마세요.
> 콜라 빈 병 2개를 가져다주면 콜라 1병을 주는 마트가 있다.
> 빈 병 20개를 가져다주면 몇 병을 받을 수 있는가?
> 단, 보유 중인 빈 병이 2개 미만이면, 콜라를 받을 수 없다.
> 
> 콜라 빈 병 20병을 가져가서 10병을 받습니다.
> 받은 10병을 모두 마신 뒤, 가져가서 5병을 받습니다.
> 5병 중 4병을 모두 마신 뒤 가져가서 2병을 받고,
> 또 2병을 모두 마신 뒤 가져가서 1병을 받습니다.
> 받은 1병과 5병을 받았을 때 남은 1병을 모두 마신 뒤 가져가면 1병을 또 받을 수 있습니다.
> 
> 이 경우 상빈이는 총 10 + 5 + 2 + 1 + 1 = 19병의 콜라를 받을 수 있습니다.
> 
> 콜라를 받기 위해 마트에 주어야 하는 병 수 a,
> 빈 병 a개를 가져다 주면 마트가 주는 콜라 병 수 b,
> 상빈이가 가지고 있는 빈 병의 개수 n이 매개변수로 주어집니다.
> 상빈이가 받을 수 있는 콜라의 병 수를 return 하도록 solution 함수를 작성해주세요.
 

## 알고리즘
모듈러 연산

## 풀이

```java
@Nested
class TestCases {
    @Test
    public void case1 () {
        int a = 2;  // 가져다 주는 빈 병 수
        int b = 1;  // 빈 병을 가져다 주면 주는 콜라 수
        int n = 20; // 빈 병
        int expected = 19;
        Assertions.assertEquals(expected, solution(a, b, n));
    }

    @Test
    public void case2 () {
        int a = 3;  // 가져다 주는 빈 병 수
        int b = 1;  // 빈 병을 가져다 주면 주는 콜라 수
        int n = 20; // 빈 병
        int expected = 9;
        Assertions.assertEquals(expected, solution(a, b, n));

    }

    public int solution( int a, int b, int n ) {
        int answer = 0;
        
        int coke = n;
        while( true ) {
            if( coke < a ) break;
            
            int remain = coke % a;
            int replace = (coke / a) * b;
            
            answer += replace;
            coke = remain + replace;
        }
        
        return answer;
    }
}
```