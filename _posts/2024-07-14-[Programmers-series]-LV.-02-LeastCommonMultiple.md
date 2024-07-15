---
layout: post
categories: [PROGRAMMERS]
---


# N개의 최소공배수

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12953)

> <pre>
> 두 수의 최소공배수(Least Common Multiple)란 입력된 두 수의 배수 중
> 공통이 되는 가장 작은 숫자를 의미합니다.
> 
> 예를 들어 2와 7의 최소공배수는 14가 됩니다.
> 정의를 확장해서, n개의 수의 최소공배수는 n 개의 수들의 배수 중
> 공통이 되는 가장 작은 숫자가 됩니다. n개의 숫자를 담은 배열 arr이 입력되었을 때
> 이 수들의 최소공배수를 반환하는 함수, solution을 완성해 주세요.
> 
> 제한 사항
> - arr은 길이 1이상, 15이하인 배열입니다.
> - arr의 원소는 100 이하인 자연수입니다.
> </pre>


## 알고리즘

### 최대 공약수(Greatest Common Divisor: GCD)
공약수 중 가장 큰 것

#### 유클리드 호제법
2개의 자연수의 최대 공약수를 구하는 알고리즘의 하나다. 두 수가 서로 상대방 수를 나눠서 결국 원하는 수를 얻는 알고리즘을 나타낸다.
`(a > b일 떄) a를 b로 나눈 나머지를 r이라고 하면 a, b의 최대 공약수는 b와 r의 최대 공약수와 같다`는 성질을 이용한 방식이다.

```java
public int gcd( int a, int b ) {
        if( a % b == 0 ) return b;
        else return gcd(b, a % b);
}
```

### 최소 공배수(Least Common Multiple: LCM)
두 자연수들의 배수들 중에서 공통된 가장 작은 수 

```java
public int lcm( int a, int b ) {
        return ( a * b ) / gcd(a, b);
}
```


## 풀이

````java
class LeastCommonMultiple {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            int[] arr = {2,6,8,14};
            int result = 168;

            Assertions.assertEquals(result, solution(arr));
        }

        @Test
        public void case2 () {
            int[] arr = {1,2,3};
            int result = 6;

            Assertions.assertEquals(result, solution(arr));
        }
    }

    public int solution( int[] arr ) {
        Arrays.sort(arr);


        int number = lcm(arr[0], arr[1]);
        for( int i = 2; i < arr.length; i ++ ) {
            number = lcm(number, arr[i]);
        }
        return number;
    }
    
    public int gcd( int a, int b ) {
        if( a % b == 0 ) return b;
        else return gcd(b, a % b);
    }

    public int lcm( int a, int b ) {
        return ( a * b ) / gcd(a, b);
    }
}
````