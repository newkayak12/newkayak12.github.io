---
layout: post
categories: [PROGRAMMERS]
---


# 카카오 - 크레인 게임

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/64061?language=java)

# 알고리즘

단순 순회와 단순 스택 이용

## 풀이

```java
public class Crane {
    @Nested
    public  class TestCases {
    
        @Test
        public void case1 () {
            int[][] board = {
                    {0, 0, 0, 0, 0},
                    {0, 0, 1, 0, 3},
                    {0, 2, 5, 0, 1},
                    {4, 2, 4, 4, 2},
                    {3, 5, 1, 3, 1}
            };
            int[] moves = {1,5,3,5,1,2,1,4};
            int result = 4;
    
            Assertions.assertEquals(solution(board, moves), result);
    
        }
    }

    public  int solution( int [][] board, int[] moves) {
        int answer = 0;
        Stack<Integer> bucket = new Stack<>();
        for( int move : moves ) {
            for( int i = 0; i  < board.length; i ++ ) {
                int number = board[i][move - 1];
                if( number != 0 ) {
                    board[i][move - 1] = 0;

                    if(!bucket.isEmpty() &&number ==  bucket.peek()) {
                        bucket.pop();
                        answer += 2;
                    } else bucket.add(number); 
                        
                    break;
                }
            }
        }
        return answer;
    }
}
```