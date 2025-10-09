---
layout: post
categories: [PROGRAMMERS]
---


# 가장 큰 정사각형 찾기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12905)

> <pre>
> 1와 0로 채워진 표(board)가 있습니다.
> 표 1칸은 1 x 1 의 정사각형으로 이루어져 있습니다.
> 표에서 1로 이루어진 가장 큰 정사각형을 찾아 넓이를 return 하는 solution 함수를 완성해 주세요.
> (단, 정사각형이란 축에 평행한 정사각형을 말합니다.)
> </pre>
> 
> <table>
>     <tr>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">0</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>     </tr>
>     <tr>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>     </tr>
>     <tr>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>     </tr>
>     <tr>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">0</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">0</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">1</td>
>         <td style="width:10px; height:10px; border:1px black solid; background-color:white; text-align:center;">0</td>
>     </tr>
> </table>
> <pre>
>  가장 큰 정사각형은 9가 된다.
> 
> 제한사항
> - 표(board)는 2차원 배열로 주어집니다.
> - 표(board)의 행(row)의 크기 : 1,000 이하의 자연수
> - 표(board)의 열(column)의 크기 : 1,000 이하의 자연수
> - 표(board)의 값은 1또는 0으로만 이루어져 있습니다.
> </pre>

## 알고리즘

### DP(DynamicProgramming)

수학적 최적화 방법이다. 문제를 하위 문제로 분할하면서 복잡한 문제를 단순화 하는 방식을 의미한다.
문제를 하위 문제로 분할시키고 하위 문제에 대한 최적을 해결책을 재귀적으로 찾는 것을 의미한다.

> Q. 분할 정복이랑 비슷하다?
> A. 분할 정복과 문제를 잘게 나누는 것은 같은데 작은 문제가 반복되어 답이 바뀌지 않음을 이용하는 것이
> DP다.

DP는 잘게 나눈 작은 문제의 답이 바뀌지 않기 때문에 메모해 두고 더 큰 문제를 풀어나갈 때 이 메모한 내용을 이용한다.

정리하자면 
1. 작은 문제가 반복된다.
2. 같은 문제는 구할 때마다 같은 답을 낸다.

### Memoization
 
위에서 얘기한 이전에 푼 문제를 기록하는 기법을 의미하며, 이를 이용하면 만났던 문제는 다시 볼 때 계산됐음을
보장하기에 함수 호출 횟수가 감소한다. 값을 계산하고 기록하여 필요할 때 꺼내 쓴다는 관점에서 캐싱이라고도 볼 수 있을 것 같다.

### Top-Down
상위 문제를 해결하기 위해서 하위 문제를 재귀적으로 호출해서 문제를 부는 방식

### Bottom-Up
하위에서부터 문제를 해결하면서 먼저 계산했던 문제들의 값을 활용해서 상위 문제를 해결해나가는 방식

## 풀이

```java
class LargestSquare {
    @Nested
    public class TestCase {
        @Test
        public void case1 () {
            int[][] table = new int[4][4];
            table[0] = {0, 1, 1, 1};
            table[1] = {1, 1, 1, 1};
            table[2] = {1, 1, 1, 1};
            table[3] = {0, 0, 1, 0};
            int result = 9;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case2 () {
            int[][] table = new int[2][4];
            table[0] = {0, 0, 1, 1};
            table[1] = {1, 1, 1, 1};
            int result = 4;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case3 () {
            int[][] table = new int[4][4];
            table[0] = {0, 0, 1, 1};
            table[1] = {1, 1, 1, 1};
            table[2] = {1, 1, 1, 1};
            table[3] = {1, 1, 1, 1};
            int result = 9;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case4 () {
            int[][] table = new int[4][4];
            table[0] = {0, 0, 0, 1};
            table[1] = {1, 1, 1, 1};
            table[2] = {1, 1, 1, 1};
            table[3] = {1, 1, 1, 1};
            int result = 9;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case5 () {
            int[][] table = new int[4][4];
            table[0] = {1, 1, 1, 1};
            table[1] = {1, 1, 1, 1};
            table[2] = {1, 1, 1, 1};
            table[3] = {1, 1, 1, 1};
            int result = 16;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case6 () {
            int[][] table = new int[1][3];
            table[0] = {0, 1, 0};
            int result = 1;

            Assertions.assertEquals(result, solution(table));
        }

        @Test
        public void case7 () {
            int[][] table = new int[1][4];
            table[0] = {0,0,0,0};
            int result = 0;

            Assertions.assertEquals(result, solution(table));
        }
    }


    public int solution(int[][] board) {
//
        int[][] map = new int[board.length][board[0].length];

        int max = 0;
        for( int i = 1; i < map.length; i ++ ) {
            for( int j = 1; j < board[0].length; j++ ) {
                if(board[i][j]!=0) {
                    board[i][j] = Math.min(Math.min(board[i - 1][j], board[i][j - 1]), board[i - 1][j - 1]) + 1;

                    max = Math.max(max, board[i][j]);
                }
            }
        }

        if( max == 0 ) {
            int result = 0;
            for(int i : board[0]) {
                if( i == 1) {
                    result = 1;
                    break;
                }
            }
            return result;
        }
        else return (int) Math.pow(max, 2);
    }

}
```