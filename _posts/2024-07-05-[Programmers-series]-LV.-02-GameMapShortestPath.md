---
layout: post
categories: [PROGRAMMERS]
---



# 게임맵 최단거리

> <pre>
> ROR 게임은 두 팀으로 나누어서 진행하며, 상대 팀 진영을 먼저 파괴하면 이기는 게임입니다.
> 따라서, 각 팀은 상대 팀 진영에 최대한 빨리 도착하는 것이 유리합니다.
> 지금부터 당신은 한 팀의 팀원이 되어 게임을 진행하려고 합니다.
> 다음은 5 x 5 크기의 맵에,
> 당신의 캐릭터가 (행: 1, 열: 1) 위치에 있고,
> 상대 팀 진영은 (행: 5, 열: 5) 위치에 있는 경우의 예시입니다.
>
>
> </pre>
 |  O  |  X  |     |     |     |
 |:---:|:---:|:---:|:---:|:---:|
 |     |  X  |     |  X  |     |
 |     |  X  |     |     |     |
 |     |     |     |  X  |     |
 |  X  |  X  |  X  |  X  |  G  |
> 
>
> <pre>
> 위 그림에서 검은색 부분은 벽으로 막혀있어 갈 수 없는 길이며, 흰색 부분은 갈 수 있는 길입니다.
> 캐릭터가 움직일 때는 동, 서, 남, 북 방향으로 한 칸씩 이동하며, 게임 맵을 벗어난 길은 갈 수 없습니다.
> 아래 예시는 캐릭터가 상대 팀 진영으로 가는 두 가지 방법을 나타내고 있습니다.
> 첫 번째 방법은 11개의 칸을 지나서 상대 팀 진영에 도착했습니다.
> 두 번째 방법은 15개의 칸을 지나서 상대팀 진영에 도착했습니다.
>
>
> 만약, 상대 팀이 자신의 팀 진영 주위에 벽을 세워두었다면 상대 팀 진영에 도착하지 못할 수도 있습니다.
>
> 게임 맵의 상태 maps가 매개변수로 주어질 때,
> 캐릭터가 상대 팀 진영에 도착하기 위해서 지나가야 하는 칸의 개수의 최솟값을 return 하도록 solution 함수를 완성해주세요.
> 단, 상대 팀 진영에 도착할 수 없을 때는 -1을 return 해주세요.
>
> 제한사항
>  maps는 n x m 크기의 게임 맵의 상태가 들어있는 2차원 배열로,
>  n과 m은 각각 1 이상 100 이하의 자연수입니다.
>
>  n과 m은 서로 같을 수도,
>  다를 수도 있지만,
>  n과 m이 모두 1인 경우는 입력으로 주어지지 않습니다.
>
>  maps는 0과 1로만 이루어져 있으며,
>  0은 벽이 있는 자리, 1은 벽이 없는 자리를 나타냅니다.
>
>  처음에 캐릭터는 게임 맵의 좌측 상단인 (1, 1) 위치에 있으며,
>  상대방 진영은 게임 맵의 우측 하단인 (n, m) 위치에 있습니다.
> </pre>

## 알고리즘

### BFS
Queue를 이용해서 해당 단계에서 고민할 수 있는 모든 경우를 고려하고 다음 depth로 넘어간다.
이를 통해서 최단거리를 구할 수도 있다.

### 구현

