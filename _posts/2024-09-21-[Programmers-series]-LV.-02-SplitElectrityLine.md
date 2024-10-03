---
layout: post
categories: [PROGRAMMERS]
---

# 전력망을 돌로 나누기

[Prgrammers](https://school.programmers.co.kr/learn/courses/30/lessons/86971)


> <pre>
>  문제 설명
>
> n개의 송전탑이 전선을 통해 하나의 트리 형태로 연결되어 있습니다.
> 당신은 이 전선들 중 하나를 끊어서 현재의 전력망 네트워크를 2개로 분할하려고 합니다.
> 이때, 두 전력망이 갖게 되는 송전탑의 개수를 최대한 비슷하게 맞추고자 합니다.
>
> 송전탑의 개수 n, 그리고 전선 정보 wires가 매개변수로 주어집니다.
> 전선들 중 하나를 끊어서 송전탑 개수가 가능한 비슷하도록 두 전력망으로 나누었을 때,
> 두 전력망이 가지고 있는 송전탑 개수의 차이(절대값)를 return 하도록
> solution 함수를 완성해주세요.
>
> 제한사항
>  - n은 2 이상 100 이하인 자연수입니다.
>  - wires는 길이가 n-1인 정수형 2차원 배열입니다.
>      - wires의 각 원소는 [v1, v2] 2개의 자연수로 이루어져 있으며, 이는 전력망의 v1번 송전탑과 v2번 송전탑이 전선으로 연결되어 있다는 것을 의미합니다.
>      - 1 ≤ v1 < v2 ≤ n 입니다.
>      - 전력망 네트워크가 하나의 트리 형태가 아닌 경우는 입력으로 주어지지 않습니다.
> </pre>


## 아이디어
BFS


## 풀이 

```java
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            int n = 9;
            int[][] wires = {{1, 3}, {2, 3}, {3, 4}, {4, 5}, {4, 6}, {4, 7}, {7, 8}, {7, 9}};
            int result = 3;

            Assertions.assertEquals(result, solution(n, wires));
        }

        @Test
        public void case2() {
            int n = 4;
            int[][] wires = {{1, 2}, {2, 3}, {3, 4}};
            int result = 0;

            Assertions.assertEquals(result, solution(n, wires));
        }

        @Test
        public void case3() {
            int n = 7;
            int[][] wires = {{1, 2}, {2, 7}, {3, 7}, {3, 4}, {4, 5}, {6, 7}};
            int result = 1;

            Assertions.assertEquals(result, solution(n, wires));
        }
    }


    private int search (Map<Integer, List<Integer>> map, boolean[] visit) {
        Queue<Integer> queue = new LinkedList<>();
        queue.add(1);



        int count = 0;
        while( !queue.isEmpty() ) {
           int number = queue.poll();
           if (visit[number - 1]) continue;

           count += 1;
           visit[number - 1] = true;
           queue.addAll(map.get(number));
        }

        return count;
    }

    public int solution(int n, int[][] wires) {
        Map<Integer, List<Integer>> map = new HashMap<>();
        for(int[] element : wires) {
            int start = element[0];
            int end = element[1];


            map.putIfAbsent(start, new LinkedList<>());
            map.putIfAbsent(end, new LinkedList<>());

            map.computeIfPresent(start, (integer, integers) -> {
                integers.add(end);
                return integers;
            });
            map.computeIfPresent(end, (integer, integers) -> {
                integers.add(start);
                return integers;
            });



        }

        int answer = Integer.MAX_VALUE;


        for( int i = 0; i < wires.length; i ++ ) {
            int departure = wires[i][0];
            int destination = wires[i][1];
            map.get(departure).remove(Integer.valueOf(destination));
            map.get(destination).remove(Integer.valueOf(departure));

            int count = search(map, new boolean[n]);
            answer = Math.min(Math.abs(2 * count - n), answer);

            map.get(departure).add(Integer.valueOf(destination));
            map.get(destination).add(Integer.valueOf(departure));
        }


        return answer;
    }

```