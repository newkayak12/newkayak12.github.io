---
layout: post
categories: [PROGRAMMERS]
---


# n^2 배열 자르기

[Programmer](https://school.programmers.co.kr/learn/courses/30/lessons/87390)

>  <pre>
>  정수 n, left, right가 주어집니다. 다음 과정을 거쳐서 1차원 배열을 만들고자 합니다.
> 
>   1. n행 n열 크기의 비어있는 2차원 배열을 만듭니다.
>   2, i = 1, 2, 3, ..., n에 대해서, 다음 과정을 반복합니다.
>        - 1행 1열부터 i행 i열까지의 영역 내의 모든 빈 칸을 숫자 i로 채웁니다.
>   3. 1행, 2행, ..., n행을 잘라내어 모두 이어붙인 새로운 1차원 배열을 만듭니다.
>   4. 새로운 1차원 배열을 arr이라 할 때,
>   arr[left], arr[left+1], ..., arr[right]만 남기고 나머지는 지웁니다.
> 
>  정수 n, left, right가 매개변수로 주어집니다.
>  주어진 과정대로 만들어진 1차원 배열을 return 하도록 solution 함수를 완성해주세요.
> 
>  제한사항
>  - 1 ≤ n ≤ 107
>  - 0 ≤ left ≤ right < n2
>  - right - left < 105
>  </pre>

## 아이디어
n * n 정사각형의 x좌표, y좌표를 구하려면 i ~ n*n 까지 순회하면서 x는  (i % n) y는 (i / n)
좌표별 숫자는 Math.max(x, y) + 1

이 두 개의 아이디면 요구하는 바를 찾을 수 있다.

## 풀이 

````java
class SliceArray {
    @Nested
    class TestCases {
        @Test
        public void case1() {
            int n = 3;
            int left = 2;
            int right = 5;
            int[] result = new int[] { 3, 2, 2, 3 };
            // 1 2 3  / 0
            // 2 2 3  / 4
            // 3 3 3  / 8

            Assertions.assertArrayEquals(result, solution(n, left, right));
        }

        @Test
        public void case2() {
            int n = 4;
            int left = 7;
            int right = 14;
            int[] result = new int[] { 4, 3, 3, 3, 4, 4, 4, 4 };

            Assertions.assertArrayEquals(result, solution(n, left, right));
        }
    }

    public int[] solution(int n, long left, long right) {
        int[] result = new int[(int) (right - left) + 1];
        for (long i = 0; i < result.length ; i ++ ) {
            int x = (int) (i + left) % n;
            int y = (int) (i + left) / n;

            result[(int) i] = Math.max(x, y) + 1;
        }
        return result;
    }

}
````