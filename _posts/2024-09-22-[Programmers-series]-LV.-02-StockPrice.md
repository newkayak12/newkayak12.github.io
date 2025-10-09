---
layout: post
categories: [PROGRAMMERS]
---


# 주식가격

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/42584)


> <pre>
> 초 단위로 기록된 주식가격이 담긴 배열 prices가 매개변수로 주어질 때,
> 가격이 떨어지지 않은 기간은 몇 초인지를 return 하도록 solution 함수를 완성하세요.
> 
> 제한사항
> - prices의 각 가격은 1 이상 10,000 이하인 자연수입니다.
> - prices의 길이는 2 이상 100,000 이하입니다.
> </pre>

## 아이디어

stack으로 계산을 하고 for 문은 그냥 순회



## 풀이 

```java
class StockPrice {
    @Nested
    public class TestCase {
        @Test
        public void case1 () {
            int[] prices = new int[] {1,2,3,2,3};
            int[] returnValue = new int[] {4,3,1,1,0};


            Assertions.assertArrayEquals(returnValue, solution(prices));
        }

        @Test
        public void case2 () {
            int[] prices = new int[]      {4,1,9,2,3,4,5,6,1};
            int[] returnValue = new int[] {1,7,1,5,4,3,2,1,0};


            Assertions.assertArrayEquals(returnValue, solution(prices));
        }
    }

    public int[] solution(int[] prices) {
        int[] answer = new int[prices.length];
        Stack<Integer> idx = new Stack<>();
        idx.add(0);

        for ( int i = 1; i < prices.length; i ++ ) {
            while(
                    !idx.isEmpty() &&
                            prices[i] < prices[idx.peek()]
            ) {
                int index = idx.pop();
                answer[index] = i - index;
            }

            idx.add(i);
        }


        while( !idx.isEmpty() ) {
            int index = idx.pop();
            answer[index] = prices.length - index - 1;
        }


        return answer;
    }
}
```