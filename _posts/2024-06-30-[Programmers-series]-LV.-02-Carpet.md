---
layout: post
categories: [PROGRAMMERS]
---

# 카펫

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42842)

><pre>
> Leo는 카펫을 사러 갔다가 아래 그림과 같이 중앙에는 노란색으로 칠해져 있고
> 테두리 1줄은 갈색으로 칠해져 있는 격자 모양 카펫을 봤습니다.
> </pre>
 <table style=" border-collapse: collapse;">
     <tr >
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
     </tr>
     <tr>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
     </tr>
     <tr>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
     </tr>
 </table>

> <pre>
> Leo는 집으로 돌아와서 아까 본 카펫의 노란색과 갈색으로 색칠된 격자의 개수는 기억했지만,
> 전체 카펫의 크기는 기억하지 못했습니다.
>
> Leo가 본 카펫에서
> 갈색 격자의 수 brown,
> 노란색 격자의 수 yellow가 매개변수로 주어질 때
> 카펫의 가로, 세로 크기를 순서대로 배열에 담아 return 하도록 solution 함수를 작성해주세요.
>
> 제한사항
>  - 갈색 격자의 수 brown은 8 이상 5,000 이하인 자연수입니다.
>  - 노란색 격자의 수 yellow는 1 이상 2,000,000 이하인 자연수입니다.
>  - 카펫의 가로 길이는 세로 길이와 같거나, 세로 길이보다 깁니다.
> </pre>
>

## 알고리즘


## 풀이

```java
class Carpet {
    @Nested
    class TestCases {


        /**
         * <table style=" border-collapse: collapse;">
         *     <tr >
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         *     <tr>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         *     <tr>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         * </table>
         */
        @Test
        public void case1 () {
            int brown = 10;
            int yellow = 2;
            int[] result = {4,3};
            Assertions.assertArrayEquals(result, solution(brown, yellow));
        }

        /**
         * <table style=" border-collapse: collapse;">
         *     <tr >
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         *     <tr>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         *     <tr>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *         <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *     </tr>
         * </table>
         */
        @Test
        public void case2 () {
            int brown = 8;
            int yellow = 1;
            int[] result = {3,3};
            Assertions.assertArrayEquals(result, solution(brown, yellow));
        }



        /**
         * <table style=" border-collapse: collapse;">
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;  background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px; background-color:yellow;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         *      <tr>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *          <td style="border: green 1px solid; width:20px; height:20px;"> </td>
         *      </tr>
         * </table>
         */
        @Test
        public void case3 () {
            int brown = 24;
            int yellow = 24;
            int[] result = {8,6};
            Assertions.assertArrayEquals(result, solution(brown, yellow));
        }


        @Test
        public void case4 () {
            int brown = 18;
            int yellow = 6;
            int[] result = {8,3};
            Assertions.assertArrayEquals(result, solution(brown, yellow));
        }
    }
    public int[] solution( int brown, int yellow) {

        for( int  height = 1; height <= (yellow / height); height ++ ) {
            if( yellow % height  != 0) continue;

            int yHeight = height;
            int yWidth = yellow / yHeight;
            if((brown - 4) - (yHeight * 2) - (yWidth * 2)  == 0) {
                return new int[]{yWidth + 2, yHeight + 2};
            }
        }


        return new int[] {1, 1};
    }
}
```