---
layout: post
categories: [PROGRAMMERS]
---


# 3 x n 타일링

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12902?language=java)


 > <pre>
 > 가로 길이가 2이고 세로의 길이가 1인 직사각형 모양의 타일이 있습니다. 이 직사각형 타일을 이용하여 세로의 길이가 3이고 가로의 길이가 n인 바닥을 가득 채우려고 합니다. 타일을 채울 때는 다음과 같이 2가지 방법이 있습니다
 >      - 타일을 가로로 배치 하는 경우
 >      - 타일을 세로로 배치 하는 경우
 > 예를들어서 n이 8인 직사각형은 다음과 같이 채울 수 있습니다.
 > </pre>
> 
 >   <table>
 >      <tr>
 >          <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >          <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >          <td style="border: 1px green solid; width:20px;"></td>
 >          <td style="border: 1px green solid; width:20px;" colspan="2"></td>
 >          <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >          <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >      </tr>
 >       <tr>
 >           <td style="border: 1px green solid; width:20px;"></td>
 >           <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >           <td style="border: 1px green solid; width:10px;" rowspan="2"></td>
 >       </tr>
 >       <tr>
 >           <td style="border: 1px green solid; width:20px;" colspan="2"></td>
 >           <td style="border: 1px green solid; width:20px;"></td>
 >           <td style="border: 1px green solid; width:20px;" colspan="2"></td>
 >       </tr>
 >  </table>
> 
 > <pre>
 > 직사각형의 가로의 길이 n이 매개변수로 주어질 때, 이 직사각형을 채우는 방법의 수를 return 하는 solution 함수를 완성해주세요.
> 
 > 제한사항
 >  - 가로의 길이 n은 5,000이하의 자연수 입니다.
 >  - 경우의 수가 많아 질 수 있으므로, 경우의 수를 1,000,000,007으로 나눈 나머지를 return해주세요.
 > </pre>

## 아이디어
음 일반적으로는 정말 알아내기 어려울 것으로 보인다. 실제로 [여기](https://taehoung0102.tistory.com/190)를 참고 했다.
점화식일 것으로는 보였으나 

1. 점화식을 알아내기가 어려웠다.( 이에 대해서는 적은 케이스로 예측하고 진행한다고는 한다.)
2. 모듈러 분배법칙이 생소했다. (실제로 `(A - B) % M`이 `( (A%M) - (B%M) + M) % M`이 된다는 부분에서 `+ M`이 이해가 안되긴한다.)

라는 어려운 부분이 있다. 

[modulo 정리](../../algorithm/arithmetic/Modulo.md)


## 풀이


```java
class ThreeOnNTile {
    @Nested
    class TestCases {

        @Test
        void modulo () {
            System.out.println(-10 % 2);
        }

        @Test
        public void case1 () {
            int n = 2;
            int result = 3;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case2 () {
            int n = 4;
            int result = 11;

            Assertions.assertEquals(result, solution(n));
        }

        @Test
        public void case3 () {
            int n = 6;
            int result = 41;

            Assertions.assertEquals(result, solution(n));
        }
    }


    public long solution ( int n ) {
        int[] arr = new int[5001];
        int mod = 1_000_000_007;
        arr[0] = 1;
        arr[2] = 3;
        /**
         * 0 = 1
         * 2 = 3
         * 4 = 11 (3 * 3 + 2)
         * 6 = 41 (3 * 3 * 3 + (2 * 3 * 2) + 2)
         *
         * f(n) = f(n - 2) * 4 - f(n - 4)
         *
         */


        for ( int i = 4; i <= n; i +=2 ) {
            arr[i] = ( (arr[i - 2] * 4) % mod -  (arr[i - 4] % mod) + mod) % mod;
            if( arr[i] < 0 ) arr[i] = (arr[i] +  mod) % mod;
        }


        return arr[n];
    }
}
```
