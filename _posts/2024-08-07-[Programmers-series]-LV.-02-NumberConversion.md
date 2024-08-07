# 숫자 변환하기
> 
> <pre>
> 문제 설명
> 
> 자연수 x를 y로 변환하려고 합니다. 사용할 수 있는 연산은 다음과 같습니다.
> x에 n을 더합니다
> x에 2를 곱합니다.
> x에 3을 곱합니다.
> 자연수 x, y, n이 매개변수로 주어질 때, x를 y로 변환하기 위해 필요한 최소 연산 횟수를 return하도록 solution 함수를 완성해주세요. 이때 x를 y로 만들 수 없다면 -1을 return 해주세요.
> 제한사항
> 1 ≤ x ≤ y ≤ 1,000,000
> 1 ≤ n < y
> </pre> 


## 알고리즘
순회 -> BFS? DFS?

DFS는 모든 케이스를 다 돌 것이고( 최소 케이스를 찾아야 하기 때문에 ) 분명 느릴 것이다.
BFS가 그나마 빠르겠다. 

막상 작성하면 같은 숫자가 나오는 경우가 중복되서 이마저 타임아웃이 난다.
Set으로 이미 나온 숫자가 나오면 스킵하자 어차피 연산은 3중 하나도 이미 해당 숫자가 있다면 계산이 됐을 것이다.



## 풀이
```java
class NumberConversion {
    @Nested
    class TestCases {
        @Test
        public void case1 () {
            int x = 10;
            int y = 40;
            int n = 5;
            int result = 2;

            Assertions.assertEquals(result, solution(x, y, n));
        }
        @Test
        public void case2 () {
            int x = 10;
            int y = 40;
            int n = 30;
            int result = 1;

            Assertions.assertEquals(result, solution(x, y, n));
        }
        @Test
        public void case3 () {
            int x = 2;
            int y = 5;
            int n = 4;
            int result = -1;

            Assertions.assertEquals(result, solution(x, y, n));
        }
    }
    public int solution(int x, int y, int n){
        Queue<Integer[]> queue = new LinkedList<>();
        Set<Integer> visit = new HashSet<>();
        queue.add(new Integer[]{x, 0});

        while( !queue.isEmpty() ) {
            Integer[] tuple = queue.poll();
            if( tuple[0] == y ) return tuple[1];

            if( !visit.contains(tuple[0] + n) && tuple[0] < y ) {
                int calculated = tuple[0] + n;
                queue.add(new Integer[]{calculated, tuple[1] + 1});
                visit.add(calculated);
            }
            if( !visit.contains(tuple[0] * 2) && tuple[0] < y ) {
                int calculated = tuple[0] * 2;
                queue.add(new Integer[]{calculated, tuple[1] + 1});
                visit.add(calculated);
            }
            if( !visit.contains(tuple[0] * 3) && tuple[0] < y ) {
                int calculated = tuple[0] * 3;
                queue.add(new Integer[]{calculated, tuple[1] + 1});
                visit.add(calculated);
            }

        }

        return -1;
    }
}
```
