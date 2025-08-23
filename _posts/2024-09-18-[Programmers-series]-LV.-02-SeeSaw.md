---
layout: post
categories: [PROGRAMMERS]
---


# 시소 짝꿍

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/152996)

> <pre>
> 어느 공원 놀이터에는 시소가 하나 설치되어 있습니다.
> 이 시소는 중심으로부터 2(m), 3(m), 4(m) 거리의 지점에 좌석이 하나씩 있습니다.
>
> 이 시소를 두 명이 마주 보고 탄다고 할 때,
> 시소가 평형인 상태에서 각각에 의해 시소에 걸리는
> 토크의 크기가 서로 상쇄되어 완전한 균형을 이룰 수 있다면
> 그 두 사람을 시소 짝꿍이라고 합니다.
>
> 즉, 탑승한 사람의 무게와 시소 축과 좌석 간의
> 거리의 곱이 양쪽 다 같다면 시소 짝꿍이라고 할 수 있습니다.
>
> 사람들의 몸무게 목록 weights이 주어질 때,
> 시소 짝꿍이 몇 쌍 존재하는지 구하여 return 하도록 solution 함수를 완성해주세요.
> </pre>

## 아이디어

1) 공배수? -> Timeout
2) 미리 Map에 결과를 저장하고 있나 없나로 확인하면 어떤가?

## 풀이

```java
 @Nested
    class TestCase {
        @Test
        public void case1 () {
            int[] weights = {100,180,360,100,270};
            int result = 4;

            Assertions.assertEquals(result, solution(weights));
        }

        @Test
        public void case2 () {
            int[] weights = {100,100,100,100,100};
            int result = 10;

            Assertions.assertEquals(result, solution(weights));
        }



    }

    //공배수
    //공배수 나누기 수 -> distance contains -> 짝꿍
    public long solution(int[] weights){

        Arrays.sort(weights);
        int answer = 0;
        Map<Double, Integer> map = new HashMap<>();
        for( int weight : weights ) {


            double oneOnOne = weight*1.0 / 1.0;
            double threeOnTwo = weight*2.0 / 3.0;
            double fourOnTwo = weight*2.0 / 4.0;
            double fourOnThree = weight*3.0 / 4.0;

            answer += map.getOrDefault(oneOnOne, 0);
            answer += map.getOrDefault(threeOnTwo, 0);
            answer += map.getOrDefault(fourOnTwo, 0);
            answer += map.getOrDefault(fourOnThree, 0);


            map.put((weight * 1.0), map.getOrDefault(weight * 1.0, 0) + 1);
        }



        return answer ;
    }
```