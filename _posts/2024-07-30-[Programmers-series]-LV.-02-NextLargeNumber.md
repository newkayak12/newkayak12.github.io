---
layout: post
categories: [PROGRAMMERS]
---

# 뒤에 있는 큰 수 찾기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/154539)

> 
> <pre>
>     정수로 이루어진 배열 numbers가 있습니다.
>     배열 의 각 원소들에 대해 자신보다 뒤에 있는 숫자 중에서 자신보다 크면서
>     가장 가까이 있는 수를 뒷 큰수라고 합니다.
> 
>      정수 배열 numbers가 매개변수로 주어질 때,
>      모든 원소에 대한 뒷 큰수들을 차례로 담은 배열을 return 하도록
>      solution 함수를 완성해주세요.
>      단, 뒷 큰수가 존재하지 않는 원소는 -1을 담습니다.
> 
> 
>      제한사항
> - 4 ≤ numbers의 길이 ≤ 1,000,000
> - 1 ≤ numbers[i] ≤ 1,000,000
> </pre>
>


## 풀이
stack


## 풀이
````java
class NextLargeNumber {
    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            int[] numbers = new int[] {2, 3, 3, 5};
            int[] result = new int[]{3, 5, 5, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }


        @Test
        public void case2 () {
            int[] numbers = new int[] {9, 1, 5, 3, 6, 2};
            int[] result = new int[]{-1, 5, 6, 6, -1, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        public void case3 () {
            int[] numbers = new int[] { 9, 1, 5, 4, 3, 2,  6,  2};
            int[] result = new int[]  {-1, 5, 6, 6, 6, 6, -1, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        public void case4 () {
            int[] numbers = new int[] { 9, 1, 1, 1, 1, 1, 1, 8};
            int[] result = new int[]  {-1, 8, 8, 8, 8, 8, 8, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        public void case5 () {
            int[] numbers = new int[] { 9, 1, 1, 3, 1, 1, 1, 8};
            int[] result = new int[]  {-1, 3, 3, 8, 8, 8, 8, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }

        @Test
        public void case6 () {
            int[] numbers = new int[] { 9, 1, 1, 3, 1, 4, 1, 8};
            int[] result = new int[]  {-1, 3, 3, 4, 4, 8, 8, -1};

            Assertions.assertArrayEquals(result, solution(numbers));
        }
    }


    public int[] solution(int[] numbers) {
        int[] answer = new int[numbers.length];
        Stack<Integer> indexStack = new Stack<>();

        for( int i = 0; i < numbers.length; i ++ ) {

            while(
                    !indexStack.isEmpty() &&
                            numbers[indexStack.peek()] < numbers[i]
            ) {
                int index = indexStack.pop();
                answer[index] = numbers[i];
            }

            indexStack.add(i);
        }

        for ( int i = 0; i < answer.length; i ++ ) {
            if( answer[i] == 0 ) answer[i] = -1;
        }


        return answer;
    }
}
````