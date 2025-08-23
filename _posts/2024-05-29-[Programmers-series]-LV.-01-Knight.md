---
layout: post
categories: [PROGRAMMERS]
---


# 숫자나라 기사단

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/136798)

> <pre>
> 숫자나라 기사단의 각 기사에게는 1번부터 number까지 번호가 지정되어 있습니다.
> 기사들은 무기점에서 무기를 구매하려고 합니다.
> 
> 각 기사는 자신의 기사 번호의 약수 개수에 해당하는 공격력을 가진 무기를 구매하려 합니다.
> 
> 단, 이웃나라와의 협약에 의해 공격력의 제한수치를 정하고,
> 제한수치보다 큰 공격력을 가진 무기를 구매해야 하는 기사는
> 협약기관에서 정한 공격력을 가지는 무기를 구매해야 합니다.
> 
> 예를 들어, 15번으로 지정된 기사단원은
> 15의 약수가 1, 3, 5, 15로 4개 이므로,
> 공격력이 4인 무기를 구매합니다.
> 
> 만약, 이웃나라와의 협약으로 정해진 공격력의 제한수치가 3이고
> 제한수치를 초과한 기사가 사용할 무기의 공격력이 2라면,
> 15번으로 지정된 기사단원은 무기점에서 공격력이 2인 무기를 구매합니다.
> 무기를 만들 때, 무기의 공격력 1당 1kg의 철이 필요합니다.
> 그래서 무기점에서 무기를 모두 만들기 위해 필요한 철의 무게를 미리 계산하려 합니다.
> 
> 기사단원의 수를 나타내는 정수 number와 이웃나라와
> 협약으로 정해진 공격력의 제한수치를 나타내는 정수 limit와
> 제한수치를 초과한 기사가 사용할 무기의 공격력을 나타내는 정수 power가 주어졌을 때,
> 무기점의 주인이 무기를 모두 만들기 위해 필요한
> 철의 무게를 return 하는 solution 함수를 완성하시오.
> </pre>

## 알고리즘

1. 단순 순회 및 약수 구하기(O₍n₎)

```java
    int number = 1000000000;

    int count = 0;
    for(int i = 1; i <= number; i++) {
        if (number % i == 0) count++;
    }
```
 
목표 숫자까지 `나머지 연산(modulo)` 연산을 해서 나머지가 0이면 약수로 판별한다.


2. 순회 수 줄이기 (O₍√n₎)

대상 숫자( ex) 100 )의 제곱근인 10까지 순회를 하며, 순회 중인 숫자(i)의 제곱이 대상 숫자( ex) 100) 이면 개수가 하나
나머지 연산을 해서 나머지가 0이면 약수가 2개 임에서 착한해서 확인한다.

```java
    int number = 1000000000;

    int count = 0;
    for(int i = 1; i * i <= number; i++) {
        if ( i * i == number ) count += 1; 
        else if (number % i == 0) count += 2;
    }
```



## 풀이

```java
class Knights {
    @Nested
    class TestCases {
        @Test
        public void case1 () {

            int number = 5;
            int limit = 3;
            int power = 2;
            int result = 10;

            Assertions.assertEquals(result, solution(number, limit, power));
        }

        @Test
        public void case2 () {
            int number = 10;
            int limit = 3;
            int power = 2;
            int result = 21;

            Assertions.assertEquals(result, solution(number, limit, power));
        }
    }

    public int solution ( int number, int limit, int power ) {
        int answer = 0;
        for (int num = 1; num <= number; num ++ ) {

            int count = 0;

            for( int i = 1; i * i <= num; i ++) {
                if( i * i == num ) count += 1;
                else if ( num % i == 0 ) count += 2;
            }

            if( count > limit ) answer += power;
            else answer += count;
        }


        return answer;
    }
}

```