```java
public class Node {
 int data;
 Node lt;
 Node rt;

 public Node(int val) {
  data = val;
 }
}

public class BFS {
 Node root;

 public static void main(String[] args) {
  BFS tree = new BFS();
  tree.root = new Node(0);
  tree.root.lt = new Node(1);
  tree.root.rt = new Node(2);
  tree.root.lt.lt = new Node(3);
  tree.root.lt.rt = new Node(4);
  tree.root.rt.lt = new Node(5);
  tree.root.rt.rt = new Node(6);

  tree.scan(tree.root);
 }

 public void scan(Node element) {
  Queue<Node> queue = new LinkedList<>();
  queue.offer(element);
  int L = 0;


  while (!queue.isEmpty()) {
   int len = queue.size();
   System.out.print(L + " : ");

   for ( int i = 0; i < len; ++i) {
    Node current = queue.poll();
    System.out.print(current.data + " ");
    if(Objects.nonNull(current.lt)) queue.offer(current.lt);
    if(Objects.nonNull(current.rt)) queue.offer(current.rt);
   }

   L ++;
   System.out.println();
  }
 }
}
/**
 * 0 : 0 
 * 1 : 1 2 
 * 2 : 3 4 5 6 
 */
```

## 풀이

```java
class GameMapShortestPath {
    @Nested
    class TestCases {

        @Test
        public void case1() {
            int[][] map = new int[5][5];
            map[0] = {1, 0, 1, 1, 1};
            map[1] = {1, 0, 1, 0, 1};
            map[2] = {1, 0, 1, 1, 1};
            map[3] = {1, 1, 1, 0, 1};
            map[4] = {0, 0, 0, 0, 1};
            int answer = 11;

            Assertions.assertEquals(answer, solution(map));

        }


        @Test
        public void case2() {
            int[][] map = new int[5][5];
            map[0] = {1, 0, 1, 1, 1};
            map[1] = {1, 0, 1, 0, 1};
            map[2] = {1, 0, 1, 1, 1};
            map[3] = {1, 1, 1, 0, 0};
            map[4] = {0, 0, 0, 0, 1};
            int answer = -1;

            Assertions.assertEquals(answer, solution(map));
        }


        @Test
        public void case3() {
            int[][] map = new int[1][2];
            map[0] = {1, 0};
            int answer = -1;

            Assertions.assertEquals(answer, solution(map));
        }
        @Test
        public void case4() { //19번 반례

            int[][] map = new int[2][1];
            map[0] = {1};
            map[1] = {0};
            int answer = -1;

            Assertions.assertEquals(answer, solution(map));
        }
    }

    public int solution(int[][] maps) {
        int answer = -1;
        int[] coordinate = {0, 0, 1};
        boolean[][] visit = new boolean[maps.length][maps[0].length];
        Queue<int[]> queue = new LinkedList<>();

        visit[coordinate[0]][coordinate[1]] = true;
        queue.add(coordinate);

        while( !queue.isEmpty() ) {
            //체크 + queue에 넣기
            int[] coord = queue.poll();


            if(coord[0] == maps.length - 1 && coord[1] == maps[0].length - 1) {
                answer = coord[2];
                break;
            }

            int[] up = {coord[0] - 1, coord[1], coord[2]};
            int[] left = {coord[0], coord[1] - 1, coord[2]};
            int[] right = {coord[0], coord[1] + 1, coord[2]};
            int[] down = {coord[0] + 1, coord[1], coord[2]};

            if(
                    up[0] >= 0 &&
                    !visit[up[0]][up[1]] &&
                    maps[up[0]][up[1]] != 0
            ) {
                up[2] += 1;
                queue.add(up);
                visit[up[0]][up[1]] = true;
            }

            if(
                    left[1] >= 0 &&
                    !visit[left[0]][left[1]] &&
                    maps[left[0]][left[1]] != 0
            ) {
                left[2] += 1;
                queue.add(left);
                visit[left[0]][left[1]] = true;
            }

            if(
                    right[1] < maps[0].length &&
                    !visit[right[0]][right[1]] &&
                    maps[right[0]][right[1]] != 0
            ) {
                right[2] += 1;
                queue.add(right);
                visit[right[0]][right[1]] = true;
            }

            if(
                    down[0] < maps.length &&
                    !visit[down[0]][down[1]] &&
                    maps[down[0]][down[1]] != 0
            ) {
                down[2] += 1;
                queue.add(down);
                visit[down[0]][down[1]] = true;
            }
        }


        return answer;
    }
}
```