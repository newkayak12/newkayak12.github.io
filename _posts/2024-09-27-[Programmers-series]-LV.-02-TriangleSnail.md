---
layout: post
categories: [PROGRAMMERS]
---


# 삼각 달팽이
[Programmers]( https://school.programmers.co.kr/learn/courses/30/lessons/68645 )

> <pre>
> 정수 n이 매개변수로 주어집니다.
> 다음 그림과 같이 밑변의 길이와 높이가 n인 삼각형에서 맨 위
> 꼭짓점부터 반시계 방향으로 달팽이 채우기를 진행한 후,
> 첫 행부터 마지막 행까지 모두 순서대로 합친 새로운 배열을
> return 하도록 solution 함수를 완성해주세요.
> 
> 
>          1
>        2   9
>     3   10   8
>   4   5   6    7
> 
>       n = 4
> 
>             1
>           2  12
>        3   13   11
>     4   14   15   10
>  5    6    7    8    9
> 
>       n = 5
>              1
>           2   18
>         3    19  17
>       4   20  27  16
>     5  21  28  26   15
>    6  22  23  24  25  14
>  7  8   9   10  11  12  13
>      n =7
> 
>      7 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1
> 
>      7 + 6 + 5 -> 18
>      18+ 4 + 3 + 2 -> 27
> 
> </pre>
> <p>
> <p>
> 맨 왼쪽 n 까지 + 1
> 맨 아래 n ~ n + n - 1

## 아이디어
1. 점화식 도출? -> 알 수 없음
2. 직접 회전하면서 숫자를 찍는 것 

결과적으로 삼각형변을 따라서 하나씩 수를 찍는 것으로 풀이

## 풀이

```java
class TriangleSnail {
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            int n = 4;
            int[] result = {1, 2, 9, 3, 10, 8, 4, 5, 6, 7};
            /**
             * <pre>
             *     1
             *     2 9
             *     3 10  8
             *     4  5  6  7
             * </pre>
             */
            Assertions.assertArrayEquals(result, solution(n));
//            Assertions.assertArrayEquals(result, solutionSecond(n));
        }

        @Test
        public void case2() {
            int n = 5;
            int[] result = {1, 2, 12, 3, 13, 11, 4, 14, 15, 10, 5, 6, 7, 8, 9};

            /**
             * <pre>
             *     1
             *     2 12
             *     3 13 11
             *     4 14 15 10
             *     5  6  7  8  9
             * </pre>
             */
            Assertions.assertArrayEquals(result, solution(n));
//            Assertions.assertArrayEquals(result, solutionSecond(n));
        }

        @Test
        public void case3() {
            int n = 6;
            int[] result = {1, 2, 15, 3, 16, 14, 4, 17, 21, 13, 5, 18, 19, 20, 12, 6, 7, 8, 9, 10, 11};

            /**
             * <pre>
             *     1
             *     2 15
             *     3 16 14
             *     4 17 21 13
             *     5 18 19 20 12
             *     6  7  8  9 10 11
             * </pre>
             */
            Assertions.assertArrayEquals(result, solution(n));
//            Assertions.assertArrayEquals(result, solutionSecond(n));
        }
    }

    public int[] solution(int n) {
        /**
         * 1 (0, 0)
         * 2 (1, 0) 9  (1, 1)
         * 3 (2, 0) 10 (2, 1)  8 (2, 2)
         * 4 (3, 0) 5  (3, 1)  6 (3, 2) 7 (3, 3)
         *
         * 1
         * 2 12
         * 3 13 11
         * 4 14 15 10
         * 5  6  7  8  9
         *
         * 1
         * 2 15
         * 3 16 14
         * 4 17 21 13
         * 5 17 19 20 12
         * 6  7  8  9 10 11
         */


        //정 못찾겠으면 그냥 해봐야

        int[][] triangle = new int[n][n];
        int y = -1;
        int x = 0;
        int number = 1;

        for( int i = n; i > 0; i -= 3) {
            for( int j = 0; j < i; j ++)  triangle[++y][x] = number++;
            for( int j = 0; j < i - 1; j ++ ) triangle[y][++x] = number++;
            for( int j = 0; j < i - 2; j ++ ) triangle[--y][--x] = number++;
        }

        return  Arrays.stream(triangle).flatMap(i -> Arrays.stream(i).boxed()).filter(i -> i!=0).mapToInt(i -> i).toArray();
    }
}
```



## 추가 - 사각 달팽이
삼각 달팽이과 같은 설정 + 사각형으로 도는 것을 예시로 풀이

### 풀이
```java
class  SquareSnail {
        @Test
        public void case1 () {
            /**
             * 1 4
             * 2 3
             */
            int n = 2;
            int[] result = {1,4,2,3};

            Assertions.assertArrayEquals(result, solution(n));
        }
        @Test
        public void case2 () {
            /**
             * 1 8 7
             * 2 9 6
             * 3 4 5
             */
            int n = 3;
            int[] result = {1,8,7, 2,9,6, 3,4,5};


            Assertions.assertArrayEquals(result, solution(n));
        }

        @Test
        public void case3 () {
            /**
             * 1  12  11  10
             * 2  13  16   9
             * 3  14  15   8
             * 4   5   6   7
             */
            int n = 4;
            int[] result = {1,12, 11, 10, 2, 13, 16, 9, 3, 14, 15, 8, 4, 5, 6, 7};


            Assertions.assertArrayEquals(result, solution(n));
        }

        @Test
        public void case4 () {
            /**
             * 1  20 19 18 17  16
             * 2  21 32 31 30  15
             * 3  22 33 36 29  14
             * 4  23 34 35 28  13
             * 5  24 25 26 27  12
             * 6  7  8  9  10  11
             */
            int n = 6;
            int[] result = {
                    1, 20 ,19 ,18 ,17 ,16,
                    2, 21 ,32 ,31 ,30 ,15,
                    3, 22 ,33 ,36 ,29 ,14,
                    4, 23 ,34 ,35 ,28 ,13,
                    5, 24 ,25 ,26 ,27 ,12,
                    6, 7  ,8  ,9  ,10 ,11
            };


            Assertions.assertArrayEquals(result, solution(n));
        }


        public int[] solution( int n  ) {

            int[][] square = new int[n][n];
            int number = 1;
            int x = 0;
            int y = -1;

            for( int side = n; side > 0; side -= 2 ) {
                for( int i = 0; i < side; i ++ )  square[++y][x] = number++;
                for( int i = 0; i < side - 1; i ++ ) square[y][++x] = number++;
                for( int i = 0; i < side - 1; i ++ ) square[--y][x] = number++;
                for( int i = 0; i < side - 2; i ++ ) square[y][--x] = number++;
            }


            return Arrays.stream(square).flatMapToInt(ints -> Arrays.stream(ints)).toArray();
        }
    }
```
