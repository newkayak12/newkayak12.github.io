---
layout: post
categories: [PROGRAMMERS]
---


# 쿼드압축 후 개수 세기


> <pre>
> 0과 1로 이루어진 2n x 2n 크기의 2차원 정수 배열 arr이 있습니다.
> 당신은 이 arr을 쿼드 트리와 같은 방식으로 압축하고자 합니다. 구체적인 방식은 다음과 같습니다.
>  <p>
>  1. 당신이 압축하고자 하는 특정 영역을 S라고 정의합니다.
>  2. 만약 S 내부에 있는 모든 수가 같은 값이라면, S를 해당 수 하나로 압축시킵니다.
>  3. 그렇지 않다면, S를 정확히 4개의 균일한 정사각형 영역(입출력 예를 참고해주시기 바랍니다.)으로 쪼갠 뒤,
>  각 정사각형 영역에 대해 같은 방식의 압축을 시도합니다.
>  <p>
>  arr이 매개변수로 주어집니다. 위와 같은 방식으로 arr을 압축했을 때,
>  배열에 최종적으로 남는 0의 개수와 1의 개수를 배열에 담아서 return 하도록 solution 함수를 완성해주세요.
>  <p>
>  제한사항
>  - arr의 행의 개수는 1 이상 1024 이하이며, 2의 거듭 제곱수 형태를 하고 있습니다. 즉, arr의 행의 개수는 1, 2, 4, 8, ..., 1024 중 하나입니다.
>  - arr의 각 행의 길이는 arr의 행의 개수와 같습니다. 즉, arr은 정사각형 배열입니다.
>  - arr의 각 행에 있는 모든 값은 0 또는 1 입니다.
> </pre>

## 아이디어
분할 정복?
여러 알고리즘의 기본이된다. 엄청나고 크고 방대한 문제를 조금씩 나눠가면서 용이하게 풀 수 있는 단위로 나누고 그것을 다시 합쳐서 해결하자는 개념이다.



## 풀이

```java

    @Nested
    class TestCases {
        @Test
        public void case1() {
            int[][] arr = {
                    {1, 1, 0, 0},
                    {1, 0, 0, 0},
                    {1, 0, 0, 1},
                    {1, 1, 1, 1}
            };
            int[] result = {4,9};

            Assertions.assertArrayEquals(result, solution(arr));
        }

        @Test
        public void case2() {
            int[][] arr = {
                    {1, 1, 1, 1, 1, 1, 1, 1},
                    {0, 1, 1, 1, 1, 1, 1, 1},
                    {0, 0, 0, 0, 1, 1, 1, 1},
                    {0, 1, 0, 0, 1, 1, 1, 1},
                    {0, 0, 0, 0, 0, 0, 1, 1},
                    {0, 0, 0, 0, 0, 0, 0, 1},
                    {0, 0, 0, 0, 1, 0, 0, 1},
                    {0, 0, 0, 0, 1, 1, 1, 1}
            };
            int[] result = {10, 15};

            Assertions.assertArrayEquals(result, solution(arr));
        }
    }

    public int[] solution (int [][] arr){
        return quadZip(arr, 0, 0, arr.length, new int[]{0, 0});
    }
    public boolean zippable(int[][] arr, int x, int y, int size) {
        int sum = 0;
        for( int i = 0; i < size; i ++ ) {
            for ( int j = 0; j < size; j ++  ) {
                sum += arr[y + i][x + j];
            }
        }

        return sum == 0 || sum == Math.pow(size, 2);
    }
    public int[] quadZip(int[][] arr, int x, int y, int size, int[] answer) {
        if( this.zippable(arr, x, y, size)){
            if( arr[y][x] == 1) answer[1] += 1;
            else answer[0] += 1;

            return answer;
        }


        answer = quadZip(arr, x, y , size / 2, answer);
        answer = quadZip(arr, x, y + size / 2, size / 2, answer);
        answer = quadZip(arr, x + size / 2, y , size / 2, answer);
        answer = quadZip(arr, x + size / 2, y + size / 2, size / 2, answer);

        return answer;
    }

```