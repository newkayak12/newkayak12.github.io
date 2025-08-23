---
layout: post
categories: [PROGRAMMERS]
---


# 땅따먹기

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/12913)

> <pre>
> 땅따먹기 게임을 하려고 합니다. 땅따먹기 게임의 땅(land)은 총 N행 4열로 이루어져 있고,
> 모든 칸에는 점수가 쓰여 있습니다.
> 1행부터 땅을 밟으며 한 행씩 내려올 때,
> 각 행의 4칸 중 한 칸만 밟으면서 내려와야 합니다.
> 단, 땅따먹기 게임에는 한 행씩 내려올 때,
> 같은 열을 연속해서 밟을 수 없는 특수 규칙이 있습니다.
> 
> 예를 들면,
> | 1 | 2 | 3 | 5 |
> | 5 | 6 | 7 | 8 |
> | 4 | 3 | 2 | 1 |
> 
> 로 땅이 주어졌다면, 1행에서 네번째 칸 (5)를 밟았으면,
> 2행의 네번째 칸 (8)은 밟을 수 없습니다.
> 마지막 행까지 모두 내려왔을 때,
> 얻을 수 있는 점수의 최대값을 return하는 solution 함수를 완성해 주세요.
> 위 예의 경우,
> 1행의 네번째 칸 (5),
> 2행의 세번째 칸 (7),
> 3행의 첫번째 칸 (4) 땅을 밟아 16점이 최고점이 되므로 16을 return 하면 됩니다.
> 
> 제한사항
> - 행의 개수 N : 100,000 이하의 자연수
> - 열의 개수는 4개이고, 땅(land)은 2차원 배열로 주어집니다.
> - 점수 : 100 이하의 자연수
> </pre>

## 아이디어
매 번 최선의 선택을 해야 한다. 단, 이전 번호와 겹치지 않아야 한다. 따라서 이전 숫자와 지금 숫자와 
겹치지 않는 경우 내에서 최선의 선택을 매 번 해야 한다.

BFS로 최선의 선택을 해야하는가? -> 이 전의 선택을 따로 기록해야 한다.

기존 Array를 통한 Memoization을 이용하면 어떨까? 예를 들어 2번 째 줄에서 각 셀마다
고를 수 있는 최고 케이스를 잡아서 기록하는 식으로 말이다.


##  풀이

```java
    @Nested
    public class TestCases {
        @Test
        public void case1() {
            int[][] land = new int[3][4];
            
            land[0] = new int[]{1, 2, 3, 5};
            land[1] = new int[]{5, 6, 7, 8};
            land[2] = new int[]{4, 3, 2, 1};
            int answer = 16;

            Assertions.assertEquals(answer, solution(land));
        }
        @Test
        public void case2() {
            int[][] land = new int[3][4];
            land[0] = new int[]{1,2,3,3};
            land[1] = new int[]{5,6,7,8};
            land[2] = new int[]{4,3,2,1};
            int answer = 15;

            Assertions.assertEquals(answer, solution(land));
        }
    }




    public int solution( int[][] land){
        for( int i = 1; i < land.length; i ++ ) {
            int max = -1;
            for( int j = 0; j < 4; j ++ ) {
                if( j != 0 ) max = Math.max(max , land[i - 1][0] + land[i][j]);
                if( j != 1 ) max = Math.max(max , land[i - 1][1] + land[i][j]);
                if( j != 2 ) max = Math.max(max , land[i - 1][2] + land[i][j]);
                if( j != 3 ) max = Math.max(max , land[i - 1][3] + land[i][j]);

                land[i][j] = max;
                max = -1;
            }

        }

        int sum = -1;
        for( int i = 0; i < 4; i ++ ) {
          sum = Math.max(land[land.length - 1][i], sum);
        }

        return sum;
    }
```