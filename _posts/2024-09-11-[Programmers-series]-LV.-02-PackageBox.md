---
layout: post
categories: [PROGRAMMERS]
---


# 택배상자

[Programmers](https://school.programmers.co.kr/learn/courses/30/lessons/131704)

> <pre>
> 영재는 택배상자를 트럭에 싣는 일을 합니다.
> 영재가 실어야 하는 택배상자는 크기가 모두 같으며
> 1번 상자부터 n번 상자까지 번호가 증가하는 순서대로 컨테이너 벨트에 일렬로 놓여
> 영재에게 전달됩니다.
> 
> 컨테이너 벨트는 한 방향으로만 진행이 가능해서
> 벨트에 놓인 순서대로(1번 상자부터) 상자를 내릴 수 있습니다.
> 하지만 컨테이너 벨트에 놓인 순서대로 택배상자를 내려 바로 트럭에 싣게 되면
> 택배 기사님이 배달하는 순서와 택배상자가 실려 있는 순서가 맞지 않아 배달에 차질이 생깁니다.
> 따라서 택배 기사님이 미리 알려준 순서에 맞게 영재가 택배상자를 실어야 합니다.
> 
> 만약 컨테이너 벨트의 맨 앞에 놓인 상자가 현재 트럭에 실어야 하는 순서가 아니라면
> 그 상자를 트럭에 실을 순서가 될 때까지 잠시 다른 곳에 보관해야 합니다.
> 하지만 고객의 물건을 함부로 땅에 둘 수 없어 보조 컨테이너 벨트를 추가로 설치하였습니다.
> 보조 컨테이너 벨트는 앞 뒤로 이동이 가능하지만
> 입구 외에 다른 면이 막혀 있어서 맨 앞의 상자만 뺄 수 있습니다
> (즉, 가장 마지막에 보조 컨테이너 벨트에 보관한 상자부터 꺼내게 됩니다).
> 보조 컨테이너 벨트를 이용해도 기사님이 원하는 순서대로 상자를 싣지 못 한다면,
> 더 이상 상자를 싣지 않습니다.
> 
> 예를 들어, 영재가 5개의 상자를 실어야 하며,
> 택배 기사님이 알려준 순서가 기존의 컨테이너 벨트에
> 네 번째, 세 번째, 첫 번째, 두 번째, 다섯 번째 놓인 택배상자 순서인 경우,
> 영재는 우선 첫 번째, 두 번째, 세 번째 상자를 보조 컨테이너 벨트에 보관합니다.
> 그 후 네 번째 상자를 트럭에 싣고 보조 컨테이너 벨트에서 세 번째 상자 빼서 트럭에 싣습니다.
> 다음으로 첫 번째 상자를 실어야 하지만 보조 컨테이너 벨트에서는 두 번째 상자를,
> 기존의 컨테이너 벨트에는 다섯 번째 상자를 꺼낼 수 있기 때문에 더이상의 상자는 실을 수 없습니다.
> 따라서 트럭에는 2개의 상자만 실리게 됩니다.
> 
> 택배 기사님이 원하는 상자 순서를 나타내는 정수 배열 order가 주어졌을 때,
> 영재가 몇 개의 상자를 실을 수 있는지 return 하는 solution 함수를 완성하세요.
> 
> 제한사항
> - 1 ≤ order의 길이 ≤ 1,000,000
> - order는 1이상 order의 길이 이하의 모든 정수가 한번씩 등장합니다.
> - order[i]는 기존의 컨테이너 벨트에 order[i]번째 상자를 i+1번째로 트럭에 실어야 함을 의미합니다.
> </pre>

## 아이디어

흘러들어 오는 부분은 Queue 따로 빼놓는 벨트는 Stack으로 구현



## 풀이

```java
class PackageBox {
    @Nested
    public class TestCases {
        @Test
        public void case1 () {
            int[] order = new int[] {4,3,1,2,5};
            int result = 2;

            Assertions.assertEquals(result, solution(order));
        }

        @Test
        public void case2 () {
            int[] order = new int[] {5, 4, 3, 2, 1};
            int result = 5;

            Assertions.assertEquals(result, solution(order));
        }

        @Test
        public void case3 () {
            int[] order = new int[] {1, 2, 3, 5, 4, 6, 7};
            int result = 7;

            Assertions.assertEquals(result, solution(order));
        }

        @Test
        public void case4 () {
            int[] order = new int[] {1, 7, 3, 5, 4, 6, 2};
            int result = 2;

            Assertions.assertEquals(result, solution(order));
        }


        @Test
        public void case5 () {
            int[] order = new int[] {2, 1, 5, 4, 3, 6, 7};
            int result = 7;

            Assertions.assertEquals(result, solution(order));
        }
    }

    public int solution(int[] order) {

        int count = 0;
        Queue<Integer> queue = new LinkedList<>(Arrays.stream(order).boxed().collect(Collectors.toList()));
        Stack<Integer> stack = new Stack<>();


        for (int i = 1; i <= order.length; i ++ ) {

            if( !queue.isEmpty() && queue.peek() != i ) stack.add(i);
            else {
                queue.poll();
                count += 1;
            }


            while (!stack.isEmpty() && stack.peek() == queue.peek() ) {
                stack.pop();
                queue.poll();
                count += 1;
            }
        }

        return count;
    }

}
```